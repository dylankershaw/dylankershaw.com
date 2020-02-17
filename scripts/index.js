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
  input.focus();
}

function closeKeyboardOnMobile() {
  if (event.key === 'Enter') event.target.blur();
}

function handleKeyDown(key) {
  const input = document.getElementsByClassName('main-page__command-line-input')[0];

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
      const inputIsValid = input.innerText.length <= 32 && key.length === 1 && key.match(/\w/g);

      if (inputIsValid) input.innerText += key.toLowerCase();
  }
}

function greenTextSpan(text) {
  return `<span class='main-page__command-line-response--green-text'>${text}</span>`;
}

async function handleSubmit(command) {
  const responseEl = document.getElementsByClassName('main-page__command-line-response')[0];

  switch (command) {
    case '':
      responseEl.innerText = '';
      break;
    case 'linkedin':
      window.open('https://www.linkedin.com/in/dylankershaw/', '_blank');
      break;
    case 'github':
      window.open('https://github.com/dylankershaw/', '_blank');
      break;
    case 'help':
      responseEl.innerHTML = `
      <span>Here are some commands to try:</span>
      <div>${greenTextSpan('linkedin')}</div>
      <div>${greenTextSpan('github')}</div>
      <div>${greenTextSpan('scroll')}</div>
      `;
      break;
    case 'scroll':
      trippyScroll();
      break;
    default:
      responseEl.innerHTML = command + `: command not found. Try entering ${greenTextSpan('help')}.`;
  }

  trackInputSubmit(command);
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

  window.scrollTo(0, 0);

  document.querySelectorAll('.main-page').forEach((el, i) => {
    if (i > 0) el.remove();
  });
}

function trackInputSubmit(value) {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Input',
    eventAction: 'submit',
    eventLabel: value
  });
}
