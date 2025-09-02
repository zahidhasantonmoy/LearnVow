// Accessibility toolbar component
'use client';

import { useState, useEffect } from 'react';
import accessibilityService from '@/services/accessibility';
import Button from '@/components/ui/Button';
import { FiEye, FiType, FiBook, FiX } from 'react-icons/fi';

export default function AccessibilityToolbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    textSize: 1,
    dyslexiaFont: false
  });

  useEffect(() => {
    // Load initial settings
    const currentSettings = accessibilityService.getSettings();
    setSettings({
      highContrast: currentSettings.highContrastMode,
      textSize: currentSettings.textSizeMultiplier,
      dyslexiaFont: currentSettings.dyslexiaFont
    });
  }, []);

  const toggleHighContrast = () => {
    accessibilityService.toggleHighContrastMode();
    setSettings(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };

  const adjustTextSize = (delta: number) => {
    const newSize = Math.max(0.5, Math.min(2, settings.textSize + delta));
    accessibilityService.setTextSizeMultiplier(newSize);
    setSettings(prev => ({
      ...prev,
      textSize: newSize
    }));
  };

  const toggleDyslexiaFont = () => {
    accessibilityService.toggleDyslexiaFont();
    setSettings(prev => ({
      ...prev,
      dyslexiaFont: !prev.dyslexiaFont
    }));
  };

  const skipToMainContent = () => {
    accessibilityService.skipToMainContent();
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Open accessibility options"
      >
        <FiType className="text-xl" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 w-80">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-bold">Accessibility Options</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white focus:outline-none"
          aria-label="Close accessibility options"
        >
          <FiX />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <button
            onClick={skipToMainContent}
            className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Skip to main content
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiEye className="mr-2" />
            <span>High Contrast</span>
          </div>
          <button
            onClick={toggleHighContrast}
            className={`w-12 h-6 rounded-full relative focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              settings.highContrast ? 'bg-indigo-600' : 'bg-gray-600'
            }`}
            aria-label={settings.highContrast ? 'Disable high contrast' : 'Enable high contrast'}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.highContrast ? 'transform translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FiType className="mr-2" />
              <span>Text Size</span>
            </div>
            <span className="text-sm text-gray-400">
              {Math.round(settings.textSize * 100)}%
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => adjustTextSize(-0.1)}
              disabled={settings.textSize <= 0.5}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Smaller
            </Button>
            <Button
              onClick={() => adjustTextSize(0.1)}
              disabled={settings.textSize >= 2}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Larger
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiBook className="mr-2" />
            <span>Dyslexia Font</span>
          </div>
          <button
            onClick={toggleDyslexiaFont}
            className={`w-12 h-6 rounded-full relative focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              settings.dyslexiaFont ? 'bg-indigo-600' : 'bg-gray-600'
            }`}
            aria-label={settings.dyslexiaFont ? 'Disable dyslexia font' : 'Enable dyslexia font'}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.dyslexiaFont ? 'transform translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-gray-900 text-sm text-gray-400">
        These settings are saved in your browser
      </div>
    </div>
  );
}