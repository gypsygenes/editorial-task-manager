export type Priority = 'urgent' | 'high' | 'medium' | 'low'
export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type ViewMode = 'kanban' | 'list' | 'calendar' | 'timeline'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: TaskStatus
  projectId: string
  assignee: string
  avatarUrl: string
  dueDate: string
  tags: string[]
  createdAt: string
}

export interface Project {
  id: string
  name: string
  icon: string
  taskCount: number
}

export interface Column {
  id: TaskStatus
  title: string
  color: string
}
