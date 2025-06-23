import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { BookOpen, FileText, Video, Download, User } from 'lucide-react'

async function getContents() {
  return await prisma.content.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      author: true,
      _count: {
        select: { comments: true }
      }
    },
  })
}

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

export default async function ContentsPage() {
  const contents = await getContents()

  // Get unique categories
  const categories = Array.from(new Set(contents.map(c => c.category).filter(Boolean)))

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-salon-600 mr-3" />
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              限定コンテンツ
            </h1>
          </div>
          <p className="text-gray-600">
            サロンメンバー限定の特別なコンテンツをお楽しみください
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">カテゴリ</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-salon-100 text-salon-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => {
            const Icon = contentTypeIcons[content.contentType as keyof typeof contentTypeIcons]
            return (
              <Link key={content.id} href={`/contents/${content.id}`}>
                <article className="group cursor-pointer">
                  <div className="card hover:shadow-lg transition-shadow duration-200 h-full">
                    {/* Image */}
                    {content.imageUrl && (
                      <div className="aspect-video overflow-hidden rounded-t-lg mb-4 -mx-6 -mt-6">
                        <img
                          src={content.imageUrl}
                          alt={content.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    
                    {/* Content Type Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 text-salon-600 mr-2" />
                        <span className="text-sm font-medium text-salon-600">
                          {contentTypeLabels[content.contentType as keyof typeof contentTypeLabels]}
                        </span>
                      </div>
                      {content.category && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {content.category}
                        </span>
                      )}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-salon-700 transition-colors">
                      {content.title}
                    </h3>
                    
                    {/* Content Preview */}
                    <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {content.content.substring(0, 120)}...
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{content.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span>{content._count.comments} コメント</span>
                        <span>{formatDate(content.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>

        {contents.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              コンテンツはありません
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              新しいコンテンツが投稿されるとここに表示されます。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}