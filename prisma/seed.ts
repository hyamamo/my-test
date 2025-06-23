import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@salon.com' },
    update: {},
    create: {
      email: 'admin@salon.com',
      name: 'サロン管理者',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create member users
  const memberPassword = await bcrypt.hash('member123', 10);
  const members = await Promise.all([
    prisma.user.upsert({
      where: { email: 'tanaka@example.com' },
      update: {},
      create: {
        email: 'tanaka@example.com',
        name: '田中 花子',
        password: memberPassword,
        role: 'MEMBER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'suzuki@example.com' },
      update: {},
      create: {
        email: 'suzuki@example.com',
        name: '鈴木 太郎',
        password: memberPassword,
        role: 'MEMBER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'yamada@example.com' },
      update: {},
      create: {
        email: 'yamada@example.com',
        name: '山田 美咲',
        password: memberPassword,
        role: 'MEMBER',
      },
    }),
  ]);

  // Create announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: '新年のご挨拶',
        content: '新年明けましておめでとうございます。今年もよろしくお願いいたします。2024年も皆様にとって素晴らしい年になりますように。',
        published: true,
        authorId: admin.id,
      },
      {
        title: '1月のスケジュール更新',
        content: '1月のイベントスケジュールを更新いたしました。詳細は限定コンテンツをご確認ください。',
        published: true,
        authorId: admin.id,
      },
      {
        title: 'システムメンテナンスのお知らせ',
        content: '1月15日の深夜2時〜4時の間、システムメンテナンスを実施いたします。この間はサイトにアクセスできませんのでご了承ください。',
        published: true,
        authorId: admin.id,
      },
    ],
  });

  // Create content
  await prisma.content.createMany({
    data: [
      {
        title: '限定レッスン動画：基本テクニック',
        description: 'サロンメンバー限定の基本テクニック動画です。',
        content: 'この動画では、基本的なテクニックについて詳しく解説しています。初心者の方から上級者まで参考になる内容となっております。',
        type: 'VIDEO',
        category: 'レッスン',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        published: true,
        authorId: admin.id,
      },
      {
        title: '月刊ニュースレター 2024年1月号',
        description: 'サロンの月刊ニュースレターをお届けします。',
        content: '【今月のトピック】\n\n1. 新商品のご紹介\n2. メンバー様の声\n3. 来月のイベント予告\n\n今月も多くの新しい発見と学びがありました。メンバーの皆様のおかげで、素晴らしいコミュニティが形成されています。',
        type: 'ARTICLE',
        category: 'ニュースレター',
        published: true,
        authorId: admin.id,
      },
      {
        title: '資料：年間スケジュール2024',
        description: '2024年の年間スケジュールをPDFでダウンロードできます。',
        content: '2024年の年間スケジュールをまとめた資料です。重要なイベントや定期開催される講座の日程が記載されています。',
        type: 'DOCUMENT',
        category: '資料',
        fileUrl: '/files/schedule-2024.pdf',
        published: true,
        authorId: admin.id,
      },
      {
        title: '特別企画：プレミアムコンテンツ',
        description: 'メンバー限定の特別企画をご紹介します。',
        content: '今回の特別企画では、通常では公開していない貴重な内容をお届けします。\n\n【内容】\n- 秘密のテクニック集\n- 専門家との対談\n- Q&Aセッション\n\nぜひこの機会にご参加ください。',
        type: 'ARTICLE',
        category: '特別企画',
        published: true,
        authorId: admin.id,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });