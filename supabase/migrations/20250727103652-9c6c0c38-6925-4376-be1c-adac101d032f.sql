-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog tags table  
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID NOT NULL,
  category_id UUID REFERENCES public.blog_categories(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
  reading_time INTEGER DEFAULT 5,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog post tags junction table
CREATE TABLE public.blog_post_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  UNIQUE(post_id, tag_id)
);

-- Create blog comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES public.blog_comments(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create author profiles table
CREATE TABLE public.author_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.author_profiles ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (will be enhanced when auth system is fully implemented)
CREATE POLICY "Categories are viewable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Tags are viewable by everyone" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
CREATE POLICY "Users can create their own posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON public.blog_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON public.blog_posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Post tags are viewable by everyone" ON public.blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Comments on published posts are viewable by everyone" ON public.blog_comments FOR SELECT USING (EXISTS (SELECT 1 FROM public.blog_posts WHERE id = post_id AND status = 'published') AND is_approved = true);
CREATE POLICY "Authenticated users can create comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.blog_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.blog_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Author profiles are viewable by everyone" ON public.author_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own author profile" ON public.author_profiles FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON public.blog_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_author_profiles_updated_at BEFORE UPDATE ON public.author_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default categories
INSERT INTO public.blog_categories (name, slug, description) VALUES 
('School Life', 'school-life', 'Posts about daily school activities and events'),
('Academic Excellence', 'academic-excellence', 'Educational content and academic achievements'),
('Sports & Activities', 'sports-activities', 'Sports events and extracurricular activities'),
('Technology', 'technology', 'Tech-related posts and digital learning'),
('Community', 'community', 'Community events and social initiatives');

-- Insert some default tags
INSERT INTO public.blog_tags (name, slug) VALUES 
('Education', 'education'),
('Students', 'students'),
('Teachers', 'teachers'),
('Events', 'events'),
('Achievement', 'achievement'),
('Innovation', 'innovation'),
('Learning', 'learning'),
('Community', 'community');