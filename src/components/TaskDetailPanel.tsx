import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Calendar, User, Tag, Flag, Clock, Trash2, Archive, Copy, FileText,
  CheckSquare, Paperclip, MessageSquare, Activity
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { db } from '../database/db'
import { useLiveQuery } from 'dexie-react-hooks'
import type { DBTask, DBColumn, DBLabel } from '../types/database'
import { priorityConfig } from '../utils/priorities'
import { useChecklist } from '../hooks/useChecklist'
import { useComments } from '../hooks/useComments'
import { useAttachments } from '../hooks/useAttachments'
import { useActivities } from '../hooks/useActivities'
import { ChecklistTab } from './ChecklistTab'
import { CommentsTab } from './CommentsTab'
import { AttachmentsTab } from './AttachmentsTab'
import { ActivityTab } from './ActivityTab'

type DetailTab = 'overview' | 'checklist' | 'attachments' | 'comments' | 'activity'

interface TaskDetailPanelProps {
  taskId: number | null
  onClose: () => void
  onDelete: (id: number) => Promise<void>
  onUpdate: (id: number, updates: Partial<DBTask>) => Promise<void>
  onArchive: (id: number) => Promise<void>
  onDuplicate: (id: number) => Promise<number | undefined>
  boardId: number | null
  projectId: number | null
  columns: DBColumn[]
  labels: DBLabel[]
}

export function TaskDetailPanel({
  taskId,
  onClose,
  onDelete,
  onUpdate,
  onArchive,
  onDuplicate,
  boardId,
  projectId,
  columns,
  labels,
}: TaskDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')

  const task = useLiveQuery(
    () => (taskId ? db.tasks.get(taskId) : undefined),
    [taskId]
  )

  const { items: checklistItems, progress: checklistProgress } = useChecklist(taskId)
  const { comments } = useComments(taskId)
  const { attachments } = useAttachments(taskId)
  const { activities } = useActivities(taskId)

  const currentColumn = columns.find(c => c.id === task?.columnId)

  // Reset tab when switching tasks
  useEffect(() => {
    setActiveTab('overview')
  }, [taskId])

  const tabs: { id: DetailTab; label: string; icon: typeof CheckSquare; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare, count: checklistItems.length },
    { id: 'attachments', label: 'Files', icon: Paperclip, count: attachments.length },
    { id: 'comments', label: 'Comments', icon: MessageSquare, count: comments.length },
    { id: 'activity', label: 'Activity', icon: Activity, count: activities.length },
  ]

  return (
    <AnimatePresence>
      {task && (
        <motion.div
          key="task-detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-overlay/40" />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-[560px] max-w-[90vw] bg-secondary border-l border-border-subtle shadow-editorial-lg overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-secondary border-b border-border-subtle p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      priorityConfig[task.priority].bg
                    } ${priorityConfig[task.priority].color}`}
                  >
                    {priorityConfig[task.priority].label}
                  </span>
                  {currentColumn && (
                    <span className="text-xs text-text-ghost font-mono uppercase">
                      {currentColumn.title}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicate(task.id!)}
                    className="p-2 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5 transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={() => { onArchive(task.id!); onClose() }}
                    className="p-2 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5 transition-colors"
                    title="Archive"
                  >
                    <Archive size={15} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-text-ghost hover:text-text-muted hover:bg-text-primary/5 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 -mb-6 pb-0">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-text-primary border-b-2 border-accent'
                        : 'text-text-ghost hover:text-text-muted'
                    }`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="text-[10px] bg-text-primary/10 px-1.5 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title + Description always visible */}
              <h2 className="font-serif text-3xl text-text-primary leading-tight mb-4">
                {task.title}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                {task.description}
              </p>

              {activeTab === 'overview' && (
                <>
                  {/* Quick stats */}
                  {checklistItems.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckSquare size={13} className="text-text-ghost" />
                        <span className="text-xs text-text-ghost">
                          {checklistProgress.done}/{checklistProgress.total} completed
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-text-primary/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${checklistProgress.total > 0 ? (checklistProgress.done / checklistProgress.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Labels */}
                  {task.labelIds.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-text-ghost mb-3">
                        <Tag size={13} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Labels</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {labels
                          .filter(l => task.labelIds.includes(l.id!))
                          .map(label => (
                            <span
                              key={label.id}
                              className="text-xs px-3 py-1 rounded-full text-white"
                              style={{ backgroundColor: label.color }}
                            >
                              {label.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-tertiary rounded-lg p-4">
                      <div className="flex items-center gap-2 text-text-ghost mb-2">
                        <User size={13} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Assignees</span>
                      </div>
                      <div className="space-y-1">
                        {task.assignees.length > 0 ? (
                          task.assignees.map(a => (
                            <div key={a} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-text-primary/10 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-text-muted">
                                  {a.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-sm text-text-secondary">{a}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-text-ghost">Unassigned</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-tertiary rounded-lg p-4">
                      <div className="flex items-center gap-2 text-text-ghost mb-2">
                        <Calendar size={13} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Due Date</span>
                      </div>
                      <span className="text-sm text-text-secondary">
                        {task.dueDate ? format(parseISO(task.dueDate), 'MMMM d, yyyy') : 'No due date'}
                      </span>
                    </div>

                    <div className="bg-tertiary rounded-lg p-4">
                      <div className="flex items-center gap-2 text-text-ghost mb-2">
                        <Flag size={13} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Priority</span>
                      </div>
                      <span className={`text-sm ${priorityConfig[task.priority].color}`}>
                        {priorityConfig[task.priority].label}
                      </span>
                    </div>

                    <div className="bg-tertiary rounded-lg p-4">
                      <div className="flex items-center gap-2 text-text-ghost mb-2">
                        <Clock size={13} />
                        <span className="text-[10px] uppercase tracking-wider font-semibold">Created</span>
                      </div>
                      <span className="text-sm text-text-secondary">
                        {format(parseISO(task.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="border-t border-border-subtle pt-6">
                    <button
                      onClick={() => {
                        onDelete(task.id!)
                        onClose()
                      }}
                      className="flex items-center gap-2 text-sm text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Delete task</span>
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'checklist' && <ChecklistTab taskId={task.id!} />}
              {activeTab === 'attachments' && <AttachmentsTab taskId={task.id!} />}
              {activeTab === 'comments' && <CommentsTab taskId={task.id!} />}
              {activeTab === 'activity' && <ActivityTab taskId={task.id!} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
