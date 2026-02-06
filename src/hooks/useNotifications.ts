import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { NotificationType } from '../types/database'

const now = () => new Date().toISOString()

export function useNotifications() {
  const notifications = useLiveQuery(
    () => db.notifications.orderBy('createdAt').reverse().limit(50).toArray()
  ) ?? []

  const unreadCount = useLiveQuery(
    () => db.notifications.where('read').equals(0).count()
  ) ?? 0

  const createNotification = async (data: {
    type: NotificationType
    taskId?: number | null
    boardId?: number | null
    projectId?: number | null
    title: string
    message: string
  }) => {
    return db.notifications.add({
      type: data.type,
      taskId: data.taskId ?? null,
      boardId: data.boardId ?? null,
      projectId: data.projectId ?? null,
      title: data.title,
      message: data.message,
      read: false,
      createdAt: now(),
    })
  }

  const markRead = async (id: number) => {
    await db.notifications.update(id, { read: true })
  }

  const markAllRead = async () => {
    await db.notifications.where('read').equals(0).modify({ read: true })
  }

  return { notifications, unreadCount, createNotification, markRead, markAllRead }
}
