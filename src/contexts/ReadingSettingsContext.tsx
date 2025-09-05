// Reading settings context for text customization
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ReadingSettings {
  fontSize: number; // Base font size in pixels
  fontFamily: string; // Font family
  lineHeight: number; // Line height multiplier
  letterSpacing: number; // Letter spacing in pixels
  wordSpacing: number; // Word spacing in pixels
  maxWidth: number; // Max width of text container in pixels
}

interface ReadingSettingsContextType {
  settings: ReadingSettings;
  updateSettings: (newSettings: Partial<ReadingSettings>) => void;
  resetSettings: () => void;
}

const ReadingSettingsContext = createContext<ReadingSettingsContextType | undefined>(undefined);

// Default reading settings
const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  fontFamily: 'Inter, sans-serif',
  lineHeight: 1.6,
  letterSpacing: 0,
  wordSpacing: 0,
  maxWidth: 800
};

// Available font families
export const FONT_FAMILIES = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'OpenDyslexic', value: "'OpenDyslexic', Arial, sans-serif" }
];

// Available font sizes (in pixels)
export const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40];

export function ReadingSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('readingSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsedSettings
        });
      } catch (error) {
        console.error('Error parsing saved reading settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem('readingSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const value = {
    settings,
    updateSettings,
    resetSettings
  };

  return (
    <ReadingSettingsContext.Provider value={value}>
      {children}
    </ReadingSettingsContext.Provider>
  );
}

export function useReadingSettings() {
  const context = useContext(ReadingSettingsContext);
  if (context === undefined) {
    throw new Error('useReadingSettings must be used within a ReadingSettingsProvider');
  }
  return context;
}