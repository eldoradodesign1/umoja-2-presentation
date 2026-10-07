const loginView = document.querySelector('#loginView');
const deckView = document.querySelector('#deckView');
const modal = document.querySelector('#passwordModal');
const passwordInput = document.querySelector('#passwordInput');
const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');
const modalTitle = document.querySelector('#modalTitle');
const modalKicker = document.querySelector('#modalKicker');
const slidesRoot = document.querySelector('#slides');
const navDots = document.querySelector('#navDots');
const previousButton = document.querySelector('#previousButton');
const nextButton = document.querySelector('#nextButton');
const chapterLabel = document.querySelector('#chapterLabel');
const audienceLabel = document.querySelector('#audienceLabel');
const progressFill = document.querySelector('#progressFill');
const chapterMenu = document.querySelector('#chapterMenu');
const menuButton = document.querySelector('#menuButton');
const loadingOverlay = document.querySelector('#loadingOverlay');

const profileNames = {
  vodacom: 'VODACOM',
  brothers: 'LES FRÈRES',
  btl: 'BTL AFRICA',
};

let selectedProfile = null;
let deck = null;
let currentIndex = 0;
let isMoving = false;
let touchStartY = 0;

const fallbackImage = '/assets/community.jpg';

function image(src, alt = '') {
  return `<img src="${src}" alt="${alt}" loading="eager" onerror="this.src='${fallbackImage}'">`;
}

function header(chapter, light = false) {
  return `<span class="slide-index">${chapter.index}</span><div class="slide-inner ${light ? 'slide-light' : ''}">`;
}

function chapterBase(chapter, light = false) {
  return `<p class="eyebrow reveal" style="--delay:.06s">${chapter.eyebrow}</p><h2 class="chapter-title reveal" style="--delay:.16s">${chapter.title}</h2>`;
}

function renderCover(chapter) {
  return `<article class="slide slide-dark cover-slide">
    <div class="cover-media image-reveal">${image(chapter.image, 'Moment UMOJA')}</div>
    ${header(chapter)}
      ${chapterBase(chapter)}
      <p class="chapter-copy reveal" style="--delay:.29s">${chapter.text}</p>
      <div class="cover-tag reveal" style="--delay:.42s">${chapter.tag}</div>
    </div>
  </article>`;
}

function renderStatement(chapter) {
  return `<article class="slide slide-light statement-slide">
    <div class="statement-decoration" aria-hidden="true">BTL</div>
    ${header(chapter, true)}
      <div class="statement-layout">
        <div>${chapterBase(chapter, true)}<p class="chapter-copy reveal" style="--delay:.29s">${chapter.text}</p></div>
        <blockquote class="pull-quote reveal" style="--delay:.44s">${chapter.pull}</blockquote>
      </div>
    </div>
  </article>`;
}

function renderMediaCopy(chapter) {
  return `<article class="slide slide-dark">
    ${header(chapter)}
      <div class="media-copy-layout">
        <div class="media-frame image-reveal">${image(chapter.image, 'Image UMOJA')}<span class="media-caption">UMOJA · ONE LASALLE</span></div>
        <div>${chapterBase(chapter)}<p class="chapter-copy reveal" style="--delay:.30s">${chapter.text}</p><div class="chips reveal" style="--delay:.43s">${chapter.chips.map(chip => `<span class="chip">${chip}</span>`).join('')}</div></div>
      </div>
    </div>
  </article>`;
}

function renderFlow(chapter) {
  return `<article class="slide slide-light">
    ${header(chapter, true)}
      <div class="flow-grid">
        <div>${chapterBase(chapter, true)}<p class="chapter-note reveal" style="--delay:.31s">${chapter.note}</p></div>
        <div class="flow-steps">${chapter.steps.map((step, index) => `<div class="flow-step float-in" style="--delay:${.18 + index * .1}s"><span class="step-label">${step[0]}</span><div><strong class="step-title">${step[1]}</strong><span class="step-copy">${step[2]}</span></div></div>`).join('')}</div>
      </div>
    </div>
  </article>`;
}

function renderExperience(chapter) {
  return `<article class="slide slide-dark">
    ${header(chapter)}
      <div class="experience-head">${chapterBase(chapter)}</div>
      <div class="experience-grid">${chapter.items.map((item, index) => `<article class="experience-card float-in" style="--delay:${.18 + index * .1}s">${image(item[2], item[0])}<div><small>ZONE ${String(index + 1).padStart(2, '0')}</small><h3>${item[0]}</h3><p>${item[1]}</p></div></article>`).join('')}</div>
    </div>
  </article>`;
}

