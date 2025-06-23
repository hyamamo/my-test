import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDate } from '@/lib/utils'
import { BookOpen, Video, FileText, User, Calendar, Plus, Filter } from 'lucide-react'

async function getContents() {
  return await prisma.content.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })
}

const contentTypeConfig = {
  ARTICLE: { icon: FileText, label: '記事', color: 'bg-green-100 text-green-800' },
  VIDEO: { icon: Video, label: '動画', color: 'bg-red-100 text-red-800' },
  DOCUMENT: { icon: FileText, label: '資料', color: 'bg-blue-100 text-blue-800' },
}

const categoryConfig = {
  GENERAL: { label: '一般', color: 'bg-gray-100 text-gray-800' },
  NEWS: { label: 'ニュース', color: 'bg-yellow-100 text-yellow-800' },
  TUTORIAL: { label: 'チュートリアル', color: 'bg-purple-100 text-purple-800' },
  PREMIUM: { label: 'プレミアム', color: 'bg-orange-100 text-orange-800' },
}

export default async function ContentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const contents = await getContents()
  const isAdmin = session.user.role === 'ADMIN'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">限定コンテンツ</h1>
              <p className="text-gray-600">サロンメンバー限定の特別なコンテンツです</p>
            </div>
          </div>
          {isAdmin && (
            <Link
              href="/admin/contents/new"
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              新しいコンテンツ
            </Link>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.length === 0 ? (
            <div className="col-span-full">
              <div className="card text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  コンテンツはありません
                </h3>
                <p className="text-gray-600">
                  新しいコンテンツが投稿されるとここに表示されます
                </p>
              </div>
            </div>
          ) : (
            contents.map((content) => {
              const typeConfig = contentTypeConfig[content.type]
              const TypeIcon = typeConfig.icon
              const categoryConfigItem = categoryConfig[content.category as keyof typeof categoryConfig]
              
              return (
                <Link
                  key={content.id}
                  href={`/contents/${content.id}`}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    {/* Type and Category Badges */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeConfig.label}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfigItem.color}`}>
                        {categoryConfigItem.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {content.title}
                    </h3>

                    {/* Description */}
                    {content.description && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {content.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{content.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(content.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>

        {/* Categories Legend */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">カテゴリについて</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <div key={key} className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
                <span className="text-sm text-gray-600">
                  {key === 'GENERAL' && '基本的なコンテンツ'}
                  {key === 'NEWS' && '最新のニュース'}
                  {key === 'TUTORIAL' && '学習用資料'}
                  {key === 'PREMIUM' && '特別なコンテンツ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}