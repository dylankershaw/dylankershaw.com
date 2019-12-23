window.addEventListener('load', setVh);
document.addEventListener('keydown', () => handleKeyDown(event.key));
document.addEventListener('click', triggerKeyboardOnMobile);

function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const asyncTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));

function triggerKeyboardOnMobile() {
  const input = document.getElementsByClassName('main-page__dummy-input')[0];
  if (event.target.tagName !== 'A') input.focus();
  window.scrollTo(0, document.body.scrollHeight);
}

function closeKeyboardOnMobile() {
  if (event.key === 'Enter') event.target.blur();
}

function handleKeyDown(key) {
  const input = document.getElementsByClassName(
    'main-page__command-line-input'
  )[0];

  switch (key) {
    case 'Backspace':
      input.innerText = input.innerText.slice(0, input.innerText.length - 1);
      break;
    case 'Enter':
      const command = input.innerText;
      input.innerText = '';
      handleSubmit(command);
      break;
    default:
      const inputIsValid =
        input.innerText.length <= 32 && key.length === 1 && key.match(/\w/g);

      if (inputIsValid) input.innerText += key.toLowerCase();
  }
}

function handleSubmit(command) {
  const responseEl = document.getElementsByClassName(
    'main-page__command-line-response'
  )[0];

  responseEl.innerText = '';

  switch (command) {
    case '':
      break;
    case 'help':
      responseEl.innerText = 'Here are some commands to try:\nscroll';
      break;
    case 'scroll':
      trippyScroll();
      break;
    default:
      responseEl.innerText =
        command + ": command not found. Try entering 'help'.";
  }
}

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
}
