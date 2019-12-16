const asyncTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));

async function trippyScroll() {
  const el = document.getElementsByClassName('main-page')[0];
  const elClone = el.cloneNode(true);
  const parent = el.parentElement;

  async function handleEl() {
    el.classList.remove('main-page--center');
    console.log('sending up el');
    await asyncTimeout(5000);
    swipeUp(el, 5000);
  }

  async function handleElClone() {
    elClone.classList.add('main-page--222');
    elClone.classList.add('main-page--below');
    elClone.classList.remove('main-page--center');
    parent.appendChild(elClone);

    await asyncTimeout(10);
    elClone.classList.remove('main-page--below');
  }

  handleEl();
  // handleElClone();
}

async function swipeUp(el, ms) {
  if (ms <= 10) return;
  el.classList.add('main-page--below');
  el.style.transitionDuration = ms / 1000 + 's';
  await asyncTimeout(10);
  el.classList.remove('main-page--below');
  await asyncTimeout(ms);
  swipeUp(el, ms / 1.5);
}
