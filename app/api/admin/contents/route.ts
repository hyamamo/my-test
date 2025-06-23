import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description, content, type, category, videoUrl, documentUrl } = await request.json()

    if (!title || !content || !type || !category) {
      return NextResponse.json(
        { error: 'Title, content, type, and category are required' },
        { status: 400 }
      )
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        content,
        type,
        category,
        videoUrl,
        documentUrl,
        published: true,
      }
    })

    return NextResponse.json(newContent)
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}