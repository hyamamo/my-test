import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    const [users, announcements, contents, comments] = await Promise.all([
      prisma.user.count(),
      prisma.announcement.count(),
      prisma.content.count(),
      prisma.comment.count(),
    ])

    const stats = {
      users,
      announcements,
      contents,
      comments,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('統計データの取得に失敗しました:', error)
    return NextResponse.json(
      { error: '統計データの取得に失敗しました' },
      { status: 500 }
    )
  }
}