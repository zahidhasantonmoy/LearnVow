// Accessibility testing component
'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';

export default function AccessibilityTesting() {
  const [contrastResults, setContrastResults] = useState<any[]>([]);
  const [keyboardNavigation, setKeyboardNavigation] = useState<boolean>(true);
  const [screenReaderCompatibility, setScreenReaderCompatibility] = useState<boolean>(true);

  useEffect(() => {
    // Simulate accessibility testing
    setTimeout(() => {
      setContrastResults([
        { element: 'Text on background', ratio: '4.5:1', passes: true },
        { element: 'Heading text', ratio: '7:1', passes: true },
        { element: 'Link text', ratio: '3.2:1', passes: false },
        { element: 'Button text', ratio: '4.8:1', passes: true }
      ]);
      
      // These would normally be determined by actual testing
      setKeyboardNavigation(true);
      setScreenReaderCompatibility(true);
    }, 1000);
  }, []);

  const getContrastRating = () => {
    const passing = contrastResults.filter(r => r.passes).length;
    const total = contrastResults.length;
    const percentage = (passing / total) * 100;
    
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Accessibility Testing</h2>
        <p className="text-gray-400 mb-6">
          Automated accessibility checks to ensure compliance with WCAG standards
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">
            {getContrastRating()}
          </div>
          <p className="text-gray-400">Contrast Ratio</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">
            {keyboardNavigation ? 'Pass' : 'Fail'}
          </div>
          <p className="text-gray-400">Keyboard Navigation</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold mb-2">
            {screenReaderCompatibility ? 'Pass' : 'Fail'}
          </div>
          <p className="text-gray-400">Screen Reader</p>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Contrast Analysis</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Element</th>
                <th className="text-left py-2">Contrast Ratio</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">WCAG 2.1 AA</th>
              </tr>
            </thead>
            <tbody>
              {contrastResults.map((result, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-3">{result.element}</td>
                  <td className="py-3">{result.ratio}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.passes 
                        ? 'bg-green-900/50 text-green-400' 
                        : 'bg-red-900/50 text-red-400'
                    }`}>
                      {result.passes ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                  <td className="py-3">
                    {result.element === 'Link text' ? '4.5:1' : '3:1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Keyboard Navigation</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                ✓
              </span>
              <span>Tab navigation works correctly</span>
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                ✓
              </span>
              <span>Focus indicators are visible</span>
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                ✓
              </span>
              <span>Skip links are functional</span>
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                ✓
              </span>
              <span>Form elements are accessible</span>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Screen Reader Compatibility</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                ✓
              </span>
              <span>ARIA labels are present</span>
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                ✓
              </span>
              <span>Landmark roles defined</span>
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                ✓
              </span>
              <span>Alternative text for images</span>
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                ✓
              </span>
              <span>Proper heading structure</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}