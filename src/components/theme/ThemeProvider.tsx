import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTenant } from '@/hooks/useTenant';

interface ThemeContextType {
  applyTenantTheme: (tenant: any) => void;
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { tenant } = useTenant();

  const hexToHsl = (hex: string): string => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Find greatest and smallest channel values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0; break;
      }
      h /= 6;
    }

    // Convert to degrees and percentages
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
  };

  const applyTenantTheme = (tenantData: any) => {
    if (!tenantData) return;

    const root = document.documentElement;
    
    // Apply theme colors
    if (tenantData.primary_color) {
      root.style.setProperty('--primary', hexToHsl(tenantData.primary_color));
    }
    if (tenantData.secondary_color) {
      root.style.setProperty('--secondary', hexToHsl(tenantData.secondary_color));
    }
    if (tenantData.accent_color) {
      root.style.setProperty('--accent', hexToHsl(tenantData.accent_color));
    }

    // Apply font family
    if (tenantData.font_family) {
      root.style.setProperty('--font-family', tenantData.font_family);
      document.body.style.fontFamily = tenantData.font_family;
    }

    // Apply additional brand settings
    if (tenantData.brand_settings?.custom_css) {
      const styleElement = document.getElementById('tenant-custom-styles');
      if (styleElement) {
        styleElement.innerHTML = tenantData.brand_settings.custom_css;
      } else {
        const newStyleElement = document.createElement('style');
        newStyleElement.id = 'tenant-custom-styles';
        newStyleElement.innerHTML = tenantData.brand_settings.custom_css;
        document.head.appendChild(newStyleElement);
      }
    }
  };

  useEffect(() => {
    if (tenant) {
      applyTenantTheme(tenant);
    }
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