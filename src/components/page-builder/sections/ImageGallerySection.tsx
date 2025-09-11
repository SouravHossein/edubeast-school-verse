import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Edit, Save, X, Plus } from 'lucide-react';

interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

interface ImageGallerySectionProps {
  id: string;
  title?: string;
  images?: GalleryImage[];
  columns?: number;
  isEditable?: boolean;
  onUpdate?: (props: any) => void;
  onDelete?: () => void;
}

export const ImageGallerySection: React.FC<ImageGallerySectionProps> = ({
  id,
  title = 'Gallery',
  images = [],
  columns = 3,
  isEditable = false,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title, images, columns });

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ title, images, columns });
    setIsEditing(false);
  };

  const addImage = () => {
    setEditData({
      ...editData,
      images: [...editData.images, { url: '', alt: '', caption: '' }]
    });
  };

  const removeImage = (index: number) => {
    setEditData({
      ...editData,
      images: editData.images.filter((_, i) => i !== index)
    });
  };

  const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const updatedImages = editData.images.map((img, i) =>
      i === index ? { ...img, [field]: value } : img
    );
    setEditData({ ...editData, images: updatedImages });
  };

  if (isEditing) {
    return (
      <Card className="p-6 space-y-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Image Gallery</h3>
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
              placeholder="Gallery title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Columns</label>
            <Input
              type="number"
              min={1}
              max={6}
              value={editData.columns}
              onChange={(e) => setEditData({ ...editData, columns: parseInt(e.target.value) || 3 })}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Images</label>
              <Button size="sm" onClick={addImage}>
                <Plus className="h-4 w-4 mr-1" />
                Add Image
              </Button>
            </div>
            
            <div className="space-y-3">
              {editData.images.map((image, index) => (
                <Card key={index} className="p-3">
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Image {index + 1}</span>
                      <Button size="sm" variant="destructive" onClick={() => removeImage(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Image URL"
                      value={image.url}
                      onChange={(e) => updateImage(index, 'url', e.target.value)}
                    />
                    <Input
                      placeholder="Alt text"
                      value={image.alt}
                      onChange={(e) => updateImage(index, 'alt', e.target.value)}
                    />
                    <Input
                      placeholder="Caption (optional)"
                      value={image.caption || ''}
                      onChange={(e) => updateImage(index, 'caption', e.target.value)}
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

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-16 bg-background relative">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {title}
          </h2>
        )}
        
        {images.length > 0 && (
          <div className={`grid gap-6 ${gridCols}`}>
            {images.map((image, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {image.caption && (
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {images.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No images in gallery
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