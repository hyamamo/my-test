import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'
import { CommentForm } from '@/components/comment-form'

async function getBoardComments() {
  return await prisma.comment.findMany({
    where: { contentId: null },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })
}

export default async function BoardPage() {
  const comments = await getBoardComments()

  return (
    <div className="py-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-8 w-8 text-salon-600 mr-3" />
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              掲示板
            </h1>
          </div>
          <p className="text-gray-600">
            メンバー同士で自由に交流・情報交換を行いましょう
          </p>
        </div>

        {/* Post Form */}
        <div className="card mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            新しい投稿
          </h2>
          <CommentForm />
        </div>

        {/* Comments */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="card">
              <div className="flex space-x-4">
                <img
                  className="h-12 w-12 rounded-full"
                  src={comment.author.avatar || 'https://via.placeholder.com/48'}
                  alt={comment.author.name || 'User'}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.author.name}
                    </span>
                    {comment.author.role === 'ADMIN' && (
                      <span className="bg-salon-100 text-salon-800 text-xs px-2 py-1 rounded-full">
                        管理者
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                投稿がありません
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                最初の投稿をしませんか？上記のフォームから投稿できます。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}