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
    testsSection: document.getElementById('tests'),
    testsList: document.getElementById('testsList')
  };

  /**
   * 불러온 테스트 목록을 화면에 그리는 함수입니다.
   */
  function renderTestsList() {
    if (!uiElements.testsList) return;
    
    // 기존 목록을 비웁니다.
    uiElements.testsList.innerHTML = '';

    // 각 테스트 데이터를 순회하며 리스트 항목을 만듭니다.
    allTests.forEach((testData) => {
      const listItem = document.createElement('li');
      const testCardLink = document.createElement('a');

      // tests/ 폴더 내의 해당 id를 가진 HTML 파일로 연결합니다.
      testCardLink.href = `./tests/${testData.id}.html`;
      testCardLink.className = 'quiz-card';
      testCardLink.style.textDecoration = 'none';
      testCardLink.style.color = 'inherit';
      testCardLink.style.display = 'block';

      // 아래 클래스 명 test를 quiz로 바꿔.
      testCardLink.innerHTML = `
        <div class="quiz-title">${testData.title || '테스트'}</div>
        <div class="quiz-desc">${testData.desc || ''}</div>
      `;

      listItem.appendChild(testCardLink);
      uiElements.testsList.appendChild(listItem);
    });
  }

  // 처음에 목록을 한번 그려줍니다.
  renderTestsList();
});
