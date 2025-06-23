import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  Video, 
  Download, 
  User, 
  MessageSquare,
  Calendar
} from 'lucide-react'
import { CommentForm } from '@/components/comment-form'

const contentTypeIcons = {
  ARTICLE: FileText,
  VIDEO: Video,
  DOCUMENT: Download,
}

const contentTypeLabels = {
  ARTICLE: '記事',
  VIDEO: '動画',
  DOCUMENT: '資料',
}

async function getContent(id: string) {
  return await prisma.content.findUnique({
    where: { id },
    include: { 
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'desc' }
      }
    },
  })
}

export default async function ContentDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  const content = await getContent(params.id)

  if (!content) {
    notFound()
  }

  const Icon = contentTypeIcons[content.contentType as keyof typeof contentTypeIcons]

  return (
    <div className="py-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/contents"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            コンテンツ一覧に戻る
          </Link>
        </div>

        {/* Content Header */}
        <div className="card mb-6">
          {/* Image */}
          {content.imageUrl && (
            <div className="aspect-video overflow-hidden rounded-lg mb-6 -mx-6 -mt-6">
              <img
                src={content.imageUrl}
                alt={content.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Type and Category */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Icon className="h-5 w-5 text-salon-600 mr-2" />
              <span className="font-medium text-salon-600">
                {contentTypeLabels[content.contentType as keyof typeof contentTypeLabels]}
              </span>
            </div>
            {content.category && (
              <span className="px-3 py-1 bg-salon-100 text-salon-800 text-sm font-medium rounded-full">
                {content.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{content.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDateTime(content.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>{content.comments.length} コメント</span>
            </div>
          </div>

          {/* Video Embed */}
          {content.contentType === 'VIDEO' && content.videoUrl && (
            <div className="aspect-video mb-6">
              <iframe
                src={content.videoUrl}
                title={content.title}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* File Download */}
          {content.contentType === 'DOCUMENT' && content.fileUrl && (
            <div className="mb-6">
              <a
                href={content.fileUrl}
                download
                className="inline-flex items-center px-4 py-2 bg-salon-600 text-white rounded-lg hover:bg-salon-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                ファイルをダウンロード
              </a>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {content.content}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            コメント ({content.comments.length})
          </h2>

          {/* Comment Form */}
          <div className="mb-8">
            <CommentForm contentId={content.id} />
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {content.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={comment.author.avatar || 'https://via.placeholder.com/40'}
                  alt={comment.author.name || 'User'}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    {comment.content}
                  </div>
                </div>
              </div>
            ))}

            {content.comments.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                まだコメントがありません。最初のコメントを投稿しませんか？
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}