
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface InventoryCategory {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  category_type: 'uniforms' | 'lab_equipment' | 'electronics' | 'furniture' | 'stationery' | 'sports_gear' | 'miscellaneous';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: string;
  tenant_id: string;
  category_id?: string;
  asset_id: string;
  name: string;
  description?: string;
  brand_model?: string;
  serial_number?: string;
  item_type: 'consumable' | 'non_consumable';
  condition: 'new' | 'good' | 'fair' | 'damaged' | 'under_repair' | 'disposed';
  purchase_date?: string;
  vendor?: string;
  purchase_cost?: number;
  warranty_expiry?: string;
  location_assigned?: string;
  quantity_in_stock?: number;
  minimum_stock_level?: number;
  image_url?: string;
  documents?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  category?: InventoryCategory;
}

export interface InventoryAssignment {
  id: string;
  tenant_id: string;
  item_id: string;
  assigned_to_type: 'student' | 'teacher' | 'department' | 'room';
  assigned_to_id?: string;
  assigned_to_name?: string;
  assigned_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
  condition_at_issue: 'new' | 'good' | 'fair' | 'damaged' | 'under_repair' | 'disposed';
  condition_at_return?: 'new' | 'good' | 'fair' | 'damaged' | 'under_repair' | 'disposed';
  assigned_by: string;
  returned_by?: string;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  item?: InventoryItem;
}

export interface InventoryTransaction {
  id: string;
  tenant_id: string;
  item_id: string;
  assignment_id?: string;
  transaction_type: 'issue' | 'return' | 'transfer' | 'maintenance' | 'disposal';
  quantity?: number;
  from_user_id?: string;
  to_user_id?: string;
  from_location?: string;
  to_location?: string;
  condition_before?: 'new' | 'good' | 'fair' | 'damaged' | 'under_repair' | 'disposed';
  condition_after?: 'new' | 'good' | 'fair' | 'damaged' | 'under_repair' | 'disposed';
  cost?: number;
  notes?: string;
  processed_by: string;
  transaction_date?: string;
  created_at?: string;
  item?: InventoryItem;
}

export interface MaintenanceSchedule {
  id: string;
  tenant_id: string;
  item_id: string;
  maintenance_type: string;
  scheduled_date: string;
  completed_date?: string;
  service_provider?: string;
  cost?: number;
  next_service_date?: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_by: string;
  completed_by?: string;
  created_at?: string;
  updated_at?: string;
  item?: InventoryItem;
}

export interface InventoryAlert {
  id: string;
  tenant_id: string;
  item_id: string;
  assignment_id?: string;
  alert_type: 'low_stock' | 'overdue_return' | 'warranty_expiry' | 'maintenance_due';
  alert_message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_acknowledged?: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  expires_at?: string;
  created_at?: string;
  item?: InventoryItem;
}

export const useInventory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Categories Query
  const { 
    data: categories = [], 
    isLoading: categoriesLoading,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as InventoryCategory[];
    },
    enabled: !!user,
  });

  // Items Query
  const { 
    data: items = [], 
    isLoading: itemsLoading,
    refetch: refetchItems
  } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select(`
          *,
          category:inventory_categories(*)
        `)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as InventoryItem[];
    },
    enabled: !!user,
  });

  // Assignments Query
  const { 
    data: assignments = [], 
    isLoading: assignmentsLoading,
    refetch: refetchAssignments
  } = useQuery({
    queryKey: ['inventory-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_assignments')
        .select(`
          *,
          item:inventory_items(*)
        `)
        .eq('is_active', true)
        .order('assigned_date', { ascending: false });
      
      if (error) throw error;
      return data as InventoryAssignment[];
    },
    enabled: !!user,
  });

  // Transactions Query
  const { 
    data: transactions = [], 
    isLoading: transactionsLoading,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['inventory-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          item:inventory_items(*)
        `)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as InventoryTransaction[];
    },
    enabled: !!user,
  });

  // Alerts Query
  const { 
    data: alerts = [], 
    isLoading: alertsLoading,
    refetch: refetchAlerts
  } = useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_alerts')
        .select(`
          *,
          item:inventory_items(*)
        `)
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as InventoryAlert[];
    },
    enabled: !!user,
  });

  // Add Category Mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: Omit<InventoryCategory, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('inventory_categories')
        .insert([{ ...categoryData, tenant_id: (user as any)?.tenant_id || '' }])
        .select()
        .single();
      
      if (error) throw error;
      return data as InventoryCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      toast.success('Category added successfully');
    },
    onError: (error) => {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    },
  });

  // Add Item Mutation
  const addItemMutation = useMutation({
    mutationFn: async (itemData: Omit<InventoryItem, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{ ...itemData, tenant_id: (user as any)?.tenant_id || '' }])
        .select()
        .single();
      
      if (error) throw error;
      return data as InventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast.success('Item added successfully');
    },
    onError: (error) => {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    },
  });

  // Issue Item Mutation
  const issueItemMutation = useMutation({
    mutationFn: async (assignmentData: Omit<InventoryAssignment, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('inventory_assignments')
        .insert([{
          ...assignmentData,
          tenant_id: (user as any)?.tenant_id || '',
          assigned_by: user?.id || '',
          assigned_to_type: assignmentData.assigned_to_type || 'student'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as InventoryAssignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast.success('Item issued successfully');
    },
    onError: (error) => {
      console.error('Error issuing item:', error);
      toast.error('Failed to issue item');
    },
  });

  // Return Item Mutation
  const returnItemMutation = useMutation({
    mutationFn: async ({ assignmentId, returnData }: { 
      assignmentId: string; 
      returnData: { 
        actual_return_date: string;
        condition_at_return: 'new' | 'good' | 'fair' | 'damaged' | 'under_repair' | 'disposed';
        notes?: string;
      }
    }) => {
      const { data, error } = await supabase
        .from('inventory_assignments')
        .update({
          ...returnData,
          returned_by: user?.id || '',
          is_active: false,
        })
        .eq('id', assignmentId)
        .select()
        .single();
      
      if (error) throw error;
      return data as InventoryAssignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast.success('Item returned successfully');
    },
    onError: (error) => {
      console.error('Error returning item:', error);
      toast.error('Failed to return item');
    },
  });

  // Acknowledge Alert Mutation
  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { data, error } = await supabase
        .from('inventory_alerts')
        .update({
          is_acknowledged: true,
          acknowledged_by: user?.id || '',
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', alertId)
        .select()
        .single();
      
      if (error) throw error;
      return data as InventoryAlert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-alerts'] });
      toast.success('Alert acknowledged');
    },
    onError: (error) => {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    },
  });

  return {
    // Data
    categories,
    items,
    assignments,
    transactions,
    alerts,
    
    // Loading states
    categoriesLoading,
    itemsLoading,
    assignmentsLoading,
    transactionsLoading,
    alertsLoading,
    
    // Mutations
    addCategory: addCategoryMutation.mutateAsync,
    addItem: addItemMutation.mutateAsync,
    issueItem: issueItemMutation.mutateAsync,
    returnItem: (assignmentId: string, returnData: any) => 
      returnItemMutation.mutateAsync({ assignmentId, returnData }),
    acknowledgeAlert: acknowledgeAlertMutation.mutateAsync,
    
    // Refetch functions
    refetchCategories,
    refetchItems,
    refetchAssignments,
    refetchTransactions,
    refetchAlerts,
  };
};
