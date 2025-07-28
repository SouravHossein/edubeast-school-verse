import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Send, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  featured_image?: string;
  is_featured: boolean;
  reading_time: number;
  tags: string[];
}

interface BlogEditorProps {
  initialData?: Partial<BlogPost>;
  onSave?: (data: BlogPost) => void;
  onPublish?: (data: BlogPost) => void;
  onSchedule?: (data: BlogPost, scheduledDate: Date) => void;
  mode?: 'create' | 'edit';
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  mode = 'create'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState<BlogPost>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category_id: initialData?.category_id || '',
    featured_image: initialData?.featured_image || '',
    is_featured: initialData?.is_featured || false,
    reading_time: initialData?.reading_time || 5,
    tags: initialData?.tags || [],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.featured_image || null);
  
  const { toast } = useToast();

  const categories = [
    { id: '1', name: 'Academics' },
    { id: '2', name: 'Sports' },
    { id: '3', name: 'Events' },
    { id: '4', name: 'Announcements' }
  ];

  const updateField = (field: keyof BlogPost, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title' && mode === 'create') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Auto-calculate reading time from content
    if (field === 'content') {
      const wordsPerMinute = 200;
      const words = value.trim().split(/\s+/).length;
      const readingTime = Math.ceil(words / wordsPerMinute);
      setFormData(prev => ({ ...prev, reading_time: readingTime }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateField('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        updateField('featured_image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = () => {
    console.log('Form submitted:', formData);
    toast({
      title: "Success",
      description: "Blog post saved successfully!",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onSubmit} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={onSubmit} disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>Create your blog post content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="post-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  placeholder="Brief description of your post"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  placeholder="Write your blog post content here..."
                  rows={15}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
              <CardDescription>Configure your post settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => updateField('category_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image</Label>
                <Input
                  id="featured_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Featured image preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => updateField('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Featured Post</Label>
              </div>

              <div className="space-y-2">
                <Label>Reading Time</Label>
                <p className="text-sm text-muted-foreground">
                  Estimated reading time: {formData.reading_time} minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};