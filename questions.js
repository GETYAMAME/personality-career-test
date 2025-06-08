// 性格診断と適職診断のための質問リスト
const questions = [
  {
    id: 1,
    text: "誰かの間違いを見つけた時、すぐにその場で指摘してあげる方が、その人のためになると思う。",
    category: "communication", // コミュニケーションスタイル
    trait: "directness", // 直接的
  },
  {
    id: 2,
    text: "新しいアイデアを考えるのが好きで、創造的な解決策を見つけることにやりがいを感じる。",
    category: "thinking", // 思考スタイル
    trait: "creativity", // 創造性
  },
  {
    id: 3,
    text: "計画を立てて物事を進めるのが好きで、予定通りに進まないと不安になる。",
    category: "work", // 仕事スタイル
    trait: "planning", // 計画性
  },
  {
    id: 4,
    text: "大勢の人と一緒にいるよりも、一人や少人数で過ごす時間の方がエネルギーが回復する。",
    category: "social", // 社会性
    trait: "introversion", // 内向性
  },
  {
    id: 5,
    text: "細かい作業や正確さが求められる仕事が得意だ。",
    category: "work", // 仕事スタイル
    trait: "detail", // 細部への注意
  },
  {
    id: 6,
    text: "リーダーシップを取ることが多く、グループの中で方向性を示すことが自然にできる。",
    category: "social", // 社会性
    trait: "leadership", // リーダーシップ
  },
  {
    id: 7,
    text: "感情よりも論理的な分析に基づいて決断することが多い。",
    category: "thinking", // 思考スタイル
    trait: "analytical", // 分析的
  },
  {
    id: 8,
    text: "新しい環境や状況に適応するのが早い方だ。",
    category: "adaptability", // 適応性
    trait: "flexibility", // 柔軟性
  },
  {
    id: 9,
    text: "他人の感情や気持ちに敏感で、相手の立場に立って考えることができる。",
    category: "empathy", // 共感性
    trait: "empathy", // 共感力
  },
  {
    id: 10,
    text: "締め切りや時間的なプレッシャーがある方が、効率よく作業できる。",
    category: "work", // 仕事スタイル
    trait: "pressure", // プレッシャー下のパフォーマンス
  },
  {
    id: 11,
    text: "複数のタスクを同時に進行させるよりも、一つのタスクに集中して取り組む方が好きだ。",
    category: "work", // 仕事スタイル
    trait: "focus", // 集中力
  },
  {
    id: 12,
    text: "議論や交渉の場面では、妥協点を見つけるよりも自分の意見を通すことが多い。",
    category: "communication", // コミュニケーションスタイル
    trait: "assertiveness", // 主張性
  },
  {
    id: 13,
    text: "新しい技術やツールを学ぶことに抵抗がなく、積極的に取り入れようとする。",
    category: "learning", // 学習スタイル
    trait: "tech_adoption", // 技術適応性
  },
  {
    id: 14,
    text: "チームで働くよりも、個人で責任を持って仕事を完結させる方が好きだ。",
    category: "work", // 仕事スタイル
    trait: "independence", // 独立性
  },
  {
    id: 15,
    text: "物事を決める際は、直感よりも事実やデータに基づいて判断することが多い。",
    category: "thinking", // 思考スタイル
    trait: "data_driven", // データ駆動型
  },
];

