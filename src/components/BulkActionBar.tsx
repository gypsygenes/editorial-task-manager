import { motion, AnimatePresence } from 'framer-motion'
import { X, MoveRight, Archive, Tag } from 'lucide-react'
import type { DBColumn } from '../types/database'

interface BulkActionBarProps {
  selectedCount: number
  columns: DBColumn[]
  onMove: (columnId: number) => void
  onArchive: () => void
  onClear: () => void
}

export function BulkActionBar({ selectedCount, columns, onMove, onArchive, onClear }: BulkActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-accent text-white rounded-full px-6 py-3 shadow-editorial-lg flex items-center gap-4"
        >
          <span className="text-sm font-medium">{selectedCount} selected</span>

          <div className="w-px h-5 bg-white/20" />

          {/* Move To */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-sm hover:text-white/80 transition-colors">
              <MoveRight size={14} />
              Move to
            </button>
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
              <div className="bg-secondary border border-border-subtle rounded-lg shadow-editorial-lg py-1 min-w-[140px]">
                {columns.map(col => (
                  <button
                    key={col.id}
                    onClick={() => onMove(col.id!)}
                    className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-text-primary/5 flex items-center gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${col.color}`} />
                    {col.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onArchive}
            className="flex items-center gap-1.5 text-sm hover:text-white/80 transition-colors"
          >
            <Archive size={14} />
            Archive
          </button>

          <div className="w-px h-5 bg-white/20" />

          <button
            onClick={onClear}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
