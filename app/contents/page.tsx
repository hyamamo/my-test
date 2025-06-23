import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Link from 'next/link'
import { FileText, Video, Download, Calendar, Tag } from 'lucide-react'

export default async function ContentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const contents = await prisma.content.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="h-5 w-5" />
      case 'DOCUMENT':
        return <Download className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return '動画'
      case 'DOCUMENT':
        return '資料'
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
      
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="h-8 w-8 mr-3 text-green-500" />
              限定コンテンツ
            </h1>
            <p className="mt-2 text-gray-600">
              サロンメンバー限定の特別なコンテンツをお楽しみください
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contents.length > 0 ? (
              contents.map((content) => (
                <Link key={content.id} href={`/contents/${content.id}`}>
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-green-600">
                          {getContentIcon(content.type)}
                          <span className="ml-2 text-sm font-medium">
                            {getContentTypeLabel(content.type)}
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(content.category)}`}>
                          {content.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {content.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {content.description || content.content.substring(0, 100) + '...'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(content.createdAt).toLocaleDateString('ja-JP')}
                        </div>
                        <span className="text-green-600 font-medium">
                          詳細を見る →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full bg-white shadow-md rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  コンテンツはありません
                </h3>
                <p className="text-gray-500">
                  新しい限定コンテンツが投稿されると、こちらに表示されます。
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}