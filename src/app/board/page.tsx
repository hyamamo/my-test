import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDateTime } from '@/lib/utils'
import { MessageSquare, User, Calendar, MessageCircle, Plus } from 'lucide-react'

async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      _count: {
        select: { comments: true }
      }
    },
  })
}

export default async function BoardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const posts = await getPosts()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">掲示板</h1>
              <p className="text-gray-600">メンバー同士で自由に交流できる場所です</p>
            </div>
          </div>
          <Link
            href="/board/new"
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規投稿
          </Link>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="card text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                投稿はありません
              </h3>
              <p className="text-gray-600 mb-4">
                最初の投稿をして、メンバー間の交流を始めませんか？
              </p>
              <Link
                href="/board/new"
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規投稿
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/board/${post.id}`}
                className="card hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {post.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post._count.comments}件のコメント</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {post.author.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Community Guidelines */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            コミュニティガイドライン
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• 相互に尊重し合い、建設的な議論を心がけましょう</li>
            <li>• 個人的な攻撃や誹謗中傷は控えましょう</li>
            <li>• トピックに関連した内容を投稿しましょう</li>
            <li>• 質問や相談は歓迎です。お気軽にご投稿ください</li>
            <li>• 知識や経験をシェアして、みんなで学び合いましょう</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}