# 公開URLの変更ガイド（ユーザー名を隠す・身バレ対策）

現在の公開URLは GitHub Pages の仕様上、**GitHubユーザー名**を含みます。

```
https://rushwistuq-droid.github.io/zaitaku-iryo-hiyo/
        ^^^^^^^^^^^^^^^^ ← ユーザー名がURLに出てしまう
```

このユーザー名部分を隠す／別のURLにするには、**ホスティング先または独自ドメインを変える**必要があります。

> ✅ **前提**：本サイトは全ファイルが相対パス（`./index.html`, `styles.css`, `app.js`, `icon.svg` 等）で作られているため、**どのドメイン・どのホストに置いてもそのまま動きます**。移行にコード改修はほぼ不要です。

以下、費用と手間の順に3案を示します。

---

## 案A：独自ドメインを取得（最もクリーン・推奨）

`https://zaitaku-hiyo.com` のような自分のドメインで公開し、ユーザー名を完全に隠します。GitHub Pages のまま使えます。

**費用**：年 1,000〜1,500円程度（`.com` 等）

### 手順
1. お名前.com / Cloudflare Registrar / Google Domains 後継等で、**個人名と無関係なドメイン**を取得（例 `zaitaku-hiyo.com`）。
   - Whois情報は「Whois代行／プライバシー保護」を必ず有効に（登録者名の露出を防ぐ）。
2. リポジトリ直下に `CNAME` ファイルを作成し、取得したドメインだけを1行書く。
   ```
   zaitaku-hiyo.com
   ```
3. ドメイン側DNSで以下を設定：
   - `A` レコード（apex）→ `185.199.108.153` / `.109.153` / `.110.153` / `.111.153`
   - もしくは `www` の `CNAME` → `rushwistuq-droid.github.io`
4. GitHub リポジトリの **Settings → Pages → Custom domain** に同じドメインを入力し、`Enforce HTTPS` を有効化。
5. 反映後、noteに載せるURLを新ドメインに差し替える。

> ℹ️ 注意：GitHubの**リポジトリ自体**（`github.com/rushwistuq-droid/...`）は引き続きユーザー名を含みます。ソースを見られたくない場合は、後述の「補足：リポジトリ側の対策」を参照。

---

## 案B：中立な無料ホストへ移設（無料・ユーザー名も出ない）★採用

Cloudflare Pages や Netlify に置くと、`zaitaku-hiyo.pages.dev` のような**中立なサブドメイン**で公開でき、GitHubユーザー名が一切URLに出ません。無料で独自ドメインも後付けできます。

**費用**：無料

> 🔐 **最重要・セキュリティ注意**：
> 公開ホストにアップロードするのは、**アプリ本体の5ファイルだけ**にしてください。
> ```
> index.html  app.js  styles.css  icon.svg  manifest.webmanifest
> ```
> `docs/`（記事・アクセスコード運用メモ）や `verify-calculations.js`・`CLAUDE.md` を**一緒に上げないこと**。
> `docs/` を公開すると、記事本文やコード運用メモが誰でも読めてしまいます。
> ※このアプリは相対パス構成なので、上記5ファイルだけで完全に動作します。

### 手順（Netlify Drop が最も簡単・推奨）
1. [https://app.netlify.com/drop](https://app.netlify.com/drop) を開く（無料アカウント作成。表示名は任意の中立名でOK）。
2. 上記**5ファイルだけを入れたフォルダ**（またはそのzip）を、ページ上にドラッグ&ドロップ。
3. 即座に `https://<ランダム名>.netlify.app` が発行される。
4. **Site settings → Change site name** で、中立な名前（例 `zaitaku-hiyo`）に変更 → `https://zaitaku-hiyo.netlify.app`。
5. 更新時は、同じ場所に新しいファイルを再ドロップするだけ。

### 手順（Cloudflare Pages の場合）
1. Cloudflare アカウントを作成（表示名は任意）。
2. **Workers & Pages → Create → Pages → Direct Upload** を選び、プロジェクト名に中立な名前（例 `zaitaku-hiyo`）を付ける。
   - GitHub連携ではなく **Direct Upload** を使えば、リポジトリのユーザー名とも切り離せます。
3. 上記**5ファイルだけ**をアップロード。
4. 発行される `https://zaitaku-hiyo.pages.dev` をnoteに掲載。
5. 更新時は、変更後のファイルを再アップロード（または案Aの独自ドメインを紐付け）。

> ✅ このリポジトリには、すでに5ファイルだけをまとめた配布用フォルダ／zipを別途用意できます（制作アシスタントから受け取ったものをそのままドロップすればOK）。

---

## 案C：中立名の新しいGitHubアカウント／組織に移す（無料）

個人名と無関係な名前で新しいGitHubアカウント（または Organization）を作り、リポジトリを移します。URLは `https://<中立名>.github.io/...` になります。

**費用**：無料　**手間**：アカウント管理が1つ増える

### 手順
1. 中立な名前の新GitHubアカウント/組織を作成（例 `zaitaku-tools`）。
2. 現リポジトリを **Transfer**（Settings → Danger Zone → Transfer ownership）、または内容をコピーして新規リポジトリを作成。
3. 新アカウント側で **Settings → Pages** を有効化。
4. URLが `https://zaitaku-tools.github.io/zaitaku-iryo-hiyo/` になる。

---

## どれを選ぶべきか

| | ユーザー名を隠せる | 費用 | 手間 | おすすめ度 |
|---|:---:|:---:|:---:|:---:|
| **A. 独自ドメイン** | ◎（完全） | 年1,000円〜 | 小 | ★★★ |
| **B. 中立無料ホスト** | ◎（完全） | 無料 | 小〜中 | ★★★ |
| **C. 新GitHubアカウント** | ○（中立名になる） | 無料 | 中 | ★★ |

- **費用をかけてでも最もクリーンに** → 案A
- **無料で今すぐユーザー名を消したい** → 案B（Cloudflare Pages / Netlify）

---

## 補足：リポジトリ側（ソース）の身バレ対策

公開URLを変えても、GitHub上の**リポジトリ**が公開のままだとユーザー名やコミット履歴（メールアドレス等）が見られます。気になる場合は：

- リポジトリを **Private** にする（GitHub Pages は Public/Private どちらからでも公開可能。※一部プランで制約あり）。
- コミットの **author 名・メールを中立なものに設定**（`git config user.name` / `user.email`）。GitHubの「noreply」メール利用も検討。
- ただし Private にすると、GitHub Actions での自動デプロイ設定は現状のまま使えます（Pagesの公開設定は維持されます）。

---

## 移行後にやること（共通チェックリスト）

- [ ] `docs/NOTE_ARTICLE.md` と `docs/NOTE_SALES_GUIDE.md` 内のURLを新URLに一括置換
- [ ] `CLAUDE.md` / `docs/HANDOVER.md` の公開URL記載を更新
- [ ] 旧URL（`rushwistuq-droid.github.io/...`）は、可能なら新URLへリダイレクト or 非公開化
- [ ] note本文・見出し画像・スクショ内のURL表記も差し替え

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026年7月 | 公開URL変更（身バレ対策）ガイド作成 |
