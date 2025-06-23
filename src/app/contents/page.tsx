'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  _count: {
    comments: number
  }
}

export default function ContentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    fetchContents()
  }, [session, status, router, selectedCategory])

  const fetchContents = async () => {
    try {
      const url = selectedCategory 
        ? `/api/contents?category=${encodeURIComponent(selectedCategory)}`
        : '/api/contents'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setContents(data)
      }
    } catch (error) {
      console.error('コンテンツの取得に失敗しました:', error)
    } finally {
      setLoading(false)
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

  const categories = [...new Set(contents.map(content => content.category))].filter(Boolean)

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
      
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">限定コンテンツ</h1>
            <p className="mt-2 text-gray-600">
              サロンメンバー限定の特別なコンテンツをお楽しみください。
            </p>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCategory === ''
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  すべて
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {contents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => (
                <div key={content.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(content.type)}`}>
                        {getContentTypeLabel(content.type)}
                      </span>
                      {content.category && (
                        <span className="text-xs text-gray-500">
                          {content.category}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {content.title}
                    </h3>
                    
                    {content.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {content.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      {content.type === 'VIDEO' && content.videoUrl && (
                        <div className="aspect-video">
                          <iframe
                            src={content.videoUrl}
                            className="w-full h-full rounded"
                            allowFullScreen
                          />
                        </div>
                      )}

                      {content.type === 'DOCUMENT' && content.fileUrl && (
                        <div className="bg-gray-50 p-3 rounded">
                          <a
                            href={content.fileUrl}
                            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📄 ファイルをダウンロード
                          </a>
                        </div>
                      )}

                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {content.content.length > 150
                            ? `${content.content.substring(0, 150)}...`
                            : content.content}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                      <span>{content.author.name}</span>
                      <div className="flex items-center space-x-4">
                        <span>💬 {content._count.comments}</span>
                        <span>
                          {new Date(content.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/contents/${content.id}`}
                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        詳細を見る →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  コンテンツがありません
                </h3>
                <p className="text-gray-500">
                  {selectedCategory
                    ? `「${selectedCategory}」カテゴリのコンテンツがありません。`
                    : '現在表示できるコンテンツがありません。'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}