import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Camera, 
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: 'events' | 'achievements' | 'sports' | 'cultural' | 'academic';
  date: string;
  images: string[];
  participants?: number;
  featured?: boolean;
}

export const PublicGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock gallery data
  const galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Annual Sports Day 2024',
      description: 'Students showcase their athletic talents in various sports competitions',
      category: 'sports',
      date: '2024-03-15',
      images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'],
      participants: 250,
      featured: true,
    },
    {
      id: '2',
      title: 'Science Fair Excellence',
      description: 'Outstanding projects from our young scientists',
      category: 'academic',
      date: '2024-02-28',
      images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'],
      participants: 120,
    },
    {
      id: '3',
      title: 'Cultural Festival Celebrations',
      description: 'Vibrant performances celebrating diversity and traditions',
      category: 'cultural',
      date: '2024-01-20',
      images: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop'],
      participants: 180,
    },
    {
      id: '4',
      title: 'National Mathematics Olympiad Winners',
      description: 'Our students excel in national mathematics competition',
      category: 'achievements',
      date: '2024-03-10',
      images: ['https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop'],
      participants: 15,
      featured: true,
    },
    {
      id: '5',
      title: 'Graduation Ceremony 2024',
      description: 'Celebrating the achievements of our graduating class',
      category: 'events',
      date: '2024-03-20',
      images: ['https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=300&fit=crop'],
      participants: 300,
    },
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Camera },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'sports', label: 'Sports', icon: Users },
    { id: 'cultural', label: 'Cultural', icon: Users },
    { id: 'academic', label: 'Academic', icon: Users },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      events: 'bg-blue-100 text-blue-800',
      achievements: 'bg-yellow-100 text-yellow-800',
      sports: 'bg-green-100 text-green-800',
      cultural: 'bg-purple-100 text-purple-800',
      academic: 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            School Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore memorable moments, achievements, and events from our vibrant school community
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Featured Items */}
        {selectedCategory === 'all' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-primary" />
              Featured Highlights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {galleryItems.filter(item => item.featured).map((item) => (
                <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className="relative">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-64 object-cover cursor-pointer"
                      onClick={() => setSelectedImage(item.images[0])}
                    />
                    <Badge 
                      className={`absolute top-4 left-4 ${getCategoryColor(item.category)}`}
                    >
                      {item.category}
                    </Badge>
                    <Badge variant="secondary" className="absolute top-4 right-4">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      {item.participants && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{item.participants} participants</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-md hover:shadow-lg transition-all">
              <div className="relative">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedImage(item.images[0])}
                />
                <Badge 
                  className={`absolute top-3 left-3 ${getCategoryColor(item.category)}`}
                >
                  {item.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  {item.participants && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{item.participants}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No images found
            </h3>
            <p className="text-muted-foreground">
              No images available for the selected category.
            </p>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Gallery image"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download functionality
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Share functionality
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedImage(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};