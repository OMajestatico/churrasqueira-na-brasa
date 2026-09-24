(() => {
  const topbar = document.getElementById('topbar');
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOrder = document.getElementById('mobileOrder');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
    const y = window.scrollY || 0;
    topbar.classList.toggle('scrolled', y > 24);
    if (mobileOrder) mobileOrder.classList.toggle('show', y > 520 && y < document.documentElement.scrollHeight - window.innerHeight - 440);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  const setMenu = (open) => {
    if (!menuBtn || !mobileNav) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileNav.setAttribute('aria-hidden', String(!open));
    mobileNav.classList.toggle('open', open);
  };

  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    setMenu(!open);
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuBtn.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!mobileNav || !menuBtn || menuBtn.getAttribute('aria-expanded') !== 'true') return;
    if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  const reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.12, rootMargin:'0px 0px -50px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  const dialog = document.getElementById('lightbox');
  const dialogImg = document.getElementById('lightboxImg');
  const closeBtn = dialog?.querySelector('.lightbox-close');
  document.querySelectorAll('.gallery-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      dialogImg.src = btn.dataset.full || img.src;
      dialogImg.alt = img.alt;
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  closeBtn?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
})();
