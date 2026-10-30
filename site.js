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
      setTimeout(() => { location.href = dest.href; }, 300);
    });
  });
});
