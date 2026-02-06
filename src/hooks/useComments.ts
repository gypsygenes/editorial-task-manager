import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBComment } from '../types/database'

const now = () => new Date().toISOString()

export function useComments(taskId?: number | null) {
  const comments = useLiveQuery(
    (): Promise<DBComment[]> => {
      if (!taskId) return Promise.resolve([])
      return db.comments.where('taskId').equals(taskId).reverse().sortBy('createdAt')
    },
    [taskId]
  ) ?? []

  const addComment = async (taskId: number, author: string, content: string) => {
    return db.comments.add({
      taskId,
      author,
      authorAvatar: '',
      content,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const updateComment = async (id: number, content: string) => {
    await db.comments.update(id, { content, updatedAt: now() })
  }

  const deleteComment = async (id: number) => {
    await db.comments.delete(id)
  }

  return { comments, addComment, updateComment, deleteComment }
}
