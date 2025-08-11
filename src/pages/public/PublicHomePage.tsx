
import React from 'react';
import { PublicSiteLayout } from '@/components/public/PublicSiteLayout';
import { SiteThemeProvider } from '@/components/public/ThemeProvider';
import { PageBuilder } from '@/components/public/PageBuilder';
import { useTenant } from '@/hooks/useTenant';

export const PublicHomePage: React.FC = () => {
  const { tenant } = useTenant();

  // Mock page builder data - in real app this would come from tenant_pages table
  const defaultSections = [
    {
      id: '1',
      type: 'hero' as const,
      content: {
        title: `Welcome to ${tenant?.name || 'Our School'}`,
        subtitle: 'Empowering minds, shaping futures, building tomorrow\'s leaders',
        primaryCTA: 'Apply Now',
        secondaryCTA: 'Learn More'
      },
      order: 1
    },
    {
      id: '2',
      type: 'highlights' as const,
      content: {
        title: 'Why Choose Us',
        subtitle: 'Discover what makes our school exceptional',
        highlights: [
          {
            title: 'Expert Faculty',
            description: 'Highly qualified and experienced teachers dedicated to student success',
            icon: 'Users'
          },
          {
            title: 'Academic Excellence',
            description: 'Outstanding results with 98% college acceptance rate',
            icon: 'Star'
          },
          {
            title: 'Modern Facilities',
            description: 'State-of-the-art classrooms, labs, and sports facilities',
            icon: 'MapPin'
          }
        ]
      },
      order: 2
    },
    {
      id: '3',
      type: 'events' as const,
      content: {
        title: 'Upcoming Events',
        subtitle: 'Stay updated with our latest events and activities',
        events: [
          {
            title: 'Science Fair 2024',
            date: '2024-03-15',
            description: 'Annual science exhibition showcasing student innovations'
          },
          {
            title: 'Sports Day',
            date: '2024-03-22',
            description: 'Inter-house sports competition and athletic meet'
          },
          {
            title: 'Cultural Festival',
            date: '2024-04-05',
            description: 'Celebrating diversity through music, dance, and arts'
          }
        ]
      },
      order: 3
    },
    {
      id: '4',
      type: 'cta' as const,
      content: {
        title: 'Ready to Join Our Community?',
        subtitle: 'Take the first step towards an excellent education',
        buttonText: 'Apply for Admission'
      },
      order: 4
    },
    {
      id: '5',
      type: 'contact' as const,
      content: {
        title: 'Visit Our Campus',
        subtitle: 'We\'d love to show you around and answer your questions'
      },
      order: 5
    }
  ];

  return (
    <SiteThemeProvider defaultTheme="modern">
      <PublicSiteLayout>
        <PageBuilder sections={defaultSections} />
      </PublicSiteLayout>
    </SiteThemeProvider>
  );
};
