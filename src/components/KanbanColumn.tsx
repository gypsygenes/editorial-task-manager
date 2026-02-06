import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { Task, Column } from '../types'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask?: () => void
}

export function KanbanColumn({ column, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  return (
    <div className="flex-1 min-w-[300px] max-w-[400px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${column.color}`} />
          <h3 className="text-sm font-semibold text-cream/70 uppercase tracking-wider">
            {column.title}
          </h3>
          <span className="text-xs text-cream/25 font-mono">{tasks.length}</span>
        </div>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="p-1 rounded-md text-cream/20 hover:text-cream/50 hover:bg-cream/5 transition-colors"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] p-2 rounded-xl transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-cream/5' : ''
            }`}
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
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
                        onClick={() => onTaskClick(task)}
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
