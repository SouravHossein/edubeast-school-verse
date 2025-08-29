
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Book {
  id: string;
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
  is_active: boolean;
  tenant_id: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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
  fine_amount: number;
  fine_paid: boolean;
  renewal_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LibrarySettings {
  id: string;
  tenant_id: string;
  student_borrow_limit: number;
  teacher_borrow_limit: number;
  student_borrow_days: number;
  teacher_borrow_days: number;
  fine_per_day: number;
  max_renewals: number;
  damage_fine: number;
  loss_fine: number;
  overdue_reminder_days: number;
  created_at: string;
  updated_at: string;
}

export const useLibrary = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookCopies, setBookCopies] = useState<BookCopy[]>([]);
  const [borrowTransactions, setBorrowTransactions] = useState<BorrowTransaction[]>([]);
  const [librarySettings, setLibrarySettings] = useState<LibrarySettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch books
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch book copies
  const fetchBookCopies = async (bookId?: string) => {
    try {
      let query = supabase.from('book_copies').select('*');
      
      if (bookId) {
        query = query.eq('book_id', bookId);
      }

      const { data, error } = await query.order('copy_number');

      if (error) throw error;
      setBookCopies(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch book copies",
        variant: "destructive",
      });
    }
  };

  // Fetch borrow transactions
  const fetchBorrowTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('borrow_transactions')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setBorrowTransactions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch borrow transactions",
        variant: "destructive",
      });
    }
  };

  // Fetch library settings
  const fetchLibrarySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('library_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setLibrarySettings(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch library settings",
        variant: "destructive",
      });
    }
  };

  // Add new book
  const addBook = async (bookData: Omit<Book, 'id' | 'tenant_id' | 'created_at' | 'updated_at' | 'is_active'>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([{ ...bookData, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      
      setBooks(prev => [...prev, data]);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Update book
  const updateBook = async (bookId: string, bookData: Partial<Book>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(bookData)
        .eq('id', bookId)
        .select()
        .single();

      if (error) throw error;
      
      setBooks(prev => prev.map(book => book.id === bookId ? data : book));
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Delete book
  const deleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ is_active: false })
        .eq('id', bookId);

      if (error) throw error;
      
      setBooks(prev => prev.filter(book => book.id !== bookId));
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Add book copy
  const addBookCopy = async (copyData: Omit<BookCopy, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('book_copies')
        .insert([copyData])
        .select()
        .single();

      if (error) throw error;
      
      setBookCopies(prev => [...prev, data]);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Update book copy
  const updateBookCopy = async (copyId: string, copyData: Partial<BookCopy>) => {
    try {
      const { data, error } = await supabase
        .from('book_copies')
        .update(copyData)
        .eq('id', copyId)
        .select()
        .single();

      if (error) throw error;
      
      setBookCopies(prev => prev.map(copy => copy.id === copyId ? data : copy));
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Borrow book
  const borrowBook = async (transactionData: Omit<BorrowTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('borrow_transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;
      
      // Update book copy status
      await updateBookCopy(transactionData.copy_id, { status: 'borrowed' });
      
      setBorrowTransactions(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Return book
  const returnBook = async (transactionId: string, returnData: { return_date: string; returned_by: string; fine_amount?: number }) => {
    try {
      const { data, error } = await supabase
        .from('borrow_transactions')
        .update({ 
          ...returnData, 
          status: 'returned' 
        })
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;
      
      // Update book copy status
      const transaction = borrowTransactions.find(t => t.id === transactionId);
      if (transaction) {
        await updateBookCopy(transaction.copy_id, { status: 'available' });
      }
      
      setBorrowTransactions(prev => 
        prev.map(transaction => transaction.id === transactionId ? data : transaction)
      );
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Update library settings
  const updateLibrarySettings = async (settings: Partial<LibrarySettings>) => {
    try {
      const { data, error } = await supabase
        .from('library_settings')
        .upsert(settings)
        .select()
        .single();

      if (error) throw error;
      
      setLibrarySettings(data);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBooks();
      fetchLibrarySettings();
    }
  }, [user]);

  return {
    books,
    bookCopies,
    borrowTransactions,
    librarySettings,
    isLoading,
    fetchBooks,
    fetchBookCopies,
    fetchBorrowTransactions,
    addBook,
    updateBook,
    deleteBook,
    addBookCopy,
    updateBookCopy,
    borrowBook,
    returnBook,
    updateLibrarySettings,
  };
};
