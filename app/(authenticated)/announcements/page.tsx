import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'
import { Bell, User } from 'lucide-react'

async function getAnnouncements() {
  return await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements()

  return (
    <div className="py-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bell className="h-8 w-8 text-salon-600 mr-3" />
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              お知らせ
            </h1>
          </div>
          <p className="text-gray-600">
            サロンからの重要なお知らせをご確認ください
          </p>
        </div>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <article key={announcement.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-salon-100 rounded-full flex items-center justify-center">
                    <Bell className="h-6 w-6 text-salon-600" />
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {announcement.title}
                    </h2>
                    <time className="text-sm text-gray-500">
                      {formatDateTime(announcement.createdAt)}
                    </time>
                  </div>
                  
                  <div className="prose prose-gray max-w-none mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>投稿者: {announcement.author.name}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {announcements.length === 0 && (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                お知らせはありません
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                新しいお知らせが投稿されるとここに表示されます。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}