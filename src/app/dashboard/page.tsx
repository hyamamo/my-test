import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDate } from '@/lib/utils'
import { Bell, BookOpen, Users, MessageSquare, Calendar, TrendingUp } from 'lucide-react'

async function getDashboardData() {
  const [announcements, contents, recentPosts, stats] = await Promise.all([
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
    prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { 
        author: true,
        _count: { select: { comments: true } }
      },
    }),
    {
      totalMembers: await prisma.user.count(),
      totalContents: await prisma.content.count(),
      totalAnnouncements: await prisma.announcement.count(),
      totalPosts: await prisma.post.count(),
    }
  ])

  return { announcements, contents, recentPosts, stats }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const { announcements, contents, recentPosts, stats } = await getDashboardData()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            おかえりなさい、{session.user.name}さん！
          </h1>
          <p className="text-primary-100">
            サロンメンバー限定コンテンツをお楽しみください
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">総メンバー数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">限定コンテンツ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">お知らせ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">掲示板投稿</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Announcements */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">最新のお知らせ</h2>
              <Link href="/announcements" className="text-primary-600 hover:text-primary-500 text-sm">
                すべて見る
              </Link>
            </div>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(announcement.createdAt)} • {announcement.author.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Content */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">新着コンテンツ</h2>
              <Link href="/contents" className="text-primary-600 hover:text-primary-500 text-sm">
                すべて見る
              </Link>
            </div>
            <div className="space-y-4">
              {contents.map((content) => (
                <div key={content.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {content.type === 'VIDEO' && (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 text-xs font-bold">動画</span>
                      </div>
                    )}
                    {content.type === 'DOCUMENT' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">資料</span>
                      </div>
                    )}
                    {content.type === 'ARTICLE' && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">記事</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{content.title}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(content.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近の掲示板投稿</h2>
            <Link href="/board" className="text-primary-600 hover:text-primary-500 text-sm">
              掲示板を見る
            </Link>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {post.author.name} • {formatDate(post.createdAt)} • {post._count.comments}件のコメント
                  </p>
                </div>
                <Link
                  href={`/board/${post.id}`}
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  詳細
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}