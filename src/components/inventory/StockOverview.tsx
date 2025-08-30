
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingDown, TrendingUp } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';

export const StockOverview = () => {
  const { items, itemsLoading } = useInventory();

  if (itemsLoading) {
    return <div>Loading stock overview...</div>;
  }

  const consumableItems = items.filter(item => item.item_type === 'consumable');
  
  const stockData = consumableItems.map(item => {
    const currentStock = item.quantity_in_stock || 0;
    const minStock = item.minimum_stock_level || 0;
    const stockPercentage = minStock > 0 ? (currentStock / minStock) * 100 : 100;
    
    return {
      ...item,
      stockPercentage: Math.min(stockPercentage, 100),
      isLowStock: currentStock <= minStock,
      isOutOfStock: currentStock === 0,
    };
  }).sort((a, b) => a.stockPercentage - b.stockPercentage);

  const lowStockCount = stockData.filter(item => item.isLowStock && !item.isOutOfStock).length;
  const outOfStockCount = stockData.filter(item => item.isOutOfStock).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Stock Overview
        </CardTitle>
        <CardDescription>
          Consumable items stock levels and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stock Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </div>

          {/* Top Items Needing Attention */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Items Needing Attention</h4>
            {stockData.slice(0, 5).map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.isOutOfStock && (
                      <Badge variant="destructive" className="text-xs">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        OUT
                      </Badge>
                    )}
                    {item.isLowStock && !item.isOutOfStock && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        LOW
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.quantity_in_stock} / {item.minimum_stock_level}
                  </span>
                </div>
                <Progress 
                  value={item.stockPercentage} 
                  className="h-2"
                />
              </div>
            ))}
          </div>

          {stockData.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <p>No consumable items found</p>
              <p className="text-sm">Add some consumable items to track stock levels</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
