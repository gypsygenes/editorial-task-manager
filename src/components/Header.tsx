import { Search, LayoutGrid, List, Calendar, GanttChart, Plus, User, Filter, ArrowUpDown } from 'lucide-react'
import { ViewMode } from '../types'
import type { TaskSortField } from '../types/database'

interface HeaderProps {
  projectName: string
  boardName: string
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onAddTask: () => void
  sortField: TaskSortField
  onSortChange: (field: TaskSortField) => void
  showFilterPanel: boolean
  onToggleFilterPanel: () => void
  filterCount: number
}

const viewButtons: { mode: ViewMode; icon: typeof LayoutGrid; label: string }[] = [
  { mode: 'kanban', icon: LayoutGrid, label: 'Kanban' },
  { mode: 'list', icon: List, label: 'List' },
  { mode: 'calendar', icon: Calendar, label: 'Calendar' },
  { mode: 'timeline', icon: GanttChart, label: 'Timeline' },
]

export function Header({
  projectName,
  boardName,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onAddTask,
  sortField,
  onSortChange,
  showFilterPanel,
  onToggleFilterPanel,
  filterCount,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-border-subtle flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-2xl text-text-primary">{projectName}</h2>
        {boardName && (
          <>
            <span className="text-text-ghost">/</span>
            <span className="text-sm text-text-muted">{boardName}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-ghost" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="bg-tertiary border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40 transition-colors w-56"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-tertiary border border-border-subtle rounded-lg p-0.5">
          {viewButtons.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              title={label}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === mode
                  ? 'bg-accent text-white'
                  : 'text-text-ghost hover:text-text-muted'
              }`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortField}
            onChange={e => onSortChange(e.target.value as TaskSortField)}
            className="bg-tertiary border border-border-subtle rounded-lg pl-8 pr-3 py-2 text-xs text-text-muted focus:outline-none focus:border-accent-focus/40 appearance-none cursor-pointer"
          >
            <option value="position">Manual</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Created</option>
            <option value="title">Alphabetical</option>
          </select>
          <ArrowUpDown size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-ghost pointer-events-none" />
        </div>

        {/* Filter */}
        <button
          onClick={onToggleFilterPanel}
          className={`relative p-2 rounded-lg border transition-colors ${
            showFilterPanel
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'bg-tertiary border-border-subtle text-text-ghost hover:text-text-muted'
          }`}
        >
          <Filter size={14} />
          {filterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[9px] rounded-full flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>

        {/* Add Task */}
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} />
          <span>New Task</span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-text-primary/10 flex items-center justify-center ml-2">
          <User size={14} className="text-text-hint" />
        </div>
      </div>
    </header>
  )
}
