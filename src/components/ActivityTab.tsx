import {
  ArrowRight, Plus, Trash2, CheckSquare, Paperclip, MessageSquare,
  Tag, User, Flag, Calendar, Archive, RotateCcw
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useActivities } from '../hooks/useActivities'
import type { ActivityType } from '../types/database'

interface ActivityTabProps {
  taskId: number
}

const activityIcons: Record<ActivityType, typeof ArrowRight> = {
  task_created: Plus,
  task_updated: ArrowRight,
  task_moved: ArrowRight,
  task_archived: Archive,
  task_restored: RotateCcw,
  task_deleted: Trash2,
  task_completed: CheckSquare,
  comment_added: MessageSquare,
  attachment_added: Paperclip,
  attachment_removed: Trash2,
  checklist_item_added: CheckSquare,
  checklist_item_completed: CheckSquare,
  label_added: Tag,
  label_removed: Tag,
  assignee_added: User,
  assignee_removed: User,
  priority_changed: Flag,
  due_date_changed: Calendar,
}

const activityLabels: Record<ActivityType, string> = {
  task_created: 'created this task',
  task_updated: 'updated this task',
  task_moved: 'moved this task',
  task_archived: 'archived this task',
  task_restored: 'restored this task',
  task_deleted: 'deleted this task',
  task_completed: 'completed this task',
  comment_added: 'added a comment',
  attachment_added: 'added an attachment',
  attachment_removed: 'removed an attachment',
  checklist_item_added: 'added a checklist item',
  checklist_item_completed: 'completed a checklist item',
  label_added: 'added a label',
  label_removed: 'removed a label',
  assignee_added: 'added an assignee',
  assignee_removed: 'removed an assignee',
  priority_changed: 'changed priority',
  due_date_changed: 'changed due date',
}

export function ActivityTab({ taskId }: ActivityTabProps) {
  const { activities } = useActivities(taskId)

  return (
    <div>
      {activities.length === 0 ? (
        <p className="text-sm text-text-ghost text-center py-6">No activity yet</p>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => {
            const Icon = activityIcons[activity.type] || ArrowRight
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-text-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={12} className="text-text-ghost" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium">{activity.actor}</span>{' '}
                    <span className="text-text-muted">{activityLabels[activity.type]}</span>
                  </p>
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <p className="text-[10px] text-text-ghost mt-0.5">
                      {activity.metadata.from && activity.metadata.to
                        ? `${activity.metadata.from} → ${activity.metadata.to}`
                        : JSON.stringify(activity.metadata)}
                    </p>
                  )}
                  <span className="text-[10px] text-text-ghost">
                    {format(parseISO(activity.createdAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
