'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ArrowLeft, Send } from 'lucide-react'

const contentTypes = [
  { value: 'ARTICLE', label: '記事' },
  { value: 'VIDEO', label: '動画' },
  { value: 'DOCUMENT', label: '資料' },
]

const categories = [
  { value: 'GENERAL', label: '一般' },
  { value: 'NEWS', label: 'ニュース' },
  { value: 'TUTORIAL', label: 'チュートリアル' },
  { value: 'PREMIUM', label: 'プレミアム' },
]

export default function NewContentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState('ARTICLE')
  const [category, setCategory] = useState('GENERAL')
  const [videoUrl, setVideoUrl] = useState('')
  const [fileUrl, setFileUrl] = useState('')
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
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          content: content.trim(),
          type,
          category,
          videoUrl: type === 'VIDEO' ? videoUrl.trim() || null : null,
          fileUrl: type === 'DOCUMENT' ? fileUrl.trim() || null : null,
        }),
      })

      if (response.ok) {
        router.push('/contents')
      } else {
        setError('コンテンツの投稿に失敗しました')
      }
    } catch (error) {
      setError('コンテンツの投稿に失敗しました')
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
          <h1 className="text-2xl font-bold text-gray-900">新しい限定コンテンツ</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="label">
                  コンテンツタイプ
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input"
                  required
                >
                  {contentTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="category" className="label">
                  カテゴリ
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input"
                  required
                >
                  {categories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                placeholder="コンテンツのタイトルを入力してください"
                maxLength={100}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {title.length}/100文字
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                概要 (任意)
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea"
                placeholder="コンテンツの概要を入力してください"
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">
                {description.length}/200文字
              </p>
            </div>

            {/* Video URL (for VIDEO type) */}
            {type === 'VIDEO' && (
              <div>
                <label htmlFor="videoUrl" className="label">
                  動画URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="input"
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  YouTube埋め込みURL等を入力してください
                </p>
              </div>
            )}

            {/* File URL (for DOCUMENT type) */}
            {type === 'DOCUMENT' && (
              <div>
                <label htmlFor="fileUrl" className="label">
                  ファイルURL
                </label>
                <input
                  type="url"
                  id="fileUrl"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="input"
                  placeholder="/downloads/document.pdf"
                />
                <p className="text-sm text-gray-500 mt-1">
                  ダウンロードファイルのパスまたはURLを入力してください
                </p>
              </div>
            )}

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
                placeholder="コンテンツの内容を入力してください&#10;&#10;マークダウン記法が使用できます：&#10;# 見出し&#10;## 小見出し&#10;**太字**&#10;*斜体*&#10;- 箇条書き"
                maxLength={5000}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {content.length}/5000文字
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
                    コンテンツを投稿
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Guidelines */}
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            コンテンツ作成のポイント
          </h3>
          <ul className="text-green-800 text-sm space-y-1">
            <li>• 【記事】学習に役立つ情報や知識を体系的に整理して提供</li>
            <li>• 【動画】視覚的な説明や実演を通じて理解を深める</li>
            <li>• 【資料】PDFやドキュメントなど参考資料として活用できるもの</li>
            <li>• タイトルは内容が一目で分かるように具体的に</li>
            <li>• 概要は検索しやすいようにキーワードを含める</li>
            <li>• 内容は段落分けや見出しを使って読みやすく構成</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}