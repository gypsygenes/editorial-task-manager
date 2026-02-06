import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Priority, TaskStatus } from '../types'
import { Task } from '../types'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  defaultProjectId: string
}

export function AddTaskModal({ isOpen, onClose, onAdd, defaultProjectId }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [assignee, setAssignee] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'todo' as TaskStatus,
      projectId: defaultProjectId,
      assignee: assignee.trim() || 'Unassigned',
      avatarUrl: '',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      tags: [],
    })

    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setAssignee('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="add-task-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onMouseDown={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-overlay/50" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative bg-secondary border border-border-subtle rounded-2xl shadow-editorial-lg w-full max-w-lg"
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h2 className="font-serif text-xl text-text-primary">New Task</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-text-ghost font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  autoFocus
                  className="w-full bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-text-ghost font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Add details..."
                  rows={3}
                  className="w-full bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-text-ghost font-semibold mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Priority)}
                    className="w-full bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-focus/40 transition-colors appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-text-ghost font-semibold mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-focus/40 transition-colors"
                  />
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-text-ghost font-semibold mb-2">
                  Assignee
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  placeholder="Who's responsible?"
                  className="w-full bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40 transition-colors"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm text-text-hint hover:text-text-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-5 py-2.5 text-sm font-medium bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
