
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, Edit, Trash2 } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { ItemForm } from './ItemForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const InventoryItems = () => {
  const { items, itemsLoading, categories } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.asset_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'damaged': return 'destructive';
      case 'under_repair': return 'secondary';
      case 'disposed': return 'destructive';
      default: return 'outline';
    }
  };

  if (itemsLoading) {
    return <div className="p-6">Loading inventory items...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Items</h2>
          <p className="text-muted-foreground">Manage all school assets and consumables</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <ItemForm onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items by name or asset ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>Asset ID: {item.asset_id}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant={getConditionColor(item.condition)}>
                    {item.condition.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {item.item_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {item.brand_model && (
                    <div>
                      <span className="text-muted-foreground">Brand:</span>
                      <p className="font-medium">{item.brand_model}</p>
                    </div>
                  )}
                  {item.location_assigned && (
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">{item.location_assigned}</p>
                    </div>
                  )}
                </div>

                {item.item_type === 'consumable' && (
                  <div className="p-2 bg-muted rounded">
                    <div className="flex justify-between text-sm">
                      <span>Stock:</span>
                      <span className={
                        (item.quantity_in_stock || 0) <= (item.minimum_stock_level || 0)
                          ? 'text-red-600 font-medium'
                          : 'text-green-600 font-medium'
                      }>
                        {item.quantity_in_stock} / {item.minimum_stock_level} min
                      </span>
                    </div>
                  </div>
                )}

                {item.purchase_cost && (
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Value: </span>
                    <span className="font-medium">৳{item.purchase_cost.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first inventory item'
            }
          </p>
          {!searchTerm && !selectedCategory && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
