# サロンメンバー限定サイト

このプロジェクトは、サロンメンバー限定のWebサイトです。認証機能、お知らせ機能、限定コンテンツ配信機能、メンバー一覧、掲示板機能を備えています。

## 機能

- **ログイン認証**: メールアドレスとパスワードによる認証
- **お知らせ機能**: 管理者からメンバーへのお知らせ配信
- **限定コンテンツ**: 記事、動画、資料の配信
- **メンバー一覧**: サロンメンバーの一覧表示
- **掲示板機能**: メンバー間のコミュニケーション
- **管理者機能**: コンテンツの投稿・管理

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **認証**: NextAuth.js
- **データベース**: SQLite + Prisma ORM
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. データベースの初期化:
```bash
npm run db:push
```

3. ダミーデータの投入:
```bash
npm run db:seed
```

4. 開発サーバーの起動:
```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でサイトにアクセスできます。

## テストアカウント

### 管理者アカウント
- **メール**: admin@salon.com
- **パスワード**: admin123

### メンバーアカウント
- **メール**: tanaka@example.com
- **パスワード**: member123
- **メール**: suzuki@example.com
- **パスワード**: member123
- **メール**: yamada@example.com
- **パスワード**: member123

## ディレクトリ構成

```
src/
├── app/                    # App Router ページ
│   ├── api/               # API ルート
│   ├── dashboard/         # メインダッシュボード
│   ├── login/             # ログインページ
│   ├── announcements/     # お知らせページ
│   ├── contents/          # コンテンツページ
│   ├── members/           # メンバー一覧
│   ├── board/             # 掲示板
│   └── admin/             # 管理者ページ
├── components/            # 共通コンポーネント
├── lib/                   # ユーティリティ・設定
└── types/                 # 型定義

prisma/
├── schema.prisma          # データベーススキーマ
└── seed.ts               # シードデータ
```

## 主要なページ

- `/` - ルートページ（自動リダイレクト）
- `/login` - ログインページ
- `/dashboard` - メインダッシュボード
- `/announcements` - お知らせ一覧
- `/contents` - 限定コンテンツ一覧
- `/contents/[id]` - コンテンツ詳細
- `/members` - メンバー一覧
- `/board` - 掲示板
- `/admin` - 管理者ダッシュボード
- `/admin/announcements/new` - お知らせ作成
- `/admin/contents/new` - コンテンツ作成

## データベース管理

```bash
# スキーマ変更後のマイグレーション
npm run db:push

# Prisma Client の再生成
npm run db:generate

# データベースリセット（開発時のみ）
npm run db:reset
```

## 本番環境での注意点

1. `.env.local` の `NEXTAUTH_SECRET` を変更してください
2. 本番用データベースのURLを設定してください
3. パスワードのハッシュ化強度を調整してください
4. HTTPS環境での使用を推奨します

## ライセンス

このプロジェクトはテスト用途で作成されています。
