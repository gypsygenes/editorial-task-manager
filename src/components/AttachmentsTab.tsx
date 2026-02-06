import { useState, useRef } from 'react'
import { Upload, Link, Trash2, FileText, Image, File as FileIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useAttachments } from '../hooks/useAttachments'

interface AttachmentsTabProps {
  taskId: number
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function FileIcon2({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('image/')) return <Image size={16} className="text-blue-400" />
  if (mimeType === 'text/uri-list') return <Link size={16} className="text-green-400" />
  return <FileText size={16} className="text-text-ghost" />
}

export function AttachmentsTab({ taskId }: AttachmentsTabProps) {
  const { attachments, addFile, addUrl, removeAttachment, getBlobUrl } = useAttachments(taskId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState('')
  const [urlName, setUrlName] = useState('')
  const [showUrlForm, setShowUrlForm] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      await addFile(taskId, files[i], 'You')
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    await handleFiles(e.dataTransfer.files)
  }

  const handleAddUrl = async () => {
    if (!urlInput.trim()) return
    await addUrl(taskId, urlName.trim() || urlInput.trim(), urlInput.trim(), 'You')
    setUrlInput('')
    setUrlName('')
    setShowUrlForm(false)
  }

  const handlePreview = async (id: number) => {
    const url = await getBlobUrl(id)
    if (url) window.open(url, '_blank')
  }

  return (
    <div>
      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-colors ${
          dragOver ? 'border-accent bg-accent/5' : 'border-border-subtle'
        }`}
      >
        <Upload size={24} className="mx-auto mb-2 text-text-ghost" />
        <p className="text-sm text-text-ghost mb-2">Drop files here or</p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium text-accent hover:text-accent-hover"
          >
            Browse files
          </button>
          <span className="text-text-ghost">|</span>
          <button
            onClick={() => setShowUrlForm(v => !v)}
            className="text-xs font-medium text-accent hover:text-accent-hover"
          >
            Add URL
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* URL form */}
      {showUrlForm && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={urlName}
            onChange={e => setUrlName(e.target.value)}
            placeholder="Link name (optional)"
            className="w-full bg-tertiary border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40"
          />
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-tertiary border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40"
            />
            <button
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              className="px-4 py-2 text-xs font-medium bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Attachments grid */}
      <div className="grid grid-cols-2 gap-3">
        {attachments.map(att => (
          <div
            key={att.id}
            className="bg-tertiary rounded-lg p-3 group hover:bg-text-primary/5 transition-colors"
          >
            <div className="flex items-start gap-2 mb-2">
              <FileIcon2 mimeType={att.mimeType} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-secondary truncate">{att.name}</p>
                <p className="text-[10px] text-text-ghost">
                  {att.size > 0 ? formatFileSize(att.size) : 'Link'}
                  {' · '}{att.uploadedBy}
                </p>
              </div>
              <button
                onClick={() => removeAttachment(att.id!)}
                className="opacity-0 group-hover:opacity-100 p-1 text-text-ghost hover:text-red-400 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <button
              onClick={() => handlePreview(att.id!)}
              className="text-[10px] text-accent hover:text-accent-hover"
            >
              {att.url ? 'Open link' : 'Preview'}
            </button>
          </div>
        ))}
      </div>

      {attachments.length === 0 && (
        <p className="text-sm text-text-ghost text-center py-6">No attachments yet</p>
      )}
    </div>
  )
}
