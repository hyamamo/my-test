import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import { Bell, Calendar } from 'lucide-react'

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const announcements = await prisma.announcement.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="h-8 w-8 mr-3 text-blue-500" />
              お知らせ
            </h1>
            <p className="mt-2 text-gray-600">
              サロン運営からの重要なお知らせをご確認ください
            </p>
          </div>

          <div className="space-y-6">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {announcement.title}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(announcement.createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>運営チームより</span>
                      <span>
                        更新日: {new Date(announcement.updatedAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  お知らせはありません
                </h3>
                <p className="text-gray-500">
                  新しいお知らせが投稿されると、こちらに表示されます。
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}