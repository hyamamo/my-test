'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ArrowLeft, Send } from 'lucide-react'

export default function NewPostPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容を入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      })

      if (response.ok) {
        const post = await response.json()
        router.push(`/board/${post.id}`)
      } else {
        setError('投稿に失敗しました')
      }
    } catch (error) {
      setError('投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/board"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            掲示板に戻る
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新規投稿</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="label">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="投稿のタイトルを入力してください"
                maxLength={100}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {title.length}/100文字
              </p>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="label">
                内容
              </label>
              <textarea
                id="content"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea"
                placeholder="投稿の内容を入力してください&#10;&#10;例：&#10;・質問や相談&#10;・情報共有&#10;・経験談&#10;・議論したいトピック"
                maxLength={2000}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {content.length}/2000文字
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="error">{error}</div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Link
                href="/board"
                className="btn btn-outline"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="btn btn-primary"
              >
                {loading ? (
                  '投稿中...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    投稿する
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Guidelines */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            投稿のガイドライン
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• 建設的で有益な内容を心がけましょう</li>
            <li>• 質問や相談は具体的に書くと回答を得やすくなります</li>
            <li>• 他のメンバーに配慮した言葉遣いを使いましょう</li>
            <li>• 個人情報や機密情報は投稿しないでください</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}