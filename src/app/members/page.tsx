'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

interface Member {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

export default function MembersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    fetchMembers()
  }, [session, status, router])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('メンバー情報の取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          管理者
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        メンバー
      </span>
    )
  }

  // ダミーのアバター画像を生成
  const getAvatarUrl = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ]
    const colorIndex = name.charCodeAt(0) % colors.length
    return colors[colorIndex]
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">メンバー一覧</h1>
            <p className="mt-2 text-gray-600">
              サロンに参加している皆さんをご紹介します。
            </p>
          </div>

          {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div key={member.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full ${getAvatarUrl(member.name)} flex items-center justify-center text-white font-bold text-lg mr-4`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        <div className="mt-1">
                          {getRoleBadge(member.role)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">📧</span>
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2">📅</span>
                        <span>
                          {new Date(member.createdAt).toLocaleDateString('ja-JP')} 参加
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">
                          {member.role === 'ADMIN' 
                            ? 'サロンの運営を担当しています。ご質問やご要望がございましたら、お気軽にお声がけください。'
                            : 'サロンメンバーとして様々な活動に参加しています。一緒に学び、成長していきましょう！'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  メンバーが見つかりません
                </h3>
                <p className="text-gray-500">
                  現在表示できるメンバーがありません。
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                メンバー統計
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {members.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    総メンバー数
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {members.filter(m => m.role === 'ADMIN').length}
                  </div>
                  <div className="text-sm text-gray-600">
                    管理者
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {members.filter(m => m.role === 'MEMBER').length}
                  </div>
                  <div className="text-sm text-gray-600">
                    一般メンバー
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}