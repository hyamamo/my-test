import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import { Users, Calendar, User } from 'lucide-react'

export default async function MembersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const members = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
      joinedAt: true,
      role: true,
    },
    orderBy: { joinedAt: 'desc' }
  })

  const totalMembers = members.length
  const adminCount = members.filter(member => member.role === 'ADMIN').length
  const memberCount = members.filter(member => member.role === 'MEMBER').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 mr-3 text-purple-500" />
              メンバー一覧
            </h1>
            <p className="mt-2 text-gray-600">
              サロンに参加している素晴らしいメンバーたちをご紹介します
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow-md rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-500 p-3 rounded-md">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        総メンバー数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {totalMembers}人
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-md rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-orange-500 p-3 rounded-md">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        管理者
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {adminCount}人
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-md rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-500 p-3 rounded-md">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        一般メンバー
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {memberCount}人
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div key={member.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.name || 'メンバー'}
                      </h3>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.role === 'ADMIN' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {member.role === 'ADMIN' ? '管理者' : 'メンバー'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">メールアドレス</p>
                      <p className="text-sm text-gray-900 truncate">
                        {member.email}
                      </p>
                    </div>

                    {member.profile && (
                      <div>
                        <p className="text-sm text-gray-500">自己紹介</p>
                        <p className="text-sm text-gray-900 line-clamp-3">
                          {member.profile}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      参加日: {new Date(member.joinedAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-500">
                    サロンメンバー
                  </div>
                </div>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                メンバーが見つかりません
              </h3>
              <p className="text-gray-500">
                新しいメンバーが参加すると、こちらに表示されます。
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}