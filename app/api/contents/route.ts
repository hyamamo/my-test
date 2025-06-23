import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      title, 
      content, 
      contentType, 
      category, 
      imageUrl, 
      videoUrl, 
      fileUrl 
    } = await request.json()

    if (!title?.trim() || !content?.trim() || !contentType) {
      return NextResponse.json({ 
        error: 'Title, content, and contentType are required' 
      }, { status: 400 })
    }

    const newContent = await prisma.content.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        contentType,
        category: category?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        fileUrl: fileUrl?.trim() || null,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(newContent)
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}