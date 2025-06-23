'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

interface Comment {
  id: number
  content: string
  createdAt: string
  author: {
    name: string
  }
  content_title?: string
}

export default function BoardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    fetchComments()
  }, [session, status, router])

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments')
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('コメントの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
        }),
      })

      if (response.ok) {
        setNewComment('')
        fetchComments() // コメントを再取得
      }
    } catch (error) {
      console.error('コメントの投稿に失敗しました:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">掲示板</h1>
            <p className="mt-2 text-gray-600">
              メンバー間で自由に交流できる場所です。お気軽にメッセージを投稿してください。
            </p>
          </div>

          {/* Comment Form */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                新しいメッセージを投稿
              </h3>
            </div>
            <div className="px-6 py-4">
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-4">
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="メッセージを入力してください..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submitting ? '投稿中...' : 'メッセージを投稿'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Messages List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                メッセージ一覧 ({comments.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {comment.author.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {comment.author.name}
                            </span>
                            {comment.content_title && (
                              <span className="text-sm text-gray-500">
                                「{comment.content_title}」にコメント
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('ja-JP', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">
                    まだメッセージがありません。最初のメッセージを投稿してみませんか？
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Board Rules */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="px-6 py-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                掲示板のご利用について
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 他のメンバーを尊重し、礼儀正しくコミュニケーションを取りましょう</li>
                <li>• 建設的で有益な情報の共有を心がけましょう</li>
                <li>• 個人情報や機密事項の投稿は避けましょう</li>
                <li>• 質問や相談も大歓迎です</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}