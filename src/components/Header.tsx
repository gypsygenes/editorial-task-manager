import { Search, LayoutGrid, List, Plus, User } from 'lucide-react'
import { ViewMode } from '../types'

interface HeaderProps {
  projectName: string
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onAddTask: () => void
}

export function Header({
  projectName,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onAddTask,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-border-subtle flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <h2 className="font-serif text-2xl text-cream">{projectName}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/25"
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="bg-surface-light border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-vermillion/40 transition-colors w-56"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-surface-light border border-border-subtle rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange('kanban')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'kanban'
                ? 'bg-vermillion text-white'
                : 'text-cream/30 hover:text-cream/50'
            }`}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-vermillion text-white'
                : 'text-cream/30 hover:text-cream/50'
            }`}
          >
            <List size={14} />
          </button>
        </div>

        {/* Add Task */}
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 bg-vermillion hover:bg-vermillion-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center ml-2">
          <User size={14} className="text-cream/40" />
        </div>
      </div>
    </header>
  )
}
