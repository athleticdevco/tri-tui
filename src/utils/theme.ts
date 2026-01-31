import { execSync } from 'child_process';

export type TerminalTheme = 'dark' | 'light';

/**
 * Detect terminal theme (dark vs light background)
 *
 * Checks multiple signals:
 * 1. COLORFGBG env var (format: "fg;bg" where bg 0=black, 15=white)
 * 2. macOS system appearance
 * 3. Known terminal defaults
 * 4. Falls back to 'dark' (most common for dev terminals)
 */
export function detectTerminalTheme(): TerminalTheme {
  // 1. Check COLORFGBG (set by many terminals)
  const colorFgBg = process.env.COLORFGBG;
  if (colorFgBg) {
    const parts = colorFgBg.split(';');
    const bg = parseInt(parts[parts.length - 1], 10);
    // bg colors: 0=black, 7=white, 15=bright white
    if (bg === 0 || bg === 8) return 'dark';
    if (bg === 7 || bg === 15) return 'light';
  }

  // 2. macOS: Check system appearance
  if (process.platform === 'darwin') {
    try {
      const result = execSync('defaults read -g AppleInterfaceStyle 2>/dev/null', {
        encoding: 'utf-8',
        timeout: 500,
      }).trim();
      if (result === 'Dark') return 'dark';
      return 'light'; // If no Dark mode set, system is light
    } catch {
      // Command fails if in light mode (key doesn't exist)
      return 'light';
    }
  }

  // 3. Default to dark (most dev terminals are dark-themed)
  return 'dark';
}

// Cache the result since it won't change during runtime
let cachedTheme: TerminalTheme | null = null;

export function getTerminalTheme(): TerminalTheme {
  if (cachedTheme === null) {
    cachedTheme = detectTerminalTheme();
  }
  return cachedTheme;
}

// Color schemes for logo based on theme
export interface LogoColors {
  primary: string;
  shadow: string;
  tagline: string;
}

export function getLogoColors(): LogoColors {
  const theme = getTerminalTheme();

  if (theme === 'light') {
    return {
      primary: 'black',
      shadow: 'blackBright',  // dark gray
      tagline: 'blackBright',
    };
  } else {
    return {
      primary: 'white',
      shadow: 'gray',  // lighter gray for depth on dark bg
      tagline: 'gray',
    };
  }
}
