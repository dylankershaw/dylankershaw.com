window.addEventListener('load', setVh);
document.addEventListener('keydown', () => handleKeyDown(event.key));
document.addEventListener('click', triggerKeyboardOnMobile);

function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const asyncTimeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      const inputIsValid = input.innerText.length <= 32 && key.length === 1 && key.match(/[\w.]/g);
      if (inputIsValid) input.innerText += key.toLowerCase();
  }
}

function suggestion(text, inline = false) {
  const elType = inline ? 'span' : 'div';
  return `<${elType} class='main-page__command-line-response--suggestion'>${text}</${elType}>`;
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
      ${suggestion('github')}
      ${suggestion('linkedin')}
      ${suggestion('lava')}
      ${suggestion('scroll')}
      ${suggestion('link.random')}
      `;
      break;
    case 'scroll':
      trippyScroll();
      break;
    case 'link.random':
      // TODO: put these into a JSON file
      const links = [
        'http://www.overcomingbias.com/2020/01/how-bees-argue.html',
        'https://en.wikipedia.org/wiki/Nominative_determinism',
        'http://edition.cnn.com/EVENTS/1996/year.in.review',
        'https://evrone.com/yukihiro-matsumoto-interview',
        'https://en.wikipedia.org/wiki/Pantone_448_C',
        'https://insidemymind.me/2020/01/28/today-i-learned-that-not-everyone-has-an-internal-monologue-and-it-has-ruined-my-day',
        'https://waitbutwhy.com/2014/12/what-makes-you-you.html',
        'https://waitbutwhy.com/2014/05/fermi-paradox.html',
        'https://www.tesla.com/sites/default/files/images/careers/autopilot/network.mp4',
        'http://www.simonweckert.com/googlemapshacks.html',
        'https://github.com/fpereiro/backendlore',
        'https://github.com/Swizec/thaw-carrots',
        'https://github.com/kkuchta/css-only-chat',
        'https://github.com/hakluke/how-to-exit-vim',
        'https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/',
        'http://paulgraham.com/genius.html',
        'https://en.wikipedia.org/wiki/Sound-powered_telephone',
        'https://en.wikipedia.org/wiki/Bus_factor',
        'https://blog.repl.it/clui',
        'https://www.gkogan.co/blog/simple-systems/',
        'https://en.wikipedia.org/wiki/Category:Obsolete_occupations',
        'https://en.wikipedia.org/wiki/Timeline_of_the_far_future',
      ];

      const linkToOpen = links[Math.floor(Math.random() * links.length)];
      window.open(linkToOpen, '_blank');
      break;
    case 'lava':
      document.documentElement.classList.add('lava');
      break;
    case 'pulsar':
      plotPulsar();
      break;
    default:
      responseEl.innerHTML =
        command + `: command not found. Try entering ${suggestion('help', true)}.`;
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
    scrollAmount: document.body.scrollHeight,
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
    eventLabel: value,
  });
}

function plotPulsar() {
  const height = 200;
  const width = 200;
  const svg = d3.select('.pulsar-container').append('svg').attr('viewBox', [0, 0, width, height]);
  const margin = {top: 10, right: 10, bottom: 100, left: 10};
  const data = loadJson('../pulsarData.json');
  const overlap = 10; // TODO: this will be changed with one axis

  const y = d3
    .scalePoint()
    .domain(data.map((d, i) => i))
    .range([margin.top, height - margin.bottom]);
  const x = d3
    .scaleLinear()
    .domain([0, data[0].length - 1])
    .range([margin.left, width - margin.right]);
  const z = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d3.min(d)), d3.max(data, (d) => d3.max(d))])
    .range([0, -overlap * y.step()]);
  const area = d3
    .area()
    .defined((d) => !isNaN(d))
    .x((d, i) => x(i))
    .y0(0)
    .y1(z);
  const line = area.lineY1();
  const serie = svg
    .append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('transform', (d, i) => `translate(0,${y(i) + 1})`);

  serie.append('path').attr('fill', '#fff').attr('d', area);
  serie.append('path').attr('fill', 'none').attr('stroke', 'black').attr('d', line);
}

function loadJson(filePath) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', filePath, false);
  xmlhttp.overrideMimeType('application/json');
  xmlhttp.send();
  return JSON.parse(xmlhttp.responseText);
}
