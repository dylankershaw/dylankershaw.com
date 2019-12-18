window.addEventListener('load', setVh);

function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const asyncTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));

async function trippyScroll() {
  const el = document.getElementsByClassName('main-page')[0];
  const parent = el.parentElement;

  function appendEl(n) {
    if (n === 0) return;
    parent.appendChild(el.cloneNode(true));
    appendEl(n - 1);
  }

  appendEl(40);

  await asyncTimeout(250);

  easyScroll({
    scrollableDomEle: window,
    direction: 'bottom',
    duration: 8000,
    easingPreset: 'easeInOutQuad',
    scrollAmount: document.body.scrollHeight
  });

  await asyncTimeout(8000);

  document.querySelectorAll('.main-page').forEach((el, i) => {
    if (i > 0) el.remove();
  });

  // TODO: land on a new page
}
