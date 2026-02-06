export type ThemeMode = 'light' | 'dark' | 'system'
export type AccentTheme = 'vermillion' | 'ocean' | 'amethyst' | 'rose' | 'emerald'

export interface AccentConfig {
  id: AccentTheme
  label: string
  hex: string
}

export const ACCENT_THEMES: AccentConfig[] = [
  { id: 'vermillion', label: 'Vermillion', hex: '#FF4D00' },
  { id: 'ocean', label: 'Ocean', hex: '#2563EB' },
  { id: 'amethyst', label: 'Amethyst', hex: '#8B5CF6' },
  { id: 'rose', label: 'Rose', hex: '#E11D48' },
  { id: 'emerald', label: 'Emerald', hex: '#059669' },
]
