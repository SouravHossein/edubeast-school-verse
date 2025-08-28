
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
  language: string;
  pages?: number;
  cover_image?: string;
  description?: string;
  category: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookCopy {
  id: string;
  book_id: string;
  copy_number: string;
  barcode?: string;
  rfid_tag?: string;
  condition: 'new' | 'good' | 'damaged' | 'lost';
  shelf_location?: string;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance';
  acquisition_date: string;
  price?: number;
  notes?: string;
  books: Book;
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
  status: 'borrowed' | 'returned' | 'overdue' | 'lost';
  fine_amount: number;
  fine_paid: boolean;
  renewal_count: number;
  notes?: string;
  book_copies: BookCopy;
  borrower: {
    full_name: string;
    email: string;
  };
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
}

export const useLibrary = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookCopies, setBookCopies] = useState<BookCopy[]>([]);
  const [transactions, setTransactions] = useState<BorrowTransaction[]>([]);
  const [settings, setSettings] = useState<LibrarySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to fetch books. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchBookCopies = async () => {
    try {
      const { data, error } = await supabase
        .from('book_copies')
        .select(`
          *,
          books(*)
        `)
        .order('copy_number');

      if (error) throw error;
      setBookCopies(data || []);
    } catch (error) {
      console.error('Error fetching book copies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch book copies. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('borrow_transactions')
        .select(`
          *,
          book_copies(
            *,
            books(*)
          ),
          borrower:profiles!borrow_transactions_borrower_id_fkey(full_name, email)
        `)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('library_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching library settings:', error);
    }
  };

  const createBook = async (bookData: Partial<Book>) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([bookData])
        .select()
        .single();

      if (error) throw error;

      setBooks(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Book created successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating book:', error);
      toast({
        title: "Error",
        description: "Failed to create book. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const createBookCopy = async (copyData: Partial<BookCopy>) => {
    try {
      const { data, error } = await supabase
        .from('book_copies')
        .insert([copyData])
        .select(`
          *,
          books(*)
        `)
        .single();

      if (error) throw error;

      setBookCopies(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Book copy added successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating book copy:', error);
      toast({
        title: "Error",
        description: "Failed to add book copy. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const borrowBook = async (copyId: string, borrowerId: string) => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', borrowerId)
        .single();

      if (!settings) {
        throw new Error('Library settings not found');
      }

      const borrowDays = userProfile?.role === 'student' 
        ? settings.student_borrow_days 
        : settings.teacher_borrow_days;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + borrowDays);

      const { data: currentUser } = await supabase.auth.getUser();
      
      const transactionData = {
        copy_id: copyId,
        borrower_id: borrowerId,
        issued_by: currentUser.user?.id,
        due_date: dueDate.toISOString().split('T')[0],
        status: 'borrowed' as const
      };

      const { data, error } = await supabase
        .from('borrow_transactions')
        .insert([transactionData])
        .select(`
          *,
          book_copies(
            *,
            books(*)
          ),
          borrower:profiles!borrow_transactions_borrower_id_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      // Update book copy status
      await supabase
        .from('book_copies')
        .update({ status: 'borrowed' })
        .eq('id', copyId);

      await fetchBookCopies();
      setTransactions(prev => [data, ...prev]);

      toast({
        title: "Success",
        description: "Book borrowed successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error borrowing book:', error);
      toast({
        title: "Error",
        description: "Failed to borrow book. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const returnBook = async (transactionId: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('borrow_transactions')
        .update({
          return_date: new Date().toISOString().split('T')[0],
          returned_by: currentUser.user?.id,
          status: 'returned'
        })
        .eq('id', transactionId)
        .select(`
          *,
          book_copies(
            *,
            books(*)
          ),
          borrower:profiles!borrow_transactions_borrower_id_fkey(full_name, email)
        `)
        .single();

      if (error) throw error;

      // Update book copy status
      await supabase
        .from('book_copies')
        .update({ status: 'available' })
        .eq('id', data.copy_id);

      await fetchBookCopies();
      setTransactions(prev => prev.map(t => 
        t.id === transactionId ? data : t
      ));

      toast({
        title: "Success",
        description: "Book returned successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error returning book:', error);
      toast({
        title: "Error",
        description: "Failed to return book. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchBooks(),
        fetchBookCopies(),
        fetchTransactions(),
        fetchSettings()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    books,
    bookCopies,
    transactions,
    settings,
    loading,
    createBook,
    createBookCopy,
    borrowBook,
    returnBook,
    refetch: {
      books: fetchBooks,
      copies: fetchBookCopies,
      transactions: fetchTransactions,
      settings: fetchSettings
    }
  };
};
