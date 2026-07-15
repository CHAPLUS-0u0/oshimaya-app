// 本物のマヤ暦（ツォルキン暦 / ドリームスペル基準）のKIN計算ロジック
function calculateKin(year, month, day) {
    if (month === 2 && day === 29) {
        day = 28; // ドリームスペルでは2月29日はカウントしないため28日として処理
    }
    const baseDate = new Date(1987, 6, 26); // 1987年7月26日がKIN 34
    const targetDate = new Date(year, month - 1, day);
    
    function countLeapDays(d1, d2) {
        let count = 0;
        let start = new Date(d1);
        let end = new Date(d2);
        let sign = 1;
        if (start > end) {
            let temp = start; start = end; end = temp;
            sign = -1;
        }
        for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
            if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
                const leapDate = new Date(y, 1, 29);
                if (leapDate > start && leapDate <= end) {
                    count++;
                }
            }
        }
        return count * sign;
    }
    
    const diffTime = targetDate - baseDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const leapDays = countLeapDays(baseDate, targetDate);
    
    const dreamspellDays = diffDays - leapDays;
    
    let kin = (34 + dreamspellDays) % 260;
    while (kin <= 0) kin += 260;
    return kin;
}

// 太陽の紋章を計算する処理 (1〜20)
function getSealNumber(kin) {
    let seal = kin % 20;
    if (seal === 0) seal = 20;
    return seal;
}

function getSealName(sealNum) {
    const seals = ["赤い龍", "白い風", "青い夜", "黄色い種", "赤い蛇", "白い世界の橋渡し", "青い手", "黄色い星", "赤い月", "白い犬", "青い猿", "黄色い人", "赤い空歩く人", "白い魔法使い", "青い鷲", "黄色い戦士", "赤い地球", "白い鏡", "青い嵐", "黄色い太陽"];
    return seals[sealNum - 1];
}

const MAYA_SEAL_DATA = [
  { // 1. 赤い龍
    kwSet: ["母性", "無償の愛", "包容力", "育む"],
    tag: "母性と包容の型",
    desc: "相手の弱さや葛藤を受け止め、温かい母性で包み込むことに深い愛情を感じるタイプです♡",
    personality: "面倒見が良く、大切な人を全力で守り抜く強さと無償の愛を持っています。",
    emotionTrend: "一生懸命に頑張る姿や、ふと見せる儚さに惹かれやすく、「私が支えてあげたい」と感じる人に心惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹きつけられるのは、心の奥底で「守り、育みたい」という強い母性が揺さぶられるからです。${oshiReason} 彼が葛藤を乗り越える姿に触れるたび、あなたの豊かな愛情が溢れ出します♡`
  },
  { // 2. 白い風
    kwSet: ["共感", "伝える", "繊細さ", "心の繋がり"],
    tag: "共感メッセンジャー型",
    desc: "言葉の裏にある感情を察知し、深く共感し合えるスピリチュアルな繋がりに安心感を感じるタイプです🌿",
    personality: "感受性が強く、人の心の痛みがわかる優しいメッセンジャーです。",
    emotionTrend: "素直な言葉で想いを伝えてくれる人や、繊細な感性を持つ人に強く惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しから目が離せないのは、彼の放つメッセージがあなたの心と深く「共鳴」するからです。${oshiReason} 彼が紡ぐ言葉や歌声は、あなたにとっての心地よい風となり、心を優しく癒してくれます🌿`
  },
  { // 3. 青い夜
    kwSet: ["夢", "マイペース", "豊かさ", "直感"],
    tag: "夢追いロマン型",
    desc: "自分の世界観を大切にし、お互いの夢を応援し合える関係に一番の幸せを感じるタイプです✨",
    personality: "独自の豊かな内面世界を持ち、直感とマイペースさを大切にするロマンチストです。",
    emotionTrend: "自分の世界観を否定せず理解してくれる人や、大きな夢に向かって走る人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しを深く愛してしまうのは、彼があなたの内なる「夢」や「直感」を刺激してくれるからです。${oshiReason} 彼の存在は、あなたが自分のペースで豊かな世界を築くための素晴らしいインスピレーションになります✨`
  },
  { // 4. 黄色い種
    kwSet: ["探求", "気づき", "開花", "納得感"],
    tag: "探求と開花の型",
    desc: "相手を深く知れば知るほど惹かれ、新しい気づきを与えてくれる関係にワクワクするタイプです🔍",
    personality: "知的好奇心が旺盛で、納得いくまで物事を深く探求する一面があります。",
    emotionTrend: "自分の知らない世界を教えてくれる人や、一緒にいると成長できると感じる人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹かれるのは、彼があなたに新しい「気づき」を与え、眠っていた感情を「開花」させてくれるからです。${oshiReason} 彼を知れば知るほど沼に落ちる、その探求プロセスそのものがあなたの生きがいになります🔍`
  },
  { // 5. 赤い蛇
    kwSet: ["情熱", "本能", "スキンシップ", "真実"],
    tag: "情熱の直感型",
    desc: "嘘のないストレートな愛情表現や、本能的に「この人だ！」と感じる引力を大切にするタイプです🔥",
    personality: "好き嫌いがはっきりしており、一度好きになると情熱的にのめり込む一途さがあります。",
    emotionTrend: "裏表のない素直な人や、言葉よりも行動で愛情を示してくれる人に本能的に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹きつけられるのは、彼の持つ生命力や真実の姿が、あなたの「本能」を直撃するからです。${oshiReason} 嘘のない彼の姿を見るたび、あなたの中にある情熱のスイッチが強く押されます🔥`
  },
  { // 6. 白い世界の橋渡し
    kwSet: ["繋ぐ", "おもてなし", "スケール感", "機会"],
    tag: "スケール共有型",
    desc: "自分と異なる世界を持つ人と繋がり、お互いの価値観を広げ合うことに喜びを感じるタイプです🤝",
    personality: "人と人、世界と世界を繋ぐ架け橋のような存在で、公平でフラットな視点を持ちます。",
    emotionTrend: "スケールの大きな活躍をする人や、自分を新しい世界へ連れ出してくれる人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しから目が離せないのは、彼があなたを「新しい世界」へと繋いでくれるからです。${oshiReason} 彼という橋を渡ることで、あなた自身の視野が広がり、日常がよりスケールの大きなものへと変化します🤝`
  },
  { // 7. 青い手
    kwSet: ["癒し", "理解", "献身", "体験"],
    tag: "癒しと献身の型",
    desc: "相手の傷や弱さを理解し、献身的に尽くすことで自分自身も満たされる愛情深いタイプです👐",
    personality: "人の痛みがわかる優しい心の持ち主で、体験を通して物事を深く理解します。",
    emotionTrend: "どこか不器用なところがある人や、「自分が理解してあげなきゃ」と思わせる人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しを深く愛してしまうのは、彼の存在があなたにとって究極の「癒し」だからです。${oshiReason} 彼の痛みも喜びもすべて理解し、受け入れたいと願うその献身的な思いは、あなたの心の豊かさの証です👐`
  },
  { // 8. 黄色い星
    kwSet: ["美しさ", "調和", "プロ意識", "完璧"],
    tag: "美とプロフェッショナル型",
    desc: "外見の美しさだけでなく、生き様やプロ意識の高さに深い感銘と尊敬を抱くタイプです✨",
    personality: "妥協を許さないプロ意識と、美しいものを見極める高い審美眼を持っています。",
    emotionTrend: "一流のパフォーマンスを見せる人や、独自の美学を貫くブレない姿に強く惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹かれるのは、彼の妥協のない「プロ意識」や生き様の「美しさ」に深く共鳴するからです。${oshiReason} 彼の完璧を求める姿は、あなた自身が人生をより美しく調和させていくための最高のエネルギーになります✨`
  },
  { // 9. 赤い月
    kwSet: ["浄化", "新しい流れ", "使命感", "色気"],
    tag: "浄化と使命の型",
    desc: "相手の放つ独特のオーラや色気に惹きつけられ、応援することが自分の使命だと感じるタイプです🌙",
    personality: "時代の新しい流れを敏感にキャッチし、場の空気を浄化するような不思議な魅力があります。",
    emotionTrend: "使命感を持って突き進む人や、どこかミステリアスな色気を持つ人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹きつけられるのは、彼があなたの心に「新しい流れ」を生み出し、感情を「浄化」してくれるからです。${oshiReason} 彼を応援するという強い使命感は、あなたの人生にブレない軸を与えてくれます🌙`
  },
  { // 10. 白い犬
    kwSet: ["家族愛", "忠誠心", "誠実さ", "信頼"],
    tag: "誠実な絆型",
    desc: "一度好きになると家族のように深い愛情を注ぎ、どこまでも誠実に寄り添い続けるタイプです🐶",
    personality: "嘘がつけない誠実な性格で、心を開いた相手には絶対的な忠誠心と深い愛を向けます。",
    emotionTrend: "裏切らない信頼感がある人や、仲間やファンを家族のように大切にする人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しから目が離せないのは、心の底で「絶対的な信頼」と「誠実な絆」を求めているからです。${oshiReason} 彼とファンとの家族のような温かい関係性が、あなたの心に究極の安心感をもたらしてくれます🐶`
  },
  { // 11. 青い猿
    kwSet: ["遊び心", "ひらめき", "天才肌", "楽しさ"],
    tag: "遊び心と天才型",
    desc: "一緒にいてワクワクする楽しさや、想像を超えるサプライズを見せてくれる関係に惹かれるタイプです🎪",
    personality: "困難な状況もゲームのように乗り越える、天才的なひらめきと遊び心を持っています。",
    emotionTrend: "ユーモアのセンスがある人や、枠に囚われない自由でクリエイティブな人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しを深く愛してしまうのは、彼があなたの日常に「遊び心」と「ワクワク感」を提供してくれるからです。${oshiReason} 彼の天才的なひらめきやユーモアは、あなたの人生を彩る最高のエンターテインメントです🎪`
  },
  { // 12. 黄色い人
    kwSet: ["自由意志", "こだわり", "理解", "自立"],
    tag: "自由とリスペクト型",
    desc: "お互いの自立と自由を尊重し合い、人としての生き方やこだわりに深く共鳴するタイプです🕊️",
    personality: "自分の信念とこだわりをしっかりと持ち、束縛を嫌う自由で自立した精神の持ち主です。",
    emotionTrend: "自分の哲学を持っている人や、型にはまらない独自のスタイルを貫く人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹かれるのは、彼の「自由な意志」と「ブレない信念」に深いリスペクトを感じるからです。${oshiReason} 自立した彼を応援することで、あなた自身の生き方へのこだわりもより一層洗練されていきます🕊️`
  },
  { // 13. 赤い空歩く人
    kwSet: ["探求", "成長", "空間", "ボランティア"],
    tag: "探求と成長の型",
    desc: "新しい景色を見せてくれる相手に惹かれ、共に成長のプロセスを歩むことに喜びを感じるタイプです🚀",
    personality: "現状に満足せず常に未知の空間を探求し続ける、向上心と奉仕の精神に溢れる人です。",
    emotionTrend: "常に新しいことに挑戦する姿や、人のために尽くす優しい精神を持つ人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹きつけられるのは、彼が常に新しい「探求」を続け、あなたを未知の景色へと連れて行ってくれるからです。${oshiReason} 彼と共に成長していくそのプロセスこそが、あなたの日常に素晴らしい刺激を与えてくれます🚀`
  },
  { // 14. 白い魔法使い
    kwSet: ["魔法", "魅惑", "罪を許す", "受容"],
    tag: "魅惑と受容の型",
    desc: "相手のすべてを丸ごと受け入れる深い愛を持ち、理屈を超えた魔法のような引力に落ちるタイプです🪄",
    personality: "真面目でベストを尽くす頑張り屋。相手の欠点すらも許し、受け入れる深い器を持ちます。",
    emotionTrend: "理屈抜きで魅惑される存在や、どこか放っておけない隙のある人に深く惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しから目が離せないのは、彼があなたに理屈を超えた「魔法」をかけてしまったからです。${oshiReason} 彼の良い部分も弱い部分もすべてを「受容」したいという思いは、あなたの持つ深い愛の証です🪄`
  },
  { // 15. 青い鷲
    kwSet: ["先見性", "ヴィジョン", "冷静", "心眼"],
    tag: "ヴィジョン共有型",
    desc: "相手の描く未来のヴィジョンに共鳴し、その目標が実現していく軌跡を見守ることに惹かれるタイプです🦅",
    personality: "物事を俯瞰して見る鋭い心眼を持ち、常に少し先の未来を見据えている冷静な戦略家です。",
    emotionTrend: "明確な目標を持っている人や、プロデュース能力に長けた知的な人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しを深く愛してしまうのは、彼が見据える「ヴィジョン」に強く共鳴しているからです。${oshiReason} 彼が目標に向かって高く飛躍する姿を見届けることは、あなたにとって最高の喜びとなります🦅`
  },
  { // 16. 黄色い戦士
    kwSet: ["挑戦", "自己との戦い", "知性", "突破"],
    tag: "挑戦と突破の型",
    desc: "困難から逃げずに立ち向かう姿に胸を打たれ、一緒に戦い応援することで自分も勇気をもらうタイプです⚔️",
    personality: "嘘偽りのない実直な性格で、困難な壁にも知性と大胆さでチャレンジしていく戦士です。",
    emotionTrend: "逆境を乗り越えようとする人や、常に自分自身を更新し続けるストイックな人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹かれるのは、彼が「自己との戦い」に挑み、壁を「突破」していく姿に感動するからです。${oshiReason} 彼の決して諦めない挑戦的な生き様は、あなたの人生にも力強い勇気と知性を与えてくれます⚔️`
  },
  { // 17. 赤い地球
    kwSet: ["シンクロ", "絆", "リズム", "舵取り"],
    tag: "シンクロと絆の型",
    desc: "心と心の繋がりやリズムの一致を大切にし、理屈ではない運命的なシンクロニシティに惹かれるタイプです🌍",
    personality: "人と人を結びつける磁力のような力があり、心の絆とオープンな対話を大切にします。",
    emotionTrend: "言葉にしなくても通じ合う空気感を持つ人や、チームの絆を大切にする人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹きつけられるのは、彼との間に運命的な「シンクロニシティ」と深い「絆」を感じるからです。${oshiReason} 彼と同じリズムで感情が波打ち、共に歩んでいるという感覚が、あなたに無上の安心感を与えます🌍`
  },
  { // 18. 白い鏡
    kwSet: ["秩序", "透明感", "映し出す", "永遠"],
    tag: "透明な秩序型",
    desc: "嘘のない透明な関係性を求め、相手の美しい精神性やブレない秩序に心を洗われるタイプです🪞",
    personality: "約束を守り、礼儀と秩序を重んじる。相手の心の中をありのままに映し出す透明感があります。",
    emotionTrend: "裏表のない誠実な人や、凛とした美しさと透明感を持つ人に深く惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しから目が離せないのは、彼の持つ「透明感」や「ブレない秩序」に心が洗われるからです。${oshiReason} 彼の存在はまるで美しい鏡のようにあなたの感情を映し出し、精神を永遠の高みへと導いてくれます🪞`
  },
  { // 19. 青い嵐
    kwSet: ["変容", "巻き込む", "エネルギー", "理解者"],
    tag: "エネルギー共鳴型",
    desc: "相手の圧倒的な熱量に巻き込まれることに快感を覚え、その変容のプロセスを共に味わいたいタイプです🌪️",
    personality: "周囲を巻き込む強力なエネルギーを持ち、常に変化と成長を求めるパワフルな存在です。",
    emotionTrend: "圧倒的なオーラを持つ人や、自分の熱量を100%理解して受け止めてくれる人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しを深く愛してしまうのは、彼の放つ圧倒的な「エネルギー」に激しく巻き込まれたいと願うからです。${oshiReason} 彼が日々進化し「変容」していく姿を見つめることは、あなたの心に強烈な活力を生み出します🌪️`
  },
  { // 20. 黄色い太陽
    kwSet: ["無条件の愛", "公平", "主人公", "啓発"],
    tag: "太陽の愛型",
    desc: "相手の圧倒的な主人公感や輝きに惹かれ、彼が放つ光を全身で浴びることに至福を感じるタイプです☀️",
    personality: "そこにいるだけで周りを明るく照らす太陽のような存在。公平で無条件の愛を持ちます。",
    emotionTrend: "センターに立つのが似合う華やかな人や、裏表なく誰にでも優しい太陽のような人に惹かれます。",
    whyAttracted: (oshiReason) => `あなたが推しに惹かれるのは、彼が放つ「無条件の愛」と圧倒的な「光」に深く救われているからです。${oshiReason} 彼という太陽の輝きを浴びることで、あなた自身もまた、周りを温かく照らす存在へと啓発されていきます☀️`
  }
];

