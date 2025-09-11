import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, X } from 'lucide-react';

interface TextBlockSectionProps {
  id: string;
  title?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  isEditable?: boolean;
  onUpdate?: (props: any) => void;
  onDelete?: () => void;
}

export const TextBlockSection: React.FC<TextBlockSectionProps> = ({
  id,
  title = 'Default Title',
  content = 'Default content',
  alignment = 'left',
  isEditable = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title, content, alignment });

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title, content, alignment });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Text Block</h3>
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
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              placeholder="Section content"
              rows={6}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Alignment</label>
            <Select value={editData.alignment} onValueChange={(value) => setEditData({ ...editData, alignment: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-background relative">
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto text-${alignment}`}>
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
              {title}
            </h2>
          )}
          
          {content && (
            <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
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