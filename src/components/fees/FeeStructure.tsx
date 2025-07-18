
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Percent, Gift, Calendar } from 'lucide-react';

interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  type: 'mandatory' | 'optional';
  frequency: 'monthly' | 'quarterly' | 'yearly';
  description: string;
}

interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  eligibility: string;
  active: boolean;
}

export const FeeStructure = () => {
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([
    {
      id: '1',
      name: 'Tuition Fee',
      amount: 5000,
      type: 'mandatory',
      frequency: 'monthly',
      description: 'Monthly tuition fee for academic instruction'
    },
    {
      id: '2',
      name: 'Transport Fee',
      amount: 1500,
      type: 'optional',
      frequency: 'monthly',
      description: 'Monthly transportation service fee'
    },
    {
      id: '3',
      name: 'Library Fee',
      amount: 2000,
      type: 'mandatory',
      frequency: 'yearly',
      description: 'Annual library maintenance and book fee'
    }
  ]);

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: '1',
      name: 'Merit Scholarship',
      type: 'percentage',
      value: 20,
      eligibility: 'Top 10% students',
      active: true
    },
    {
      id: '2',
      name: 'Sibling Discount',
      type: 'percentage',
      value: 15,
      eligibility: 'Multiple children in school',
      active: true
    }
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<FeeCategory>>({});
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({});

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.amount) {
      const category: FeeCategory = {
        id: Date.now().toString(),
        name: newCategory.name,
        amount: newCategory.amount,
        type: newCategory.type || 'mandatory',
        frequency: newCategory.frequency || 'monthly',
        description: newCategory.description || ''
      };
      setFeeCategories([...feeCategories, category]);
      setNewCategory({});
      setShowAddCategory(false);
    }
  };

  const handleAddDiscount = () => {
    if (newDiscount.name && newDiscount.value) {
      const discount: Discount = {
        id: Date.now().toString(),
        name: newDiscount.name,
        type: newDiscount.type || 'percentage',
        value: newDiscount.value,
        eligibility: newDiscount.eligibility || '',
        active: newDiscount.active !== false
      };
      setDiscounts([...discounts, discount]);
      setNewDiscount({});
      setShowAddDiscount(false);
    }
  };

  const deleteCategory = (id: string) => {
    setFeeCategories(feeCategories.filter(cat => cat.id !== id));
  };

  const deleteDiscount = (id: string) => {
    setDiscounts(discounts.filter(disc => disc.id !== id));
  };

  const toggleDiscount = (id: string) => {
    setDiscounts(discounts.map(disc => 
      disc.id === id ? { ...disc, active: !disc.active } : disc
    ));
  };

  return (
    <div className="space-y-6">
      {/* Fee Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fee Categories</CardTitle>
              <CardDescription>
                Manage different types of fees and their amounts
              </CardDescription>
            </div>
            <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Fee Category</DialogTitle>
                  <DialogDescription>
                    Create a new fee category for students
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategory.name || ''}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="e.g., Tuition Fee"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category-amount">Amount (₹)</Label>
                    <Input
                      id="category-amount"
                      type="number"
                      value={newCategory.amount || ''}
                      onChange={(e) => setNewCategory({...newCategory, amount: parseFloat(e.target.value)})}
                      placeholder="5000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category-type">Type</Label>
                    <Select onValueChange={(value) => setNewCategory({...newCategory, type: value as 'mandatory' | 'optional'})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mandatory">Mandatory</SelectItem>
                        <SelectItem value="optional">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category-frequency">Frequency</Label>
                    <Select onValueChange={(value) => setNewCategory({...newCategory, frequency: value as 'monthly' | 'quarterly' | 'yearly'})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category-description">Description</Label>
                    <Input
                      id="category-description"
                      value={newCategory.description || ''}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      placeholder="Brief description of the fee"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>₹{category.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={category.type === 'mandatory' ? 'destructive' : 'secondary'}>
                      {category.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {category.frequency}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Discounts & Scholarships */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discounts & Scholarships</CardTitle>
              <CardDescription>
                Manage fee discounts and scholarship programs
              </CardDescription>
            </div>
            <Dialog open={showAddDiscount} onOpenChange={setShowAddDiscount}>
              <DialogTrigger asChild>
                <Button>
                  <Gift className="h-4 w-4 mr-2" />
                  Add Discount
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Discount/Scholarship</DialogTitle>
                  <DialogDescription>
                    Create a new discount or scholarship program
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discount-name">Name</Label>
                    <Input
                      id="discount-name"
                      value={newDiscount.name || ''}
                      onChange={(e) => setNewDiscount({...newDiscount, name: e.target.value})}
                      placeholder="e.g., Merit Scholarship"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discount-type">Type</Label>
                    <Select onValueChange={(value) => setNewDiscount({...newDiscount, type: value as 'percentage' | 'fixed'})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discount-value">Value</Label>
                    <Input
                      id="discount-value"
                      type="number"
                      value={newDiscount.value || ''}
                      onChange={(e) => setNewDiscount({...newDiscount, value: parseFloat(e.target.value)})}
                      placeholder={newDiscount.type === 'percentage' ? '20' : '1000'}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discount-eligibility">Eligibility</Label>
                    <Input
                      id="discount-eligibility"
                      value={newDiscount.eligibility || ''}
                      onChange={(e) => setNewDiscount({...newDiscount, eligibility: e.target.value})}
                      placeholder="e.g., Top 10% students"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="discount-active"
                      checked={newDiscount.active !== false}
                      onCheckedChange={(checked) => setNewDiscount({...newDiscount, active: checked})}
                    />
                    <Label htmlFor="discount-active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDiscount(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDiscount}>Add Discount</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">{discount.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {discount.type === 'percentage' ? <Percent className="h-3 w-3 mr-1" /> : '₹'}
                      {discount.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                  </TableCell>
                  <TableCell>{discount.eligibility}</TableCell>
                  <TableCell>
                    <Badge variant={discount.active ? 'default' : 'secondary'}>
                      {discount.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={discount.active}
                        onCheckedChange={() => toggleDiscount(discount.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteDiscount(discount.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
