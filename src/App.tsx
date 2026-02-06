import { useState, useEffect, useCallback, useRef } from 'react'
import { ViewMode } from './types'
import type { TaskFilters, TaskSortField, SortDirection } from './types/database'
import { seedDatabase } from './database/seed'
import { useProjects } from './hooks/useProjects'
import { useBoards } from './hooks/useBoards'
import { useColumns } from './hooks/useColumns'
import { useTasksDB } from './hooks/useTasksDB'
import { useLabels } from './hooks/useLabels'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useToast } from './context/ToastContext'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { KanbanBoard } from './components/KanbanBoard'
import { ListView } from './components/ListView'
import { CalendarView } from './components/CalendarView'
import { TimelineView } from './components/TimelineView'
import { TaskDetailPanel } from './components/TaskDetailPanel'
import { AddTaskModal } from './components/AddTaskModal'
import { FilterPanel } from './components/FilterPanel'
import { BulkActionBar } from './components/BulkActionBar'
import { ToastContainer } from './components/Toast'
import { ActivityFeed } from './components/ActivityFeed'
import { ArchiveView } from './components/ArchiveView'
import { TemplatePicker } from './components/TemplatePicker'
import { KeyboardShortcutsOverlay } from './components/KeyboardShortcutsOverlay'

export default function App() {
  const [dbReady, setDbReady] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null)
  const [activeBoardId, setActiveBoardId] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortField, setSortField] = useState<TaskSortField>('position')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filters, setFilters] = useState<TaskFilters>({})
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [sidebarView, setSidebarView] = useState<'board' | 'activity' | 'archive' | 'templates'>('board')
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set())

  const searchInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // DB hooks
  const { projects } = useProjects()
  const { boards } = useBoards(activeProjectId)
  const { columns } = useColumns(activeBoardId)
  const { labels } = useLabels(activeProjectId)
  const {
    tasks,
    getTasksByColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    archiveTask,
    restoreTask,
    duplicateTask,
    sortTasks,
    bulkMove,
    bulkArchive,
    taskCounts,
  } = useTasksDB(activeBoardId)

  // Initialize DB
  useEffect(() => {
    seedDatabase().then(() => setDbReady(true))
  }, [])

  // Auto-select first project & board
  useEffect(() => {
    if (dbReady && projects.length > 0 && activeProjectId === null) {
      setActiveProjectId(projects[0].id!)
    }
  }, [dbReady, projects, activeProjectId])

  useEffect(() => {
    if (boards.length > 0 && activeBoardId === null) {
      setActiveBoardId(boards[0].id!)
    }
  }, [boards, activeBoardId])

  // Reset board when project changes
  useEffect(() => {
    setActiveBoardId(null)
  }, [activeProjectId])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: () => setIsModalOpen(true),
    onSearch: () => searchInputRef.current?.focus(),
    onClosePanel: () => {
      if (showShortcuts) setShowShortcuts(false)
      else if (selectedTaskId) setSelectedTaskId(null)
      else if (isModalOpen) setIsModalOpen(false)
    },
    onShowShortcuts: () => setShowShortcuts(v => !v),
  })

  const handleSelectProject = useCallback((id: number | null) => {
    setActiveProjectId(id)
    setSidebarView('board')
  }, [])

  const handleSelectBoard = useCallback((boardId: number, projectId: number) => {
    setActiveProjectId(projectId)
    setActiveBoardId(boardId)
    setSidebarView('board')
  }, [])

  const handleAddTask = useCallback(async (data: Parameters<typeof addTask>[0]) => {
    const id = await addTask(data)
    toast('success', 'Task created')
    return id
  }, [addTask, toast])

  const handleDeleteTask = useCallback(async (id: number) => {
    await deleteTask(id)
    toast('info', 'Task deleted')
  }, [deleteTask, toast])

  const handleArchiveTask = useCallback(async (id: number) => {
    await archiveTask(id)
    toast('info', 'Task archived', {
      label: 'Undo',
      onClick: () => restoreTask(id),
    })
  }, [archiveTask, restoreTask, toast])

  const handleDuplicateTask = useCallback(async (id: number) => {
    const newId = await duplicateTask(id)
    toast('success', 'Task duplicated')
    return newId
  }, [duplicateTask, toast])

  const handleMoveTask = useCallback(async (taskId: number, newColumnId: number, newPosition?: number) => {
    await moveTask(taskId, newColumnId, newPosition)
  }, [moveTask])

  // Bulk actions
  const toggleTaskSelection = useCallback((taskId: number) => {
    setSelectedTaskIds(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedTaskIds(new Set()), [])

  const handleBulkMove = useCallback(async (columnId: number) => {
    await bulkMove(Array.from(selectedTaskIds), columnId)
    toast('success', `Moved ${selectedTaskIds.size} tasks`)
    clearSelection()
  }, [bulkMove, selectedTaskIds, toast, clearSelection])

  const handleBulkArchive = useCallback(async () => {
    await bulkArchive(Array.from(selectedTaskIds))
    toast('info', `Archived ${selectedTaskIds.size} tasks`)
    clearSelection()
  }, [bulkArchive, selectedTaskIds, toast, clearSelection])

  const activeProject = projects.find(p => p.id === activeProjectId) ?? null
  const activeBoard = boards.find(b => b.id === activeBoardId) ?? null
  const projectName = activeProject ? activeProject.name : 'All Tasks'
  const boardName = activeBoard ? activeBoard.name : ''

  // Filter tasks for non-kanban views
  const filteredTasks = sortTasks(
    tasks.filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (
          !t.title.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q) &&
          !t.assignees.some(a => a.toLowerCase().includes(q))
        ) return false
      }
      if (filters.priority?.length && !filters.priority.includes(t.priority)) return false
      if (filters.labelIds?.length && !t.labelIds.some(l => filters.labelIds!.includes(l))) return false
      if (filters.assignee && !t.assignees.some(a => a.toLowerCase().includes(filters.assignee!.toLowerCase()))) return false
      return true
    }),
    sortField,
    sortDirection
  )

  if (!dbReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary">
        <div className="text-text-ghost text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          projects={projects}
          activeProjectId={activeProjectId}
          activeBoardId={activeBoardId}
          onSelectProject={handleSelectProject}
          onSelectBoard={handleSelectBoard}
          sidebarView={sidebarView}
          onSidebarViewChange={setSidebarView}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {sidebarView === 'board' && (
            <>
              <Header
                projectName={projectName}
                boardName={boardName}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onAddTask={() => setIsModalOpen(true)}
                sortField={sortField}
                onSortChange={setSortField}
                showFilterPanel={showFilterPanel}
                onToggleFilterPanel={() => setShowFilterPanel(v => !v)}
                filterCount={Object.values(filters).filter(Boolean).length}
              />

              <FilterPanel
                isOpen={showFilterPanel}
                filters={filters}
                onFiltersChange={setFilters}
                labels={labels}
              />

              <main className="flex-1 overflow-hidden">
                {viewMode === 'kanban' && activeBoardId && (
                  <KanbanBoard
                    columns={columns}
                    getTasksByColumn={getTasksByColumn}
                    searchQuery={searchQuery}
                    onMoveTask={handleMoveTask}
                    onTaskClick={setSelectedTaskId}
                    onAddTask={() => setIsModalOpen(true)}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    sortTasks={sortTasks}
                    selectedTaskIds={selectedTaskIds}
                    onToggleTaskSelection={toggleTaskSelection}
                    labels={labels}
                  />
                )}

                {viewMode === 'list' && (
                  <ListView
                    tasks={filteredTasks}
                    columns={columns}
                    labels={labels}
                    onTaskClick={setSelectedTaskId}
                    onMoveTask={async (taskId, colId) => { await handleMoveTask(taskId, colId) }}
                    selectedTaskIds={selectedTaskIds}
                    onToggleTaskSelection={toggleTaskSelection}
                  />
                )}

                {viewMode === 'calendar' && (
                  <CalendarView
                    tasks={filteredTasks}
                    onTaskClick={setSelectedTaskId}
                    onAddTask={() => setIsModalOpen(true)}
                  />
                )}

                {viewMode === 'timeline' && (
                  <TimelineView
                    tasks={filteredTasks}
                    onTaskClick={setSelectedTaskId}
                  />
                )}
              </main>
            </>
          )}

          {sidebarView === 'activity' && <ActivityFeed />}
          {sidebarView === 'archive' && <ArchiveView />}
          {sidebarView === 'templates' && <TemplatePicker projectId={activeProjectId} />}
        </div>
      </div>

      <TaskDetailPanel
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onDelete={handleDeleteTask}
        onUpdate={updateTask}
        onArchive={handleArchiveTask}
        onDuplicate={handleDuplicateTask}
        boardId={activeBoardId}
        projectId={activeProjectId}
        columns={columns}
        labels={labels}
      />

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
        boardId={activeBoardId}
        columns={columns}
        labels={labels}
      />

      <BulkActionBar
        selectedCount={selectedTaskIds.size}
        columns={columns}
        onMove={handleBulkMove}
        onArchive={handleBulkArchive}
        onClear={clearSelection}
      />

      <KeyboardShortcutsOverlay
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <ToastContainer />
    </>
  )
}
