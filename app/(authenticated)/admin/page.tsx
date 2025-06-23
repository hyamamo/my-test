import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Settings, 
  Bell, 
  BookOpen, 
  Plus, 
  Users, 
  MessageSquare,
  BarChart3
} from 'lucide-react'

async function getAdminStats() {
  const [announcementCount, contentCount, memberCount, commentCount] = await Promise.all([
    prisma.announcement.count(),
    prisma.content.count(),
    prisma.user.count({ where: { role: 'MEMBER' } }),
    prisma.comment.count(),
  ])

  return { announcementCount, contentCount, memberCount, commentCount }
}

async function getRecentActivity() {
  const [recentAnnouncements, recentContents, recentComments] = await Promise.all([
    prisma.announcement.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    prisma.content.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
  ])

  return { recentAnnouncements, recentContents, recentComments }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const stats = await getAdminStats()
  const activity = await getRecentActivity()

  const quickActions = [
    {
      name: '新しいお知らせ',
      href: '/admin/announcements/new',
      icon: Bell,
      description: 'メンバーへお知らせを投稿',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: '新しいコンテンツ',
      href: '/admin/contents/new',
      icon: BookOpen,
      description: '限定コンテンツを作成',
      color: 'bg-green-500 hover:bg-green-600',
    },
  ]

  const statsCards = [
    { name: 'お知らせ', value: stats.announcementCount, icon: Bell, color: 'text-blue-600' },
    { name: 'コンテンツ', value: stats.contentCount, icon: BookOpen, color: 'text-green-600' },
    { name: 'メンバー', value: stats.memberCount, icon: Users, color: 'text-purple-600' },
    { name: '投稿・コメント', value: stats.commentCount, icon: MessageSquare, color: 'text-orange-600' },
  ]

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-8 w-8 text-salon-600 mr-3" />
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              管理画面
            </h1>
          </div>
          <p className="text-gray-600">
            サロンコンテンツの作成・管理を行います
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">クイックアクション</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.name} href={action.href}>
                  <div className={`${action.color} rounded-lg p-6 text-white hover:shadow-lg transition-all duration-200`}>
                    <div className="flex items-center">
                      <Icon className="h-8 w-8 mr-4" />
                      <div>
                        <h3 className="text-lg font-semibold">{action.name}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">統計情報</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.name} className="card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">最近のアクティビティ</h2>
            <div className="space-y-4">
              {activity.recentComments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={comment.author.avatar || 'https://via.placeholder.com/32'}
                    alt={comment.author.name || 'User'}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {comment.author.name}
                      </span>
                      <span className="text-gray-500"> が投稿しました</span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Management */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">コンテンツ管理</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">最新のお知らせ</h3>
                <div className="space-y-2">
                  {activity.recentAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="text-sm">
                      <Link 
                        href={`/admin/announcements/${announcement.id}/edit`}
                        className="text-salon-600 hover:text-salon-700"
                      >
                        {announcement.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">最新のコンテンツ</h3>
                <div className="space-y-2">
                  {activity.recentContents.map((content) => (
                    <div key={content.id} className="text-sm">
                      <Link 
                        href={`/admin/contents/${content.id}/edit`}
                        className="text-salon-600 hover:text-salon-700"
                      >
                        {content.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}