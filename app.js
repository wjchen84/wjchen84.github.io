(() => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll('[data-set-language]');
  let savedLanguage = null;
  try {
    savedLanguage = localStorage.getItem('wenjie-chen-language');
  } catch (_) {
    // Language switching remains available when storage is unavailable.
  }

  function setLanguage(language) {
    const isEnglish = language === 'en';
    root.lang = isEnglish ? 'en' : 'zh-CN';
    document.title = isEnglish
      ? 'Wenjie Chen — Robotics & Industrialization'
      : '陈文杰 — 机器人技术与产业化';
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.setLanguage === language));
    });
    document.querySelectorAll('[data-lang]').forEach((element) => {
      element.hidden = element.dataset.lang !== language;
    });
    try {
      localStorage.setItem('wenjie-chen-language', language);
    } catch (_) {
      // Ignore storage restrictions in local-file previews.
    }
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.setLanguage));
  });

  setLanguage(savedLanguage === 'en' ? 'en' : 'zh');
  document.querySelector('#year').textContent = String(new Date().getFullYear());

  const analytics = window.WENJIE_ANALYTICS;
  if (analytics && typeof analytics.endpoint === 'string' && analytics.endpoint.startsWith('https://')) {
    const payload = {
      site: analytics.site || 'wenjie-chen',
      variant: analytics.variant || 'low-key',
      path: window.location.pathname || '/',
      referrer: document.referrer || '',
    };
    try {
      window.fetch(analytics.endpoint, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (_) {
      // Analytics must never interfere with the public website.
    }
  }
})();
