
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from '@/hooks/useLibrary';

const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().optional(),
  genre: z.string().min(1, 'Genre is required'),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  publication_year: z.number().optional(),
  language: z.string().optional(),
  pages: z.number().optional(),
  cover_image: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
});

type BookFormData = z.infer<typeof bookFormSchema>;

export interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Book, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Partial<Book>;
}

export const BookForm: React.FC<BookFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      author: initialData?.author || '',
      isbn: initialData?.isbn || '',
      genre: initialData?.genre || '',
      publisher: initialData?.publisher || '',
      edition: initialData?.edition || '',
      publication_year: initialData?.publication_year,
      language: initialData?.language || 'English',
      pages: initialData?.pages,
      cover_image: initialData?.cover_image || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      tags: initialData?.tags?.join(', ') || '',
    },
  });

  const handleSubmit = async (data: BookFormData) => {
    try {
      const processedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        is_active: true,
      };
      await onSubmit(processedData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Book' : 'Add New Book'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update the book information below.' 
              : 'Fill in the details to add a new book to the library.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="Book title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    {...form.register('author')}
                    placeholder="Author name"
                  />
                  {form.formState.errors.author && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.author.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    {...form.register('isbn')}
                    placeholder="ISBN number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre *</Label>
                  <Input
                    id="genre"
                    {...form.register('genre')}
                    placeholder="Book genre"
                  />
                  {form.formState.errors.genre && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.genre.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    onValueChange={(value) => form.setValue('category', value)}
                    defaultValue={form.getValues('category')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Fiction">Fiction</SelectItem>
                      <SelectItem value="Non-fiction">Non-fiction</SelectItem>
                      <SelectItem value="Reference">Reference</SelectItem>
                      <SelectItem value="Children">Children</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Biography">Biography</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    onValueChange={(value) => form.setValue('language', value)}
                    defaultValue={form.getValues('language') || 'English'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publication Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    {...form.register('publisher')}
                    placeholder="Publisher name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edition">Edition</Label>
                  <Input
                    id="edition"
                    {...form.register('edition')}
                    placeholder="Edition"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publication_year">Publication Year</Label>
                  <Input
                    id="publication_year"
                    type="number"
                    {...form.register('publication_year', { valueAsNumber: true })}
                    placeholder="Year"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    {...form.register('pages', { valueAsNumber: true })}
                    placeholder="Number of pages"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover_image">Cover Image URL</Label>
                  <Input
                    id="cover_image"
                    {...form.register('cover_image')}
                    placeholder="Image URL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Book description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  {...form.register('tags')}
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple tags with commas
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting 
                ? 'Saving...' 
                : initialData ? 'Update Book' : 'Add Book'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