// 感情＆推し活相性判定アルゴリズム（総合的・情緒的アプローチ）
function getRelationship(userKin, targetKin, mName = "彼", mTrait = "魅力") {
    const userSeal = getSealNumber(userKin);
    const targetSeal = getSealNumber(targetKin);
    const userTone = (userKin % 13) || 13;
    const targetTone = (targetKin % 13) || 13;
    
    let type = "前向きチャージ型";
    let score = 70;
    let desc = `${mName}と一緒にいるだけで不思議と元気が湧いてくる、あなたの前向きエンジンを回してくれる存在！`;
    let oshiReason = `${mName}が「${mTrait}」を発揮して走る姿に『私も頑張ろう』と強く背中を押されるからです。`;
    let emotionTag = "前向きエナジー ⚡";

    const diffSeal = Math.abs(userSeal - targetSeal);
    const diffKin = Math.abs(userKin - targetKin);

    // 1. 神秘キン
    if ((userSeal + targetSeal) === 21 || (userSeal + targetSeal) === 41) {
        type = "「沼りやすさ極大♡魂の引力タイプ」";
        score = 98;
        desc = `${mName}には理屈抜きで無意識に惹かれ続け、一度ハマったら絶対に抜け出せない深い沼のような関係！`;
        oshiReason = `言葉を交わさずとも、${mName}の「${mTrait}」やふとした空気感だけで心が鷲掴みにされ、気付けば彼ばかりを目で追ってしまうからです。`;
        emotionTag = "沼りやすさ MAX 🔮";
    }
    // 2. 類似キン
    else if ((userSeal + targetSeal) === 19 || (userSeal + targetSeal) === 39) {
        type = "「感情共鳴100%🌿以心伝心タイプ」";
        score = 92;
        desc = `価値観や感情のツボが驚くほどシンクロし、まるで${mName}に自分の分身を見ているかのような深い共鳴感。`;
        oshiReason = `${mName}の「${mTrait}」に触れるたび、『そう、それが言いたかった！』と心の底から共感できるからです。`;
        emotionTag = "感情共鳴度 100% 💕";
    }
    // 3. 反対キン
    else if (diffSeal === 10) {
        type = "「刺激と憧れ✨唯一無二の光タイプ」";
        score = 88;
        desc = `あなたにない「${mTrait}」を完璧に持っており、${mName}を見るたびに新しい刺激と新鮮なワクワクをくれる関係！`;
        oshiReason = `自分には絶対に真似できない${mName}の圧倒的な個性や世界観に強いリスペクトと『憧れ』を抱き、常に目が離せないからです。`;
        emotionTag = "ココロ揺さぶる刺激 🌟";
    }
    // 4. 同じ紋章
    else if (userSeal === targetSeal) {
        type = "「絶対的な癒し🐶心のオアシスタイプ」";
        score = 90;
        desc = `${mName}と一緒にいるかのような、言葉の要らない抜群の居心地の良さ。あなたの心を最もクリーンにしてくれる存在。`;
        oshiReason = `${mName}の「${mTrait}」や穏やかな笑顔を見るだけで日常の疲れがスッと消え、深い『安心感』と『癒し』を得られるからです。`;
        emotionTag = "極上の安心感＆癒し 🌿";
    }
    // 5. 同じ音
    else if (userTone === targetTone) {
        type = "「無言の安心感🎶シンクロ波長タイプ」";
        score = 85;
        desc = `人生のバイオリズムや物事のテンポが${mName}とピッタリ一致するため、どんな時でも不快感がゼロの波長。`;
        oshiReason = `${mName}の「${mTrait}」を活かした選択に違和感がなく、いつでも『彼の味方でいたい』と自然に思える心地よい支え合いを感じるからです。`;
        emotionTag = "ブレない安心感 🎶";
    }
    // 6. 補完の音
    else if ((userTone + targetTone) === 14) {
        type = "「お互いを支え合う🤝背中預けタイプ」";
        score = 82;
        desc = `あなたの苦手な部分を${mName}が埋め、彼の繊細な部分をあなたが包み込む、パズルのピースのような関係。`;
        oshiReason = `${mName}の「${mTrait}」を応援することで『自分も誰かを力強く支えられている』という深い自己肯定感と充実感が得られるからです。`;
        emotionTag = "強い支え合い感 🤝";
    }
    // 7. 一般的な関係を感情軸で5分岐
    else {
        const route = diffKin % 5;
        if (route === 0) {
            type = "「前向きチャージ型⚡元気の源タイプ」";
            score = 78;
            desc = `${mName}のハッピーなオーラや楽しそうな仕草が、あなたの心の曇りを吹き飛ばしてくれる関係！`;
            oshiReason = `${mName}が「${mTrait}」で周りを明るくする姿を見るだけで、こちらの心までポジティブなエネルギーで満たされるからです。`;
            emotionTag = "前向きエナジー ⚡";
        } else if (route === 1) {
            type = "「寄り添い共鳴型💕優しさの受け皿タイプ」";
            score = 74;
            desc = `${mName}の持つ温かい思いやりや繊細な優しさが、あなたの心の中の『分かってほしい感情』を優しく包み込んでくれる関係。`;
            oshiReason = `${mName}の「${mTrait}」を見るたびに、胸の奥がじんわりと温かくなる深い共鳴を感じるからです。`;
            emotionTag = "感情の寄り添い 💝";
        } else if (route === 2) {
            type = "「リフレッシュ刺激型🌟新発見の窓タイプ」";
            score = 72;
            desc = `これまでのあなたの好みや価値観の枠を飛び越え、${mName}が新しいワクワクを見せてくれるクリエイティブな相性。`;
            oshiReason = `${mName}の「${mTrait}」から来る意外なギャップを見ることで、あなたの毎日にも新鮮な風が吹き込むからです。`;
            emotionTag = "新鮮なドキドキ 🔮";
        } else if (route === 3) {
            type = "「守ってあげたい型🛡️母性くすぐりタイプ」";
            score = 76;
            desc = `${mName}のひたむきさ、時には見せる儚さや無邪気さが、あなたの『支えてあげたい』という愛を最大限に引き出す相性。`;
            oshiReason = `${mName}が「${mTrait}」を胸に葛藤を乗り越える姿を見るたびに、『ずっと見守り続けたい！』という温かいファン心がうずくからです。`;
            emotionTag = "沼る母性＆応援欲 🛡️";
        } else {
            type = "「背中を押される型🚩心のサポータータイプ」";
            score = 75;
            desc = `${mName}の頼もしさや、芯の通った生き方が、あなたの迷いをスッと消し去ってくれる心強い関係。`;
            oshiReason = `${mName}が「${mTrait}」を持って語る『ブレない覚悟』に救われ、自分の人生の一歩を踏み出す勇気を貰えるからです。`;
            emotionTag = "頼もしい支え感 🚩";
        }
    }

    return { type, score, desc, oshiReason, emotionTag };
}

