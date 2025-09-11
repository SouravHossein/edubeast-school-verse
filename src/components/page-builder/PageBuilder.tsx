import React from 'react';
import { PageSection } from '@/hooks/usePageCustomization';
import { HeroSection } from './sections/HeroSection';
import { TextBlockSection } from './sections/TextBlockSection';
import { ImageGallerySection } from './sections/ImageGallerySection';
import { ContactFormSection } from './sections/ContactFormSection';
import { HighlightsSection } from './sections/HighlightsSection';
import { CTASection } from './sections/CTASection';

interface PageBuilderProps {
  sections: PageSection[];
  isEditable?: boolean;
  onUpdateSection?: (sectionId: string, newProps: any) => void;
  onDeleteSection?: (sectionId: string) => void;
  onReorderSections?: (sections: PageSection[]) => void;
}

export const PageBuilder: React.FC<PageBuilderProps> = ({
  sections,
  isEditable = false,
  onUpdateSection,
  onDeleteSection,
  onReorderSections,
}) => {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const renderSection = (section: PageSection) => {
    const commonProps = {
      key: section.id,
      id: section.id,
      isEditable,
      onUpdate: onUpdateSection ? (newProps: any) => onUpdateSection(section.id, newProps) : undefined,
      onDelete: onDeleteSection ? () => onDeleteSection(section.id) : undefined,
    };

    switch (section.type) {
      case 'hero':
        return <HeroSection {...commonProps} {...section.props} />;
      case 'text_block':
        return <TextBlockSection {...commonProps} {...section.props} />;
      case 'image_gallery':
        return <ImageGallerySection {...commonProps} {...section.props} />;
      case 'contact_form':
        return <ContactFormSection {...commonProps} {...section.props} />;
      case 'highlights':
        return <HighlightsSection {...commonProps} {...section.props} />;
      case 'cta':
        return <CTASection {...commonProps} {...section.props} />;
      default:
        return (
          <div key={section.id} className="p-4 bg-muted rounded">
            Unknown section type: {section.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {sortedSections.map(renderSection)}
    </div>
  );
};