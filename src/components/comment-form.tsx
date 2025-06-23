'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'

interface CommentFormProps {
  postId: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('コメントを入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          postId,
        }),
      })

      if (response.ok) {
        setContent('')
        router.refresh()
      } else {
        setError('コメントの投稿に失敗しました')
      }
    } catch (error) {
      setError('コメントの投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">コメントを投稿</h3>
        
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea"
            rows={4}
            placeholder="コメントを入力してください..."
            maxLength={500}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {content.length}/500文字
          </p>
        </div>

        {error && (
          <div className="error">{error}</div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="btn btn-primary"
          >
            {loading ? (
              '投稿中...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                コメント投稿
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}