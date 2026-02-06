import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface KeyboardShortcutsOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface ShortcutGroup {
  title: string
  shortcuts: { keys: string[]; description: string }[]
}

const groups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['/'], description: 'Focus search' },
      { keys: ['Esc'], description: 'Close panel/modal' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
    ],
  },
  {
    title: 'Tasks',
    shortcuts: [
      { keys: ['N'], description: 'New task' },
    ],
  },
]

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-tertiary border border-border-subtle rounded text-[11px] font-mono text-text-secondary shadow-sm">
      {children}
    </kbd>
  )
}

export function KeyboardShortcutsOverlay({ isOpen, onClose }: KeyboardShortcutsOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-overlay/50" />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative bg-secondary border border-border-subtle rounded-2xl shadow-editorial-lg w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h2 className="font-serif text-xl text-text-primary">Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {groups.map(group => (
                <div key={group.title}>
                  <h3 className="text-[10px] uppercase tracking-wider text-text-ghost font-semibold mb-3">
                    {group.title}
                  </h3>
                  <div className="space-y-2">
                    {group.shortcuts.map(shortcut => (
                      <div
                        key={shortcut.description}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-text-muted">{shortcut.description}</span>
                        <div className="flex gap-1">
                          {shortcut.keys.map(key => (
                            <Kbd key={key}>{key}</Kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
