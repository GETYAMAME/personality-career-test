// メインのアプリケーションロジック

// 画面要素
const screens = {
  start: document.getElementById("start-screen"),
  registration: document.getElementById("registration-screen"),
  question: document.getElementById("question-screen"),
  loading: document.getElementById("loading-screen"),
  result: document.getElementById("result-screen"),
};

// ボタン要素
const buttons = {
  start: document.getElementById("start-btn"),
  prev: document.getElementById("prev-btn"),
  restart: document.getElementById("restart-btn"),
  lineAdd: document.getElementById("line-add-button"),
};

// フォーム要素
const registrationForm = document.getElementById("registration-form");
const emailInput = document.getElementById("email");

// LINE友だち追加URL
const LINE_FRIEND_URL = "https://line.me/R/ti/p/@908enhf"; // 実際のLINE公式アカウントのIDに変更してください

// 質問表示要素
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const progressBar = document.getElementById("progress-bar");
const optionInputs = document.querySelectorAll('input[name="answer"]');

// アプリケーションの状態
let currentQuestionIndex = 0;
let answers = [];
let contactInfo = null;

// 画面を切り替える関数
const showScreen = (screenId) => {
  // すべての画面を非表示にする
  Object.values(screens).forEach((screen) => {
    screen.classList.add("hidden");
  });

  // 指定された画面を表示する
  screens[screenId].classList.remove("hidden");
};

// 質問を表示する関数
const showQuestion = (index) => {
  const question = questions[index];

  // 質問番号と質問テキストを設定
  questionNumber.textContent = `Q${index + 1}`;
  questionText.textContent = question.text;

  // プログレスバーを更新
  const progress = ((index + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;

  // ラジオボタンの選択をリセット
  optionInputs.forEach((input) => {
    input.checked = false;
  });
};

// 診断を開始する
const startDiagnosis = () => {
  // 状態をリセット
  currentQuestionIndex = 0;
  answers = Array(questions.length).fill(null);

  // 質問画面を表示
  showScreen("question");
  showQuestion(currentQuestionIndex);
};

// 質問画面に進む
const proceedToQuestions = (event) => {
  event.preventDefault();

  // 入力値を取得
  const email = emailInput.value.trim();

  // メールアドレスが入力されているか確認
  if (!email) {
    alert("メールアドレスを入力してください。");
    return;
  }

  // 連絡先情報を保存
  contactInfo = { email };

  // 最初の質問を表示
  showScreen("question");
  showQuestion(currentQuestionIndex);
};

// LINE友だち追加
const addLineFriend = () => {
  // 新しいウィンドウでLINE友だち追加ページを開く
  window.open(LINE_FRIEND_URL, "_blank");

  // 友だち追加後に結果画面に進む
  setTimeout(() => {
    // 連絡先情報を保存（LINE経由）
    contactInfo = { line: "LINE経由" };

    // ローディング画面を表示
    showScreen("loading");

    // 結果計算の処理時間をシミュレート
    setTimeout(() => {
      // 結果を計算
      const results = generateResults(answers);

      // 結果を表示
      displayResults(results);

      // 結果を保存
      saveResults(contactInfo, results);

      // 結果画面を表示
      showScreen("result");
    }, 1500);
  }, 500);
};

// 次の質問に進む
const nextQuestion = () => {
  // 現在の回答を保存
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
    answers[currentQuestionIndex] = parseInt(selectedOption.value);
  }

  // 次の質問へ
  currentQuestionIndex++;

  // まだ質問が残っている場合
  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex);

    // 2問目以降は「戻る」ボタンを表示
    if (currentQuestionIndex > 0) {
      buttons.prev.classList.remove("hidden");
    } else {
      buttons.prev.classList.add("hidden");
    }
  } else {
    // 質問が終了した場合、結果画面へ
    finishQuestions();
  }
};

// 前の質問に戻る
const prevQuestion = () => {
  // 前の質問へ
  currentQuestionIndex--;

  // 1問目の場合は「戻る」ボタンを非表示
  if (currentQuestionIndex === 0) {
    buttons.prev.classList.add("hidden");
  }

  // 質問を表示
  showQuestion(currentQuestionIndex);
};

// 質問を終了し、登録画面に進む
const finishQuestions = () => {
  // 登録画面を表示
  showScreen("registration");
};

// 結果を表示する
const showResults = (event) => {
  if (event) {
    event.preventDefault();
  }

  // 入力値を取得
  const email = emailInput.value.trim();

  // メールアドレスが入力されているか確認
  if (!email) {
    alert("メールアドレスを入力してください。");
    return;
  }

  // 連絡先情報を保存
  contactInfo = { email };

  // ローディング画面を表示
  showScreen("loading");

  // 結果計算の処理時間をシミュレート（実際はすぐに計算できるが、UX向上のため）
  setTimeout(() => {
    // 結果を計算
    const results = generateResults(answers);

    // 結果を表示
    displayResults(results);

    // 結果を保存
    saveResults(contactInfo, results);

    // メールで診断結果を送信
    sendResultsByEmail(email, results);

    // 結果画面を表示
    showScreen("result");
  }, 1500);
};

// メールで診断結果を送信する
const sendResultsByEmail = (email, results) => {
  // 診断結果のテキストを作成
  const personalityType = results.personalityData.name;
  const personalityDesc = results.personalityData.description;
  const careerCategory = results.careerCategories[0].name;
  const careerJobs = results.careerCategories[0].jobs.join("、");

  // EmailJSのテンプレートパラメータ
  const templateParams = {
    to_email: email,
    personality_type: personalityType,
    personality_description: personalityDesc,
    career_category: careerCategory,
    career_jobs: careerJobs,
  };

  // EmailJSを使用してメール送信
  // 実際のサービスIDとテンプレートIDに置き換えてください
  emailjs
    .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then((response) => {
      console.log("メール送信成功:", response);
    })
    .catch((error) => {
      console.error("メール送信エラー:", error);
    });
};

// 診断をリスタートする
const restartDiagnosis = () => {
  // 開始画面に戻る
  showScreen("start");
};

// イベントリスナーの設定
const setupEventListeners = () => {
  // 開始ボタン
  buttons.start.addEventListener("click", startDiagnosis);

  // 登録フォーム送信
  registrationForm.addEventListener("submit", showResults);

  // LINE友だち追加ボタン
  buttons.lineAdd.addEventListener("click", addLineFriend);

  // 選択肢が選ばれたとき、自動的に次の質問へ
  optionInputs.forEach((input) => {
    input.addEventListener("change", () => {
      // 少し遅延を入れて、ユーザーが選択を確認できるようにする
      setTimeout(nextQuestion, 500);
    });
  });

  // 戻るボタン
  buttons.prev.addEventListener("click", prevQuestion);

  // リスタートボタン
  buttons.restart.addEventListener("click", restartDiagnosis);
};

// アプリケーションの初期化
const initApp = () => {
  setupEventListeners();
  showScreen("start");
};

// DOMが読み込まれたら初期化
document.addEventListener("DOMContentLoaded", initApp);
