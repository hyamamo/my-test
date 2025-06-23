import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Users, Calendar, MessageSquare } from 'lucide-react'

async function getMembers() {
  return await prisma.user.findMany({
    orderBy: { joinedAt: 'desc' },
    include: {
      _count: {
        select: { comments: true }
      }
    }
  })
}

export default async function MembersPage() {
  const members = await getMembers()
  const totalMembers = members.length
  const adminCount = members.filter(m => m.role === 'ADMIN').length
  const memberCount = members.filter(m => m.role === 'MEMBER').length

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-salon-600 mr-3" />
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              メンバー一覧
            </h1>
          </div>
          <p className="text-gray-600">
            サロンメンバーの皆さまをご紹介します
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-salon-600">{totalMembers}</div>
            <div className="text-sm text-gray-600">総メンバー数</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-salon-600">{adminCount}</div>
            <div className="text-sm text-gray-600">管理者</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-salon-600">{memberCount}</div>
            <div className="text-sm text-gray-600">一般メンバー</div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <div key={member.id} className="card text-center">
              <div className="relative">
                <img
                  className="h-20 w-20 rounded-full mx-auto mb-4"
                  src={member.avatar || 'https://via.placeholder.com/80'}
                  alt={member.name || 'User'}
                />
                {member.role === 'ADMIN' && (
                  <span className="absolute -top-1 -right-1 bg-salon-600 text-white text-xs px-2 py-1 rounded-full">
                    管理者
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {member.name}
              </h3>
              
              {member.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {member.bio}
                </p>
              )}
              
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>参加: {formatDate(member.joinedAt)}</span>
                </div>
                <div className="flex items-center justify-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span>{member._count.comments} 投稿</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              メンバーがいません
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              新しいメンバーが登録されるとここに表示されます。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}