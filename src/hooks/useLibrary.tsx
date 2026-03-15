import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const db = supabase as any;

export interface Book {
  id: string; tenant_id: string; title: string; author: string; isbn?: string;
  genre: string; publisher?: string; publication_year?: number; edition?: string;
  language?: string; pages?: number; cover_image?: string; description?: string;
  category: string; tags?: string[]; is_active?: boolean;
  created_at?: string; updated_at?: string;
}

export interface BookCopy {
  id: string; book_id: string; copy_number: string; barcode?: string; rfid_tag?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  shelf_location?: string; status: 'available' | 'borrowed' | 'reserved' | 'maintenance' | 'lost';
  acquisition_date?: string; price?: number; notes?: string;
  created_at?: string; updated_at?: string;
}

export interface LibraryTransaction {
  id: string; tenant_id: string; book_copy_id: string; user_id: string;
  transaction_type: 'borrow' | 'return' | 'renew' | 'reserve';
  borrow_date?: string; due_date?: string; return_date?: string;
  fine_amount?: number; fine_paid?: boolean; notes?: string;
  created_at?: string; updated_at?: string;
}

export interface LibrarySettings {
  id?: string; tenant_id: string;
  student_borrow_limit?: number; teacher_borrow_limit?: number;
  student_borrow_days?: number; teacher_borrow_days?: number;
  fine_per_day?: number; max_renewals?: number; damage_fine?: number;
  loss_fine?: number; overdue_reminder_days?: number;
  created_at?: string; updated_at?: string;
}

export interface LibraryReservation {
  id: string; tenant_id: string; book_id: string; user_id: string;
  reservation_date: string; expiry_date: string;
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  notified?: boolean; created_at?: string; updated_at?: string;
}

