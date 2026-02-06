import { motion } from 'framer-motion'
import { Calendar, User, Paperclip, MessageSquare, CheckSquare } from 'lucide-react'
import { format, parseISO, differenceInHours, isPast } from 'date-fns'
import type { DBTask, DBLabel } from '../types/database'
import { priorityConfig } from '../utils/priorities'

interface TaskCardProps {
  task: DBTask
  index: number
  onClick: () => void
  isSelected?: boolean
  onToggleSelect?: () => void
  labels?: DBLabel[]
}

export function TaskCard({ task, index, onClick, isSelected, onToggleSelect, labels = [] }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  const initials = task.assignees.length > 0
    ? task.assignees[0]
        .split(' ')
        .map(n => n[0])
        .join('')
    : '?'

  const isOverdue = task.dueDate ? isPast(parseISO(task.dueDate)) : false
  const isDueSoon = task.dueDate
    ? differenceInHours(parseISO(task.dueDate), new Date()) <= 48 &&
      differenceInHours(parseISO(task.dueDate), new Date()) > 0
    : false

  const dueDateClass = isOverdue
    ? 'border-2 border-red-400/60'
    : isDueSoon
    ? 'border-2 border-amber-400/60'
    : ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 500, damping: 30 }}
      onClick={onClick}
      className={`paper-texture rounded-lg p-4 cursor-pointer shadow-editorial hover:shadow-editorial-hover transition-shadow duration-200 group ${dueDateClass} ${
        isSelected ? 'ring-2 ring-accent' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>
            {priority.label}
          </span>
          {labels.slice(0, 3).map(label => (
            <span
              key={label.id}
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      </div>

      <h3 className="font-serif text-lg text-card-text leading-tight mb-2 group-hover:text-accent transition-colors">
        {task.title}
      </h3>

      <p className="text-xs text-card-text-muted leading-relaxed mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-card-text/10">
        <div className="flex items-center gap-1.5">
          {task.assignees.length > 1 ? (
            <div className="flex -space-x-1.5">
              {task.assignees.slice(0, 3).map((a, i) => (
                <div
                  key={a}
                  className="w-5 h-5 rounded-full bg-card-text/10 flex items-center justify-center border border-card-bg"
                  style={{ zIndex: 3 - i }}
                >
                  <span className="text-[8px] font-bold text-card-text-muted">
                    {a.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div className="w-5 h-5 rounded-full bg-card-text/10 flex items-center justify-center border border-card-bg">
                  <span className="text-[8px] font-bold text-card-text-muted">+{task.assignees.length - 3}</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="w-5 h-5 rounded-full bg-card-text/10 flex items-center justify-center">
                <span className="text-[9px] font-bold text-card-text-muted">{initials}</span>
              </div>
              <span className="text-[11px] text-card-text-hint">
                {task.assignees[0]?.split(' ')[0] || 'Unassigned'}
              </span>
            </>
          )}
        </div>
        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : isDueSoon ? 'text-amber-400' : 'text-card-text-hint'}`}>
            <Calendar size={11} />
            <span className="text-[11px]">
              {format(parseISO(task.dueDate), 'MMM d')}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
