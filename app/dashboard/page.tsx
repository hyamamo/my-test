import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Link from 'next/link'
import { Bell, FileText, Users, MessageSquare, Calendar, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const [announcements, contents, members, posts] = await Promise.all([
    prisma.announcement.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    }),
    prisma.content.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3
    }),
    prisma.user.count(),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        author: {
          select: { name: true, email: true }
        }
      }
    })
  ])

  const stats = [
    { name: 'お知らせ', value: announcements.length, icon: Bell, color: 'bg-blue-500' },
    { name: '限定コンテンツ', value: contents.length, icon: FileText, color: 'bg-green-500' },
    { name: 'メンバー数', value: members, icon: Users, color: 'bg-purple-500' },
    { name: '掲示板投稿', value: posts.length, icon: MessageSquare, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              ダッシュボード
            </h1>
            <p className="mt-2 text-gray-600">
              {session.user.name || session.user.email}さん、おかえりなさい！
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.name} className="bg-white overflow-hidden shadow-md rounded-lg">
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
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Announcements */}
            <div className="bg-white shadow-md rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-500" />
                  最新のお知らせ
                </h2>
              </div>
              <div className="p-6">
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
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
                    <Link 
                      href="/announcements"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                    >
                      すべてのお知らせを見る →
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500">お知らせはありません</p>
                )}
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white shadow-md rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  新着限定コンテンツ
                </h2>
              </div>
              <div className="p-6">
                {contents.length > 0 ? (
                  <div className="space-y-4">
                    {contents.map((content) => (
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
                    <Link 
                      href="/contents"
                      className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                    >
                      すべてのコンテンツを見る →
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500">コンテンツはありません</p>
                )}
              </div>
            </div>

            {/* Recent Forum Posts */}
            <div className="bg-white shadow-md rounded-lg lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-orange-500" />
                  最新の掲示板投稿
                </h2>
              </div>
              <div className="p-6">
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="border-l-4 border-orange-500 pl-4">
                        <h3 className="font-medium text-gray-900">{post.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {post.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500">
                            投稿者: {post.author.name || post.author.email}
                          </span>
                          <p className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Link 
                      href="/board"
                      className="inline-flex items-center text-sm text-orange-600 hover:text-orange-500"
                    >
                      掲示板を見る →
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500">投稿はありません</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}