// 診断結果の計算と表示のためのロジック

// 特性スコアの初期化
const initializeTraitScores = () => {
  return {
    directness: 0,
    creativity: 0,
    planning: 0,
    introversion: 0,
    detail: 0,
    leadership: 0,
    analytical: 0,
    flexibility: 0,
    empathy: 0,
    pressure: 0,
    focus: 0,
    assertiveness: 0,
    tech_adoption: 0,
    independence: 0,
    data_driven: 0,
  };
};

// 回答から特性スコアを計算
const calculateTraitScores = (answers) => {
  const traitScores = initializeTraitScores();

  // 各質問の回答を処理
  questions.forEach((question, index) => {
    const answer = answers[index];
    if (answer) {
      // 回答値（1-5）に基づいてスコアを加算
      // 1: 強く反対、2: 反対、3: どちらでもない、4: 賛成、5: 強く賛成
      traitScores[question.trait] += answer;
    }
  });

  return traitScores;
};

// 特性スコアから性格タイプを判定
const determinePersonalityType = (traitScores) => {
  // 各性格タイプの合計スコアを計算
  const typeScores = {};
  const typeMatches = {};

  Object.keys(personalityTypes).forEach((typeKey) => {
    const type = personalityTypes[typeKey];

    // この性格タイプに関連する特性のスコアを合計
    let totalScore = 0;
    let matchCount = 0;

    // 各特性について、スコアが3以上（「どちらでもない」以上）なら一致とみなす
    type.traits.forEach((trait) => {
      const score = traitScores[trait] || 0;
      totalScore += score;
      if (score >= 3) {
        matchCount++;
      }
    });

    // 特性の一致率を計算（0〜1の範囲）
    const matchRate = matchCount / type.traits.length;

    // 合計スコアと一致率を保存
    typeScores[typeKey] = totalScore;
    typeMatches[typeKey] = matchRate;
  });

  // スコアと一致率を組み合わせて最終スコアを計算
  const finalScores = {};
  Object.keys(typeScores).forEach((typeKey) => {
    // 一致率に重みを付けて最終スコアを計算
    finalScores[typeKey] =
      typeScores[typeKey] * (0.7 + typeMatches[typeKey] * 0.3);
  });

  // 最高スコアの性格タイプを見つける
  let highestScore = 0;
  let highestType = null;

  Object.keys(finalScores).forEach((typeKey) => {
    if (finalScores[typeKey] > highestScore) {
      highestScore = finalScores[typeKey];
      highestType = typeKey;
    }
  });

  // 同点の場合はランダムに選択
  const tiedTypes = Object.keys(finalScores).filter(
    (typeKey) => Math.abs(finalScores[typeKey] - highestScore) < 0.001
  );

  if (tiedTypes.length > 1) {
    const randomIndex = Math.floor(Math.random() * tiedTypes.length);
    highestType = tiedTypes[randomIndex];
  }

  return highestType;
};

// 性格タイプから適職カテゴリーを判定
const determineCareerCategories = (personalityType) => {
  const matchingCategories = [];

  Object.keys(careerCategories).forEach((categoryKey) => {
    const category = careerCategories[categoryKey];
    if (category.personalities.includes(personalityType)) {
      matchingCategories.push({
        key: categoryKey,
        ...category,
      });
    }
  });

  // マッチするカテゴリーがない場合は、すべてのカテゴリーから選択
  if (matchingCategories.length === 0) {
    Object.keys(careerCategories).forEach((categoryKey) => {
      matchingCategories.push({
        key: categoryKey,
        ...careerCategories[categoryKey],
      });
    });
  }

  // カテゴリーをランダムに並び替え
  for (let i = matchingCategories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matchingCategories[i], matchingCategories[j]] = [
      matchingCategories[j],
      matchingCategories[i],
    ];
  }

  return matchingCategories;
};

