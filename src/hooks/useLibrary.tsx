
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Book {
  id: string;
  tenant_id: string;
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  publisher?: string;
  edition?: string;
  publication_year?: number;
  language?: string;
  pages?: number;
  cover_image?: string;
  description?: string;
  category: string;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BookCopy {
  id: string;
  book_id: string;
  copy_number: string;
  barcode?: string;
  rfid_tag?: string;
  condition: string;
  shelf_location?: string;
  status: string;
  acquisition_date?: string;
  price?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BorrowTransaction {
  id: string;
  tenant_id: string;
  copy_id: string;
  borrower_id: string;
  issued_by: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  returned_by?: string;
  status: string;
  fine_amount?: number;
  fine_paid?: boolean;
  renewal_count?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LibrarySettings {
  id: string;
  tenant_id: string;
  student_borrow_limit?: number;
  teacher_borrow_limit?: number;
  student_borrow_days?: number;
  teacher_borrow_days?: number;
  fine_per_day?: number;
  max_renewals?: number;
  damage_fine?: number;
  loss_fine?: number;
  overdue_reminder_days?: number;
  created_at?: string;
  updated_at?: string;
}

export const useLibrary = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookCopies, setBookCopies] = useState<BookCopy[]>([]);
  const [borrowTransactions, setBorrowTransactions] = useState<BorrowTransaction[]>([]);
  const [librarySettings, setLibrarySettings] = useState<LibrarySettings>({} as LibrarySettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      setIsLoading(true);

      // Load books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (booksError) throw booksError;

      // Load book copies
      const { data: copiesData, error: copiesError } = await supabase
        .from('book_copies')
        .select('*')
        .order('copy_number');

      if (copiesError) throw copiesError;

      // Load borrow transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('borrow_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Load library settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('library_settings')
        .select('*')
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

      setBooks(booksData || []);
      setBookCopies(copiesData || []);
      setBorrowTransactions(transactionsData || []);
      setLibrarySettings(settingsData || {} as LibrarySettings);
    } catch (error) {
      console.error('Error loading library data:', error);
      toast({
        title: "Error",
        description: "Failed to load library data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([bookData])
        .select()
        .single();

      if (error) throw error;

      setBooks(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Book added successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setBooks(prev => prev.map(book => book.id === id ? data : book));
      toast({
        title: "Success",
        description: "Book updated successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error updating book:', error);
      toast({
        title: "Error",
        description: "Failed to update book. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setBooks(prev => prev.filter(book => book.id !== id));
      toast({
        title: "Success",
        description: "Book deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addBookCopy = async (copyData: Omit<BookCopy, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('book_copies')
        .insert([copyData])
        .select()
        .single();

      if (error) throw error;

      setBookCopies(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Book copy added successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error adding book copy:', error);
      toast({
        title: "Error",
        description: "Failed to add book copy. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateLibrarySettings = async (settings: Partial<LibrarySettings>) => {
    try {
      const { data, error } = await supabase
        .from('library_settings')
        .upsert(settings)
        .select()
        .single();

      if (error) throw error;

      setLibrarySettings(data);
      toast({
        title: "Success",
        description: "Library settings updated successfully.",
      });
      return data;
    } catch (error) {
      console.error('Error updating library settings:', error);
      toast({
        title: "Error",
        description: "Failed to update library settings. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    books,
    bookCopies,
    borrowTransactions,
    librarySettings,
    isLoading,
    addBook,
    updateBook,
    deleteBook,
    addBookCopy,
    updateLibrarySettings,
    refreshData: loadLibraryData,
  };
};
