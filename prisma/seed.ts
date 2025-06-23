import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const memberPassword = await bcrypt.hash('member123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@salon.com' },
    update: {},
    create: {
      email: 'admin@salon.com',
      name: 'サロン管理者',
      password: adminPassword,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'サロンの運営・管理を担当しています。',
    },
  })

  const member1 = await prisma.user.upsert({
    where: { email: 'tanaka@example.com' },
    update: {},
    create: {
      email: 'tanaka@example.com',
      name: '田中太郎',
      password: memberPassword,
      role: 'MEMBER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'マーケティング関連の仕事をしています。新しいアイデアを学ぶのが好きです。',
    },
  })

  const member2 = await prisma.user.upsert({
    where: { email: 'suzuki@example.com' },
    update: {},
    create: {
      email: 'suzuki@example.com',
      name: '鈴木花子',
      password: memberPassword,
      role: 'MEMBER',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b566?w=150&h=150&fit=crop&crop=face',
      bio: 'デザイナーとして活動中。クリエイティブなことが大好きです。',
    },
  })

  const member3 = await prisma.user.upsert({
    where: { email: 'yamada@example.com' },
    update: {},
    create: {
      email: 'yamada@example.com',
      name: '山田次郎',
      password: memberPassword,
      role: 'MEMBER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'エンジニアとして働いています。技術の最新動向に興味があります。',
    },
  })

  // Create announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: '新しいコンテンツが追加されました',
        content: 'この度、メンバー限定の新しいコンテンツを追加いたしました。マーケティング戦略に関する貴重な資料となっていますので、ぜひご確認ください。',
        authorId: admin.id,
      },
      {
        title: 'オンラインイベントのお知らせ',
        content: '来月、メンバー限定のオンラインセミナーを開催予定です。詳細は後日お知らせいたします。',
        authorId: admin.id,
      },
      {
        title: 'システムメンテナンスのお知らせ',
        content: '本日深夜2:00-4:00の間、システムメンテナンスを実施いたします。この時間帯はサイトにアクセスできない可能性がございます。',
        authorId: admin.id,
      },
    ],
  })

  // Create contents
  const content1 = await prisma.content.create({
    data: {
      title: 'デジタルマーケティング入門ガイド',
      content: `# デジタルマーケティング入門ガイド

## はじめに
現代のビジネス環境において、デジタルマーケティングは欠かせない要素となっています。このガイドでは、デジタルマーケティングの基本概念から実践的な手法まで、包括的に解説します。

## 主要なデジタルマーケティング手法

### 1. SEO（検索エンジン最適化）
- キーワード戦略の立案
- コンテンツの最適化
- 技術的SEOの実装

### 2. SNSマーケティング
- プラットフォーム別の戦略
- コンテンツカレンダーの作成
- エンゲージメントの向上

### 3. コンテンツマーケティング
- 価値あるコンテンツの作成
- ストーリーテリングの活用
- マルチチャネル展開

## まとめ
デジタルマーケティングは継続的な学習と改善が必要な分野です。常に最新のトレンドを把握し、実践を通じてスキルを向上させていきましょう。`,
      contentType: 'ARTICLE',
      category: 'マーケティング',
      authorId: admin.id,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    },
  })

  const content2 = await prisma.content.create({
    data: {
      title: 'ビジネス戦略セミナー動画',
      content: `# ビジネス戦略セミナー動画

## 概要
このセミナーでは、現代のビジネス環境で成功するための戦略的思考について学びます。

## 内容
- 競争優位性の構築
- イノベーションの創出
- 持続可能な成長戦略

## 視聴時間
約90分

*この動画はメンバー限定コンテンツです。*`,
      contentType: 'VIDEO',
      category: 'ビジネス戦略',
      authorId: admin.id,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    },
  })

  const content3 = await prisma.content.create({
    data: {
      title: 'プロジェクト管理テンプレート集',
      content: `# プロジェクト管理テンプレート集

## 収録内容
このテンプレート集には、以下のような実用的なテンプレートが含まれています：

### 1. プロジェクト計画書テンプレート
- 目標設定シート
- スケジュール管理表
- リスク分析表

### 2. 進捗管理テンプレート
- ガントチャート
- タスク管理表
- 進捗レポート

### 3. 評価・振り返りテンプレート
- プロジェクト評価シート
- 改善点抽出表
- 次回への提言書

## 使用方法
各テンプレートはExcel形式で提供されており、すぐに使用可能です。プロジェクトの規模や特性に応じてカスタマイズしてご利用ください。`,
      contentType: 'DOCUMENT',
      category: 'プロジェクト管理',
      authorId: admin.id,
      fileUrl: '/downloads/project-templates.xlsx',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    },
  })

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'とても分かりやすい解説でした。実際のプロジェクトで活用してみます。',
        authorId: member1.id,
        contentId: content1.id,
      },
      {
        content: 'SEOの部分が特に参考になりました。ありがとうございます。',
        authorId: member2.id,
        contentId: content1.id,
      },
      {
        content: 'セミナー動画、勉強になりました。質問があるのですが、競争優位性の構築について詳しく知りたいです。',
        authorId: member3.id,
        contentId: content2.id,
      },
      {
        content: 'テンプレート活用させていただいています。プロジェクト管理が効率化されました。',
        authorId: member1.id,
        contentId: content3.id,
      },
      {
        content: '掲示板での議論も活発ですね。皆さんの意見を聞けて勉強になります。',
        authorId: member2.id,
      },
      {
        content: '次回のセミナーも楽しみにしています。',
        authorId: member3.id,
      },
    ],
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })