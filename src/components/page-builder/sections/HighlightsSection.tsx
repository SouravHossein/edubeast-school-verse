import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit, Save, X, Plus, Star, Award, Users, BookOpen } from 'lucide-react';

interface HighlightItem {
  title: string;
  description: string;
  icon?: string;
}

interface HighlightsSectionProps {
  id: string;
  title?: string;
  items?: HighlightItem[];
  isEditable?: boolean;
  onUpdate?: (props: any) => void;
  onDelete?: () => void;
}

export const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  id,
  title = 'Features',
  items = [],
  isEditable = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title, items });

  const iconMap = {
    star: Star,
    award: Award,
    users: Users,
    book: BookOpen,
  };

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title, items });
    setIsEditing(false);
  };

  const addItem = () => {
    setEditData({
      ...editData,
      items: [...editData.items, { title: '', description: '', icon: 'star' }]
    });
  };

  const removeItem = (index: number) => {
    setEditData({
      ...editData,
      items: editData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: keyof HighlightItem, value: string) => {
    const updatedItems = editData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setEditData({ ...editData, items: updatedItems });
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Highlights</h3>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Section title"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Highlight Items</label>
              <Button size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              {editData.items.map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Item {index + 1}</span>
                      <Button size="sm" variant="destructive" onClick={() => removeItem(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                    />
                    <Textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-background relative">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {title}
          </h2>
        )}
        
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Star;
              
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-primary/10">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
        
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No highlights configured
          </div>
        )}
      </div>
      
      {/* Edit Controls */}
      {isEditable && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </section>
  );
};