function renderMetrics(chapter) {
  return `<article class="slide slide-dark">
    ${header(chapter)}
      <div class="metric-layout">
        <div>${chapterBase(chapter)}<p class="chapter-note reveal" style="--delay:.31s">${chapter.note}</p></div>
        <div class="metric-list">${chapter.metrics.map((metric, index) => `<div class="metric-item float-in" style="--delay:${.2 + index * .1}s"><strong>${metric[0]}</strong><span>${metric[1]}</span></div>`).join('')}</div>
      </div>
    </div>
  </article>`;
}

function renderModel(chapter) {
  return `<article class="slide slide-light">
    ${header(chapter, true)}
      <div class="model-layout">
        <div>${chapterBase(chapter, true)}</div>
        <div class="lane-list">${chapter.lanes.map((lane, index) => `<div class="lane float-in" style="--delay:${.17 + index * .1}s"><strong>${lane[0]}</strong><span>${lane[1]}</span></div>`).join('')}</div>
      </div>
    </div>
  </article>`;
}

function renderFinancial(chapter) {
  return `<article class="slide slide-dark">
    ${header(chapter)}
      <div class="financial-layout">
        <div>${chapterBase(chapter)}<p class="financial-footnote reveal" style="--delay:.29s">${chapter.footnote}</p></div>
        <div class="scenario-list">${chapter.scenarios.map((scenario, index) => `<div class="scenario float-in" style="--delay:${.17 + index * .12}s"><small>${scenario[0]}</small><strong>${scenario[1]}</strong><span>${scenario[2]}</span></div>`).join('')}</div>
      </div>
    </div>
  </article>`;
}

function renderImpact(chapter) {
  return `<article class="slide slide-light">
    ${header(chapter, true)}
      <div class="impact-layout">
        <div>${chapterBase(chapter, true)}<p class="chapter-copy reveal" style="--delay:.29s">${chapter.text}</p><p class="impact-tag reveal" style="--delay:.42s">${chapter.tag}</p></div>
        <div class="impact-image image-reveal">${image(chapter.image, 'Remise officielle UMOJA')}</div>
      </div>
    </div>
  </article>`;
}

function renderGovernance(chapter) {
  return `<article class="slide slide-light">
    ${header(chapter, true)}
      <div class="metric-layout">
        <div>${chapterBase(chapter, true)}</div>
        <div class="metric-list">${chapter.items.map((item, index) => `<div class="metric-item float-in" style="--delay:${.2 + index * .1}s"><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join('')}</div>
      </div>
    </div>
  </article>`;
}

function renderClosing(chapter) {
  return `<article class="slide slide-dark closing-slide">
    ${header(chapter)}
      ${chapterBase(chapter)}
      <div class="closing-mark reveal" style="--delay:.30s"></div>
      <p class="chapter-copy reveal" style="--delay:.42s">${chapter.text}</p>
    </div>
  </article>`;
}

const renderers = {
  cover: renderCover,
  statement: renderStatement,
  'media-copy': renderMediaCopy,
  flow: renderFlow,
  experience: renderExperience,
  metrics: renderMetrics,
  model: renderModel,
  financial: renderFinancial,
  impact: renderImpact,
  governance: renderGovernance,
  closing: renderClosing,
};

function renderDeck() {
  slidesRoot.innerHTML = deck.chapters.map(chapter => renderers[chapter.type](chapter)).join('');
  navDots.innerHTML = deck.chapters.map((chapter, index) => `<button class="nav-dot ${index === 0 ? 'is-active' : ''}" aria-label="Aller au chapitre ${index + 1}" data-index="${index}"></button>`).join('');
  chapterMenu.innerHTML = `<p class="eyebrow">CHAPITRES</p>${deck.chapters.map((chapter, index) => `<button data-index="${index}" class="${index === 0 ? 'is-current' : ''}"><small>${chapter.index}</small><strong>${chapter.title.replace(/<[^>]+>/g, '').replace('<br>', ' ')}</strong></button>`).join('')}`;
  audienceLabel.textContent = deck.audience;
  currentIndex = 0;
  updateSlide(false);
}

function updateSlide(animate = true) {
  const slides = [...document.querySelectorAll('.slide')];
  slides.forEach((slide, index) => slide.classList.toggle('is-active', index === currentIndex));
  document.querySelectorAll('.nav-dot').forEach((dot, index) => dot.classList.toggle('is-active', index === currentIndex));
  document.querySelectorAll('.chapter-menu button').forEach((button, index) => button.classList.toggle('is-current', index === currentIndex));
  chapterLabel.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(deck.chapters.length).padStart(2, '0')}`;
  progressFill.style.height = `${((currentIndex + 1) / deck.chapters.length) * 100}%`;
  previousButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === deck.chapters.length - 1;
  previousButton.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
  nextButton.style.visibility = currentIndex === deck.chapters.length - 1 ? 'hidden' : 'visible';
  if (animate) {
    isMoving = true;
    window.setTimeout(() => { isMoving = false; }, 740);
  }
}

