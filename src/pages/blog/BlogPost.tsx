
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Clock, Eye, Calendar, Share2, Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  author_id: string;
  category_id: string;
  status: string;
  is_featured: boolean;
  view_count: number;
  reading_time: number;
  published_at: string;
  created_at: string;
  author_profiles: {
    display_name: string;
    avatar_url: string;
    bio: string;
    social_links: any;
  };
  blog_categories: {
    name: string;
    slug: string;
  };
  blog_post_tags: {
    blog_tags: {
      name: string;
      slug: string;
    };
  }[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id?: string;
  is_approved: boolean;
  author_profiles: {
    display_name: string;
    avatar_url: string;
  };
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  // Fetch blog post
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author_profiles!inner(*),
          blog_categories(*),
          blog_post_tags(blog_tags(*))
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
  });

  // Fetch comments
  const { data: comments } = useQuery({
    queryKey: ['blog-comments', post?.id],
    queryFn: async () => {
      if (!post?.id) return [];
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          author_profiles!inner(display_name, avatar_url)
        `)
        .eq('post_id', post.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!post?.id,
  });

  // Fetch related posts
  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', post?.category_id, post?.id],
    queryFn: async () => {
      if (!post?.category_id) return [];
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id, title, slug, excerpt, featured_image, reading_time, published_at,
          author_profiles!inner(display_name, avatar_url)
        `)
        .eq('category_id', post.category_id)
        .neq('id', post.id)
        .eq('status', 'published')
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!post?.category_id,
  });

  // Increment view count
  useEffect(() => {
    if (post?.id) {
      const incrementViews = async () => {
        await supabase
          .from('blog_posts')
          .update({ view_count: post.view_count + 1 })
          .eq('id', post.id);
      };
      incrementViews();
    }
  }, [post?.id]);

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (commentData: { content: string; parent_id?: string }) => {
      if (!user?.id || !post?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: commentData.content,
          parent_id: commentData.parent_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', post?.id] });
      setNewComment('');
      setReplyTo(null);
      toast({
        title: "Comment Submitted",
        description: "Your comment has been submitted for approval.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ content: newComment, parent_id: replyTo });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Post link has been copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-primary hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Post Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{post.blog_categories?.name}</Badge>
                {post.blog_post_tags?.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag.blog_tags.name}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author_profiles?.avatar_url} />
                      <AvatarFallback>
                        {post.author_profiles?.display_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.author_profiles?.display_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.published_at), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time} min read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.view_count}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <Separator className="my-8" />

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments ({comments?.length || 0})
              </h3>

              {/* Add Comment Form */}
              {isAuthenticated ? (
                <div className="mb-6">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        {user?.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-2">
                        {replyTo && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(null)}
                          >
                            Cancel Reply
                          </Button>
                        )}
                        <Button
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim() || addCommentMutation.isPending}
                        >
                          {addCommentMutation.isPending ? 'Submitting...' : 'Submit Comment'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground">
                    Please <Link to="/" className="text-primary hover:underline">login</Link> to leave a comment.
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author_profiles?.avatar_url} />
                      <AvatarFallback>
                        {comment.author_profiles?.display_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.author_profiles?.display_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(comment.created_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyTo(comment.id)}
                        >
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">About the Author</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author_profiles?.avatar_url} />
                    <AvatarFallback>
                      {post.author_profiles?.display_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{post.author_profiles?.display_name}</h4>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
                {post.author_profiles?.bio && (
                  <p className="text-sm text-muted-foreground mb-4">{post.author_profiles.bio}</p>
                )}
                <div className="flex gap-2">
                  {post.author_profiles?.social_links?.twitter && (
                    <Button variant="outline" size="sm">Twitter</Button>
                  )}
                  {post.author_profiles?.social_links?.linkedin && (
                    <Button variant="outline" size="sm">LinkedIn</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Related Posts</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="flex gap-3">
                        <img
                          src={relatedPost.featured_image || '/placeholder.svg'}
                          alt={relatedPost.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/blog/${relatedPost.slug}`}
                            className="text-sm font-medium hover:text-primary line-clamp-2"
                          >
                            {relatedPost.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(relatedPost.published_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
