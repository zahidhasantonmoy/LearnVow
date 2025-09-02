// Accessibility service
'use client';

class AccessibilityService {
  private highContrastMode: boolean = false;
  private textSizeMultiplier: number = 1;
  private dyslexiaFont: boolean = false;

  // Toggle high contrast mode
  toggleHighContrastMode(): void {
    this.highContrastMode = !this.highContrastMode;
    
    if (this.highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Save preference to localStorage
    localStorage.setItem('highContrastMode', this.highContrastMode.toString());
  }
  
  // Set text size multiplier
  setTextSizeMultiplier(multiplier: number): void {
    this.textSizeMultiplier = Math.max(0.5, Math.min(2, multiplier));
    
    // Apply to root element
    document.documentElement.style.fontSize = `${16 * this.textSizeMultiplier}px`;
    
    // Save preference to localStorage
    localStorage.setItem('textSizeMultiplier', this.textSizeMultiplier.toString());
  }
  
  // Toggle dyslexia-friendly font
  toggleDyslexiaFont(): void {
    this.dyslexiaFont = !this.dyslexiaFont;
    
    if (this.dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
    
    // Save preference to localStorage
    localStorage.setItem('dyslexiaFont', this.dyslexiaFont.toString());
  }
  
  // Initialize accessibility settings from localStorage
  initialize(): void {
    // High contrast mode
    const highContrast = localStorage.getItem('highContrastMode');
    if (highContrast === 'true') {
      this.highContrastMode = true;
      document.body.classList.add('high-contrast');
    }
    
    // Text size
    const textSize = localStorage.getItem('textSizeMultiplier');
    if (textSize) {
      this.textSizeMultiplier = parseFloat(textSize);
      document.documentElement.style.fontSize = `${16 * this.textSizeMultiplier}px`;
    }
    
    // Dyslexia font
    const dyslexia = localStorage.getItem('dyslexiaFont');
    if (dyslexia === 'true') {
      this.dyslexiaFont = true;
      document.body.classList.add('dyslexia-font');
    }
  }
  
  // Get current settings
  getSettings(): {
    highContrastMode: boolean;
    textSizeMultiplier: number;
    dyslexiaFont: boolean;
  } {
    return {
      highContrastMode: this.highContrastMode,
      textSizeMultiplier: this.textSizeMultiplier,
      dyslexiaFont: this.dyslexiaFont
    };
  }
  
  // Skip to main content
  skipToMainContent(): void {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.removeAttribute('tabindex');
    }
  }
  
  // Announce message to screen readers
  announce(message: string): void {
    // Create an aria-live region if it doesn't exist
    let announcer = document.getElementById('screen-reader-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    
    // Set the message
    announcer.textContent = message;
  }
}

// Create singleton instance
const accessibilityService = new AccessibilityService();

// Initialize on load
if (typeof window !== 'undefined') {
  accessibilityService.initialize();
}

export default accessibilityService;