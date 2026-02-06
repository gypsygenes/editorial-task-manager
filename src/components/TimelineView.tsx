import { useState, useMemo } from 'react'
import {
  startOfWeek, endOfWeek, addDays, addWeeks, subWeeks,
  differenceInDays, format, isToday, parseISO, startOfDay, max, min
} from 'date-fns'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import type { DBTask } from '../types/database'
import { priorityConfig } from '../utils/priorities'

interface TimelineViewProps {
  tasks: DBTask[]
  onTaskClick: (taskId: number) => void
}

type Zoom = 'day' | 'week' | 'month'

const priorityBarColors: Record<string, string> = {
  urgent: 'bg-red-400',
  high: 'bg-orange-400',
  medium: 'bg-amber-400',
  low: 'bg-sage',
}

export function TimelineView({ tasks, onTaskClick }: TimelineViewProps) {
  const [startDate, setStartDate] = useState(() => startOfWeek(new Date()))
  const [zoom, setZoom] = useState<Zoom>('week')

  const dayCount = zoom === 'day' ? 7 : zoom === 'week' ? 14 : 30
  const endDate = addDays(startDate, dayCount)

  const days = useMemo(() => {
    const result = []
    for (let i = 0; i < dayCount; i++) {
      result.push(addDays(startDate, i))
    }
    return result
  }, [startDate, dayCount])

  const tasksWithDates = tasks.filter(t => t.dueDate)

  const prev = () => setStartDate(d => addDays(d, -dayCount))
  const next = () => setStartDate(d => addDays(d, dayCount))
  const goToday = () => setStartDate(startOfWeek(new Date()))

  const dayWidth = 100 / dayCount

  return (
    <div className="p-8 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl text-text-primary">Timeline</h2>
          <div className="flex items-center gap-1">
            <button onClick={prev} className="p-1.5 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5">
              <ChevronLeft size={16} />
            </button>
            <button onClick={next} className="p-1.5 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5">
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="text-sm text-text-muted">
            {format(startDate, 'MMM d')} — {format(addDays(endDate, -1), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goToday} className="text-xs text-accent hover:text-accent-hover font-medium">
            Today
          </button>
          <div className="flex items-center bg-tertiary border border-border-subtle rounded-lg p-0.5 ml-2">
            {(['day', 'week', 'month'] as Zoom[]).map(z => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors ${
                  zoom === z ? 'bg-accent text-white' : 'text-text-ghost hover:text-text-muted'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="bg-secondary border border-border-subtle rounded-xl overflow-hidden">
        {/* Day headers */}
        <div className="flex border-b border-border-subtle">
          <div className="w-[200px] flex-shrink-0 px-4 py-2 border-r border-border-subtle bg-tertiary/50">
            <span className="text-[10px] uppercase tracking-wider text-text-ghost font-semibold">Task</span>
          </div>
          <div className="flex-1 flex">
            {days.map(day => (
              <div
                key={day.toISOString()}
                style={{ width: `${dayWidth}%` }}
                className={`text-center py-2 text-[10px] border-r border-border-subtle/30 ${
                  isToday(day) ? 'bg-accent/10 text-accent font-bold' : 'text-text-ghost'
                }`}
              >
                {format(day, zoom === 'month' ? 'd' : 'EEE d')}
              </div>
            ))}
          </div>
        </div>

        {/* Task rows */}
        {tasksWithDates.map(task => {
          const dueDate = parseISO(task.dueDate!)
          const taskStart = startOfDay(addDays(dueDate, -2)) // Assume 2-day duration for display
          const taskEnd = startOfDay(dueDate)

          const offsetDays = Math.max(0, differenceInDays(taskStart, startDate))
          const durationDays = Math.max(1, differenceInDays(taskEnd, taskStart) + 1)
          const leftPercent = (offsetDays / dayCount) * 100
          const widthPercent = Math.min((durationDays / dayCount) * 100, 100 - leftPercent)

          if (leftPercent >= 100) return null

          return (
            <div key={task.id} className="flex border-b border-border-subtle/50 hover:bg-text-primary/5">
              <div className="w-[200px] flex-shrink-0 px-4 py-3 border-r border-border-subtle flex items-center gap-2">
                <span className="text-xs text-text-secondary truncate">{task.title}</span>
              </div>
              <div className="flex-1 relative h-[40px]">
                {/* Today line */}
                {days.some(d => isToday(d)) && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10"
                    style={{ left: `${(differenceInDays(new Date(), startDate) / dayCount) * 100}%` }}
                  />
                )}
                {/* Task bar */}
                <button
                  onClick={() => onTaskClick(task.id!)}
                  className={`absolute top-2 h-6 rounded-md ${priorityBarColors[task.priority]} hover:opacity-80 transition-opacity cursor-pointer`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${Math.max(widthPercent, dayWidth)}%`,
                  }}
                  title={`${task.title} — Due: ${format(dueDate, 'MMM d')}`}
                >
                  <span className="text-[10px] text-white px-2 truncate block leading-6">
                    {task.title}
                  </span>
                </button>
              </div>
            </div>
          )
        })}

        {tasksWithDates.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-text-ghost">
            No tasks with due dates
          </div>
        )}
      </div>
    </div>
  )
}
