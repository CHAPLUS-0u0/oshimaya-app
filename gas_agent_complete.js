// ==========================================
// 【推しマヤ完全自動エージェント ＋ ダッシュボード連携 ＋ Make連携】
// 毎日SNSトレンド（ニュース）をチェックし、
// Gemini AIを使ってマヤ暦考察記事を自動執筆するプログラム
// ==========================================

// ★★★ ここに取得したGemini APIキーを貼り付けます ★★★
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"; // ※本物のキーはGASエディタ側にだけ貼る（このファイルには書かない）

const SHEET_NAME = 'シート1'; // ※実際のシート名に合わせて変更してください！

// ★★★ 今回追加した設定（DriveフォルダとMakeのURL） ★★★
const IMAGE_FOLDER_ID = "1UEbbuc3K_iDTFnBBQo41MICXtqmRpMUp"; 
const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/0scht9wj1pzlnkjj9llwo9n4y53wpj9j";

// Threadsは1投稿500文字まで。数え方のズレに備えて少し余裕を持たせた上限
const POST_MAX_LENGTH = 450;


function runAutonomousAgent() {
  try {
    // 1. Gemini AIに「ARMY語り草の伝説エピソードの抽出とマヤ暦考察」を指示する
    var prompt = `
あなたはBTSを深く愛する大人世代のARMYであり、マヤ暦（ツォルキン暦）の知識を使って彼らの魅力を探求している「chaplusちゃみん」です。
毎日SNSをパトロールして、ファンの間で話題になる「BTSメンバー同士の尊い絡み（ケミの伝説エピソード）」をピックアップし、マヤ暦で考察してください。

【出力するエピソードの条件】
- ARMYの間で語り継がれている尊いシーンやエピソードを、毎回「完全にランダム」かつ「マイナーなものも含めて」1つ選ぶこと。
- ※重要※ 毎回同じエピソードばかりにならないよう、メンバーの組み合わせ（クオズ、グクテテ、ナムジン、ソプ、SIN、ミニモニ、クサズなど）や、選ぶエピソード（ライブでの出来事、Run BTS!のワンシーン、IN THE SOOPでの何気ない会話、昔の喧嘩エピソードなど）を多岐にわたって散らしてください。
- ※厳守※ 「餃子事件」などのあまりにも有名すぎるエピソードは絶対に選ばないでください。もっとマニアックでディープなエピソードを発掘してください。
- 登場するメンバー2人の名前を「RM, Jin, Suga, J-Hope, Jimin, V, Jungkook」のいずれかの表記で正確に明記すること（例: "Jimin & V"）。
- マヤ暦の「KIN」「太陽の紋章」「音」「関係性（神秘キンなど）」の用語を自然に交え、生年月日から正しいKINを想定して考察すること。
- 語り口調は「このエピソードを見ていたら、ふとこんな風に思ったんですよね…」というように、一人のファンとして自然に考察をシェアするトーンにしてください。
- 全体的に、絵文字は控えめにし、知性と大人の余裕を感じさせる「上品で落ち着いたトーン」で執筆すること。
- ※禁止事項※ 「今回は〇〇について」「鑑定士の〇〇です」「自己紹介」などの定型的な挨拶は一切含めないでください。いきなり本題（エピソードの振り返りや考察）から自然に入ってください。

以下のJSONフォーマットのみを出力してください（最初の { から最後の } まで。絶対に \`\`\`json などのMarkdownブロック記号をつけないでください）。

{
  "target_members": "（例: Jimin & V）",
  "episode_summary": "（画像生成用のタイトルとして15文字前後で短くキャッチーに。例：IN THE SOOPでのあの夜）",
  "relation_type": "（例：補い合う、惹かれ合う、似た者同士、刺激し合う、自由×見守る、正反対、など二人の関係を表す短い分類）",
  "relation_word": "（例：自然と支え合う2人、静と動の名コンビなど12〜15文字程度の関係性キャッチコピー）",
  "sns_post_text": "（※ハッシュタグ込みで必ず400文字以内に収めること。ThreadsやXにそのまま投稿する文章。過度な感嘆符や絵文字は避け、推しへの深い愛とマヤ暦の神秘性をしっとりと語る、大人向けで落ち着いたトーンの考察文。ハッシュタグも含む）"
}
    `;

    var geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;
    var payload = {
      "contents": [{
        "parts": [{ "text": prompt }]
      }],
      "generationConfig": {
        "temperature": 0.9, // ★ランダム性をさらに強めに設定しました
        "responseMimeType": "application/json"
      }
    };

    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    // 2. AIに執筆させる（混雑エラー対策で最大3回リトライする）
    var geminiResponse;
    var jsonResult;
    var maxRetries = 3;
    var success = false;
    
    for (var i = 0; i < maxRetries; i++) {
      try {
        geminiResponse = UrlFetchApp.fetch(geminiUrl, options);
        jsonResult = JSON.parse(geminiResponse.getContentText());
        
        if (jsonResult.error) {
          throw new Error(jsonResult.error.message);
        }
        success = true;
        break; 
      } catch (err) {
        Logger.log("API呼び出し失敗 (" + (i+1) + "回目): " + err.message);
        if (i < maxRetries - 1) {
          Utilities.sleep(5000); 
        } else {
          throw new Error("Gemini API Error: サーバーが混雑しています。（" + err.message + "）");
        }
      }
    }

    var aiOutput = jsonResult.candidates[0].content.parts[0].text;
    aiOutput = aiOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    
    var parsedOutput = JSON.parse(aiOutput);

    // 投稿文がThreadsの文字数上限を超えていたら、AIに短くし直してもらう（それでもダメなら文の切れ目で切る）
    parsedOutput.sns_post_text = fitToPostLimit(parsedOutput.sns_post_text);

    // 3. スプレッドシート（ダッシュボード）に書き込む
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
       sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }
    
    var scheduleDate = new Date();
    scheduleDate.setDate(scheduleDate.getDate() + 3);
    var formattedDate = Utilities.formatDate(scheduleDate, Session.getScriptTimeZone(), "yyyy/MM/dd 20:00");

    sheet.appendRow([
      formattedDate,                        // A列: 予約日時
      parsedOutput.sns_post_text,           // B列: 投稿文（SNS用）
      parsedOutput.target_members,          // C列: 対象メンバー (Jimin & Vなど)
      "AI承認待ち",                          // D列: ステータス
      "Threads",                            // E列: SNS
      parsedOutput.episode_summary,         // F列: タイトル（ダッシュボードの画像生成用）
      parsedOutput.relation_type || "",     // G列: 関係性タイプ
      parsedOutput.relation_word || ""      // H列: 関係性キャッチコピー
    ]);

    Logger.log("成功！AIが記事を執筆し、スプレッドシートに追加しました。");

  } catch (e) {
    Logger.log("エラーが発生しました: " + e.toString());
  }
}


