'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // まだロード中

    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center salon-gradient">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">読み込み中...</p>
      </div>
    </div>
  )
}