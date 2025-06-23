import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Link from 'next/link'
import { Settings, Bell, FileText, Users, MessageSquare, Plus, BarChart3 } from 'lucide-react'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [
    announcementCount,
    contentCount,
    memberCount,
    postCount,
    recentAnnouncements,
    recentContents
  ] = await Promise.all([
    prisma.announcement.count(),
    prisma.content.count(),
    prisma.user.count(),
    prisma.post.count(),
    prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ])

  const stats = [
    { name: 'お知らせ', value: announcementCount, icon: Bell, color: 'bg-blue-500', href: '/admin/announcements' },
    { name: '限定コンテンツ', value: contentCount, icon: FileText, color: 'bg-green-500', href: '/admin/contents' },
    { name: 'メンバー数', value: memberCount, icon: Users, color: 'bg-purple-500', href: '/members' },
    { name: '掲示板投稿', value: postCount, icon: MessageSquare, color: 'bg-orange-500', href: '/board' },
  ]

  const quickActions = [
    { name: 'お知らせを投稿', href: '/admin/announcements/new', icon: Bell, color: 'bg-blue-600' },
    { name: 'コンテンツを追加', href: '/admin/contents/new', icon: FileText, color: 'bg-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Settings className="h-8 w-8 mr-3 text-orange-500" />
              管理者ダッシュボード
            </h1>
            <p className="mt-2 text-gray-600">
              サロンサイトの管理とコンテンツ作成を行います
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`${item.color} p-3 rounded-md`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              {item.name}
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {item.value}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.name} href={action.href}>
                    <div className={`${action.color} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}>
                      <div className="flex items-center text-white">
                        <Icon className="h-8 w-8 mr-3" />
                        <div>
                          <h3 className="text-lg font-medium">{action.name}</h3>
                          <p className="text-sm opacity-90">新しいコンテンツを作成</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Announcements */}
            <div className="bg-white shadow-md rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-500" />
                  最新のお知らせ
                </h2>
                <Link
                  href="/admin/announcements"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  すべて見る
                </Link>
              </div>
              <div className="p-6">
                {recentAnnouncements.length > 0 ? (
                  <div className="space-y-4">
                    {recentAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {announcement.content.substring(0, 100)}...
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(announcement.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">お知らせはありません</p>
                )}
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white shadow-md rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  最新のコンテンツ
                </h2>
                <Link
                  href="/admin/contents"
                  className="text-sm text-green-600 hover:text-green-500"
                >
                  すべて見る
                </Link>
              </div>
              <div className="p-6">
                {recentContents.length > 0 ? (
                  <div className="space-y-4">
                    {recentContents.map((content) => (
                      <div key={content.id} className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-medium text-gray-900">{content.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {content.description || content.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {content.type}
                          </span>
                          <p className="text-xs text-gray-400">
                            {new Date(content.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">コンテンツはありません</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}