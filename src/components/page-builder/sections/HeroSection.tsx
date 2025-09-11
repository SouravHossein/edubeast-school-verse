import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';

interface HeroSectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  image?: string;
  buttons?: Array<{ text: string; link: string; variant?: 'default' | 'outline' }>;
  isEditable?: boolean;
  onUpdate?: (props: any) => void;
  onDelete?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  id,
  title = 'Welcome to Our School',
  subtitle = 'Excellence in Education',
  image = '/hero-image.jpg',
  buttons = [],
  isEditable = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title, subtitle, image, buttons });

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title, subtitle, image, buttons });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Hero Section</h3>
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
              placeholder="Hero title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <Textarea
              value={editData.subtitle}
              onChange={(e) => setEditData({ ...editData, subtitle: e.target.value })}
              placeholder="Hero subtitle"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Background Image URL</label>
            <Input
              value={editData.image}
              onChange={(e) => setEditData({ ...editData, image: e.target.value })}
              placeholder="Image URL"
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/90 to-primary-foreground/90 text-white overflow-hidden">
      {/* Background Image */}
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        
        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || 'default'}
                size="lg"
                className="px-8 py-3 text-lg"
                asChild
              >
                <a href={button.link}>{button.text}</a>
              </Button>
            ))}
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