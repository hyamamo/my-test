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
    const limitNum = limit ? parseInt(limit) : undefined

    const announcements = await prisma.announcement.findMany({
      where: {
        published: true
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limitNum
    })

    return NextResponse.json(announcements)
  } catch (error) {
    console.error('お知らせの取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'お知らせの取得に失敗しました' },
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

    const { title, content, published } = await request.json()

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: parseInt(session.user.id as string)
      }
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error('お知らせの作成に失敗しました:', error)
    return NextResponse.json(
      { error: 'お知らせの作成に失敗しました' },
      { status: 500 }
    )
  }
}