// 性格タイプの定義
const personalityTypes = {
  analytical_leader: {
    name: "分析的リーダー",
    description:
      "論理的思考と決断力を兼ね備えたタイプです。データや事実に基づいて判断し、効率的に目標達成に向けて組織やチームを導くことができます。戦略的な思考が得意で、複雑な問題を分解して解決策を見出すのが上手です。",
    traits: ["analytical", "leadership", "data_driven", "directness"],
  },
  creative_innovator: {
    name: "創造的イノベーター",
    description:
      "新しいアイデアを生み出し、従来の枠にとらわれない発想ができるタイプです。好奇心が強く、常に新しい可能性を探求しています。変化を恐れず、むしろそれを楽しみ、創造的な解決策を見つけることに喜びを感じます。",
    traits: ["creativity", "flexibility", "tech_adoption"],
  },
  empathetic_collaborator: {
    name: "共感的コラボレーター",
    description:
      "他者の感情や立場を理解し、良好な人間関係を構築できるタイプです。チームワークを重視し、協力して目標を達成することに価値を見出します。コミュニケーション能力が高く、調和のとれた環境づくりに貢献します。",
    traits: ["empathy", "flexibility", "introversion"],
  },
  detail_oriented_specialist: {
    name: "細部重視スペシャリスト",
    description:
      "正確さと完璧さを追求するタイプです。細かい部分まで注意を払い、ミスを見逃しません。計画的に物事を進め、質の高い成果物を生み出します。専門分野での深い知識と技術を持ち、信頼性の高い仕事をします。",
    traits: ["detail", "planning", "focus", "independence"],
  },
  adaptable_problem_solver: {
    name: "適応力のある問題解決者",
    description:
      "変化する状況に柔軟に対応し、実用的な解決策を見つけるタイプです。プレッシャーの中でも冷静に判断でき、多様な視点から問題にアプローチします。学習意欲が高く、新しい知識やスキルを素早く習得します。",
    traits: ["flexibility", "pressure", "tech_adoption", "analytical"],
  },
};

// 職業カテゴリーの定義
const careerCategories = {
  tech: {
    name: "IT・技術職",
    description:
      "テクノロジーを活用して問題解決や新しい価値創造を行う職種です。",
    personalities: [
      "analytical_leader",
      "creative_innovator",
      "detail_oriented_specialist",
      "adaptable_problem_solver",
    ],
    jobs: [
      "システムエンジニア",
      "プログラマー",
      "データサイエンティスト",
      "AIエンジニア",
      "ネットワークエンジニア",
      "セキュリティスペシャリスト",
      "UX/UIデザイナー",
      "プロダクトマネージャー",
    ],
  },
  business: {
    name: "ビジネス・経営職",
    description: "組織の運営や戦略立案、業績向上に関わる職種です。",
    personalities: [
      "analytical_leader",
      "adaptable_problem_solver",
      "empathetic_collaborator",
    ],
    jobs: [
      "経営コンサルタント",
      "マーケティングマネージャー",
      "財務アナリスト",
      "人事マネージャー",
      "プロジェクトマネージャー",
      "営業マネージャー",
      "経営企画",
      "事業開発",
    ],
  },
  creative: {
    name: "クリエイティブ職",
    description: "創造性を活かして新しい価値や表現を生み出す職種です。",
    personalities: [
      "creative_innovator",
      "empathetic_collaborator",
      "adaptable_problem_solver",
    ],
    jobs: [
      "グラフィックデザイナー",
      "Webデザイナー",
      "コンテンツクリエイター",
      "ゲームデザイナー",
      "アートディレクター",
      "映像クリエイター",
      "コピーライター",
      "イラストレーター",
    ],
  },
  research: {
    name: "研究・専門職",
    description: "専門知識や分析力を活かして探究や問題解決を行う職種です。",
    personalities: [
      "detail_oriented_specialist",
      "analytical_leader",
      "creative_innovator",
    ],
    jobs: [
      "研究者",
      "大学教授",
      "専門コンサルタント",
      "アナリスト",
      "エコノミスト",
      "法律専門家",
      "医療専門家",
      "科学者",
    ],
  },
  service: {
    name: "サービス・対人職",
    description: "人々のニーズに応え、サポートやケアを提供する職種です。",
    personalities: ["empathetic_collaborator", "adaptable_problem_solver"],
    jobs: [
      "カスタマーサポート",
      "ヘルスケアワーカー",
      "教育者",
      "カウンセラー",
      "ソーシャルワーカー",
      "接客業",
      "人材コーディネーター",
      "イベントプランナー",
    ],
  },
};
