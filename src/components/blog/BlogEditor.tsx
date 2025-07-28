
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, Send, Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be under 200 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be under 500 characters'),
  content: z.string().min(1, 'Content is required'),
  category_id: z.string().min(1, 'Category is required'),
  featured_image: z.string().optional(),
  is_featured: z.boolean().default(false),
  reading_time: z.number().min(1).default(5),
  tags: z.array(z.string()).default([]),
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

interface BlogEditorProps {
  initialData?: Partial<BlogPostForm>;
  onSave?: (data: BlogPostForm) => void;
  onPublish?: (data: BlogPostForm) => void;
  onSchedule?: (data: BlogPostForm, scheduledDate: Date) => void;
  mode?: 'create' | 'edit';
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSave,
  onPublish,
  onSchedule,
  mode = 'create'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.featured_image || null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      category_id: initialData?.category_id || '',
      featured_image: initialData?.featured_image || '',
      is_featured: initialData?.is_featured || false,
      reading_time: initialData?.reading_time || 5,
      tags: initialData?.tags || [],
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const watchedTitle = watch('title');

  // Auto-generate slug from title
  React.useEffect(() => {
    if (watchedTitle && mode === 'create') {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedTitle, mode, setValue]);

  // Load categories and tags on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          supabase.from('blog_categories').select('*'),
          supabase.from('blog_tags').select('*')
        ]);

        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (tagsRes.data) setTags(tagsRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      setSelectedTags(updatedTags);
      setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setValue('tags', updatedTags);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setValue('featured_image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  React.useEffect(() => {
    const content = watch('content');
    if (content) {
      const readingTime = estimateReadingTime(content);
      setValue('reading_time', readingTime);
    }
  }, [watch('content'), setValue]);

  const handleSave: SubmitHandler<BlogPostForm> = async (data) => {
    setIsLoading(true);
    try {
      if (onSave) {
        await onSave(data);
      }
      toast({
        title: "Draft Saved",
        description: "Your blog post has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the blog post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish: SubmitHandler<BlogPostForm> = async (data) => {
    setIsLoading(true);
    try {
      if (onPublish) {
        await onPublish(data);
      }
      toast({
        title: "Published",
        description: "Your blog post has been published successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish the blog post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule: SubmitHandler<BlogPostForm> = async (data) => {
    setIsLoading(true);
    try {
      if (onSchedule) {
        const scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
        await onSchedule(data, scheduledDate);
      }
      toast({
        title: "Scheduled",
        description: "Your blog post has been scheduled for publication.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule the blog post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSubmit(handleSave)} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="outline" onClick={handleSubmit(handleSchedule)} disabled={isLoading}>
            <Send className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button onClick={handleSubmit(handlePublish)} disabled={isLoading}>
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
                  {...register('title')}
                  placeholder="Enter post title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="post-slug"
                  className={errors.slug ? 'border-red-500' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  {...register('excerpt')}
                  placeholder="Brief description of your post"
                  rows={3}
                  className={errors.excerpt ? 'border-red-500' : ''}
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-500">{errors.excerpt.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  {...register('content')}
                  placeholder="Write your blog post content here..."
                  rows={15}
                  className={errors.content ? 'border-red-500' : ''}
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
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
                <Select onValueChange={(value) => setValue('category_id', value)}>
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
                {errors.category_id && (
                  <p className="text-sm text-red-500">{errors.category_id.message}</p>
                )}
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
                  {selectedTags.map((tag) => (
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
                  checked={watch('is_featured')}
                  onCheckedChange={(checked) => setValue('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Featured Post</Label>
              </div>

              <div className="space-y-2">
                <Label>Reading Time</Label>
                <p className="text-sm text-muted-foreground">
                  Estimated reading time: {watch('reading_time')} minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
