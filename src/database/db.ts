import Dexie, { type Table } from 'dexie'
import type {
  DBProject,
  DBBoard,
  DBColumn,
  DBTask,
  DBLabel,
  DBAttachment,
  DBChecklistItem,
  DBComment,
  DBActivity,
  DBNotification,
  DBTemplate,
  DBSettings,
} from '../types/database'

export class EditorialDatabase extends Dexie {
  projects!: Table<DBProject, number>
  boards!: Table<DBBoard, number>
  columns!: Table<DBColumn, number>
  tasks!: Table<DBTask, number>
  labels!: Table<DBLabel, number>
  attachments!: Table<DBAttachment, number>
  checklistItems!: Table<DBChecklistItem, number>
  comments!: Table<DBComment, number>
  activities!: Table<DBActivity, number>
  notifications!: Table<DBNotification, number>
  templates!: Table<DBTemplate, number>
  settings!: Table<DBSettings, number>

  constructor() {
    super('EditorialTaskManager')

    this.version(1).stores({
      projects: '++id, name, starred, position',
      boards: '++id, projectId, starred, position, [projectId+position]',
      columns: '++id, boardId, position, [boardId+position]',
      tasks: '++id, boardId, columnId, [boardId+columnId], [boardId+position], priority, dueDate, archivedAt, createdAt',
      labels: '++id, projectId, position',
      attachments: '++id, taskId',
      checklistItems: '++id, taskId, position, [taskId+position]',
      comments: '++id, taskId, [taskId+createdAt]',
      activities: '++id, taskId, boardId, projectId, [taskId+createdAt], [boardId+createdAt], createdAt',
      notifications: '++id, read, [read+createdAt], createdAt',
      templates: '++id, projectId',
      settings: '++id, key',
    })
  }
}

export const db = new EditorialDatabase()
