'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'

interface AnnouncementFormProps {
  announcement?: {
    id: string
    title: string
    content: string
  }
}

export function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(announcement?.title || '')
  const [content, setContent] = useState(announcement?.content || '')
  const [loading, setLoading] = useState(false)

  const isEdit = !!announcement

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || loading) return

    setLoading(true)

    try {
      const url = isEdit ? `/api/announcements/${announcement.id}` : '/api/announcements'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        console.error('Failed to save announcement')
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="form-label">
          タイトル *
        </label>
        <input
          type="text"
          id="title"
          className="form-input"
          placeholder="お知らせのタイトルを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="form-label">
          内容 *
        </label>
        <textarea
          id="content"
          rows={8}
          className="form-input"
          placeholder="お知らせの内容を入力"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
          disabled={loading}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !content.trim() || loading}
          className="btn-primary"
        >
          {loading ? (
            '保存中...'
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              {isEdit ? 'お知らせを更新' : 'お知らせを投稿'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}