/* ============================================================
   CHADO MATCHA — main.js
   Persistent dark mode + RTL across all pages
   ============================================================ */

(function() {
  /* Apply theme & dir IMMEDIATELY before DOM paint — prevents flash */
  const savedTheme = localStorage.getItem('chado-theme');
  const savedDir   = localStorage.getItem('chado-dir');
  if (savedTheme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  if (savedDir   === 'rtl')  document.documentElement.setAttribute('dir', 'rtl');
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── THEME TOGGLE ── */
  const themeBtns = document.querySelectorAll('[id^="themeBtn"]');

  function syncThemeIcons(dark) {
    const icon = dark ? '☀️' : '🌙';
    themeBtns.forEach(btn => btn.textContent = icon);
  }

  function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('chado-theme', dark ? 'dark' : 'light');
    syncThemeIcons(dark);
  }

  function toggleTheme() {
    setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
  }

  // Restore on load
  const savedTheme = localStorage.getItem('chado-theme');
  syncThemeIcons(savedTheme === 'dark');

  themeBtns.forEach(btn => btn.addEventListener('click', toggleTheme));


  /* ── RTL TOGGLE ── */
  const rtlBtns = document.querySelectorAll('[id^="rtlBtn"]');

  function syncRTLLabels(isRTL) {
    const label = isRTL ? 'LTR' : 'RTL';
    rtlBtns.forEach(btn => btn.textContent = label);
  }

  function setDir(rtl) {
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    localStorage.setItem('chado-dir', rtl ? 'rtl' : 'ltr');
    syncRTLLabels(rtl);
  }

  function toggleRTL() {
    setDir(document.documentElement.getAttribute('dir') !== 'rtl');
  }

  // Restore on load
  const savedDir = localStorage.getItem('chado-dir');
  syncRTLLabels(savedDir === 'rtl');

  rtlBtns.forEach(btn => btn.addEventListener('click', toggleRTL));


  /* ── HAMBURGER MENU ── */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu   = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target))
        mobileMenu.classList.remove('open');
    });
  }


  /* ── MOBILE HOME DROPDOWN ── */
  const mobileHomeToggle   = document.getElementById('mobileHomeToggle');
  const mobileHomeDropdown = document.getElementById('mobileHomeDropdown');
  const mobileHomeArrow    = document.getElementById('mobileHomeArrow');

  if (mobileHomeToggle) {
    mobileHomeToggle.addEventListener('click', () => {
      mobileHomeDropdown.classList.toggle('open');
      if (mobileHomeArrow) mobileHomeArrow.classList.toggle('open');
    });
  }


  /* ── ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html'))
      link.classList.add('active');
  });


  /* ── DESKTOP DROPDOWN (click-based) ── */
  document.querySelectorAll('.nav-links li.has-dropdown > a').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = trigger.nextElementSibling;
      const isOpen   = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-links .dropdown.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) dropdown.classList.add('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links'))
      document.querySelectorAll('.nav-links .dropdown.open').forEach(d => d.classList.remove('open'));
  });

  document.querySelectorAll('.nav-links .dropdown').forEach(dd => {
    dd.addEventListener('click', e => e.stopPropagation());
  });


  /* ── SCROLL ANIMATIONS ── */
  function getAnimType(el) {
    if (el.classList.contains('anim-right'))     return 'do-fadeRight';
    if (el.classList.contains('anim-left'))      return 'do-fadeLeft';
    if (el.classList.contains('anim-fade'))      return 'do-fadeIn';
    if (el.classList.contains('grade-card'))     return 'do-flipUp';
    if (el.classList.contains('equip-card'))     return 'do-scale';
    if (el.classList.contains('testi-card'))     return 'do-fadeUp';
    if (el.classList.contains('workshop-card'))  return 'do-fadeLeft';
    if (el.classList.contains('sub-card'))       return 'do-scale';
    if (el.classList.contains('faq-item'))       return 'do-fadeRight';
    if (el.classList.contains('step'))           return 'do-fadeUp';
    if (el.classList.contains('blog-card'))      return 'do-flipUp';
    if (el.classList.contains('team-card'))      return 'do-scale';
    if (el.classList.contains('team-card-new'))  return 'do-scale';
    if (el.classList.contains('value-item'))     return 'do-fadeUp';
    if (el.classList.contains('module-card'))    return 'do-flipUp';
    if (el.classList.contains('plan-card'))      return 'do-scale';
    if (el.classList.contains('sec-header'))     return 'do-fadeIn';
    return 'do-fadeUp';
  }

  const animEls = document.querySelectorAll('.anim');
  if (animEls.length) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el       = entry.target;
          const type     = getAnimType(el);
          const siblings = [...(el.parentElement?.children || [])].filter(e => e.classList.contains('anim'));
          el.style.animationDelay = (siblings.indexOf(el) * 0.12) + 's';
          el.classList.add(type);
          scrollObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => scrollObserver.observe(el));
  }


  /* ── GALLERY FILTER + LIGHTBOX ── */
  const galleryItems = document.querySelectorAll('.masonry-item');
  const lb = document.getElementById('lightbox');

  if (lb) {
    const lbImg   = document.getElementById('lbImg');
    const lbCat   = document.getElementById('lbCat');
    const lbTitle = document.getElementById('lbTitle');
    let current = 0, visible = [];

    function getVisible() {
      return [...document.querySelectorAll('.masonry-item')].filter(el => el.style.display !== 'none');
    }
    function openLb(idx) {
      visible  = getVisible();
      current  = idx;
      const item = visible[current];
      lbImg.src          = item.querySelector('img').src;
      lbCat.textContent  = (item.dataset.cat || '').charAt(0).toUpperCase() + (item.dataset.cat || '').slice(1);
      lbTitle.textContent = item.dataset.title || '';
      lb.classList.add('open');
    }
    function closeLb() { lb.classList.remove('open'); }
    function navigate(dir) {
      visible = getVisible();
      current = (current + dir + visible.length) % visible.length;
      openLb(current);
    }

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        visible = getVisible();
        openLb(visible.indexOf(item));
      });
    });

    document.getElementById('lbClose')?.addEventListener('click', closeLb);
    document.getElementById('lbPrev')?.addEventListener('click',  () => navigate(-1));
    document.getElementById('lbNext')?.addEventListener('click',  () => navigate(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLb();
      if (e.key === 'ArrowLeft')   navigate(-1);
      if (e.key === 'ArrowRight')  navigate(1);
    });

    // Gallery filter
    document.querySelectorAll('.g-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.g-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
        });
      });
    });
  }


  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backToTop.classList.add("active");
  } else {
    backToTop.classList.remove("active");
  }
});

backToTop.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
