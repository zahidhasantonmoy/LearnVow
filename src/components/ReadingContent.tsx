// Reading content component that applies text customization settings
'use client';

import { useReadingSettings } from '@/contexts/ReadingSettingsContext';

interface ReadingContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function ReadingContent({ children, className = '' }: ReadingContentProps) {
  const { settings } = useReadingSettings();

  return (
    <div 
      className={className}
      style={{
        maxWidth: `${settings.maxWidth}px`,
        margin: '0 auto',
        fontSize: `${settings.fontSize}px`,
        fontFamily: settings.fontFamily,
        lineHeight: settings.lineHeight,
        letterSpacing: `${settings.letterSpacing}px`,
        wordSpacing: `${settings.wordSpacing}px`,
        padding: '0 1rem'
      }}
    >
      {children}
    </div>
  );
}