export const useLibrary = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: books = [], isLoading: booksLoading, refetch: refetchBooks } = useQuery({
    queryKey: ['library-books'],
    queryFn: async () => {
      const { data, error } = await db.from('books').select('*').eq('is_active', true).order('title');
      if (error) throw error; return data as Book[];
    },
    enabled: !!user,
  });

  const { data: bookCopies = [], isLoading: copiesLoading, refetch: refetchCopies } = useQuery({
    queryKey: ['library-book-copies'],
    queryFn: async () => {
      const { data, error } = await db.from('book_copies').select('*').order('copy_number');
      if (error) throw error; return data as BookCopy[];
    },
    enabled: !!user,
  });

  const { data: transactions = [], isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['library-transactions'],
    queryFn: async () => {
      const { data, error } = await db.from('borrow_transactions').select('*').order('created_at', { ascending: false });
      if (error) throw error; return data as any[];
    },
    enabled: !!user,
  });

  const { data: settings = null, isLoading: settingsLoading } = useQuery({
    queryKey: ['library-settings'],
    queryFn: async () => {
      const { data, error } = await db.from('library_settings').select('*').maybeSingle();
      if (error) throw error; return data as LibrarySettings | null;
    },
    enabled: !!user,
  });

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['library-reservations'],
    queryFn: async () => {
      const { data, error } = await db.from('library_reservations').select('*').eq('status', 'active').order('created_at', { ascending: false });
      if (error) throw error; return data as LibraryReservation[];
    },
    enabled: !!user,
  });

  const addBookMutation = useMutation({
    mutationFn: async (bookData: Omit<Book, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await db.from('books').insert([{ ...bookData, tenant_id: user?.tenantId || '' }]).select().single();
      if (error) throw error; return data as Book;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-books'] }); toast.success('Book added'); },
    onError: () => toast.error('Failed to add book'),
  });

  const updateBookMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Book> }) => {
      const { data, error } = await db.from('books').update(updates).eq('id', id).select().single();
      if (error) throw error; return data as Book;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-books'] }); toast.success('Book updated'); },
    onError: () => toast.error('Failed to update book'),
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('books').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-books'] }); toast.success('Book deleted'); },
    onError: () => toast.error('Failed to delete book'),
  });

  const addBookCopyMutation = useMutation({
    mutationFn: async (copyData: Omit<BookCopy, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await db.from('book_copies').insert([copyData]).select().single();
      if (error) throw error; return data as BookCopy;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-book-copies'] }); toast.success('Copy added'); },
    onError: () => toast.error('Failed to add copy'),
  });

  const updateBookCopyMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BookCopy> }) => {
      const { data, error } = await db.from('book_copies').update(updates).eq('id', id).select().single();
      if (error) throw error; return data as BookCopy;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-book-copies'] }); toast.success('Copy updated'); },
    onError: () => toast.error('Failed to update copy'),
  });

  const deleteBookCopyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('book_copies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-book-copies'] }); toast.success('Copy deleted'); },
    onError: () => toast.error('Failed to delete copy'),
  });

  const borrowBookMutation = useMutation({
    mutationFn: async ({ copyId, userId, dueDate }: { copyId: string; userId: string; dueDate: string }) => {
      await db.from('book_copies').update({ status: 'borrowed' }).eq('id', copyId);
      const { data, error } = await db.from('borrow_transactions').insert([{
        copy_id: copyId, borrower_id: userId, issued_by: user?.id || '',
        issue_date: new Date().toISOString().split('T')[0], due_date: dueDate,
        tenant_id: user?.tenantId || '', status: 'borrowed',
      }]).select().single();
      if (error) throw error; return data as any;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-transactions', 'library-book-copies'] }); toast.success('Book borrowed'); },
    onError: () => toast.error('Failed to borrow book'),
  });

  const returnBookMutation = useMutation({
    mutationFn: async ({ transactionId, returnDate, fineAmount }: { transactionId: string; returnDate: string; fineAmount?: number }) => {
      const { data, error } = await db.from('borrow_transactions').update({ return_date: returnDate, fine_amount: fineAmount || 0, fine_paid: !fineAmount }).eq('id', transactionId).select().single();
      if (error) throw error;
      await db.from('book_copies').update({ status: 'available' }).eq('id', (data as any).copy_id);
      return data as any;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-transactions', 'library-book-copies'] }); toast.success('Book returned'); },
    onError: () => toast.error('Failed to return book'),
  });

  const renewBookMutation = useMutation({
    mutationFn: async ({ transactionId, newDueDate }: { transactionId: string; newDueDate: string }) => {
      const { data, error } = await db.from('borrow_transactions').update({ due_date: newDueDate }).eq('id', transactionId).select().single();
      if (error) throw error; return data as any;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-transactions'] }); toast.success('Book renewed'); },
    onError: () => toast.error('Failed to renew book'),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: Partial<LibrarySettings>) => {
      const { data, error } = await db.from('library_settings').upsert([{ ...settingsData, tenant_id: settingsData.tenant_id || user?.tenantId || '' }]).select().single();
      if (error) throw error; return data as LibrarySettings;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-settings'] }); toast.success('Settings updated'); },
    onError: () => toast.error('Failed to update settings'),
  });

  const createReservationMutation = useMutation({
    mutationFn: async ({ bookId, userId }: { bookId: string; userId: string }) => {
      const expiryDate = new Date(); expiryDate.setDate(expiryDate.getDate() + 3);
      const { data, error } = await db.from('library_reservations').insert([{
        book_id: bookId, user_id: userId, tenant_id: user?.tenantId || '',
        reservation_date: new Date().toISOString(), expiry_date: expiryDate.toISOString(), status: 'active',
      }]).select().single();
      if (error) throw error; return data as LibraryReservation;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-reservations'] }); toast.success('Reservation created'); },
    onError: () => toast.error('Failed to create reservation'),
  });

  const cancelReservationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('library_reservations').update({ status: 'cancelled' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['library-reservations'] }); toast.success('Reservation cancelled'); },
    onError: () => toast.error('Failed to cancel reservation'),
  });

  return {
    books, booksLoading, addBook: addBookMutation.mutateAsync,
    updateBook: (id: string, updates: Partial<Book>) => updateBookMutation.mutateAsync({ id, updates }),
    deleteBook: deleteBookMutation.mutateAsync,
    bookCopies, copiesLoading, addBookCopy: addBookCopyMutation.mutateAsync,
    updateBookCopy: (id: string, updates: Partial<BookCopy>) => updateBookCopyMutation.mutateAsync({ id, updates }),
    deleteBookCopy: deleteBookCopyMutation.mutateAsync,
    transactions, transactionsLoading,
    borrowBook: (copyId: string, userId: string, dueDate: string) => borrowBookMutation.mutateAsync({ copyId, userId, dueDate }),
    returnBook: (transactionId: string, returnDate: string, fineAmount?: number) => returnBookMutation.mutateAsync({ transactionId, returnDate, fineAmount }),
    renewBook: (transactionId: string, newDueDate: string) => renewBookMutation.mutateAsync({ transactionId, newDueDate }),
    settings, settingsLoading, updateSettings: updateSettingsMutation.mutateAsync,
    reservations, reservationsLoading,
    createReservation: (bookId: string, userId: string) => createReservationMutation.mutateAsync({ bookId, userId }),
    cancelReservation: cancelReservationMutation.mutateAsync,
    refetchBooks, refetchCopies, refetchTransactions,
  };
};
