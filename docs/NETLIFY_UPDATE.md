# Netlify（有料note公開URL）の更新手順

**公開URL（購入者向け）:** https://zaitaku-hiyo.netlify.app/

このサイトは GitHub 連携ではなく **Netlify Drop（手動アップロード）** で公開しています。  
`main` にマージしても **自動では更新されません**。ツール本体を直したら、必ずこの手順で再ドロップしてください。

---

## 今回必須：在がん総の修正を反映する

現行の Netlify 上のファイルは、在がん総を「1日点数 × 週数」と誤計算した古い版です。  
リポジトリ側は **1日点数 × 7日 × 週数** に修正済みです。以下で上書きしてください。

---

## ダウンロード（zip）

| 用途 | ダウンロード |
|------|--------------|
| **有料note向け**（https://zaitaku-hiyo.netlify.app/） | https://github.com/rushwistuq-droid/zaitaku-iryo-hiyo/raw/main/netlify-packages/zaitaku-hiyo-note-netlify-drop.zip |
| 院内用（別サイト・ゲートなし） | https://github.com/rushwistuq-droid/zaitaku-iryo-hiyo/raw/main/netlify-packages/zaitaku-hiyo-innai-netlify-drop.zip |

リンクをクリックして zip を保存 → 解凍 → Netlify の **Deploys** にドラッグ＆ドロップ。  
フォルダ版は `netlify-drop/`（有料note）・`netlify-drop-internal/`（院内）でも同じ中身です。

---

## アップロードするファイル（5つのみ）

リポジトリ直下の次の5ファイル、またはフォルダ `netlify-drop/` の中身だけを上げます。

```
index.html
app.js
styles.css
icon.svg
manifest.webmanifest
```

⚠️ **上げないもの:** `docs/`・`verify-calculations.js`・`CLAUDE.md`・`.git` など。  
`docs/` を公開すると記事原稿やアクセスコード運用メモが誰でも読めます。

---

## 手順（既存サイトを上書き）

1. [Netlify](https://app.netlify.com/) にログインし、サイト **`zaitaku-hiyo`** を開く。
2. **Deploys** タブを開く。
3. 画面下部（または Drag and drop エリア）に、上記 **5ファイルだけを入れたフォルダ**（または `netlify-drop` フォルダ）をドラッグ＆ドロップする。
4. デプロイ完了後、https://zaitaku-hiyo.netlify.app/ をハードリロード（キャッシュクリア）して確認する。

### 確認ポイント

- アクセスコード入力ゲートが表示される（既存ハッシュのまま）
- 在がん総の選択肢が「**1日単位×週7日**の包括請求」になっている
- ヘルプ文に「1日につき」「7日分」の説明がある
- 例: 機能強化型・病床なし・院外・4週 → 在がん総 **46,200点**（1,650×7×4）。75歳・1割・一般なら高額適用後 **約22,000円** 前後（令和8年8月改定）

---

## アクセスコード

ハッシュは変更していません（既存の購入者コードのまま）。  
変更が必要な場合のみ `docs/ACCESS_CODE.md` を参照。

---

## 関連ドキュメント

- `netlify-packages/README.md` … 上記 zip のダウンロードリンク一覧
- `docs/URL_MIGRATION.md` … 初回の Netlify 移設手順（案B）
- `docs/ACCESS_CODE.md` … コード変更・院内用ゲート無しビルド
- `docs/NOTE_SALES_GUIDE.md` … 公開済みnote本文の金額差し替え表
