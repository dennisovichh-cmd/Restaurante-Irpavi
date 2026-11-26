/* ==========================================================
   Chicharronería Irpavi · Lógica principal
   - Bienvenida: "Toca para entrar" (inicia la música) y luego cuenta o modo invitado
   - Celular: pantallas con barra inferior; menú lateral (hamburguesa)
   - Escritorio: página completa con navegación superior
   - Carta: Región → Categoría → Plato → Receta
   - Pedidos: carrito → factura → pago con QR simulado → historial
   Todo el texto dinámico se inserta con textContent (sin innerHTML) => protección XSS.
   Nota: cuentas y pedidos se guardan en el navegador (localStorage). Es una simulación,
   no hay servidor, y las contraseñas no están cifradas.
   ========================================================== */
(() => {
  'use strict';

  /* ---------- Textos de la interfaz ---------- */
  const T = {
    es: {
      skip: 'Saltar al contenido',
      nav_home: 'Inicio', nav_about: 'Nosotros', nav_menu: 'Carta', nav_orders: 'Pedidos',
      nav_gallery: 'Galería', nav_reviews: 'Opiniones', nav_contact: 'Contacto',
      hero_title: 'Chicharronería Irpavi',
      hero_sub: 'Todo el sabor de Bolivia en cada plato',
      hero_cta: 'Ver carta', hero_cta2: 'Reservar mesa',
      enter: 'Toca para entrar',
      welcome: 'Bienvenido',
      gate_sub: 'Inicia sesión para pedir, o entra como invitado para ver la carta.',
      need_login: 'Para agregar platos al pedido, inicia sesión o crea tu cuenta.',
      tab_login: 'Iniciar sesión', tab_register: 'Crear cuenta',
      login_btn: 'Entrar', register_btn: 'Crear cuenta', guest: 'Entrar como invitado',
      auth_note: 'Tu cuenta es simulada en este dispositivo.',
      label_fullname: 'Nombre completo', label_email: 'Correo',
      label_password: 'Contraseña (mínimo 6)', label_celular: 'Celular',
      err_login: 'Correo o contraseña incorrectos.',
      err_exists: 'Ya existe una cuenta con ese correo.',
      err_pass: 'La contraseña debe tener al menos 6 caracteres.',
      err_cel: 'Ingresa un celular de 8 dígitos (empieza con 6 o 7).',
      about_title: 'Nosotros',
      about_text: 'Cocinamos platos tradicionales de La Paz, los Valles y el Oriente con recetas heredadas y mucho cariño.',
      a2_q: 'Horarios', a2_a: 'Sábado y domingo, 12:30 a 17:00',
      a3_q: '¿Hacen pedidos para llevar?', a3_a: 'Sí. Escríbenos por WhatsApp o llámanos.',
      menu_title: 'Carta', menu_sub: 'Sabores de nuestra Bolivia',
      gallery_title: 'Galería',
      reviews_title: 'Opiniones', reviews_sub: 'Lo que dicen nuestros clientes',
      contact_title: 'Reserva de mesa', contact_sub: 'Reserva tu mesa o escríbenos',
      label_name: 'Nombre', label_phone: 'Celular',
      label_msg: 'Fecha, hora y número de personas',
      book_btn: 'Reservar mesa', sent: '¡Gracias! Recibimos tu reserva.',
      info_address: 'Dirección', info_hours: 'Horario', info_phone: 'Teléfono',
      address: 'Irpavi, La Paz, Bolivia (calle 10)',
      a2_a_short: 'Sábado y domingo, 12:30 a 17:00',
      footer_tag: 'Hecho con cariño desde La Paz',
      err_name: 'Ingresa al menos 3 letras.',
      err_email: 'Ingresa un correo válido.',
      err_msg: 'Escribe la fecha, hora y personas (mínimo 10 caracteres).',
      theme_label: 'Cambiar tema', lang_label: 'Cambiar idioma',
      drawer_title: 'Menú', drawer_theme: 'Modo oscuro', social_follow: 'Síguenos',
      sign_in: 'Iniciar sesión', sign_out: 'Cerrar sesión',
      guest_name: 'Invitado', hi: 'Hola',
      prev: 'Anterior', next: 'Siguiente',
      pause: 'Pausar carrusel', play: 'Reproducir carrusel',
      close: 'Cerrar', soon: 'Foto próximamente',
      loading_err: 'No pudimos cargar la carta. Intenta de nuevo.',
      review_author: 'Cliente'
    },
    en: {
      skip: 'Skip to content',
      nav_home: 'Home', nav_about: 'About', nav_menu: 'Menu', nav_orders: 'Orders',
      nav_gallery: 'Gallery', nav_reviews: 'Reviews', nav_contact: 'Contact',
      hero_title: 'Chicharronería Irpavi',
      hero_sub: 'All the flavor of Bolivia in every dish',
      hero_cta: 'View menu', hero_cta2: 'Book a table',
      enter: 'Tap to enter',
      welcome: 'Welcome',
      gate_sub: 'Sign in to order, or continue as a guest to browse the menu.',
      need_login: 'To add dishes to your order, please sign in or create an account.',
      tab_login: 'Sign in', tab_register: 'Create account',
      login_btn: 'Sign in', register_btn: 'Create account', guest: 'Continue as guest',
      auth_note: 'Your account is simulated on this device.',
      label_fullname: 'Full name', label_email: 'Email',
      label_password: 'Password (minimum 6)', label_celular: 'Mobile number',
      err_login: 'Wrong email or password.',
      err_exists: 'An account with that email already exists.',
      err_pass: 'The password must be at least 6 characters.',
      err_cel: 'Enter an 8-digit mobile number (starts with 6 or 7).',
      about_title: 'About us',
      about_text: 'We cook traditional dishes from La Paz, the valleys and the lowlands, with inherited recipes and lots of love.',
      a2_q: 'Opening hours', a2_a: 'Saturday and Sunday, 12:30 pm to 5:00 pm',
      a3_q: 'Do you offer takeaway?', a3_a: 'Yes. Message us on WhatsApp or give us a call.',
      menu_title: 'Menu', menu_sub: 'Flavors of our Bolivia',
      gallery_title: 'Gallery',
      reviews_title: 'Reviews', reviews_sub: 'What our guests say',
      contact_title: 'Table reservation', contact_sub: 'Book your table or write to us',
      label_name: 'Name', label_phone: 'Mobile number',
      label_msg: 'Date, time and number of guests',
      book_btn: 'Book table', sent: 'Thank you! We received your reservation.',
      info_address: 'Address', info_hours: 'Hours', info_phone: 'Phone',
      address: 'Irpavi, La Paz, Bolivia (add full address)',
      a2_a_short: 'Saturday and Sunday, 12:30 pm to 5:00 pm',
      footer_tag: 'Made with love in La Paz',
      err_name: 'Please enter at least 3 letters.',
      err_email: 'Please enter a valid email.',
      err_msg: 'Write the date, time and guests (at least 10 characters).',
      theme_label: 'Toggle theme', lang_label: 'Change language',
      drawer_title: 'Menu', drawer_theme: 'Dark mode', social_follow: 'Follow us',
      sign_in: 'Sign in', sign_out: 'Sign out',
      guest_name: 'Guest', hi: 'Hi',
      prev: 'Previous', next: 'Next',
      pause: 'Pause carousel', play: 'Play carousel',
      close: 'Close', soon: 'Photo coming soon',
      loading_err: 'We could not load the menu. Please try again.',
      review_author: 'Guest'
    }
  };

  /* ---------- Textos de la carta ---------- */
  const CARTA_L = {
    es: { back: 'Volver', ingredients: 'Ingredientes', prep: 'Preparación' },
    en: { back: 'Back', ingredients: 'Ingredients', prep: 'Preparation' }
  };

  /* ---------- Textos de pedidos ---------- */
  const CART_L = {
    es: {
      title: 'Pedido', add: 'Agregar', less: 'Quitar uno', more: 'Agregar uno',
      total: 'Total', total_pay: 'Total a pagar',
      empty: 'Tu pedido está vacío.', go_carta: 'Ver carta',
      confirm: 'Confirmar pedido',
      invoice: 'Factura de tu pedido', client: 'Cliente', date: 'Fecha y hora',
      pay_qr: 'Pagar con QR', cancel: 'Cancelar pedido',
      pay_title: 'Pago con QR', qr_sim: 'QR simulado: esto no es un pago real.',
      pay_time: 'Tiempo para pagar', pay_hint: 'Si no pagas a tiempo, el pedido queda en espera.',
      paid: 'Ya pagué (simulado)',
      history: 'Historial',
      status_pendiente: 'Pendiente', status_pagado: 'Pagado', status_en_espera: 'En espera',
      hint_wait: 'El tiempo de pago terminó. El pedido quedó en espera.'
    },
    en: {
      title: 'Order', add: 'Add', less: 'Remove one', more: 'Add one',
      total: 'Total', total_pay: 'Total to pay',
      empty: 'Your order is empty.', go_carta: 'View menu',
      confirm: 'Confirm order',
      invoice: 'Your order receipt', client: 'Customer', date: 'Date and time',
      pay_qr: 'Pay with QR', cancel: 'Cancel order',
      pay_title: 'QR payment', qr_sim: 'Simulated QR: this is not a real payment.',
      pay_time: 'Time to pay', pay_hint: 'If you do not pay in time, the order goes on hold.',
      paid: 'I have paid (simulated)',
      history: 'History',
      status_pendiente: 'Pending', status_pagado: 'Paid', status_en_espera: 'On hold',
      hint_wait: 'Payment time ran out. The order is on hold.'
    }
  };

  /* ---------- Constantes y estado ---------- */
  const SCREENS = ['inicio', 'carta', 'pedidos', 'galeria', 'opiniones', 'contacto'];
  const MAX_QTY = 25;
  const PAY_SECONDS = 60;

  const mobileQuery = window.matchMedia('(max-width: 767.98px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lang = localStorage.getItem('lang') || 'es';
  let theme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  let data = null;
  let activeScreen = 'inicio';
  let slideIndex = 0;
  let slideCount = 0;
  let slideTimer = null;
  let carouselPaused = reduceMotion;

  let authMode = 'gate';      // 'gate' (bienvenida, no se cierra sin elegir) | 'modal' (al agregar)
  let pendingAction = null;   // acción que se ejecuta después de iniciar sesión

  let countdownTimer = null;

  // Posición dentro de la carta: índices de región, categoría y plato
  let carta = { region: null, category: null, dish: null };

  // Carrito [{ id, qty }] y pedidos [{ id, date, client, items, total, status, endsAt }]
  let cart = loadJSON('cart', []);
  let orders = loadJSON('orders', []);

  /* ---------- Utilidades ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const t = (key) => (T[lang] && T[lang][key]) || T.es[key] || key;
  const pick = (obj) => obj[lang] || obj.es;
  const isMobile = () => mobileQuery.matches;
  const cartaL = (key) => (CARTA_L[lang] || CARTA_L.es)[key];
  const cartTxt = (key) => (CART_L[lang] || CART_L.es)[key];

  /** Crea un ícono SVG a partir del sprite definido en index.html */
  function icon(id) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'ic');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(ns, 'use');
    use.setAttribute('href', '#' + id);
    svg.append(use);
    return svg;
  }

  /** Crea un elemento con clase y texto opcionales */
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function loadJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : fallback;
    } catch (err) {
      return fallback;
    }
  }

  const secondsLeft = (order) => Math.max(0, Math.ceil((order.endsAt - Date.now()) / 1000));

  /* ---------- Sesión (simulada) ---------- */
  function getSession() {
    try {
      const s = JSON.parse(localStorage.getItem('session'));
      return s && s.email ? s : null;
    } catch (err) {
      return null;
    }
  }

  function saveSession(user) {
    localStorage.setItem('session', JSON.stringify({ name: user.name, email: user.email, phone: user.phone }));
  }

  function logout() {
    localStorage.removeItem('session');
    renderDrawerUser();
  }

  /* ---------- Tema ---------- */
  function applyTheme(next) {
    theme = next;
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    $('#theme-toggle').setAttribute('aria-pressed', String(next === 'dark'));
  }

  /* ---------- Idioma ---------- */
  function applyLang(next) {
    lang = next;
    localStorage.setItem('lang', next);
    document.documentElement.lang = next;

    $$('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    $$('[data-i18n-label]').forEach((node) => { node.setAttribute('aria-label', t(node.dataset.i18nLabel)); });
    $('#lang-toggle').textContent = next === 'es' ? 'EN' : 'ES';

    syncPauseUI();
    renderDrawerUser();

    if (data) {
      renderCategories();
      renderCarousel();
      renderReviews();
      renderPedidos();
    }
  }

  /* ---------- Pantallas y navegación ---------- */
  function showScreen(name) {
    if (!SCREENS.includes(name)) return;
    activeScreen = name;

    $$('.screen').forEach((s) => s.classList.toggle('is-active', s.dataset.screen === name));
    $$('.bn-btn').forEach((b) => {
      if (b.dataset.go === name) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    if (isMobile()) {
      $('#main').scrollTop = 0;
    }
  }

  /** Va a una pantalla: en celular cambia de pantalla; en escritorio baja a la sección */
  function goTo(name) {
    if (isMobile()) {
      showScreen(name);
    } else {
      const target = document.getElementById(name);
      if (target) target.scrollIntoView({ block: 'start' });
    }
  }

  function bindNav() {
    // Barra inferior, menú lateral y botones con data-go
    $$('[data-go]').forEach((btn) => {
      btn.addEventListener('click', () => {
        closeDrawer();
        goTo(btn.dataset.go);
      });
    });

    // Enlaces internos: en celular cambian de pantalla; en escritorio hacen scroll normal
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || !isMobile()) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;

      if (SCREENS.includes(id)) {
        e.preventDefault();
        showScreen(id);
      } else if (id === 'nosotros') {
        e.preventDefault();
        showScreen('inicio');
        const target = document.getElementById('nosotros');
        if (target) target.scrollIntoView({ block: 'start' });
      }
    });

    // Al cambiar de tamaño se conserva la pantalla activa
    mobileQuery.addEventListener('change', () => showScreen(activeScreen));
  }

  /* ---------- Menú lateral (hamburguesa) ---------- */
  function openDrawer() {
    $('#drawer').classList.add('open');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#drawer-overlay').hidden = false;
    $('#menu-btn').setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    $('#drawer').classList.remove('open');
    $('#drawer').setAttribute('aria-hidden', 'true');
    $('#drawer-overlay').hidden = true;
    $('#menu-btn').setAttribute('aria-expanded', 'false');
  }

  function renderDrawerUser() {
    const s = getSession();
    const user = $('#drawer-user');
    const btn = $('#drawer-auth');
    if (!user || !btn) return;
    user.textContent = s ? `${t('hi')}, ${s.name}` : t('guest_name');
    btn.textContent = s ? t('sign_out') : t('sign_in');
  }

  function bindDrawer() {
    $('#menu-btn').addEventListener('click', openDrawer);
    $('#drawer-close').addEventListener('click', closeDrawer);
    $('#drawer-overlay').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

    $('#drawer-auth').addEventListener('click', () => {
      if (getSession()) {
        logout();
        closeDrawer();
      } else {
        closeDrawer();
        openAuth('modal');
      }
    });

    $('#theme-toggle').addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
  }

  /* ---------- Bienvenida y cuenta ---------- */
  function playMusic() {
    const audio = $('#bg-music');
    if (!audio) return;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  function bindEntrance() {
    $('#enter-btn').addEventListener('click', () => {
      playMusic();
      $('#entrada').hidden = true;
      if (!getSession()) openAuth('gate');
    });
  }

  function showAuthTab(tab) {
    const isLogin = tab === 'login';
    $('#tab-login').setAttribute('aria-selected', String(isLogin));
    $('#tab-register').setAttribute('aria-selected', String(!isLogin));
    $('#login-form').hidden = !isLogin;
    $('#register-form').hidden = isLogin;
    $('#login-error').textContent = '';
    $('#register-error').textContent = '';
  }

  /** mode: 'gate' (bienvenida, sin cerrar) o 'modal' (al querer pedir) */
  function openAuth(mode, action = null) {
    authMode = mode;
    pendingAction = action;
    const dlg = $('#auth');
    $('#auth-close').hidden = mode === 'gate';
    $('#auth-sub').textContent = mode === 'gate' ? t('gate_sub') : t('need_login');
    showAuthTab('login');
    if (typeof dlg.showModal === 'function') {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
  }

  function closeAuth() {
    const dlg = $('#auth');
    if (dlg.open) dlg.close();
    pendingAction = null;
  }

  /** Después de iniciar sesión o registrarse: cierra y ejecuta la acción pendiente */
  function authDone(user) {
    saveSession(user);
    renderDrawerUser();
    const action = pendingAction;
    closeAuth();
    if (action) action();
  }

  function setError(id, key) {
    $(id).textContent = key ? t(key) : '';
  }

  function bindAuth() {
    const dlg = $('#auth');

    $('#tab-login').addEventListener('click', () => showAuthTab('login'));
    $('#tab-register').addEventListener('click', () => showAuthTab('register'));
    $('#guest-btn').addEventListener('click', closeAuth);
    $('#auth-close').addEventListener('click', closeAuth);

    // En la bienvenida no se puede cerrar con Escape
    dlg.addEventListener('cancel', (e) => { if (authMode === 'gate') e.preventDefault(); });

    $('#login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#l-email').value.trim().toLowerCase();
      const pass = $('#l-pass').value;
      const user = getUsers().find((u) => u.email === email && u.password === pass);
      if (!user) { setError('#login-error', 'err_login'); return; }
      authDone({ name: user.name, email: user.email, phone: user.phone });
    });

    $('#register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#r-name').value.trim();
      const email = $('#r-email').value.trim().toLowerCase();
      const phone = $('#r-phone').value.replace(/\s/g, '');
      const pass = $('#r-pass').value;
      const users = getUsers();

      if (!rules.name.test(name)) { setError('#register-error', 'err_name'); return; }
      if (!rules.email.test(email)) { setError('#register-error', 'err_email'); return; }
      if (!CEL_RE.test(phone)) { setError('#register-error', 'err_cel'); return; }
      if (pass.length < 6) { setError('#register-error', 'err_pass'); return; }
      if (users.some((u) => u.email === email)) { setError('#register-error', 'err_exists'); return; }

      users.push({ name, email, phone, password: pass });
      localStorage.setItem('users', JSON.stringify(users));
      authDone({ name, email, phone });
    });
  }

  function getUsers() {
    return loadJSON('users', []);
  }

  /* ---------- Música: solo se inicia al tocar "Toca para entrar" ---------- */
  function bindMusic() {
    const audio = $('#bg-music');
    audio.addEventListener('error', () => { /* sin archivo de música: la página sigue funcionando */ });
  }

  /* ---------- Animación al hacer scroll ---------- */
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  function observeReveal(nodes) {
    nodes.forEach((node) => {
      if (!io || reduceMotion) node.classList.add('visible');
      else io.observe(node);
    });
  }

  /* ---------- Carga de datos (fetch) ---------- */
  async function loadData() {
    const res = await fetch('menu.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  /* ---------- Carta: Región → Categoría → Plato → Receta ---------- */
  function pickCard(level, index) {
    carta[level] = index;
    if (level === 'region') { carta.category = null; carta.dish = null; }
    if (level === 'category') carta.dish = null;
    renderCategories();
    if (isMobile()) $('#main').scrollTop = 0;
  }

  function goBack() {
    if (carta.dish !== null) carta.dish = null;
    else if (carta.category !== null) carta.category = null;
    else carta.region = null;
    renderCategories();
    if (isMobile()) $('#main').scrollTop = 0;
  }

  function backButton() {
    const b = el('button', 'back-btn');
    b.type = 'button';
    b.append(icon('i-left'), el('span', '', cartaL('back')));
    b.addEventListener('click', goBack);
    return b;
  }

  function renderRegions(view) {
    const grid = el('div', 'region-grid');
    data.regions.forEach((r, i) => {
      const b = el('button', 'region-card');
      b.type = 'button';
      b.dataset.region = r.id;
      b.setAttribute('aria-label', pick(r.name));

      const bg = el('div', 'region-bg');
      bg.setAttribute('aria-hidden', 'true');

      const txt = el('div', 'region-text');
      txt.append(el('span', 'region-title', pick(r.name)), el('span', 'region-sub', pick(r.sub)));

      b.append(bg, txt);
      b.addEventListener('click', () => pickCard('region', i));
      grid.append(b);
    });
    view.append(grid);
  }

  function renderIndex(view, region) {
    view.append(el('h3', 'panel-title', pick(region.name)));
    const list = el('div', 'index-list');
    region.categories.forEach((c, i) => {
      const b = el('button', 'index-row');
      b.type = 'button';
      b.dataset.pattern = c.pattern;
      b.append(el('span', '', pick(c.title)), el('span', 'index-count', String(c.items.length)));
      b.addEventListener('click', () => pickCard('category', i));
      list.append(b);
    });
    view.append(list);
  }

  function renderDishList(view, cat) {
    view.append(el('h3', 'panel-title', pick(cat.title)));
    const list = el('ul', 'menu-list');
    cat.items.forEach((d, i) => {
      const n = qtyInCart(d.id);
      const li = el('li', 'dish-item');
      if (n > 0) li.classList.add('in-cart');

      const b = el('button', 'dish-row');
      b.type = 'button';
      const info = el('div');
      info.append(el('h4', '', pick(d.name)), el('p', '', pick(d.desc)));
      b.append(info, el('span', 'menu-price', `Bs ${d.price}`));
      b.addEventListener('click', () => pickCard('dish', i));

      if (n > 0) {
        li.append(b, qtyControl(d.id));
      } else {
        const add = el('button', 'add-btn', cartTxt('add'));
        add.type = 'button';
        add.addEventListener('click', () => addToCart(d.id));
        li.append(b, add);
      }
      list.append(li);
    });
    view.append(list);
  }

  /** Detalle del plato: solo informativo (foto, nombre, descripción, ingredientes y preparación) */
  function renderDish(view, dish) {
    const wrap = el('article', 'dish-detail');

    const photo = el('div', 'dish-photo');
    if (dish.image) {
      const img = el('img');
      img.src = dish.image;
      img.alt = pick(dish.name);
      img.loading = 'lazy';
      photo.append(img);
    } else {
      photo.append(el('div', 'placeholder', t('soon')));
    }

    const text = el('div', 'dish-text');
    text.append(
      el('h3', 'panel-title', pick(dish.name)),
      el('p', 'dish-desc', pick(dish.desc)),
      el('h4', 'recipe-title', cartaL('ingredients'))
    );

    const ing = el('ul', 'recipe-list');
    dish.ingredients.forEach((x) => ing.append(el('li', '', x)));

    const prep = el('h4', 'recipe-title', cartaL('prep'));
    const steps = el('ol', 'recipe-list');
    dish.steps.forEach((x) => steps.append(el('li', '', x)));

    text.append(ing, prep, steps);
    wrap.append(photo, text);
    view.append(wrap);
  }

  /** Dibuja la carta según el nivel en el que esté el visitante */
  function renderCategories() {
    const view = $('#carta-view');
    if (!view || !data) return;
    view.replaceChildren();

    if (carta.region === null) {
      renderRegions(view);
      return;
    }

    view.append(backButton());
    const region = data.regions[carta.region];

    if (carta.category === null) {
      renderIndex(view, region);
      return;
    }

    const cat = region.categories[carta.category];
    if (carta.dish === null) {
      renderDishList(view, cat);
      return;
    }

    renderDish(view, cat.items[carta.dish]);
  }

  /* ---------- Lightbox ---------- */
  function openLightbox(item) {
    const dlg = $('#lightbox');
    const img = $('#lightbox-img');
    const ph = $('#lightbox-placeholder');

    if (item.src) {
      img.src = item.src;
      img.alt = pick(item.alt);
      img.hidden = false;
      ph.hidden = true;
    } else {
      img.removeAttribute('src');
      img.alt = '';
      img.hidden = true;
      ph.hidden = false;
      ph.textContent = t('soon');
    }
    $('#lightbox-caption').textContent = pick(item.alt);

    if (typeof dlg.showModal === 'function') dlg.showModal();
  }

  function bindLightbox() {
    const dlg = $('#lightbox');
    $('#lightbox-close').addEventListener('click', () => dlg.close());
    // Cerrar al tocar el fondo oscuro
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- Carrusel + miniaturas ---------- */
  function goToSlide(index) {
    if (!slideCount) return;
    slideIndex = (index + slideCount) % slideCount;
    $('#carousel-track').style.transform = `translateX(-${slideIndex * 100}%)`;
    $$('.dot').forEach((d, i) => d.setAttribute('aria-current', String(i === slideIndex)));
  }

  function startAutoplay() {
    clearInterval(slideTimer);
    if (!carouselPaused && slideCount > 1) {
      slideTimer = setInterval(() => goToSlide(slideIndex + 1), 6000);
    }
  }

  function syncPauseUI() {
    const btn = $('#carousel-pause');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(carouselPaused));
    btn.setAttribute('aria-label', t(carouselPaused ? 'play' : 'pause'));
  }

  function renderCarousel() {
    const track = $('#carousel-track');
    const dots = $('#carousel-dots');
    const thumbs = $('#thumbs');
    track.replaceChildren();
    dots.replaceChildren();
    thumbs.replaceChildren();

    slideCount = data.gallery.length;

    data.gallery.forEach((g, i) => {
      // Slide grande con nombre y descripción corta del plato
      const fig = el('figure', 'slide');
      if (g.src) {
        const img = el('img', 'zoomable');
        img.src = g.src;
        img.alt = pick(g.alt);
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.addEventListener('click', () => openLightbox(g));
        fig.append(img);
      } else {
        fig.append(el('div', 'placeholder', t('soon')));
      }

      const cap = el('figcaption');
      cap.append(el('span', 'slide-name', pick(g.alt)));
      if (g.desc) cap.append(el('span', 'slide-desc', pick(g.desc)));
      fig.append(cap);
      track.append(fig);

      // Punto de navegación
      const dot = el('button', 'dot');
      dot.type = 'button';
      dot.setAttribute('aria-label', `${i + 1} / ${slideCount}`);
      dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
      dots.append(dot);

      // Miniatura que se agranda al tocarla
      const thumb = el('button', 'thumb');
      thumb.type = 'button';
      thumb.setAttribute('aria-label', pick(g.alt));
      if (g.src) {
        const timg = el('img');
        timg.src = g.src;
        timg.alt = '';
        timg.loading = 'lazy';
        thumb.append(timg);
      } else {
        thumb.append(el('div', 'placeholder', pick(g.alt)));
      }
      thumb.addEventListener('click', () => openLightbox(g));
      thumbs.append(thumb);
    });

    goToSlide(Math.min(slideIndex, slideCount - 1));
    startAutoplay();
  }

  function bindCarousel() {
    const root = $('.carousel');
    const track = $('#carousel-track');

    $('.carousel-ctrl.prev').addEventListener('click', () => { goToSlide(slideIndex - 1); startAutoplay(); });
    $('.carousel-ctrl.next').addEventListener('click', () => { goToSlide(slideIndex + 1); startAutoplay(); });

    $('#carousel-pause').addEventListener('click', () => {
      carouselPaused = !carouselPaused;
      syncPauseUI();
      startAutoplay();
    });

    // Deslizar con el dedo en el celular
    let startX = null;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { goToSlide(slideIndex + (dx < 0 ? 1 : -1)); startAutoplay(); }
      startX = null;
    });

    // Flechas del teclado con el carrusel enfocado
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { goToSlide(slideIndex + 1); startAutoplay(); }
      if (e.key === 'ArrowLeft') { goToSlide(slideIndex - 1); startAutoplay(); }
    });
  }

  /* ---------- Opiniones ---------- */
  function renderReviews() {
    const wrap = $('#reviews');
    wrap.replaceChildren();

    data.reviews.forEach((r) => {
      const card = el('article', 'review');

      const stars = el('div', 'stars');
      stars.setAttribute('aria-label', `${r.stars} / 5`);
      for (let i = 0; i < 5; i++) stars.append(icon('i-star'));

      const text = el('p', '', pick(r.text));
      const author = el('span', 'author', r.name || t('review_author'));

      card.append(stars, text, author);
      wrap.append(card);
    });

    observeReveal($$('.review', wrap));
  }

  /* ---------- Formulario de reserva con validación ---------- */
  const CEL_RE = /^[67]\d{7}$/;   // celulares de Bolivia: 8 dígitos, empiezan con 6 o 7

  const rules = {
    name: {
      test: (v) => /^[\p{L} .'-]{3,}$/u.test(v.trim()),
      msg: 'err_name'
    },
    email: {
      test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      msg: 'err_email'
    },
    phone: {
      test: (v) => CEL_RE.test(v.replace(/\s/g, '')),
      msg: 'err_cel'
    },
    message: {
      test: (v) => v.trim().length >= 10,
      msg: 'err_msg'
    }
  };

  function validateField(form, key) {
    const input = form.elements.namedItem(key);
    const ok = rules[key].test(input.value);
    input.setAttribute('aria-invalid', String(!ok));
    $('#' + key + '-error').textContent = ok ? '' : t(rules[key].msg);
    return ok;
  }

  function bindForm() {
    const form = $('#contact-form');

    form.addEventListener('focusout', (e) => {
      if (rules[e.target.name]) validateField(form, e.target.name);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = $('#form-status');
      status.textContent = '';

      const results = Object.keys(rules).map((key) => validateField(form, key));
      if (results.every(Boolean)) {
        // Aquí se conecta un servicio como Formspree o un endpoint propio
        form.reset();
        Object.keys(rules).forEach((key) => {
          form.elements.namedItem(key).setAttribute('aria-invalid', 'false');
        });
        status.textContent = t('sent');
      } else {
        form.querySelector('[aria-invalid="true"]').focus();
      }
    });

    // Si ya inició sesión, se rellenan sus datos
    const s = getSession();
    if (s) {
      form.elements.namedItem('name').value = s.name;
      form.elements.namedItem('email').value = s.email;
      form.elements.namedItem('phone').value = s.phone || '';
    }
  }

  /* ---------- Carrito: cantidades ---------- */
  function updateCartUI() {
    const badge = $('#cart-count');
    if (!badge) return;
    const n = cart.reduce((sum, l) => sum + l.qty, 0);
    badge.textContent = String(n);
    badge.hidden = n === 0;
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }

  function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  const qtyInCart = (id) => {
    const line = cart.find((l) => l.id === id);
    return line ? line.qty : 0;
  };

  function findDish(id) {
    if (!data) return null;
    for (const r of data.regions) {
      for (const c of r.categories) {
        const dish = c.items.find((x) => x.id === id);
        if (dish) return dish;
      }
    }
    return null;
  }

  function cartLines() {
    return cart
      .map((line) => {
        const dish = findDish(line.id);
        return dish ? { id: dish.id, name: pick(dish.name), price: dish.price, qty: line.qty } : null;
      })
      .filter(Boolean);
  }

  const cartTotal = () => cartLines().reduce((sum, l) => sum + l.price * l.qty, 0);
  const pendingOrder = () => orders.find((o) => o.status === 'pendiente') || null;

  /** Vuelve a dibujar la carta y el pedido para que ambos muestren lo mismo */
  function refresh() {
    renderCategories();
    renderPedidos();
  }

  /** Fija la cantidad de un plato (0 lo quita, máximo 25) */
  function setQty(id, qty) {
    const n = Math.max(0, Math.min(MAX_QTY, qty));
    const line = cart.find((l) => l.id === id);
    if (n === 0) cart = cart.filter((l) => l.id !== id);
    else if (line) line.qty = n;
    else cart.push({ id, qty: n });
    saveCart();
    refresh();
  }

  /** Agregar requiere cuenta: si no hay sesión, se pide iniciar sesión primero */
  function addToCart(id) {
    if (!getSession()) {
      openAuth('modal', () => setQty(id, qtyInCart(id) + 1));
      return;
    }
    setQty(id, qtyInCart(id) + 1);
  }

  /** Selector − n + con la misma apariencia que en Pedidos */
  function qtyControl(id) {
    const n = qtyInCart(id);
    const wrap = el('div', 'qty qty-inline');

    const minus = el('button', 'qty-btn', '−');
    minus.type = 'button';
    minus.setAttribute('aria-label', cartTxt('less'));
    minus.addEventListener('click', () => setQty(id, n - 1));

    const plus = el('button', 'qty-btn', '+');
    plus.type = 'button';
    plus.disabled = n >= MAX_QTY;
    plus.setAttribute('aria-label', cartTxt('more'));
    plus.addEventListener('click', () => addToCart(id));

    wrap.append(minus, el('span', 'qty-num', String(n)), plus);
    return wrap;
  }

  /* ---------- Pedidos: carrito → factura → QR → historial ---------- */
  function confirmOrder() {
    if (!getSession()) {
      openAuth('modal', confirmOrder);
      return;
    }
    const lines = cartLines();
    if (!lines.length || pendingOrder()) return;

    const s = getSession();
    orders.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: new Date().toISOString(),
      client: { name: s.name, email: s.email, phone: s.phone || '' },
      items: lines.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
      total: cartTotal(),
      status: 'pendiente',
      endsAt: null
    });
    cart = [];
    saveCart();
    saveOrders();
    refresh();
  }

  /** Pasa de la factura al QR: aquí empiezan los 60 segundos */
  function startPayment(id) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    order.endsAt = Date.now() + PAY_SECONDS * 1000;
    saveOrders();
    renderPedidos();
    startCountdown();
  }

  function markPaid(id) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    order.status = 'pagado';
    order.endsAt = null;
    stopCountdown();
    saveOrders();
    refresh();
  }

  /** Se acabó el tiempo: el pedido queda en espera en el historial */
  function expirePayment() {
    const order = pendingOrder();
    if (!order) return;
    order.status = 'en_espera';
    order.endsAt = null;
    stopCountdown();
    saveOrders();
    renderPedidos();
  }

  /** Cancelar: los platos regresan al carrito (máximo 25 por plato) */
  function cancelOrder(id) {
    const order = orders.find((o) => o.id === id);
    if (!order || order.status !== 'pendiente') return;
    order.items.forEach(({ id: dishId, qty }) => {
      const line = cart.find((l) => l.id === dishId);
      if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
      else cart.push({ id: dishId, qty: Math.min(MAX_QTY, qty) });
    });
    orders = orders.filter((o) => o.id !== id);
    stopCountdown();
    saveCart();
    saveOrders();
    refresh();
  }

  function startCountdown() {
    stopCountdown();
    countdownTimer = setInterval(tick, 1000);
    tick();
  }

  function stopCountdown() {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  function tick() {
    const order = pendingOrder();
    if (!order || !order.endsAt) { stopCountdown(); return; }
    const left = secondsLeft(order);
    const node = $('#countdown');
    if (node) node.textContent = `${left} s`;
    if (left === 0) expirePayment();
  }

  /** Patrón visual tipo QR (simulado, no es un código real) */
  function buildQr(node, seed) {
    node.replaceChildren();
    let h = 7;
    for (const ch of seed) h = (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0;
    for (let i = 0; i < 21 * 21; i++) {
      h = (Math.imul(h, 1103515245) + 12345) >>> 0;
      node.append(el('span', ((h >>> 16) & 1) ? 'qr-cell on' : 'qr-cell'));
    }
  }

  function fmtDate(iso) {
    return new Date(iso).toLocaleString(lang === 'es' ? 'es-BO' : 'en-US', {
      dateStyle: 'medium', timeStyle: 'medium'
    });
  }

  function renderCart(view) {
    const lines = cartLines();
    if (!lines.length) {
      const box = el('div', 'empty-box');
      const go = el('button', 'add-btn add-detail', cartTxt('go_carta'));
      go.type = 'button';
      go.addEventListener('click', () => goTo('carta'));
      box.append(el('p', '', cartTxt('empty')), go);
      view.append(box);
      return;
    }

    const ul = el('ul', 'cart-list');
    lines.forEach((line) => {
      const li = el('li', 'cart-row');
      const info = el('div');
      info.append(el('h4', '', line.name), el('span', 'menu-price', `Bs ${line.price}`));

      const qty = el('div', 'qty');
      const minus = el('button', 'qty-btn', '−');
      minus.type = 'button';
      minus.setAttribute('aria-label', cartTxt('less'));
      minus.addEventListener('click', () => setQty(line.id, line.qty - 1));

      const plus = el('button', 'qty-btn', '+');
      plus.type = 'button';
      plus.disabled = line.qty >= MAX_QTY;
      plus.setAttribute('aria-label', cartTxt('more'));
      plus.addEventListener('click', () => setQty(line.id, line.qty + 1));

      qty.append(minus, el('span', 'qty-num', String(line.qty)), plus);
      li.append(info, qty);
      ul.append(li);
    });

    const total = el('div', 'cart-total');
    total.append(el('span', '', cartTxt('total')), el('span', '', `Bs ${cartTotal()}`));

    const confirm = el('button', 'confirm-btn', cartTxt('confirm'));
    confirm.type = 'button';
    confirm.addEventListener('click', confirmOrder);

    view.append(ul, total, confirm);
  }

  function renderFactura(view, order) {
    const card = el('article', 'invoice');
    card.append(el('h4', 'invoice-title', cartTxt('invoice')));

    const meta = el('div', 'invoice-meta');
    const dateP = el('p', '');
    dateP.append(el('strong', '', `${cartTxt('date')}: `), document.createTextNode(fmtDate(order.date)));
    const nameP = el('p', '');
    nameP.append(el('strong', '', `${cartTxt('client')}: `), document.createTextNode(order.client.name));
    const mailP = el('p', '', order.client.email);
    const phoneP = el('p', '', order.client.phone);
    meta.append(dateP, nameP, mailP, phoneP);

    const list = el('ul', 'invoice-list');
    order.items.forEach((it) => {
      const li = el('li', 'invoice-line');
      li.append(el('span', '', `${it.name} × ${it.qty}`), el('span', '', `Bs ${it.price * it.qty}`));
      list.append(li);
    });

    const total = el('div', 'invoice-total');
    total.append(el('span', '', cartTxt('total_pay')), el('span', '', `Bs ${order.total}`));

    const pay = el('button', 'confirm-btn', cartTxt('pay_qr'));
    pay.type = 'button';
    pay.addEventListener('click', () => startPayment(order.id));

    const cancel = el('button', 'cancel-btn', cartTxt('cancel'));
    cancel.type = 'button';
    cancel.addEventListener('click', () => cancelOrder(order.id));

    card.append(meta, list, total, pay, cancel);
    view.append(card);
  }

  function renderQr(view, order) {
    const card = el('article', 'invoice pay-box');
    card.append(el('h4', 'invoice-title', cartTxt('pay_title')));

    const qr = el('div', 'qr-sim');
    buildQr(qr, order.id);

    const amount = el('p', 'qr-amount', `Bs ${order.total}`);
    const sim = el('p', 'order-hint', cartTxt('qr_sim'));
    const timeLabel = el('p', 'order-hint', cartTxt('pay_time'));
    const countdown = el('p', 'countdown', `${secondsLeft(order)} s`);
    countdown.id = 'countdown';
    const hint = el('p', 'order-hint', cartTxt('pay_hint'));

    const paid = el('button', 'confirm-btn', cartTxt('paid'));
    paid.type = 'button';
    paid.addEventListener('click', () => markPaid(order.id));

    const cancel = el('button', 'cancel-btn', cartTxt('cancel'));
    cancel.type = 'button';
    cancel.addEventListener('click', () => cancelOrder(order.id));

    card.append(qr, amount, sim, timeLabel, countdown, hint, paid, cancel);
    view.append(card);
  }

  function renderHistory(view) {
    const history = orders.filter((o) => o.status !== 'pendiente');
    if (!history.length) return;

    view.append(el('h3', 'sub-title', cartTxt('history')));
    history.forEach((o) => {
      const card = el('article', 'order-card');
      const head = el('div', 'order-head');
      head.append(
        el('span', '', fmtDate(o.date)),
        el('span', `status-chip status-${o.status}`, cartTxt('status_' + o.status))
      );
      card.append(
        head,
        el('p', 'order-items', o.items.map((i) => `${i.qty} × ${i.name}`).join(', ')),
        el('p', 'order-total', `${cartTxt('total')}: Bs ${o.total}`)
      );
      if (o.status === 'en_espera') card.append(el('p', 'order-hint', cartTxt('hint_wait')));
      view.append(card);
    });
  }

  function renderPedidos() {
    const view = $('#pedidos-view');
    if (!view || !data) return;
    view.replaceChildren();
    updateCartUI();

    view.append(el('h3', 'panel-title', cartTxt('title')));

    const pending = pendingOrder();
    if (pending) {
      if (pending.endsAt) renderQr(view, pending);
      else renderFactura(view, pending);
    } else {
      renderCart(view);
    }

    renderHistory(view);
  }

  function bindCart() {
    updateCartUI();

    // Si la página se recargó durante el pago, se retoma el conteo
    const order = pendingOrder();
    if (order && order.endsAt) {
      if (secondsLeft(order) === 0) expirePayment();
      else startCountdown();
    }
  }

  /* ---------- Inicio ---------- */
  async function init() {
    document.documentElement.classList.add('js');

    $('#lang-toggle').addEventListener('click', () => applyLang(lang === 'es' ? 'en' : 'es'));

    applyTheme(theme);
    applyLang(lang);
    bindNav();
    bindDrawer();
    bindAuth();
    bindEntrance();
    bindMusic();
    bindCarousel();
    bindLightbox();
    bindForm();
    bindCart();
    showScreen('inicio');
    observeReveal($$('.reveal'));
    renderDrawerUser();

    try {
      data = await loadData();
      renderCategories();
      renderCarousel();
      renderReviews();
      renderPedidos();
    } catch (err) {
      console.error(err);
      $('#carta-view').textContent = t('loading_err');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();