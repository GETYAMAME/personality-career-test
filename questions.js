// 性格診断と適職診断のための質問リスト
const questions = [
  {
    id: 1,
    text: "友達のファッションが少し残念だなと思ったとき、「もっと似合う服あるよ♪」と優しくアドバイスしたくなる。",
    category: "communication", // コミュニケーションスタイル
    trait: "directness", // 直接的
  },
  {
    id: 2,
    text: "お部屋の模様替えやDIYなど、自分らしいアイデアでオリジナルな空間を作るのが好き。",
    category: "thinking", // 思考スタイル
    trait: "creativity", // 創造性
  },
  {
    id: 3,
    text: "旅行に行くときは、事前にスケジュールを立てて、おすすめスポットをリストアップしておきたい派。",
    category: "work", // 仕事スタイル
    trait: "planning", // 計画性
  },
  {
    id: 4,
    text: "賑やかなカフェよりも、静かな一人カフェタイムの方がホッとリラックスできる。",
    category: "social", // 社会性
    trait: "introversion", // 内向性
  },
  {
    id: 5,
    text: "友達からは「細かいところまでよく気がつくね」と言われることが多い。",
    category: "work", // 仕事スタイル
    trait: "detail", // 細部への注意
  },
  {
    id: 6,
    text: "女子会やイベントで、自然と「じゃあ、こうしよう！」と提案して盛り上げる役になりがち。",
    category: "social", // 社会性
    trait: "leadership", // リーダーシップ
  },
  {
    id: 7,
    text: "恋愛でも、ときめきだけでなく「この人と一緒にいて将来どうなるかな」と考えてしまう。",
    category: "thinking", // 思考スタイル
    trait: "analytical", // 分析的
  },
  {
    id: 8,
    text: "急な予定変更があっても「まぁいっか♪」と気持ちを切り替えられる方だと思う。",
    category: "adaptability", // 適応性
    trait: "flexibility", // 柔軟性
  },
  {
    id: 9,
    text: "友達が悩んでいるとき、つい自分のことのように心配になって、寄り添いたくなる。",
    category: "empathy", // 共感性
    trait: "empathy", // 共感力
  },
  {
    id: 10,
    text: "締切が近づくとアドレナリンが出て、むしろ集中して頑張れるタイプ。",
    category: "work", // 仕事スタイル
    trait: "pressure", // プレッシャー下のパフォーマンス
  },
  {
    id: 11,
    text: "Netflix見ながらSNSチェックするより、一つのことに没頭する時間が好き。",
    category: "work", // 仕事スタイル
    trait: "focus", // 集中力
  },
  {
    id: 12,
    text: "友達とランチ先を決めるとき、自分の食べたいものを優先して提案することが多い。",
    category: "communication", // コミュニケーションスタイル
    trait: "assertiveness", // 主張性
  },
  {
    id: 13,
    text: "新しいアプリやSNSが出ると、友達より先に試してみたくなる。",
    category: "learning", // 学習スタイル
    trait: "tech_adoption", // 技術適応性
  },
  {
    id: 14,
    text: "グループワークより、自分のペースで進められる個人作業の方が気楽に感じる。",
    category: "work", // 仕事スタイル
    trait: "independence", // 独立性
  },
  {
    id: 15,
    text: "占いよりも性格診断テストの方が信頼できると思う。",
    category: "thinking", // 思考スタイル
    trait: "data_driven", // データ駆動型
  },
];

