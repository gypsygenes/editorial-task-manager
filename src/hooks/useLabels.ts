import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBLabel } from '../types/database'

const now = () => new Date().toISOString()

export function useLabels(projectId?: number | null) {
  const labels = useLiveQuery(
    (): Promise<DBLabel[]> => {
      if (!projectId) return Promise.resolve([])
      return db.labels.where('projectId').equals(projectId).sortBy('position')
    },
    [projectId]
  ) ?? []

  const addLabel = async (data: Pick<DBLabel, 'projectId' | 'name' | 'color'>) => {
    const existing = await db.labels.where('projectId').equals(data.projectId).toArray()
    const maxPos = existing.length > 0 ? Math.max(...existing.map(l => l.position)) + 1 : 0

    return db.labels.add({
      ...data,
      position: maxPos,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const updateLabel = async (id: number, updates: Partial<DBLabel>) => {
    await db.labels.update(id, { ...updates, updatedAt: now() })
  }

  const deleteLabel = async (id: number) => {
    // Remove label from all tasks that reference it
    const tasksWithLabel = await db.tasks.filter(t => t.labelIds.includes(id)).toArray()
    await db.transaction('rw', [db.labels, db.tasks], async () => {
      for (const task of tasksWithLabel) {
        await db.tasks.update(task.id!, {
          labelIds: task.labelIds.filter(l => l !== id),
          updatedAt: now(),
        })
      }
      await db.labels.delete(id)
    })
  }

  const assignLabel = async (taskId: number, labelId: number) => {
    const task = await db.tasks.get(taskId)
    if (task && !task.labelIds.includes(labelId)) {
      await db.tasks.update(taskId, {
        labelIds: [...task.labelIds, labelId],
        updatedAt: now(),
      })
    }
  }

  const unassignLabel = async (taskId: number, labelId: number) => {
    const task = await db.tasks.get(taskId)
    if (task) {
      await db.tasks.update(taskId, {
        labelIds: task.labelIds.filter(l => l !== labelId),
        updatedAt: now(),
      })
    }
  }

  return { labels, addLabel, updateLabel, deleteLabel, assignLabel, unassignLabel }
}