function goTo(index) {
  if (!deck || isMoving) return;
  const nextIndex = Math.max(0, Math.min(index, deck.chapters.length - 1));
  if (nextIndex === currentIndex) return;
  currentIndex = nextIndex;
  closeMenu();
  updateSlide();
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  chapterMenu.classList.remove('is-open');
  chapterMenu.setAttribute('aria-hidden', 'true');
}

function openModal(profile) {
  selectedProfile = profile;
  loginError.textContent = '';
  passwordInput.value = '';
  modalTitle.textContent = profileNames[profile];
  modalKicker.textContent = 'ACCÈS PRIVÉ · UMOJA 2';
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => passwordInput.focus(), 250);
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

async function login(event) {
  event.preventDefault();
  if (!selectedProfile || !passwordInput.value) return;
  loginError.textContent = '';
  const submit = document.querySelector('#submitLogin');
  submit.disabled = true;
  submit.querySelector('span').textContent = 'Vérification...';
  try {
    const response = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: selectedProfile, password: passwordInput.value }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Accès refusé.');
    await openDeck(result.token);
  } catch (error) {
    loginError.textContent = error.message || 'La connexion a échoué.';
  } finally {
    submit.disabled = false;
    submit.querySelector('span').textContent = 'Ouvrir le parcours';
  }
}

async function openDeck(token) {
  loadingOverlay.classList.add('is-loading');
  const response = await fetch(`/api/deck?token=${encodeURIComponent(token)}`, { cache: 'no-store' });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Impossible de charger le parcours.');
  deck = result.deck;
  renderDeck();
  closeModal();
  loginView.hidden = true;
  deckView.hidden = false;
  requestAnimationFrame(() => loadingOverlay.classList.remove('is-loading'));
}

function logout() {
  closeMenu();
  deckView.hidden = true;
  loginView.hidden = false;
  deck = null;
  currentIndex = 0;
  slidesRoot.innerHTML = '';
}

document.querySelectorAll('.access-card').forEach(button => button.addEventListener('click', () => openModal(button.dataset.profile)));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
document.querySelector('#togglePassword').addEventListener('click', () => {
  const hidden = passwordInput.type === 'password';
  passwordInput.type = hidden ? 'text' : 'password';
  document.querySelector('#togglePassword').textContent = hidden ? 'Masquer' : 'Voir';
});
loginForm.addEventListener('submit', login);
previousButton.addEventListener('click', () => goTo(currentIndex - 1));
nextButton.addEventListener('click', () => goTo(currentIndex + 1));
document.querySelector('#backToLogin').addEventListener('click', logout);
navDots.addEventListener('click', event => { const button = event.target.closest('[data-index]'); if (button) goTo(Number(button.dataset.index)); });
chapterMenu.addEventListener('click', event => { const button = event.target.closest('[data-index]'); if (button) goTo(Number(button.dataset.index)); });
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  chapterMenu.classList.toggle('is-open', !isOpen);
  chapterMenu.setAttribute('aria-hidden', String(isOpen));
});
window.addEventListener('keydown', event => {
  if (deckView.hidden || event.target.matches('input')) return;
  if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); goTo(currentIndex + 1); }
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); goTo(currentIndex - 1); }
  if (event.key === 'Escape') { closeMenu(); closeModal(); }
});
window.addEventListener('wheel', event => {
  if (deckView.hidden || isMoving || Math.abs(event.deltaY) < 18) return;
  if (event.deltaY > 0) goTo(currentIndex + 1); else goTo(currentIndex - 1);
}, { passive: true });
window.addEventListener('touchstart', event => { touchStartY = event.changedTouches[0].screenY; }, { passive: true });
window.addEventListener('touchend', event => {
  if (deckView.hidden || isMoving) return;
  const move = touchStartY - event.changedTouches[0].screenY;
  if (Math.abs(move) > 50) goTo(currentIndex + (move > 0 ? 1 : -1));
}, { passive: true });
