import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { Priority } from '../types'
import type { DBLabel, TaskFilters } from '../types/database'

interface FilterPanelProps {
  isOpen: boolean
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
  labels: DBLabel[]
}

const priorities: Priority[] = ['urgent', 'high', 'medium', 'low']

export function FilterPanel({ isOpen, filters, onFiltersChange, labels }: FilterPanelProps) {
  const togglePriority = (p: Priority) => {
    const current = filters.priority || []
    const next = current.includes(p) ? current.filter(x => x !== p) : [...current, p]
    onFiltersChange({ ...filters, priority: next.length > 0 ? next : undefined })
  }

  const toggleLabel = (id: number) => {
    const current = filters.labelIds || []
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    onFiltersChange({ ...filters, labelIds: next.length > 0 ? next : undefined })
  }

  const clearAll = () => onFiltersChange({})

  const activeCount = [
    filters.priority?.length,
    filters.labelIds?.length,
    filters.assignee,
    filters.hasAttachments,
  ].filter(Boolean).length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden border-b border-border-subtle"
        >
          <div className="px-8 py-4 flex items-start gap-8">
            {/* Priority */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-text-ghost font-semibold block mb-2">
                Priority
              </span>
              <div className="flex gap-1.5">
                {priorities.map(p => (
                  <button
                    key={p}
                    onClick={() => togglePriority(p)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
                      filters.priority?.includes(p)
                        ? 'bg-accent/10 border-accent/30 text-accent'
                        : 'border-border-subtle text-text-ghost hover:text-text-muted'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Labels */}
            {labels.length > 0 && (
              <div>
                <span className="text-[10px] uppercase tracking-wider text-text-ghost font-semibold block mb-2">
                  Labels
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {labels.map(label => (
                    <button
                      key={label.id}
                      onClick={() => toggleLabel(label.id!)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1.5 ${
                        filters.labelIds?.includes(label.id!)
                          ? 'border-accent/30 bg-accent/10'
                          : 'border-border-subtle hover:border-text-ghost/30'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
                      <span className="text-text-muted">{label.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Assignee */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-text-ghost font-semibold block mb-2">
                Assignee
              </span>
              <input
                type="text"
                value={filters.assignee || ''}
                onChange={e => onFiltersChange({ ...filters, assignee: e.target.value || undefined })}
                placeholder="Filter by name..."
                className="bg-tertiary border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40 w-36"
              />
            </div>

            {/* Clear */}
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover mt-5"
              >
                <X size={12} />
                Clear all
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
