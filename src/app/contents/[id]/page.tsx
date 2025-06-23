'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Content {
  id: number
  title: string
  description: string
  content: string
  type: string
  category: string
  videoUrl?: string
  fileUrl?: string
  createdAt: string
  author: {
    name: string
  }
  comments: Comment[]
}

interface Comment {
  id: number
  content: string
  createdAt: string
  author: {
    name: string
  }
}

export default function ContentDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (params.id) {
      fetchContent()
    }
  }, [session, status, router, params.id])

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/contents/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        router.push('/contents')
      }
    } catch (error) {
      console.error('コンテンツの取得に失敗しました:', error)
      router.push('/contents')
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
          contentId: content?.id,
        }),
      })

      if (response.ok) {
        setNewComment('')
        fetchContent() // コメントを再取得
      }
    } catch (error) {
      console.error('コメントの投稿に失敗しました:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO': return '動画'
      case 'DOCUMENT': return '資料'
      default: return '記事'
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO': return 'bg-red-100 text-red-800'
      case 'DOCUMENT': return 'bg-blue-100 text-blue-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session || !content) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/contents"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              ← 限定コンテンツ一覧に戻る
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getContentTypeColor(content.type)}`}>
                  {getContentTypeLabel(content.type)}
                </span>
                {content.category && (
                  <span className="text-sm text-gray-500">
                    {content.category}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>

              {content.description && (
                <p className="text-lg text-gray-600 mb-6">
                  {content.description}
                </p>
              )}

              {content.type === 'VIDEO' && content.videoUrl && (
                <div className="aspect-video mb-6">
                  <iframe
                    src={content.videoUrl}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              )}

              {content.type === 'DOCUMENT' && content.fileUrl && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <a
                    href={content.fileUrl}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 ファイルをダウンロード
                  </a>
                </div>
              )}

              <div className="prose max-w-none mb-8">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {content.content}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>投稿者: {content.author.name}</span>
                  <span>
                    {new Date(content.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                コメント ({content.comments.length})
              </h3>
            </div>

            <div className="px-6 py-4">
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    コメントを投稿
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="コメントを入力してください..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {submitting ? '投稿中...' : 'コメントを投稿'}
                </button>
              </form>

              {/* Comments List */}
              {content.comments.length > 0 ? (
                <div className="space-y-6">
                  {content.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  まだコメントがありません。最初のコメントを投稿してみませんか？
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}