import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.content.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'サロン管理者',
      email: 'admin@salon.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      profile: 'サロンの運営を担当しています。皆様のサロンライフをサポートします。',
    },
  })

  // Create member users
  const member1 = await prisma.user.create({
    data: {
      name: '田中太郎',
      email: 'tanaka@example.com',
      password: await bcrypt.hash('member123', 10),
      role: 'MEMBER',
      profile: 'サロンでの学びを楽しんでいます。よろしくお願いします！',
    },
  })

  const member2 = await prisma.user.create({
    data: {
      name: '鈴木花子',
      email: 'suzuki@example.com',
      password: await bcrypt.hash('member123', 10),
      role: 'MEMBER',
      profile: '新しい知識を求めてサロンに参加しました。交流を深めましょう。',
    },
  })

  const member3 = await prisma.user.create({
    data: {
      name: '山田次郎',
      email: 'yamada@example.com',
      password: await bcrypt.hash('member123', 10),
      role: 'MEMBER',
      profile: 'サロンの雰囲気が気に入っています。みなさんとの出会いに感謝です。',
    },
  })

  // Create announcements
  await prisma.announcement.create({
    data: {
      title: '【重要】サロンメンバー限定サイトがオープンしました！',
      content: `この度、サロンメンバーの皆様専用のウェブサイトがオープンいたしました！

こちらのサイトでは、以下の機能をご利用いただけます：

• 限定コンテンツの閲覧
• メンバー同士の交流掲示板
• 最新のお知らせ確認
• メンバープロフィール表示

皆様の学びと交流がより一層深まることを願っております。
何かご不明な点がございましたら、お気軽にお声がけください。`,
      authorId: admin.id,
    },
  })

  await prisma.announcement.create({
    data: {
      title: '月次交流会のお知らせ',
      content: `来月の月次交流会についてお知らせします。

【日時】来月第2土曜日 14:00-16:00
【場所】オンライン開催（Zoom）
【内容】
- 今月の振り返り
- メンバー同士の交流タイム
- 次月の目標設定

参加申し込みは掲示板にてお願いします。
多くの方のご参加をお待ちしております！`,
      authorId: admin.id,
    },
  })

  // Create content
  await prisma.content.create({
    data: {
      title: 'サロン運営の基本原則',
      description: 'コミュニティ運営における基本的な考え方について解説します。',
      content: `# サロン運営の基本原則

コミュニティを運営する上で大切にしている原則をご紹介します。

## 1. 相互尊重
メンバー同士が互いを尊重し、多様な価値観を受け入れる環境を作ります。

## 2. 継続的学習
新しい知識やスキルを継続的に学び続ける文化を醸成します。

## 3. オープンなコミュニケーション
率直で建設的な意見交換ができる場を提供します。

## 4. 実践的な学び
理論だけでなく、実践を通じた学びを重視します。

これらの原則に基づいて、より良いサロンを一緒に築いていきましょう。`,
      type: 'ARTICLE',
      category: 'GENERAL',
      authorId: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      title: 'メンバー限定動画：成功の秘訣',
      description: 'サロンメンバー限定の特別講義動画です。',
      content: `この動画では、成功するための具体的な方法論について詳しく解説しています。

【内容】
• 目標設定の重要性
• 継続するためのコツ
• モチベーション管理法
• 実践的なアクションプラン

メンバーの皆様だけの特別なコンテンツです。
ぜひ何度も見返して、実践にお役立てください。`,
      type: 'VIDEO',
      category: 'PREMIUM',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      authorId: admin.id,
    },
  })

  await prisma.content.create({
    data: {
      title: '学習資料：効果的な時間管理術',
      description: '時間管理に関する実践的な資料をダウンロードできます。',
      content: `時間管理は成功への重要な要素の一つです。

この資料では以下について詳しく説明しています：

• タイムブロッキング手法
• 優先順位の付け方
• 集中力を高めるテクニック
• デジタルツールの活用法

PDFファイルをダウンロードして、ぜひ実践してみてください。`,
      type: 'DOCUMENT',
      category: 'TUTORIAL',
      fileUrl: '/downloads/time-management.pdf',
      authorId: admin.id,
    },
  })

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: '自己紹介をお願いします！',
      content: `皆様、サロンへようこそ！

こちらのスレッドで簡単に自己紹介をしていただければと思います。

• お名前（ニックネーム可）
• サロンに参加した理由
• 興味のある分野
• 一言メッセージ

お気軽にコメントしてください。
皆様との交流を楽しみにしております！`,
      authorId: admin.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: '今月の目標を共有しませんか？',
      content: `今月も始まりましたね！

今月の目標や取り組みたいことを共有して、
お互いに励まし合いましょう。

私は今月以下のことに取り組む予定です：
• 新しいスキルの習得
• 読書量を増やす
• ネットワーキングの拡大

皆様の目標もぜひ教えてください！`,
      authorId: member1.id,
    },
  })

  // Create comments
  await prisma.comment.create({
    data: {
      content: `はじめまして、鈴木花子です！

サロンに参加した理由：新しい学びの場を求めて
興味のある分野：マーケティング、ブランディング
一言：皆様とのご縁に感謝しています。よろしくお願いします！`,
      authorId: member2.id,
      postId: post1.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: `山田次郎と申します！

サロンに参加した理由：同じ志を持つ仲間との出会いを求めて
興味のある分野：技術系全般、プロジェクト管理
一言：アットホームな雰囲気が素晴らしいですね。交流を楽しみにしています！`,
      authorId: member3.id,
      postId: post1.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: `素晴らしい目標ですね！

私も今月は以下に取り組みます：
• 新しいプログラミング言語の学習
• 健康管理の改善
• サロンでの積極的な交流

みんなで励まし合って頑張りましょう！`,
      authorId: member2.id,
      postId: post2.id,
    },
  })

  console.log('Database seeded successfully!')
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