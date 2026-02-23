document.addEventListener('DOMContentLoaded', async function () {
  let tests = [];

  try {
    const response = await fetch('./data/tests.json');
    const data = await response.json();
    tests = data.tests || [];
  } catch (error) {
    console.error('Failed to load tests.json:', error);
  }

  const el = {
    testsSection: document.getElementById('tests'),
    testsList: document.getElementById('testsList')
  };

  function renderTestsList() {
    if (!el.testsList) return;
    el.testsList.innerHTML = '';
    tests.forEach((t) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      // Link to individual HTML files in the tests/ directory
      a.href = `./tests/${t.id}.html`;
      a.className = 'test-card';
      a.style.textDecoration = 'none';
      a.style.color = 'inherit';
      a.style.display = 'block';
      a.innerHTML = `<div class="test-title">${t.title || '테스트'}</div><div class="test-desc">${t.desc || ''}</div>`;
      li.appendChild(a);
      el.testsList.appendChild(li);
    });
  }

  renderTestsList();
});
