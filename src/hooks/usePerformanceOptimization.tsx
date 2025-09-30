import { useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Debounce hook for performance optimization
export const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

// Query cache for database optimization
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const useCachedQuery = () => {
  const getCachedData = useCallback((key: string) => {
    const cached = queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: any, ttl: number = 5 * 60 * 1000) => {
    queryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }, []);

  const queryWithCache = useCallback(async (
    key: string,
    queryFn: () => Promise<any>,
    ttl?: number
  ) => {
    // Check cache first
    const cached = getCachedData(key);
    if (cached) {
      return cached;
    }

    // Execute query and cache result
    const result = await queryFn();
    setCachedData(key, result, ttl);
    return result;
  }, [getCachedData, setCachedData]);

  return { queryWithCache, getCachedData, setCachedData };
};

// Optimized Supabase queries
export const useOptimizedQueries = () => {
  const { queryWithCache } = useCachedQuery();

  // Optimized student query with limited fields and caching
  const getStudentsOptimized = useCallback(async (tenantId: string, limit: number = 50) => {
    return queryWithCache(
      `students_${tenantId}_${limit}`,
      async () => {
        const { data, error } = await supabase
          .from('students')
          .select('id, full_name, email, roll_number, is_active')
          .eq('tenant_id', tenantId)
          .eq('is_active', true)
          .limit(limit)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      3 * 60 * 1000 // 3 minutes cache
    );
  }, [queryWithCache]);

  // Optimized dashboard stats with aggregation
  const getDashboardStatsOptimized = useCallback(async (tenantId: string) => {
    return queryWithCache(
      `dashboard_stats_${tenantId}`,
      async () => {
        // Fallback to individual queries for now
        const [studentsResult, teachersResult, classesResult] = await Promise.all([
          supabase.from('students').select('id', { count: 'exact' }).eq('tenant_id', tenantId),
          supabase.from('teachers').select('id', { count: 'exact' }).eq('tenant_id', tenantId),
          supabase.from('classes').select('id', { count: 'exact' }).eq('tenant_id', tenantId),
        ]);

        return {
          total_students: studentsResult.count || 0,
          total_teachers: teachersResult.count || 0,
          total_classes: classesResult.count || 0,
          attendance_rate: 85, // Mock data
        };
      },
      5 * 60 * 1000 // 5 minutes cache
    );
  }, [queryWithCache]);

  // Pagination with cursor-based approach for better performance
  const getPaginatedData = useCallback(async (
    table: string,
    tenantId: string,
    cursor?: string,
    limit: number = 20
  ) => {
    let query = supabase
      .from(table as any)
      .select('*')
      .eq('tenant_id', tenantId)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      data: data || [],
      nextCursor: data && data.length === limit ? (data[data.length - 1] as any).created_at : null,
      hasMore: data ? data.length === limit : false,
    };
  }, []);

  return {
    getStudentsOptimized,
    getDashboardStatsOptimized,
    getPaginatedData,
  };
};

// Image lazy loading optimization
export const useImageOptimization = () => {
  const imageCache = useMemo(() => new Set<string>(), []);

  const preloadImage = useCallback((src: string) => {
    if (imageCache.has(src)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.add(src);
        resolve(src);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, [imageCache]);

  const getOptimizedImageSrc = useCallback((src: string, width?: number, height?: number) => {
    if (!src) return '';
    
    // If using Supabase storage, add transformation parameters
    if (src.includes('supabase')) {
      const url = new URL(src);
      if (width) url.searchParams.set('width', width.toString());
      if (height) url.searchParams.set('height', height.toString());
      url.searchParams.set('format', 'webp');
      return url.toString();
    }

    return src;
  }, []);

  return { preloadImage, getOptimizedImageSrc };
};