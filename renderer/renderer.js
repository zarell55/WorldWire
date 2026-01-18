const tabsEl = document.getElementById('tabs');
const urlbar = document.getElementById('urlbar');
const engine = document.getElementById('engine');

let tabCount = 0;

function addTab() {
  const tab = document.createElement('div');
  const index = tabCount++;

  tab.className = 'tab';
  tab.textContent = `Tab ${index + 1}`;

  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    browser.switchTab(index);
  };

  tabsEl.appendChild(tab);
  tab.click();
}

document.getElementById('newtab').onclick = () => {
  browser.newTab();
  addTab();
};

document.getElementById('back').onclick = () => browser.back();
document.getElementById('forward').onclick = () => browser.forward();
document.getElementById('reload').onclick = () => browser.reload();

urlbar.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    browser.navigate(urlbar.value, engine.value);
  }
});

document.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    const href = e.target.getAttribute('href');
    if (href?.startsWith('about:')) {
      e.preventDefault();
      browser.navigate(href, engine.value);
    }
  }
});

addTab();
