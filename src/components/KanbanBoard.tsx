import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Task, TaskStatus, Column } from '../types'
import { KanbanColumn } from './KanbanColumn'
import { columns } from '../data/mockData'

interface KanbanBoardProps {
  getTasksByStatus: (status: TaskStatus, projectId?: string, searchQuery?: string) => Task[]
  activeProjectId: string | null
  searchQuery: string
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void
  onTaskClick: (task: Task) => void
  onAddTask: () => void
}

export function KanbanBoard({
  getTasksByStatus,
  activeProjectId,
  searchQuery,
  onMoveTask,
  onTaskClick,
  onAddTask,
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result
    if (!destination) return
    const newStatus = destination.droppableId as TaskStatus
    onMoveTask(draggableId, newStatus)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-8 overflow-x-auto scrollbar-hide h-full">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksByStatus(
              column.id,
              activeProjectId ?? undefined,
              searchQuery || undefined
            )}
            onTaskClick={onTaskClick}
            onAddTask={column.id === 'todo' ? onAddTask : undefined}
          />
        ))}
      </div>
    </DragDropContext>
  )
}
