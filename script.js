/* Remover loader com múltiplos gatilhos para garantir funcionamento em mobile */
function hideLoader(){
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('hide')){
    loader.classList.add('hide');
  }
}

/* Tentar remover no DOMContentLoaded + delay */
document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 800));

/* Remover no load + delay */
window.addEventListener('load', () => setTimeout(hideLoader, 1400));

/* Timeout de segurança: remover loader após 4 segundos mesmo se nada funcionar */
setTimeout(hideLoader, 4000);

document.getElementById('year').textContent = new Date().getFullYear();

const supportsHover = window.matchMedia('(hover:hover) and (min-width:1024px)').matches;
if (supportsHover){
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
  (function loop(){ rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18; ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  document.querySelectorAll('a, button, input, textarea, select, .gal-item, .tour-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

const nav = document.getElementById('nav');
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / h * 100) + '%';
});

/* MOBILE MENU — toggle robusto */
const burger = document.getElementById('navBurger');
const mobile = document.getElementById('mobileMenu');

function toggleMenu(force){
  const willOpen = typeof force === 'boolean' ? force : !mobile.classList.contains('open');
  mobile.classList.toggle('open', willOpen);
  burger.classList.toggle('open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
  burger.setAttribute('aria-expanded', willOpen);
}
burger.addEventListener('click', e => { e.stopPropagation(); toggleMenu(); });
mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth >= 980) toggleMenu(false); });

