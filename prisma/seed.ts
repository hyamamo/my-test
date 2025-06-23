import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@salon.com' },
    update: {},
    create: {
      email: 'admin@salon.com',
      name: '管理者',
      password: adminPassword,
      role: 'ADMIN',
      profile: 'サロンの管理者です。皆様の素晴らしい体験をサポートいたします。'
    }
  })

  // Create member users
  const memberPassword = await bcrypt.hash('member123', 12)
  
  const tanaka = await prisma.user.upsert({
    where: { email: 'tanaka@example.com' },
    update: {},
    create: {
      email: 'tanaka@example.com',
      name: '田中太郎',
      password: memberPassword,
      role: 'MEMBER',
      profile: 'マーケティングの仕事をしています。このサロンでの学びを楽しみにしています！'
    }
  })

  const suzuki = await prisma.user.upsert({
    where: { email: 'suzuki@example.com' },
    update: {},
    create: {
      email: 'suzuki@example.com',
      name: '鈴木花子',
      password: memberPassword,
      role: 'MEMBER',
      profile: 'フリーランスのデザイナーです。皆さんとの交流を通じて成長していきたいです。'
    }
  })

  const yamada = await prisma.user.upsert({
    where: { email: 'yamada@example.com' },
    update: {},
    create: {
      email: 'yamada@example.com',
      name: '山田次郎',
      password: memberPassword,
      role: 'MEMBER',
      profile: 'エンジニアとして働いています。新しい技術とビジネスの知見を学びたいです。'
    }
  })

  // Create announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'サロンサイトオープンのお知らせ',
        content: `皆様

この度、サロンメンバー限定サイトが正式にオープンいたしました！

このサイトでは以下のコンテンツをお楽しみいただけます：

・限定記事や動画コンテンツ
・メンバー間での情報交換
・最新のお知らせやイベント情報

今後も皆様にとって価値のあるコンテンツを継続的に提供してまいります。
ぜひサイト内を探索して、他のメンバーとの交流もお楽しみください。

何かご質問やご要望がございましたら、お気軽にお声かけください。

運営チーム一同`,
        published: true
      },
      {
        title: '【重要】サイト利用規約について',
        content: `メンバーの皆様

サロンサイトをご利用いただくにあたり、以下の点にご注意ください：

1. サイト内のコンテンツは全てサロンメンバー限定です
2. 他のメンバーへの配慮をお願いいたします
3. 適切な言葉遣いで交流をお楽しみください
4. 商用利用や宣伝行為はご遠慮ください

皆様が快適にご利用いただけるよう、ご協力をお願いいたします。

運営チーム`,
        published: true
      }
    ]
  })

  // Create content
  await prisma.content.createMany({
    data: [
      {
        title: 'サロン限定記事：成功するビジネスマインドセット',
        description: 'ビジネスで成功するために必要な考え方とマインドセットについて詳しく解説します。',
        content: `# 成功するビジネスマインドセット

## はじめに

ビジネスの世界で成功を収めるためには、スキルや知識だけでなく、適切なマインドセットが欠かせません。

## 重要な要素

### 1. 継続的な学習姿勢
変化の激しいビジネス環境においては、常に学び続ける姿勢が重要です。

### 2. 失敗を恐れない勇気
失敗は成功への階段です。恐れずにチャレンジし続けましょう。

### 3. 長期的な視野
短期的な利益だけでなく、長期的な価値創造を意識することが大切です。

## まとめ

これらのマインドセットを身につけることで、ビジネスにおいて持続的な成功を実現することができるでしょう。`,
        type: 'ARTICLE',
        category: 'PREMIUM',
        published: true
      },
      {
        title: '動画コンテンツ：マーケティング戦略の基礎',
        description: 'デジタル時代のマーケティング戦略について、実例を交えて詳しく解説します。',
        content: `この動画では、現代のマーケティング戦略について以下の内容を解説しています：

・デジタルマーケティングの基本概念
・SNSを活用した集客方法
・データ分析の重要性
・成功事例の紹介

ぜひご覧ください！`,
        type: 'VIDEO',
        category: 'TUTORIAL',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        published: true
      },
      {
        title: 'ダウンロード資料：ビジネス企画書テンプレート',
        description: 'すぐに使えるビジネス企画書のテンプレートをPDF形式で提供します。',
        content: `# ビジネス企画書テンプレート

このテンプレートには以下の要素が含まれています：

・企画概要
・市場分析
・競合調査
・収益モデル
・実行スケジュール
・リスク分析

実際のビジネス企画を立案する際にぜひご活用ください。`,
        type: 'DOCUMENT',
        category: 'PREMIUM',
        documentUrl: 'https://example.com/business-plan-template.pdf',
        published: true
      }
    ]
  })

  // Create forum posts
  const post1 = await prisma.post.create({
    data: {
      title: 'サロンサイトの感想を共有しましょう！',
      content: `皆さん、こんにちは！

新しくオープンしたサロンサイトはいかがですか？
使いやすさや改善点など、何でも気軽にコメントしてください。

私としては、コンテンツが充実していてとても勉強になります。
特に限定記事は実践的で助かっています。

皆さんの率直なご意見をお聞かせください！`,
      authorId: tanaka.id,
      published: true
    }
  })

  await prisma.post.create({
    data: {
      title: 'おすすめの学習リソースがあれば教えてください',
      content: `メンバーの皆様

私は現在、マーケティングスキルを向上させたいと考えています。
サロンのコンテンツ以外にも、おすすめの書籍やWebサイト、
講座などがあれば教えていただけませんか？

皆さんが実際に使って良かったリソースを
ぜひシェアしていただけると嬉しいです。

よろしくお願いします！`,
      authorId: suzuki.id,
      published: true
    }
  })

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'サイト、とても使いやすいです！特にダッシュボードが見やすくて気に入っています。',
        postId: post1.id,
        authorId: suzuki.id
      },
      {
        content: 'コンテンツの質が高くて驚きました。投資して良かったです！',
        postId: post1.id,
        authorId: yamada.id
      },
      {
        content: 'モバイルでの表示も最適化されていて素晴らしいですね。',
        postId: post1.id,
        authorId: admin.id
      }
    ]
  })

  console.log('Seed data created successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })