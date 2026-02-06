import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import type { DBColumn, DBTask, DBLabel } from '../types/database'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  column: DBColumn
  tasks: DBTask[]
  onTaskClick: (taskId: number) => void
  onAddTask?: () => void
  selectedTaskIds: Set<number>
  onToggleTaskSelection: (taskId: number) => void
  labels: DBLabel[]
}

export function KanbanColumn({
  column,
  tasks,
  onTaskClick,
  onAddTask,
  selectedTaskIds,
  onToggleTaskSelection,
  labels,
}: KanbanColumnProps) {
  const wipLimit = column.limit
  const isOverLimit = wipLimit !== null && tasks.length > wipLimit
  const isAtLimit = wipLimit !== null && tasks.length === wipLimit

  return (
    <div className="flex-1 min-w-[300px] max-w-[400px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${column.color}`} />
          <h3 className="text-sm font-semibold text-text-secondary/70 uppercase tracking-wider">
            {column.title}
          </h3>
          <span className={`text-xs font-mono ${
            isOverLimit ? 'text-red-400' : isAtLimit ? 'text-amber-400' : 'text-text-ghost'
          }`}>
            {tasks.length}{wipLimit !== null ? `/${wipLimit}` : ''}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="p-1 rounded-md text-text-ghost hover:text-text-muted hover:bg-text-primary/5 transition-colors"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-text-primary/5' : ''
            }`}
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                      className={snapshot.isDragging ? 'rotate-2 scale-105' : ''}
                    >
                      <TaskCard
                        task={task}
                        index={index}
                        onClick={() => onTaskClick(task.id!)}
                        isSelected={selectedTaskIds.has(task.id!)}
                        onToggleSelect={() => onToggleTaskSelection(task.id!)}
                        labels={labels.filter(l => task.labelIds.includes(l.id!))}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