// ファンダムごとのテーマ・絵文字設定
const groupThemes = {
    "BTS": { emoji: "💜", vibe: "言葉を超えた感情の引力", term: "推し活" },
    "Aぇ! group": { emoji: "🔥", vibe: "笑いとカッコよさのギャップ、そして熱い魂の共鳴", term: "応援" },
    "default": { emoji: "💖", vibe: "特別な繋がりと引力", term: "推し活" }
};

// BTSメンバーの生年月日データ（日本のマヤ暦占星術に準拠したKIN番号）
let oshiData = {
    // BTS
    "RM": { name: "RM", group: "BTS", kin: 37, trait: "探求心と知性で全体を導く", isCustom: false },
    "Jin": { name: "Jin", group: "BTS", kin: 170, trait: "周囲を和ませるユーモア", isCustom: false },
    "Suga": { name: "Suga", group: "BTS", kin: 5, trait: "情熱を秘めたストイックさ", isCustom: false },
    "J-Hope": { name: "J-Hope", group: "BTS", kin: 91, trait: "皆を明るく照らす希望", isCustom: false },
    "Jimin": { name: "Jimin", group: "BTS", kin: 173, trait: "繊細な気配りと圧倒的表現力", isCustom: false },
    "V": { name: "V", group: "BTS", kin: 251, trait: "独自の感性で人を惹きつける", isCustom: false },
    "Jungkook": { name: "Jungkook", group: "BTS", kin: 81, trait: "無限の可能性を持つ黄金マンネ", isCustom: false },
    // Aぇ! group
    "Seiya": { name: "末澤誠也", group: "Aぇ! group", kin: 18, trait: "誠実さと独自の美学で魅了する", isCustom: false },
    "Yoshinori": { name: "正門良規", group: "Aぇ! group", kin: 64, trait: "深く探求し気づきを与える", isCustom: false },
    "Ken": { name: "小島健", group: "Aぇ! group", kin: 223, trait: "独特の夢と世界観で惹きつける", isCustom: false },
    "Masaya": { name: "佐野晶哉", group: "Aぇ! group", kin: 174, trait: "純粋な魅力で周囲を魅了する", isCustom: false }
};

// LocalStorageからカスタム推しをロード
function loadCustomOshis() {
    try {
        const saved = localStorage.getItem('customOshis');
        if (saved) {
            let parsed = JSON.parse(saved);
            // ローカルストレージ内の重複（佐野晶哉など）をクリーンアップ
            for (let key in parsed) {
                if (parsed[key].name === "佐野晶哉" || parsed[key].name === "Masaya") {
                    delete parsed[key];
                }
            }
            localStorage.setItem('customOshis', JSON.stringify(parsed));
            Object.assign(oshiData, parsed);
        }
    } catch (e) { console.error('Failed to load custom Oshis:', e); }
}
loadCustomOshis();

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const planSelect = document.getElementById('plan-type');
    const oshiSelect = document.getElementById('target-oshi');
    const userNameInput = document.getElementById('user-name');

    // 生年月日プルダウンの動的生成
    const birthYear = document.getElementById('user-birth-year');
    const birthMonth = document.getElementById('user-birth-month');
    const birthDay = document.getElementById('user-birth-day');

    if (birthYear && birthMonth && birthDay) {
        // 年: 1950から現在年
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= 1950; y--) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = `${y}年`;
            if (y === 1990) opt.selected = true; // デフォルト 1990年
            birthYear.appendChild(opt);
        }
        // 月: 1〜12
        for (let m = 1; m <= 12; m++) {
            const opt = document.createElement('option');
            const mVal = String(m).padStart(2, '0');
            opt.value = mVal;
            opt.textContent = `${m}月`;
            if (m === 1) opt.selected = true; // デフォルト 1月
            birthMonth.appendChild(opt);
        }
        // 日: 1〜31
        for (let d = 1; d <= 31; d++) {
            const opt = document.createElement('option');
            const dVal = String(d).padStart(2, '0');
            opt.value = dVal;
            opt.textContent = `${d}日`;
            if (d === 1) opt.selected = true; // デフォルト 1日
            birthDay.appendChild(opt);
        }

        // イベントリスナーの追加
        birthYear.addEventListener('change', generateCard);
        birthMonth.addEventListener('change', generateCard);
        birthDay.addEventListener('change', generateCard);
    }
    
    // カスタム推し用の生年月日プルダウン生成
    const newOshiYear = document.getElementById('new-oshi-birth-year');
    const newOshiMonth = document.getElementById('new-oshi-birth-month');
    const newOshiDay = document.getElementById('new-oshi-birth-day');
    
    if (newOshiYear && newOshiMonth && newOshiDay) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= 1950; y--) {
            const opt = document.createElement('option');
            opt.value = y; opt.textContent = `${y}年`;
            if (y === 1995) opt.selected = true;
            newOshiYear.appendChild(opt);
        }
        for (let m = 1; m <= 12; m++) {
            const opt = document.createElement('option');
            opt.value = String(m).padStart(2, '0'); opt.textContent = `${m}月`;
            if (m === 1) opt.selected = true;
            newOshiMonth.appendChild(opt);
        }
        for (let d = 1; d <= 31; d++) {
            const opt = document.createElement('option');
            opt.value = String(d).padStart(2, '0'); opt.textContent = `${d}日`;
            if (d === 1) opt.selected = true;
            newOshiDay.appendChild(opt);
        }
    }
    
    // 推し一覧をプルダウンに反映（グループごとに自動統合）
    function updateOshiDropdown() {
        const select = document.getElementById('target-oshi');
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="" disabled selected>選択してください</option>';
        
        const groups = {};
        for (const key in oshiData) {
            const g = oshiData[key].group || "カスタム推し";
            if (!groups[g]) groups[g] = [];
            groups[g].push({ key: key, name: oshiData[key].name });
        }
        
        for (const g in groups) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = g;
            groups[g].forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.key;
                opt.textContent = m.name;
                optgroup.appendChild(opt);
            });
            select.appendChild(optgroup);
        }
        
        if (currentValue && oshiData[currentValue]) {
            select.value = currentValue;
        } else if (oshiData["Jungkook"]) {
            select.value = "Jungkook";
        }
    }
    updateOshiDropdown();

    // 推し追加パネルのトグル
    const toggleAddOshiBtn = document.getElementById('toggle-add-oshi-btn');
    const addOshiPanel = document.getElementById('add-oshi-panel');
    if (toggleAddOshiBtn && addOshiPanel) {
        toggleAddOshiBtn.addEventListener('click', () => {
            const isHidden = addOshiPanel.style.display === 'none';
            addOshiPanel.style.display = isHidden ? 'block' : 'none';
            toggleAddOshiBtn.textContent = isHidden ? 'ー 閉じる' : '＋ 新しい推しを登録';
        });
    }

    // 新規推しの保存処理
    const saveNewOshiBtn = document.getElementById('save-new-oshi-btn');
    if (saveNewOshiBtn) {
        saveNewOshiBtn.addEventListener('click', async () => {
            const name = document.getElementById('new-oshi-name').value.trim();
            const group = document.getElementById('new-oshi-group').value.trim();
            const year = parseInt(document.getElementById('new-oshi-birth-year').value);
            const month = parseInt(document.getElementById('new-oshi-birth-month').value);
            const day = parseInt(document.getElementById('new-oshi-birth-day').value);
            const imageInput = document.getElementById('new-oshi-image');

            if (!name) {
                alert("推しの名前を入力してください！");
                return;
            }

            const kin = calculateKin(year, month, day);
            const sealNum = getSealNumber(kin);
            const sealName = getSealName(sealNum);
            
            // 汎用的なtrait（特徴）を紋章から自動生成（簡易版）
            const sealData = MAYA_SEAL_DATA[sealNum - 1];
            const trait = sealData ? `${sealData.kwSet[0]}と${sealData.kwSet[1]}の魅力` : "未知の魅力を持つ人";

            let imageData = null;
            if (imageInput.files && imageInput.files[0]) {
                try {
                    imageData = await resizeImage(imageInput.files[0], 200); // 200pxにリサイズ
                } catch (e) {
                    console.error("画像圧縮エラー", e);
                    alert("画像の処理に失敗しました。");
                }
            }

            const key = `custom_${Date.now()}`;
            oshiData[key] = {
                name: name,
                group: group,
                kin: kin,
                trait: trait,
                isCustom: true,
                image: imageData
            };

            // LocalStorageにカスタム推しだけを保存
            const customOshisToSave = {};
            for (const k in oshiData) {
                if (oshiData[k].isCustom) {
                    customOshisToSave[k] = oshiData[k];
                }
            }
            try {
                localStorage.setItem('customOshis', JSON.stringify(customOshisToSave));
                alert(`「${name}」をリストに登録しました！`);
                
                // UIリセット
                document.getElementById('new-oshi-name').value = "";
                document.getElementById('new-oshi-group').value = "";
                imageInput.value = "";
                addOshiPanel.style.display = 'none';
                toggleAddOshiBtn.textContent = '＋ 新しい推しを登録';
                
                // プルダウン更新して選択
                updateOshiDropdown();
                oshiSelect.value = key;
                generateCard(); // すぐに診断表示
            } catch (e) {
                console.error("保存エラー", e);
                alert("保存に失敗しました。画像のサイズが大きい可能性があります。");
            }
        });
    }

    // 画像リサイズ用関数 (File -> Base64)
    function resizeImage(file, maxSize) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height && width > maxSize) {
                        height = Math.round((height *= maxSize / width));
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = Math.round((width *= maxSize / height));
                        height = maxSize;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8)); // 0.8 quality
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    planSelect.addEventListener('change', (e) => {
        oshiSelect.disabled = (e.target.value !== 'high');
        if (e.target.value !== 'high') oshiSelect.value = "";
        generateCard(); // プランが変更されたら自動生成
    });

    // 入力項目が変更されたら自動生成 (自動submit)
    if (userNameInput) userNameInput.addEventListener('input', generateCard);
    if (oshiSelect) oshiSelect.addEventListener('change', generateCard);

    generateBtn.addEventListener('click', generateCard);

    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            alert("【PDF保存のコツ】\n送信先を「PDFに保存」にしてください。\n「背景のグラフィック」にチェックを入れると綺麗に色が出ます！");
            window.print();
        });
    }

    setTimeout(generateCard, 100);
});

