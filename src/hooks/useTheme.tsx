
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTenant } from './useTenant';

interface ThemeContextType {
  applyTenantTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { tenant } = useTenant();

  const applyTenantTheme = () => {
    if (!tenant) return;

    const root = document.documentElement;
    
    // Convert hex colors to HSL for CSS custom properties
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    // Apply colors
    root.style.setProperty('--primary', hexToHsl(tenant.primary_color));
    root.style.setProperty('--secondary', hexToHsl(tenant.secondary_color));
    root.style.setProperty('--accent', hexToHsl(tenant.accent_color));

    // Apply font family
    root.style.setProperty('--font-family', tenant.font_family);
    document.body.style.fontFamily = tenant.font_family;
  };

  useEffect(() => {
    applyTenantTheme();
  }, [tenant]);

  const value: ThemeContextType = {
    applyTenantTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
