import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardLayout } from '@/components/dashboard-layout'
import { formatDate } from '@/lib/utils'
import { Users, Crown, User, Calendar, Mail } from 'lucide-react'

async function getMembers() {
  const users = await prisma.user.findMany({
    orderBy: { joinedAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: true,
      joinedAt: true,
    },
  })
  
  return users
}

export default async function MembersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const members = await getMembers()
  const adminCount = members.filter(member => member.role === 'ADMIN').length
  const memberCount = members.filter(member => member.role === 'MEMBER').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">メンバー一覧</h1>
            <p className="text-gray-600">サロンメンバーのプロフィールを確認できます</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">総メンバー数</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">管理者</p>
                <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">一般メンバー</p>
                <p className="text-2xl font-bold text-gray-900">{memberCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="card">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {member.name?.charAt(0) || '?'}
                    </span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {member.name}
                    </h3>
                    {member.role === 'ADMIN' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Crown className="h-3 w-3 mr-1" />
                        管理者
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>参加日: {formatDate(member.joinedAt)}</span>
                    </div>
                  </div>

                  {member.profile && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {member.profile}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Welcome Message */}
        <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-primary-900">
                サロンコミュニティへようこそ！
              </h3>
              <p className="text-primary-700 mt-1">
                素晴らしいメンバーの皆様と一緒に学び、成長していきましょう。
                お互いを尊重し、積極的に交流して、より良いコミュニティを築いていけることを楽しみにしています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}