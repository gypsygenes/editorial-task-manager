import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBProject } from '../types/database'

const now = () => new Date().toISOString()

export function useProjects() {
  const projects = useLiveQuery(() => db.projects.orderBy('position').toArray()) ?? []

  const addProject = async (data: Pick<DBProject, 'name' | 'icon' | 'description' | 'color'>) => {
    const maxPos = projects.length > 0 ? Math.max(...projects.map(p => p.position)) + 1 : 0
    return db.projects.add({
      ...data,
      starred: false,
      position: maxPos,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const updateProject = async (id: number, updates: Partial<DBProject>) => {
    await db.projects.update(id, { ...updates, updatedAt: now() })
  }

  const deleteProject = async (id: number) => {
    await db.transaction('rw', [db.projects, db.boards, db.columns, db.tasks, db.labels], async () => {
      const boards = await db.boards.where('projectId').equals(id).toArray()
      for (const board of boards) {
        await db.tasks.where('boardId').equals(board.id!).delete()
        await db.columns.where('boardId').equals(board.id!).delete()
      }
      await db.boards.where('projectId').equals(id).delete()
      await db.labels.where('projectId').equals(id).delete()
      await db.projects.delete(id)
    })
  }

  const toggleStar = async (id: number) => {
    const project = await db.projects.get(id)
    if (project) {
      await db.projects.update(id, { starred: !project.starred, updatedAt: now() })
    }
  }

  const reorderProjects = async (orderedIds: number[]) => {
    await db.transaction('rw', db.projects, async () => {
      for (let i = 0; i < orderedIds.length; i++) {
        await db.projects.update(orderedIds[i], { position: i })
      }
    })
  }

  return { projects, addProject, updateProject, deleteProject, toggleStar, reorderProjects }
}
