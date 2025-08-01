
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Eye, Heart, Share2, ArrowLeft, User, MessageCircle } from 'lucide-react';
import Navigation  from '@/components/Navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  published_at: string;
  reading_time: number;
  view_count: number;
  author: {
    display_name: string;
    avatar_url: string;
    bio: string;
    social_links: any;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: string[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    display_name: string;
    avatar_url: string;
  };
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    const mockPost: BlogPost = {
      id: '1',
      title: 'Welcome to Our New School Blog',
      slug: 'welcome-to-our-new-school-blog',
      content: `
        <p>We are thrilled to announce the launch of our new school blog platform! This exciting addition to our digital community will serve as a central hub for students, teachers, parents, and staff to share their experiences, insights, and achievements.</p>
        
        <h2>What to Expect</h2>
        <p>Our blog will feature a diverse range of content including:</p>
        <ul>
          <li>Student project showcases and academic achievements</li>
          <li>Teacher insights and educational resources</li>
          <li>School event coverage and announcements</li>
          <li>Parent perspectives and community stories</li>
          <li>Alumni success stories and career guidance</li>
        </ul>
        
        <h2>Get Involved</h2>
        <p>We encourage everyone in our school community to participate by:</p>
        <ul>
          <li>Submitting articles and stories</li>
          <li>Commenting on posts and engaging in discussions</li>
          <li>Sharing posts with friends and family</li>
          <li>Providing feedback and suggestions</li>
        </ul>
        
        <p>Together, we can create a vibrant online space that reflects the spirit and excellence of our school community.</p>
      `,
      featured_image: '/placeholder.svg',
      published_at: '2024-01-15T10:00:00Z',
      reading_time: 5,
      view_count: 150,
      author: {
        display_name: 'John Smith',
        avatar_url: '/placeholder.svg',
        bio: 'Principal at EduBeast School with over 15 years of experience in education.',
        social_links: {},
      },
      category: {
        name: 'News',
        slug: 'news',
      },
      tags: ['announcement', 'school', 'community'],
    };

    const mockComments: Comment[] = [
      {
        id: '1',
        content: 'This is fantastic! Looking forward to reading more content from our school community.',
        created_at: '2024-01-15T12:00:00Z',
        author: {
          display_name: 'Sarah Johnson',
          avatar_url: '/placeholder.svg',
        },
      },
      {
        id: '2',
        content: 'Great initiative! This will help us stay more connected as a school family.',
        created_at: '2024-01-15T14:30:00Z',
        author: {
          display_name: 'Michael Brown',
          avatar_url: '/placeholder.svg',
        },
      },
    ];

    const mockRelatedPosts: BlogPost[] = [
      {
        id: '2',
        title: 'Tips for Effective Online Learning',
        slug: 'tips-for-effective-online-learning',
        content: '',
        featured_image: '/placeholder.svg',
        published_at: '2024-01-14T09:00:00Z',
        reading_time: 8,
        view_count: 89,
        author: {
          display_name: 'Sarah Johnson',
          avatar_url: '/placeholder.svg',
          bio: '',
          social_links: {},
        },
        category: {
          name: 'Education',
          slug: 'education',
        },
        tags: ['online-learning', 'study-tips'],
      },
    ];

    setPost(mockPost);
    setComments(mockComments);
    setRelatedPosts(mockRelatedPosts);
    setIsLoading(false);
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="space-y-6">
              {/* Featured Image */}
              <div className="aspect-video bg-muted relative overflow-hidden rounded-lg">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{post.category.name}</Badge>
                  <span className="text-sm text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.avatar_url} />
                        <AvatarFallback>{post.author.display_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.author.display_name}</p>
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
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? 'text-red-500' : ''}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Post Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Comments Section */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Comments ({comments.length})
                </h3>
                
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.author.avatar_url} />
                            <AvatarFallback>{comment.author.display_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.author.display_name}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Author Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About the Author
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.author.avatar_url} />
                      <AvatarFallback>{post.author.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author.display_name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <div key={relatedPost.id} className="flex gap-3">
                          <img 
                            src={relatedPost.featured_image} 
                            alt={relatedPost.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <Link 
                              to={`/blog/${relatedPost.slug}`}
                              className="font-medium hover:text-primary line-clamp-2"
                            >
                              {relatedPost.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{relatedPost.reading_time} min</span>
                            </div>
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
    </div>
  );
};

export default BlogPost;
