document.addEventListener('DOMContentLoaded', async function () {
  let allTests = [];

  // JSON 파일에서 테스트 목록 데이터를 불러옵니다.
  try {
    const response = await fetch('./data/tests_meta.json');
    const data = await response.json();
    allTests = data || [];
  } catch (error) {
    console.error('테스트 데이터를 불러오는 데 실패했습니다 (tests_meta.json):', error);
  }

  // 화면의 주요 요소(DOM)들을 미리 찾아둡니다.
  const uiElements = {
    recommendedList: document.getElementById('recommendedList'),
    testsList: document.getElementById('testsList'),
    swiperContainer: document.querySelector('.swiper')
  };

  /**
   * 불러온 테스트 목록을 화면에 그리는 함수입니다.
   */
  function renderTestsList() {
    // 추천 테스트와 일반 테스트를 분리합니다.
    const recommendedTests = allTests.filter(test => test.recommended === true);
    
    // 렌더링 헬퍼 함수
    const createTestItem = (testData, className = '') => {
      const listItem = document.createElement('li');
      if (className) listItem.className = className;
      const testCardLink = document.createElement('a');

      testCardLink.href = `./tests/${testData.id}.html`;
      testCardLink.className = 'quiz-card';

      testCardLink.innerHTML = `
        <div class="quiz-thumb">
          <img src="${testData.thumbnail || ''}" alt="${testData.title || ''}">
        </div>
        <div class="quiz-title">${testData.title || '테스트'}</div>
        <div class="quiz-desc">${testData.desc || ''}</div>`;

      listItem.appendChild(testCardLink);
      return listItem;
    };

    // 1. 추천 테스트 렌더링
    if (uiElements.recommendedList) {
      // id="recommendedList" 자체가 swiper-wrapper일 수 있으므로 확인합니다.
      const isWrapper = uiElements.recommendedList.classList.contains('swiper-wrapper');
      const wrapperElement = isWrapper ? uiElements.recommendedList : uiElements.recommendedList.querySelector('.swiper-wrapper');
      const targetElement = wrapperElement || uiElements.recommendedList;
      
      targetElement.innerHTML = '';
      
      recommendedTests.forEach(testData => {
        // 추천 리스트 li에 'swiper-slide' 클래스를 붙여 Swiper가 인식할 수 있게 합니다.
        targetElement.appendChild(createTestItem(testData, 'swiper-slide'));
      });
    };

    // 2. 일반 테스트 렌더링 (추천 테스트 제외)
    if (uiElements.testsList) {
      uiElements.testsList.innerHTML = '';
      const regularTests = allTests.filter(test => test.recommended !== true);
      regularTests.forEach(testData => {
        uiElements.testsList.appendChild(createTestItem(testData));
      });
    }
  }

  // 처음에 목록을 한번 그려줍니다.
  renderTestsList();

  // 렌더링이 완료된 후 Swiper를 초기화합니다 (동적 로딩 시 발생하는 NaN 문제를 방지합니다).
  if (uiElements.swiperContainer) {
    new Swiper('.swiper', {
      slidesPerView: 1.3,
      centeredSlides: true,
      loop: true,
      speed: 900,
      spaceBetween: 20,
      watchSlidesProgress: true,
      navigation: {
        nextEl: '#swiper-next',
        prevEl: '#swiper-prev',
      },
    });
  }
});
