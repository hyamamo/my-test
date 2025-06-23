import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Link from 'next/link'
import { MessageSquare, Calendar, User, MessageCircle, Plus } from 'lucide-react'

export default async function BoardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true, email: true }
      },
      comments: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-orange-500" />
                掲示板
              </h1>
              <p className="mt-2 text-gray-600">
                メンバー同士で情報交換や交流を楽しもう
              </p>
            </div>
            <Link
              href="/board/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規投稿
            </Link>
          </div>

          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/board/${post.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 cursor-pointer mb-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.content.substring(0, 200)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author.name || post.author.email}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments.length} コメント
                        </div>
                      </div>
                      <Link
                        href={`/board/${post.id}`}
                        className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                      >
                        詳細を見る →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  投稿はありません
                </h3>
                <p className="text-gray-500 mb-4">
                  まだ誰も投稿していません。最初の投稿をしてみませんか？
                </p>
                <Link
                  href="/board/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規投稿する
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}