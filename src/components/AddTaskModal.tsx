import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Priority } from '../types'
import type { DBColumn, DBLabel } from '../types/database'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (task: {
    boardId: number
    columnId: number
    title: string
    description: string
    priority: Priority
    assignees: string[]
    dueDate: string | null
    labelIds: number[]
  }) => Promise<number>
  boardId: number | null
  columns: DBColumn[]
  labels: DBLabel[]
}

export function AddTaskModal({ isOpen, onClose, onAdd, boardId, columns, labels }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [assignee, setAssignee] = useState('')
  const [columnId, setColumnId] = useState<number | ''>('')
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !boardId) return

    const targetColumnId = columnId || columns[0]?.id
    if (!targetColumnId) return

    await onAdd({
      boardId,
      columnId: targetColumnId as number,
      title: title.trim(),
      description: description.trim(),
      priority,
      assignees: assignee.trim() ? [assignee.trim()] : [],
      dueDate: dueDate || null,
      labelIds: selectedLabelIds,
    })

    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setAssignee('')
    setColumnId('')
    setSelectedLabelIds([])
    onClose()
  }

  const toggleLabel = (id: number) => {
    setSelectedLabelIds(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
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
          <div className="absolute inset-0 bg-overlay/50" />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative bg-secondary border border-border-subtle rounded-2xl shadow-editorial-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h2 className="font-serif text-xl text-text-primary">New Task</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-text-ghost font-semibold mb-2">
                    Column
                  </label>
                  <select
                    value={columnId}
                    onChange={e => setColumnId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-focus/40 transition-colors appearance-none"
                  >
                    {columns.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Labels */}
              {labels.length > 0 && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-text-ghost font-semibold mb-2">
                    Labels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {labels.map(label => (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleLabel(label.id!)}
                        className={`text-xs px-3 py-1 rounded-full transition-all ${
                          selectedLabelIds.includes(label.id!)
                            ? 'text-white ring-2 ring-offset-1 ring-offset-secondary'
                            : 'text-white/70 opacity-50 hover:opacity-75'
                        }`}
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
