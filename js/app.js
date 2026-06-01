let currentLang = localStorage.getItem('kah_lang') || 'en';
let data = null;
let currentSection = 'home';

const sections = ['home','quickstart','glossary','advanced','academy','events','officer','faq','templates','roadmap'];

async function init(){
  document.getElementById('languageSelect').value = currentLang;
  await loadLanguage(currentLang);
}

async function loadLanguage(lang){
  currentLang = lang;
  localStorage.setItem('kah_lang', lang);
  const response = await fetch(`lang/${lang}.json`);
  data = await response.json();
  renderMenu();
  renderSection(currentSection);
}

function setLanguage(lang){ loadLanguage(lang); }

function renderMenu(){
  const menu = document.getElementById('menu');
  menu.innerHTML = '';
  sections.forEach(key => {
    const btn = document.createElement('button');
    btn.textContent = data.nav[key];
    btn.className = key === currentSection ? 'active' : '';
    btn.onclick = () => renderSection(key);
    menu.appendChild(btn);
  });
}

function renderSection(key){
  currentSection = key;
  renderMenu();
  document.getElementById('pageTitle').textContent = data.nav[key];
  document.getElementById('pageSubtitle').textContent = data.subtitle;
  const section = data.sections[key];
  document.getElementById('content').innerHTML = section.html;
  document.getElementById('searchResults').style.display = 'none';
  document.getElementById('searchInput').value = '';
  if(window.innerWidth < 850) document.getElementById('sidebar').classList.remove('open');
}

function toggleMenu(){ document.getElementById('sidebar').classList.toggle('open'); }

function searchContent(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  const box = document.getElementById('searchResults');
  if(!q){ box.style.display='none'; return; }
  const results = [];
  sections.forEach(key => {
    const text = (data.nav[key] + ' ' + data.sections[key].plain).toLowerCase();
    if(text.includes(q)) results.push({key,title:data.nav[key]});
  });
  box.innerHTML = results.length ? results.map(r => `<button onclick="renderSection('${r.key}')">${r.title}</button>`).join('') : `<button>${data.noResults}</button>`;
  box.style.display = 'block';
}

init();
