import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { ActivityType, DBActivity } from '../types/database'

const now = () => new Date().toISOString()

export function useActivities(taskId?: number | null) {
  const activities = useLiveQuery(
    (): Promise<DBActivity[]> => {
      if (!taskId) return Promise.resolve([])
      return db.activities.where('taskId').equals(taskId).reverse().sortBy('createdAt')
    },
    [taskId]
  ) ?? []

  const globalActivities = useLiveQuery(
    () => db.activities.orderBy('createdAt').reverse().limit(50).toArray()
  ) ?? []

  const logActivity = async (data: {
    taskId?: number | null
    boardId?: number | null
    projectId?: number | null
    type: ActivityType
    actor: string
    metadata?: Record<string, unknown>
  }) => {
    return db.activities.add({
      taskId: data.taskId ?? null,
      boardId: data.boardId ?? null,
      projectId: data.projectId ?? null,
      type: data.type,
      actor: data.actor,
      metadata: data.metadata || {},
      createdAt: now(),
    })
  }

  return { activities, globalActivities, logActivity }
}
