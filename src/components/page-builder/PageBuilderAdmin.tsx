import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageBuilder } from './PageBuilder';
import { usePageCustomization, PageSection } from '@/hooks/usePageCustomization';
import { Plus, Eye, Save, RotateCcw, Settings } from 'lucide-react';
import { toast } from 'sonner';

export const PageBuilderAdmin: React.FC = () => {
  const {
    pageTemplates,
    sectionTemplates,
    customizations,
    isLoading,
    getPageCustomization,
    saveCustomization,
    resetToDefault,
    isSaving,
    isResetting,
  } = usePageCustomization();

  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (selectedPage) {
      loadPageSections();
    }
  }, [selectedPage]);

  const loadPageSections = async () => {
    try {
      const customization = await getPageCustomization(selectedPage);
      if (customization && typeof customization === 'object' && (customization as any).sections) {
        setSections((customization as any).sections);
      } else {
        // Load default sections from template
        const template = pageTemplates?.find(t => t.page_slug === selectedPage);
        if (template && (template as any).default_sections) {
          setSections((template as any).default_sections);
        }
      }
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading page sections:', error);
      toast.error('Failed to load page sections');
    }
  };

  const handleUpdateSection = (sectionId: string, newProps: any) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, props: { ...section.props, ...newProps } }
        : section
    ));
    setHasChanges(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    setHasChanges(true);
  };

  const handleReorderSections = (reorderedSections: PageSection[]) => {
    setSections(reorderedSections);
    setHasChanges(true);
  };

  const addNewSection = (sectionType: string) => {
    const template = sectionTemplates?.find(t => t.section_type === sectionType);
    if (!template) return;

    const newSection: PageSection = {
      id: `section_${Date.now()}`,
      type: sectionType,
      order: sections.length,
      props: template.default_props,
    };

    setSections(prev => [...prev, newSection]);
    setHasChanges(true);
  };

  const handleSave = async (publish = false) => {
    try {
      await saveCustomization({
        pageSlug: selectedPage,
        customizationData: {
          sections,
          theme: {},
          seo: {},
        },
        isPublished: publish,
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving customization:', error);
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefault(selectedPage);
      await loadPageSections();
    } catch (error) {
      console.error('Error resetting page:', error);
    }
  };

  const getPageTypeColor = (type: string) => {
    switch (type) {
      case 'fully_customizable':
        return 'bg-green-500';
      case 'semi_customizable':
        return 'bg-yellow-500';
      case 'lightly_customizable':
        return 'bg-orange-500';
      case 'not_customizable':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading page builder...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Page Builder</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
          {hasChanges && (
            <>
              <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={() => handleSave(true)} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList className="grid w-full grid-cols-4">
          {pageTemplates?.slice(0, 4).map((template) => (
            <TabsTrigger key={template.id} value={template.page_slug}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getPageTypeColor(template.page_type)}`}
                />
                {template.page_title}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {pageTemplates?.map((template) => (
          <TabsContent key={template.id} value={template.page_slug} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Page Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Page Type</div>
                      <Badge variant="outline" className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getPageTypeColor(template.page_type)}`}
                        />
                        {template.page_type.replace('_', ' ')}
                      </Badge>
                    </div>

                    {template.page_type === 'fully_customizable' && (
                      <div>
                        <Button
                          variant="outline"
                          onClick={handleReset}
                          disabled={isResetting}
                          className="w-full"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset to Default
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Section Library */}
                {template.page_type === 'fully_customizable' && !isPreviewMode && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Sections</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {sectionTemplates?.map((section) => (
                        <Button
                          key={section.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addNewSection(section.section_type)}
                          className="w-full justify-start"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {section.section_name}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-0">
                    <PageBuilder
                      sections={sections}
                      isEditable={!isPreviewMode && template.page_type === 'fully_customizable'}
                      onUpdateSection={handleUpdateSection}
                      onDeleteSection={handleDeleteSection}
                      onReorderSections={handleReorderSections}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};