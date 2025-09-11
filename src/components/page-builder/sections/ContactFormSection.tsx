import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Save, X } from 'lucide-react';

interface ContactFormSectionProps {
  id: string;
  title?: string;
  fields?: string[];
  isEditable?: boolean;
  onUpdate?: (props: any) => void;
  onDelete?: () => void;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  id,
  title = 'Contact Form',
  fields = ['name', 'email', 'message'],
  isEditable = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title, fields });

  const availableFields = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'subject', label: 'Subject' },
    { id: 'message', label: 'Message' },
  ];

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title, fields });
    setIsEditing(false);
  };

  const toggleField = (fieldId: string, checked: boolean) => {
    if (checked) {
      setEditData({ ...editData, fields: [...editData.fields, fieldId] });
    } else {
      setEditData({ ...editData, fields: editData.fields.filter(f => f !== fieldId) });
    }
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Contact Form</h3>
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
              placeholder="Form title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-3 block">Form Fields</label>
            <div className="space-y-2">
              {availableFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={editData.fields.includes(field.id)}
                    onCheckedChange={(checked) => toggleField(field.id, checked as boolean)}
                  />
                  <label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-muted/50 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
              {title}
            </h2>
          )}
          
          <Card className="p-6">
            <form className="space-y-6">
              {fields.includes('name') && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input placeholder="Your name" />
                </div>
              )}
              
              {fields.includes('email') && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="Your email" />
                </div>
              )}
              
              {fields.includes('phone') && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input type="tel" placeholder="Your phone number" />
                </div>
              )}
              
              {fields.includes('subject') && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="Message subject" />
                </div>
              )}
              
              {fields.includes('message') && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Your message" 
                    rows={5}
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
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