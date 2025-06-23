'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Bell, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: Home },
  { name: 'お知らせ', href: '/announcements', icon: Bell },
  { name: '限定コンテンツ', href: '/contents', icon: BookOpen },
  { name: 'メンバー一覧', href: '/members', icon: Users },
  { name: '掲示板', href: '/board', icon: MessageSquare },
]

const adminNavigation = [
  { name: '管理者ダッシュボード', href: '/admin', icon: Shield },
]

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!session) return null

  const isAdmin = session.user.role === 'ADMIN'

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-900">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-white text-lg font-bold">
                サロンメンバーサイト
              </h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
              
              {isAdmin && (
                <>
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      管理者機能
                    </p>
                  </div>
                  {adminNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </Link>
                    )
                  })}
                </>
              )}
            </nav>
          </div>
          <div className="flex flex-shrink-0 bg-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-300">
                  {isAdmin ? '管理者' : 'メンバー'}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="ml-3 flex-shrink-0 p-1 bg-gray-700 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-white"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-gray-900 px-4 py-3">
          <h1 className="text-white text-lg font-bold">サロン</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center px-3 py-2 text-base font-medium rounded-md',
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
              
              {isAdmin && adminNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center px-3 py-2 text-base font-medium rounded-md',
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-5">
                <div className="flex-1">
                  <p className="text-base font-medium text-white">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    {isAdmin ? '管理者' : 'メンバー'}
                  </p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="ml-3 flex-shrink-0 p-1 bg-gray-700 rounded-full text-gray-400 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}