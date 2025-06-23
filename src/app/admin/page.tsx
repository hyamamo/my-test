'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Stats {
  users: number
  announcements: number
  contents: number
  comments: number
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    users: 0,
    announcements: 0,
    contents: 0,
    comments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('統計データの取得に失敗しました:', error)
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

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">管理画面</h1>
            <p className="mt-2 text-gray-600">
              サイトの管理とコンテンツの投稿ができます。
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-blue-600 text-lg">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        総ユーザー数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.users}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <span className="text-green-600 text-lg">📢</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        お知らせ数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.announcements}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <span className="text-purple-600 text-lg">📚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        コンテンツ数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.contents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                      <span className="text-yellow-600 text-lg">💬</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        コメント数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.comments}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                クイックアクション
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/admin/announcements/new"
                  className="relative rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <div className="text-center">
                    <span className="text-3xl">📢</span>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      新しいお知らせを投稿
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      メンバーへお知らせを配信します
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/contents/new"
                  className="relative rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <div className="text-center">
                    <span className="text-3xl">📚</span>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      新しいコンテンツを投稿
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      限定コンテンツを追加します
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Management Links */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                管理メニュー
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              <Link
                href="/admin/announcements"
                className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">📢</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">お知らせ管理</p>
                    <p className="text-sm text-gray-500">お知らせの作成・編集・削除</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link
                href="/admin/contents"
                className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">📚</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">コンテンツ管理</p>
                    <p className="text-sm text-gray-500">限定コンテンツの作成・編集・削除</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link
                href="/members"
                className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">👥</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">メンバー管理</p>
                    <p className="text-sm text-gray-500">メンバー一覧と統計情報</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>

              <Link
                href="/board"
                className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">💬</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">掲示板管理</p>
                    <p className="text-sm text-gray-500">掲示板の投稿とコメント管理</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}