// ページ表示切り替え
function showPages(ids) {
    ['page-starter','page-feeling-1','page-feeling-2','page-soul-1','page-soul-2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (ids.includes(id)) {
                el.style.display = 'block';
                el.classList.add('print-active');
            } else {
                el.style.display = 'none';
                el.classList.remove('print-active');
            }
        }
    });
}

// セット値ヘルパー（存在チェック付き）
function setEl(id, val, isHTML = false) {
    const el = document.getElementById(id);
    if (!el) return;
    isHTML ? el.innerHTML = val : el.textContent = val;
}
function setImg(id, src, fallback = 'images/User/user.png') {
    const el = document.getElementById(id);
    if (!el) return;
    el.src = src;
    el.onerror = function() {
        this.onerror = null; // 無限ループ防止
        this.src = fallback;
    };
}

// カスタム推しの画像判定ロジック
function getOshiImgSrc(m) {
    if (m.isCustom) {
        if (m.image) return m.image;
        // 汎用画像を計算
        let oColor = 'white';
        const colorRem = m.kin % 4;
        if (colorRem === 1) oColor = 'red';
        else if (colorRem === 2) oColor = 'white';
        else if (colorRem === 3) oColor = 'blue';
        else if (colorRem === 0) oColor = 'yellow';

        const oTone = (m.kin % 13) || 13;
        let oGroup = 'soft';
        if ([1, 5, 9, 13].includes(oTone)) oGroup = 'active';
        else if ([4, 8, 12].includes(oTone)) oGroup = 'smart';
        
        return `images/User/user_${oColor}_${oGroup}.png`;
    }
    const groupFolder = m.group || 'Others';
    return `images/${groupFolder}/${m.name}.png`;
}

function generateCard() {
    const userName = document.getElementById('user-name').value || "あなた";
    const planType = document.getElementById('plan-type').value;
    const oshiKey = document.getElementById('target-oshi').value;

    const birthYear = document.getElementById('user-birth-year');
    const birthMonth = document.getElementById('user-birth-month');
    const birthDay = document.getElementById('user-birth-day');
    
    let userBirthdate = "";
    if (birthYear && birthMonth && birthDay) {
        userBirthdate = `${birthYear.value}-${birthMonth.value}-${birthDay.value}`;
    } else {
        const legacyBirthdate = document.getElementById('user-birthdate');
        userBirthdate = legacyBirthdate ? legacyBirthdate.value : "";
    }

    if (!userBirthdate) { alert("生年月日を選択してください！"); return; }

    const [uYear, uMonth, uDay] = userBirthdate.split('-').map(Number);
    const userKin = calculateKin(uYear, uMonth, uDay);
    const userSealNum = getSealNumber(userKin);
    const userSeal = getSealName(userSealNum);
    const userTone = (userKin % 13) || 13;

    // ユーザーの紋章色に応じた画像決定 (1:赤, 2:白, 3:青, 0:黄)
    let userColor = 'white';
    const colorRem = userKin % 4;
    if (colorRem === 1) userColor = 'red';
    else if (colorRem === 2) userColor = 'white';
    else if (colorRem === 3) userColor = 'blue';
    else if (colorRem === 0) userColor = 'yellow';

    // 音(13個)のグループ分け (active:1,5,9,13 / soft:2,3,6,7,10,11 / smart:4,8,12)
    let soundGroup = 'soft';
    if ([1, 5, 9, 13].includes(userTone)) soundGroup = 'active';
    else if ([4, 8, 12].includes(userTone)) soundGroup = 'smart';

    const userImgPath = `images/User/user_${userColor}_${soundGroup}.png`;
    setImg('st-user-img', userImgPath, 'images/User/user.png');
    setImg('f1-user-img', userImgPath, 'images/User/user.png');
    setImg('s1-you-img', userImgPath, 'images/User/user.png');

    const oshi = oshiData[oshiKey] || oshiData["Jungkook"];
    
    // 選ばれた推しと同じグループのメンバーだけをランキング対象にする
    const targetGroup = oshi.group || "BTS";
    const groupKeys = Object.keys(oshiData).filter(key => {
        return (oshiData[key].group || "BTS") === targetGroup;
    });

    let rankings = groupKeys.map(key => {
        const k = oshiData[key].kin;
        const rel = getRelationship(userKin, k);
        return { key, name: oshiData[key].name, kin: k, trait: oshiData[key].trait,
                 score: rel.score, type: rel.type, desc: rel.desc,
                 oshiReason: rel.oshiReason, emotionTag: rel.emotionTag,
                 isCustom: oshiData[key].isCustom, image: oshiData[key].image, group: oshiData[key].group };
    });
    rankings.sort((a, b) => b.score - a.score);

    const targetMember = rankings.find(m => m.key === (oshiKey || "Jungkook")) || rankings[0];
    
    // タイトルの「BTS」部分を動的に変更
    const displayGroupName = oshi.group || (oshi.isCustom ? oshi.name : "BTS");
    document.querySelectorAll('.dynamic-group-name').forEach(el => {
        el.textContent = displayGroupName;
    });

    // 20紋章専用データから取得
    const sealData = MAYA_SEAL_DATA[userSealNum - 1];
    const kwSet = sealData.kwSet;

    // oshiEpisodesデータ
    const oshiEpisodes = {
        "RM": { ep1: "インタビューで語った哲学的な言葉", ep2: "展覧会で見せた芸術への深い愛情", ep3: "メンバーへの静かな気遣い" },
        "Jin": { ep1: "満員のスタジアムで放った最高の笑顔", ep2: "ファンへの心温まる手紙", ep3: "自然体の笑いでその場を包んだ瞬間" },
        "Suga": { ep1: "深夜のスタジオで曲を作り続ける姿", ep2: "ファンの涙を歌で救ったステージ", ep3: "ふとした場面で見せた優しい素顔" },
        "J-Hope": { ep1: "圧倒的なステージパフォーマンス", ep2: "メンバーの落ち込みを笑顔で救う場面", ep3: "カメラの外での素直な感謝の言葉" },
        "Jimin": { ep1: "ステージ上の儚くも美しい表現", ep2: "ファンへ向けた心からのメッセージ", ep3: "仲間を大切にするさりげない優しさ" },
        "V": { ep1: "音楽で描いた唯一無二の世界観", ep2: "ありのままの感性で語った言葉", ep3: "仲間と過ごす純粋な笑顔の瞬間" },
        "Jungkook": { ep1: "全身全霊でステージに立つまっすぐな姿", ep2: "ファンへの誠実な言葉と感謝", ep3: "努力を惜しまないオフシーンの真剣さ" }
    };
    const ep = oshiEpisodes[oshi.name] || { ep1: "心惹かれたあの瞬間", ep2: "ふと見せた素顔や言葉", ep3: "あなただけが知る特別な魅力" };

    // ランクメンバーの表示用データ取得
    function mKin(m) {
        const sn = getSealNumber(m.kin);
        return `KIN ${m.kin} (${getSealName(sn)} × 音${(m.kin%13)||13})`;
    }

    // ========== プランごとのページ表示 ==========
    if (planType === 'low') {
        showPages(['page-starter']);
        populateStarter(userName, userKin, userSeal, userTone, rankings, sealData);

    } else if (planType === 'mid') {
        showPages(['page-feeling-1', 'page-feeling-2']);
        populateFeeling(userName, userKin, userSeal, userTone, rankings, sealData, mKin);
        const soulBanner = document.getElementById('upsell-banner-soul');
        if (soulBanner) soulBanner.style.display = 'flex';

    } else if (planType === 'high') {
        showPages(['page-soul-1', 'page-soul-2']);
        populateSoul(userName, userKin, userSeal, userTone, rankings, targetMember, oshi, ep, mKin, sealData);
    }

    // 納品テキスト
    generateDeliveryText(planType, userName, userKin, userSeal, userTone, rankings, targetMember, oshi, ep, sealData);
}

