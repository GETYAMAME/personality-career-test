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
  // LINE連携機能は一時的に無効化
  // lineAdd: document.getElementById("line-add-button"),
};

// フォーム要素
const registrationForm = document.getElementById("registration-form");
const emailInput = document.getElementById("email");

// LINE友だち追加URL
const LINE_FRIEND_URL = "https://lin.ee/your_line_id"; // 実際のLINE公式アカウントのURLに変更する必要があります

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
  try {
    // LIFFが初期化されているか確認
    if (liff.isInClient()) {
      // LINEアプリ内で実行されている場合
      liff.openWindow({
        url: LINE_FRIEND_URL,
        external: false,
      });
    } else {
      // ブラウザで実行されている場合
      window.open(LINE_FRIEND_URL, "_blank");
    }

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
  } catch (error) {
    console.error("LINE連携エラー:", error);
    alert("LINE連携中にエラーが発生しました。ブラウザで開いてみてください。");

    // エラーが発生した場合でも結果画面に進む
    contactInfo = { line: "LINE経由（エラー発生）" };

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
  }
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

// 結果URLを生成する関数
const generateResultUrl = (results) => {
  // 結果データをURLパラメータに含める
  const personalityType = results.personalityType; // personalityTypeはキー名
  const careerCategory = results.careerCategories[0].key; // careerCategoriesの最初の要素のkey

  // URLパラメータに必要最小限の情報を含める
  // ローカル環境の場合はVercelのURLを使用
  const baseUrl = "https://personality-career-test.vercel.app/";
  return `${baseUrl}?p=${personalityType}&c=${careerCategory}`;
};

// メールで診断結果を送信する
const sendResultsByEmail = (email, results) => {
  try {
    console.log("メール送信処理を開始します...");
    console.log("EmailJS情報 - ユーザーID:", "C2SQsPrfRcTmuDxwY");
    console.log("EmailJS情報 - サービスID:", "service_geb6xap");
    console.log("EmailJS情報 - テンプレートID:", "template_x2a74sv");

    // EmailJSの初期化を確認
    if (typeof emailjs === "undefined") {
      console.error("EmailJSが読み込まれていません");
      alert(
        "メール送信機能が正しく初期化されていません。ページを再読み込みしてください。"
      );
      return;
    }

    // EmailJSの初期化（公開キーを設定）
    emailjs.init("C2SQsPrfRcTmuDxwY");
    console.log("EmailJSを初期化しました");

    // 結果URLを生成（ローカルストレージを使わない）
    const resultUrl = generateResultUrl(results);
    console.log("生成されたURL:", resultUrl);

    // 診断結果のテキストを作成（短く保つ）
    const personalityType = results.personalityData.name;
    // 説明文は短くする
    const personalityDesc =
      "あなたの性格タイプの特徴です。詳細はメール内のURLからご確認ください。";
    const careerCategory = results.careerCategories[0].name;
    // 職業リストも短くする
    const careerJobs =
      results.careerCategories[0].jobs.slice(0, 3).join("、") + "など";

    // 非常に簡素化したテンプレートパラメータ
    const templateParams = {
      to_email: email,
      personality_type: personalityType,
      personality_description: personalityDesc,
      career_category: careerCategory,
      career_jobs: careerJobs,
      result_url: resultUrl,
    };

    console.log("送信するパラメータ:", JSON.stringify(templateParams, null, 2));

    // 直接シンプルなパラメータで送信
    emailjs
      .send("service_geb6xap", "template_x2a74sv", templateParams)
      .then((response) => {
        console.log("メール送信成功:", response);
        alert("診断結果をメールで送信しました！");
      })
      .catch((error) => {
        console.error("メール送信エラー:", error);

        // エラーの詳細情報を表示
        if (error.text) {
          console.error("エラー詳細:", error.text);
        }

        alert("メール送信中にエラーが発生しました。もう一度お試しください。");

        // 代替手段として結果URLをクリップボードにコピー
        navigator.clipboard
          .writeText(resultUrl)
          .then(() => {
            alert(
              "結果URLをクリップボードにコピーしました。必要に応じて保存してください。"
            );
          })
          .catch((err) => {
            console.error("クリップボードへのコピーに失敗しました:", err);
          });
      });
  } catch (error) {
    console.error("メール送信処理でエラーが発生しました:", error);
    alert("メール送信処理でエラーが発生しました。もう一度お試しください。");
  }
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

  // LINE友だち追加ボタン - 一時的に無効化
  // buttons.lineAdd.addEventListener("click", addLineFriend);

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

// LIFFの初期化
const initLiff = async () => {
  try {
    // LIFFアプリのIDを設定（実際のLIFF IDに変更する必要があります）
    const liffId = "your_liff_id";

    // LIFFの初期化
    await liff.init({ liffId });
    console.log("LIFF initialized successfully");
  } catch (error) {
    console.error("LIFF initialization failed:", error);
  }
};

// URLからパラメータを取得する関数
const getResultParamsFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    personalityType: urlParams.get("p"),
    careerCategory: urlParams.get("c"),
  };
};

// パラメータから結果を再構築する関数
const reconstructResultsFromParams = (params) => {
  if (!params.personalityType || !params.careerCategory) return null;

  // personalityDataを取得（personalityTypesはオブジェクト）
  const personalityData = personalityTypes[params.personalityType];
  if (!personalityData) return null;

  // careerCategoriesを取得（careerCategoriesはオブジェクト）
  const careerCategory = careerCategories[params.careerCategory];
  if (!careerCategory) return null;

  // キーを追加
  const careerCategoryWithKey = {
    ...careerCategory,
    key: params.careerCategory,
  };

  // 結果オブジェクトを再構築
  return {
    personalityType: params.personalityType,
    personalityData: personalityData,
    careerCategories: [careerCategoryWithKey],
  };
};

// アプリケーションの初期化
const initApp = () => {
  // イベントリスナーの設定
  setupEventListeners();

  // URLからパラメータを取得
  const params = getResultParamsFromUrl();

  // パラメータがある場合は結果を再構築して表示
  if (params.personalityType && params.careerCategory) {
    const reconstructedResults = reconstructResultsFromParams(params);
    if (reconstructedResults) {
      // 結果を表示
      displayResults(reconstructedResults);
      // 結果画面を表示
      showScreen("result");
    } else {
      // 結果の再構築に失敗した場合は開始画面を表示
      showScreen("start");
    }
  } else {
    // パラメータがない場合は開始画面を表示
    showScreen("start");
  }

  // LIFFの初期化 - 一時的に無効化
  // if (window.liff) {
  //   initLiff();
  // } else {
  //   console.warn("LIFF SDK is not loaded");
  // }
};

// DOMが読み込まれたら初期化
document.addEventListener("DOMContentLoaded", initApp);
