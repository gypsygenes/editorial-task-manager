import { DragDropContext, DropResult, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import type { DBColumn, DBTask, DBLabel, TaskSortField, SortDirection } from '../types/database'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  columns: DBColumn[]
  getTasksByColumn: (columnId: number) => DBTask[]
  searchQuery: string
  onMoveTask: (taskId: number, newColumnId: number, newPosition?: number) => Promise<void>
  onTaskClick: (taskId: number) => void
  onAddTask: () => void
  sortField: TaskSortField
  sortDirection: SortDirection
  sortTasks: (tasks: DBTask[], field: TaskSortField, direction?: SortDirection) => DBTask[]
  selectedTaskIds: Set<number>
  onToggleTaskSelection: (taskId: number) => void
  labels: DBLabel[]
}

export function KanbanBoard({
  columns,
  getTasksByColumn,
  searchQuery,
  onMoveTask,
  onTaskClick,
  onAddTask,
  sortField,
  sortDirection,
  sortTasks,
  selectedTaskIds,
  onToggleTaskSelection,
  labels,
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newColumnId = parseInt(destination.droppableId, 10)
    const taskId = parseInt(draggableId, 10)
    onMoveTask(taskId, newColumnId, destination.index)
  }

  const filterTasks = (tasks: DBTask[]) => {
    if (!searchQuery) return tasks
    const q = searchQuery.toLowerCase()
    return tasks.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignees.some(a => a.toLowerCase().includes(q))
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-8 overflow-x-auto scrollbar-hide h-full">
        {columns.map(column => {
          const tasks = filterTasks(sortTasks(getTasksByColumn(column.id!), sortField, sortDirection))
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks}
              onTaskClick={onTaskClick}
              onAddTask={column.position === 0 ? onAddTask : undefined}
              selectedTaskIds={selectedTaskIds}
              onToggleTaskSelection={onToggleTaskSelection}
              labels={labels}
            />
          )
        })}
      </div>
    </DragDropContext>
  )
}
