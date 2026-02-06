import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { useChecklist } from '../hooks/useChecklist'

interface ChecklistTabProps {
  taskId: number
}

export function ChecklistTab({ taskId }: ChecklistTabProps) {
  const { items, addItem, updateItem, toggleItem, deleteItem, progress } = useChecklist(taskId)
  const [newText, setNewText] = useState('')
  const [hideCompleted, setHideCompleted] = useState(false)

  const handleAdd = async () => {
    if (!newText.trim()) return
    await addItem(taskId, newText.trim())
    setNewText('')
  }

  const displayItems = hideCompleted ? items.filter(i => !i.completed) : items

  return (
    <div>
      {/* Progress */}
      {items.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-ghost">
              {progress.done}/{progress.total} completed
            </span>
            <button
              onClick={() => setHideCompleted(v => !v)}
              className="text-[10px] text-text-ghost hover:text-text-muted transition-colors"
            >
              {hideCompleted ? 'Show completed' : 'Hide completed'}
            </button>
          </div>
          <div className="w-full h-1.5 bg-text-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-1">
        {displayItems.map(item => (
          <div key={item.id} className="flex items-center gap-3 group py-1.5 px-2 rounded-lg hover:bg-text-primary/5">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id!)}
              className="w-4 h-4 rounded border-border-subtle accent-accent cursor-pointer"
            />
            <span
              className={`flex-1 text-sm ${
                item.completed ? 'line-through text-text-ghost' : 'text-text-secondary'
              }`}
            >
              {item.text}
            </span>
            <button
              onClick={() => deleteItem(item.id!)}
              className="opacity-0 group-hover:opacity-100 p-1 text-text-ghost hover:text-red-400 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add checklist item..."
          className="flex-1 bg-tertiary border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="p-2 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 text-white transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}
