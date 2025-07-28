
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Eye, MapPin, Link2, Mail, Twitter, Linkedin } from 'lucide-react';
import { Navigation } from '@/components/Navigation';

interface Author {
  id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    email?: string;
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
  published_at: string;
  reading_time: number;
  view_count: number;
  category: {
    name: string;
    slug: string;
  };
  tags: string[];
}

export const AuthorProfile: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockAuthor: Author = {
      id: '1',
      display_name: 'John Smith',
      avatar_url: '/placeholder.svg',
      bio: 'Principal at EduBeast School with over 15 years of experience in education. Passionate about innovative teaching methods and student development.',
      social_links: {
        twitter: 'https://twitter.com/johnsmith',
        linkedin: 'https://linkedin.com/in/johnsmith',
        website: 'https://johnsmith.edu',
        email: 'john.smith@edubeast.com',
      },
      post_count: 15,
      created_at: '2023-01-01T00:00:00Z',
    };

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
        category: {
          name: 'News',
          slug: 'news',
        },
        tags: ['announcement', 'school', 'community'],
      },
      {
        id: '2',
        title: 'The Future of Education Technology',
        slug: 'future-of-education-technology',
        excerpt: 'Exploring how technology is transforming the educational landscape and what it means for students and teachers.',
        featured_image: '/placeholder.svg',
        published_at: '2024-01-10T09:00:00Z',
        reading_time: 8,
        view_count: 89,
        category: {
          name: 'Technology',
          slug: 'technology',
        },
        tags: ['technology', 'education', 'innovation'],
      },
      {
        id: '3',
        title: 'Building Strong School Communities',
        slug: 'building-strong-school-communities',
        excerpt: 'How schools can foster stronger connections between students, parents, and teachers.',
        featured_image: '/placeholder.svg',
        published_at: '2024-01-05T11:30:00Z',
        reading_time: 6,
        view_count: 120,
        category: {
          name: 'Community',
          slug: 'community',
        },
        tags: ['community', 'engagement', 'collaboration'],
      },
    ];

    setAuthor(mockAuthor);
    setPosts(mockPosts);
    setIsLoading(false);
  }, [authorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading author profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Author Not Found</h1>
            <p className="text-muted-foreground">The author profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Author Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={author.avatar_url} />
                    <AvatarFallback className="text-2xl">{author.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold mb-2">{author.display_name}</h1>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(author.created_at).getFullYear()}</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{author.bio}</p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Posts</span>
                    <span className="font-medium">{author.post_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Views</span>
                    <span className="font-medium">{posts.reduce((sum, post) => sum + post.view_count, 0)}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-2">
                  {author.social_links.email && (
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  )}
                  {author.social_links.twitter && (
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                  )}
                  {author.social_links.linkedin && (
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  )}
                  {author.social_links.website && (
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Link2 className="w-4 h-4 mr-2" />
                      Website
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Posts by {author.display_name}</h2>
              <p className="text-muted-foreground">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
              </p>
            </div>

            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category.name}</Badge>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 hover:text-primary cursor-pointer">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.reading_time} min read</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.view_count} views</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
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
