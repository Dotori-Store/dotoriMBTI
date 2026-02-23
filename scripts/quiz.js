document.addEventListener('DOMContentLoaded', async function () {
  // Detect testId from URL parameter or filename
  const urlParams = new URLSearchParams(window.location.search);
  let testId = urlParams.get('testId');
  if (!testId) {
    // Fallback: get filename without extension (e.g., mbti_a from /tests/mbti_a.html)
    const pathParts = window.location.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    testId = fileName.replace('.html', '');
  }
  
  const results = {
    // 회식 테스트
    MOOD_MAKER: { title: '분위기 메이커! 🐿️', text: '어디서나 존재감이 확실한 당신! 당신이 없으면 회식 자리가 심심해요.' },
    QUIET_OBSERVER: { title: '조용한 관찰자 🐿️', text: '묵묵히 자리를 지키며 평화를 유지하는 당신! 편안한 분위기를 만드는 일등공신이에요.' },
    PLANNER: { title: '철저한 계획가 🐿️', text: '실수 없는 회식을 만드는 완벽주의자! 당신의 센스 덕분에 모두가 편안합니다.' },
    TASTER: { title: '미식가 다람쥐 🐿️', text: '회식의 주인공은 결국 음식! 맛있는 메뉴와 조합을 아는 진정한 고수입니다.' },
    
    // 여행 테스트
    FREE_SOUL: { title: '자유로운 영혼 🐿️', text: '틀에 박히지 않은 당신! 새로운 장소에서도 금방 적응하는 진정한 여행가예요.' },
    GUIDE_MASTER: { title: '가이드 마스터 🐿️', text: '당신만 믿고 따라가면 실패 없는 여행! 준비성 철저한 든든한 동반자예요.' },
    RELAX_SEEKER: { title: '힐링 추구자 🐿️', text: '여행은 휴식이 최고! 여유로운 일정 속에서 행복을 찾는 타입입니다.' },
    LOCAL_HUNTER: { title: '로컬 탐험가 🐿️', text: '남들이 안 가는 숨은 명소를 찾는 당신! 여행의 깊이를 아는 특별한 다람쥐입니다.' },

    // 주말 테스트
    HOMEBODY: { title: '이불 속 집요정 🐿️', text: '안정적인 집이야말로 최고의 힐링! 내공 있는 휴식을 즐길 줄 아는 당신.' },
    OUTBOUNDER: { title: '에너지 넘치는 외출러 🐿️', text: '주말은 즐기기 위해 있는 법! 알찬 하루를 보내는 열정적인 타입이에요.' },
    HOBBY_COLLECTOR: { title: '취미 수집가 🐿️', text: '새로운 걸 배우고 결과물을 낼 때 행복해요! 생산적인 주말을 보내는 타입입니다.' },
    SOCIAL_BUTTERFLY: { title: '사교계의 나비 🐿️', text: '사람들 사이에서 에너지를 얻는 당신! 당신의 주말은 항상 즐거운 만남으로 가득합니다.' },

    // 공부 테스트
    FOCUS_KING: { title: '집중력 대왕 🐿️', text: '한 번 시작하면 끝을 보는 집중력! 계획대로 착실하게 성과를 내는 타입이에요.' },
    BRAINSTORMER: { title: '아이디어 뱅크 🐿️', text: '창의적인 생각과 유연한 사고! 협력하며 정답을 찾아가는 소통의 왕이에요.' },
    LAST_MINUTER: { title: '벼락치기 천재 🐿️', text: '막판 스퍼트의 힘! 압박 속에서 최고의 효율을 발휘하는 능력자입니다.' },
    CONSISTENT_RUNNER: { title: '꾸준한 거북이 🐿️', text: '기복 없는 성실함이 최고의 무기! 매일의 작은 노력이 큰 성과를 만드는 타입입니다.' }
  };
  let resultImages = {};
  let tests = [];
  let currentTest = null;
  let questions = [];

  let state = { index: 0, answers: [], scores: {} };

  const el = {
    progress: document.getElementById('progress'),
    question: document.getElementById('question'),
    options: document.getElementById('options'),
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

  function updateUrl(qIndex) {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('q', qIndex + 1);
    window.history.pushState({ index: qIndex }, '', newUrl);
  }

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.index !== undefined) {
      state.index = e.state.index;
      renderQuestion(state.index);
      el.quizSection.hidden = false;
      el.completeSection.hidden = true;
      el.resultSection.hidden = true;
    }
  });

  function renderQuestion(i) {
    const item = questions[i];
    if (!item) return;

    el.progress.textContent = `문항 ${i + 1} / ${questions.length}`;
    el.question.textContent = item.q;
    el.options.innerHTML = '';

    item.options.forEach((opt, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.text;
      if (state.answers[i] && JSON.stringify(state.answers[i]) === JSON.stringify(opt.scores)) {
        btn.classList.add('selected');
      } else if (state.answers[i]) {
        btn.classList.add('muted');
      }
      
      btn.addEventListener('click', function () {
        state.answers[i] = opt.scores;
        const btns = el.options.querySelectorAll('button.option-btn');
        btns.forEach(b => { b.classList.remove('selected'); b.classList.add('muted'); });
        btn.classList.remove('muted');
        btn.classList.add('selected');
        if (el.nextBtn) el.nextBtn.disabled = false;

        // Auto-advance with a slight delay
        setTimeout(() => {
          goToNext();
        }, 300);
      });
      li.appendChild(btn);
      el.options.appendChild(li);
    });

    if (el.prevBtn) el.prevBtn.disabled = i === 0;
    if (el.nextBtn) {
      el.nextBtn.textContent = (i === questions.length - 1) ? '결과보기' : '다음';
      el.nextBtn.disabled = state.answers[i] == null;
    }
  }

  function showResult() {
    const agg = {};
    state.answers.forEach(a => {
      if (!a) return;
      for (const k in a) {
        agg[k] = (agg[k] || 0) + a[k];
      }
    });

    const entries = Object.entries(agg);
    if (entries.length === 0) {
      el.resultTitle.textContent = '결과 없음';
      el.resultText.textContent = '아직 선택한 문항이 없어요. 다시 해보세요.';
    } else {
      entries.sort((a, b) => b[1] - a[1]);
      const top = entries[0][0];
      const r = results[top];
      el.resultTitle.textContent = r ? r.title : '결과';
      el.resultText.textContent = r ? r.text : '선호하는 성향을 찾았습니다.';
      
      const imgSrc = resultImages[top];
      if (imgSrc && el.resultImage) {
        // Adjust image path if needed (images should be relative to the root)
        el.resultImage.src = imgSrc.startsWith('.') ? '.' + imgSrc : imgSrc;
        el.resultImage.style.display = '';
      } else if (el.resultImage) {
        el.resultImage.style.display = 'none';
      }
    }
    el.completeSection.hidden = true;
    el.quizSection.hidden = true;
    el.resultSection.hidden = false;
  }

  function goToNext() {
    // If auto-advancing, we might call this even if no answer yet if manually triggered
    if (state.answers[state.index] == null) return;
    if (state.index < questions.length - 1) {
      state.index += 1;
      renderQuestion(state.index);
      updateUrl(state.index);
    } else {
      el.quizSection.hidden = true;
      el.completeSection.hidden = false;
    }
  }

  if (el.prevBtn) {
    el.prevBtn.addEventListener('click', function () {
      if (state.index > 0) {
        state.index -= 1;
        renderQuestion(state.index);
        updateUrl(state.index);
      }
    });
  }

  if (el.nextBtn) {
    el.nextBtn.addEventListener('click', goToNext);
  }

  el.viewResultBtn.addEventListener('click', showResult);
  el.restartBtn.addEventListener('click', () => window.location.reload());

  try {
    const response = await fetch('../data/tests.json');
    const TESTS_DATA = await response.json();
    
    tests = TESTS_DATA.tests || [];
    resultImages = TESTS_DATA.resultImages || {};
    currentTest = tests.find(t => t.id === testId) || tests[0];
    questions = currentTest.questions || [];
    state.answers = Array(questions.length).fill(null);
    
    const qParam = new URLSearchParams(window.location.search).get('q');
    if (qParam) {
      state.index = Math.max(0, Math.min(parseInt(qParam) - 1, questions.length - 1));
    }
    
    renderQuestion(state.index);
  } catch (error) {
    console.error('Failed to load tests.json:', error);
  }
});