// ========== Starter 反映 ==========
function populateStarter(userName, userKin, userSeal, userTone, rankings, sealData) {
    setEl('display-user-name', userName);
    setEl('user-kin', userKin);
    setEl('user-seal-tone', `${userSeal} × 音${userTone}`);
    setEl('user-type-tag', sealData.tag);
    
    setEl('user-desc-text', sealData.desc);

    for (let i = 0; i < 3; i++) {
        const r = i + 1, m = rankings[i];
        const sn = getSealNumber(m.kin);
        setImg(`img-rank${r}`, getOshiImgSrc(m));
        setEl(`name-rank${r}`, m.name);
        setEl(`kin-rank${r}`, `KIN ${m.kin} (${getSealName(sn)} × 音${(m.kin%13)||13})`);
        setEl(`relation-tag-rank${r}`, m.emotionTag);
        setEl(`score-rank${r}`, `${m.score}%`);
        setEl(`desc-rank${r}`, m.desc);
        setEl(`detail-name${r}`, m.name);
        setEl(`detail-bubble${r}`, `${m.type}（${m.emotionTag}）`);
        const li = document.querySelectorAll(`#point-list${r} li`);
        if (li[0]) li[0].textContent = m.desc;
        if (li[1]) li[1].textContent = m.oshiReason;
        if (li[2]) li[2].style.display = 'none'; // 情報量を抑えてスッキリさせる
    }
    const feelingBanner = document.getElementById('upsell-banner-feeling');
    if (feelingBanner) feelingBanner.style.display = 'flex';
    const detail = document.getElementById('detail-section');
    if (detail) detail.style.display = 'block';
    setEl('maya-message', `あなたは「${sealData.kwSet[0]}」な人に惹かれやすいタイプ✨推しが持つ魅力の奥深さに気づける、素晴らしい感性の持ち主です！あなたの推しへの感情の正体や、推し活がもたらすポジティブな影響について、もっと深く知ってみませんか？\n『Feeling Plan』では4位以降のメンバーとの詳細な相性を大公開！さらに『Soul Plan』では、あなたと本命推しの前世からの深い繋がりや、なぜそこまで沼ってしまうのか…その理由を丸裸にします♡\n次のプランで、あなたの推し活をさらに特別なものにしましょう！`);
}

// ========== Feeling 反映 ==========
function populateFeeling(userName, userKin, userSeal, userTone, rankings, sealData, mKin) {
    // Page 1
    setEl('f1-user-name', userName || "あなた");
    setEl('f1-user-kin', userKin);
    setEl('f1-user-seal-tone', `${userSeal} × 音${userTone}`);
    setEl('f1-user-type-tag', sealData.tag);
    setEl('f1-personality', sealData.personality);
    setEl('f1-emotion-trend', sealData.emotionTrend);
    for (let i = 0; i < 4; i++) { setEl(`f1-kw${i+1}`, sealData.kwSet[i]); }

    for (let i = 0; i < 3; i++) {
        const r = i + 1, m = rankings[i];
        setImg(`f1-img-rank${r}`, getOshiImgSrc(m));
        setEl(`f1-name-rank${r}`, m.name);
        setEl(`f1-relation-tag-rank${r}`, m.emotionTag);
        setEl(`f1-score-rank${r}`, `${m.score}%`);
    }

    // 4〜7位 サブランキング
    const subList = document.getElementById('f1-sub-ranking');
    if (subList) {
        subList.innerHTML = '';
        for (let i = 3; i < rankings.length; i++) {
            const m = rankings[i];
            const pill = document.createElement('div');
            pill.className = 'fl-sub-rank-item';
            pill.innerHTML = `<span class="fl-sub-rank-num">${i+1}</span><div class="fl-sub-img-wrap"><img src="${getOshiImgSrc(m)}" onerror="this.src='images/User/user.png'"></div><span class="fl-sub-rank-name">${m.name}</span><span class="fl-sub-rank-score">${m.score}%</span>`;
            subList.appendChild(pill);
        }
    }

    setEl('f1-numa-type', `"${rankings[0].type.replace(/「|」/g, '')}"`);
    setEl('f1-numa-desc', `${rankings[0].desc} あなたの感情が最も共鳴する相手は${rankings[0].name}です。`);

    // Page 2
    for (let i = 0; i < 3; i++) {
        const r = i + 1, m = rankings[i];
        setImg(`f2-img-rank${r}`, getOshiImgSrc(m));
        setEl(`f2-name-rank${r}`, m.name);
        setEl(`f2-tag-rank${r}`, m.emotionTag);
        setEl(`f2-analysis-rank${r}`, `${m.type}の相性。${m.oshiReason}`);
    }

    // 4〜6位 簡易相性コメント
    for (let i = 3; i <= 5; i++) {
        const pos = i + 1; // 4, 5, 6
        const m = rankings[i];
        if (!m) continue;
        setEl(`f2-sub-num${pos}`, `${pos}位`);
        setImg(`f2-sub-img${pos}`, getOshiImgSrc(m));
        setEl(`f2-sub-name${pos}`, m.name);
        setEl(`f2-sub-score${pos}`, `${m.score}%`);
        // emotionTagと短いdescから1〜2文の簡易コメントを生成
        const shortComment = getShortComment(m, pos);
        setEl(`f2-sub-comment${pos}`, shortComment);
    }

    setEl('f2-why-attracted', sealData.whyAttracted(rankings[0].oshiReason));

    const kwEl = document.getElementById('f2-emotion-keywords');
    if (kwEl) {
        kwEl.innerHTML = sealData.kwSet.map(k => `<span class="fl2-kw-tag">${k}</span>`).join('') +
            ['感情共鳴','深いつながり','波長'].map(k => `<span class="fl2-kw-tag">${k}</span>`).join('');
    }
}

// ========== Soul 反映 ==========
function populateSoul(userName, userKin, userSeal, userTone, rankings, targetMember, oshi, ep, mKin, sealData) {
    const kwSet = sealData.kwSet;
    const theme = groupThemes[oshi.group] || groupThemes["default"];

    // Page 1
    setEl('s1-user-name', userName);
    setEl('s1-user-kin', `${userKin} (${userSeal} × 音${userTone})`);
    setEl('s1-oshi-name', oshi.name);
    setImg('s1-oshi-img', getOshiImgSrc(oshi));
    setEl('s1-oshi-kin', mKin(targetMember));
    setEl('s1-relation-type', targetMember.emotionTag);
    setEl('s1-relation-badge', targetMember.type);
    setEl('s1-why-attracted', targetMember.oshiReason);
    setEl('s1-user-emotion-type', `あなたは${sealData.tag}。${sealData.desc}`);
    setEl('s1-from-oshi', `${oshi.name}の持つ「${oshi.trait}」という資質が、あなたの中の${kwSet[0]}への渇望に深く応えています。彼の存在はあなたの感情の"受け皿"として機能しています。`);
    setEl('s1-relation-desc', `${targetMember.type}の2人。${targetMember.desc}`);
    setEl('s1-bond-type', `"${kwSet[0]}と${kwSet[2]}でつながる型"`);
    setEl('s1-bond-desc', `あなたと${oshi.name}の間には、${theme.vibe}があります。${targetMember.oshiReason} この絆は、${theme.term}を通してあなたの人生をより豊かに彩ります${theme.emoji}`);

    // Page 2
    setImg('s2-img-advice', getOshiImgSrc(oshi));

    setEl('s2-ep1-label', ep.ep1);
    setEl('s2-ep1-text', `あなたが${oshi.name}の「${ep.ep1}」に心を動かされるのは、あなた自身の${kwSet[0]}への感性がそこに強く共鳴するからです。`);
    setEl('s2-ep2-label', ep.ep2);
    setEl('s2-ep2-text', `「${ep.ep2}」の場面は、あなたの${kwSet[2]}への渇望に深く刺さります。彼の姿に自分の感情が映し出されています。`);
    setEl('s2-ep3-label', ep.ep3);
    setEl('s2-ep3-text', `「${ep.ep3}」──この瞬間にあなたが感じる愛おしさこそ、あなたと彼の感情の波長が合っている証拠です。`);

    setEl('s2-emotion-analysis', `あなたが${oshi.name}に沼る理由は「${targetMember.emotionTag}」にあります。${targetMember.desc} 彼への感情は、あなたの心の中の${kwSet[0]}・${kwSet[2]}という核心的な欲求と完全に共鳴しています。この感情は弱さではなく、あなたの豊かな感性の証です♡`);
    setEl('s2-advice', `彼の「${oshi.trait}」という光を、あなたの人生の道標として活かしてみましょう。彼が輝くステージを全身で受け取り、その感動をあなた自身の創造性やエネルギーに変換することで、${theme.term}はあなたの人生をより豊かで意味深いものにしてくれます✨ ${kwSet[0]}を大切に、毎日を前向きに歩んでください${theme.emoji}`);
    setEl('s2-closing', `最後に… ${oshi.name}との出会いは偶然ではなく、必然かもしれません。あなたの心が求める${kwSet[0]}・${kwSet[2]}・${kwSet[1]}、その全てが彼の存在の中にあります。今日もあなたの${theme.term}が、かけがえのない輝きをもたらしてくれますように${theme.emoji}`);
}

