# Claude Code 引き継ぎ手順書

在宅医療費用シミュレーター（`zaitaku-iryo-hiyo`）を Claude Code で継続開発するための完全引き継ぎドキュメントです。

---

## 1. 引き継ぎチェックリスト

Claude Code セッション開始時に、以下を順に確認してください。

- [ ] リポジトリを clone した（または既存ワークスペースを開いた）
- [ ] `main` ブランチが最新である（`git pull origin main`）
- [ ] Node.js 20 以上が使える（`node -v`）
- [ ] `node verify-calculations.js` が **51 passed, 0 failed**
- [ ] `CLAUDE.md`（ルート）を読んだ
- [ ] 公開サイトが表示できる: https://rushwistuq-droid.github.io/zaitaku-iryo-hiyo/
- [ ] 本書（`docs/HANDOVER.md`）と `docs/NOTE_SALES_GUIDE.md` の存在を把握した

---

## 2. リポジトリ情報

| 項目 | 値 |
|------|-----|
| GitHub | `rushwistuq-droid/zaitaku-iryo-hiyo` |
| 本番ブランチ | `main` |
| 公開URL | https://rushwistuq-droid.github.io/zaitaku-iryo-hiyo/ |
| ライセンス | 明示なし（オーナー確認要） |
| パッケージ管理 | **なし**（package.json なし） |

### 主要マージ済み PR（履歴）

| PR | 内容 |
|----|------|
| #3 | 施設・同一建物5区分の管理料 |
| #4 | 公費制度の精度向上（難病長期・自立支援按分・自治体助成） |
| #5 | 在がん総80%・頻回訪問・薬剤師・CI・月12回減算等 |
| #6 | 世帯上限・加算建物区分・頻回2回目以降・病床区分・noteガイド |

---

## 3. プロジェクト構成

```
zaitaku-iryo-hiyo/
├── index.html              # UI（フォーム・結果・モーダル・印刷レイアウト）
├── app.js                  # 計算ロジック + DOMイベント（本番）
├── verify-calculations.js  # 計算ロジックミラー + 自動テスト（51件）
├── styles.css              # スタイル
├── icon.svg                # PWAアイコン
├── manifest.webmanifest    # PWAマニフェスト
├── CLAUDE.md               # Claude Code 向け短縮指示
├── docs/
│   ├── HANDOVER.md         # 本ファイル
│   └── NOTE_SALES_GUIDE.md # 有料note販売用文案
└── .github/workflows/
    ├── deploy-pages.yml    # main push → GitHub Pages
    └── verify-calculations.yml  # 全ブランチでテスト実行
```

**行数目安（2026年7月時点）**

| ファイル | 行数 |
|----------|------|
| app.js | 約1,440 |
| index.html | 約840 |
| verify-calculations.js | 約930 |
| styles.css | 約1,070 |

---

## 4. アーキテクチャ

### 4.1 データフロー

```
ユーザー入力（index.html フォーム）
    ↓
updateCalculations()          … app.js エントリポイント
    ↓
calculateMedicalPoints()      … 診療点数（訪問・管理・加算・往診等）
    ↓
applyPublicExpense()          … 公費・高額療養費・障害者助成
    ↓
updateDonutChart / updateAdvice / updatePrintData  … 結果表示
```

### 4.2 料金表 `FEE_2026`

`app.js` と `verify-calculations.js` の両方に同一構造で定義。

| キー | 内容 |
|------|------|
| `visit` | 訪問診療料（自宅890 / 施設215） |
| `management` | 在医総管・施医総管（home/facility × section1-3 × 建物5区分） |
| `management.section1` | 機能強化型のみ `bedless` / `withBed` の二層 |
| `addons` | 加算（充実体制は `clinicTierByBuilding` で建物区分逓減） |
| `cancerCare` | 在がん総（section1/2、section3は80%減算） |
| `guidance` | 在宅療養指導管理料（排他1件） |

### 4.3 診療所区分

```javascript
CLINIC_SECTION = {
  'kinou-kyouka': 'section1',   // 機能強化型
  'zashin-ippan': 'section2',   // 在支診
  'other-clinic': 'section3'    // 一般診療所（管理料80%減算）
}
```

### 4.4 公費・助成（`applyPublicExpense`）

| 種別 | キー | 概要 |
|------|------|------|
| なし | `none` | 高額療養費 → 障害者手帳助成 |
| 生活保護 | `welfare` | 全額0円 |
| 指定難病 | `nanbyou` | 2割（1割維持可）+ 月上限 |
| 自立支援 | `jiritsu` | 1割 + 按分 + 上限 |
| 自治体助成 | `local-subsidy` | zero / fixed-500 / ratio-cap-* |

### 4.5 高額療養費

- **70歳未満:** `getHouseholdHighCostLimit()` が世帯上限を直接適用
- **70歳以上:** まず個人上限（`getHighCostLimit`）→ 任意で世帯上限（他世帯員費用入力時）

---

## 5. 開発手順

### 5.1 環境構築

```bash
git clone https://github.com/rushwistuq-droid/zaitaku-iryo-hiyo.git
cd zaitaku-iryo-hiyo
git checkout main
git pull origin main

# Node.js 20+ が必要（テストのみ）
node verify-calculations.js
```

追加の `npm install` は不要です。

### 5.2 機能追加・修正の標準フロー

