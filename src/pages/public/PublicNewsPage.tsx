
import React, { useState, useEffect } from 'react';
import { PublicSiteLayout } from '@/components/public/PublicSiteLayout';
import { SiteThemeProvider } from '@/components/public/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { Calendar, User, Search, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  reading_time: number;
  author_id: string;
  category_id: string;
  view_count: number;
  is_featured: boolean;
}

export const PublicNewsPage: React.FC = () => {
  const { tenant } = useTenant();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadBlogPosts();
  }, [tenant]);

  const loadBlogPosts = async () => {
    if (!tenant) return;

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author_profiles!inner(display_name),
          blog_categories(name)
        `)
        .eq('tenant_id', tenant.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts.find(post => post.is_featured);
  const regularPosts = filteredPosts.filter(post => !post.is_featured);

  if (loading) {
    return (
      <SiteThemeProvider defaultTheme="modern">
        <PublicSiteLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          </div>
        </PublicSiteLayout>
      </SiteThemeProvider>
    );
  }

  return (
    <SiteThemeProvider defaultTheme="modern">
      <PublicSiteLayout>
        <div className="py-12">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">News & Updates</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Stay informed with the latest news, events, and announcements from {tenant?.name}
              </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search news and updates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Posts
                </Button>
                <Button
                  variant={selectedCategory === 'events' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('events')}
                >
                  Events
                </Button>
                <Button
                  variant={selectedCategory === 'achievements' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('achievements')}
                >
                  Achievements
                </Button>
              </div>
            </div>

            {/* Featured Post */}
            {featuredPost && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
                <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
                  <div className="md:flex">
                    {featuredPost.featured_image && (
                      <div className="md:w-1/2">
                        <img
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="secondary">Featured</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(featuredPost.published_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                      <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="w-4 h-4 mr-1" />
                          <span>Admin</span>
                          <span className="mx-2">•</span>
                          <span>{featuredPost.reading_time} min read</span>
                        </div>
                        <Button>Read More</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Regular Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="bg-card rounded-xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{post.reading_time} min read</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="w-3 h-3 mr-1" />
                        <span>Admin</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Posts Message */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? `No posts match "${searchTerm}". Try adjusting your search.`
                    : 'No posts available in this category.'
                  }
                </p>
              </div>
            )}

            {/* Load More Button */}
            {filteredPosts.length > 6 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Posts
                </Button>
              </div>
            )}
          </div>
        </div>
      </PublicSiteLayout>
    </SiteThemeProvider>
  );
};
