'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ArrowLeft, Send } from 'lucide-react'

export default function NewAnnouncementPage() {
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
      const response = await fetch('/api/announcements', {
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
        router.push('/announcements')
      } else {
        setError('お知らせの投稿に失敗しました')
      }
    } catch (error) {
      setError('お知らせの投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            管理者ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新しいお知らせ</h1>
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
                placeholder="お知らせのタイトルを入力してください"
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
                rows={15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea"
                placeholder="お知らせの内容を入力してください&#10;&#10;例：&#10;・重要な連絡事項&#10;・イベントのお知らせ&#10;・サロンの運営方針&#10;・新機能の案内"
                maxLength={3000}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {content.length}/3000文字
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="error">{error}</div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Link
                href="/admin"
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
                    お知らせを投稿
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Guidelines */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            お知らせ投稿のポイント
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• 【重要】【緊急】などのマークを使って重要度を示しましょう</li>
            <li>• 日付や期限がある場合は明確に記載しましょう</li>
            <li>• メンバーが取るべきアクションがある場合は具体的に書きましょう</li>
            <li>• 長文の場合は見出しや箇条書きを使って読みやすくしましょう</li>
            <li>• 問い合わせ先がある場合は連絡方法を明記しましょう</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}