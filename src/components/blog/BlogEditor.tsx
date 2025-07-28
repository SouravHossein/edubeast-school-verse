
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Upload, X, Save, Send, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().max(500, 'Excerpt is too long'),
  content: z.string().min(1, 'Content is required'),
  category_id: z.string().min(1, 'Category is required'),
  featured_image: z.string().optional(),
  is_featured: z.boolean().default(false),
  reading_time: z.number().min(1).default(5),
  tags: z.array(z.string()).default([]),
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

interface BlogEditorProps {
  postId?: string;
  onSave?: (postId: string) => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ postId, onSave }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category_id: '',
      featured_image: '',
      is_featured: false,
      reading_time: 5,
      tags: [],
    },
  });

  // Fetch existing post for editing
  const { data: existingPost } = useQuery({
    queryKey: ['blog-post-edit', postId],
    queryFn: async () => {
      if (!postId) return null;
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_post_tags(blog_tags(id, name))
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch tags
  const { data: availableTags } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Load existing post data
  useEffect(() => {
    if (existingPost) {
      form.reset({
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt,
        content: existingPost.content,
        category_id: existingPost.category_id,
        featured_image: existingPost.featured_image || '',
        is_featured: existingPost.is_featured,
        reading_time: existingPost.reading_time,
      });
      
      const tags = existingPost.blog_post_tags?.map((t: any) => t.blog_tags.name) || [];
      setSelectedTags(tags);
    }
  }, [existingPost, form]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title && !postId) {
        const slug = generateSlug(value.title);
        form.setValue('slug', slug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, postId]);

  // Save post mutation
  const savePostMutation = useMutation({
    mutationFn: async (data: BlogPostForm & { status: string }) => {
      const postData = {
        ...data,
        author_id: user?.id,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (postId) {
        const { data: updatedPost, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', postId)
          .select()
          .single();
        if (error) throw error;
        result = updatedPost;
      } else {
        const { data: newPost, error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (error) throw error;
        result = newPost;
      }

      // Handle tags
      if (selectedTags.length > 0) {
        // Delete existing tags
        await supabase
          .from('blog_post_tags')
          .delete()
          .eq('post_id', result.id);

        // Insert new tags
        for (const tagName of selectedTags) {
          let tag = availableTags?.find(t => t.name === tagName);
          if (!tag) {
            const { data: newTag, error: tagError } = await supabase
              .from('blog_tags')
              .insert({ name: tagName, slug: generateSlug(tagName) })
              .select()
              .single();
            if (tagError) throw tagError;
            tag = newTag;
          }

          await supabase
            .from('blog_post_tags')
            .insert({
              post_id: result.id,
              tag_id: tag.id,
            });
        }
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      toast({
        title: "Post Saved",
        description: `Your post has been ${data.status === 'published' ? 'published' : 'saved as draft'}.`,
      });
      if (onSave) onSave(data.id);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveDraft = (data: BlogPostForm) => {
    savePostMutation.mutate({ ...data, status: 'draft' });
  };

  const handleSubmitForApproval = (data: BlogPostForm) => {
    savePostMutation.mutate({ ...data, status: 'pending' });
  };

  const handlePublish = (data: BlogPostForm) => {
    savePostMutation.mutate({ ...data, status: 'published' });
  };

  const addTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{postId ? 'Edit Post' : 'Create New Post'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Title and Slug */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Enter post title..."
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...form.register('slug')}
                  placeholder="post-slug"
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                {...form.register('excerpt')}
                placeholder="Brief description of your post..."
                rows={3}
              />
              {form.formState.errors.excerpt && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.excerpt.message}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                {...form.register('content')}
                placeholder="Write your post content here..."
                rows={15}
                className="font-mono"
              />
              {form.formState.errors.content && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            {/* Category and Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.watch('category_id')}
                  onValueChange={(value) => form.setValue('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category_id && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.category_id.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                <Input
                  id="reading_time"
                  type="number"
                  {...form.register('reading_time', { valueAsNumber: true })}
                  min="1"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <Label htmlFor="featured_image">Featured Image URL</Label>
              <Input
                id="featured_image"
                {...form.register('featured_image')}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={form.watch('is_featured')}
                onCheckedChange={(checked) => form.setValue('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Featured Post</Label>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={form.handleSubmit(handleSaveDraft)}
                disabled={savePostMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              {user?.role === 'admin' ? (
                <Button
                  type="button"
                  onClick={form.handleSubmit(handlePublish)}
                  disabled={savePostMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={form.handleSubmit(handleSubmitForApproval)}
                  disabled={savePostMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Approval
                </Button>
              )}
              
              <Button type="button" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
