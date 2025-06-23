'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export default function NewContentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState('ARTICLE')
  const [category, setCategory] = useState('GENERAL')
  const [videoUrl, setVideoUrl] = useState('')
  const [documentUrl, setDocumentUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: description || null,
          content,
          type,
          category,
          videoUrl: type === 'VIDEO' ? videoUrl : null,
          documentUrl: type === 'DOCUMENT' ? documentUrl : null,
        }),
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        throw new Error('コンテンツの作成に失敗しました')
      }
    } catch (error) {
      setError('コンテンツの作成に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link 
              href="/admin"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              管理者ダッシュボードに戻る
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900">
              新しい限定コンテンツを作成
            </h1>
            <p className="mt-2 text-gray-600">
              サロンメンバー限定の特別なコンテンツを作成しましょう
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    コンテンツの種類
                  </label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="ARTICLE">記事</option>
                    <option value="VIDEO">動画</option>
                    <option value="DOCUMENT">資料・ダウンロード</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリ
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="GENERAL">一般</option>
                    <option value="NEWS">ニュース</option>
                    <option value="TUTORIAL">チュートリアル</option>
                    <option value="PREMIUM">プレミアム</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="コンテンツのタイトルを入力してください"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  概要（オプション）
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="コンテンツの概要を入力してください"
                />
              </div>

              {type === 'VIDEO' && (
                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    動画URL（YouTubeなど）
                  </label>
                  <input
                    type="url"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
              )}

              {type === 'DOCUMENT' && (
                <div>
                  <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    資料ダウンロードURL
                  </label>
                  <input
                    type="url"
                    id="documentUrl"
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
              )}

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  内容
                </label>
                <textarea
                  id="content"
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="コンテンツの詳細内容を入力してください"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3">
                <Link
                  href="/admin"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={loading || !title.trim() || !content.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    '作成中...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      コンテンツを作成
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}