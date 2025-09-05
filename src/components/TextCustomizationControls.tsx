// Text customization controls component
'use client';

import { useState } from 'react';
import { useReadingSettings, FONT_FAMILIES, FONT_SIZES } from '@/contexts/ReadingSettingsContext';
import { FiSettings, FiX, FiRotateCcw } from 'react-icons/fi';

export default function TextCustomizationControls() {
  const { settings, updateSettings, resetSettings } = useReadingSettings();
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating button */}
      <button
        onClick={togglePanel}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        aria-label="Text customization settings"
      >
        {isOpen ? <FiX size={20} /> : <FiSettings size={20} />}
      </button>

      {/* Settings panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-4 transform transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Text Settings</h3>
            <button
              onClick={resetSettings}
              className="text-gray-400 hover:text-white flex items-center text-sm"
              aria-label="Reset to default settings"
            >
              <FiRotateCcw className="mr-1" size={16} />
              Reset
            </button>
          </div>

          <div className="space-y-5">
            {/* Font Size */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Font Size: {settings.fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="40"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Line Spacing: {settings.lineHeight.toFixed(1)}
              </label>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Tight</span>
                <span>Loose</span>
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Letter Spacing: {settings.letterSpacing}px
              </label>
              <input
                type="range"
                min="-2"
                max="5"
                step="0.5"
                value={settings.letterSpacing}
                onChange={(e) => updateSettings({ letterSpacing: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Tighter</span>
                <span>Wider</span>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Font Family
              </label>
              <select
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {FONT_FAMILIES.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview */}
            <div className="pt-2 border-t border-gray-700">
              <p 
                className="text-gray-300 italic"
                style={{
                  fontSize: `${settings.fontSize}px`,
                  fontFamily: settings.fontFamily,
                  lineHeight: settings.lineHeight,
                  letterSpacing: `${settings.letterSpacing}px`
                }}
              >
                This is a preview of how your text will look with the current settings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}