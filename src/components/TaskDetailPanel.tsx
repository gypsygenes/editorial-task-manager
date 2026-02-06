import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, Tag, Flag, Clock, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Task } from '../types'
import { priorityConfig } from '../utils/priorities'

interface TaskDetailPanelProps {
  task: Task | null
  onClose: () => void
  onDelete: (id: string) => void
}

export function TaskDetailPanel({ task, onClose, onDelete }: TaskDetailPanelProps) {
  return (
    <AnimatePresence>
      {task && (
        <motion.div
          key="task-detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-[560px] max-w-[90vw] bg-surface border-l border-border-subtle shadow-editorial-lg overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface border-b border-border-subtle p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    priorityConfig[task.priority].bg
                  } ${priorityConfig[task.priority].color}`}
                >
                  {priorityConfig[task.priority].label}
                </span>
                <span className="text-xs text-cream/25 font-mono uppercase">
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-cream/30 hover:text-cream/60 hover:bg-cream/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="font-serif text-3xl text-cream leading-tight mb-4">
                {task.title}
              </h2>

              <p className="text-sm text-cream/50 leading-relaxed mb-8">
                {task.description}
              </p>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-light rounded-lg p-4">
                  <div className="flex items-center gap-2 text-cream/30 mb-2">
                    <User size={13} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      Assignee
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cream/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-cream/50">
                        {task.assignee
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </span>
                    </div>
                    <span className="text-sm text-cream/70">{task.assignee}</span>
                  </div>
                </div>

                <div className="bg-surface-light rounded-lg p-4">
                  <div className="flex items-center gap-2 text-cream/30 mb-2">
                    <Calendar size={13} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      Due Date
                    </span>
                  </div>
                  <span className="text-sm text-cream/70">
                    {format(parseISO(task.dueDate), 'MMMM d, yyyy')}
                  </span>
                </div>

                <div className="bg-surface-light rounded-lg p-4">
                  <div className="flex items-center gap-2 text-cream/30 mb-2">
                    <Flag size={13} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      Priority
                    </span>
                  </div>
                  <span className={`text-sm ${priorityConfig[task.priority].color}`}>
                    {priorityConfig[task.priority].label}
                  </span>
                </div>

                <div className="bg-surface-light rounded-lg p-4">
                  <div className="flex items-center gap-2 text-cream/30 mb-2">
                    <Clock size={13} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">
                      Created
                    </span>
                  </div>
                  <span className="text-sm text-cream/70">
                    {format(parseISO(task.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <div className="flex items-center gap-2 text-cream/30 mb-3">
                  <Tag size={13} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    Tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-cream/5 text-cream/50 border border-cream/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-border-subtle pt-6">
                <button
                  onClick={() => {
                    onDelete(task.id)
                    onClose()
                  }}
                  className="flex items-center gap-2 text-sm text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Delete task</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
