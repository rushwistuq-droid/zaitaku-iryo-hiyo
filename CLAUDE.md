# Claude Code 向けプロジェクト指示

## プロジェクト概要

**在宅医療（訪問診療）費用シミュレーター** — 患者・家族向けの月額自己負担概算ツール。  
令和8年度（2026年6月施行）診療報酬に基づく。有料note販売を想定した「概算」であり、請求確定ソフトではない。

- **公開URL:** https://rushwistuq-droid.github.io/zaitaku-iryo-hiyo/
- **リポジトリ:** https://github.com/rushwistuq-droid/zaitaku-iryo-hiyo
- **詳細引き継ぎ:** `docs/HANDOVER.md` を必ず読むこと

## 技術スタック

- **フレームワークなし** — 素の HTML / CSS / JavaScript（ビルド・npm・バンドラ不要）
- **Node.js** — `verify-calculations.js` の検証テストのみ（v20推奨）
- **デプロイ** — GitHub Pages（`main` への push で自動）

## 必須ルール

1. **計算ロジックは二重管理** — `app.js` と `verify-calculations.js` を常に同期する。片方だけ直さない。
2. **変更後は必ず** `node verify-calculations.js` を実行し、51件すべてパスすること。
3. **最小差分** — 依頼外のリファクタ・ファイル追加（特に未依頼の .md）を避ける。
4. **点数表** — `FEE_2026` 定数が唯一の料金ソース。2026年6月改定（令和8年度）準拠。
5. **日本語UI** — ラベル・説明文・コミットメッセージは日本語で統一。

## ファイル役割（変更頻度順）

| ファイル | 役割 |
|----------|------|
| `app.js` | 計算ロジック + DOM連動 + UI更新（約1,400行） |
| `verify-calculations.js` | 計算ロジックのミラー + 51件の自動テスト |
| `index.html` | フォーム・結果表示・モーダル（約840行） |
| `styles.css` | スタイル・印刷用レイアウト |
| `docs/NOTE_SALES_GUIDE.md` | 有料note販売用文案 |
| `docs/HANDOVER.md` | 引き継ぎ手順書（本ファイルの詳細版） |

## ローカル開発

```bash
# テスト（必須）
node verify-calculations.js

# ブラウザ確認（任意）
python3 -m http.server 8080
# → http://localhost:8080/index.html
```

## Git・デプロイ

- **本番ブランチ:** `main`
- **機能ブランチ命名:** `cursor/<説明的な名前>-feaf`
- `main` マージ → GitHub Actions で Pages 自動デプロイ + CI テスト

## 計算の中心関数（app.js）

- `FEE_2026` — 点数表定数
- `calculateMedicalPoints()` — 診療点数合計
- `applyPublicExpense()` — 公費・高額療養費・障害者助成
- `getManagementPoints()` — 在医総管/施医総管（建物区分・病床区分）
- `calculateAddonPoints()` — 各種加算
- `updateCalculations()` — UIからのエントリポイント

## 未実装（意図的簡略化・今後の候補）

- 同一建物特例（同居世帯・戸数10%以下等で1人区分）
- オンライン診療管理料の別区分
- 在がん総の週4日要件チェック
- 介護保険月間限度額の表示
- 保険外（交通費等）・複数機関合算
- E2Eテスト

## 参照

- 診療報酬: 令和8年度 医科点数表 第2章 在宅医療（C001/C002/C003等）
- 販売ガイド: `docs/NOTE_SALES_GUIDE.md`
