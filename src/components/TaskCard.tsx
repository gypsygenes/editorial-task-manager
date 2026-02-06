import { motion } from 'framer-motion'
import { Calendar, User } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Task } from '../types'
import { priorityConfig } from '../utils/priorities'

interface TaskCardProps {
  task: Task
  index: number
  onClick: () => void
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  const initials = task.assignee
    .split(' ')
    .map(n => n[0])
    .join('')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 500, damping: 30 }}
      onClick={onClick}
      className="paper-texture rounded-lg p-4 cursor-pointer shadow-editorial hover:shadow-editorial-hover transition-shadow duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}
        >
          {priority.label}
        </span>
        <div className="flex gap-1">
          {task.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider text-card-text-hint font-medium"
            >
              {tag}
            </span>
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
          <div className="w-5 h-5 rounded-full bg-card-text/10 flex items-center justify-center">
            <span className="text-[9px] font-bold text-card-text-muted">{initials}</span>
          </div>
          <span className="text-[11px] text-card-text-hint">{task.assignee.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-1 text-card-text-hint">
          <Calendar size={11} />
          <span className="text-[11px]">
            {format(parseISO(task.dueDate), 'MMM d')}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