1. `main` から `cursor/<タスク名>-feaf` ブランチを作成
2. **`app.js` と `verify-calculations.js` を両方更新**
3. `verify-calculations.js` の `tests` 配列にケース追加（境界値・回帰防止）
4. `node verify-calculations.js` で 51+ passed を確認
5. 必要なら `index.html`（UI）・`styles.css` を更新
6. commit → push → PR → `main` マージ
7. マージ後、GitHub Pages が数分で自動更新

### 5.3 ローカルでのUI確認

```bash
python3 -m http.server 8080
# ブラウザで http://localhost:8080/index.html
```

`file://` 直開きでも動作しますが、PWA・フォント読み込みは HTTP 推奨です。

### 5.4 テストの追加例

```javascript
// verify-calculations.js の tests 配列末尾に追加
{
    name: '説明的なテスト名',
    p: {
        location: 'home',
        clinicType: 'kinou-kyouka',
        visitFreq: 2,
        // ... 他パラメータ
        ratio: 0.3,
        publicExpense: 'none',
        age: '69',
        incomeKey: 'u70-c'
    },
    expectPts: 890 * 2 + 4085 + 68  // 期待点数
    // または expectTotal / expectTotalCap / expectNursing
}
```

---

## 6. CI/CD

| Workflow | トリガー | 内容 |
|----------|----------|------|
| `verify-calculations.yml` | push / PR（全ブランチ） | `node verify-calculations.js` |
| `deploy-pages.yml` | `main` push | リポジトリルートを GitHub Pages にデプロイ |

**注意:** デプロイはリポジトリ全体（`.`）をアップロード。`.git` は含まれないが、`docs/` も公開される。

---

## 7. 実装済み機能一覧

### 診療報酬

- [x] 訪問診療料（自宅/施設）
- [x] 在医総管・施医総管（月1/月2・別表8-2/8-3・2割要件）
- [x] 同一建物5区分（自宅・施設）
- [x] 機能強化型 病床あり/なし
- [x] 一般診療所 管理料80%減算
- [x] 在がん総（週単位包括・section3 80%）
- [x] 在宅療養指導管理料（排他1件）
- [x] 緊急往診（昼夜・休日・深夜帯）
- [x] 月12回超減算（5回目以降50%）
- [x] 主要加算（DX・物価・ベースアップ・ターミナル・看取り等）
- [x] 充実体制・実績加算の建物区分逓減
- [x] 頻回訪問加算（別表8-2・800+300点/回）

### 自己負担・公費

- [x] 高額療養費（全所得区分・段階制）
- [x] 70歳以上世帯上限（他世帯員費用入力）
- [x] 指定難病（長期軽減・人工呼吸器）
- [x] 自立支援（按分%）
- [x] 自治体助成（複数パターン）
- [x] 障害者手帳助成
- [x] 介護保険（居宅療養管理指導費）

### 品質・運用

- [x] 自動テスト 51件
- [x] GitHub Actions CI
- [x] GitHub Pages 自動デプロイ
- [x] PWA対応（manifest + icon）
- [x] 印刷/PDF用レイアウト
- [x] 有料note販売ガイド

---

## 8. 未実装・今後の候補

優先度はプロダクト方針（有料note概算ツール）に合わせて判断してください。

| 優先度 | 課題 | 備考 |
|--------|------|------|
| 中 | 同一建物特例 | 同居世帯2人以上・戸数10%以下等 → 1人区分 |
| 中 | 介護限度額表示 | 月間支給限度額との関係を結果に表示 |
| 中 | 実症例照合 | レセプト1〜2件で突合（運用） |
| 低 | オンライン診療管理料区分 | 情報通信機器併用の別点数 |
| 低 | 在がん総要件チェック | 週4日訪問・週1回訪問看護 |
| 低 | 地域加算 | 地域区分 |
| 低 | 保険外費用欄 | 交通費・文書料 |
| 低 | 複数機関合算 | かかりつけ1機関前提のまま |
| 低 | E2Eテスト | Playwright等 |

---

## 9. よくある落とし穴

1. **`app.js` だけ直してテストが古いまま** → 必ず `verify-calculations.js` も同期
2. **`FEE_2026.management.section1` の構造** → `bedless`/`withBed` の二層。他sectionはフラットな5区分
3. **頻回訪問加算** → `patientStatus === 'severe'`（別表8-2）かつ月4回以上のみ
4. **薬剤師同時指導料** → 自宅・在医総管（`clinicType !== 'other-clinic'`）のみ
5. **在がん総時** → 訪問・管理料は包括。`visitFreq` は無効化
6. **GitHub Pages** → `main` 以外のブランチでは本番URLは更新されない

---

## 10. Claude Code への最初のプロンプト例

セッション開始時に以下を貼るとスムーズです。

```
リポジトリ rushwistuq-droid/zaitaku-iryo-hiyo の在宅医療費用シミュレーターを継続開発します。

まず以下を実行・確認してください:
1. CLAUDE.md と docs/HANDOVER.md を読む
2. node verify-calculations.js で 51 passed を確認
3. 変更は app.js と verify-calculations.js を必ず同期

今回のタスク: [ここに具体的な依頼を書く]
```

---

## 11. 有料note販売について

- 販売用文案: `docs/NOTE_SALES_GUIDE.md`
- ツールは「概算」である旨を販売ページ・ツール内の両方に明記済み
- 公開URLをnote本文に掲載する

---

## 12. 連絡・権限

- GitHub リポジトリの admin 権限が必要（Pages 設定・マージ）
- 診療報酬の公式確認: 厚生労働省 令和8年度 医科診療報酬点数表

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-07-11 | Claude Code 引き継ぎ手順書初版作成 |
