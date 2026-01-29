// MBTI 퀴즈 로직 (싱글-페이지, 질문 확장 용이)
document.addEventListener('DOMContentLoaded', function () {
  // tests 데이터는 외부 JSON으로 분리되어 있습니다.
  let tests = [];
  let questions = [];
  const results = {
    INTJ: { title: '생각하는 리더 (INTJ)', text: '계획을 잘 세우고 혼자서도 침착하게 문제를 푸는 타입이야.' },
    INTP: { title: '호기심 많은 탐구자 (INTP)', text: '궁금한 게 많고 혼자 생각하는 걸 좋아하는 편이야.' },
    ENTJ: { title: '결단력 있는 친구 (ENTJ)', text: '팀에서 리더 역할을 잘하고 똑똑하게 이끄는 타입이야.' },
    ENTP: { title: '아이디어 왕 (ENTP)', text: '새로운 생각을 많이 내고 토론하는 걸 좋아해.' },
    INFJ: { title: '마음이 따뜻한 친구 (INFJ)', text: '다른 사람의 마음을 잘 이해하고 도와주려 해.' },
    INFP: { title: '상상력이 풍부한 친구 (INFP)', text: '자기만의 가치와 상상으로 행동하는 걸 좋아해.' },
    ENFJ: { title: '사람을 챙기는 친구 (ENFJ)', text: '다른 친구들을 잘 챙기고 분위기를 만드는 걸 잘해.' },
    ENFP: { title: '활발하고 웃긴 친구 (ENFP)', text: '친구들 사이에서 활발하고 재미있는 걸 좋아해.' },
    ISTJ: { title: '성실한 친구 (ISTJ)', text: '약속을 잘 지키고 숙제나 규칙을 중요하게 생각해.' },
    ISFJ: { title: '도와주는 친구 (ISFJ)', text: '친구를 도와주고 주변을 잘 챙기는 타입이야.' },
    ESTJ: { title: '정리 잘하는 친구 (ESTJ)', text: '일을 나눠서 정리하고 실천하는 걸 잘해.' },
    ESFJ: { title: '사교적인 친구 (ESFJ)', text: '친구들과 함께하는 걸 좋아하고 분위기를 잘 맞춰.' },
    ISTP: { title: '문제 해결사 (ISTP)', text: '도구 쓰는 걸 잘하고 상황에 맞게 행동해.' },
    ISFP: { title: '따뜻한 감성의 친구 (ISFP)', text: '느긋하고 예민한 감성을 가진 친구야.' },
    ESTP: { title: '모험을 좋아하는 친구 (ESTP)', text: '액티브하고 즉흥적인 놀이를 즐기는 타입이야.' },
    ESFP: { title: '모두의 즐거운 친구 (ESFP)', text: '주변을 즐겁게 하고 분위기를 띄우는 걸 잘해.' }
  };
  let resultImages = {};

  let state = { index: 0, answers: [], scores: {} };

  const el = {
    progress: document.getElementById('progress'),
    question: document.getElementById('question'),
    options: document.getElementById('options'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    resultSection: document.getElementById('result'),
    quizSection: document.getElementById('quiz'),
    testsSection: document.getElementById('tests'),
    testsList: document.getElementById('testsList'),
    resultTitle: document.getElementById('resultTitle'),
    resultText: document.getElementById('resultText'),
    restartBtn: document.getElementById('restartBtn')
    ,resultImage: document.getElementById('resultImage')
  };

  // 홈 버튼들 (퀴즈/완료/결과 화면에서 모두 첫화면으로 이동)
  const homeBtn = document.getElementById('homeBtn');
  const homeBtnComplete = document.getElementById('homeBtnComplete');
  const homeBtnResult = document.getElementById('homeBtnResult');
  function goHome() {
    // reset UI to tests list
    el.testsSection.hidden = false;
    el.quizSection.hidden = true;
    el.resultSection.hidden = true;
    const completeEl = document.getElementById('complete');
    if (completeEl) completeEl.hidden = true;
    state = { index: 0, answers: [], scores: {} };
    renderTestsList();
  }
  if (homeBtn) homeBtn.addEventListener('click', goHome);
  if (homeBtnComplete) homeBtnComplete.addEventListener('click', goHome);
  if (homeBtnResult) homeBtnResult.addEventListener('click', goHome);

  function renderQuestion(i) {
    try {
      if (!questions || questions.length === 0) {
        console.warn('renderQuestion: no questions loaded');
        el.question.textContent = '질문이 없어요.';
        el.options.innerHTML = '';
        el.nextBtn.disabled = true;
        return;
      }
    } catch (err) {
      console.error('renderQuestion init error', err);
    }
    const item = questions[i];
    if (!item) {
      console.error('renderQuestion: item is undefined for index', i);
      return;
    }
    el.progress.textContent = `문항 ${i + 1} / ${questions.length}`;
    el.question.textContent = item.q;
    el.options.innerHTML = '';

    item.options.forEach((opt, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.text;
      btn.style.display = 'block';
      btn.style.marginBottom = '0.5rem';
      btn.addEventListener('click', function () {
        state.answers[i] = opt.scores;
        const btns = el.options.querySelectorAll('button.option-btn');
        btns.forEach(b => { b.classList.remove('selected'); b.classList.add('muted'); });
        btn.classList.remove('muted');
        btn.classList.add('selected');
        el.nextBtn.disabled = false;
      });
      li.appendChild(btn);
      el.options.appendChild(li);
    });

    el.prevBtn.disabled = i === 0;
    el.nextBtn.textContent = '다음';
    el.nextBtn.disabled = state.answers[i] == null;

    // restore visual selection if previously answered
    if (state.answers[i] != null) {
      const btns = el.options.querySelectorAll('button.option-btn');
      btns.forEach((b, idx2) => {
        const optScores = item.options[idx2].scores;
        // shallow compare by JSON string (scores object instances from JSON compare equal by content)
        if (JSON.stringify(state.answers[i]) === JSON.stringify(optScores)) {
          b.classList.add('selected');
          b.classList.remove('muted');
        } else {
          b.classList.remove('selected');
          b.classList.add('muted');
        }
      });
    } else {
      const btns = el.options.querySelectorAll('button.option-btn');
      btns.forEach(b => { b.classList.remove('selected'); b.classList.remove('muted'); });
    }
  }

  function renderTestsList() {
    if (!el.testsList) return;
    console.log('renderTestsList called, tests.length:', tests.length);
    el.testsList.innerHTML = '';
    tests.forEach((t, ti) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'test-card';
      btn.innerHTML = `<div class="test-title">${t.title || '테스트'}</div><div class="test-desc">${t.desc || ''}</div>`;
      btn.addEventListener('click', () => {
        console.log('test clicked', ti, t.id);
        loadTest(ti);
      });
      li.appendChild(btn);
      el.testsList.appendChild(li);
    });
    console.log('renderTestsList: buttons created, count:', el.testsList.children.length);
    if (el.testsSection) {
      console.log('setting visibility: tests=visible, quiz=hidden, result=hidden');
      el.testsSection.hidden = false;
      el.quizSection.hidden = true;
      el.resultSection.hidden = true;
      const completeEl = document.getElementById('complete');
      if (completeEl) completeEl.hidden = true;
    }
  }

  function loadTest(testIndex) {
    console.log('loadTest called', testIndex, tests[testIndex]);
    questions = tests[testIndex].questions || [];
    console.log('questions loaded, count:', questions.length);
    console.log('questions:', questions);
    if (!questions || questions.length === 0) {
      alert('선택한 테스트에 질문이 없어요.');
      return;
    }
    state = { index: 0, answers: Array(questions.length).fill(null), scores: {} };
    console.log('state reset');
    if (el.testsSection) el.testsSection.hidden = true;
    console.log('testsSection hidden');
    el.quizSection.hidden = false;
    console.log('quizSection visible, el.quizSection:', el.quizSection);
    el.resultSection.hidden = true;
    const completeEl = document.getElementById('complete');
    if (completeEl) completeEl.hidden = true;
    console.log('about to call renderQuestion(0)');
    renderQuestion(0);
    console.log('renderQuestion(0) completed');
  }

  el.prevBtn.addEventListener('click', function () {
    if (state.index > 0) {
      state.index -= 1;
      renderQuestion(state.index);
    }
  });

  el.nextBtn.addEventListener('click', function () {
    if (state.answers[state.index] == null) {
      alert('먼저 답을 골라 주세요.');
      return;
    }
    if (state.index < questions.length - 1) {
      state.index += 1;
      renderQuestion(state.index);
    } else {
      const completeEl = document.getElementById('complete');
      if (completeEl) completeEl.hidden = false;
      el.quizSection.hidden = true;
    }
  });

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
      // show image if available
      try {
        const imgSrc = resultImages[top];
        if (imgSrc && el.resultImage) {
          el.resultImage.src = imgSrc;
          el.resultImage.style.display = '';
          el.resultImage.alt = r ? r.title : '결과 이미지';
        } else if (el.resultImage) {
          el.resultImage.style.display = 'none';
          el.resultImage.src = '';
        }
      } catch (e) {
        console.warn('failed to set result image', e);
      }
    }
    const completeEl = document.getElementById('complete');
    if (completeEl) completeEl.hidden = true;
    el.resultSection.hidden = false;
  }

  el.restartBtn.addEventListener('click', function () {
    state = { index: 0, answers: Array(questions.length).fill(null), scores: {} };
    el.resultSection.hidden = true;
    const completeEl = document.getElementById('complete');
    if (completeEl) completeEl.hidden = true;
    el.quizSection.hidden = false;
    renderQuestion(0);
  });

  const viewResultBtn = document.getElementById('viewResultBtn');
  if (viewResultBtn) {
    viewResultBtn.addEventListener('click', function () {
      showResult();
    });
  }

  // load tests JSON then render start screen
  fetch('./data/tests.json')
    .then(res => res.ok ? res.json() : Promise.reject('failed to load tests.json'))
    .then(data => {
      console.log('tests.json loaded successfully', data);
      tests = data.tests || [];
      resultImages = data.resultImages || {};
      console.log('tests array set, count:', tests.length);
      renderTestsList();
    })
    .catch(err => {
      console.error('tests load error', err);
      console.error('fetch failed, tests will be empty');
      // fallback: show empty list
      tests = [];
      renderTestsList();
    });
});
