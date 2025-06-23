'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Announcement {
  id: number
  title: string
  content: string
  createdAt: string
}

interface Content {
  id: number
  title: string
  description: string
  type: string
  category: string
  createdAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      // Fetch latest announcements
      const announcementsRes = await fetch('/api/announcements?limit=3')
      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json()
        setAnnouncements(announcementsData)
      }

      // Fetch latest contents
      const contentsRes = await fetch('/api/contents?limit=4')
      if (contentsRes.ok) {
        const contentsData = await contentsRes.json()
        setContents(contentsData)
      }
    } catch (error) {
      console.error('データの取得に失敗しました:', error)
    } finally {
      setLoading(false)
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
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ようこそ、{session.user?.name}さん
              </h1>
              <p className="text-gray-600">
                サロンメンバー限定サイトへお越しいただき、ありがとうございます。
                最新のお知らせや限定コンテンツをお楽しみください。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latest Announcements */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  最新のお知らせ
                </h2>
                {announcements.length > 0 ? (
                  <div className="space-y-3">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border-l-4 border-primary-400 pl-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {announcement.content.length > 100
                            ? `${announcement.content.substring(0, 100)}...`
                            : announcement.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(announcement.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    ))}
                    <div className="mt-4">
                      <Link
                        href="/announcements"
                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        すべてのお知らせを見る →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">お知らせがありません。</p>
                )}
              </div>
            </div>

            {/* Latest Contents */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  新着限定コンテンツ
                </h2>
                {contents.length > 0 ? (
                  <div className="space-y-3">
                    {contents.map((content) => (
                      <div key={content.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            content.type === 'VIDEO' 
                              ? 'bg-red-100 text-red-800'
                              : content.type === 'DOCUMENT'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {content.type === 'VIDEO' ? '動画' : 
                             content.type === 'DOCUMENT' ? '資料' : '記事'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            {content.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {content.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {content.category} • {new Date(content.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <Link
                        href="/contents"
                        className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                      >
                        すべてのコンテンツを見る →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">コンテンツがありません。</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                クイックアクション
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Link
                  href="/announcements"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">お知らせ</p>
                  </div>
                </Link>
                <Link
                  href="/contents"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">限定コンテンツ</p>
                  </div>
                </Link>
                <Link
                  href="/members"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">メンバー一覧</p>
                  </div>
                </Link>
                <Link
                  href="/board"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">掲示板</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}