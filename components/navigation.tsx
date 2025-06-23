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
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: Home },
  { name: 'お知らせ', href: '/announcements', icon: Bell },
  { name: 'コンテンツ', href: '/contents', icon: BookOpen },
  { name: 'メンバー', href: '/members', icon: Users },
  { name: '掲示板', href: '/board', icon: MessageSquare },
]

const adminNavigation = [
  { name: '管理画面', href: '/admin', icon: Settings },
]

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
          <div className="flex h-16 shrink-0 items-center">
            <div className="h-8 w-8 bg-salon-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900">
              サロン
            </span>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            pathname === item.href
                              ? 'bg-salon-50 text-salon-700'
                              : 'text-gray-700 hover:text-salon-700 hover:bg-salon-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              
              {isAdmin && (
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    管理
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {adminNavigation.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              pathname.startsWith(item.href)
                                ? 'bg-salon-50 text-salon-700'
                                : 'text-gray-700 hover:text-salon-700 hover:bg-salon-50',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )}
                          >
                            <Icon className="h-6 w-6 shrink-0" />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )}
              
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src={session?.user?.avatar || 'https://via.placeholder.com/32'}
                    alt={session?.user?.name || 'User'}
                  />
                  <span className="sr-only">プロフィール</span>
                  <span aria-hidden="true">{session?.user?.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  ログアウト
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">メニューを開く</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="h-6 w-6 bg-salon-600 rounded flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                サロン
              </span>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="relative z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-900/80" />
            <div className="fixed inset-0 flex">
              <div className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">メニューを閉じる</span>
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="h-8 w-8 bg-salon-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 text-xl font-semibold text-gray-900">
                      サロン
                    </span>
                  </div>
                  
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={cn(
                                    pathname === item.href
                                      ? 'bg-salon-50 text-salon-700'
                                      : 'text-gray-700 hover:text-salon-700 hover:bg-salon-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <Icon className="h-6 w-6 shrink-0" />
                                  {item.name}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                      
                      {isAdmin && (
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            管理
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {adminNavigation.map((item) => {
                              const Icon = item.icon
                              return (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                      pathname.startsWith(item.href)
                                        ? 'bg-salon-50 text-salon-700'
                                        : 'text-gray-700 hover:text-salon-700 hover:bg-salon-50',
                                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                    )}
                                  >
                                    <Icon className="h-6 w-6 shrink-0" />
                                    {item.name}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      )}
                      
                      <li className="mt-auto">
                        <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                          <img
                            className="h-8 w-8 rounded-full bg-gray-50"
                            src={session?.user?.avatar || 'https://via.placeholder.com/32'}
                            alt={session?.user?.name || 'User'}
                          />
                          <span className="sr-only">プロフィール</span>
                          <span aria-hidden="true">{session?.user?.name}</span>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut className="h-6 w-6 shrink-0" />
                          ログアウト
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}