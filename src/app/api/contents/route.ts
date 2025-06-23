import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const limit = searchParams.get('limit')
    const category = searchParams.get('category')
    const limitNum = limit ? parseInt(limit) : undefined

    const whereClause: any = {
      published: true
    }

    if (category) {
      whereClause.category = category
    }

    const contents = await prisma.content.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limitNum
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error('コンテンツの取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'コンテンツの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const { title, description, content, type, category, videoUrl, fileUrl, published } = await request.json()

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        content,
        type: type || 'ARTICLE',
        category,
        videoUrl,
        fileUrl,
        published: published || false,
        authorId: parseInt(session.user.id as string)
      }
    })

    return NextResponse.json(newContent)
  } catch (error) {
    console.error('コンテンツの作成に失敗しました:', error)
    return NextResponse.json(
      { error: 'コンテンツの作成に失敗しました' },
      { status: 500 }
    )
  }
}