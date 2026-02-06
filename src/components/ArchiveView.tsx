import { useState } from 'react'
import { Search, RotateCcw, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useTasksDB } from '../hooks/useTasksDB'
import { priorityConfig } from '../utils/priorities'

export function ArchiveView() {
  const { archivedTasks, restoreTask, deleteTask } = useTasksDB()
  const [search, setSearch] = useState('')

  const filtered = search
    ? archivedTasks.filter(
        t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      )
    : archivedTasks

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-text-primary">Archive</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-ghost" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search archive..."
            className="bg-tertiary border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40 w-56"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-text-ghost text-center py-12">
          {search ? 'No archived tasks match your search.' : 'No archived tasks.'}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const priority = priorityConfig[task.priority]
            return (
              <div
                key={task.id}
                className="bg-secondary border border-border-subtle rounded-xl p-4 flex items-center gap-4 hover:bg-text-primary/5 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>
                      {priority.label}
                    </span>
                    <h3 className="text-sm font-medium text-text-primary truncate">{task.title}</h3>
                  </div>
                  <p className="text-xs text-text-ghost truncate">{task.description}</p>
                  {task.archivedAt && (
                    <span className="text-[10px] text-text-ghost/60">
                      Archived {format(parseISO(task.archivedAt), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restoreTask(task.id!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent hover:text-accent-hover bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors"
                  >
                    <RotateCcw size={12} />
                    Restore
                  </button>
                  <button
                    onClick={() => deleteTask(task.id!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
