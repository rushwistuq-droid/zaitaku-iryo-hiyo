# Netlify Drop 用ダウンロードパッケージ

このフォルダには、Netlify にドラッグ＆ドロップする **zip ファイル** を置いています。

## ダウンロード（直接リンク）

| 用途 | ファイル | ダウンロード |
|------|----------|--------------|
| **有料note向け**（アクセスコードあり） | `zaitaku-hiyo-note-netlify-drop.zip` | https://github.com/rushwistuq-droid/zaitaku-iryo-hiyo/raw/main/netlify-packages/zaitaku-hiyo-note-netlify-drop.zip |
| 院内用（アクセスコードなし） | `zaitaku-hiyo-innai-netlify-drop.zip` | https://github.com/rushwistuq-droid/zaitaku-iryo-hiyo/raw/main/netlify-packages/zaitaku-hiyo-innai-netlify-drop.zip |

- 有料note公開URL: https://zaitaku-hiyo.netlify.app/
- GitHub 上から取る場合: リポジトリの `netlify-packages` フォルダを開き、zip をクリック → **Download** でも同じです。

## 使い方

1. 上記リンクから zip をダウンロードする。
2. zip を解凍し、中身の **5ファイルだけ** が出てくることを確認する。
3. [Netlify](https://app.netlify.com/) の対象サイト → **Deploys** に、解凍したフォルダをドラッグ＆ドロップする。

⚠️ `docs/` やその他のファイルは含めないでください。

## フォルダ版（zip を使わない場合）

| 用途 | フォルダ |
|------|----------|
| 有料note向け | `netlify-drop/` |
| 院内用 | `netlify-drop-internal/` |

## 再生成（開発者向け）

ツール本体を更新したあと、リポジトリ直下で次を実行すると、フォルダと zip がまとめて作り直されます。

```bash
node scripts/build-netlify-packages.js
```

詳細手順: `docs/NETLIFY_UPDATE.md`（有料note） / `docs/ACCESS_CODE.md`（院内用）
