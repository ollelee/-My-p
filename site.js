document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.createElement('div');
  overlay.className = 'page-flash';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
      const dest = new URL(link.href, location.href);
      if (dest.origin !== location.origin || !dest.pathname.endsWith('.html') || dest.href === location.href) return;
      event.preventDefault();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { location.href = dest.href; return; }
      overlay.classList.add('is-flashing');
      setTimeout(() => { location.href = dest.href; }, 600);
    });
  });
});

// Gallery lightbox: click image to enlarge; click backdrop or X, or press Esc to close.
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.gallery img, .illustration-gallery img');
  if (!images.length) return;
  const viewer = document.createElement('div');
  viewer.className = 'art-lightbox';
  viewer.setAttribute('role','dialog');
  viewer.setAttribute('aria-modal','true');
  viewer.setAttribute('aria-label','Artwork enlarged view');
  viewer.innerHTML = '<button type="button" aria-label="Close enlarged artwork">×</button><img alt=""><div class="lightbox-caption"></div>';
  document.body.appendChild(viewer);
  const full = viewer.querySelector('img');
  const caption = viewer.querySelector('.lightbox-caption');
  const closeButton = viewer.querySelector('button');
  let previousFocus;
  function close(){
    viewer.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    viewer.setAttribute('aria-hidden','true');
    if(previousFocus) previousFocus.focus();
  }
  images.forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role','button');
    img.setAttribute('aria-label',(img.alt || 'Artwork') + ' - enlarge');
    function open(){
      previousFocus = document.activeElement;
      full.src = img.currentSrc || img.src;
      full.alt = img.alt || '';
      caption.textContent = img.closest('.work,figure')?.querySelector('p,figcaption')?.textContent || '';
      viewer.setAttribute('aria-hidden','false');
      viewer.classList.add('open');
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    }
    img.addEventListener('click',open);
    img.addEventListener('keydown',e => {if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
  viewer.setAttribute('aria-hidden','true');
  closeButton.addEventListener('click',close);
  viewer.addEventListener('click',e => {if(e.target===viewer)close();});
  document.addEventListener('keydown',e => {if(e.key==='Escape'&&viewer.classList.contains('open'))close();});
});