// 投稿文を POST_MAX_LENGTH 文字以内に収める（収まらなければ切らずに警告ログだけ残す）
function fitToPostLimit(text) {
  text = String(text || "").trim();

  // AIは文字数を数えるのが苦手なので、超えていたら「短くして」と頼み直す（最大2回）
  for (var attempt = 0; attempt < 2 && text.length > POST_MAX_LENGTH; attempt++) {
    try {
      var rewritePrompt =
        "次の投稿文を、意味・口調・雰囲気を保ったまま、ハッシュタグも含めて" + POST_MAX_LENGTH + "文字以内に短くしてください。" +
        "現在は" + text.length + "文字です。前置きや説明は書かず、書き直した投稿文だけを出力してください。\n\n" + text;
      var res = UrlFetchApp.fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
        {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({ contents: [{ parts: [{ text: rewritePrompt }] }] }),
          muteHttpExceptions: true
        }
      );
      var shortened = JSON.parse(res.getContentText()).candidates[0].content.parts[0].text.trim();
      if (shortened) text = shortened;
    } catch (err) {
      Logger.log("短縮リトライ失敗 (" + (attempt + 1) + "回目): " + err.message);
      break;
    }
  }

  // それでも長い場合は、文章を読めなくなるので切らずにそのまま返す。
  // ダッシュボードの文字数カウンターが赤く警告するので、人の手で削ってから承認する。
  if (text.length > POST_MAX_LENGTH) {
    Logger.log("警告：投稿文が" + text.length + "文字あり、上限(" + POST_MAX_LENGTH + "文字)を超えています。ダッシュボードで削ってください。");
  }
  return text;
}

// ==========================================
// ここから下：ダッシュボード連携用（GET / POST）
// ==========================================

