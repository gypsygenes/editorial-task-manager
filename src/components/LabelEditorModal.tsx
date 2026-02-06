import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Edit3 } from 'lucide-react'
import type { DBLabel } from '../types/database'

interface LabelEditorModalProps {
  isOpen: boolean
  onClose: () => void
  labels: DBLabel[]
  taskLabelIds: number[]
  onAddLabel: (data: { projectId: number; name: string; color: string }) => Promise<number>
  onDeleteLabel: (id: number) => Promise<void>
  onAssignLabel: (taskId: number, labelId: number) => Promise<void>
  onUnassignLabel: (taskId: number, labelId: number) => Promise<void>
  taskId: number
  projectId: number
}

const PRESET_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16',
  '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6',
  '#A855F7', '#EC4899', '#F43F5E', '#6B7280',
]

export function LabelEditorModal({
  isOpen,
  onClose,
  labels,
  taskLabelIds,
  onAddLabel,
  onDeleteLabel,
  onAssignLabel,
  onUnassignLabel,
  taskId,
  projectId,
}: LabelEditorModalProps) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) return
    await onAddLabel({ projectId, name: newName.trim(), color: newColor })
    setNewName('')
    setShowCreate(false)
  }

  const toggleLabel = (labelId: number) => {
    if (taskLabelIds.includes(labelId)) {
      onUnassignLabel(taskId, labelId)
    } else {
      onAssignLabel(taskId, labelId)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-overlay/40" />

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative bg-secondary border border-border-subtle rounded-2xl shadow-editorial-lg w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary">Labels</h3>
              <button onClick={onClose} className="p-1 text-text-ghost hover:text-text-muted">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
              {labels.map(label => (
                <div key={label.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => toggleLabel(label.id!)}
                    className="flex-1 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-text-primary/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={taskLabelIds.includes(label.id!)}
                      readOnly
                      className="w-3.5 h-3.5 rounded accent-accent"
                    />
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: label.color }} />
                    <span className="text-sm text-text-secondary">{label.name}</span>
                  </button>
                  <button
                    onClick={() => onDeleteLabel(label.id!)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-ghost hover:text-red-400 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Create new */}
            <div className="p-4 border-t border-border-subtle">
              {showCreate ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Label name"
                    autoFocus
                    className="w-full bg-tertiary border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setNewColor(c)}
                        className={`w-6 h-6 rounded-md transition-all ${
                          newColor === c ? 'ring-2 ring-offset-1 ring-offset-secondary ring-text-primary/30 scale-110' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreate}
                      disabled={!newName.trim()}
                      className="px-3 py-1.5 text-xs font-medium bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-lg"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreate(false)}
                      className="px-3 py-1.5 text-xs text-text-ghost hover:text-text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 text-xs text-accent hover:text-accent-hover"
                >
                  <Plus size={14} />
                  Create new label
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
