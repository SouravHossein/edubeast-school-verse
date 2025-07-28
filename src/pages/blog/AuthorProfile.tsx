
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Eye, MessageSquare, ExternalLink, Mail, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface AuthorProfile {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  post_count: number;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  view_count: number;
  reading_time: number;
  published_at: string;
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

const AuthorProfile: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();

  // Fetch author profile
  const { data: author, isLoading } = useQuery({
    queryKey: ['author-profile', authorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('author_profiles')
        .select('*')
        .eq('id', authorId)
        .single();

      if (error) throw error;
      return data as AuthorProfile;
    },
  });

  // Fetch author's posts
  const { data: posts } = useQuery({
    queryKey: ['author-posts', authorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(name, slug),
          blog_post_tags(blog_tags(name, slug))
        `)
        .eq('author_id', authorId)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: !!authorId,
  });

  // Calculate stats
  const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
  const categories = Array.from(new Set(posts?.map(post => post.blog_categories?.name).filter(Boolean))) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
        <Link to="/blog" className="text-primary hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Author Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={author.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {author.display_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold">{author.display_name}</h1>
                  <p className="text-muted-foreground">Author</p>
                </div>

                {author.bio && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">{author.bio}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Posts</span>
                    <span className="text-sm">{posts?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Views</span>
                    <span className="text-sm">{totalViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Member Since</span>
                    <span className="text-sm">
                      {format(new Date(author.created_at), 'MMM yyyy')}
                    </span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Social Links */}
                {author.social_links && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Connect</h3>
                    <div className="flex flex-col gap-2">
                      {author.social_links.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={author.social_links.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </a>
                        </Button>
                      )}
                      {author.social_links.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={author.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {author.social_links.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={author.social_links.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Posts */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Posts by {author.display_name}</h2>
              <p className="text-muted-foreground">
                {posts?.length || 0} published articles
              </p>
            </div>

            <div className="space-y-6">
              {posts?.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-1/3">
                      <img
                        src={post.featured_image || '/placeholder.svg'}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="w-2/3">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.blog_categories?.name}</Badge>
                          {post.blog_post_tags?.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag.blog_tags.name}
                            </Badge>
                          ))}
                        </div>
                        <Link to={`/blog/${post.slug}`} className="hover:text-primary">
                          <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
                        </Link>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(post.published_at), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.view_count}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{post.reading_time} min read</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {posts?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts published yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
