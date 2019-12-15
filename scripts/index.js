// TODO: duplicate this el so there's one coming in from the bottom as soon as this one is leaving through the top

function asyncTimeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function trippyScroll() {
  const el = document.getElementsByClassName("main-page")[0];
  const parent = el.parentElement;

  async function moveToBottom() {
    el.style.top = "100vh";
    parent.appendChild(el);
    await asyncTimeout(100); // TODO: replace this with a listener/observer of some kind
  }

  async function slideUpFromBottom(time) {
    await moveToBottom();
    await slideUp(time);
  }

  async function slideUp(time) {
    el.style["transition-duration"] = time + "s";
    el.style.top = "-100vh";
    await asyncTimeout(time * 1000);
    el.remove();
    Promise.resolve();
  }

  await slideUp(5);
  await slideUpFromBottom(10);
  slideUpFromBottom(5);
}
