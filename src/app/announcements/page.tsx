import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDateTime } from '@/lib/utils'
import { Bell, User, Calendar, Plus } from 'lucide-react'

async function getAnnouncements() {
  return await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })
}

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const announcements = await getAnnouncements()
  const isAdmin = session.user.role === 'ADMIN'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">お知らせ</h1>
              <p className="text-gray-600">サロンからの重要なお知らせを確認できます</p>
            </div>
          </div>
          {isAdmin && (
            <Link
              href="/admin/announcements/new"
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              新しいお知らせ
            </Link>
          )}
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {announcements.length === 0 ? (
            <div className="card text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                お知らせはありません
              </h3>
              <p className="text-gray-600">
                新しいお知らせが投稿されるとここに表示されます
              </p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <article key={announcement.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Bell className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {announcement.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{announcement.author.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(announcement.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/announcements/${announcement.id}/edit`}
                        className="text-gray-600 hover:text-gray-900 text-sm"
                      >
                        編集
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {announcement.content}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}