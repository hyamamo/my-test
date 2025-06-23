import { getServerSession } from 'next-auth/next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { CommentForm } from '@/components/comment-form'
import { formatDateTime } from '@/lib/utils'
import { ArrowLeft, User, Calendar, MessageCircle } from 'lucide-react'

interface PostDetailPageProps {
  params: {
    id: string
  }
}

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'asc' }
      }
    },
  })
  
  if (!post) {
    notFound()
  }
  
  return post
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const post = await getPost(params.id)

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href="/board"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          掲示板に戻る
        </Link>

        {/* Post */}
        <article className="card">
          <div className="flex items-start space-x-4 mb-6">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {post.author.name?.charAt(0) || '?'}
                </span>
              </div>
            </div>

            {/* Post Header */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                  <span>{post.comments.length}件のコメント</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              コメント ({post.comments.length})
            </h2>
          </div>

          {/* Comment Form */}
          <CommentForm postId={post.id} />

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.length === 0 ? (
              <div className="card text-center py-8">
                <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  まだコメントはありません。最初のコメントを投稿してみませんか？
                </p>
              </div>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="card">
                  <div className="flex items-start space-x-3">
                    {/* Comment Author Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {comment.author.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(comment.createdAt)}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-gray-700">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}