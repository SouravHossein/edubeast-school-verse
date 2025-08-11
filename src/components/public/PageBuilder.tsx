
import React from 'react';
import { useSiteTheme } from './ThemeProvider';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Star, Quote } from 'lucide-react';

interface PageSection {
  id: string;
  type: 'hero' | 'highlights' | 'events' | 'gallery' | 'testimonials' | 'cta' | 'contact';
  content: Record<string, any>;
  order: number;
}

interface PageBuilderProps {
  sections: PageSection[];
}

export const PageBuilder: React.FC<PageBuilderProps> = ({ sections }) => {
  const { getThemeClass } = useSiteTheme();
  const { tenant } = useTenant();

  const sortedSections = sections.sort((a, b) => a.order - b.order);

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} content={section.content} />;
      case 'highlights':
        return <HighlightsSection key={section.id} content={section.content} />;
      case 'events':
        return <EventsSection key={section.id} content={section.content} />;
      case 'gallery':
        return <GallerySection key={section.id} content={section.content} />;
      case 'testimonials':
        return <TestimonialsSection key={section.id} content={section.content} />;
      case 'cta':
        return <CTASection key={section.id} content={section.content} />;
      case 'contact':
        return <ContactSection key={section.id} content={section.content} />;
      default:
        return null;
    }
  };

  return (
    <div className={getThemeClass('layoutStyle')}>
      {sortedSections.map(renderSection)}
    </div>
  );
};

const HeroSection: React.FC<{ content: any }> = ({ content }) => {
  const { getThemeClass } = useSiteTheme();
  const { tenant } = useTenant();

  return (
    <section className={`py-20 ${getThemeClass('heroStyle')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {content.title || `Welcome to ${tenant?.name}`}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {content.subtitle || 'Providing quality education and nurturing future leaders'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className={getThemeClass('buttonStyle')}>
              {content.primaryCTA || 'Apply Now'}
            </Button>
            <Button variant="outline" size="lg" className={getThemeClass('buttonStyle')}>
              {content.secondaryCTA || 'Learn More'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const HighlightsSection: React.FC<{ content: any }> = ({ content }) => {
  const { getThemeClass } = useSiteTheme();
  
  const highlights = content.highlights || [
    { icon: Users, title: 'Expert Faculty', description: 'Highly qualified and experienced teachers' },
    { icon: Star, title: 'Academic Excellence', description: 'Outstanding results and achievements' },
    { icon: MapPin, title: 'Modern Facilities', description: 'State-of-the-art infrastructure' }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content.title || 'Why Choose Us'}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {content.subtitle || 'Discover what makes our school special'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((highlight: any, index: number) => {
            const IconComponent = highlight.icon || Star;
            return (
              <Card key={index} className={getThemeClass('cardStyle')}>
                <CardContent className="p-6 text-center">
                  <IconComponent className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const EventsSection: React.FC<{ content: any }> = ({ content }) => {
  const { getThemeClass } = useSiteTheme();
  
  const events = content.events || [
    { title: 'Science Fair 2024', date: '2024-03-15', description: 'Annual science exhibition' },
    { title: 'Sports Day', date: '2024-03-22', description: 'Inter-house sports competition' },
    { title: 'Cultural Festival', date: '2024-04-05', description: 'Celebrating diversity and culture' }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content.title || 'Upcoming Events'}</h2>
          <p className="text-muted-foreground">
            {content.subtitle || 'Stay updated with our latest events and activities'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event: any, index: number) => (
            <Card key={index} className={getThemeClass('cardStyle')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const GallerySection: React.FC<{ content: any }> = ({ content }) => {
  const { getThemeClass } = useSiteTheme();
  
  const images = content.images || [];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content.title || 'Gallery'}</h2>
          <p className="text-muted-foreground">
            {content.subtitle || 'Glimpses of life at our school'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image: any, index: number) => (
            <div key={index} className="aspect-square overflow-hidden rounded-lg">
              <img 
                src={image.url} 
                alt={image.caption || 'Gallery image'}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: React.FC<{ content: any }> = ({ content }) => {
  const { getThemeClass } = useSiteTheme();
  
  const testimonials = content.testimonials || [];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content.title || 'What People Say'}</h2>
          <p className="text-muted-foreground">
            {content.subtitle || 'Hear from our community'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial: any, index: number) => (
            <Card key={index} className={getThemeClass('cardStyle')}>
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary mb-4" />
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC<{ content: any }> = ({ content }) => {
  const { getThemeClass } = useSiteTheme();

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Card className={`${getThemeClass('cardStyle')} bg-primary text-primary-foreground`}>
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">
              {content.title || 'Ready to Join Us?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {content.subtitle || 'Take the first step towards an excellent education'}
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className={getThemeClass('buttonStyle')}
            >
              {content.buttonText || 'Apply Now'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

const ContactSection: React.FC<{ content: any }> = ({ content }) => {
  const { getThemeClass } = useSiteTheme();
  const { tenant } = useTenant();

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{content.title || 'Contact Us'}</h2>
          <p className="text-muted-foreground">
            {content.subtitle || 'Get in touch with us'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className={getThemeClass('cardStyle')}>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tenant?.address && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  <span>{tenant.address}</span>
                </div>
              )}
              {tenant?.contact_phone && (
                <div className="flex items-center">
                  <span className="w-5 h-5 text-primary mr-3">📞</span>
                  <span>{tenant.contact_phone}</span>
                </div>
              )}
              {tenant?.contact_email && (
                <div className="flex items-center">
                  <span className="w-5 h-5 text-primary mr-3">📧</span>
                  <span>{tenant.contact_email}</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className={getThemeClass('cardStyle')}>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full p-3 border rounded-md"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full p-3 border rounded-md"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full p-3 border rounded-md"
                />
                <Button className={`w-full ${getThemeClass('buttonStyle')}`}>
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