// 1. GETリクエスト（ダッシュボードでデータを読み込む時）
function doGet(e) {
  // ※CORS対応のため、レスポンスヘッダーの設定などは不要ですがJSONP形式にするなど工夫が必要な場合もあります。
  // 今回はそのまま出力します。
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 1行目から全データを取得
  const dataRange = sheet.getRange(1, 1, lastRow, sheet.getLastColumn());
  const values = dataRange.getValues();

  const result = [];
  values.forEach((row, index) => {
    // ステータスが書かれている行だけを対象にする
    if (row[3] && row[3].toString().includes("承認")) {
      result.push({
        rowId: index + 1, // スプレッドシート上の行番号
        scheduleTime: row[0] || "",   // A列: 予約日時
        snsText: row[1] || "",        // B列: 投稿文（SNS用）
        targetMembers: row[2] || "",  // C列: 対象メンバー
        title: row[5] || "",          // F列: 画像生成用のタイトル
        status: row[3] || "AI承認待ち", // D列: ステータス
        relationType: row[6] || "",   // G列: 関係性タイプ
        relationWord: row[7] || ""    // H列: 関係性キャッチコピー
      });
    }
  });

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// 2. POSTリクエスト（ダッシュボードからデータが送られてきた時）
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    
    // ==============================================================
    // 【新規追加】ダッシュボードで画像を生成して「Threadsに予約」した時の処理
    // ==============================================================
    if (postData.sns === "threads" && postData.image) {
      
      // 1. 送られてきたBase64形式の画像データを復元する
      const base64Data = postData.image.split(",")[1];
      const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), "image/png", "sns_image_" + new Date().getTime() + ".png");
      
      // 2. Googleドライブの特定フォルダに画像を保存する
      const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
      const file = folder.createFile(blob);
      
      // 3. 画像を誰でも見れる状態にして公開URLを取得する（Makeが画像を拾えるようにするため）
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      // getDownloadUrl()は直接画像を表示・ダウンロードできるURLになります
      const imageUrl = "https://drive.google.com/uc?export=download&id=" + file.getId();
      
      // 4. Make.comのWebhookへ、テキスト・画像URL・予約時間を送信する
      const payload = {
        text: postData.text,
        imageUrl: imageUrl,
        scheduleTime: postData.time
      };
      
      UrlFetchApp.fetch(MAKE_WEBHOOK_URL, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload)
      });
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Makeへの送信が完了しました" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    
    // ==============================================================
    // 【既存機能】ダッシュボードからステータス（ボツ/承認）を更新した場合
    // ==============================================================
    if (postData.action === "update") {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      }
      
      const rowId = postData.rowId;
      
      if(rowId && sheet) {
        // B列にSNSテキストを上書き
        sheet.getRange(rowId, 2).setValue(postData.snsText);
        // D列にステータスを上書き
        sheet.getRange(rowId, 4).setValue(postData.status);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "更新しました" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 過去のダブリや不要な文章を一括お掃除するプログラム
// ==========================================
function cleanUpPastEntries() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return; // データがない場合は終了
  
  // データをまとめて取得
  var dataRange = sheet.getRange(1, 1, lastRow, sheet.getLastColumn());
  var values = dataRange.getValues();
  
  // 後ろの行から処理していく（行削除でズレないようにするため）
  for (var i = values.length - 1; i >= 0; i--) {
    var row = values[i];
    var text = row[1]; // B列: 投稿文
    var summary = row[5]; // F列: タイトル
    
    // 餃子事件など、特定のNGワードが含まれる行はまるごと削除（ボツにする）
    if (text && (text.includes("餃子") || summary.includes("餃子"))) {
      sheet.deleteRow(i + 1);
      continue;
    }
    
    // 名乗りや「今回は」などの不要な文章だけを置換して綺麗にする
    if (text) {
      var newText = text;
      // 不要なフレーズを一掃
      newText = newText.replace(/マヤ暦（ツォルキン暦）鑑定士のchaplusちゃみんです。/g, "");
      newText = newText.replace(/マヤ暦鑑定士のchaplusちゃみんです。/g, "");
      newText = newText.replace(/chaplusちゃみんです。/g, "");
      newText = newText.replace(/今回は、/g, "");
      newText = newText.replace(/今回は/g, "");
      
      // 空白行ができすぎないように調整
      newText = newText.replace(/^\n+/, "");
      
      // もし文章が修正されていたら、スプレッドシートに上書き保存
      if (newText !== text) {
        sheet.getRange(i + 1, 2).setValue(newText.trim());
      }
    }
  }
  
  Logger.log("過去データのお掃除が完了しました！");
}

// ==========================================
// 権限（ポップアップ）を強制的に出すための専用関数
// ==========================================
function forceAuth() {
  // createFileを使うことで、完全なDrive権限（書き込み権限）を要求させます
  var file = DriveApp.createFile('dummy_for_auth.txt', 'dummy');
  file.setTrashed(true); // すぐにゴミ箱に入れます
}