// 診断結果を生成
const generateResults = (answers) => {
  // 特性スコアを計算
  const traitScores = calculateTraitScores(answers);

  // 性格タイプを判定
  const personalityType = determinePersonalityType(traitScores);

  // 適職カテゴリーを判定
  const careerCats = determineCareerCategories(personalityType);

  // 結果オブジェクトを返す
  return {
    traitScores,
    personalityType,
    personalityData: personalityTypes[personalityType],
    careerCategories: careerCats,
  };
};

// 結果画面に診断結果を表示
const displayResults = (results) => {
  // 性格タイプの表示
  document.getElementById("personality-type").textContent =
    results.personalityData.name;
  document.getElementById("personality-description").textContent =
    results.personalityData.description;

  // 性格タイプに応じた画像を表示
  const personalityImage = document.getElementById("personality-image");
  const personalityType = results.personalityType;

  // Vercel Storageの画像URLマッピング
  const imageUrls = {
    analytical_leader:
      "https://0go8j1roigqby3ss.public.blob.vercel-storage.com/analytical_leader-5s542fcs4k7mVKoYRQ1PfalWGS36i2.png",
    creative_innovator:
      "https://0go8j1roigqby3ss.public.blob.vercel-storage.com/creative_innovator-rIfasCiKeZxkozSN9C7Tknt644xizC.png",
    empathetic_collaborator:
      "https://0go8j1roigqby3ss.public.blob.vercel-storage.com/empathetic_collaborator-J5wkYOxXjmmdIPMzqtqR9dipBktsf7.png",
    detail_oriented_specialist:
      "https://0go8j1roigqby3ss.public.blob.vercel-storage.com/detail_oriented_specialist-eYetzDXQzlOEatEjzvn3uyxahBCp9L.png",
    adaptable_problem_solver:
      "https://0go8j1roigqby3ss.public.blob.vercel-storage.com/%20adaptable_problem_solver-IA8MfH1p0KoAybAqDw20RolJQPWuh6.png",
  };

  // 対応するVercel Storage画像URLを取得
  const imageUrl = imageUrls[personalityType] || imageUrls.analytical_leader; // デフォルトは知的リーダータイプ

  // 画像URLを設定
  personalityImage.src = imageUrl;
  personalityImage.alt = `${results.personalityData.name}のイラスト`;

  // 適職の表示
  const careerMatchesElement = document.getElementById("career-matches");
  careerMatchesElement.innerHTML = "";

  if (results.careerCategories.length > 0) {
    // 最もマッチする職業カテゴリーを表示
    const topCategory = results.careerCategories[0];
    careerMatchesElement.textContent = topCategory.name;

    // 職業カテゴリーの画像表示は不要

    // 職業の詳細説明
    let careerDescription = `${topCategory.description}<br><br>`;
    careerDescription += "<strong>あなたに向いている職業例：</strong><br>";
    careerDescription += topCategory.jobs.map((job) => `・${job}`).join("<br>");

    // 他のカテゴリーがある場合は追加情報として表示
    if (results.careerCategories.length > 1) {
      careerDescription +=
        "<br><br><strong>その他の適性がある分野：</strong><br>";
      for (let i = 1; i < results.careerCategories.length; i++) {
        careerDescription += `・${results.careerCategories[i].name}<br>`;
      }
    }

    document.getElementById("career-description").innerHTML = careerDescription;
  } else {
    document.getElementById("career-description").textContent =
      "適職カテゴリーが見つかりませんでした。";
  }
};

// 結果データをローカルストレージに保存（オプション）
const saveResults = (contactInfo, results) => {
  const resultData = {
    timestamp: new Date().toISOString(),
    contactInfo,
    results,
  };

  // ローカルストレージに保存
  try {
    const savedResults = JSON.parse(
      localStorage.getItem("personalityResults") || "[]"
    );
    savedResults.push(resultData);
    localStorage.setItem("personalityResults", JSON.stringify(savedResults));
    return true;
  } catch (error) {
    console.error("結果の保存に失敗しました:", error);
    return false;
  }
};
