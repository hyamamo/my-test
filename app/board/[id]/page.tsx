import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import CommentForm from '@/components/CommentForm'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, MessageCircle } from 'lucide-react'

interface PostDetailPageProps {
  params: {
    id: string
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const post = await prisma.post.findUnique({
    where: { 
      id: params.id,
      published: true
    },
    include: {
      author: {
        select: { name: true, email: true }
      },
      comments: {
        include: {
          author: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link 
              href="/board"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              掲示板に戻る
            </Link>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author.name || post.author.email}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments.length} コメント
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white shadow-md rounded-lg">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-orange-500" />
                コメント ({post.comments.length})
              </h2>
            </div>

            <div className="px-6 py-6">
              <CommentForm postId={post.id} />
              
              {post.comments.length > 0 && (
                <div className="mt-8 space-y-6">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-orange-200 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-1" />
                          {comment.author.name || comment.author.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}