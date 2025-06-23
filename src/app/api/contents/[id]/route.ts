import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const contentId = parseInt(params.id)

    const content = await prisma.content.findUnique({
      where: {
        id: contentId,
        published: true
      },
      include: {
        author: {
          select: {
            name: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!content) {
      return NextResponse.json(
        { error: 'コンテンツが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('コンテンツの取得に失敗しました:', error)
    return NextResponse.json(
      { error: 'コンテンツの取得に失敗しました' },
      { status: 500 }
    )
  }
}