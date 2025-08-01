
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Calendar, Clock, User, Tag, TrendingUp, Star } from 'lucide-react';
import Navigation  from '@/components/Navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  reading_time: number;
  view_count: number;
  is_featured: boolean;
  author: {
    display_name: string;
    avatar_url: string;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: string[];
}

export const BlogListing: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'education', name: 'Education' },
    { id: 'news', name: 'News' },
    { id: 'events', name: 'Events' },
  ];

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Welcome to Our New School Blog',
        slug: 'welcome-to-our-new-school-blog',
        excerpt: 'We are excited to launch our new school blog where students, teachers, and parents can share their experiences and insights.',
        featured_image: '/placeholder.svg',
        published_at: '2024-01-15T10:00:00Z',
        reading_time: 5,
        view_count: 150,
        is_featured: true,
        author: {
          display_name: 'John Smith',
          avatar_url: '/placeholder.svg',
        },
        category: {
          name: 'News',
          slug: 'news',
        },
        tags: ['announcement', 'school', 'community'],
      },
      {
        id: '2',
        title: 'Tips for Effective Online Learning',
        slug: 'tips-for-effective-online-learning',
        excerpt: 'Discover practical strategies and tools that can help students succeed in their online learning journey.',
        featured_image: '/placeholder.svg',
        published_at: '2024-01-14T09:00:00Z',
        reading_time: 8,
        view_count: 89,
        is_featured: false,
        author: {
          display_name: 'Sarah Johnson',
          avatar_url: '/placeholder.svg',
        },
        category: {
          name: 'Education',
          slug: 'education',
        },
        tags: ['online-learning', 'study-tips', 'education'],
      },
      {
        id: '3',
        title: 'Annual Science Fair Highlights',
        slug: 'annual-science-fair-highlights',
        excerpt: 'Take a look at the amazing projects and innovations showcased at this year\'s science fair.',
        featured_image: '/placeholder.svg',
        published_at: '2024-01-13T11:30:00Z',
        reading_time: 6,
        view_count: 200,
        is_featured: true,
        author: {
          display_name: 'Dr. Michael Brown',
          avatar_url: '/placeholder.svg',
        },
        category: {
          name: 'Events',
          slug: 'events',
        },
        tags: ['science-fair', 'innovation', 'students'],
      },
    ];

    setPosts(mockPosts);
    setFeaturedPosts(mockPosts.filter(post => post.is_featured));
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      case 'popular':
        return b.view_count - a.view_count;
      case 'reading_time':
        return a.reading_time - b.reading_time;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">School Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, insights, and stories from our school community
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                      Featured
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Badge variant="secondary">{post.category.name}</Badge>
                      <span>•</span>
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link to={`/blog/${post.slug}`} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={post.author.avatar_url} />
                          <AvatarFallback>{post.author.display_name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{post.author.display_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{post.reading_time} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="reading_time">Reading Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Badge variant="secondary">{post.category.name}</Badge>
                  <span>•</span>
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                </div>
                <CardTitle className="line-clamp-2">
                  <Link to={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.author.avatar_url} />
                      <AvatarFallback>{post.author.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{post.author.display_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{post.reading_time} min</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <p>No posts found matching your criteria.</p>
            </div>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListing;