function getShortComment(m, pos = 0) {
    const v = pos % 3;
    if (m.type.includes("引力")) {
        if (v === 0) return `言葉では説明できない磁力のような引力がある相性♡ 一度気になると抜け出せないかも。`;
        if (v === 1) return `無意識に目で追ってしまうような強い結びつき。深い沼にハマりやすい関係です！`;
        return `理屈抜きに惹かれ続ける不思議な関係性。心の奥底で強く共鳴し合っています🔮`;
    }
    if (m.type.includes("共鳴")) {
        if (v === 0) return `価値観や感情のツボがよく合う相性。自分の分身を見るような不思議な共鳴を感じやすい。`;
        if (v === 1) return `言葉にしなくても分かり合えるような以心伝心の相性♡ 一緒にいて心地良い波長です。`;
        return `喜怒哀楽のポイントが似ているシンクロタイプ。深く共感し合える心強い味方です🌿`;
    }
    if (m.type.includes("光") || m.type.includes("刺激")) {
        if (v === 0) return `あなたにない個性と魅力で新鮮な刺激をくれる相性。見るたびにワクワクが止まらない！`;
        if (v === 1) return `圧倒的な世界観に強い憧れを抱きやすい相性。新しい扉を開いてくれる存在です✨`;
        return `自分とは違う才能にリスペクトが止まらない関係。日常に最高のスパイスをくれます♡`;
    }
    if (m.type.includes("オアシス") || m.type.includes("癒し")) {
        if (v === 0) return `一緒にいるだけで心がほぐれる安心感のある相性。疲れた時に見たくなるタイプ。`;
        if (v === 1) return `飾らない姿を見るだけでホッとできる存在。究極の癒しを与えてくれる関係です🌿`;
        return `言葉がいらないほどの圧倒的な居心地の良さ。あなたの心を一番穏やかにしてくれます。`;
    }
    if (m.type.includes("波長") || m.type.includes("シンクロ")) {
        if (v === 0) return `テンポや空気感がピッタリ合う相性。長く見ていても疲れない心地よさがある。`;
        if (v === 1) return `人生のバイオリズムが似ている不思議な相性。どんな時でも味方でいたくなる存在♡`;
        return `行動や選択に違和感がない、ストレスフリーな関係。自然体で応援し続けられます🎶`;
    }
    if (m.type.includes("背中") || m.type.includes("支え")) {
        if (v === 0) return `お互いを補い合えるパズルのような相性。応援することで自分も元気になれる！`;
        if (v === 1) return `強さと弱さを補完し合える素晴らしいバランスの相性。支え合うことで充実感を得られます🤝`;
        return `あなたが苦手な部分をそっとカバーしてくれるような存在。確かな自己肯定感をくれます♡`;
    }
    if (m.type.includes("チャージ") || m.type.includes("前向き")) {
        if (v === 0) return `見るだけで気分が上がるポジティブな相性。彼の笑顔がエネルギーチャージになる♡`;
        if (v === 1) return `明るいオーラで心の曇りを吹き飛ばしてくれる相性。一緒にいると不思議と元気が湧いてきます！`;
        return `前向きなエネルギーが波及してくるような関係。あなたの心のエンジンを回してくれます⚡`;
    }
    if (m.type.includes("寄り添い")) {
        if (v === 0) return `相手の優しさが心に染みる相性。じんわりと温かい感情が積み重なっていくタイプ。`;
        if (v === 1) return `繊細な思いやりに深く共感できる相性。見ているだけで心がぽかぽかと温かくなります💝`;
        return `あなたの「分かってほしい感情」に寄り添ってくれるような、優しく包容力のある関係です。`;
    }
    if (m.type.includes("母性")) {
        if (v === 0) return `守ってあげたい気持ちがくすぐられる相性。応援欲がムクムクと湧いてくる！`;
        if (v === 1) return `ふと見せる儚さやひたむきさに胸を打たれる相性。ずっと支え続けたいと思える存在です🛡️`;
        return `彼が葛藤を乗り越える姿に強い愛おしさを感じる関係。母性本能を最大限に引き出されます♡`;
    }
    if (v === 0) return `独自の魅力で心にそっと寄り添ってくれる相性。気づいたら目で追っているかも♡`;
    if (v === 1) return `芯の通った生き方に背中を押される心強い相性。あなたに一歩踏み出す勇気をくれます！`;
    return `これまでの好みを飛び越え、新しいワクワクを見せてくれる関係。新鮮な風を吹き込んでくれます🚩`;
}

function getAdvice(type) {
    if (type.includes("引力")) return "彼のミステリアスな表現に心を委ね、熱狂的に溺れる時間を大切に🔮";
    if (type.includes("共鳴")) return "彼が紡ぐ言葉に寄り添い、シンクロする瞬間を深く味わいましょう💕";
    if (type.includes("光")) return "彼の個性をリスペクトし、あなた自身の魅力を高めるガソリンに✨";
    if (type.includes("オアシス")) return "彼の穏やかな笑顔を眺める、極上のリラックスタイムを🌿";
    if (type.includes("波長")) return "心地よい共振を感じながら、長く優しく見守り続けて🎶";
    if (type.includes("背中")) return "彼への応援がつもりつもって、あなたの自己肯定感を育てます🤝";
    return "彼のブレない信念から背中を押され、あなた自身の一歩を踏み出して🚩";
}

function generateDeliveryText(planType, userName, userKin, userSeal, userTone, rankings, targetMember, oshi, ep, sealData) {
    const planName = planType === 'low' ? 'Starter Plan' : planType === 'mid' ? 'Feeling Plan' : 'Soul Plan';
    const kwSet = sealData.kwSet;
    const header = `【 💜BTS 推し相性診断（${planName}） 】\n\nご依頼ありがとうございます✨\n${userName}さんとBTSメンバーとの感情相性を、マヤ暦を通して深く読み解いていきます🔮\n\n━━━━━━━━━━━━━━\n\n【 🌿あなたの基本タイプ 】\n\nKIN${userKin}「${userSeal} × 音${userTone}」\n\n━━━━━━━━━━━━━━\n`;
    const rankList = rankings.map((m, i) => {
        const med = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";
        return `${med} ${i+1}位 ${m.name} (${m.score}%) - ${m.type}`;
    }).join("\n");

    let body = '';
    if (planType === 'low') {
        const mayanMessage = `あなたは「${sealData.kwSet[0]}」な人に惹かれやすいタイプ✨推しが持つ魅力の奥深さに気づける、素晴らしい感性の持ち主です！\nあなたの推しへの感情の正体や、推し活がもたらすポジティブな影響について、もっと深く知ってみませんか？\n『Feeling Plan』では4位以降のメンバーとの詳細な相性を大公開！さらに『Soul Plan』では、あなたと本命推しの前世からの深い繋がりや、なぜそこまで沼ってしまうのか…その理由を丸裸にします♡\n次のプランで、あなたの推し活をさらに特別なものにしましょう！`;
        body = `【 🥇🥈🥉 総合相性 TOP3 】\n\n${rankings.slice(0,3).map((m,i)=>`${["🥇","🥈","🥉"][i]} ${m.name} ${m.score}%\n👉 ${m.type}\n${m.desc}`).join("\n\n")}\n\n🔒 4位以降は上位プランで大公開！\n\n━━━━━━━━━━━━━━\n\n【 🔮 マヤ暦からのメッセージ 】\n\n${mayanMessage}`;
    } else if (planType === 'mid') {
        const top3 = rankings.slice(0,3).map((m,i)=>`【 👑 ${i+1}位：${m.name} 】\n[${m.emotionTag}]\n${m.type}\n\n${m.desc}\n\n${m.oshiReason}`).join("\n\n");
        const top4to7 = rankings.slice(3,7).map((m,i)=>`【 🔹 ${i+4}位：${m.name} (${m.score}%) 】\n${getShortComment(m, i+3)}`).join("\n\n");
        const whyAttracted = sealData.whyAttracted(rankings[0].oshiReason);

        const feelingUpsell = `【 🔮 マヤ暦からのさらなるメッセージ 】\n${rankings[0].name}さんとの相性、とても素敵ですね✨\n「でも、なぜ私はここまで彼に惹かれるの…？」\nその理由は、ただの相性だけではなく、2人の魂の深い結びつきに隠されているかもしれません。\n最上位の『Soul Plan』では、あなたと本命推しの前世からのつながりや、心を揺さぶられるエピソードの真の意味、そして沼る理由の完全な答えを読み解きます♡\nあなたの推し活をさらに深く、特別なものにするSoul Planもぜひチェックしてみてください！`;

        body = `【 📝 全員ランキング 】\n\n${rankList}\n\n━━━━━━━━━━━━━━\n\n【 🌟 TOP3 感情分析 】\n\n${top3}\n\n━━━━━━━━━━━━━━\n\n【 💫 4〜7位 相性チェック 】\n\n${top4to7}\n\n━━━━━━━━━━━━━━\n\n【 💕 "なぜ惹かれるのか？" 分析 】\n\n${whyAttracted}\n\n━━━━━━━━━━━━━━\n\n【 💎 あなたの感情キーワード 】\n\n${kwSet.join(" / ")} / 感情共鳴 / 深いつながり / 波長\n\n━━━━━━━━━━━━━━\n\n${feelingUpsell}`;
    } else {
        const whyAttracted = sealData.whyAttracted(targetMember.oshiReason);

        body = `【 📝 全員ランキング 】\n\n${rankList}\n\n━━━━━━━━━━━━━━\n\n【 💜 本命推し深掘り：${oshi.name} 】\n\n【 🔮 関係性タイプ 】\n[${targetMember.emotionTag}]\n${targetMember.type}\n\n${targetMember.desc}\n\n【 💗 なぜ惹かれる？（感情深掘り） 】\n${whyAttracted}\n\n【 📖 実際のエピソード考察 】\n\n【 ${ep.ep1} 】\nあなたが${oshi.name}の「${ep.ep1}」に心を動かされるのは、あなた自身の${kwSet[0]}への感性がそこに強く共鳴するからです。\n\n【 ${ep.ep2} 】\n「${ep.ep2}」の場面は、あなたの${kwSet[2]}への渇望に深く刺さります。彼の姿に自分の感情が映し出されています。\n\n【 ${ep.ep3} 】\n「${ep.ep3}」──この瞬間にあなたが感じる愛おしさこそ、あなたと彼の感情の波長が合っている証拠です。\n\n【 💭 感情考察・沼る理由 】\n\nあなたが${oshi.name}に沼る理由は「${targetMember.emotionTag}」にあります。${targetMember.desc} 彼への感情は、あなたの心の中の${kwSet[0]}・${kwSet[2]}という核心的な欲求と完全に共鳴しています。この感情は弱さではなく、あなたの豊かな感性の証です♡\n\n【 💌 推し活アドバイス 】\n\n彼の「${oshi.trait}」という光を、あなたの人生の道標として活かしてみましょう。彼が輝くステージを全身で受け取り、その感動をあなた自身の創造性やエネルギーに変換することで、推し活はあなたの人生をより豊かで意味深いものにしてくれます✨ ${kwSet[0]}を大切に、毎日を前向きに歩んでください💜\n\n【 ✨ 結び 】\n\n最後に… ${oshi.name}との出会いは偶然ではなく、必然かもしれません。あなたの心が求める${kwSet[0]}・${kwSet[2]}・${kwSet[1]}、その全てが彼の存在の中にあります。今日もあなたの推し活が、かけがえのない輝きをもたらしてくれますように💜`;
    }

    const footer = `\n\n━━━━━━━━━━━━━━\n\n※当診断は感性の親和性・感情の波長を基にした情緒的な推し活診断です。それぞれの個性を愛し、毎日を前向きに輝かせるためにお役立てください💜`;
    const textEl = document.getElementById('delivery-text');
    if (textEl) textEl.value = header + body + footer;

    // SNS用テキストの生成
    const snsTextEl = document.getElementById('sns-output-text');
    // 3〜5回に1回程度の確率（約25%）で自己紹介を含める
    const includeIntro = Math.random() < 0.25;
    
    if (snsTextEl) {
        let snsBody = "";
        const introText = includeIntro ? `私のマヤ暦基本タイプは「${userSeal}」✨\n` : '';
        if (planType === 'low') {
            snsBody = `${introText}最も感情が共鳴するメンバーTOP3は…\n🥇 ${rankings[0].name} (${rankings[0].score}%)\n🥈 ${rankings[1].name}\n🥉 ${rankings[2].name}\n\n特に ${rankings[0].name} とは【${rankings[0].emotionTag}】で、無意識に惹かれ合っちゃう関係性みたいです♡`;
        } else {
            snsBody = `${introText}最も感情が共鳴するメンバーは ${rankings[0].name} (${rankings[0].score}%) でした！\n【${rankings[0].emotionTag}】な関係性で、お互いの感情の波長がピッタリ合うみたいです♡\n${targetMember ? `「${targetMember.type}」の絆でさらに深く繋がれるかも🔮` : ''}`;
        }
        const snsText = `🔮 推しマヤ相性診断 🔮\n私と「${oshi.group || oshi.name}」の相性を診断してみたよ！\n\n${snsBody}\n\nみんなも推しとの相性をチェックしてみてね👇\n#推しマヤ #推し活 #マヤ暦 #${oshi.name}`;
        snsTextEl.value = snsText;
    }

    // AI用プロンプトの生成
    const aiPromptEl = document.getElementById('ai-prompt-output-text');
    if (aiPromptEl) {
        const aiPrompt = `以下の記事の内容をイメージした挿絵を作成してください。
文章の出来事をそのまま描くのではなく、記事を読んだ人が「この二人の関係性」を直感的にエモく感じられるイラストにしてください。

【画風・スタイル】
・韓国のWebtoon（ウェブマンガ）風の美麗な2Dデジタルイラスト
・雑誌の表紙のような上品で洗練されたデザイン
・透明感があり、柔らかい光に包まれている
・ラベンダー、白、淡いゴールドを基調としたカラーパレット

【構図・世界観】
・二人が自然に視線を交わす、または同じ方向を見つめている構図
・背景はシンプルに（星や光の粒が舞う幻想的な空間）
・アスペクト比は縦長（4:5）

【必須の制約事項（超重要）】
・後でこちらで文字を合成するため、人物は中央より少し下や横にずらし、「文字を載せられる広い余白（空や背景のみの空間）」をしっかりと確保すること。
・画像内には「文字・テキスト・アルファベット・記号」を絶対に一切描画しないでください。

【今回のキャラクターと感情指定】
・人物：記事に登場する二人をイメージしたキャラクター（本人そのままではなく、雰囲気を美しく擬人化した韓国風デザイン）
・表情・空気感：${targetMember ? targetMember.emotionTag : ''}の感情、${kwSet[0]}・${kwSet[1]}の空気を、二人のポーズや表情で自然に表現してください。

■ 記事の要約または感情のキーワード：
${targetMember ? targetMember.desc.replace(/\\n/g, ' ') : ''}
${targetMember ? targetMember.oshiReason.replace(/\\n/g, ' ') : ''}`;
        aiPromptEl.value = aiPrompt;
    }
}

