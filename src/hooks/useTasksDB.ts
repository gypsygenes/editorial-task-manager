import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBTask, TaskFilters, TaskSortField, SortDirection, TaskWithRelations } from '../types/database'
import type { Priority } from '../types'

const now = () => new Date().toISOString()

const PRIORITY_ORDER: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

export function useTasksDB(boardId?: number | null) {
  const tasks = useLiveQuery(
    (): Promise<DBTask[]> => {
      if (!boardId) return Promise.resolve([])
      return db.tasks
        .where('boardId')
        .equals(boardId)
        .and(t => !t.archivedAt)
        .sortBy('position')
    },
    [boardId]
  ) ?? []

  const getTasksByColumn = (columnId: number) =>
    tasks.filter(t => t.columnId === columnId).sort((a, b) => a.position - b.position)

  const addTask = async (
    data: Pick<DBTask, 'boardId' | 'columnId' | 'title' | 'description' | 'priority' | 'assignees' | 'dueDate' | 'labelIds'>
  ) => {
    const existing = await db.tasks
      .where('[boardId+columnId]')
      .equals([data.boardId, data.columnId])
      .toArray()
    const maxPos = existing.length > 0 ? Math.max(...existing.map(t => t.position)) + 1 : 0

    return db.tasks.add({
      ...data,
      position: maxPos,
      coverImageId: null,
      archivedAt: null,
      completedAt: null,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const updateTask = async (id: number, updates: Partial<DBTask>) => {
    await db.tasks.update(id, { ...updates, updatedAt: now() })
  }

  const deleteTask = async (id: number) => {
    await db.transaction(
      'rw',
      [db.tasks, db.checklistItems, db.comments, db.attachments, db.activities],
      async () => {
        await db.checklistItems.where('taskId').equals(id).delete()
        await db.comments.where('taskId').equals(id).delete()
        await db.attachments.where('taskId').equals(id).delete()
        await db.activities.where('taskId').equals(id).delete()
        await db.tasks.delete(id)
      }
    )
  }

  const moveTask = async (taskId: number, newColumnId: number, newPosition?: number) => {
    const task = await db.tasks.get(taskId)
    if (!task) return

    const targetTasks = await db.tasks
      .where('[boardId+columnId]')
      .equals([task.boardId, newColumnId])
      .and(t => !t.archivedAt)
      .sortBy('position')

    const pos = newPosition ?? targetTasks.length

    // Shift existing tasks in target column
    await db.transaction('rw', db.tasks, async () => {
      const toShift = targetTasks.filter(t => t.id !== taskId && t.position >= pos)
      for (const t of toShift) {
        await db.tasks.update(t.id!, { position: t.position + 1 })
      }
      await db.tasks.update(taskId, {
        columnId: newColumnId,
        position: pos,
        updatedAt: now(),
      })
    })
  }

  const archiveTask = async (id: number) => {
    await db.tasks.update(id, { archivedAt: now(), updatedAt: now() })
  }

  const restoreTask = async (id: number) => {
    await db.tasks.update(id, { archivedAt: null, updatedAt: now() })
  }

  const duplicateTask = async (id: number) => {
    const task = await db.tasks.get(id)
    if (!task) return

    const { id: _id, ...rest } = task
    return db.tasks.add({
      ...rest,
      title: `${rest.title} (copy)`,
      position: rest.position + 0.5,
      archivedAt: null,
      completedAt: null,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const createFromTemplate = async (
    templateId: number,
    boardId: number,
    columnId: number
  ) => {
    const template = await db.templates.get(templateId)
    if (!template) return

    const taskData = JSON.parse(template.taskData) as Partial<DBTask>
    const existing = await db.tasks
      .where('[boardId+columnId]')
      .equals([boardId, columnId])
      .toArray()
    const maxPos = existing.length > 0 ? Math.max(...existing.map(t => t.position)) + 1 : 0

    const taskId = await db.tasks.add({
      boardId,
      columnId,
      title: taskData.title || template.name,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      position: maxPos,
      assignees: taskData.assignees || [],
      dueDate: taskData.dueDate || null,
      labelIds: taskData.labelIds || [],
      coverImageId: null,
      archivedAt: null,
      completedAt: null,
      createdAt: now(),
      updatedAt: now(),
    })

    await db.templates.update(templateId, { usageCount: template.usageCount + 1 })
    return taskId
  }

  const searchTasks = async (filters: TaskFilters): Promise<DBTask[]> => {
    let collection = db.tasks.toCollection()

    if (filters.boardId) {
      collection = db.tasks.where('boardId').equals(filters.boardId)
    }

    let result = await collection.toArray()

    if (filters.columnId) {
      result = result.filter(t => t.columnId === filters.columnId)
    }
    if (filters.assignee) {
      result = result.filter(t => t.assignees.includes(filters.assignee!))
    }
    if (filters.priority?.length) {
      result = result.filter(t => filters.priority!.includes(t.priority))
    }
    if (filters.labelIds?.length) {
      result = result.filter(t => t.labelIds.some(l => filters.labelIds!.includes(l)))
    }
    if (filters.dateRange) {
      result = result.filter(
        t => t.dueDate && t.dueDate >= filters.dateRange!.start && t.dueDate <= filters.dateRange!.end
      )
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.assignees.some(a => a.toLowerCase().includes(q))
      )
    }

    return result
  }

  const sortTasks = (taskList: DBTask[], field: TaskSortField, direction: SortDirection = 'asc') => {
    const sorted = [...taskList]
    const dir = direction === 'asc' ? 1 : -1

    sorted.sort((a, b) => {
      switch (field) {
        case 'priority':
          return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.localeCompare(b.dueDate) * dir
        case 'createdAt':
          return a.createdAt.localeCompare(b.createdAt) * dir
        case 'title':
          return a.title.localeCompare(b.title) * dir
        case 'position':
        default:
          return (a.position - b.position) * dir
      }
    })

    return sorted
  }

  const getTaskWithRelations = async (taskId: number): Promise<TaskWithRelations | null> => {
    const task = await db.tasks.get(taskId)
    if (!task) return null

    const [labels, attachments, checklistItems, comments, activities] = await Promise.all([
      task.labelIds.length > 0 ? db.labels.where('id').anyOf(task.labelIds).toArray() : [],
      db.attachments.where('taskId').equals(taskId).toArray(),
      db.checklistItems.where('taskId').equals(taskId).sortBy('position'),
      db.comments.where('taskId').equals(taskId).reverse().sortBy('createdAt'),
      db.activities.where('taskId').equals(taskId).reverse().sortBy('createdAt'),
    ])

    const done = checklistItems.filter(c => c.completed).length

    return {
      ...task,
      labels,
      attachments,
      checklistItems,
      comments,
      activities,
      checklistProgress: { done, total: checklistItems.length },
    }
  }

  const bulkMove = async (taskIds: number[], columnId: number) => {
    await db.transaction('rw', db.tasks, async () => {
      const existing = await db.tasks.where('columnId').equals(columnId).count()
      for (let i = 0; i < taskIds.length; i++) {
        await db.tasks.update(taskIds[i], {
          columnId,
          position: existing + i,
          updatedAt: now(),
        })
      }
    })
  }

  const bulkArchive = async (taskIds: number[]) => {
    await db.transaction('rw', db.tasks, async () => {
      for (const id of taskIds) {
        await db.tasks.update(id, { archivedAt: now(), updatedAt: now() })
      }
    })
  }

  const bulkUpdateLabels = async (taskIds: number[], labelIds: number[]) => {
    await db.transaction('rw', db.tasks, async () => {
      for (const id of taskIds) {
        await db.tasks.update(id, { labelIds, updatedAt: now() })
      }
    })
  }

  const bulkUpdateAssignees = async (taskIds: number[], assignees: string[]) => {
    await db.transaction('rw', db.tasks, async () => {
      for (const id of taskIds) {
        await db.tasks.update(id, { assignees, updatedAt: now() })
      }
    })
  }

  const archivedTasks = useLiveQuery(
    (): Promise<DBTask[]> => db.tasks.filter(t => !!t.archivedAt).toArray(),
    []
  ) ?? []

  const taskCounts = useLiveQuery(
    async () => {
      if (!boardId) return {}
      const all = await db.tasks
        .where('boardId')
        .equals(boardId)
        .and(t => !t.archivedAt)
        .toArray()
      const counts: Record<number, number> = {}
      for (const t of all) {
        counts[t.columnId] = (counts[t.columnId] || 0) + 1
      }
      return counts
    },
    [boardId]
  ) ?? {}

  return {
    tasks,
    getTasksByColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    archiveTask,
    restoreTask,
    duplicateTask,
    createFromTemplate,
    searchTasks,
    sortTasks,
    getTaskWithRelations,
    bulkMove,
    bulkArchive,
    bulkUpdateLabels,
    bulkUpdateAssignees,
    archivedTasks,
    taskCounts,
  }
}
