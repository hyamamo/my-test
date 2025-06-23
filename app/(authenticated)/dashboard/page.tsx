import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { Bell, BookOpen, Users, MessageSquare, ArrowRight } from 'lucide-react'

async function getDashboardData() {
  const [announcements, contents, members, comments] = await Promise.all([
    prisma.announcement.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    prisma.content.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    prisma.user.findMany({
      where: { role: 'MEMBER' },
      take: 6,
    }),
    prisma.comment.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
  ])

  return { announcements, contents, members, comments }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const { announcements, contents, members, comments } = await getDashboardData()

  const stats = [
    { name: 'お知らせ', value: announcements.length, icon: Bell, href: '/announcements' },
    { name: 'コンテンツ', value: contents.length, icon: BookOpen, href: '/contents' },
    { name: 'メンバー', value: members.length, icon: Users, href: '/members' },
    { name: '掲示板投稿', value: comments.length, icon: MessageSquare, href: '/board' },
  ]

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            おかえりなさい、{session?.user?.name}さん
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            サロンメンバー限定コンテンツをお楽しみください
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-salon-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          {item.value}+
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Announcements */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">最新のお知らせ</h2>
              <Link 
                href="/announcements"
                className="text-sm text-salon-600 hover:text-salon-700 flex items-center"
              >
                すべて見る
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-salon-200 pl-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDateTime(announcement.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Content */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">新着コンテンツ</h2>
              <Link 
                href="/contents"
                className="text-sm text-salon-600 hover:text-salon-700 flex items-center"
              >
                すべて見る
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contents.slice(0, 4).map((content) => (
                <Link key={content.id} href={`/contents/${content.id}`}>
                  <div className="group relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    {content.imageUrl && (
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={content.imageUrl}
                          alt={content.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {content.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {content.category}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Board Activity */}
        <div className="mt-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">掲示板の最新投稿</h2>
              <Link 
                href="/board"
                className="text-sm text-salon-600 hover:text-salon-700 flex items-center"
              >
                掲示板へ
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {comments.map((comment) => (
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
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {comment.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDateTime(comment.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}