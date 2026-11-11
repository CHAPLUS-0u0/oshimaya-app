# 推しマヤ（OshiMayaApp）

BTS等の推しとマヤ暦の相性診断サイト。診断カード生成＋Threads投稿の自動化ダッシュボード付き。
GitHub Pages（このリポジトリ）で公開。**pushすると本番サイトに即反映される。**

## 作業ルール
- このフォルダは **Claude Code だけ**で編集する（他のツールと同時に触ると未コミット変更が食い違う）。
- **push（公開）は、必ずユーザーの「pushしてええよ」を待ってから。** commitはローカルなので先にしてよい。
- コミットする前に `git diff --cached | grep AIza` で **APIキーが入っていない**ことを確認する。
- 日本語・関西弁寄りの口調で、専門用語を避けて説明する（ユーザーは非エンジニア）。
- 画面操作はユーザー自身が行う（Make・Buffer・GASエディタ・GitHubログインは私からは触れない）。

## 自動投稿の流れ
```
ダッシュボード(script.js) → GAS(doPost) → Drive保存 → Make(Webhook) → Buffer → Threads
```
- 記事は GAS の `runAutonomousAgent`（Gemini）が毎日スプレッドシートに追加する。
- スプレッドシート列：A予約日時 B投稿文 C対象メンバー D状態 E SNS F題名 G関係性タイプ H関係性コピー I画像用場面 J画像用感情。
  列を足すときは `appendRow` と `doGet` の両方を直す。
- ダッシュボードの承認ボタンは、画像添付が必須。`mode:'no-cors'` で送るため、**サイトからは成功/失敗が読めない**（結果はMakeの History で見る）。
- Make シナリオ「Integration Webhooks」は `Webhook → Buffer(Create a status update)` の2モジュール。
  Buffer の Media は `Link to an image` と `Thumbnail` の**両方**に `imageUrl` を入れる必要がある。
  Make はエラーが出るとシナリオを**自動でOFF**にする（直したらActiveに戻す）。
- Threads は **1投稿500文字まで**。GAS は450字を目安に短縮、ダッシュボードは500字超で承認を止め、文字数カウンターを赤くする。投稿文は**切らずに**警告する方針。

## GAS（gas_agent_complete.js）
- **gitではデプロイされない。** ユーザーが Apps Script に貼り、「デプロイを管理 → 新バージョン」で反映する（URLは変わらない）。
- リポジトリ内の `GEMINI_API_KEY` は必ず `"YOUR_GEMINI_API_KEY"` のまま。本物のキーはGASエディタ側にだけある。
  貼り付けで丸ごと置き換えるとキーが仮の文字に戻るので、**貼った後にキーを入れ直すよう必ず伝える**。

## 画像プロンプト（script.js の renderDashboardCards 内）
- 文字は「OSHI × MAYA」「KIN番号」「太陽の紋章名」だけ許可、サイズは画像高さの割合で指定（小さすぎて読めなかった実績）。
- 顔立ちは「あらかじめ共有した基本キャラ画像」に合わせ、髪型・髪色はカードの入力欄（人物A/B）で上書きする。
- 実在人物への似せ方の指示を工夫して制限を回避するような書き方はしない。

## 印刷（PDF）
- `print_fix.css` は style.css / style_v8.css の**後**に読み込む。
- `.canvas-wrapper` に画面用 `zoom:0.8` が掛かったまま印刷される。ページ高さは `min-height:355mm`
  （358mmまでOK、360mmから各ページの後ろに白紙ページができる＝実測）。zoomを変えたらここも直す。

## サイト・キャッシュ
- `sw.js`（Service Worker）はネット優先。CSS/JSを変えたら `index.html` の `?v=` と `sw.js` の `CACHE_NAME` も上げる。
- `image_assets.js`（約30MB）は画像のBase64。画像を足したら作り直しが必要。中身は読み込まない。

## テスト方法（nodeが無い環境）
- 画面なしのEdge（`--headless=new --dump-dom` や `--remote-debugging-port`）で index.html を開いて確認する。
  GASの返事は `window.fetch` を差し替えたダミーデータで代用できる。
- 一時ファイルはスクラッチパッドに置く。リポジトリには残さない。

## 公開まわり
- 公開先：GitHub Pages（リポジトリ CHAPLUS-0u0/oshimaya-app）。
- このPCは別アカウントのGitHub資格情報を持っているので、`origin` のURLにはユーザー名を入れて固定してある。
  push が 403 になったら、まず `git remote -v` を確認する。
