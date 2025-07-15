import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SchoolConfig {
  // Basic School Information
  schoolName: string;
  schoolLogo?: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  schoolWebsite?: string;
  
  // Academic Configuration
  academicYear: string;
  gradeSystem: 'letter' | 'percentage' | 'points';
  maxGrade: number;
  passingGrade: number;
  
  // Feature Toggles (Modular Features)
  features: {
    attendanceManagement: boolean;
    onlineExams: boolean;
    libraryManagement: boolean;
    transportManagement: boolean;
    hostelManagement: boolean;
    feeManagement: boolean;
    parentPortal: boolean;
    studentPortal: boolean;
    teacherPortal: boolean;
    messagingSystem: boolean;
    eventManagement: boolean;
    reportCards: boolean;
    disciplineTracking: boolean;
    healthRecords: boolean;
  };
  
  // System Settings
  timeZone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  currency: string;
  language: string;
  
  // Theme and Branding
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customCSS?: string;
}

const defaultConfig: SchoolConfig = {
  schoolName: 'EduBeast School',
  schoolAddress: '',
  schoolPhone: '',
  schoolEmail: '',
  academicYear: '2024-2025',
  gradeSystem: 'letter',
  maxGrade: 100,
  passingGrade: 60,
  features: {
    attendanceManagement: true,
    onlineExams: true,
    libraryManagement: true,
    transportManagement: false,
    hostelManagement: false,
    feeManagement: true,
    parentPortal: true,
    studentPortal: true,
    teacherPortal: true,
    messagingSystem: true,
    eventManagement: true,
    reportCards: true,
    disciplineTracking: false,
    healthRecords: false,
  },
  timeZone: 'UTC',
  dateFormat: 'DD/MM/YYYY',
  currency: 'USD',
  language: 'en',
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  accentColor: '#f59e0b',
};

interface SchoolConfigContextType {
  config: SchoolConfig;
  updateConfig: (newConfig: Partial<SchoolConfig>) => void;
  toggleFeature: (feature: keyof SchoolConfig['features']) => void;
  isFeatureEnabled: (feature: keyof SchoolConfig['features']) => boolean;
  resetToDefaults: () => void;
}

const SchoolConfigContext = createContext<SchoolConfigContextType | undefined>(undefined);

export const SchoolConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SchoolConfig>(() => {
    // Try to load from localStorage, fallback to defaults
    const savedConfig = localStorage.getItem('edubeast-school-config');
    if (savedConfig) {
      try {
        return { ...defaultConfig, ...JSON.parse(savedConfig) };
      } catch (error) {
        console.error('Error parsing saved config:', error);
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem('edubeast-school-config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<SchoolConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
      features: newConfig.features ? { ...prev.features, ...newConfig.features } : prev.features,
    }));
  };

  const toggleFeature = (feature: keyof SchoolConfig['features']) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const isFeatureEnabled = (feature: keyof SchoolConfig['features']) => {
    return config.features[feature];
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    localStorage.removeItem('edubeast-school-config');
  };

  return (
    <SchoolConfigContext.Provider
      value={{
        config,
        updateConfig,
        toggleFeature,
        isFeatureEnabled,
        resetToDefaults,
      }}
    >
      {children}
    </SchoolConfigContext.Provider>
  );
};

export const useSchoolConfig = () => {
  const context = useContext(SchoolConfigContext);
  if (context === undefined) {
    throw new Error('useSchoolConfig must be used within a SchoolConfigProvider');
  }
  return context;
};

// Helper hook for conditional rendering based on features
export const useFeatureFlag = (feature: keyof SchoolConfig['features']) => {
  const { isFeatureEnabled } = useSchoolConfig();
  return isFeatureEnabled(feature);
};