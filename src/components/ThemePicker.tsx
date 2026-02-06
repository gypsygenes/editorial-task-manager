import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { ACCENT_THEMES, ThemeMode } from '../types/theme'

const modeButtons: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: 'light', icon: Sun, label: 'Light' },
  { mode: 'dark', icon: Moon, label: 'Dark' },
  { mode: 'system', icon: Monitor, label: 'System' },
]

export function ThemePicker() {
  const { mode, setMode, accent, setAccent } = useTheme()

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex items-center bg-primary/50 border border-border-subtle rounded-lg p-0.5">
        {modeButtons.map(({ mode: m, icon: Icon, label }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            title={label}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs transition-colors ${
              mode === m
                ? 'bg-accent text-white'
                : 'text-text-hint hover:text-text-secondary'
            }`}
          >
            <Icon size={12} />
            <span className="hidden min-[320px]:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Accent picker */}
      <div className="flex items-center gap-2">
        {ACCENT_THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setAccent(t.id)}
            title={t.label}
            className={`w-5 h-5 rounded-full transition-all ${
              accent === t.id
                ? 'ring-2 ring-offset-2 ring-offset-secondary ring-text-primary/30 scale-110'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: t.hex }}
          />
        ))}
      </div>
    </div>
  )
}
