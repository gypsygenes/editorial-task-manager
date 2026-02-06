import { format, parseISO } from 'date-fns'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { DBTask, DBColumn, DBLabel } from '../types/database'
import { priorityConfig } from '../utils/priorities'

interface ListViewProps {
  tasks: DBTask[]
  columns: DBColumn[]
  labels: DBLabel[]
  onTaskClick: (taskId: number) => void
  onMoveTask: (taskId: number, columnId: number) => Promise<void>
  selectedTaskIds: Set<number>
  onToggleTaskSelection: (taskId: number) => void
}

export function ListView({
  tasks,
  columns,
  labels,
  onTaskClick,
  onMoveTask,
  selectedTaskIds,
  onToggleTaskSelection,
}: ListViewProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="p-8 overflow-auto h-full">
      <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[40px_1fr_120px_100px_150px_120px_100px] gap-2 px-4 py-3 border-b border-border-subtle bg-tertiary/50 text-[10px] uppercase tracking-wider text-text-ghost font-semibold">
          <div />
          <div>Title</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Assignees</div>
          <div>Due Date</div>
          <div>Labels</div>
        </div>

        {/* Rows */}
        {tasks.map(task => {
          const priority = priorityConfig[task.priority]
          const column = columns.find(c => c.id === task.columnId)
          const taskLabels = labels.filter(l => task.labelIds.includes(l.id!))
          const isExpanded = expandedId === task.id

          return (
            <div key={task.id}>
              <div
                className={`grid grid-cols-[40px_1fr_120px_100px_150px_120px_100px] gap-2 px-4 py-3 border-b border-border-subtle/50 hover:bg-text-primary/5 cursor-pointer transition-colors items-center ${
                  selectedTaskIds.has(task.id!) ? 'bg-accent/5' : ''
                }`}
                onClick={() => onTaskClick(task.id!)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.has(task.id!)}
                    onChange={e => { e.stopPropagation(); onToggleTaskSelection(task.id!) }}
                    className="w-3.5 h-3.5 rounded accent-accent cursor-pointer"
                  />
                  <button
                    onClick={e => { e.stopPropagation(); setExpandedId(isExpanded ? null : task.id!) }}
                    className="text-text-ghost hover:text-text-muted"
                  >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                </div>
                <span className="text-sm text-text-primary truncate font-medium">{task.title}</span>
                <div>
                  <select
                    value={task.columnId}
                    onChange={e => { e.stopPropagation(); onMoveTask(task.id!, Number(e.target.value)) }}
                    onClick={e => e.stopPropagation()}
                    className="text-xs bg-tertiary border border-border-subtle rounded px-2 py-1 text-text-muted appearance-none cursor-pointer"
                  >
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block w-fit ${priority.bg} ${priority.color}`}>
                  {priority.label}
                </span>
                <div className="flex items-center gap-1">
                  {task.assignees.slice(0, 2).map(a => (
                    <span key={a} className="text-xs text-text-muted">{a.split(' ')[0]}</span>
                  ))}
                </div>
                <span className="text-xs text-text-ghost">
                  {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : '—'}
                </span>
                <div className="flex gap-1">
                  {taskLabels.slice(0, 2).map(l => (
                    <span
                      key={l.id}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: l.color }}
                      title={l.name}
                    />
                  ))}
                </div>
              </div>

              {isExpanded && (
                <div className="px-12 py-3 border-b border-border-subtle/50 bg-tertiary/30">
                  <p className="text-xs text-text-muted leading-relaxed">{task.description || 'No description'}</p>
                </div>
              )}
            </div>
          )
        })}

        {tasks.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-text-ghost">No tasks found</div>
        )}
      </div>
    </div>
  )
}
