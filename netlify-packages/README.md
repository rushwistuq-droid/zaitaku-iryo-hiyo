# Netlify Drop 用ダウンロードパッケージ

このフォルダには、Netlify にドラッグ＆ドロップする **zip ファイル** を置いています。

| ファイル | 用途 | アクセスコード |
|----------|------|----------------|
| `zaitaku-hiyo-note-netlify-drop.zip` | 有料note購入者向け（https://zaitaku-hiyo.netlify.app/） | **あり** |
| `zaitaku-hiyo-innai-netlify-drop.zip` | 院内スタッフ向け（別URLで公開） | **なし** |

## 使い方

1. 上記 zip をダウンロードする（GitHub 上ではファイル名をクリック → **Download**）。
2. zip を解凍し、中身の **5ファイルだけ** が出てくることを確認する。
3. [Netlify](https://app.netlify.com/) の対象サイト → **Deploys** に、解凍したフォルダをドラッグ＆ドロップする。

⚠️ `docs/` やその他のファイルは含めないでください。

## 再生成（開発者向け）

ツール本体を更新したあと、リポジトリ直下で次を実行すると、フォルダと zip がまとめて作り直されます。

```bash
node scripts/build-netlify-packages.js
```

出力先:

- `netlify-drop/` … 有料note向けフォルダ
- `netlify-drop-internal/` … 院内用フォルダ
- 本フォルダの zip 2つ

院内用の詳細は `docs/ACCESS_CODE.md` の「院内用（ゲート無し）ビルド」を参照してください。
