import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDate } from '@/lib/utils'
import { 
  Shield, 
  Bell, 
  BookOpen, 
  Users, 
  MessageSquare,
  Plus,
  Edit,
  BarChart3
} from 'lucide-react'

async function getAdminData() {
  const [recentAnnouncements, recentContents, stats] = await Promise.all([
    prisma.announcement.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    }),
    {
      totalMembers: await prisma.user.count(),
      adminCount: await prisma.user.count({ where: { role: 'ADMIN' } }),
      memberCount: await prisma.user.count({ where: { role: 'MEMBER' } }),
      totalAnnouncements: await prisma.announcement.count(),
      totalContents: await prisma.content.count(),
      totalPosts: await prisma.post.count(),
      totalComments: await prisma.comment.count(),
    }
  ])

  return { recentAnnouncements, recentContents, stats }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const { recentAnnouncements, recentContents, stats } = await getAdminData()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-yellow-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
            <p className="text-gray-600">サロンの運営管理を行えます</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/announcements/new"
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">新しいお知らせ</h3>
                <p className="text-gray-600 text-sm">メンバーに重要な情報を伝える</p>
              </div>
              <Plus className="h-5 w-5 text-gray-400" />
            </div>
          </Link>

          <Link
            href="/admin/contents/new"
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">新しいコンテンツ</h3>
                <p className="text-gray-600 text-sm">限定コンテンツを作成する</p>
              </div>
              <Plus className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
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
                <p className="text-xs text-gray-500">管理者: {stats.adminCount} / メンバー: {stats.memberCount}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">お知らせ数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">コンテンツ数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">掲示板活動</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                <p className="text-xs text-gray-500">コメント: {stats.totalComments}</p>
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
            <div className="space-y-3">
              {recentAnnouncements.length === 0 ? (
                <p className="text-gray-500 text-sm">お知らせはありません</p>
              ) : (
                recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{announcement.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(announcement.createdAt)}
                      </p>
                    </div>
                    <Link
                      href={`/admin/announcements/${announcement.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Contents */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">最新のコンテンツ</h2>
              <Link href="/contents" className="text-primary-600 hover:text-primary-500 text-sm">
                すべて見る
              </Link>
            </div>
            <div className="space-y-3">
              {recentContents.length === 0 ? (
                <p className="text-gray-500 text-sm">コンテンツはありません</p>
              ) : (
                recentContents.map((content) => (
                  <div key={content.id} className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{content.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {content.type} • {formatDate(content.createdAt)}
                      </p>
                    </div>
                    <Link
                      href={`/admin/contents/${content.id}/edit`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Admin Guidelines */}
        <div className="card bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            管理者の役割
          </h3>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>• 定期的にお知らせを投稿し、メンバーとのコミュニケーションを保つ</li>
            <li>• 質の高い限定コンテンツを提供し、メンバーの学習をサポートする</li>
            <li>• 掲示板での議論を見守り、健全なコミュニティを維持する</li>
            <li>• メンバーからの質問や要望に適切に対応する</li>
            <li>• サロンの価値向上のため、継続的に改善を行う</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}