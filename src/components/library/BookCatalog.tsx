import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Book } from 'lucide-react';
import { useLibrary, Book as BookType } from '@/hooks/useLibrary';
import { Badge } from '@/components/ui/badge';

interface Props {}

const availableGenres = [
  'Fiction',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Fantasy',
  'Historical Fiction',
  'Young Adult',
  'Children\'s Literature',
  'Non-Fiction',
  'Biography',
  'Autobiography',
  'History',
  'Science',
  'Mathematics',
  'Computer Science',
  'Business',
  'Self-Help',
  'Poetry',
  'Drama',
];

export const BookCatalog = () => {
  const { books, booksLoading } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchTerm));
    
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  if (booksLoading) {
    return <div className="p-6">Loading books...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Book Catalog</h2>
          <p className="text-muted-foreground">Browse and search library books</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Genres</SelectItem>
            {availableGenres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="h-full">
            <CardHeader className="pb-3">
              <div className="aspect-[3/4] bg-muted rounded-md mb-3 flex items-center justify-center">
                {book.cover_image ? (
                  <img 
                    src={book.cover_image} 
                    alt={book.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <Book className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="line-clamp-1">by {book.author}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Genre:</span>
                  <Badge variant="secondary">{book.genre}</Badge>
                </div>
                {book.isbn && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="font-mono text-xs">{book.isbn}</span>
                  </div>
                )}
                {book.publication_year && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year:</span>
                    <span>{book.publication_year}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedGenre 
              ? 'Try adjusting your search or filter criteria'
              : 'No books available in the library'
            }
          </p>
        </div>
      )}
    </div>
  );
};
