
import React, { createContext, useContext, ReactNode } from 'react';

type SiteTheme = 'modern' | 'minimal' | 'classic';

interface ThemeConfig {
  name: string;
  heroStyle: string;
  cardStyle: string;
  buttonStyle: string;
  layoutStyle: string;
}

const themes: Record<SiteTheme, ThemeConfig> = {
  modern: {
    name: 'Modern',
    heroStyle: 'bg-gradient-to-br from-primary/10 to-secondary/10',
    cardStyle: 'bg-card rounded-xl shadow-lg border-0',
    buttonStyle: 'rounded-full',
    layoutStyle: 'space-y-12'
  },
  minimal: {
    name: 'Minimal',
    heroStyle: 'bg-background',
    cardStyle: 'bg-card rounded-lg border',
    buttonStyle: 'rounded-md',
    layoutStyle: 'space-y-8'
  },
  classic: {
    name: 'Classic',
    heroStyle: 'bg-card',
    cardStyle: 'bg-background rounded-md border-2',
    buttonStyle: 'rounded-sm',
    layoutStyle: 'space-y-6'
  }
};

interface SiteThemeContextType {
  currentTheme: SiteTheme;
  themeConfig: ThemeConfig;
  setTheme: (theme: SiteTheme) => void;
  getThemeClass: (element: keyof ThemeConfig) => string;
}

const SiteThemeContext = createContext<SiteThemeContextType | undefined>(undefined);

export const useSiteTheme = () => {
  const context = useContext(SiteThemeContext);
  if (!context) {
    throw new Error('useSiteTheme must be used within a SiteThemeProvider');
  }
  return context;
};

interface SiteThemeProviderProps {
  children: ReactNode;
  defaultTheme?: SiteTheme;
}

export const SiteThemeProvider: React.FC<SiteThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'modern' 
}) => {
  const [currentTheme, setCurrentTheme] = React.useState<SiteTheme>(defaultTheme);
  const themeConfig = themes[currentTheme];

  const setTheme = (theme: SiteTheme) => {
    setCurrentTheme(theme);
  };

  const getThemeClass = (element: keyof ThemeConfig) => {
    return themeConfig[element];
  };

  const value: SiteThemeContextType = {
    currentTheme,
    themeConfig,
    setTheme,
    getThemeClass,
  };

  return (
    <SiteThemeContext.Provider value={value}>
      {children}
    </SiteThemeContext.Provider>
  );
};

export { themes };
export type { SiteTheme, ThemeConfig };
