import { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useNotifications } from '../hooks/useNotifications'

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(v => !v)}
        className="relative p-2 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5 transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-secondary" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-secondary border border-border-subtle rounded-xl shadow-editorial-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <span className="text-sm font-medium text-text-primary">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[10px] text-accent hover:text-accent-hover"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-ghost">
                No notifications
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id!)}
                  className={`w-full text-left px-4 py-3 border-b border-border-subtle/50 hover:bg-text-primary/5 transition-colors flex gap-3 ${
                    !n.read ? 'bg-accent/5' : ''
                  }`}
                >
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  )}
                  <div className={!n.read ? '' : 'ml-5'}>
                    <p className="text-xs font-medium text-text-secondary">{n.title}</p>
                    <p className="text-[11px] text-text-ghost mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-text-ghost/60">
                      {format(parseISO(n.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
