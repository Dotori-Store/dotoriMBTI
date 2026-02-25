document.addEventListener('DOMContentLoaded', async function () {
  // URL 파라미터나 파일명에서 현재 테스트의 ID를 찾아냅니다.
  const urlParameters = new URLSearchParams(window.location.search);
  let currentTestId = urlParameters.get('testId');
  if (!currentTestId) {
    // 예: /tests/mbti_a.html 에서 'mbti_a'만 추출합니다.
    const pathParts = window.location.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    currentTestId = fileName.replace('.html', '');
  }
  
  let resultDescriptions = {};
  let allResultImages = {};
  let currentTestObject = null;
  let testQuestions = [];

  // 현재 테스트의 진행 상태를 담는 객체입니다.
  let gameState = { 
    currentQuestionIndex: 0, 
    userAnswers: [], 
    totalScores: {} 
  };

  // 화면의 주요 요소들을 미리 변수에 담아둡니다.
  const uiElements = {
    progress: document.getElementById('progress'),
    question: document.getElementById('question'),
    optionsList: document.getElementById('options'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    quizSection: document.getElementById('quiz'),
    completeSection: document.getElementById('complete'),
    resultSection: document.getElementById('result'),
    resultTitle: document.getElementById('resultTitle'),
    resultText: document.getElementById('resultText'),
    resultImage: document.getElementById('resultImage'),
    viewResultBtn: document.getElementById('viewResultBtn'),
    restartBtn: document.getElementById('restartBtn')
  };

  /**
   * 브라우저 URL의 질문 번호를 업데이트합니다.
   */
  function updateUrlWithQuestion(questionNumber) {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('q', questionNumber + 1);
    window.history.pushState({ index: questionNumber }, '', newUrl);
  }

  // 브라우저 뒤로가기 버튼 처리
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.index !== undefined) {
      gameState.currentQuestionIndex = event.state.index;
      renderQuestion(gameState.currentQuestionIndex);
      uiElements.quizSection.hidden = false;
      uiElements.completeSection.hidden = true;
      uiElements.resultSection.hidden = true;
    }
  });

  /**
   * 지정된 인덱스의 질문을 화면에 렌더링합니다.
   */
  function renderQuestion(index) {
    const currentQuestion = testQuestions[index];
    if (!currentQuestion) return;

    // 진행률 표시
    uiElements.progress.textContent = `문항 ${index + 1} / ${testQuestions.length}`;
    uiElements.question.textContent = currentQuestion.q;
    uiElements.optionsList.innerHTML = '';

    // 선택지 버튼들을 만듭니다.
    currentQuestion.options.forEach((optionData) => {
      const listItem = document.createElement('li');
      const optionButton = document.createElement('button');
      optionButton.className = 'option-btn';
      optionButton.textContent = optionData.text;

      // 이미 선택했던 답변인지 확인하여 스타일을 적용합니다.
      const isAlreadySelected = gameState.userAnswers[index] && 
                               JSON.stringify(gameState.userAnswers[index]) === JSON.stringify(optionData.scores);
      
      if (isAlreadySelected) {
        optionButton.classList.add('selected');
      } else if (gameState.userAnswers[index]) {
        optionButton.classList.add('muted');
      }
      
      // 선택지 클릭 이벤트
      optionButton.addEventListener('click', function () {
        gameState.userAnswers[index] = optionData.scores;
        
        // 버튼 스타일 업데이트
        const allButtons = uiElements.optionsList.querySelectorAll('button.option-btn');
        allButtons.forEach(btn => { 
          btn.classList.remove('selected'); 
          btn.classList.add('muted'); 
        });
        optionButton.classList.remove('muted');
        optionButton.classList.add('selected');

        if (uiElements.nextBtn) uiElements.nextBtn.disabled = false;

        // 약간의 지연 후 자동으로 다음 문항으로 넘어갑니다.
        setTimeout(() => {
          goToNextStep();
        }, 300);
      });

      listItem.appendChild(optionButton);
      uiElements.optionsList.appendChild(listItem);
    });

    // 이전/다음 버튼 상태 제어
    if (uiElements.prevBtn) uiElements.prevBtn.disabled = index === 0;
    if (uiElements.nextBtn) {
      uiElements.nextBtn.textContent = (index === testQuestions.length - 1) ? '결과보기' : '다음';
      uiElements.nextBtn.disabled = gameState.userAnswers[index] == null;
    }
  }

  /**
   * 모든 답변을 합산하여 최종 결과를 계산하고 화면에 보여줍니다.
   */
  function calculateAndShowResult() {
    const scoreSum = {};
    
    // 1. 모든 답변의 점수를 합산합니다.
    gameState.userAnswers.forEach(answerScores => {
      if (!answerScores) return;
      for (const personalityKey in answerScores) {
        scoreSum[personalityKey] = (scoreSum[personalityKey] || 0) + answerScores[personalityKey];
      }
    });

    const scoreEntries = Object.entries(scoreSum);
    
    if (scoreEntries.length === 0) {
      uiElements.resultTitle.textContent = '결과 없음';
      uiElements.resultText.textContent = '아직 선택한 문항이 없어요. 다시 해보세요.';
    } else {
      // 2. 가장 높은 점수를 받은 성향을 찾습니다.
      scoreEntries.sort((a, b) => b[1] - a[1]);
      const winningPersonality = scoreEntries[0][0];
      const resultData = resultDescriptions[winningPersonality];
      
      uiElements.resultTitle.innerHTML = resultData ? resultData.title : '결과';
      uiElements.resultText.innerHTML = resultData ? resultData.text : '선호하는 성향을 찾았습니다.';
      
      // 3. 사진을 매칭합니다.
      const imageSource = allResultImages[winningPersonality];
      if (imageSource && uiElements.resultImage) {
        uiElements.resultImage.src = imageSource.startsWith('.') ? '.' + imageSource : imageSource;
        uiElements.resultImage.style.display = '';
      } else if (uiElements.resultImage) {
        uiElements.resultImage.style.display = 'none';
      }
    }

    // 결과 화면 전환
    uiElements.completeSection.hidden = true;
    uiElements.quizSection.hidden = true;
    uiElements.resultSection.hidden = false;
  }

  /**
   * 다음 질문으로 가거나 완료 화면으로 넘어갑니다.
   */
  function goToNextStep() {
    if (gameState.userAnswers[gameState.currentQuestionIndex] == null) return;
    
    if (gameState.currentQuestionIndex < testQuestions.length - 1) {
      gameState.currentQuestionIndex += 1;
      renderQuestion(gameState.currentQuestionIndex);
      updateUrlWithQuestion(gameState.currentQuestionIndex);
    } else {
      uiElements.quizSection.hidden = true;
      uiElements.completeSection.hidden = false;
    }
  }

  // 이벤트 리스너 연결
  if (uiElements.prevBtn) {
    uiElements.prevBtn.addEventListener('click', function () {
      if (gameState.currentQuestionIndex > 0) {
        gameState.currentQuestionIndex -= 1;
        renderQuestion(gameState.currentQuestionIndex);
        updateUrlWithQuestion(gameState.currentQuestionIndex);
      }
    });
  }

  if (uiElements.nextBtn) {
    uiElements.nextBtn.addEventListener('click', goToNextStep);
  }

  uiElements.viewResultBtn.addEventListener('click', calculateAndShowResult);
  uiElements.restartBtn.addEventListener('click', () => window.location.reload());

  // 데이터를 불러와서 퀴즈를 시작합니다.
  try {
    // 1. 공통 결과 설정 로드 (이미지, 설명)
    const configResponse = await fetch('../data/result_config.json');
    const configData = await configResponse.json();
    allResultImages = configData.resultImages || {};
    resultDescriptions = configData.resultDescriptions || {};

    // 2. 현재 테스트 문항 데이터 로드
    const testResponse = await fetch(`../data/tests/${currentTestId}.json`);
    currentTestObject = await testResponse.json();
    
    testQuestions = currentTestObject.questions || [];
    gameState.userAnswers = Array(testQuestions.length).fill(null);
    
    // URL에 질문 번호(q)가 있다면 해당 번호부터 시작합니다.
    const questionParam = new URLSearchParams(window.location.search).get('q');
    if (questionParam) {
      const startIndex = parseInt(questionParam) - 1;
      gameState.currentQuestionIndex = Math.max(0, Math.min(startIndex, testQuestions.length - 1));
    }
    
    // 첫 번째 질문 렌더링
    renderQuestion(gameState.currentQuestionIndex);
  } catch (error) {
    console.error('데이터를 불러오지 못했습니다:', error);
  }

});
