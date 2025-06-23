import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AnnouncementForm } from '@/components/announcement-form'
import { ArrowLeft, Bell } from 'lucide-react'
import Link from 'next/link'

export default async function NewAnnouncementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            管理画面に戻る
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bell className="h-8 w-8 text-salon-600 mr-3" />
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              新しいお知らせを作成
            </h1>
          </div>
          <p className="text-gray-600">
            メンバーに重要な情報をお知らせします
          </p>
        </div>

        <div className="card">
          <AnnouncementForm />
        </div>
      </div>
    </div>
  )
}