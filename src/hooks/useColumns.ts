import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBColumn } from '../types/database'

const now = () => new Date().toISOString()

export function useColumns(boardId?: number | null) {
  const columns = useLiveQuery(
    (): Promise<DBColumn[]> => {
      if (!boardId) return Promise.resolve([])
      return db.columns.where('boardId').equals(boardId).sortBy('position')
    },
    [boardId]
  ) ?? []

  const addColumn = async (data: Pick<DBColumn, 'boardId' | 'title' | 'color'>) => {
    const existing = await db.columns.where('boardId').equals(data.boardId).toArray()
    const maxPos = existing.length > 0 ? Math.max(...existing.map(c => c.position)) + 1 : 0

    return db.columns.add({
      ...data,
      position: maxPos,
      limit: null,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const updateColumn = async (id: number, updates: Partial<DBColumn>) => {
    await db.columns.update(id, { ...updates, updatedAt: now() })
  }

  const deleteColumn = async (id: number) => {
    await db.transaction('rw', [db.columns, db.tasks], async () => {
      await db.tasks.where('columnId').equals(id).delete()
      await db.columns.delete(id)
    })
  }

  const reorderColumns = async (orderedIds: number[]) => {
    await db.transaction('rw', db.columns, async () => {
      for (let i = 0; i < orderedIds.length; i++) {
        await db.columns.update(orderedIds[i], { position: i })
      }
    })
  }

  const setWipLimit = async (id: number, limit: number | null) => {
    await db.columns.update(id, { limit, updatedAt: now() })
  }

  return { columns, addColumn, updateColumn, deleteColumn, reorderColumns, setWipLimit }
}
