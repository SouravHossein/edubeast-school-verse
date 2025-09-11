import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';

interface CTASectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  isEditable?: boolean;
  onUpdate?: (props: any) => void;
  onDelete?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  id,
  title = 'Take Action',
  subtitle = 'Description',
  button_text = 'Get Started',
  button_link = '#',
  isEditable = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title, subtitle, button_text, button_link });

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title, subtitle, button_text, button_link });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Call to Action</h3>
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
              placeholder="CTA title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <Textarea
              value={editData.subtitle}
              onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
              placeholder="CTA subtitle"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Button Text</label>
            <Input
              value={editData.button_text}
              onChange={(e) => setEditData({ ...editData, button_text: e.target.value })}
              placeholder="Button text"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Button Link</label>
            <Input
              value={editData.button_link}
              onChange={(e) => setEditData({ ...editData, button_link: e.target.value })}
              placeholder="Button link URL"
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white relative">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {title && (
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {title}
            </h2>
          )}
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {button_text && (
            <div className="pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-3 text-lg font-semibold"
                asChild
              >
                <a href={button_link}>{button_text}</a>
              </Button>
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