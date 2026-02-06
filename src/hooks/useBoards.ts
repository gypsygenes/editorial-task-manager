import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBBoard } from '../types/database'

const now = () => new Date().toISOString()

export function useBoards(projectId?: number | null) {
  const boards = useLiveQuery(
    () => {
      if (projectId) {
        return db.boards.where('projectId').equals(projectId).sortBy('position')
      }
      return db.boards.orderBy('position').toArray()
    },
    [projectId]
  ) ?? []

  const starredBoards = useLiveQuery(
    () => db.boards.where('starred').equals(1).toArray()
  ) ?? []

  const addBoard = async (data: Pick<DBBoard, 'projectId' | 'name' | 'description'>) => {
    const existing = await db.boards.where('projectId').equals(data.projectId).toArray()
    const maxPos = existing.length > 0 ? Math.max(...existing.map(b => b.position)) + 1 : 0

    const boardId = await db.boards.add({
      ...data,
      starred: false,
      position: maxPos,
      createdAt: now(),
      updatedAt: now(),
    })

    // Create default columns
    const colDefs = [
      { title: 'To Do', color: 'bg-orange-400', position: 0 },
      { title: 'In Progress', color: 'bg-amber-400', position: 1 },
      { title: 'Done', color: 'bg-sage', position: 2 },
    ]
    for (const col of colDefs) {
      await db.columns.add({
        boardId,
        ...col,
        limit: null,
        createdAt: now(),
        updatedAt: now(),
      })
    }

    return boardId
  }

  const updateBoard = async (id: number, updates: Partial<DBBoard>) => {
    await db.boards.update(id, { ...updates, updatedAt: now() })
  }

  const deleteBoard = async (id: number) => {
    await db.transaction('rw', [db.boards, db.columns, db.tasks], async () => {
      await db.tasks.where('boardId').equals(id).delete()
      await db.columns.where('boardId').equals(id).delete()
      await db.boards.delete(id)
    })
  }

  const toggleStar = async (id: number) => {
    const board = await db.boards.get(id)
    if (board) {
      await db.boards.update(id, { starred: !board.starred, updatedAt: now() })
    }
  }

  return { boards, starredBoards, addBoard, updateBoard, deleteBoard, toggleStar }
}
