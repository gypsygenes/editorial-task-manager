import { useState, useMemo } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isToday, isSameDay, parseISO
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DBTask } from '../types/database'
import { priorityConfig } from '../utils/priorities'

interface CalendarViewProps {
  tasks: DBTask[]
  onTaskClick: (taskId: number) => void
  onAddTask: () => void
}

const priorityDotColors: Record<string, string> = {
  urgent: 'bg-red-400',
  high: 'bg-orange-400',
  medium: 'bg-amber-400',
  low: 'bg-sage',
}

export function CalendarView({ tasks, onTaskClick, onAddTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const tasksByDate = useMemo(() => {
    const map: Record<string, DBTask[]> = {}
    for (const task of tasks) {
      if (task.dueDate) {
        const key = task.dueDate.split('T')[0]
        if (!map[key]) map[key] = []
        map[key].push(task)
      }
    }
    return map
  }, [tasks])

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  return (
    <div className="p-8 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl text-text-primary">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-1.5 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="p-1.5 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <button onClick={goToday} className="text-xs text-accent hover:text-accent-hover font-medium">
          Today
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-[10px] uppercase tracking-wider text-text-ghost font-semibold text-center py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border-subtle/30 rounded-xl overflow-hidden">
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const dayTasks = tasksByDate[key] || []
          const inMonth = isSameMonth(day, currentDate)
          const today = isToday(day)

          return (
            <div
              key={key}
              className={`min-h-[100px] p-2 bg-secondary transition-colors ${
                !inMonth ? 'opacity-40' : ''
              } ${today ? 'border-2 border-accent' : 'border border-transparent'}`}
            >
              <div className={`text-xs font-mono mb-1 ${today ? 'text-accent font-bold' : 'text-text-ghost'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map(task => (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick(task.id!)}
                    className="w-full text-left flex items-center gap-1 group"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDotColors[task.priority]}`} />
                    <span className="text-[10px] text-text-muted truncate group-hover:text-accent transition-colors">
                      {task.title}
                    </span>
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[9px] text-text-ghost">+{dayTasks.length - 3} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