// 性格タイプの定義
const personalityTypes = {
  analytical_leader: {
    name: "知的リーダータイプ",
    description:
      "頭の回転が速く、周りを自然とリードするタイプ✨ 物事を論理的に考え、効率よく目標達成に向かうのが得意です。友達からは「頼りになる」と言われることが多く、グループの中心的存在になりがち。計画性があり、みんなを上手に巻き込んで楽しい時間を作り出せる才能があります。",
    traits: ["analytical", "leadership", "data_driven", "directness"],
  },
  creative_innovator: {
    name: "クリエイティブ発想タイプ",
    description:
      "豊かな発想力と好奇心を持つ、アイデアの泉のような存在✨ 「こんなことできたらいいな」を形にするのが得意で、周りに新しい風を運んできます。マンネリを嫌い、常に新しいことにチャレンジしたい気持ちがあります。SNSでトレンドをいち早くキャッチし、友達に紹介するのも楽しみの一つ。",
    traits: ["creativity", "flexibility", "tech_adoption"],
  },
  empathetic_collaborator: {
    name: "共感力の高いサポーター",
    description:
      "人の気持ちに寄り添える、優しさと温かさを持つタイプ✨ 友達の小さな変化にも気づき、「どうしたの？」と声をかけられる繊細さを持っています。聞き上手で、周りからは相談相手として頼られることが多いでしょう。人間関係を大切にし、みんなが心地よく過ごせる空間づくりが得意です。",
    traits: ["empathy", "flexibility", "introversion"],
  },
  detail_oriented_specialist: {
    name: "丁寧な完璧主義者",
    description:
      "細部まで気を配る、几帳面で信頼感のあるタイプ✨ 「ざっくり」よりも「きっちり」が好きで、何事も妥協せず最後までやり遂げる粘り強さがあります。計画を立てるのが得意で、旅行の幹事を任されることも多いはず。約束はしっかり守り、友達からは「頼むと必ず期待以上にやってくれる」と信頼されています。",
    traits: ["detail", "planning", "focus", "independence"],
  },
  adaptable_problem_solver: {
    name: "臨機応変なトラブルシューター",
    description:
      "どんな状況でも柔軟に対応できる、頼れる問題解決タイプ✨ 予定変更があっても「なんとかなるよ！」とポジティブに切り替えられます。友達が困っているとき、すぐに実用的なアドバイスができるので、周りからは「いざというとき頼りになる」と思われています。新しいことを学ぶのが早く、トレンドにもすぐ適応できる順応性の高さが魅力です。",
    traits: ["flexibility", "pressure", "tech_adoption", "analytical"],
  },
};

// 職業カテゴリーの定義
const careerCategories = {
  tech: {
    name: "IT・デジタル系",
    description:
      "最新テクノロジーを使って、便利で楽しいサービスを作り出す仕事です✨ デジタルの力で人々の生活をより豊かにすることができます。",
    personalities: [
      "analytical_leader",
      "creative_innovator",
      "detail_oriented_specialist",
      "adaptable_problem_solver",
    ],
    jobs: [
      "Webデザイナー",
      "アプリ開発者",
      "データアナリスト",
      "SNSマーケター",
      "UX/UIデザイナー",
      "テックライター",
      "デジタルプロダクトマネージャー",
      "eコマーススペシャリスト",
    ],
  },
  business: {
    name: "ビジネス・企画系",
    description:
      "アイデアを形にして、組織やプロジェクトを成功に導く仕事です✨ 人を巻き込む力とビジョンで、新しい価値を生み出します。",
    personalities: [
      "analytical_leader",
      "adaptable_problem_solver",
      "empathetic_collaborator",
    ],
    jobs: [
      "マーケティングプランナー",
      "ブランドマネージャー",
      "PR・広報担当",
      "コンサルタント",
      "プロジェクトマネージャー",
      "人事・採用担当",
      "商品企画",
      "スタートアップ起業家",
    ],
  },
  creative: {
    name: "クリエイティブ系",
    description:
      "感性と創造力で、人の心を動かすコンテンツや作品を生み出す仕事です✨ 自分らしい表現で、世界に彩りを加えることができます。",
    personalities: [
      "creative_innovator",
      "empathetic_collaborator",
      "adaptable_problem_solver",
    ],
    jobs: [
      "グラフィックデザイナー",
      "イラストレーター",
      "インテリアコーディネーター",
      "ファッションデザイナー",
      "フォトグラファー",
      "SNSクリエイター",
      "コピーライター",
      "フードスタイリスト",
    ],
  },
  research: {
    name: "専門知識・研究系",
    description:
      "深い知識と探究心で、専門分野のエキスパートとして活躍する仕事です✨ 確かな情報と分析力で、社会に貢献できます。",
    personalities: [
      "detail_oriented_specialist",
      "analytical_leader",
      "creative_innovator",
    ],
    jobs: [
      "研究員",
      "専門ライター",
      "翻訳者",
      "データサイエンティスト",
      "心理カウンセラー",
      "栄養士・管理栄養士",
      "キュレーター",
      "専門コンサルタント",
    ],
  },
  service: {
    name: "対人サービス・ケア系",
    description:
      "人との関わりを大切にし、サポートやケアを通じて笑顔を生み出す仕事です✨ 相手の気持ちに寄り添い、心地よい体験を提供します。",
    personalities: ["empathetic_collaborator", "adaptable_problem_solver"],
    jobs: [
      "カスタマーサクセス",
      "ウェディングプランナー",
      "ツアーコーディネーター",
      "美容アドバイザー",
      "フィットネスインストラクター",
      "保育士",
      "イベントプランナー",
      "ホスピタリティスタッフ",
    ],
  },
};
