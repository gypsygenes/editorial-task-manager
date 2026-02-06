import { Priority } from './index'

// ── Entity Types ──

export interface DBProject {
  id?: number
  name: string
  icon: string
  description: string
  color: string
  starred: boolean
  position: number
  createdAt: string
  updatedAt: string
  archivedAt?: string | null
}

export interface DBBoard {
  id?: number
  projectId: number
  name: string
  description: string
  starred: boolean
  position: number
  createdAt: string
  updatedAt: string
  archivedAt?: string | null
}

export interface DBColumn {
  id?: number
  boardId: number
  title: string
  color: string
  position: number
  limit: number | null
  createdAt: string
  updatedAt: string
}

export interface DBTask {
  id?: number
  boardId: number
  columnId: number
  title: string
  description: string
  priority: Priority
  position: number
  assignees: string[]
  dueDate: string | null
  labelIds: number[]
  coverImageId: number | null
  archivedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface DBLabel {
  id?: number
  projectId: number
  name: string
  color: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface DBAttachment {
  id?: number
  taskId: number
  name: string
  mimeType: string
  size: number
  blobData?: Blob
  url?: string
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export interface DBChecklistItem {
  id?: number
  taskId: number
  text: string
  completed: boolean
  position: number
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface DBComment {
  id?: number
  taskId: number
  author: string
  authorAvatar: string
  content: string
  createdAt: string
  updatedAt: string
}

export type ActivityType =
  | 'task_created'
  | 'task_updated'
  | 'task_moved'
  | 'task_archived'
  | 'task_restored'
  | 'task_deleted'
  | 'task_completed'
  | 'comment_added'
  | 'attachment_added'
  | 'attachment_removed'
  | 'checklist_item_added'
  | 'checklist_item_completed'
  | 'label_added'
  | 'label_removed'
  | 'assignee_added'
  | 'assignee_removed'
  | 'priority_changed'
  | 'due_date_changed'

export interface DBActivity {
  id?: number
  taskId: number | null
  boardId: number | null
  projectId: number | null
  type: ActivityType
  actor: string
  metadata: Record<string, unknown>
  createdAt: string
}

export type NotificationType =
  | 'task_assigned'
  | 'task_due_soon'
  | 'task_overdue'
  | 'task_completed'
  | 'comment_added'

export interface DBNotification {
  id?: number
  type: NotificationType
  taskId: number | null
  boardId: number | null
  projectId: number | null
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface DBTemplate {
  id?: number
  projectId: number | null
  name: string
  description: string
  taskData: string // JSON stringified snapshot
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface DBSettings {
  id?: number
  key: string
  value: string
}

// ── Query/Filter Types ──

export interface TaskFilters {
  boardId?: number
  columnId?: number
  assignee?: string
  priority?: Priority[]
  labelIds?: number[]
  dateRange?: { start: string; end: string }
  hasAttachments?: boolean
  hasChecklist?: boolean
  hasComments?: boolean
  searchQuery?: string
}

export type TaskSortField = 'priority' | 'dueDate' | 'createdAt' | 'title' | 'position'
export type SortDirection = 'asc' | 'desc'

export interface TaskWithRelations extends DBTask {
  labels: DBLabel[]
  attachments: DBAttachment[]
  checklistItems: DBChecklistItem[]
  comments: DBComment[]
  activities: DBActivity[]
  checklistProgress: { done: number; total: number }
}