// コピーボタン
document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copy-text-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = document.getElementById('delivery-text');
            if (text) {
                text.select();
                document.execCommand('copy');
                copyBtn.textContent = "コピーしました！ ✅";
                setTimeout(() => { copyBtn.textContent = "納品用テキストをコピーする 📋"; }, 2000);
            }
        });
    }

    const copySnsBtn = document.getElementById('copy-sns-btn');
    if (copySnsBtn) {
        copySnsBtn.addEventListener('click', () => {
            const snsText = document.getElementById('sns-output-text');
            if (snsText) {
                snsText.select();
                document.execCommand('copy');
                copySnsBtn.textContent = "コピーしました！ ✅";
                setTimeout(() => { copySnsBtn.textContent = "SNS用テキストをコピー 📱"; }, 2000);
            }
        });
    }

    const clearTextBtn = document.getElementById('clear-text-btn');
    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', () => {
            if(confirm('納品用テキストをクリアしてもよろしいですか？')) {
                document.getElementById('delivery-text').value = '';
            }
        });
    }

    const clearSnsBtn = document.getElementById('clear-sns-btn');
    if (clearSnsBtn) {
        clearSnsBtn.addEventListener('click', () => {
            if(confirm('SNS用テキストをクリアしてもよろしいですか？')) {
                document.getElementById('sns-output-text').value = '';
            }
        });
    }

    const copyPromptBtn = document.getElementById('copy-prompt-btn');
    if (copyPromptBtn) {
        copyPromptBtn.addEventListener('click', () => {
            const promptText = document.getElementById('ai-prompt-output-text');
            if (promptText) {
                promptText.select();
                document.execCommand('copy');
                copyPromptBtn.textContent = "コピーしました！ ✅";
                setTimeout(() => { copyPromptBtn.textContent = "プロンプトをコピー 🎨"; }, 2000);
            }
        });
    }

    const clearPromptBtn = document.getElementById('clear-prompt-btn');
    if (clearPromptBtn) {
        clearPromptBtn.addEventListener('click', () => {
            if(confirm('プロンプトをクリアしてもよろしいですか？')) {
                document.getElementById('ai-prompt-output-text').value = '';
            }
        });
    }
});

// SNS自動予約処理
document.addEventListener('DOMContentLoaded', () => {
    const snsReserveBtn = document.getElementById('sns-reserve-btn');
    if (snsReserveBtn) {
        snsReserveBtn.addEventListener('click', async () => {
            const scheduleTime = document.getElementById('sns-schedule-time').value;
            const statusText = document.getElementById('sns-reserve-status');
            
            if (!scheduleTime) {
                alert("予約日時を選択してください！");
                return;
            }

            statusText.style.display = 'block';
            statusText.style.color = '#10b981';
            statusText.textContent = "画像生成中...";

            // どのプランが表示されているか判定
            const planType = document.getElementById('plan-type').value;
            let targetElementId = 'page-starter'; // デフォルト
            if (planType === 'mid') {
                targetElementId = 'page-feeling-1'; // 1ページ目を代表として取得
            } else if (planType === 'high') {
                targetElementId = 'page-soul-1';
            }

            const targetElement = document.getElementById(targetElementId);
            if (!targetElement || targetElement.style.display === 'none') {
                statusText.style.color = 'red';
                statusText.textContent = "エラー：カードが表示されていません";
                return;
            }

            try {
                // html2canvasで画像を生成
                const canvas = await html2canvas(targetElement, {
                    scale: 2, // 高画質化
                    useCORS: true, // 外部画像の読み込み許可
                    backgroundColor: null
                });
                
                const base64Image = canvas.toDataURL("image/png");
                
                // テキストの取得 (ココナラ用の長文からSNS用に少し短くしても良いが、一旦そのまま送る)
                const textContent = document.getElementById('delivery-text').value;

                // GASへ送信
                statusText.textContent = "サーバーへ送信中...";
                
                // 【フェーズ2でここにGASのURLを入れます】
                const GAS_URL = "https://script.google.com/macros/s/AKfycbw9eLJl_dkFt6LH2-CJfinyMJu3zxaI5wr2qxNBims-j_c1-Cru-yc_9xmZYH1NRYqBAw/exec"; 
                
                if (GAS_URL === "YOUR_GAS_WEB_APP_URL_HERE") {
                    console.log("Image Data (Base64):", base64Image.substring(0, 50) + "...");
                    console.log("Text:", textContent.substring(0, 50) + "...");
                    console.log("Time:", scheduleTime);
                    alert("【テスト完了】\n画像とテキストの生成に成功しました！\n（まだGASのURLが設定されていないため、実際の送信は行われません）");
                    statusText.textContent = "テスト生成完了（未送信）";
                    return;
                }

                const response = await fetch(GAS_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        image: base64Image,
                        text: textContent,
                        time: scheduleTime,
                        sns: 'threads'
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'no-cors' // GASの場合no-corsが必要なケースがあるため一旦指定（レスポンスが取れなくなるので注意。後で調整）
                });
                
                // no-corsの場合、詳細なレスポンスは読めないが、エラーにならなければ成功とみなす
                statusText.textContent = "予約リストに追加しました！✨";
                alert("スプレッドシートに予約データを送信しました！");

            } catch (error) {
                console.error("送信エラー:", error);
                statusText.style.color = 'red';
                statusText.textContent = "エラーが発生しました";
                alert("送信に失敗しました。\n" + error.message);
            }
        });
    }
});

