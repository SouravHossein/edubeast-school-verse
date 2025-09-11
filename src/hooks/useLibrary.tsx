import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface Book {
  id: string;
  tenant_id: string;
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  publisher?: string;
  publication_year?: number;
  edition?: string;
  language?: string;
  pages?: number;
  cover_image?: string;
  description?: string;
  category: string;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BookCopy {
  id: string;
  book_id: string;
  copy_number: string;
  barcode?: string;
  rfid_tag?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  shelf_location?: string;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance' | 'lost';
  acquisition_date?: string;
  price?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LibraryTransaction {
  id: string;
  tenant_id: string;
  book_copy_id: string;
  user_id: string;
  transaction_type: 'borrow' | 'return' | 'renew' | 'reserve';
  borrow_date?: string;
  due_date?: string;
  return_date?: string;
  fine_amount?: number;
  fine_paid?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LibrarySettings {
  id?: string;
  tenant_id: string;
  student_borrow_limit?: number;
  teacher_borrow_limit?: number;
  student_borrow_days?: number;
  teacher_borrow_days?: number;
  fine_per_day?: number;
  max_renewals?: number;
  damage_fine?: number;
  loss_fine?: number;
  overdue_reminder_days?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LibraryReservation {
  id: string;
  tenant_id: string;
  book_id: string;
  user_id: string;
  reservation_date: string;
  expiry_date: string;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  notified?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UseLibraryResult {
  // Books
  books: Book[];
  booksLoading: boolean;
  addBook: (book: Omit<Book, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => Promise<Book>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  
  // Book Copies
  bookCopies: BookCopy[];
  copiesLoading: boolean;
  addBookCopy: (copy: Omit<BookCopy, 'id' | 'created_at' | 'updated_at'>) => Promise<BookCopy>;
  updateBookCopy: (id: string, updates: Partial<BookCopy>) => Promise<BookCopy>;
  deleteBookCopy: (id: string) => Promise<void>;
  
  // Transactions
  transactions: LibraryTransaction[];
  transactionsLoading: boolean;
  borrowBook: (copyId: string, userId: string, dueDate: string) => Promise<LibraryTransaction>;
  returnBook: (transactionId: string, returnDate: string, fineAmount?: number) => Promise<LibraryTransaction>;
  renewBook: (transactionId: string, newDueDate: string) => Promise<LibraryTransaction>;
  
  // Settings
  settings: LibrarySettings | null;
  settingsLoading: boolean;
  updateSettings: (settings: Partial<LibrarySettings>) => Promise<LibrarySettings>;
  
  // Reservations
  reservations: LibraryReservation[];
  reservationsLoading: boolean;
  createReservation: (bookId: string, userId: string) => Promise<LibraryReservation>;
  cancelReservation: (id: string) => Promise<void>;
  
  // Utility functions
  refetchBooks: () => void;
  refetchCopies: () => void;
  refetchTransactions: () => void;
}

export const useLibrary = (): UseLibraryResult => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Books Query
  const { 
    data: books = [], 
    isLoading: booksLoading,
    refetch: refetchBooks
  } = useQuery({
    queryKey: ['library-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .order('title');
      
      if (error) throw error;
      return data as Book[];
    },
    enabled: !!user,
  });

  // Book Copies Query
  const { 
    data: bookCopies = [], 
    isLoading: copiesLoading,
    refetch: refetchCopies
  } = useQuery({
    queryKey: ['library-book-copies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('book_copies')
        .select('*')
        .order('copy_number');
      
      if (error) throw error;
      return data as BookCopy[];
    },
    enabled: !!user,
  });

  // Transactions Query - Fixed table name
  const { 
    data: transactions = [], 
    isLoading: transactionsLoading,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['library-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('borrow_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });

  // Settings Query
  const { 
    data: settings = null, 
    isLoading: settingsLoading 
  } = useQuery({
    queryKey: ['library-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('library_settings')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data as LibrarySettings | null;
    },
    enabled: !!user,
  });

  // Reservations Query
  const { 
    data: reservations = [], 
    isLoading: reservationsLoading 
  } = useQuery({
    queryKey: ['library-reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('library_reservations')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LibraryReservation[];
    },
    enabled: !!user,
  });

  // Add Book Mutation - Fixed bulk insert
  const addBookMutation = useMutation({
    mutationFn: async (bookData: Omit<Book, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('books')
        .insert([{ ...bookData, tenant_id: (user as any)?.tenant_id || '' }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-books'] });
      toast.success('Book added successfully');
    },
    onError: (error) => {
      console.error('Error adding book:', error);
      toast.error('Failed to add book');
    },
  });

  // Bulk Add Books Mutation - Fixed implementation
  const bulkAddBooksMutation = useMutation({
    mutationFn: async (booksData: Omit<Book, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>[]) => {
      const booksWithTenant = booksData.map(book => ({
        ...book,
        tenant_id: (user as any)?.tenant_id || '',
      }));

      const { data, error } = await supabase
        .from('books')
        .insert(booksWithTenant)
        .select();
      
      if (error) throw error;
      return data as Book[];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['library-books'] });
      toast.success(`${data.length} books added successfully`);
    },
    onError: (error) => {
      console.error('Error adding books:', error);
      toast.error('Failed to add books');
    },
  });

  // Update Book Mutation
  const updateBookMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Book> }) => {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Book;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-books'] });
      toast.success('Book updated successfully');
    },
    onError: (error) => {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
    },
  });

  // Delete Book Mutation
  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('books')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-books'] });
      toast.success('Book deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book');
    },
  });

  // Add Book Copy Mutation
  const addBookCopyMutation = useMutation({
    mutationFn: async (copyData: Omit<BookCopy, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('book_copies')
        .insert([copyData])
        .select()
        .single();
      
      if (error) throw error;
      return data as BookCopy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-book-copies'] });
      toast.success('Book copy added successfully');
    },
    onError: (error) => {
      console.error('Error adding book copy:', error);
      toast.error('Failed to add book copy');
    },
  });

  // Update Book Copy Mutation
  const updateBookCopyMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BookCopy> }) => {
      const { data, error } = await supabase
        .from('book_copies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as BookCopy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-book-copies'] });
      toast.success('Book copy updated successfully');
    },
    onError: (error) => {
      console.error('Error updating book copy:', error);
      toast.error('Failed to update book copy');
    },
  });

  // Delete Book Copy Mutation
  const deleteBookCopyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('book_copies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-book-copies'] });
      toast.success('Book copy deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting book copy:', error);
      toast.error('Failed to delete book copy');
    },
  });

  // Update Settings Mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: Partial<LibrarySettings>) => {
      // Ensure tenant_id is provided
      const dataWithTenantId = {
        ...settingsData,
        tenant_id: settingsData.tenant_id || user?.tenant_id || '',
      };

      const { data, error } = await supabase
        .from('library_settings')
        .upsert([dataWithTenantId])
        .select()
        .single();
      
      if (error) throw error;
      return data as LibrarySettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    },
  });

  // Borrow Book Mutation
  const borrowBookMutation = useMutation({
    mutationFn: async ({ copyId, userId, dueDate }: { copyId: string; userId: string; dueDate: string }) => {
      // First, update the book copy status
      await supabase
        .from('book_copies')
        .update({ status: 'borrowed' })
        .eq('id', copyId);

      // Then create the transaction
      const { data, error } = await supabase
        .from('borrow_transactions')
        .insert([{
          copy_id: copyId,
          borrower_id: userId,
          issued_by: user?.id || '',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: dueDate,
          tenant_id: (user as any)?.tenant_id || '',
          status: 'borrowed'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['library-book-copies'] });
      toast.success('Book borrowed successfully');
    },
    onError: (error) => {
      console.error('Error borrowing book:', error);
      toast.error('Failed to borrow book');
    },
  });

  // Return Book Mutation
  const returnBookMutation = useMutation({
    mutationFn: async ({ transactionId, returnDate, fineAmount }: { transactionId: string; returnDate: string; fineAmount?: number }) => {
      const { data, error } = await supabase
      .from('borrow_transactions')
        .update({
          return_date: returnDate,
          fine_amount: fineAmount || 0,
          fine_paid: fineAmount ? false : true,
        })
        .eq('id', transactionId)
        .select()
        .single();
      
      if (error) throw error;

      // Update book copy status back to available
      const transaction = data as LibraryTransaction;
      await supabase
        .from('book_copies')
        .update({ status: 'available' })
        .eq('id', transaction.book_copy_id);

      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['library-book-copies'] });
      toast.success('Book returned successfully');
    },
    onError: (error) => {
      console.error('Error returning book:', error);
      toast.error('Failed to return book');
    },
  });

  // Renew Book Mutation
  const renewBookMutation = useMutation({
    mutationFn: async ({ transactionId, newDueDate }: { transactionId: string; newDueDate: string }) => {
      const { data, error } = await supabase
        .from('borrow_transactions')
        .update({ due_date: newDueDate })
        .eq('id', transactionId)
        .select()
        .single();
      
      if (error) throw error;
      return data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-transactions'] });
      toast.success('Book renewed successfully');
    },
    onError: (error) => {
      console.error('Error renewing book:', error);
      toast.error('Failed to renew book');
    },
  });

  // Create Reservation Mutation
  const createReservationMutation = useMutation({
    mutationFn: async ({ bookId, userId }: { bookId: string; userId: string }) => {
      const reservationDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry

      const { data, error } = await supabase
        .from('library_reservations')
        .insert([{
          tenant_id: (user as any)?.tenant_id || '',
          book_id: bookId,
          user_id: userId,
          reservation_date: reservationDate.toISOString(),
          expiry_date: expiryDate.toISOString(),
          status: 'active',
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as LibraryReservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-reservations'] });
      toast.success('Book reserved successfully');
    },
    onError: (error) => {
      console.error('Error creating reservation:', error);
      toast.error('Failed to reserve book');
    },
  });

  // Cancel Reservation Mutation
  const cancelReservationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('library_reservations')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-reservations'] });
      toast.success('Reservation cancelled successfully');
    },
    onError: (error) => {
      console.error('Error cancelling reservation:', error);
      toast.error('Failed to cancel reservation');
    },
  });

  return {
    // Books
    books,
    booksLoading,
    addBook: addBookMutation.mutateAsync,
    bulkAddBooks: bulkAddBooksMutation.mutateAsync,
    updateBook: (id: string, updates: Partial<Book>) => updateBookMutation.mutateAsync({ id, updates }),
    deleteBook: deleteBookMutation.mutateAsync,
    
    // Book Copies
    bookCopies,
    copiesLoading,
    addBookCopy: addBookCopyMutation.mutateAsync,
    updateBookCopy: (id: string, updates: Partial<BookCopy>) => updateBookCopyMutation.mutateAsync({ id, updates }),
    deleteBookCopy: deleteBookCopyMutation.mutateAsync,
    
    // Transactions
    transactions,
    transactionsLoading,
    borrowBook: (copyId: string, userId: string, dueDate: string) => borrowBookMutation.mutateAsync({ copyId, userId, dueDate }),
    returnBook: (transactionId: string, returnDate: string, fineAmount?: number) => returnBookMutation.mutateAsync({ transactionId, returnDate, fineAmount }),
    renewBook: (transactionId: string, newDueDate: string) => renewBookMutation.mutateAsync({ transactionId, newDueDate }),
    
    // Settings
    settings,
    settingsLoading,
    updateSettings: updateSettingsMutation.mutateAsync,
    
    // Reservations
    reservations,
    reservationsLoading,
    createReservation: (bookId: string, userId: string) => createReservationMutation.mutateAsync({ bookId, userId }),
    cancelReservation: cancelReservationMutation.mutateAsync,
    
    // Utility functions
    refetchBooks,
    refetchCopies,
    refetchTransactions,
  };
};
