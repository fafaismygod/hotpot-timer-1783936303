(function () {
  'use strict';

  // ── Built-in ingredient library ─────────────────────────
  const INGREDIENT_LIBRARY = [
    { name: '毛肚', seconds: 15, special: 'sevenup' },
    { name: '鸭肠', seconds: 10, special: 'sevenup' },
    { name: '牛百叶', seconds: 15, special: 'sevenup' },
    { name: '黄喉', seconds: 30 },
    { name: '肥牛卷', seconds: 15 },
    { name: '嫩牛肉', seconds: 45 },
    { name: '鸭血', seconds: 240 },
    { name: '午餐肉', seconds: 150 },
    { name: '脑花', seconds: 540 },
    { name: '鲜虾', seconds: 150 },
    { name: '蟹棒', seconds: 120 },
    { name: '贝类', seconds: 240 },
    { name: '鱿鱼', seconds: 45 },
    { name: '鱼片', seconds: 90 },
    { name: '牛肉丸', seconds: 270 },
    { name: '鱼丸', seconds: 210 },
    { name: '虾滑', seconds: 150 },
    { name: '蟹籽包', seconds: 240 },
    { name: '土豆片', seconds: 210 },
    { name: '藕片', seconds: 150 },
    { name: '冬瓜', seconds: 240 },
    { name: '白菜', seconds: 90 },
    { name: '生菜', seconds: 30 },
    { name: '茼蒿', seconds: 40 },
    { name: '海带', seconds: 90 },
    { name: '金针菇', seconds: 90 },
    { name: '香菇', seconds: 210 },
    { name: '杏鲍菇', seconds: 180 },
    { name: '平菇', seconds: 150 },
    { name: '豆腐', seconds: 150 },
    { name: '冻豆腐', seconds: 240 },
    { name: '豆皮', seconds: 90 },
    { name: '腐竹', seconds: 150 },
    { name: '千张', seconds: 90 },
    { name: '宽粉', seconds: 240 },
    { name: '红薯粉', seconds: 240 },
    { name: '方便面', seconds: 90 },
    { name: '饺子', seconds: 240 },
  ];

  const RING_R = 32;
  const RING_CIRC = 2 * Math.PI * RING_R;

  const KEY_STATE = 'hotpotState';
  const KEY_CUSTOM = 'hotpotCustom';

  // ── State ──────────────────────────────────────────────
  let order = [];
  let favorites = [];
  let loopOverride = {};
  let sevenOverride = {};   // key -> { enabled, count }
  let nameOverride = {};    // key -> string (built-in renames)
  let secondsOverride = {}; // key -> number (built-in time edits)
  let hiddenBuiltin = [];   // built-in names hidden via "删除"
  let customList = [];
  let settings = { bell: true, pulse: true, sevenUp: true, cols: 3, dingCount: 1, prepSec: 3 };
  const timers = {};
  const cardEls = {};

  let tickHandle = null;
  let drag = null;
  let pendingTap = null;
  let zoomedKey = null;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // ── Helpers ────────────────────────────────────────────
  function genId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }
  function bKey(name) { return 'b:' + name; }
  function cKey(id) { return 'c:' + id; }
  function defaultLoop(seconds) { return seconds <= 60; }

  function fmt(ms) {
    if (ms < 0) ms = 0;
    const s = Math.ceil(ms / 1000);
    if (s >= 60) {
      const m = Math.floor(s / 60);
      const ss = s % 60;
      return m + ':' + String(ss).padStart(2, '0');
    }
    return String(s);
  }
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  function showToast(msg) {
    const c = $('#toastContainer');
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; setTimeout(() => t.remove(), 250); }, 1800);
  }
  function formatSec(s) {
    if (s >= 60) {
      const m = Math.floor(s / 60);
      const ss = s % 60;
      return ss ? (m + '分' + ss + '秒') : (m + '分');
    }
    return s + '秒';
  }
  function sevenLabel(count) {
    const up = Math.floor(count / 2);
    const down = count - up;
    return up + '上' + down + '下';
  }

  // ── Ingredient list (merged, with overrides) ───────────
  function allIngredients() {
    const map = {};
    INGREDIENT_LIBRARY.forEach((it) => {
      if (hiddenBuiltin.indexOf(it.name) >= 0) return;
      const key = bKey(it.name);
      const baseSeven = it.special === 'sevenup';
      const ov = sevenOverride[key];
      map[key] = {
        key: key,
        origName: it.name,
        name: nameOverride[key] || it.name,
        seconds: (key in secondsOverride) ? secondsOverride[key] : it.seconds,
        custom: false,
        seven: ov ? { enabled: ov.enabled, count: ov.count } : { enabled: baseSeven, count: it.seconds }
      };
    });
    customList.forEach((it) => {
      const key = cKey(it.id);
      const baseSeven = it.special === 'sevenup';
      const ov = sevenOverride[key];
      map[key] = {
        key: key,
        origName: it.name,
        name: it.name,
        seconds: it.seconds,
        custom: true,
        id: it.id,
        seven: ov ? { enabled: ov.enabled, count: ov.count } : { enabled: baseSeven, count: it.sevenCount || it.seconds }
      };
    });
    return map;
  }

  function orderedKeys() {
    const all = allIngredients();
    const seen = {};
    const res = [];
    order.forEach((k) => { if (all[k] && !seen[k]) { seen[k] = 1; res.push(k); } });
    Object.keys(all).forEach((k) => { if (!seen[k]) { seen[k] = 1; res.push(k); } });
    return res;
  }

  function loopValue(key, seconds) {
    if (key in loopOverride) return loopOverride[key];
    return defaultLoop(seconds);
  }
  function getIngredient(key) { return allIngredients()[key]; }

  // ── Persistence ────────────────────────────────────────
  function loadState() {
    try {
      const raw = localStorage.getItem(KEY_STATE);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p.order)) order = p.order;
        if (Array.isArray(p.favorites)) favorites = p.favorites;
        if (p.loopOverride) loopOverride = p.loopOverride;
        if (p.sevenOverride) sevenOverride = p.sevenOverride;
        if (p.nameOverride) nameOverride = p.nameOverride;
        if (p.secondsOverride) secondsOverride = p.secondsOverride;
        if (Array.isArray(p.hiddenBuiltin)) hiddenBuiltin = p.hiddenBuiltin;
        if (p.settings) settings = Object.assign(settings, p.settings);
      }
    } catch (e) { /* ignore */ }
    try {
      const raw2 = localStorage.getItem(KEY_CUSTOM);
      if (raw2) customList = JSON.parse(raw2);
    } catch (e) { /* ignore */ }
  }
  function saveState() {
    try {
      localStorage.setItem(KEY_STATE, JSON.stringify({
        order, favorites, loopOverride, sevenOverride, nameOverride, secondsOverride, hiddenBuiltin, settings
      }));
    } catch (e) { /* ignore */ }
  }
  function saveCustom() {
    try { localStorage.setItem(KEY_CUSTOM, JSON.stringify(customList)); } catch (e) { /* ignore */ }
  }

  // ── Share encode/decode ─────────────────────────────────
  function encodeState() {
    const payload = { c: customList, o: order, f: favorites, l: loopOverride, v: sevenOverride, n: nameOverride, t: secondsOverride, h: hiddenBuiltin, s: settings };
    let s = btoa(encodeURIComponent(JSON.stringify(payload)));
    return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeState(str) {
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return JSON.parse(decodeURIComponent(atob(s)));
  }
  function applyShareHash() {
    if (!location.hash || location.hash.length < 5) return;
    const h = location.hash.slice(1);
    const eq = h.indexOf('=');
    if (eq < 0) return;
    const k = h.slice(0, eq);
    const v = h.slice(eq + 1);
    if (k !== 'd') return;
    try {
      const p = decodeState(v);
      if (Array.isArray(p.c)) customList = p.c;
      if (Array.isArray(p.o)) order = p.o;
      if (Array.isArray(p.f)) favorites = p.f;
      if (p.l) loopOverride = p.l;
      if (p.v) sevenOverride = p.v;
      if (p.n) nameOverride = p.n;
      if (p.t) secondsOverride = p.t;
      if (Array.isArray(p.h)) hiddenBuiltin = p.h;
      if (p.s) settings = Object.assign(settings, p.s);
      saveState(); saveCustom();
      history.replaceState(null, '', location.pathname + location.search);
      showToast('已导入分享的食材库');
    } catch (e) { /* ignore */ }
  }

  // ── Audio ──────────────────────────────────────────────
  let audioCtx = null;
  let silentAudio = null;
  function initAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    ensureSilentAudio();
    // play a silent buffer inside the user gesture to fully unlock iOS audio
    try {
      const buffer = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      src.connect(audioCtx.destination);
      src.start(0);
    } catch (e) {}
  }
  function ensureSilentAudio() {
    if (silentAudio) {
      if (silentAudio.paused) { silentAudio.play().catch(function () {}); }
      return;
    }
    var sampleRate = 8000, numSamples = sampleRate;
    var buf = new ArrayBuffer(44 + numSamples * 2);
    var view = new DataView(buf);
    var i, s;
    var writeStr = function (off, str) { for (i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
    writeStr(0, 'RIFF'); view.setUint32(4, 36 + numSamples * 2, true); writeStr(8, 'WAVE'); writeStr(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeStr(36, 'data'); view.setUint32(40, numSamples * 2, true);
    for (s = 0; s < numSamples; s++) view.setInt16(44 + s * 2, 0, true);
    try {
      var blob = new Blob([buf], { type: 'audio/wav' });
      var url = URL.createObjectURL(blob);
      silentAudio = document.createElement('audio');
      silentAudio.src = url; silentAudio.loop = true;
      silentAudio.setAttribute('playsinline', '');
      silentAudio.volume = 0.0001;
      silentAudio.play().catch(function () {});
    } catch (e) { /* ignore */ }
  }
  function tone(freq, dur, vol, type) {
    if (!audioCtx) return;
    const t0 = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }
  function playDing() { initAudio(); tone(880, 0.25, 0.32, 'sine'); setTimeout(() => tone(1175, 0.25, 0.28, 'sine'), 70); }
  function playUp() { initAudio(); tone(880, 0.12, 0.28, 'sine'); }
  function playDown() { initAudio(); tone(440, 0.12, 0.28, 'sine'); }
  function playAck() { initAudio(); tone(660, 0.09, 0.22, 'sine'); }
  function playStart() { initAudio(); tone(784, 0.12, 0.3, 'sine'); setTimeout(() => tone(1047, 0.18, 0.3, 'sine'), 90); }

  // ── Render: ingredient grid ─────────────────────────────
  function applyCols() {
    const n = settings.cols || 3;
    const grid = $('#ingredientGrid');
    grid.style.gridTemplateColumns = 'repeat(' + n + ', 1fr)';
    grid.classList.remove('cols-2', 'cols-3', 'cols-4');
    grid.classList.add('cols-' + n);
  }
  function setCols(n) {
    if (n === settings.cols) return;
    settings.cols = n;
    saveState();
    applyCols();
    renderMore();
  }

  function renderGrid() {
    const grid = $('#ingredientGrid');
    applyCols();
    grid.innerHTML = '';
    for (const k in cardEls) delete cardEls[k];

    const keys = orderedKeys();
    const all = allIngredients();
    keys.forEach((key) => {
      const it = all[key];
      if (!it) return;
      grid.appendChild(buildCard(it));
    });

    const addCard = document.createElement('div');
    addCard.className = 'card add-card';
    addCard.innerHTML = '<span class="add-icon">＋</span><span class="add-text">自定义</span>';
    addCard.addEventListener('click', openAddCustom);
    grid.appendChild(addCard);

    for (const k in timers) updateTimerCard(k);
  }

  const SEVEN_BADGE_SVG = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 6 Q4 3 6 6 T10 6 T14 6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M2 11 Q4 8 6 11 T10 11 T14 11" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const FAV_BADGE_SVG = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 2 L9.8 5.6 L13.8 6.2 L10.9 9 L11.6 13 L8 11 L4.4 13 L5.1 9 L2.2 6.2 L6.2 5.6 Z" fill="#fff"/></svg>';

  function buildCard(it) {
    const key = it.key;
    const isFav = favorites.indexOf(key) >= 0;
    const loop = loopValue(key, it.seconds);
    const sevenOn = it.seven.enabled;

    const card = document.createElement('div');
    card.className = 'card' + (isFav ? ' is-fav' : '');
    card.dataset.key = key;
    card.dataset.seconds = it.seconds;
    card.dataset.seven = sevenOn ? '1' : '0';

    // badges (top-left, 2x2 grid, star first then seven-up)
    const badges = document.createElement('div');
    badges.className = 'card-badges';
    if (isFav) {
      const b = document.createElement('div');
      b.className = 'badge badge-fav';
      b.innerHTML = FAV_BADGE_SVG;
      badges.appendChild(b);
    }
    if (sevenOn) {
      const b = document.createElement('div');
      b.className = 'badge badge-seven';
      b.innerHTML = SEVEN_BADGE_SVG;
      b.title = sevenLabel(it.seven.count);
      badges.appendChild(b);
    }
    card.appendChild(badges);

    // menu button (top-right)
    const menuBtn = document.createElement('button');
    menuBtn.className = 'card-menu';
    menuBtn.innerHTML = '⋯';
    menuBtn.setAttribute('aria-label', '更多选项');
    menuBtn.addEventListener('click', (e) => { e.stopPropagation(); openSettings(key); });
    card.appendChild(menuBtn);

    const icon = document.createElement('div');
    icon.className = 'card-icon';
    icon.innerHTML = window.getFoodIcon(it.origName, it.custom);

    const top = document.createElement('div');
    top.className = 'card-top';
    top.innerHTML = '<span class="card-name">' + escapeHtml(it.name) + '</span><span class="card-sec">' + formatSec(it.seconds) + '</span>';

    const timerBtn = document.createElement('button');
    timerBtn.className = 'timer idle';
    timerBtn.setAttribute('aria-label', '计时');
    timerBtn.innerHTML =
      '<svg viewBox="0 0 72 72">' +
      '<circle class="ring-bg" cx="36" cy="36" r="' + RING_R + '"></circle>' +
      '<circle class="ring-fg" cx="36" cy="36" r="' + RING_R + '" style="stroke-dasharray:' + RING_CIRC + ';stroke-dashoffset:0"></circle>' +
      '</svg>' +
      '<span class="timer-center"><span class="play">▶</span></span>';
    // timer button: instant response, never triggers zoom
    // unlock audio on touchstart (before click) so first tap has sound
    timerBtn.addEventListener('touchstart', () => { initAudio(); }, { passive: true });
    timerBtn.addEventListener('click', (e) => { e.stopPropagation(); onTimerTap(key); });

    // double-tap on card body (not timer, not menu, not badges) → zoom
    let lastCardTap = 0;
    card.addEventListener('click', (e) => {
      if (e.target.closest('.timer, .card-menu, .card-badges')) return;
      const now = Date.now();
      if (now - lastCardTap < 350) {
        e.preventDefault();
        e.stopPropagation();
        toggleZoom(key);
        lastCardTap = 0; // avoid third click re-zooming
        return;
      }
      lastCardTap = now;
    });

    card.appendChild(icon);
    card.appendChild(top);
    card.appendChild(timerBtn);

    attachDrag(card);

    cardEls[key] = { card: card, timerBtn: timerBtn, ring: timerBtn.querySelector('.ring-fg'), center: timerBtn.querySelector('.timer-center') };
    return card;
  }

  // ── Settings sheet ─────────────────────────────────────
  let settingsKey = null;
  let settingsForm = { fav: false, loop: false, seven: false };

  function openSettings(key) {
    const it = getIngredient(key);
    if (!it) return;
    settingsKey = key;
    $('#settingsTitle').textContent = '食材设置';
    const body = $('#settingsBody');
    body.innerHTML =
      '<div class="form-group"><label for="setName">名称</label><input id="setName" type="text" maxlength="20" value="' + escapeHtml(it.name) + '"></div>' +
      '<div class="form-group"><label>烫煮时间</label><div class="time-split"><input id="setMinutes" type="number" min="0" max="60" inputmode="numeric" value="' + Math.floor(it.seconds / 60) + '" placeholder="分"><span class="time-unit">分</span><input id="setSecsInput" type="number" min="0" max="59" inputmode="numeric" value="' + (it.seconds % 60) + '" placeholder="秒"><span class="time-unit">秒</span></div></div>' +
      '<div class="settings-row"><span class="settings-label">收藏</span><button class="ios-switch" id="setFav" role="switch" aria-checked="' + (favorites.indexOf(key) >= 0) + '"></button></div>' +
      '<div class="settings-row"><span class="settings-label">循环</span><button class="ios-switch" id="setLoop" role="switch" aria-checked="' + loopValue(key, it.seconds) + '"></button></div>' +
      '<div class="settings-row"><span class="settings-label">七上八下模式</span><button class="ios-switch" id="setSeven" role="switch" aria-checked="' + it.seven.enabled + '"></button></div>' +
      '<div class="form-group" id="sevenCountWrap" style="' + (it.seven.enabled ? '' : 'display:none') + '"><label for="setSevenCount">次数 <span class="seven-preview" id="sevenPreview">' + sevenLabel(it.seven.count) + '</span></label><input id="setSevenCount" type="number" min="2" max="60" inputmode="numeric" value="' + it.seven.count + '"></div>' +
      '<button class="btn btn-danger btn-block" id="setDelete">删除食材</button>';

    $('#settingsModal').style.display = '';

    // auto-save helpers
    function applyFav() {
      const v = $('#setFav').getAttribute('aria-checked') === 'true';
      const wasFav = favorites.indexOf(key) >= 0;
      if (v && !wasFav) {
        favorites.push(key);
        const oi = order.indexOf(key);
        if (oi >= 0) { order.splice(oi, 1); order.unshift(key); }
      } else if (!v && wasFav) {
        const fi = favorites.indexOf(key); favorites.splice(fi, 1);
      }
      saveState();
      updateCardBadges(key);
    }
    function readSeconds() {
      const m = parseInt($('#setMinutes').value, 10) || 0;
      const s = parseInt($('#setSecsInput').value, 10) || 0;
      return m * 60 + s;
    }
    function applyLoop() {
      const v = $('#setLoop').getAttribute('aria-checked') === 'true';
      const sec = readSeconds() || it.seconds;
      if (v === defaultLoop(sec)) delete loopOverride[key];
      else loopOverride[key] = v;
      saveState();
      if (timers[key]) timers[key].loop = v;
    }
    function applySeven() {
      const v = $('#setSeven').getAttribute('aria-checked') === 'true';
      const cnt = Math.max(2, parseInt($('#setSevenCount').value, 10) || it.seven.count);
      const baseOn = it.custom ? (it.special === 'sevenup') : ((INGREDIENT_LIBRARY.find((b) => b.name === it.origName) || {}).special === 'sevenup');
      if (v === baseOn && cnt === it.seconds) delete sevenOverride[key];
      else sevenOverride[key] = { enabled: v, count: cnt };
      if (it.custom) {
        it.special = v ? 'sevenup' : null;
        it.sevenCount = cnt;
        saveCustom();
      }
      saveState();
      stopTimer(key);
      updateCardBadges(key);
      cardEls[key].card.dataset.seven = v ? '1' : '0';
    }
    function applyName() {
      const name = $('#setName').value.trim();
      if (!name) return;
      if (it.custom) {
        it.name = name; saveCustom();
      } else {
        nameOverride[key] = (name === it.origName) ? null : name;
      }
      saveState();
      const nm = cardEls[key].card.querySelector('.card-name');
      if (nm) nm.textContent = name;
    }
    function applySeconds() {
      const sec = readSeconds();
      if (!sec || sec < 1) return;
      if (it.custom) {
        it.seconds = sec; saveCustom();
      } else {
        const baseSec = (INGREDIENT_LIBRARY.find((b) => b.name === it.origName) || {}).seconds;
        if (sec === baseSec) delete secondsOverride[key]; else secondsOverride[key] = sec;
      }
      saveState();
      stopTimer(key);
      const sc = cardEls[key].card.querySelector('.card-sec');
      if (sc) sc.textContent = formatSec(sec);
      cardEls[key].card.dataset.seconds = sec;
    }

    $('#setFav').addEventListener('click', () => {
      const v = $('#setFav').getAttribute('aria-checked') !== 'true';
      $('#setFav').setAttribute('aria-checked', String(v));
      applyFav();
    });
    $('#setLoop').addEventListener('click', () => {
      const v = $('#setLoop').getAttribute('aria-checked') !== 'true';
      $('#setLoop').setAttribute('aria-checked', String(v));
      applyLoop();
    });
    $('#setSeven').addEventListener('click', () => {
      const v = $('#setSeven').getAttribute('aria-checked') !== 'true';
      $('#setSeven').setAttribute('aria-checked', String(v));
      $('#sevenCountWrap').style.display = v ? '' : 'none';
      applySeven();
    });
    $('#setSevenCount').addEventListener('input', () => {
      const v = parseInt($('#setSevenCount').value, 10);
      if (v && v >= 2) {
        $('#sevenPreview').textContent = sevenLabel(v);
        applySeven();
      }
    });
    $('#setName').addEventListener('input', applyName);
    $('#setMinutes').addEventListener('input', applySeconds);
    $('#setSecsInput').addEventListener('input', applySeconds);
    $('#setDelete').addEventListener('click', () => { closeSettings(); deleteIngredient(key); });
  }

  function updateCardBadges(key) {
    const refs = cardEls[key];
    if (!refs) return;
    const it = getIngredient(key);
    if (!it) return;
    const isFav = favorites.indexOf(key) >= 0;
    const sevenOn = it.seven.enabled;
    let badges = refs.card.querySelector('.card-badges');
    if (!badges) return;
    badges.innerHTML = '';
    if (isFav) {
      const b = document.createElement('div');
      b.className = 'badge badge-fav';
      b.innerHTML = FAV_BADGE_SVG;
      badges.appendChild(b);
    }
    if (sevenOn) {
      const b = document.createElement('div');
      b.className = 'badge badge-seven';
      b.innerHTML = SEVEN_BADGE_SVG;
      b.title = sevenLabel(it.seven.count);
      badges.appendChild(b);
    }
    refs.card.classList.toggle('is-fav', isFav);
  }

  function closeSettings() { $('#settingsModal').style.display = 'none'; settingsKey = null; }

  function toggleZoom(key) {
    if (zoomedKey === key) {
      // unzoom instantly, no animation
      zoomedKey = null;
      const card = cardEls[key] ? cardEls[key].card : null;
      if (card) card.classList.remove('card-zoom');
      $('#app').classList.remove('has-zoom');
    } else {
      if (zoomedKey) {
        const prev = cardEls[zoomedKey] ? cardEls[zoomedKey].card : null;
        if (prev) prev.classList.remove('card-zoom');
      }
      zoomedKey = key;
      const card = cardEls[key] ? cardEls[key].card : null;
      if (!card) return;
      $('#app').classList.add('has-zoom');
      card.classList.add('card-zoom');
    }
  }

  function deleteIngredient(key) {
    const it = getIngredient(key);
    if (!it) return;
    stopTimer(key);
    if (it.custom) {
      customList = customList.filter((c) => c.id !== it.id);
      delete loopOverride[key]; delete sevenOverride[key];
    } else {
      if (hiddenBuiltin.indexOf(it.origName) < 0) hiddenBuiltin.push(it.origName);
    }
    order = order.filter((k) => k !== key);
    favorites = favorites.filter((k) => k !== key);
    saveState(); saveCustom();
    renderGrid();
    showToast('已删除');
  }

  function resetAllDefaults() {
    order = []; favorites = []; loopOverride = {}; sevenOverride = {};
    nameOverride = {}; secondsOverride = {}; hiddenBuiltin = [];
    INGREDIENT_LIBRARY.forEach((it) => { order.push(bKey(it.name)); });
    customList = [];
    settings = { bell: true, pulse: true, sevenUp: true, cols: 3, dingCount: 1, prepSec: 3 };
    for (const k in timers) stopTimer(k);
    try { localStorage.removeItem(KEY_STATE); localStorage.removeItem(KEY_CUSTOM); } catch (e) {}
    renderGrid();
    renderMore();
    showToast('已恢复默认设置');
  }

  // ── Timer logic ────────────────────────────────────────
  function prepMs() { return (settings.prepSec || 3) * 1000; }

  function onTimerTap(key) {
    initAudio();
    const it = getIngredient(key);
    if (!it) return;
    const t = timers[key];
    if (!t) {
      startPrep(key);
    } else if (t.phase === 'prep') {
      stopTimer(key);
    } else if (t.phase === 'run' && t.running) {
      stopTimer(key);
    } else if (t.phase === 'done') {
      stopTimer(key);
    }
  }

  function startPrep(key) {
    const it = getIngredient(key);
    if (!it) return;
    playAck();
    timers[key] = {
      key: key,
      name: it.name,
      seconds: it.seconds,
      seven: it.seven,
      phase: 'prep',
      prepEndAt: Date.now() + prepMs(),
      running: false,
      loop: loopValue(key, it.seconds),
      lastPhase: -1,
      done: false
    };
    updateTimerCard(key);
    ensureTick();
  }

  function startRun(key) {
    const t = timers[key];
    if (!t) return;
    t.phase = 'run';
    t.running = true;
    t.endAt = Date.now() + t.seconds * 1000;
    t.lastPhase = -1;
    playStart();
    updateTimerCard(key);
  }

  function stopTimer(key) { delete timers[key]; updateTimerCard(key); }

  function ensureTick() { if (!tickHandle) tickHandle = setInterval(updateAll, 200); }
  function maybeStopTick() {
    let any = false;
    for (const k in timers) { any = true; break; }
    if (!any && tickHandle) { clearInterval(tickHandle); tickHandle = null; }
  }

  function updateAll() {
    const now = Date.now();
    for (const key in timers) {
      const t = timers[key];
      if (t.phase === 'prep') {
        const r = t.prepEndAt - now;
        if (r <= 0) {
          startRun(key);
        } else {
          updatePrepCard(key, r);
        }
      } else if (t.phase === 'run' && t.running) {
        const remaining = t.endAt - now;
        if (remaining <= 0) {
          onCycleComplete(key);
        } else {
          updateTimerCard(key, remaining);
          if (t.seven.enabled && settings.sevenUp) updateSevenUp(key, remaining);
        }
      }
    }
    maybeStopTick();
  }

  function onCycleComplete(key) {
    const t = timers[key];
    if (!t) return;
    if (settings.bell) {
      if (settings.dingCount === 3) {
        playDing();
        setTimeout(() => playDing(), 400);
        setTimeout(() => playDing(), 800);
      } else {
        playDing();
      }
    }
    if (settings.pulse) {
      const refs = cardEls[key];
      if (refs) {
        refs.card.classList.remove('pulse');
        void refs.card.offsetWidth;
        refs.card.classList.add('pulse');
        setTimeout(() => refs.card.classList.remove('pulse'), 1400);
      }
    }
    if (t.loop) {
      t.endAt = Date.now() + t.seconds * 1000;
      t.lastPhase = -1;
      updateTimerCard(key, t.seconds * 1000);
    } else {
      t.running = false;
      t.phase = 'done';
      t.done = true;
      updateTimerCard(key, 0);
      maybeStopTick();
    }
  }

  function updatePrepCard(key, remaining) {
    const refs = cardEls[key];
    if (!refs) return;
    const sec = Math.ceil(remaining / 1000);
    const progress = remaining / prepMs();
    const offset = RING_CIRC * (1 - Math.max(0, Math.min(1, progress)));
    refs.ring.style.strokeDashoffset = String(offset);
    refs.timerBtn.className = 'timer prep';
    refs.center.innerHTML = '<span class="prep-text">' + sec + '</span>';
    refs.card.classList.remove('sevenup-up', 'sevenup-down', 'done-state');
  }

  function updateTimerCard(key, remainingOverride) {
    const refs = cardEls[key];
    if (!refs) return;
    const t = timers[key];
    const ring = refs.ring, center = refs.center, btn = refs.timerBtn, card = refs.card;

    card.classList.remove('sevenup-up', 'sevenup-down');

    if (!t) {
      btn.className = 'timer idle';
      ring.style.strokeDashoffset = '0';
      center.innerHTML = '<span class="play">▶</span>';
      card.classList.remove('done-state');
      return;
    }
    if (t.phase === 'prep') {
      updatePrepCard(key, Math.max(0, t.prepEndAt - Date.now()));
      return;
    }
    if (t.phase === 'done' || (t.done && !t.running)) {
      btn.className = 'timer done';
      ring.style.strokeDashoffset = String(RING_CIRC);
      center.innerHTML = '<span class="done-text">好</span>';
      card.classList.add('done-state');
      return;
    }
    if (!t.running) {
      btn.className = 'timer idle';
      ring.style.strokeDashoffset = '0';
      center.innerHTML = '<span class="play">▶</span>';
      card.classList.remove('done-state');
      return;
    }
    const remaining = (remainingOverride !== undefined) ? remainingOverride : Math.max(0, t.endAt - Date.now());
    const progress = remaining / (t.seconds * 1000);
    const offset = RING_CIRC * (1 - Math.max(0, Math.min(1, progress)));
    ring.style.strokeDashoffset = String(offset);
    btn.className = 'timer running';

    if (t.seven.enabled && settings.sevenUp) {
      if (center.dataset.seven !== '1') {
        center.dataset.seven = '1';
        center.innerHTML = '<span class="seven-text">提↑</span>';
      }
    } else {
      center.dataset.seven = '0';
      center.innerHTML = '<span>' + escapeHtml(fmt(remaining)) + '</span>';
    }
  }

  function updateSevenUp(key, remaining) {
    const t = timers[key];
    const refs = cardEls[key];
    if (!t || !refs) return;
    const total = t.seconds * 1000;
    const elapsed = total - remaining;
    const phaseDur = total / Math.max(1, t.seven.count);
    const phaseIdx = Math.floor(elapsed / phaseDur);
    const up = phaseIdx % 2 === 0;
    refs.card.classList.toggle('sevenup-up', up);
    refs.card.classList.toggle('sevenup-down', !up);
    refs.center.innerHTML = '<span class="seven-text">' + (up ? '提↑' : '放↓') + '</span>';
    if (phaseIdx !== t.lastPhase) {
      t.lastPhase = phaseIdx;
      if (up) playUp(); else playDown();
    }
  }

  // ── Drag reorder (card stays in DOM as the moving gap) ──
  function attachDrag(card) {
    let pressTimer = null;
    let startX = 0, startY = 0;
    let started = false;

    card.addEventListener('touchstart', (e) => {
      if (e.target.closest('.timer, .card-menu, .card-badges')) return;
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      started = false;
      const touchId = e.touches[0].identifier;
      pressTimer = setTimeout(() => {
        if (e.touches.length !== 1 || e.touches[0].identifier !== touchId) return;
        enterDrag(card, startX, startY);
        started = true;
      }, 300);
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (pressTimer && !started) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      }
    }, { passive: true });

    card.addEventListener('touchend', () => {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
    }, { passive: true });
  }

  function enterDrag(card, x, y) {
    const rect = card.getBoundingClientRect();
    const clone = card.cloneNode(true);
    clone.classList.add('drag-clone');
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    document.body.appendChild(clone);

    // card itself becomes the visual gap, stays in DOM (keeps touch target alive on iOS)
    card.classList.add('drag-gap');

    drag = {
      card: card,
      clone: clone,
      offsetX: x - rect.left,
      offsetY: y - rect.top
    };

    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd, { passive: false });
    document.addEventListener('touchcancel', onDragEnd, { passive: false });
  }

  function findInsertIndex(x, y) {
    const grid = $('#ingredientGrid');
    const items = Array.from(grid.querySelectorAll('.card')).filter((el) => !el.classList.contains('drag-gap') && !el.classList.contains('add-card'));
    if (!items.length) return 0;

    const r0 = items[0].getBoundingClientRect();
    // detect column count from first row
    let cols = 1;
    for (let i = 1; i < items.length; i++) {
      if (Math.abs(items[i].getBoundingClientRect().top - r0.top) > 2) break;
      cols++;
    }
    // step sizes between cells (cell + gap)
    const colStep = cols > 1 ? (items[1].getBoundingClientRect().left - r0.left) : r0.width;
    const rowStep = items.length > cols ? (items[cols].getBoundingClientRect().top - r0.top) : r0.height + 10;

    // map finger to grid coordinates using round (snaps to nearest cell boundary)
    const col = Math.max(0, Math.round((x - r0.left) / colStep));
    const row = Math.max(0, Math.round((y - r0.top) / rowStep));
    const idx = row * cols + col;
    return Math.max(0, Math.min(items.length, idx));
  }

  function moveGapTo(idx) {
    const grid = $('#ingredientGrid');
    const items = Array.from(grid.querySelectorAll('.card')).filter((el) => !el.classList.contains('drag-gap') && !el.classList.contains('add-card'));
    if (idx >= items.length) {
      const addCard = grid.querySelector('.add-card');
      if (addCard) grid.insertBefore(drag.card, addCard);
    } else {
      grid.insertBefore(drag.card, items[idx]);
    }
  }

  function onDragMove(e) {
    if (!drag) return;
    e.preventDefault();
    const t = e.touches[0];
    drag.clone.style.left = (t.clientX - drag.offsetX) + 'px';
    drag.clone.style.top = (t.clientY - drag.offsetY) + 'px';
    const idx = findInsertIndex(t.clientX, t.clientY);
    moveGapTo(idx);
  }

  function onDragEnd() {
    if (!drag) return;
    drag.card.classList.remove('drag-gap');
    drag.clone.remove();
    const grid = $('#ingredientGrid');
    const items = Array.from(grid.querySelectorAll('.card')).filter((el) => !el.classList.contains('add-card'));
    order = items.map((el) => el.dataset.key).filter(Boolean);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
    document.removeEventListener('touchcancel', onDragEnd);
    saveState();
    drag = null;
  }

  // ── Custom ingredient add ──────────────────────────────
  let customSevenVal = false;
  function openAddCustom() {
    customSevenVal = false;
    $('#customTitle').textContent = '添加食材';
    $('#customId').value = '';
    $('#customName').value = '';
    $('#customMinutes').value = '0';
    $('#customSecsInput').value = '0';
    $('#swCustomSeven').setAttribute('aria-checked', 'false');
    $('#customModal').style.display = '';
  }
  function closeCustomModal() { $('#customModal').style.display = 'none'; }
  function saveCustomFromForm() {
    const name = $('#customName').value.trim();
    const m = parseInt($('#customMinutes').value, 10) || 0;
    const s = parseInt($('#customSecsInput').value, 10) || 0;
    const sec = m * 60 + s;
    if (!name) { showToast('请输入食材名称'); return; }
    if (!sec || sec < 1) { showToast('请输入有效时间'); return; }
    const special = customSevenVal ? 'sevenup' : null;
    const id = genId();
    customList.push({ id: id, name: name, seconds: sec, special: special, sevenCount: sec });
    // ensure new custom goes to end of list
    order = orderedKeys();
    order.push(cKey(id));
    saveCustom(); saveState();
    closeCustomModal();
    renderGrid();
    showToast('已添加');
  }

  // ── More view ──────────────────────────────────────────
  function renderMore() {
    $('#swBell').setAttribute('aria-checked', String(settings.bell));
    $('#swPulse').setAttribute('aria-checked', String(settings.pulse));
    $('#swSevenUp').setAttribute('aria-checked', String(settings.sevenUp));
    $$('#segCols .seg-item').forEach((el) => {
      el.classList.toggle('active', parseInt(el.dataset.cols) === settings.cols);
    });
    $$('#segDing .seg-item').forEach((el) => {
      el.classList.toggle('active', parseInt(el.dataset.ding) === settings.dingCount);
    });
    $$('#segPrep .seg-item').forEach((el) => {
      el.classList.toggle('active', parseInt(el.dataset.prep) === settings.prepSec);
    });
  }
  function setSetting(name, val) {
    settings[name] = val;
    saveState();
    if (name === 'sevenUp' && !val) {
      for (const k in timers) {
        const refs = cardEls[k];
        if (refs) { refs.card.classList.remove('sevenup-up', 'sevenup-down'); refs.center.dataset.seven = '0'; }
      }
    }
  }

  // ── Tab navigation ─────────────────────────────────────
  function switchView(name) {
    $$('.view').forEach((v) => v.classList.toggle('view-active', v.id === name));
    $$('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.view === name));
    if (name === 'moreView') renderMore();
    window.scrollTo(0, 0);
  }

  // ── Event bindings ─────────────────────────────────────
  function bindEvents() {
    $$('.nav-item').forEach((n) => n.addEventListener('click', () => switchView(n.dataset.view)));

    $('#swBell').addEventListener('click', () => { settings.bell = !settings.bell; setSetting('bell', settings.bell); renderMore(); });
    $('#swPulse').addEventListener('click', () => { settings.pulse = !settings.pulse; setSetting('pulse', settings.pulse); renderMore(); });
    $('#swSevenUp').addEventListener('click', () => { settings.sevenUp = !settings.sevenUp; setSetting('sevenUp', settings.sevenUp); renderMore(); });

    $$('#segCols .seg-item').forEach((el) => {
      el.addEventListener('click', () => setCols(parseInt(el.dataset.cols)));
    });

    $$('#segDing .seg-item').forEach((el) => {
      el.addEventListener('click', () => {
        settings.dingCount = parseInt(el.dataset.ding);
        saveState();
        renderMore();
        // preview: play the selected pattern
        if (settings.bell) {
          if (settings.dingCount === 3) { playDing(); setTimeout(() => playDing(), 400); setTimeout(() => playDing(), 800); }
          else playDing();
        }
      });
    });

    $$('#segPrep .seg-item').forEach((el) => {
      el.addEventListener('click', () => {
        settings.prepSec = parseInt(el.dataset.prep);
        saveState();
        renderMore();
      });
    });

    $('#resetBtn').addEventListener('click', resetAllDefaults);

    $('#aboutBtn').addEventListener('click', () => {
      const t = $('#aboutText');
      t.style.display = t.style.display ? '' : 'none';
    });

    // custom add modal
    $('#customClose').addEventListener('click', closeCustomModal);
    $('#customCancel').addEventListener('click', closeCustomModal);
    $('#customForm').addEventListener('submit', (e) => { e.preventDefault(); saveCustomFromForm(); });
    $('#swCustomSeven').addEventListener('click', (e) => {
      e.preventDefault();
      customSevenVal = !customSevenVal;
      $('#swCustomSeven').setAttribute('aria-checked', String(customSevenVal));
    });
    $('#customModal').addEventListener('click', (e) => { if (e.target === $('#customModal')) closeCustomModal(); });

    // settings modal close
    $('#settingsClose').addEventListener('click', closeSettings);
    $('#settingsModal').addEventListener('click', (e) => { if (e.target === $('#settingsModal')) closeSettings(); });
  }

  // ── Service worker ─────────────────────────────────────
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // ── Visibility: resume silent audio on return ──────────
  function onVisible() {
    if (document.hidden) return;
    if (silentAudio && silentAudio.paused) { silentAudio.play().catch(function () {}); }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    updateAll();
  }

  // ── Init ───────────────────────────────────────────────
  function init() {
    loadState();
    if (!order.length) {
      INGREDIENT_LIBRARY.forEach((it) => { order.push(bKey(it.name)); });
      customList.forEach((it) => { order.push(cKey(it.id)); });
    }
    applyShareHash();
    renderGrid();
    renderMore();
    bindEvents();
    registerSW();

    // first-touch unlocks audio on iOS (before any timer starts)
    var audioInited = false;
    document.addEventListener('touchstart', function () {
      if (!audioInited) { initAudio(); audioInited = true; }
    }, { passive: true });

    // Media Session: show in Dynamic Island / lock screen (from silent audio)
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: '火锅计时',
          artist: '计时器运行中',
          artwork: [{ src: 'icon.svg', sizes: '512x512', type: 'image/svg+xml' }]
        });
        navigator.mediaSession.setActionHandler('pause', () => {});
        navigator.mediaSession.setActionHandler('play', () => {});
      } catch (e) {}
    }
    document.addEventListener('visibilitychange', onVisible);
    ensureTick();
    updateAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
