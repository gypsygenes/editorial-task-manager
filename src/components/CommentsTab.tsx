import { useState } from 'react'
import { Trash2, Edit3, Send } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useComments } from '../hooks/useComments'

interface CommentsTabProps {
  taskId: number
}

export function CommentsTab({ taskId }: CommentsTabProps) {
  const { comments, addComment, updateComment, deleteComment } = useComments(taskId)
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const handleAdd = async () => {
    if (!newComment.trim()) return
    await addComment(taskId, 'You', newComment.trim())
    setNewComment('')
  }

  const handleEdit = async (id: number) => {
    if (!editText.trim()) return
    await updateComment(id, editText.trim())
    setEditingId(null)
    setEditText('')
  }

  return (
    <div>
      {/* Comment composer */}
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-accent">Y</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full bg-tertiary border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-accent-focus/40 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAdd}
                disabled={!newComment.trim()}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-lg transition-colors"
              >
                <Send size={12} />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3 group">
            <div className="w-8 h-8 rounded-full bg-text-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-text-muted">
                {comment.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-text-secondary">{comment.author}</span>
                <span className="text-[10px] text-text-ghost">
                  {format(parseISO(comment.createdAt), 'MMM d, h:mm a')}
                </span>
              </div>
              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={2}
                    className="w-full bg-tertiary border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-focus/40 resize-none"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleEdit(comment.id!)}
                      className="text-xs text-accent hover:text-accent-hover"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-text-ghost hover:text-text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-muted leading-relaxed">{comment.content}</p>
              )}
              <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingId(comment.id!); setEditText(comment.content) }}
                  className="text-[10px] text-text-ghost hover:text-text-muted"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteComment(comment.id!)}
                  className="text-[10px] text-text-ghost hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-text-ghost text-center py-6">No comments yet</p>
        )}
      </div>
    </div>
  )
}
