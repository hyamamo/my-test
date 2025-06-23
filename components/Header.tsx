'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, User, Settings, Bell, FileText, Users, MessageSquare } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard', icon: FileText },
    { name: 'お知らせ', href: '/announcements', icon: Bell },
    { name: '限定コンテンツ', href: '/contents', icon: FileText },
    { name: 'メンバー一覧', href: '/members', icon: Users },
    { name: '掲示板', href: '/board', icon: MessageSquare },
  ]

  const adminNavigation = [
    { name: '管理者', href: '/admin', icon: Settings },
  ]

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                プレミアムサロン
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
            {session?.user?.role === 'ADMIN' &&
              adminNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })
            }
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              こんにちは、{session?.user?.name || session?.user?.email}さん
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}