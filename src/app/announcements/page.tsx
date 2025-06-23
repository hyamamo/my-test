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
  author: {
    name: string
  }
}

export default function AnnouncementsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    fetchAnnouncements()
  }, [session, status, router])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('お知らせの取得に失敗しました:', error)
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
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">お知らせ</h1>
            <p className="mt-2 text-gray-600">
              サロン運営からの最新情報をお届けします。
            </p>
          </div>

          {announcements.length > 0 ? (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {announcement.title}
                      </h2>
                      <div className="text-sm text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        投稿者: {announcement.author.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  お知らせがありません
                </h3>
                <p className="text-gray-500">
                  現在表示できるお知らせがありません。
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}