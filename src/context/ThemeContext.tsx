import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { ThemeMode, AccentTheme } from '../types/theme'

const STORAGE_KEY = 'editorial-theme'

interface ThemeContextValue {
  mode: ThemeMode
  resolvedMode: 'light' | 'dark'
  accent: AccentTheme
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: AccentTheme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemPreference(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function loadStored(): { mode: ThemeMode; accent: AccentTheme } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        mode: parsed.mode || 'dark',
        accent: parsed.accent || 'vermillion',
      }
    }
  } catch {}
  return { mode: 'dark', accent: 'vermillion' }
}

function applyToDOM(resolvedMode: 'light' | 'dark', accent: AccentTheme) {
  const html = document.documentElement
  html.classList.toggle('dark', resolvedMode === 'dark')
  html.classList.toggle('light', resolvedMode === 'light')
  html.setAttribute('data-accent', accent)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => loadStored().mode)
  const [accent, setAccentState] = useState<AccentTheme>(() => loadStored().accent)
  const [systemPref, setSystemPref] = useState<'light' | 'dark'>(getSystemPreference)

  const resolvedMode: 'light' | 'dark' = mode === 'system' ? systemPref : mode

  // Listen for OS preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemPref(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Apply to DOM whenever resolved mode or accent changes
  useEffect(() => {
    applyToDOM(resolvedMode, accent)
  }, [resolvedMode, accent])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, accent }))
  }, [mode, accent])

  const setMode = useCallback((m: ThemeMode) => setModeState(m), [])
  const setAccent = useCallback((a: AccentTheme) => setAccentState(a), [])

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, accent, setMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