// =========================================================
// ダッシュボード（承認画面）のロジック
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const modeGenBtn = document.getElementById('mode-gen-btn');
    const modeDashBtn = document.getElementById('mode-dash-btn');
    const imageGenView = document.getElementById('image-gen-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    const dashReloadBtn = document.getElementById('dash-reload-btn');
    const dashLoading = document.getElementById('dash-loading');
    const dashError = document.getElementById('dash-error');
    const dashCardsContainer = document.getElementById('dash-cards-container');

    const GAS_URL = "https://script.google.com/macros/s/AKfycbw9eLJl_dkFt6LH2-CJfinyMJu3zxaI5wr2qxNBims-j_c1-Cru-yc_9xmZYH1NRYqBAw/exec"; 

    // モード切り替え
    if(modeGenBtn && modeDashBtn) {
        modeGenBtn.addEventListener('click', () => {
            imageGenView.style.display = 'flex';
            dashboardView.style.display = 'none';
            modeGenBtn.style.background = 'var(--primary-color)';
            modeGenBtn.style.color = '#fff';
            modeDashBtn.style.background = '#e2e8f0';
            modeDashBtn.style.color = '#333';
        });

        modeDashBtn.addEventListener('click', () => {
            imageGenView.style.display = 'none';
            dashboardView.style.display = 'block';
            modeDashBtn.style.background = 'var(--primary-color)';
            modeDashBtn.style.color = '#fff';
            modeGenBtn.style.background = '#e2e8f0';
            modeGenBtn.style.color = '#333';
            
            // タブを開いた時に自動で読み込む
            loadDashboardData();
        });
    }

    // データ読み込み

    if(dashReloadBtn) {
        dashReloadBtn.addEventListener('click', loadDashboardData);
    }

    async function loadDashboardData(isBackgroundPrefetch = false) {
        const CACHE_KEY = 'oshi_maya_dashboard_cache';
        const cachedStr = localStorage.getItem(CACHE_KEY);
        let hasCache = false;

        // バックグラウンド取得でない場合はUIを更新
        if (!isBackgroundPrefetch) {
            dashError.style.display = 'none';
            dashReloadBtn.disabled = true;
            
            if (cachedStr) {
                try {
                    const cachedData = JSON.parse(cachedStr);
                    renderDashboardCards(cachedData);
                    hasCache = true;
                    dashLoading.style.display = 'block';
                    dashLoading.innerHTML = '<span style="color:#8b5cf6;">最新データを裏側で同期中...✨</span>';
                } catch (e) {
                    console.error("Cache read error", e);
                }
            }

            if (!hasCache) {
                dashLoading.style.display = 'block';
                dashLoading.textContent = "データを読み込んでいます...⏳";
                dashCardsContainer.innerHTML = '';
            }
        }

        try {
            // GASからGETリクエストでデータを取得
            const response = await fetch(GAS_URL);
            const text = await response.text();
            
            let data;
            try {
                data = JSON.parse(text);
                // 成功したらキャッシュを保存
                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            } catch (e) {
                if (text.includes("This is a webhook URL for POST requests only") || text.includes("webhook")) {
                    console.warn("GAS URL is currently POST only. Showing demo data.");
                    data = [
                        { rowId: 2, scheduleTime: "2026/06/30 19:00", snsText: "【テスト用デモデータ1】\nGAS（スプレッドシート連携）が未設定のため、テスト用データを表示しています。\nレイアウトやボタンの動作確認にお使いください！", status: "未承認" },
                        { rowId: 3, scheduleTime: "2026/07/01 12:00", snsText: "【テスト用デモデータ2】\n本番環境では、ここにAIが自動生成したテキストが入ります！", status: "承認済み" }
                    ];
                    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                    if (!isBackgroundPrefetch) alert("⚠️ GAS（スプレッドシート）の設定が未完了のため、テスト用のダミーデータを表示します。");
                } else {
                    throw new Error("不正なデータが返されました: " + text.substring(0, 30) + "...");
                }
            }
            
            if(data.error) throw new Error(data.error);

            // バックグラウンド取得でない場合、または現在ダッシュボードを開いている場合は再描画
            if (!isBackgroundPrefetch || dashboardView.style.display === 'block') {
                renderDashboardCards(data);
            }
        } catch (error) {
            console.error("データ取得エラー:", error);
            if (!isBackgroundPrefetch && !hasCache) {
                dashError.textContent = "データの取得に失敗しました。(" + error.message + ")";
                dashError.style.display = 'block';
            }
        } finally {
            if (!isBackgroundPrefetch) {
                dashLoading.style.display = 'none';
                dashReloadBtn.disabled = false;
            }
        }
    }

    // アプリ起動から3秒後に、裏側でこっそりデータを先読み（プリフェッチ）しておく
    setTimeout(() => {
        loadDashboardData(true);
    }, 3000);

    function renderDashboardCards(data) {
        if(!data || data.length === 0) {
            dashCardsContainer.innerHTML = '<p style="text-align:center; color:#888;">現在、承認待ちの記事はありません✨</p>';
            return;
        }

        // 降順（新しいものが上）にする
        data.reverse().forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = "background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:15px; box-shadow:0 2px 5px rgba(0,0,0,0.02);";
            
            // 日時フォーマット
            const d = new Date(item.scheduleTime);
            const timeStr = isNaN(d.getTime()) ? item.scheduleTime : `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <div style="font-size:12px; color:#666;">
                        <span style="display:inline-block; background:#f472b6; color:white; padding:2px 6px; border-radius:4px; font-weight:bold; margin-right:5px;">行: ${item.rowId}</span>
                        予定日時: ${timeStr}
                    </div>
                    <div style="font-size:12px; font-weight:bold; color:${item.status === '承認済み' ? '#10b981' : '#f59e0b'};">
                        ステータス: ${item.status || '未承認'}
                    </div>
                </div>
                
                <div style="margin-bottom:10px;">
                    <label style="font-size:12px; font-weight:bold; color:#555;">Threads用テキスト (B列)</label>
                    <textarea id="sns-text-${item.rowId}" style="width:100%; height:120px; padding:8px; border:1px solid #ccc; border-radius:4px; font-family:inherit; resize:vertical;">${item.snsText}</textarea>
                </div>

                <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:10px;">
                    <button class="dash-action-btn gen-img-btn" data-row="${item.rowId}" data-title="${item.title || '尊すぎる2人のケミ考察'}" style="padding:6px 12px; background:#8b5cf6; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">🖼️ 画像を生成＆ダウンロード</button>
                    <button class="dash-action-btn botu-btn" data-row="${item.rowId}" style="padding:6px 12px; background:#ef4444; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">🗑️ ボツ</button>
                    <button class="dash-action-btn save-btn" data-row="${item.rowId}" style="padding:6px 12px; background:#3b82f6; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">💾 上書き保存</button>
                    <button class="dash-action-btn approve-btn" data-row="${item.rowId}" style="padding:6px 12px; background:#10b981; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">✅ 承認する (投稿予約)</button>
                </div>
            `;
            dashCardsContainer.appendChild(card);
        });

        // ボタンのイベントリスナー設定
        document.querySelectorAll('.dash-action-btn.gen-img-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const title = e.target.getAttribute('data-title');
                const rowId = e.target.getAttribute('data-row');
                const titleEl = document.getElementById('sns-template-title');
                const template = document.getElementById('sns-image-template');
                
                if (titleEl && template) {
                    titleEl.textContent = title;
                    const originalLeft = template.style.left;
                    const originalZ = template.style.zIndex;
                    
                    // 一時的に画面内に配置して描画
                    template.style.left = '0';
                    template.style.zIndex = '-9999';
                    
                    // 追加：画像を完全にプリロードしてhtml2canvasのフリーズを防止
                    const snsImg = template.querySelector('img');
                    if (snsImg && !snsImg.complete) {
                        await new Promise(resolve => {
                            snsImg.onload = resolve;
                            snsImg.onerror = resolve; // エラーでも先に進める
                        });
                    }
                    
                    // 描画のために少し待つ
                    await new Promise(r => setTimeout(r, 300));
                    
                    try {
                        const canvas = await html2canvas(template, {
                            scale: 2,
                            backgroundColor: null,
                            useCORS: true,
                            allowTaint: true
                        });
                        
                        // 元に戻す
                        template.style.left = originalLeft;
                        template.style.zIndex = originalZ;
                        
                        // 画像としてダウンロード
                        const link = document.createElement('a');
                        link.download = `sns_post_row${rowId}.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                        
                        e.target.textContent = '✅ ダウンロード完了！';
                        setTimeout(() => { e.target.textContent = '🖼️ 画像を生成＆ダウンロード'; }, 2000);
                    } catch (error) {
                        template.style.left = originalLeft;
                        template.style.zIndex = originalZ;
                        console.error('画像生成エラー:', error);
                        alert('画像の生成に失敗しました。');
                    }
                }
            });
        });

        document.querySelectorAll('.dash-action-btn').forEach(btn => {
            // 画像生成ボタンには適用しない
            if (btn.classList.contains('gen-img-btn')) return;

            btn.addEventListener('click', async (e) => {
                const rowId = e.target.getAttribute('data-row');
                const snsText = document.getElementById(`sns-text-${rowId}`).value;
                // note用記事は今回は表示していないため、元のままにするか空で更新するかですが、
                // GETの際に持っていないので、とりあえずそのままの想定。
                // 実際はスプレッドシート側でセル更新時に注意が必要（今回はsnsTextとstatusのみ送る）
                
                let actionStatus = "";
                if(e.target.classList.contains('botu-btn')) actionStatus = "ボツ";
                else if(e.target.classList.contains('approve-btn')) actionStatus = "承認済み";
                else if(e.target.classList.contains('save-btn')) actionStatus = "未承認"; // 単なる保存

                if(actionStatus === "ボツ") {
                    if(!confirm("この記事をボツ（削除扱い）にしてもよろしいですか？")) return;
                }

                e.target.disabled = true;
                const originalText = e.target.innerHTML;
                e.target.innerHTML = "⏳ 送信中...";

                try {
                    // APIにPOST送信
                    const res = await fetch(GAS_URL, {
                        method: 'POST',
                        body: JSON.stringify({
                            action: "update",
                            rowId: rowId,
                            snsText: snsText,
                            blogText: "", // note用は今回はダッシュボード外なので空文字を送る（GAS側で判定が必要ですが、今回は簡単のため）
                            status: actionStatus
                        })
                    });
                    
                    // fetch のレスポンスを待たずに成功として扱う（CORS回避のため）
                    // ※実際は mode: 'no-cors' だとステータス読めないが、ここではJSON返却を許可している前提
                    alert(actionStatus === "ボツ" ? "ボツにしました" : (actionStatus === "承認済み" ? "承認しました！自動投稿を待ちます。" : "保存しました。"));
                    loadDashboardData(); // 再読み込み
                } catch(error) {
                    console.error(error);
                    alert("更新に失敗しました。");
                    e.target.disabled = false;
                    e.target.innerHTML = originalText;
                }
            });
        });
    }
});
