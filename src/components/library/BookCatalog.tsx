
import React, { useState } from 'react';
import { Search, Plus, BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookForm } from './BookForm';
import { useLibrary, Book } from '@/hooks/useLibrary';

export const BookCatalog = () => {
  const { books, bookCopies, loading, createBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showBookForm, setShowBookForm] = useState(false);

  const getAvailableCopies = (bookId: string) => {
    return bookCopies.filter(copy => 
      copy.book_id === bookId && copy.status === 'available'
    ).length;
  };

  const getTotalCopies = (bookId: string) => {
    return bookCopies.filter(copy => copy.book_id === bookId).length;
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    
    return matchesSearch && matchesCategory && matchesGenre;
  });

  const categories = [...new Set(books.map(book => book.category))];
  const genres = [...new Set(books.map(book => book.genre))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Book Catalog</h2>
          <p className="text-muted-foreground">
            Manage your library's book collection
          </p>
        </div>
        <Button onClick={() => setShowBookForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => {
          const availableCopies = getAvailableCopies(book.id);
          const totalCopies = getTotalCopies(book.id);
          
          return (
            <Card key={book.id} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {book.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Genre:</span>
                    <span>{book.genre}</span>
                  </div>
                  
                  {book.isbn && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ISBN:</span>
                      <span className="font-mono text-xs">{book.isbn}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Copies:</span>
                    <span className={availableCopies > 0 ? 'text-green-600' : 'text-red-600'}>
                      {availableCopies}/{totalCopies}
                    </span>
                  </div>

                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {book.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{book.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Badge 
                      variant={availableCopies > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {availableCopies > 0 ? 'Available' : 'Not Available'}
                    </Badge>
                    
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory || selectedGenre
              ? 'Try adjusting your search criteria'
              : 'Start by adding some books to your library'
            }
          </p>
          {!searchTerm && !selectedCategory && !selectedGenre && (
            <Button onClick={() => setShowBookForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Book
            </Button>
          )}
        </div>
      )}

      <BookForm
        open={showBookForm}
        onOpenChange={setShowBookForm}
        onSubmit={createBook}
      />
    </div>
  );
};
