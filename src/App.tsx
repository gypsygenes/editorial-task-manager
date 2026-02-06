import { useState } from 'react'
import { Task, ViewMode } from './types'
import { projects } from './data/mockData'
import { useTasks } from './hooks/useTasks'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { KanbanBoard } from './components/KanbanBoard'
import { TaskDetailPanel } from './components/TaskDetailPanel'
import { AddTaskModal } from './components/AddTaskModal'

export default function App() {
  const { addTask, deleteTask, moveTask, getTasksByStatus } = useTasks()
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const activeProject = activeProjectId
    ? projects.find(p => p.id === activeProjectId)
    : null

  const projectName = activeProject ? activeProject.name : 'All Tasks'

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={setActiveProjectId}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            projectName={projectName}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddTask={() => setIsModalOpen(true)}
          />

          <main className="flex-1 overflow-hidden">
            <KanbanBoard
              getTasksByStatus={getTasksByStatus}
              activeProjectId={activeProjectId}
              searchQuery={searchQuery}
              onMoveTask={moveTask}
              onTaskClick={setSelectedTask}
              onAddTask={() => setIsModalOpen(true)}
            />
          </main>
        </div>
      </div>

      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onDelete={deleteTask}
      />

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addTask}
        defaultProjectId={activeProjectId || 'proj-1'}
      />
    </>
  )
}
