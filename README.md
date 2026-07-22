# 韓国発送ガイド（GitHub Pages用プロトタイプ）

## 公開方法
1. このフォルダ内のファイルをGitHubリポジトリへアップロード
2. Settings → Pages
3. Deploy from a branch を選択
4. main / root を選択して保存
5. `login.html` にアクセス

## 現在のパスワード
`TNF0125`

## 主な修正場所
`assets/js/config.js`
- パスワード
- KakaoTalk ID
- QRコード
- JuDress URL
- 集荷時間
- 自動付加メッセージ
- 発送メッセージテンプレート

## 管理者ページについて
`admin.html` は画面設計の試作です。GitHub Pagesは静的サイトのため、管理画面からの変更をオンライン保存するには、将来的にFirebase、Supabase、CMS等が必要です。


## Final revisions
- Removed embedded shortcut/menu bars from guide images.
- Updated STEP1 handwritten monochrome label sample.
- Added hotel business card sample and Korean-address/phone fallback instructions.
- Removed STEP5.
