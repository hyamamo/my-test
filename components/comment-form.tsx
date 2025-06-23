'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MessageSquare } from 'lucide-react'

interface CommentFormProps {
  contentId?: string
}

export function CommentForm({ contentId }: CommentFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || loading) return

    setLoading(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          contentId,
        }),
      })

      if (response.ok) {
        setContent('')
        router.refresh()
      } else {
        console.error('Failed to post comment')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex space-x-4">
        <img
          className="h-10 w-10 rounded-full"
          src={session.user.avatar || 'https://via.placeholder.com/40'}
          alt={session.user.name || 'User'}
        />
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="comment" className="sr-only">
                コメント
              </label>
              <textarea
                id="comment"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-salon-500 focus:ring-salon-500"
                placeholder="コメントを入力してください..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!content.trim() || loading}
                className="inline-flex items-center px-4 py-2 bg-salon-600 text-white text-sm font-medium rounded-md hover:bg-salon-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salon-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  '投稿中...'
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    コメント投稿
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}