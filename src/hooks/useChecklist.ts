import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBChecklistItem } from '../types/database'

const now = () => new Date().toISOString()

export function useChecklist(taskId?: number | null) {
  const items = useLiveQuery(
    (): Promise<DBChecklistItem[]> => {
      if (!taskId) return Promise.resolve([])
      return db.checklistItems.where('taskId').equals(taskId).sortBy('position')
    },
    [taskId]
  ) ?? []

  const addItem = async (taskId: number, text: string) => {
    const existing = await db.checklistItems.where('taskId').equals(taskId).toArray()
    const maxPos = existing.length > 0 ? Math.max(...existing.map(i => i.position)) + 1 : 0

    return db.checklistItems.add({
      taskId,
      text,
      completed: false,
      position: maxPos,
      completedAt: null,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const updateItem = async (id: number, text: string) => {
    await db.checklistItems.update(id, { text, updatedAt: now() })
  }

  const toggleItem = async (id: number) => {
    const item = await db.checklistItems.get(id)
    if (!item) return
    await db.checklistItems.update(id, {
      completed: !item.completed,
      completedAt: !item.completed ? now() : null,
      updatedAt: now(),
    })
  }

  const deleteItem = async (id: number) => {
    await db.checklistItems.delete(id)
  }

  const reorderItems = async (orderedIds: number[]) => {
    await db.transaction('rw', db.checklistItems, async () => {
      for (let i = 0; i < orderedIds.length; i++) {
        await db.checklistItems.update(orderedIds[i], { position: i })
      }
    })
  }

  const progress = {
    done: items.filter(i => i.completed).length,
    total: items.length,
  }

  return { items, addItem, updateItem, toggleItem, deleteItem, reorderItems, progress }
}
