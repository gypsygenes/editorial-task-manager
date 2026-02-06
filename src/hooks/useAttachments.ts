import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../database/db'
import type { DBAttachment } from '../types/database'

const now = () => new Date().toISOString()

export function useAttachments(taskId?: number | null) {
  const attachments = useLiveQuery(
    (): Promise<DBAttachment[]> => {
      if (!taskId) return Promise.resolve([])
      return db.attachments.where('taskId').equals(taskId).toArray()
    },
    [taskId]
  ) ?? []

  const addFile = async (taskId: number, file: File, uploadedBy: string) => {
    return db.attachments.add({
      taskId,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      blobData: file,
      uploadedBy,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const addUrl = async (taskId: number, name: string, url: string, uploadedBy: string) => {
    return db.attachments.add({
      taskId,
      name,
      mimeType: 'text/uri-list',
      size: 0,
      url,
      uploadedBy,
      createdAt: now(),
      updatedAt: now(),
    })
  }

  const removeAttachment = async (id: number) => {
    await db.attachments.delete(id)
  }

  const getBlobUrl = async (id: number): Promise<string | null> => {
    const attachment = await db.attachments.get(id)
    if (!attachment) return null
    if (attachment.url) return attachment.url
    if (attachment.blobData) return URL.createObjectURL(attachment.blobData)
    return null
  }

  return { attachments, addFile, addUrl, removeAttachment, getBlobUrl }
}
