import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Link from 'next/link'
import { ArrowLeft, FileText, Video, Download, Calendar, Tag } from 'lucide-react'

interface ContentDetailPageProps {
  params: {
    id: string
  }
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const content = await prisma.content.findUnique({
    where: { 
      id: params.id,
      published: true
    }
  })

  if (!content) {
    notFound()
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-6 w-6" />
      case 'DOCUMENT':
        return <Download className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return '動画コンテンツ'
      case 'DOCUMENT':
        return 'ダウンロード資料'
      case 'ARTICLE':
        return '記事'
      default:
        return 'その他'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'GENERAL': 'bg-gray-100 text-gray-800',
      'NEWS': 'bg-blue-100 text-blue-800',
      'TUTORIAL': 'bg-green-100 text-green-800',
      'PREMIUM': 'bg-purple-100 text-purple-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link 
              href="/contents"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              コンテンツ一覧に戻る
            </Link>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-green-600">
                    {getContentIcon(content.type)}
                    <span className="ml-2 text-sm font-medium">
                      {getContentTypeLabel(content.type)}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(content.category)}`}>
                    {content.category}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {content.title}
                </h1>
                {content.description && (
                  <p className="mt-2 text-gray-600">
                    {content.description}
                  </p>
                )}
                <div className="flex items-center mt-3 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  投稿日: {new Date(content.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>
              </div>
              
              <div className="px-6 py-6">
                {content.type === 'VIDEO' && content.videoUrl && (
                  <div className="mb-6">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={content.videoUrl}
                        title={content.title}
                        className="w-full h-64 md:h-96"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
                
                {content.type === 'DOCUMENT' && content.documentUrl && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Download className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-900">
                          ダウンロード資料
                        </span>
                      </div>
                      <a
                        href={content.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        ダウンロード
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {content.content}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>サロン限定コンテンツ</span>
                  <span>
                    最終更新: {new Date(content.updatedAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}