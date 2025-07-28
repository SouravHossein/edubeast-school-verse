
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  Users,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { BlogEditor } from '@/components/blog/BlogEditor';

const BlogDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['blog-stats', user?.id],
    queryFn: async () => {
      const queries = [];
      
      if (isAdmin) {
        queries.push(
          supabase.from('blog_posts').select('id', { count: 'exact' }),
          supabase.from('blog_posts').select('id', { count: 'exact' }).eq('status', 'pending'),
          supabase.from('blog_comments').select('id', { count: 'exact' }),
          supabase.from('author_profiles').select('id', { count: 'exact' })
        );
      } else {
        queries.push(
          supabase.from('blog_posts').select('id', { count: 'exact' }).eq('author_id', user?.id),
          supabase.from('blog_posts').select('id', { count: 'exact' }).eq('author_id', user?.id).eq('status', 'published'),
          supabase.from('blog_posts').select('view_count').eq('author_id', user?.id),
          supabase.from('blog_comments').select('id', { count: 'exact' }).in('post_id', 
            supabase.from('blog_posts').select('id').eq('author_id', user?.id)
          )
        );
      }

      const results = await Promise.all(queries);
      
      return {
        totalPosts: results[0].count || 0,
        pendingPosts: results[1].count || 0,
        totalViews: isAdmin ? 0 : results[2].data?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0,
        totalComments: results[3].count || 0,
        totalAuthors: isAdmin ? results[3].count || 0 : 0,
      };
    },
  });

  // Fetch user posts
  const { data: posts } = useQuery({
    queryKey: ['user-posts', user?.id, searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author_profiles!inner(display_name, avatar_url),
          blog_categories(name),
          blog_comments(id)
        `)
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        query = query.eq('author_id', user?.id);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch pending posts for admin
  const { data: pendingPosts } = useQuery({
    queryKey: ['pending-posts'],
    queryFn: async () => {
      if (!isAdmin) return [];
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author_profiles!inner(display_name, avatar_url),
          blog_categories(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
    setShowEditor(true);
  };

  const handleNewPost = () => {
    setEditingPostId(null);
    setShowEditor(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowEditor(false)}
          >
            ← Back to Dashboard
          </Button>
        </div>
        <BlogEditor
          postId={editingPostId}
          onSave={() => setShowEditor(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Dashboard</h1>
          <p className="text-muted-foreground">
            {isAdmin ? 'Manage all blog posts and authors' : 'Manage your blog posts'}
          </p>
        </div>
        <Button onClick={handleNewPost}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{stats?.totalPosts || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? 'Pending Approval' : 'Published'}
                </p>
                <p className="text-2xl font-bold">{stats?.pendingPosts || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? 'Total Authors' : 'Total Views'}
                </p>
                <p className="text-2xl font-bold">
                  {isAdmin ? stats?.totalAuthors || 0 : stats?.totalViews || 0}
                </p>
              </div>
              {isAdmin ? (
                <Users className="h-8 w-8 text-blue-500" />
              ) : (
                <TrendingUp className="h-8 w-8 text-blue-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Comments</p>
                <p className="text-2xl font-bold">{stats?.totalComments || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">My Posts</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="authors">Authors</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Posts Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={post.featured_image || '/placeholder.svg'}
                            alt={post.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-muted-foreground">
                              by {post.author_profiles?.display_name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.blog_categories?.name}</TableCell>
                      <TableCell>{post.view_count}</TableCell>
                      <TableCell>{post.blog_comments?.length || 0}</TableCell>
                      <TableCell>
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPost(post.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/blog/${post.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Posts Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPosts?.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.author_profiles?.display_name}</TableCell>
                        <TableCell>{post.blog_categories?.name}</TableCell>
                        <TableCell>
                          {format(new Date(post.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Approve
                            </Button>
                            <Button variant="outline" size="sm">
                              Reject
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default BlogDashboard;
