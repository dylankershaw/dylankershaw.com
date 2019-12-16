function trippyScroll() {
  const el = document.getElementsByClassName('main-page')[0];
  const parent = el.parentElement;

  function appendEl(n) {
    if (n === 0) return;
    parent.appendChild(el.cloneNode(true));
    appendEl(n - 1);
  }

  appendEl(50);

  setTimeout(() => {
    easyScroll({
      scrollableDomEle: window,
      direction: 'bottom',
      duration: 10000,
      easingPreset: 'easeInOutQuad',
      scrollAmount: document.body.scrollHeight
    });
  }, 250);
}
