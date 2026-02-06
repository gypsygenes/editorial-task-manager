import { useEffect, useCallback } from 'react'

interface ShortcutConfig {
  onNewTask: () => void
  onSearch: () => void
  onClosePanel: () => void
  onShowShortcuts: () => void
}

export function useKeyboardShortcuts({
  onNewTask,
  onSearch,
  onClosePanel,
  onShowShortcuts,
}: ShortcutConfig) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        // Only handle Escape in inputs
        if (e.key === 'Escape') {
          ;(target as HTMLInputElement).blur()
        }
        return
      }

      switch (e.key) {
        case 'n':
          e.preventDefault()
          onNewTask()
          break
        case '/':
          e.preventDefault()
          onSearch()
          break
        case 'Escape':
          onClosePanel()
          break
        case '?':
          e.preventDefault()
          onShowShortcuts()
          break
      }
    },
    [onNewTask, onSearch, onClosePanel, onShowShortcuts]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
