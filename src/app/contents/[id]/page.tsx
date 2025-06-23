import { getServerSession } from 'next-auth/next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDateTime } from '@/lib/utils'
import { 
  BookOpen, 
  Video, 
  FileText, 
  User, 
  Calendar, 
  ArrowLeft,
  Download,
  ExternalLink,
  Edit
} from 'lucide-react'

interface ContentDetailPageProps {
  params: {
    id: string
  }
}

async function getContent(id: string) {
  const content = await prisma.content.findUnique({
    where: { id },
    include: { author: true },
  })
  
  if (!content) {
    notFound()
  }
  
  return content
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

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const content = await getContent(params.id)
  const isAdmin = session.user.role === 'ADMIN'
  
  const typeConfig = contentTypeConfig[content.type]
  const TypeIcon = typeConfig.icon
  const categoryConfigItem = categoryConfig[content.category as keyof typeof categoryConfig]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href="/contents"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          コンテンツ一覧に戻る
        </Link>

        {/* Content Header */}
        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {typeConfig.label}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfigItem.color}`}>
                  {categoryConfigItem.label}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>
              
              {content.description && (
                <p className="text-xl text-gray-600 mb-4">
                  {content.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{content.author.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(content.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <Link
                href={`/admin/contents/${content.id}/edit`}
                className="btn btn-outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Link>
            )}
          </div>

          {/* Video Embed */}
          {content.type === 'VIDEO' && content.videoUrl && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={content.videoUrl}
                  title={content.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Download Link */}
          {content.type === 'DOCUMENT' && content.fileUrl && (
            <div className="mb-6">
              <a
                href={content.fileUrl}
                download
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                資料をダウンロード
              </a>
            </div>
          )}

          {/* Content Body */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {content.content}
            </div>
          </div>
        </div>

        {/* Related Actions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">その他のアクション</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contents"
              className="btn btn-outline"
            >
              他のコンテンツを見る
            </Link>
            <Link
              href="/board"
              className="btn btn-outline"
            >
              掲示板で議論する
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-outline"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}