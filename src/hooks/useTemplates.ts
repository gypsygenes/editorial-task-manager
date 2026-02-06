import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBTask } from '../types/database'

const now = () => new Date().toISOString()

export function useTemplates(projectId?: number | null) {
  const templates = useLiveQuery(
    () => {
      if (projectId) {
        return db.templates.where('projectId').equals(projectId).toArray()
      }
      return db.templates.toArray()
    },
    [projectId]
  ) ?? []

  const createTemplate = async (
    name: string,
    description: string,
    task: DBTask,
    projectId: number | null
  ) => {
    const { id, boardId, columnId, position, archivedAt, completedAt, createdAt, updatedAt, ...taskData } = task
    return db.templates.add({
      projectId,
      name,
      description,
      taskData: JSON.stringify(taskData),
      usageCount: 0,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const updateTemplate = async (id: number, updates: { name?: string; description?: string }) => {
    await db.templates.update(id, { ...updates, updatedAt: now() })
  }

  const deleteTemplate = async (id: number) => {
    await db.templates.delete(id)
  }

  return { templates, createTemplate, updateTemplate, deleteTemplate }
}
