import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const { content, contentId } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'コメント内容が必要です' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: parseInt(session.user.id as string),
        contentId: contentId ? parseInt(contentId) : null
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('コメントの作成に失敗しました:', error)
    return NextResponse.json(
      { error: 'コメントの作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const contentId = searchParams.get('contentId')

    const whereClause: any = {}
    
    if (contentId) {
      whereClause.contentId = parseInt(contentId)
    }

    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            name: true
          }
        },
        content: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('コメントの取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'コメントの取得に失敗しました' },
      { status: 500 }
    )
  }
}