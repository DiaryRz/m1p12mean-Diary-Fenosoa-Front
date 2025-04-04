import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Get a CSS variable value
  getCssVariable(varName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  // DaisyUI Theme Colors
  getThemeColors() {
    return {
      primary: this.getCssVariable('--color-primary'),
      primaryContent: this.getCssVariable('--color-primary-content'),
      secondary: this.getCssVariable('--color-secondary'),
      secondaryContent: this.getCssVariable('--color-secondary-content'),
      accent: this.getCssVariable('--color-accent'),
      accentContent: this.getCssVariable('--color-accent-content'),
      info: this.getCssVariable('--color-info'),
      infoContent: this.getCssVariable('--color-info-content'),
      success: this.getCssVariable('--color-success'),
      successContent: this.getCssVariable('--color-success-content'),
      warning: this.getCssVariable('--color-warning'),
      warningContent: this.getCssVariable('--color-warning-content'),
      error: this.getCssVariable('--color-error'),
      errorContent: this.getCssVariable('--color-error-content'),
      base100: this.getCssVariable('--color-base-100'),
      base200: this.getCssVariable('--color-base-200'),
      base300: this.getCssVariable('--color-base-300'),
      baseContent: this.getCssVariable('--color-base-content'),
    };
  }
}
