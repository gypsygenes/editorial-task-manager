import {
  ArrowRight, Plus, Trash2, CheckSquare, Paperclip, MessageSquare,
  Tag, User, Flag, Calendar, Archive, RotateCcw
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useActivities } from '../hooks/useActivities'
import type { ActivityType } from '../types/database'

const activityIcons: Record<string, typeof ArrowRight> = {
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

export function ActivityFeed() {
  const { globalActivities } = useActivities()

  return (
    <div className="p-8 h-full overflow-auto">
      <h2 className="font-serif text-2xl text-text-primary mb-6">Activity Feed</h2>

      {globalActivities.length === 0 ? (
        <p className="text-sm text-text-ghost text-center py-12">No activity yet. Start creating tasks to see activity here.</p>
      ) : (
        <div className="space-y-3">
          {globalActivities.map(activity => {
            const Icon = activityIcons[activity.type] || ArrowRight
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-text-primary/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-text-primary/5 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-text-ghost" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium">{activity.actor}</span>{' '}
                    <span className="text-text-muted">{activity.type.replace(/_/g, ' ')}</span>
                  </p>
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
