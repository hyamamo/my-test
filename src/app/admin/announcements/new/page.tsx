'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function NewAnnouncementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: true
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (session.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        alert('お知らせの作成に失敗しました')
      }
    } catch (error) {
      console.error('お知らせの作成に失敗しました:', error)
      alert('お知らせの作成に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/admin"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              ← 管理画面に戻る
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">新しいお知らせを作成</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    タイトル
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    内容
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    rows={8}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.content}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="published"
                    name="published"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.published}
                    onChange={handleChange}
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                    すぐに公開する
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin"
                className="btn-secondary"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50"
              >
                {submitting ? '作成中...' : 'お知らせを作成'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}