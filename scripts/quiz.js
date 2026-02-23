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
  
  // 성향별 결과 제목과 상세 본문을 정의합니다.
  const resultDescriptions = {
    // 회식 테스트 결과
    MOOD_MAKER: { title: '분위기 메이커! 🐿️', text: '어디서나 존재감이 확실한 당신! 당신이 없으면 회식 자리가 심심해요.' },
    QUIET_OBSERVER: { title: '조용한 관찰자 🐿️', text: '묵묵히 자리를 지키며 평화를 유지하는 당신! 편안한 분위기를 만드는 일등공신이에요.' },
    PLANNER: { title: '철저한 계획가 🐿️', text: '실수 없는 회식을 만드는 완벽주의자! 당신의 센스 덕분에 모두가 편안합니다.' },
    TASTER: { title: '미식가 다람쥐 🐿️', text: '회식의 주인공은 결국 음식! 맛있는 메뉴와 조합을 아는 진정한 고수입니다.' },
    
    // 여행 테스트 결과
    FREE_SOUL: { title: '자유로운 영혼 🐿️', text: '틀에 박히지 않은 당신! 새로운 장소에서도 금방 적응하는 진정한 여행가예요.' },
    GUIDE_MASTER: { title: '가이드 마스터 🐿️', text: '당신만 믿고 따라가면 실패 없는 여행! 준비성 철저한 든든한 동반자예요.' },
    RELAX_SEEKER: { title: '힐링 추구자 🐿️', text: '여행은 휴식이 최고! 여유로운 일정 속에서 행복을 찾는 타입입니다.' },
    LOCAL_HUNTER: { title: '로컬 탐험가 🐿️', text: '남들이 안 가는 숨은 명소를 찾는 당신! 여행의 깊이를 아는 특별한 다람쥐입니다.' },

    // 주말 테스트 결과
    HOMEBODY: { title: '이불 속 집요정 🐿️', text: '안정적인 집이야말로 최고의 힐링! 내공 있는 휴식을 즐길 줄 아는 당신.' },
    OUTBOUNDER: { title: '에너지 넘치는 외출러 🐿️', text: '주말은 즐기기 위해 있는 법! 알찬 하루를 보내는 열정적인 타입이에요.' },
    HOBBY_COLLECTOR: { title: '취미 수집가 🐿️', text: '새로운 걸 배우고 결과물을 낼 때 행복해요! 생산적인 주말을 보내는 타입입니다.' },
    SOCIAL_BUTTERFLY: { title: '사교계의 나비 🐿️', text: '사람들 사이에서 에너지를 얻는 당신! 당신의 주말은 항상 즐거운 만남으로 가득합니다.' },

    // 공부 테스트 결과
    FOCUS_KING: { title: '집중력 대왕 🐿️', text: '한 번 시작하면 끝을 보는 집중력! 계획대로 착실하게 성과를 내는 타입이에요.' },
    BRAINSTORMER: { title: '아이디어 뱅크 🐿️', text: '창의적인 생각과 유연한 사고! 협력하며 정답을 찾아가는 소통의 왕이에요.' },
    LAST_MINUTER: { title: '벼락치기 천재 🐿️', text: '막판 스퍼트의 힘! 압박 속에서 최고의 효율을 발휘하는 능력자입니다.' },
    CONSISTENT_RUNNER: { title: '꾸준한 거북이 🐿️', text: '기복 없는 성실함이 최고의 무기! 매일의 작은 노력이 큰 성과를 만드는 타입입니다.' }
  };

  let allResultImages = {};
  let allTestsData = [];
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

  // JSON 데이터를 불러와서 퀴즈를 시작합니다.
  try {
    const response = await fetch('../data/tests.json');
    const TESTS_DATA = await response.json();
    
    allTestsData = TESTS_DATA.tests || [];
    allResultImages = TESTS_DATA.resultImages || {};
    
    // 현재 ID와 일치하는 테스트를 찾거나 없으면 첫 번째 것을 선택합니다.
    currentTestObject = allTestsData.find(test => test.id === currentTestId) || allTestsData[0];
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
    console.error('데이터를 불러오지 못했습니다 (tests.json):', error);
  }
});
