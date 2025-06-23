'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, FileText, Video, Download } from 'lucide-react'

const contentTypes = [
  { value: 'ARTICLE', label: '記事', icon: FileText },
  { value: 'VIDEO', label: '動画', icon: Video },
  { value: 'DOCUMENT', label: '資料', icon: Download },
]

interface ContentFormProps {
  content?: {
    id: string
    title: string
    content: string
    contentType: string
    category: string
    imageUrl?: string
    videoUrl?: string
    fileUrl?: string
  }
}

export function ContentForm({ content }: ContentFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(content?.title || '')
  const [contentText, setContentText] = useState(content?.content || '')
  const [contentType, setContentType] = useState(content?.contentType || 'ARTICLE')
  const [category, setCategory] = useState(content?.category || '')
  const [imageUrl, setImageUrl] = useState(content?.imageUrl || '')
  const [videoUrl, setVideoUrl] = useState(content?.videoUrl || '')
  const [fileUrl, setFileUrl] = useState(content?.fileUrl || '')
  const [loading, setLoading] = useState(false)

  const isEdit = !!content

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !contentText.trim() || loading) return

    setLoading(true)

    try {
      const url = isEdit ? `/api/contents/${content.id}` : '/api/contents'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: contentText.trim(),
          contentType,
          category: category.trim() || null,
          imageUrl: imageUrl.trim() || null,
          videoUrl: videoUrl.trim() || null,
          fileUrl: fileUrl.trim() || null,
        }),
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        console.error('Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
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
          placeholder="コンテンツのタイトルを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contentType" className="form-label">
            コンテンツタイプ *
          </label>
          <select
            id="contentType"
            className="form-input"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            disabled={loading}
            required
          >
            {contentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="form-label">
            カテゴリ
          </label>
          <input
            type="text"
            id="category"
            className="form-input"
            placeholder="例: マーケティング、ビジネス戦略"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="form-label">
          内容 *
        </label>
        <textarea
          id="content"
          rows={12}
          className="form-input"
          placeholder="コンテンツの内容を入力（Markdown形式対応）"
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="form-label">
          画像URL
        </label>
        <input
          type="url"
          id="imageUrl"
          className="form-input"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={loading}
        />
        <p className="mt-1 text-sm text-gray-500">
          サムネイル画像のURLを入力してください
        </p>
      </div>

      {contentType === 'VIDEO' && (
        <div>
          <label htmlFor="videoUrl" className="form-label">
            動画URL
          </label>
          <input
            type="url"
            id="videoUrl"
            className="form-input"
            placeholder="https://www.youtube.com/embed/..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            YouTube埋め込みURLなどを入力してください
          </p>
        </div>
      )}

      {contentType === 'DOCUMENT' && (
        <div>
          <label htmlFor="fileUrl" className="form-label">
            ファイルURL
          </label>
          <input
            type="url"
            id="fileUrl"
            className="form-input"
            placeholder="/downloads/document.pdf"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            ダウンロード可能なファイルのURLを入力してください
          </p>
        </div>
      )}

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
          disabled={!title.trim() || !contentText.trim() || loading}
          className="btn-primary"
        >
          {loading ? (
            '保存中...'
          ) : (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              {isEdit ? 'コンテンツを更新' : 'コンテンツを投稿'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}