const io = new IntersectionObserver(entries => {
  entries.forEach((e,i) => { if (e.isIntersecting){ setTimeout(() => e.target.classList.add('visible'), i*60); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

if (supportsHover){
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => { const r=btn.getBoundingClientRect(); btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*0.2}px,${(e.clientY-r.top-r.height/2)*0.35}px)`; });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
}


const hero = document.getElementById('hero');
const heroImages = ['IMAGEM DE FUNDO 1 PÁGINA.avif', 'IMG_1441.JPG.jpeg', 'IMG_0762.JPG.jpeg', 'imagem de fundo 2.jpg', 'imagem de fundo 3.jpg'];
let heroBgIndex = 0;
function setHeroBackground(index){
  hero.style.setProperty('--hero-bg', `url("${heroImages[index]}")`);
}
setHeroBackground(heroBgIndex);
setInterval(() => {
  heroBgIndex = (heroBgIndex + 1) % heroImages.length;
  setHeroBackground(heroBgIndex);
}, 8000);

const selectedTours = new Set();
const chipsEl = document.getElementById('chips');
function renderChips(){
  if (selectedTours.size === 0){ chipsEl.innerHTML = '<span class="chips-empty">Nenhum passeio selecionado ainda — adicione pelos cards ou pelo seletor acima.</span>'; return; }
  chipsEl.innerHTML = '';
  selectedTours.forEach(name => {
    const chip = document.createElement('span'); chip.className = 'chip';
    chip.innerHTML = `<span>${name}</span> <button type="button" aria-label="Remover">×</button>`;
    chip.querySelector('button').addEventListener('click', () => {
      selectedTours.delete(name);
      document.querySelectorAll('.tour-card').forEach(card => { if (card.dataset.tour === name) card.querySelector('.btn-select').classList.remove('added'); });
      renderChips();
    });
    chipsEl.appendChild(chip);
  });
}
function addTour(name, scrollToForm = false){
  if (!selectedTours.has(name)){
    selectedTours.add(name);
    document.querySelectorAll('.tour-card').forEach(card => { if (card.dataset.tour === name) card.querySelector('.btn-select').classList.add('added'); });
    renderChips(); showToast('Passeio adicionado ao formulário');
  }
  if (scrollToForm) document.getElementById('reservar').scrollIntoView({ behavior:'smooth' });
}
document.querySelectorAll('.tour-card').forEach(card => {
  const btn = card.querySelector('[data-add]');
  btn.addEventListener('click', () => {
    const name = card.dataset.tour;
    if (selectedTours.has(name)){ selectedTours.delete(name); btn.classList.remove('added'); showToast('Passeio removido'); }
    else { selectedTours.add(name); btn.classList.add('added'); showToast('Passeio adicionado'); }
    renderChips();
  });
});
document.getElementById('tourSelect').addEventListener('change', e => { const v=e.target.value; if (v) addTour(v); e.target.value=''; });
document.querySelectorAll('[data-add-from-tab]').forEach(btn => { btn.addEventListener('click', e => { e.preventDefault(); addTour(btn.dataset.addFromTab, true); }); });

const tabs = document.querySelectorAll('.rot-tab');
const panels = document.querySelectorAll('.rot-panel');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById('roteiro-' + tab.dataset.tab).classList.add('active');
}));
document.querySelectorAll('a[href^="#roteiro-"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const id = a.getAttribute('href').slice(1); const num = id.split('-')[1];
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === num));
  panels.forEach(p => p.classList.toggle('active', p.id === id));
  document.getElementById('roteiros').scrollIntoView({ behavior:'smooth' });
}));

const toast = document.getElementById('toast'); let toastTimer;
function showToast(msg){ toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200); }

const form = document.getElementById('reservaForm');
let isSubmitting = false;
form.addEventListener('submit', e => {
  if (isSubmitting) return;
  isSubmitting = true;
  e.preventDefault();
  const data = new FormData(form);
  const nome = data.get('nome')?.trim(), telefone = data.get('telefone')?.trim(), pessoas = data.get('pessoas'), dataDesejada = data.get('data'), duvidas = data.get('duvidas')?.trim();
  if (!nome || !telefone || !pessoas || !dataDesejada){ showToast('Preencha os campos obrigatórios'); return; }
  if (selectedTours.size === 0){ showToast('Selecione ao menos um passeio'); return; }
  const passeiosTxt = Array.from(selectedTours).map(t => `• ${t}`).join('\n');
  const msg =
`Olá! Vim pelo site da Vera Cruz Expedições e quero solicitar um roteiro:

👤 Nome: ${nome}
📱 Telefone: ${telefone}
👥 Pessoas: ${pessoas}
📅 Data desejada: ${dataDesejada}

🌅 Passeios selecionados:
${passeiosTxt}

❓ Dúvidas/observações:
${duvidas || '—'}

Aguardo retorno. Obrigado!`;
  const phoneE164 = '+559888541526';
  const waUrl = `https://wa.me/${phoneE164}?text=${encodeURIComponent(msg)}`;
  // Compatibilidade mobile: usar location.href em vez de window.open.
  showToast('Abrindo o WhatsApp...');
  // Evita múltiplos submits (já que vamos navegar para o WhatsApp).
  try {
    window.location.href = waUrl;
  } catch (err) {
    window.open(waUrl, '_blank');
  }
  return;
});

if (window.matchMedia('(min-width:768px)').matches){
  window.addEventListener('scroll', () => {
    document.querySelectorAll('.gal-item').forEach((item,i) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight){
        const speed = (i%2===0?1:-1)*0.04;
        item.style.backgroundPosition = `center ${50+(window.innerHeight/2 - rect.top)*speed}%`;
      }
    });
  });
}

document.querySelectorAll('.hero-title .line').forEach((line,idx) => {
  line.style.opacity = 0; line.style.transform = 'translateY(60px)';
  line.style.transition = `opacity 1.1s cubic-bezier(.2,.7,.2,1) ${0.3+idx*0.18}s, transform 1.1s cubic-bezier(.2,.7,.2,1) ${0.3+idx*0.18}s`;
  setTimeout(() => { line.style.opacity = 1; line.style.transform = 'translateY(0)'; }, 1500);
});

if (supportsHover){
  document.querySelectorAll('.tour-card').forEach(card => {
    card.addEventListener('mousemove', e => { const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-0.5; const y=(e.clientY-r.top)/r.height-0.5; card.style.transform=`translateY(-8px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`; });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}

/* ============================================
   LIGHTBOX — Galeria em tela cheia
   ============================================ */
const galleryImages = Array.from(document.querySelectorAll('.gal-item')).map(item => {
  const bgUrl = item.style.backgroundImage.match(/url\('([^']+)'\)/)?.[1];
  return bgUrl || '';
}).filter(url => url);

let currentImageIndex = 0;

function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  
  currentImageIndex = galleryImages.indexOf(imageSrc);
  lightboxImg.src = imageSrc;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  document.getElementById('lightboxImage').src = galleryImages[currentImageIndex];
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  document.getElementById('lightboxImage').src = galleryImages[currentImageIndex];
}

// Adicionar onclick aos itens da galeria
document.querySelectorAll('.gal-item').forEach(item => {
  const bgUrl = item.style.backgroundImage.match(/url\('([^']+)'\)/)?.[1];
  if (bgUrl) {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => openLightbox(bgUrl));
  }
});

// Fechar lightbox ao clicar fora da imagem
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});

// Teclado: ESC para fechar, setas para navegar
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('active')) return;
  
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
});