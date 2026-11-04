/**

 * Windows XP Portfolio Enhancements

 * - Analog Clock & Spiral Calendar Desktop Gadgets

 * - Display & System Settings App

 * - Advanced Terminal Commands Dispatcher

 * - Theme & Wallpaper Manager (Luna Blue, Olive, Silver, Royale, Dark XP)

 * - Authentic Web Audio Synthesizer (XP Ding, Error, Click, Startup, Shutdown)

 */



(function () {

  'use strict';



  // --------------------------------------------------------------------------

  // Configuration & Persistent State

  // --------------------------------------------------------------------------

  const STORAGE_KEY = 'xp_portfolio_preferences_v1';

  const defaultState = {

    theme: 'luna', // luna | olive | silver | royale | dark

    wallpaper: 'bliss', // bliss | autumn | desert | azul | custom

    customWallpaperUrl: '',

    volume: 0.6,

    isMuted: false,

    soundOnClick: true,

    showGadgets: true,
    
    crtEffect: false,

    clippyVoice: true,

    timeFormat: '12h' // 12h | 24h

  };



  let state = { ...defaultState };



  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {

      state = { ...defaultState, ...JSON.parse(saved) };

    }

  } catch (e) {

    console.warn('Could not load preferences from localStorage', e);

  }



  function saveState() {

    try {

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    } catch (e) {

      console.warn('Could not save preferences', e);

    }

  }



  // --------------------------------------------------------------------------

  // Web Audio Synthesizer (Authentic Retro Sound Effects)

  // --------------------------------------------------------------------------

  let audioCtx = null;



  function getAudioContext() {

    if (!audioCtx) {

      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (AudioContext) {

        audioCtx = new AudioContext();

      }

    }

    if (audioCtx && audioCtx.state === 'suspended') {

      audioCtx.resume();

    }

    return audioCtx;

  }



  const SoundManager = {

    playChord: function () { this.playDing(); },

    playAsterisk: function () { this.playDing(); },



    playDing: function () {

      if (state.isMuted) return;

      try {

        const ctx = getAudioContext();

        if (!ctx) return;

        const now = ctx.currentTime;

        const osc = ctx.createOscillator();

        const gain = ctx.createGain();



        osc.type = 'sine';

        osc.frequency.setValueAtTime(1046.5, now); // C6 bell tone

        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.6);



        const vol = state.volume * 0.4;

        gain.gain.setValueAtTime(vol, now);

        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);



        osc.connect(gain);

        gain.connect(ctx.destination);



        osc.start(now);

        osc.stop(now + 0.75);

      } catch (err) {

        console.warn('Audio play error', err);

      }

    },



    playRecycle: function () {

      if (state.isMuted) return;

      try {

        const ctx = getAudioContext();

        if (!ctx) return;

        const now = ctx.currentTime;

        const bufferSize = Math.floor(ctx.sampleRate * 0.45);

        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);

        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {

          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.09));

        }

        const noise = ctx.createBufferSource();

        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();

        filter.type = 'bandpass';

        filter.frequency.setValueAtTime(1400, now);

        filter.Q.setValueAtTime(3, now);

        const gain = ctx.createGain();

        gain.gain.setValueAtTime(state.volume * 0.4, now);

        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

        noise.connect(filter);

        filter.connect(gain);

        gain.connect(ctx.destination);

        noise.start(now);

      } catch (err) {

        console.warn('Audio play error', err);

      }

    },



    playError: function () {

      if (state.isMuted) return;

      try {

        const ctx = getAudioContext();

        if (!ctx) return;

        const now = ctx.currentTime;

        const chord = [130.81, 155.56, 185.0]; // C3 diminished chord (XP Critical Stop)



        chord.forEach(freq => {

          const osc = ctx.createOscillator();

          const gain = ctx.createGain();

          osc.type = 'sawtooth';

          osc.frequency.setValueAtTime(freq, now);



          const vol = (state.volume * 0.25) / chord.length;

          gain.gain.setValueAtTime(vol, now);

          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);



          osc.connect(gain);

          gain.connect(ctx.destination);



          osc.start(now);

          osc.stop(now + 0.55);

        });

      } catch (err) {

        console.warn('Audio play error', err);

      }

    },



    playClick: function () {

      if (state.isMuted || !state.soundOnClick) return;

      try {

        const ctx = getAudioContext();

        if (!ctx) return;

        const now = ctx.currentTime;

        const osc = ctx.createOscillator();

        const gain = ctx.createGain();



        osc.type = 'triangle';

        osc.frequency.setValueAtTime(800, now);

        osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);



        const vol = state.volume * 0.15;

        gain.gain.setValueAtTime(vol, now);

        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);



        osc.connect(gain);

        gain.connect(ctx.destination);



        osc.start(now);

        osc.stop(now + 0.04);

      } catch (err) {

        // Ignored

      }

    },



    playStartup: function () {

      if (state.isMuted) return;

      const audio = new Audio('/sounds/start-windows.mp3');

      audio.volume = state.volume;

      audio.play().catch(() => { });

    },



    playShutdown: function () {

      if (state.isMuted) return;

      const audio = new Audio('/sounds/shutdown-windows.mp3');

      audio.volume = state.volume;

      audio.play().catch(() => { });

    },



    playClippyChime: function () {

      if (state.isMuted) return;

      try {

        const ctx = getAudioContext();

        if (!ctx) return;

        const now = ctx.currentTime;

        [{ f: 1318.5, t: now }, { f: 1661.2, t: now + 0.12 }].forEach(tone => {

          const osc = ctx.createOscillator();

          const gain = ctx.createGain();

          osc.type = 'sine';

          osc.frequency.setValueAtTime(tone.f, tone.t);

          const vol = state.volume * 0.28;

          gain.gain.setValueAtTime(vol, tone.t);

          gain.gain.exponentialRampToValueAtTime(0.0001, tone.t + 0.35);

          osc.connect(gain);

          gain.connect(ctx.destination);

          osc.start(tone.t);

          osc.stop(tone.t + 0.38);

        });

      } catch (err) { }

    },



    playClippyBlip: function () {

      if (state.isMuted) return;

      try {

        const ctx = getAudioContext();

        if (!ctx) return;

        const now = ctx.currentTime;

        const osc = ctx.createOscillator();

        const gain = ctx.createGain();

        osc.type = 'triangle';

        osc.frequency.setValueAtTime(950 + Math.random() * 200, now);

        const vol = state.volume * 0.12;

        gain.gain.setValueAtTime(vol, now);

        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(gain);

        gain.connect(ctx.destination);

        osc.start(now);

        osc.stop(now + 0.05);

      } catch (err) { }

    },

    playDogBark: function () {},

    playDogPant: function () {},

  };

  window.__SoundManager = SoundManager;



  // --------------------------------------------------------------------------

  // Theme & Wallpaper Application

  // --------------------------------------------------------------------------

  const WALLPAPER_MAP = {

    bliss: '/img/office-picture.webp',

    autumn: '/img/wallpapers/autumn.webp',

    desert: '/img/wallpapers/desert.webp',

    azul: '/img/wallpapers/azul.webp',
    alps: '/img/wallpapers/alps.webp'

  };



  function applyTheme(themeName) {

    state.theme = themeName;

    document.body.classList.remove('theme-luna', 'theme-olive', 'theme-silver', 'theme-royale', 'theme-dark');

    if (themeName && themeName !== 'luna') {

      document.body.classList.add('theme-' + themeName);

    }

    saveState();

  }



  function applyWallpaper(wpKey, customUrl = '') {

    state.wallpaper = wpKey;

    if (customUrl) state.customWallpaperUrl = customUrl;



    let targetUrl = '';

    if (wpKey === 'custom' && state.customWallpaperUrl) {

      targetUrl = state.customWallpaperUrl;

    } else {

      targetUrl = WALLPAPER_MAP[wpKey] || WALLPAPER_MAP.bliss;

    }



    // Apply to wallpaper container

    const desktopBg = document.querySelector('.bg-office-pic') || document.querySelector('section');

    if (desktopBg) {

      desktopBg.style.backgroundImage = `url("${targetUrl}")`;

      desktopBg.style.backgroundSize = 'cover';

      desktopBg.style.backgroundPosition = 'center';

      desktopBg.style.backgroundRepeat = 'no-repeat';

    }



    saveState();

  }



  function applyCrt(enabled) {

    state.crtEffect = !!enabled;

    let crt = document.getElementById('xp-crt-overlay');

    if (state.crtEffect) {

      if (!crt) {

        crt = document.createElement('div');

        crt.id = 'xp-crt-overlay';

        crt.className = 'crt-overlay';

        document.body.appendChild(crt);

      }

    } else {

      if (crt) crt.remove();

    }

    saveState();

  }



  function applyGadgetsVisibility(visible) {
    state.showGadgets = true; // Permanent gadgets as requested by user
    const clockEl = document.getElementById('xp-desktop-clock-gadget');
    const calEl = document.getElementById('xp-desktop-calendar-gadget');
    if (clockEl) clockEl.style.display = 'block';
    if (calEl) calEl.style.display = 'block';
    saveState();
  }

  // --------------------------------------------------------------------------
  // Desktop Gadgets (Independent Analog Clock & Simple Rich Calendar)
  // --------------------------------------------------------------------------
  function makeIndependentDraggable(el, storageKey, defaultPos) {
    let isDragging = false;
    let hasDragged = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    // Restore saved position if present
    const applyPos = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const pos = JSON.parse(saved);
          // Purge any stale test, overlapping, or legacy left-anchored positions
          if (storageKey === 'xp_clock_pos' && (typeof pos.left === 'number' || typeof pos.right !== 'number')) {
            localStorage.removeItem('xp_clock_pos');
            throw new Error('reset bad clock pos');
          }
          if (storageKey === 'xp_cal_pos' && (typeof pos.left === 'number' || typeof pos.right !== 'number')) {
            localStorage.removeItem('xp_cal_pos');
            throw new Error('reset bad cal pos');
          }
          if (typeof pos.right === 'number' && typeof pos.top === 'number') {
            el.style.left = 'auto';
            el.style.right = Math.max(10, pos.right) + 'px';
            el.style.top = Math.max(10, pos.top) + 'px';
            return;
          }
          if (typeof pos.left === 'number' && typeof pos.top === 'number') {
            el.style.right = 'auto';
            el.style.left = Math.max(10, Math.min(window.innerWidth - 120, pos.left)) + 'px';
            el.style.top = Math.max(10, Math.min(window.innerHeight - 150, pos.top)) + 'px';
            return;
          }
        }
      } catch(e) {}
      if (defaultPos) {
        if (defaultPos.right !== undefined) {
          el.style.left = 'auto';
          el.style.right = defaultPos.right + 'px';
        }
        if (defaultPos.left !== undefined) {
          el.style.right = 'auto';
          el.style.left = defaultPos.left + 'px';
        }
        if (defaultPos.top !== undefined) el.style.top = defaultPos.top + 'px';
      }
    };
    applyPos();

    const onStart = (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      hasDragged = false;
      el.dataset.isDragging = 'true';
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      const parentRect = el.offsetParent ? el.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };
      initialLeft = rect.left - parentRect.left;
      initialTop = rect.top - parentRect.top;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!hasDragged && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        hasDragged = true;
        el.style.cursor = 'grabbing';
        el.style.right = 'auto';
        el.style.left = initialLeft + 'px';
        el.style.top = initialTop + 'px';
      }

      if (hasDragged) {
        const curL = Math.max(10, Math.min(window.innerWidth - (el.offsetWidth || 150) - 10, initialLeft + dx));
        const curT = Math.max(10, Math.min(window.innerHeight - (el.offsetHeight || 150) - 40, initialTop + dy));
        el.style.left = curL + 'px';
        el.style.top = curT + 'px';
      }
    };

    const onEnd = () => {
      if (isDragging) {
        isDragging = false;
        delete el.dataset.isDragging;
        el.style.cursor = 'grab';
        if (hasDragged) {
          try {
            const rect = el.getBoundingClientRect();
            const distFromRight = window.innerWidth - rect.right;
            const distFromLeft = rect.left;
            let toSave = {};
            if (distFromRight < distFromLeft) {
              toSave = { right: Math.max(10, Math.round(distFromRight)), top: Math.max(10, Math.round(rect.top)) };
            } else {
              toSave = { left: Math.max(10, Math.round(distFromLeft)), top: Math.max(10, Math.round(rect.top)) };
            }
            localStorage.setItem(storageKey, JSON.stringify(toSave));
          } catch(e) {}
        }
      }
    };

    el.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    el.addEventListener('pointerdown', onStart);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onEnd);
  }

  function initDesktopGadgets() {
    const desktopSection = document.querySelector('.bg-office-pic');
    if (!desktopSection) return;

    // 1. Independent Analog Clock Gadget
    let clockContainer = document.getElementById('xp-desktop-clock-gadget');
    if (!clockContainer) {
      clockContainer = document.createElement('div');
      clockContainer.id = 'xp-desktop-clock-gadget';
      clockContainer.className = 'xp-standalone-gadget gadget-clock-wrap';
      clockContainer.style.cursor = 'grab';
      clockContainer.title = 'Analog Clock Gadget - Click to open Calendar & Clock (Permanent)';

      clockContainer.innerHTML = `
        <div class="gadget-card clock-gadget-card">
          <div class="gadget-actions">
            <button class="gadget-btn" title="Settings" id="gadget-clock-settings">⚙</button>
          </div>
          <div class="clock-gadget">
            <div class="clock-face" id="gadget-clock-face">
              <div class="clock-glass"></div>
              <div class="clock-hand hand-hour" id="clock-hour-hand"></div>
              <div class="clock-hand hand-minute" id="clock-minute-hand"></div>
              <div class="clock-hand hand-second" id="clock-second-hand"></div>
              <div class="clock-center-pin"></div>
            </div>
          </div>
        </div>
      `;

      desktopSection.appendChild(clockContainer);

      // Add dial numerals to clock face
      const clockFace = clockContainer.querySelector('#gadget-clock-face');
      if (clockFace) {
        const radius = 42;
        const centerX = 55;
        const centerY = 55;
        for (let i = 1; i <= 12; i++) {
          const numEl = document.createElement('div');
          numEl.className = 'clock-number';
          numEl.innerText = i;
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle) - 8;
          const y = centerY + radius * Math.sin(angle) - 8;
          numEl.style.left = `${x}px`;
          numEl.style.top = `${y}px`;
          clockFace.appendChild(numEl);
        }
      }

      clockContainer.addEventListener('click', (e) => {
        if (e.target.closest('#gadget-clock-settings')) {
          e.stopPropagation();
          SoundManager.playClick();
          if (window.__openWindow) window.__openWindow('settings');
          return;
        }
        e.stopPropagation();
        SoundManager.playClick();
        if (window.__openWindow) window.__openWindow('calendar');
      });

      makeIndependentDraggable(clockContainer, 'xp_clock_pos', { top: 20, right: 49 });
    }

    // 2. Independent Simple Calendar Gadget (Day, Dates, Occasions & All)
    let calContainer = document.getElementById('xp-desktop-calendar-gadget');
    if (!calContainer) {
      calContainer = document.createElement('div');
      calContainer.id = 'xp-desktop-calendar-gadget';
      calContainer.className = 'xp-standalone-gadget gadget-calendar-wrap';
      calContainer.style.cursor = 'grab';
      calContainer.title = 'Calendar Gadget - Click to open Calendar app (Permanent)';

      calContainer.innerHTML = `
        <div class="gadget-card simple-calendar-card">
          <div class="gadget-actions">
            <button class="gadget-btn" title="Open Calendar" id="gadget-cal-open">📅</button>
          </div>
          <div class="simple-cal-header">
            <span class="simple-cal-month" id="gadget-cal-month-year">NOVEMBER 2026</span>
          </div>
          <div class="simple-cal-body">
            <div class="simple-cal-day-num" id="gadget-cal-day">03</div>
            <div class="simple-cal-weekday" id="gadget-cal-weekday">TUESDAY</div>
          </div>
          <!-- Mini monthly matrix -->
          <div class="simple-cal-grid" id="gadget-cal-grid"></div>
          <!-- Upcoming Occasions & Milestones -->
          <div class="simple-cal-occasions">
            <div class="occ-heading">📌 Occasions &amp; Milestones:</div>
            <div class="occ-item"><span class="occ-dot">●</span> <strong>Nov 12</strong>: Capstone Review (PCU)</div>
            <div class="occ-item"><span class="occ-dot">●</span> <strong>Dec 01</strong>: GraphRAG v1.0 Launch</div>
            <div class="occ-item"><span class="occ-dot">●</span> <strong>Jan 15</strong>: SDE Campus Drives</div>
          </div>
        </div>
      `;

      desktopSection.appendChild(calContainer);

      calContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundManager.playClick();
        if (window.__openWindow) window.__openWindow('calendar');
      });

      makeIndependentDraggable(calContainer, 'xp_cal_pos', { top: 160, right: 28 });
    }

    // Start ticking clock & updating calendar dates
    updateClockAndCalendar();
    setInterval(updateClockAndCalendar, 1000);
  }

  function renderMiniCalGrid(year, month, todayDate) {
    const gridEl = document.getElementById('gadget-cal-grid');
    if (!gridEl) return;
    if (gridEl.dataset.renderedMonth === `${year}-${month}`) return;
    gridEl.dataset.renderedMonth = `${year}-${month}`;

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let html = '<div class="cal-grid-row cal-grid-header">' + daysOfWeek.map(d => `<span class="grid-cell h-cell">${d}</span>`).join('') + '</div>';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let day = 1;
    let rowHtml = '<div class="cal-grid-row">';
    for (let i = 0; i < firstDay; i++) {
      rowHtml += '<span class="grid-cell empty"></span>';
    }

    for (let i = firstDay; i < 7; i++) {
      const isToday = (day === todayDate);
      rowHtml += `<span class="grid-cell ${isToday ? 'today' : ''}">${day}</span>`;
      day++;
    }
    rowHtml += '</div>';
    html += rowHtml;

    while (day <= daysInMonth) {
      rowHtml = '<div class="cal-grid-row">';
      for (let i = 0; i < 7 && day <= daysInMonth; i++) {
        const isToday = (day === todayDate);
        rowHtml += `<span class="grid-cell ${isToday ? 'today' : ''}">${day}</span>`;
        day++;
      }
      rowHtml += '</div>';
      html += rowHtml;
    }

    gridEl.innerHTML = html;
  }

  function updateClockAndCalendar() {
    const now = new Date();

    // 1. Clock Hands
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    const secHand = document.getElementById('clock-second-hand');
    const minHand = document.getElementById('clock-minute-hand');
    const hourHand = document.getElementById('clock-hour-hand');

    if (secHand) secHand.style.transform = `rotate(${seconds * 6}deg)`;
    if (minHand) minHand.style.transform = `rotate(${minutes * 6}deg)`;
    if (hourHand) hourHand.style.transform = `rotate(${hours * 30}deg)`;

    // 2. Calendar Pad Text
    const monthYearEl = document.getElementById('gadget-cal-month-year');
    const dayEl = document.getElementById('gadget-cal-day');
    const weekdayEl = document.getElementById('gadget-cal-weekday');

    if (dayEl) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const weekdayNames = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ];

      const month = now.getMonth();
      const year = now.getFullYear();
      const date = now.getDate();

      if (monthYearEl) monthYearEl.textContent = `${monthNames[month].toUpperCase()} ${year}`;
      if (dayEl) dayEl.textContent = date < 10 ? '0' + date : date;
      if (weekdayEl) weekdayEl.textContent = weekdayNames[now.getDay()].toUpperCase();

      renderMiniCalGrid(year, month, date);
    }
  }

  // --------------------------------------------------------------------------

  // Settings Window Component / Dialog

  // --------------------------------------------------------------------------

  function createSettingsHTML() {

    return `

      <div class="settings-app-container">

        <!-- Tabs Header -->

        <div class="xp-tabs-header">

          <button class="xp-tab-btn active" data-tab="themes">Themes</button>

          <button class="xp-tab-btn" data-tab="desktop">Desktop</button>

          <button class="xp-tab-btn" data-tab="sounds">Sounds</button>

          <button class="xp-tab-btn" data-tab="preferences">Preferences</button>

        </div>



        <!-- TAB 1: THEMES -->

        <div class="xp-tab-body" id="tab-themes">

          <div class="xp-monitor-preview">

            <div class="xp-monitor-screen" id="preview-screen">

              <div class="xp-preview-window" id="preview-window">

                <div class="xp-preview-titlebar" id="preview-titlebar">

                  <span>Active Window</span>

                  <span>✕</span>

                </div>

                <div class="xp-preview-body">

                  <p style="margin:2px 0;">Windows XP</p>

                  <button class="xp-btn" style="font-size:7px; height:14px; min-width:30px; padding:0 4px;">OK</button>

                </div>

              </div>

            </div>

          </div>



          <div class="xp-groupbox">

            <legend class="xp-groupbox-legend">Visual Style</legend>

            <p style="margin: 0 0 8px 0; color:#555;">Choose a color scheme for windows, buttons, and taskbar:</p>

            <select id="setting-theme-select" style="width: 100%; padding: 4px; font-family: Tahoma; font-size: 11px;">

              <option value="luna" ${state.theme === 'luna' ? 'selected' : ''}>Windows XP Default (Luna Blue)</option>

              <option value="olive" ${state.theme === 'olive' ? 'selected' : ''}>Olive Green (Homestead)</option>

              <option value="silver" ${state.theme === 'silver' ? 'selected' : ''}>Metallic Silver</option>

              <option value="royale" ${state.theme === 'royale' ? 'selected' : ''}>Royale (Energy Blue)</option>

              <option value="dark" ${state.theme === 'dark' ? 'selected' : ''}>Dark XP (Zune / Retro Dark)</option>

            </select>

          </div>

        </div>



        <!-- TAB 2: DESKTOP / WALLPAPER -->

        <div class="xp-tab-body" id="tab-desktop" style="display:none;">

          <div class="xp-groupbox">

            <legend class="xp-groupbox-legend">Background Wallpaper</legend>

            <p style="margin: 0 0 6px 0; color:#555;">Select a wallpaper to display on your desktop:</p>

            <div class="wallpaper-grid">

              <div class="wallpaper-card ${state.wallpaper === 'bliss' ? 'selected' : ''}" data-wp="bliss">

                <img src="/img/office-picture.webp" class="wallpaper-thumb" alt="Bliss">

                <span class="wallpaper-title">Bliss (Classic)</span>

              </div>

              <div class="wallpaper-card ${state.wallpaper === 'autumn' ? 'selected' : ''}" data-wp="autumn">

                <img src="/img/wallpapers/autumn.webp" class="wallpaper-thumb" alt="Autumn">

                <span class="wallpaper-title">Autumn</span>

              </div>

              <div class="wallpaper-card ${state.wallpaper === 'desert' ? 'selected' : ''}" data-wp="desert">

                <img src="/img/wallpapers/desert.webp" class="wallpaper-thumb" alt="Red Moon Desert">

                <span class="wallpaper-title">Red Moon Desert</span>

              </div>

              <div class="wallpaper-card ${state.wallpaper === 'azul' ? 'selected' : ''}" data-wp="azul">

                <img src="/img/wallpapers/azul.webp" class="wallpaper-thumb" alt="Azul">

                <span class="wallpaper-title">Azul</span>

              </div>

            </div>



            <div style="margin-top: 10px;">

              <label style="font-weight: bold; display: block; margin-bottom: 4px;">Custom Wallpaper URL:</label>

              <div style="display: flex; gap: 6px;">

                <input type="text" id="setting-custom-wp-url" value="${state.customWallpaperUrl || ''}" placeholder="https://example.com/wallpaper.jpg" style="flex:1; padding: 4px; font-family: Tahoma; font-size: 11px; border: 1px solid #7f9db9;">

                <button class="xp-btn" id="btn-apply-custom-wp">Load</button>

              </div>

            </div>

          </div>

        </div>



        <!-- TAB 3: SOUNDS -->

        <div class="xp-tab-body" id="tab-sounds" style="display:none;">

          <div class="xp-groupbox">

            <legend class="xp-groupbox-legend">Audio Volume & Scheme</legend>

            <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 10px;">

              <span>🔊 Volume:</span>

              <input type="range" id="setting-vol-slider" min="0" max="1" step="0.05" value="${state.volume}" style="flex:1;">

              <span id="setting-vol-label" style="font-weight:bold; width:36px;">${Math.round(state.volume * 100)}%</span>

            </div>



            <div style="display:flex; flex-direction:column; gap:6px; margin-bottom: 12px;">

              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">

                <input type="checkbox" id="setting-mute-toggle" ${state.isMuted ? 'checked' : ''}>

                <span>Mute all sounds</span>

              </label>

              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">

                <input type="checkbox" id="setting-sound-click" ${state.soundOnClick ? 'checked' : ''}>

                <span>Play click sound effect on interaction</span>

              </label>

            </div>



            <legend class="xp-groupbox-legend" style="margin-top: 10px;">Preview Sound Effects</legend>

            <div class="sound-test-grid">

              <button class="xp-btn" id="btn-sound-startup">▶ Windows Startup</button>

              <button class="xp-btn" id="btn-sound-shutdown">▶ Windows Shutdown</button>

              <button class="xp-btn" id="btn-sound-ding">▶ Asterisk / Ding</button>

              <button class="xp-btn" id="btn-sound-error">▶ Critical Error</button>

            </div>

          </div>

        </div>



        <!-- TAB 4: PREFERENCES -->

        <div class="xp-tab-body" id="tab-preferences" style="display:none;">

          <div class="xp-groupbox">

            <legend class="xp-groupbox-legend">Desktop Enhancements & Visuals</legend>

            <div style="display:flex; flex-direction:column; gap: 8px;">

              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">

                <input type="checkbox" id="setting-show-gadgets" ${state.showGadgets ? 'checked' : ''}>

                <span>Show Desktop Gadgets (Analog Clock & Spiral Calendar)</span>

              </label>

              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">

                <input type="checkbox" id="setting-crt-toggle" ${state.crtEffect ? 'checked' : ''}>

                <span>Enable Retro CRT Monitor Scanlines & Phosphor Effect</span>

              </label>

            </div>

          </div>



          <div class="xp-groupbox">

            <legend class="xp-groupbox-legend">Clock & Regional</legend>

            <div style="display: flex; align-items: center; gap: 10px;">

              <span>Time Format:</span>

              <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">

                <input type="radio" name="timeFormat" value="12h" ${state.timeFormat === '12h' ? 'checked' : ''}>

                <span>12-Hour (12:00 AM)</span>

              </label>

              <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">

                <input type="radio" name="timeFormat" value="24h" ${state.timeFormat === '24h' ? 'checked' : ''}>

                <span>24-Hour (00:00)</span>

              </label>

            </div>

          </div>



          <div style="margin-top: 10px;">

            <button class="xp-btn" id="btn-reset-preferences" style="color: #a00;">↺ Reset All to Defaults</button>

          </div>

        </div>



        <!-- DIALOG FOOTER BUTTONS -->

        <div class="xp-dialog-footer">

          <button class="xp-btn primary" id="btn-settings-ok">OK</button>

          <button class="xp-btn" id="btn-settings-cancel">Cancel</button>

          <button class="xp-btn" id="btn-settings-apply">Apply</button>

        </div>

      </div>

    `;

  }



  function bindSettingsEvents(container, closeCallback) {

    if (!container) return;



    // Tab navigation

    const tabButtons = container.querySelectorAll('.xp-tab-btn');

    const tabBodies = {

      themes: container.querySelector('#tab-themes'),

      desktop: container.querySelector('#tab-desktop'),

      sounds: container.querySelector('#tab-sounds'),

      preferences: container.querySelector('#tab-preferences')

    };



    tabButtons.forEach(btn => {

      btn.addEventListener('click', () => {

        SoundManager.playClick();

        tabButtons.forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        const tabKey = btn.dataset.tab;

        Object.keys(tabBodies).forEach(k => {

          if (tabBodies[k]) {

            tabBodies[k].style.display = k === tabKey ? 'block' : 'none';

          }

        });

      });

    });



    // Theme selector

    const themeSelect = container.querySelector('#setting-theme-select');

    if (themeSelect) {

      themeSelect.addEventListener('change', () => {

        applyTheme(themeSelect.value);

        updatePreviewMonitor(themeSelect.value);

      });

    }



    // Wallpaper cards

    const wpCards = container.querySelectorAll('.wallpaper-card');

    wpCards.forEach(card => {

      card.addEventListener('click', () => {

        SoundManager.playClick();

        wpCards.forEach(c => c.classList.remove('selected'));

        card.classList.add('selected');

        const wpKey = card.dataset.wp;

        applyWallpaper(wpKey);

      });

    });



    // Custom Wallpaper URL

    const btnCustomWp = container.querySelector('#btn-apply-custom-wp');

    const inputCustomWp = container.querySelector('#setting-custom-wp-url');

    if (btnCustomWp && inputCustomWp) {

      btnCustomWp.addEventListener('click', () => {

        const url = inputCustomWp.value.trim();

        if (url) {

          applyWallpaper('custom', url);

          SoundManager.playDing();

        }

      });

    }



    // Volume Slider & Mute

    const volSlider = container.querySelector('#setting-vol-slider');

    const volLabel = container.querySelector('#setting-vol-label');

    const muteToggle = container.querySelector('#setting-mute-toggle');

    const soundClickToggle = container.querySelector('#setting-sound-click');



    if (volSlider) {
      volSlider.addEventListener('input', () => {
        VolumeManager.setVolume(parseFloat(volSlider.value), state.isMuted);
      });
    }



    if (muteToggle) {
      muteToggle.addEventListener('change', () => {
        VolumeManager.setVolume(state.volume, muteToggle.checked);
      });
    }



    if (soundClickToggle) {

      soundClickToggle.addEventListener('change', () => {

        state.soundOnClick = soundClickToggle.checked;

        saveState();

      });

    }



    // Sound test buttons

    const btnStartup = container.querySelector('#btn-sound-startup');

    const btnShutdown = container.querySelector('#btn-sound-shutdown');

    const btnDing = container.querySelector('#btn-sound-ding');

    const btnError = container.querySelector('#btn-sound-error');



    if (btnStartup) btnStartup.addEventListener('click', () => SoundManager.playStartup());

    if (btnShutdown) btnShutdown.addEventListener('click', () => SoundManager.playShutdown());

    if (btnDing) btnDing.addEventListener('click', () => SoundManager.playDing());

    if (btnError) btnError.addEventListener('click', () => SoundManager.playError());



    // Preferences: Gadgets & CRT

    const showGadgetsToggle = container.querySelector('#setting-show-gadgets');

    const crtToggle = container.querySelector('#setting-crt-toggle');



    if (showGadgetsToggle) {

      showGadgetsToggle.addEventListener('change', () => {

        applyGadgetsVisibility(showGadgetsToggle.checked);

      });

    }



    if (crtToggle) {

      crtToggle.addEventListener('change', () => {

        applyCrt(crtToggle.checked);

      });

    }



    // Reset Defaults

    const btnReset = container.querySelector('#btn-reset-preferences');

    if (btnReset) {

      btnReset.addEventListener('click', () => {

        state = { ...defaultState };

        saveState();

        applyTheme(state.theme);

        applyWallpaper(state.wallpaper);

        applyGadgetsVisibility(state.showGadgets);

        applyCrt(state.crtEffect);

        SoundManager.playDing();

        if (closeCallback) closeCallback();

      });

    }



    // Dialog action buttons

    const btnOk = container.querySelector('#btn-settings-ok');

    const btnCancel = container.querySelector('#btn-settings-cancel');

    const btnApply = container.querySelector('#btn-settings-apply');



    if (btnApply) {

      btnApply.addEventListener('click', () => {

        SoundManager.playDing();

        saveState();

      });

    }



    if (btnOk) {

      btnOk.addEventListener('click', () => {

        SoundManager.playDing();

        saveState();

        if (closeCallback) closeCallback();

      });

    }



    if (btnCancel) {

      btnCancel.addEventListener('click', () => {

        if (closeCallback) closeCallback();

      });

    }

  }



  function updatePreviewMonitor(theme) {

    const titlebar = document.getElementById('preview-titlebar');

    if (!titlebar) return;



    if (theme === 'olive') {

      titlebar.style.background = 'linear-gradient(180deg, #8ba256, #769040 60%, #576d29)';

    } else if (theme === 'silver') {

      titlebar.style.background = 'linear-gradient(180deg, #d3dbe6, #b4bfd0 60%, #8796ab)';

    } else if (theme === 'royale') {

      titlebar.style.background = 'linear-gradient(180deg, #246ce9, #1150cd 60%, #08369b)';

    } else if (theme === 'dark') {

      titlebar.style.background = 'linear-gradient(180deg, #3a3b3e, #222325 60%, #111112)';

    } else {

      titlebar.style.background = 'linear-gradient(180deg, #0058ee, #0262ee 50%, #0040ab)';

    }

  }



  // --------------------------------------------------------------------------

  // Custom Terminal Command Dispatcher

  // --------------------------------------------------------------------------

  window.__customTerminalDispatcher = function (rawInput) {
    const input = rawInput.trim();
    if (!input) return '';

    const parts = input.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const fullLower = input.toLowerCase();

    // Direct matrix commands (matrix, matrix run, run matrix)
    if (/^(run\s+matrix(\.exe)?|matrix(\s+run)?|matrix\.exe)$/i.test(fullLower)) {
      triggerMatrixMode();
      return "Streaming digital matrix rain to desktop session... Press ESC to exit.";
    }

    switch (cmd) {
      
      

      case 'clippy':
      case 'clippy.exe':
      case 'clappy':
      case 'ai':
      case 'assistant':
        if (typeof window.openClippyAssistant === 'function') window.openClippyAssistant();
        return "Opening Clippy AI Assistant... Ask anything about Vedant's projects, skills, or experience!";

      case 'matrix':
      case 'matrix.exe':
        triggerMatrixMode();
        return "Streaming digital matrix rain to desktop session... Press ESC to exit.";

      case 'run':
        if (args.length === 0) {
          showRunDialog();
          return "Opened Windows XP Run dialog.";
        }
        const target = args.join(' ').toLowerCase();
        if (target.includes('clippy') || target.includes('clappy') || target.includes('ai') || target.includes('assistant')) {
          if (typeof window.openClippyAssistant === 'function') window.openClippyAssistant();
          return "Opening Clippy AI Assistant...";
        }
        if (target.includes('matrix')) {
          triggerMatrixMode();
          return "Streaming digital matrix rain to desktop session... Press ESC to exit.";
        }
        if (target.includes('paint') || target.includes('mspaint')) {
          if (window.__openWindow) window.__openWindow('paint');
          return "Launching Microsoft Paint...";
        }
        if (target.includes('pinball')) {
          if (window.__openWindow) window.__openWindow('pinball');
          return "Launching 3D Pinball: Space Cadet...";
        }
        if (target.includes('doom')) {
          if (window.__openWindow) window.__openWindow('doom');
          return "Launching Doom...";
        }
        if (target.includes('cmd') || target.includes('terminal')) {
          if (window.__openWindow) window.__openWindow('terminal');
          return "Launching Command Prompt...";
        }
        if (target.includes('calendar') || target.includes('calc')) {
          if (window.__openWindow) window.__openWindow('calendar');
          return "Launching Calendar & Clock...";
        }
        if (target.includes('notepad') || target.includes('note')) {
          if (window.__openWindow) window.__openWindow('notepad');
          return "Launching Notepad...";
        }
        if (target.includes('setting')) {
          if (window.__openWindow) window.__openWindow('settings');
          return "Launching Display Settings...";
        }
        if (target.includes('cv') || target.includes('resume')) {
          if (window.__openWindow) window.__openWindow('myCV');
          return "Launching My CV...";
        }
        if (target.includes('project')) {
          if (window.__openWindow) window.__openWindow('myProjects');
          return "Launching My Projects...";
        }
        if (target.includes('contact') || target.includes('mail')) {
          if (window.__openWindow) window.__openWindow('contact');
          return "Launching Contact Me...";
        }
        if (target.includes('music')) {
          if (window.__openWindow) window.__openWindow('music');
          return "Launching Music Player...";
        }
        if (target.includes('recycle') || target.includes('trash')) {
          if (window.__openWindow) window.__openWindow('recyclebin');
          return "Opening Recycle Bin...";
        }
        return "Unable to run '" + args.join(' ') + "'. Program or command not found. Type 'help' for available commands.";


      case 'help':

        return `

<b>VEDANT-OS COMMAND PROMPT [Version 5.1.2600]</b>

Type a command to interact with the system:



  <b>whoami / about</b>   : Display Vedant Kale engineering summary & bio

  <b>skills</b>           : List categorized technical skills & backend stack

  <b>projects</b>         : Inspect flagship systems (GraphRAG, ArthaSEC, Malware AI)

  <b>open &lt;app&gt;</b>       : Launch an application (e.g. open cv, open settings, open doom)

  <b>theme &lt;name&gt;</b>     : Change visual style (luna | olive | silver | royale | dark)

  <b>wallpaper &lt;name&gt;</b> : Change desktop wallpaper (bliss | autumn | desert | azul)

  <b>sound &lt;action&gt;</b>   : Test or control audio (test | ding | error | mute | unmute)

  <b>matrix</b>           : Run digital matrix rain animation

  <b>contact</b>          : Show contact information and verified social links

  <b>date / time</b>      : Current system timestamp

  <b>systeminfo</b>       : Display hardware, kernel, and OS architecture specs

  <b>paint</b>            : Launch Microsoft Paint drawing canvas

  <b>pinball</b>          : Launch classic 3D Pinball (Space Cadet)

  <b>recyclebin</b>       : Inspect deleted files & humorous secrets in Recycle Bin

  <b>notes</b>            : Toggle draggable sticky notes on desktop

  <b>clear / cls</b>      : Clear terminal screen

  <b>exit</b>             : Close this terminal window

`;



      case 'whoami':

      case 'about':

        return `

<b>Vedant Kale</b> - Software Development Engineer (SDE)

Targeting backend engineering, high-throughput systems, and enterprise AI retrieval.

- <b>Education:</b> B.Tech in Computer Science & Engineering (Final Year)

- <b>Core Focus:</b> Distributed systems, GraphRAG, dense/hybrid vector search, FastAPI, async pipelines.

- <b>Status:</b> Actively seeking Software Developer / Backend Engineer roles.

`;



      case 'skills':

        return `

<b>TECHNICAL SKILLS & PROFICIENCIES:</b>

------------------------------------------------------------------------

- <b>Languages:</b> Python, JavaScript, TypeScript, SQL, Bash

- <b>Backend & AI:</b> FastAPI, PyTorch, Neo4j, GraphRAG, LangChain, Pinecone, Redis

- <b>Databases:</b> PostgreSQL, pgvector, Neo4j Graph DB, MongoDB, Redis Cache

- <b>DevOps & Infra:</b> Docker, Linux/POSIX, Git, CI/CD Actions, Nginx

- <b>Frontend:</b> Vue.js, TailwindCSS, RESTful APIs, WebSockets

`;



      case 'projects':

        return `

<b>FEATURED SYSTEMS & PROJECTS:</b>

------------------------------------------------------------------------

1. <b>Neuro-Adaptive GraphRAG Platform</b>

   - Multi-hop entity graph traversal with Neo4j & Pinecone dense embeddings.

   - Sub-2.5s p95 latency, Cohere Rerank v3, and automated RAGAS evaluation gates.



2. <b>ArthaSEC - High-Precision Financial RAG</b>

   - 352+ SEC filings parsed into 32k structured chunks. Reciprocal Rank Fusion (BM25 + Dense).

   - 73.3% Recall@10 with cross-encoder reranking and pgvector.



3. <b>Malware AI Two-Tier Edge Detector</b>

   - Line-rate Random Forest (0.003ms) + Tier 2 Deep Learning sandbox.

   - 99.30% accuracy on CIC-IDS and EMBER datasets.



<i>Tip: Type 'open projects' to view all projects in the desktop window!</i>

`;



      case 'contact':

        return `

<b>CONTACT & PROFESSIONAL LINKS:</b>

------------------------------------------------------------------------

- <b>Email:</b> <a href="mailto:kalevedant750@gmail.com" style="color:#00ffcc;">kalevedant750@gmail.com</a>

- <b>GitHub:</b> <a href="https://github.com/VedantKale244" target="_blank" style="color:#00ffcc;">github.com/VedantKale244</a>

- <b>LinkedIn:</b> <a href="https://www.linkedin.com/in/vedant-kale-3367b322a" target="_blank" style="color:#00ffcc;">linkedin.com/in/vedant-kale-3367b322a</a>

- <b>Interactive Resume:</b> Type 'open cv' to view the printable resume!

`;



      case 'open':

        if (!args[0]) {

          return "Usage: open &lt;app&gt; (e.g. open cv, open projects, open contact, open settings, open doom, open calendar)";

        }

        const appMap = {

          projects: 'myProjects',

          myprojects: 'myProjects',

          cv: 'myCV',

          resume: 'myCV',

          contact: 'contact',

          settings: 'settings',

          doom: 'doom',

          calendar: 'calendar',

          minesweeper: 'minesweeper',

          notepad: 'notepad',

          music: 'music',

          services: 'services'

        };

        const targetApp = appMap[args[0].toLowerCase()] || args[0];

        if (window.__openWindow) {

          window.__openWindow(targetApp);

          return `Launching application '${args[0]}' in desktop session...`;

        }

        return `Could not find application '${args[0]}'`;



      case 'theme':

        if (!args[0]) {

          return "Usage: theme &lt;luna | olive | silver | royale | dark&gt; (Current: " + state.theme + ")";

        }

        const th = args[0].toLowerCase();

        if (['luna', 'olive', 'silver', 'royale', 'dark'].includes(th)) {

          applyTheme(th);

          SoundManager.playDing();

          return `Visual theme successfully changed to <b>${th}</b>.`;

        }

        return `Unknown theme '${args[0]}'. Available: luna, olive, silver, royale, dark`;



      case 'wallpaper':

        if (!args[0]) {

          return "Usage: wallpaper &lt;bliss | autumn | desert | azul | url&gt; (Current: " + state.wallpaper + ")";

        }

        const wp = args[0].toLowerCase();

        if (['bliss', 'autumn', 'desert', 'azul'].includes(wp)) {

          applyWallpaper(wp);

          SoundManager.playDing();

          return `Desktop wallpaper changed to <b>${wp}</b>.`;

        } else if (args[0].startsWith('http')) {

          applyWallpaper('custom', args[0]);

          SoundManager.playDing();

          return `Desktop wallpaper loaded from custom URL.`;

        }

        return `Unknown wallpaper '${args[0]}'. Available: bliss, autumn, desert, azul`;



      case 'sound':

        const sub = (args[0] || '').toLowerCase();

        if (sub === 'mute') {

          state.isMuted = true;

          saveState();

          return "System sound is now MUTED.";

        } else if (sub === 'unmute') {

          state.isMuted = false;

          saveState();

          SoundManager.playDing();

          return "System sound is now UNMUTED.";

        } else if (sub === 'ding') {

          SoundManager.playDing();

          return "Playing sound: Asterisk / Ding";

        } else if (sub === 'error') {

          SoundManager.playError();

          return "Playing sound: Critical Stop Error";

        } else if (sub === 'test' || sub === 'startup') {

          SoundManager.playStartup();

          return "Playing: Windows XP Startup Sound";

        }

        return "Usage: sound &lt;mute | unmute | ding | error | test&gt;";



      case 'date':

        return new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });



      case 'time':

        return new Date().toLocaleTimeString();



      case 'winver':

      case 'about':

        if (window.showAboutWindowsXPDialog) window.showAboutWindowsXPDialog();

        return "Opening About Windows XP Professional System Information dialog...";



      case 'shutdown':

      case 'poweroff':

        if (window.showShutdownDialog) window.showShutdownDialog();

        return "Initiating Windows XP Turn Off Computer dialog...";



      case 'reboot':

      case 'restart':

        if (window.showShutdownDialog) window.showShutdownDialog();

        return "Opening Windows XP Restart session dialog...";



      case 'fullscreen':

        toggleFullScreen();

        return "Toggled display fullscreen mode.";



      case 'matrix':

        triggerMatrixEffect();

        return "Streaming digital matrix rain to desktop session...";



      case 'cls':

      case 'clear':

        return '__CLEAR__';



            case 'gallery':
      case 'pictures':
      case 'photos':
      case 'images':
        if (window.__openWindow) window.__openWindow('pictures');
        return "Opening Windows Picture and Fax Viewer (Gallery)...";

      case 'paint':
        if (window.__openWindow) window.__openWindow('paint');
        return "Launching Microsoft Paint on desktop...";

      case 'pinball':
        if (window.__openWindow) window.__openWindow('pinball');
        return "Launching 3D Pinball: Space Cadet on desktop...";

      case 'recycle':
      case 'recyclebin':
      case 'trash':
        if (window.__openWindow) window.__openWindow('recyclebin');
        return "Opening Recycle Bin folder on desktop...";

      case 'notes':
      case 'sticky':
      case 'stickynote':
        if (window.__openWindow) window.__openWindow('stickynotes');
        return "Toggling Sticky Notes on desktop...";



      case 'exit':

        if (window.__minimizeWindow) {

          window.__minimizeWindow('terminal');

        }

        return "Exiting terminal...";



      default:

        return null; // Fallback to built-in handlers

    }

  };



  // Fun Matrix Digital Rain Animation

  function triggerMatrixEffect() {

    let canvas = document.getElementById('xp-matrix-canvas');

    if (canvas) {

      canvas.remove();

      return;

    }



    canvas = document.createElement('canvas');

    canvas.id = 'xp-matrix-canvas';

    canvas.style.position = 'fixed';

    canvas.style.top = '0';

    canvas.style.left = '0';

    canvas.style.width = '100vw';

    canvas.style.height = '100vh';

    canvas.style.pointerEvents = 'none';

    canvas.style.zIndex = '99999';

    canvas.style.opacity = '0.75';

    document.body.appendChild(canvas);



    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;



    const chars = '0123456789ABCDEFVEDANTKALEGRAPHRAQFASTAPI';

    const fontSize = 14;

    const columns = Math.floor(canvas.width / fontSize);

    const drops = Array(columns).fill(1);



    let frames = 0;

    const interval = setInterval(() => {

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';

      ctx.fillRect(0, 0, canvas.width, canvas.height);



      ctx.fillStyle = '#0F0';

      ctx.font = `${fontSize}px monospace`;



      for (let i = 0; i < drops.length; i++) {

        const text = chars.charAt(Math.floor(Math.random() * chars.length));

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);



        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {

          drops[i] = 0;

        }

        drops[i]++;

      }



      frames++;

      if (frames > 250) {

        clearInterval(interval);

        canvas.remove();

      }

    }, 33);

  }





  // --------------------------------------------------------------------------

  // Music Controller & Windows XP Balloon Notification System

  // --------------------------------------------------------------------------

  const TRACKS_LIST = [

    { id: 'frank_pink_white', name: 'Pink + White', artist: 'Frank Ocean', album: 'Blonde', cover: '/img/album-covers/frank_pink_white.webp' },

    { id: 'frank_lost', name: 'Lost', artist: 'Frank Ocean', album: 'Channel Orange', cover: '/img/album-covers/frank_lost.webp' },

    { id: 'frank_nights', name: 'Nights', artist: 'Frank Ocean', album: 'Blonde', cover: '/img/album-covers/frank_nights.webp' },

    { id: 'frank_thinkin_bout_you', name: 'Thinkin Bout You', artist: 'Frank Ocean', album: 'Channel Orange', cover: '/img/album-covers/frank_thinkin_bout_you.webp' },

    { id: 'frank_ivy', name: 'Ivy', artist: 'Frank Ocean', album: 'Blonde', cover: '/img/album-covers/frank_ivy.webp' },

    { id: 'weeknd_blinding_lights', name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', cover: '/img/album-covers/weeknd_blinding_lights.webp' },

    { id: 'weeknd_starboy', name: 'Starboy', artist: 'The Weeknd', album: 'Starboy', cover: '/img/album-covers/weeknd_starboy.webp' },

    { id: 'weeknd_the_hills', name: 'The Hills', artist: 'The Weeknd', album: 'Beauty Behind the Madness', cover: '/img/album-covers/weeknd_the_hills.webp' },

    { id: 'weeknd_save_your_tears', name: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', cover: '/img/album-covers/weeknd_save_your_tears.webp' },

    { id: 'weeknd_die_for_you', name: 'Die For You', artist: 'The Weeknd', album: 'Starboy', cover: '/img/album-covers/weeknd_die_for_you.webp' },

    { id: 'kendrick_drank', name: 'Swimming Pools (Drank)', artist: 'Kendrick Lamar', album: 'good kid, m.A.A.d city', cover: '/img/album-covers/kendrick_drank.webp' },

    { id: 'charlie_puth_we_dont_talk_anymore', name: "We Don't Talk Anymore (feat. Selena Gomez)", artist: 'Charlie Puth', album: 'Nine Track Mind', cover: '/img/album-covers/charlie_puth_we_dont_talk_anymore.webp' }

  ];



  let currentTrackIdx = 0;

  let bgAudio = null;

  let isCurrentlyPlaying = false;



  function updateClippyMusicNote(isPlaying) {

    const note = document.getElementById('clippy-music-note');

    if (note) {

      note.style.display = isPlaying ? 'block' : 'none';

    }

  }



  function showMusicBalloonToast(track) {

    if (!track) return;

    const existing = document.getElementById('xp-music-balloon-toast');

    if (existing) existing.remove();



    const toast = document.createElement('div');

    toast.id = 'xp-music-balloon-toast';

    toast.className = 'xp-balloon-toast';

    toast.title = 'Click to open Music Player';

    

    const coverUrl = (track.album && track.album.images) ? track.album.images[0].url : (track.cover || `/img/album-covers/${track.id}.webp`);

    const trackTitle = track.name || 'Unknown Track';

    const trackArtist = track.artists ? track.artists[0].name : (track.artist || 'Unknown Artist');

    const trackAlbum = track.album ? (track.album.name || track.album) : '';



    toast.innerHTML = `

      <div class="xp-balloon-header">

        <div class="xp-balloon-title">

          <span>🎵</span>

          <span>Windows Media Player</span>

        </div>

        <button class="xp-balloon-close" id="xp-balloon-toast-close" title="Close">✕</button>

      </div>

      <div class="xp-balloon-body">

        <img src="${coverUrl}" class="xp-balloon-thumb" alt="Cover" />

        <div>

          <div class="xp-balloon-track-title">${escapeHtml(trackTitle)}</div>

          <div class="xp-balloon-track-sub">${escapeHtml(trackArtist)}${trackAlbum ? ' &bull; ' + escapeHtml(trackAlbum) : ''}</div>

        </div>

      </div>

    `;



    document.body.appendChild(toast);



    const closeBtn = toast.querySelector('#xp-balloon-toast-close');

    if (closeBtn) {

      closeBtn.addEventListener('click', (e) => {

        e.stopPropagation();

        toast.remove();

      });

    }



    toast.addEventListener('click', () => {

      if (window.__openWindow) window.__openWindow('music');

      toast.remove();

    });



    setTimeout(() => {

      if (toast.parentNode) {

        toast.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';

        toast.style.opacity = '0';

        toast.style.transform = 'translateY(15px)';

        setTimeout(() => toast.remove(), 420);

      }

    }, 4500);

  }



  window.__showMusicNotification = showMusicBalloonToast;

  window.__onTrackChange = function(tr) {

    isCurrentlyPlaying = true;

    updateClippyMusicNote(true);

    showMusicBalloonToast(tr);

    if (typeof updateAllClippyMusicCards === 'function') {

      updateAllClippyMusicCards(tr, true);

    }

  };



    // ==========================================
  // UNIFIED WINDOWS XP MASTER VOLUME MANAGER
  // ==========================================
  const VolumeManager = {
    getVolume() {
      const v = parseFloat(localStorage.getItem('volume'));
      return isNaN(v) ? (typeof state.volume === 'number' ? state.volume : 0.6) : Math.max(0, Math.min(1, v));
    },
    isMuted() {
      return state.isMuted === true || localStorage.getItem('isMuted') === 'true';
    },
    syncVolume(vol) {
      this.applyVolume(vol, this.isMuted());
    },
    setVolume(vol, isMuted) {
      vol = Math.max(0, Math.min(1, parseFloat(vol)));
      if (isNaN(vol)) vol = 0.6;
      if (isMuted === undefined) isMuted = (vol === 0);
      state.volume = vol;
      state.isMuted = !!isMuted;
      localStorage.setItem('volume', vol.toString());
      localStorage.setItem('isMuted', state.isMuted ? 'true' : 'false');
      this.applyVolume(vol, state.isMuted);
    },
    toggleMute() {
      this.setVolume(this.getVolume(), !this.isMuted());
    },
    applyVolume(vol, isMuted) {
      state.volume = vol;
      state.isMuted = !!isMuted;
      const effective = isMuted ? 0 : vol;

      // 1. Update background audio
      if (typeof bgAudio !== 'undefined' && bgAudio) {
        bgAudio.volume = effective;
      }

      // 2. Update all audio/video elements across document
      document.querySelectorAll('audio, video').forEach(el => {
        try { el.volume = effective; } catch(e) {}
      });

      // 3. Update taskbar speaker icons
      document.querySelectorAll('img[src*="volume-icon-sm"], img[src*="mute-icon-sm"]').forEach(img => {
        if (state.isMuted || vol === 0) {
          img.src = '/img/icons/mute-icon-sm.webp';
          img.alt = 'Volume: Muted';
          img.title = 'Volume: Muted';
        } else {
          img.src = '/img/icons/volume-icon-sm.webp';
          img.alt = `Volume: ${Math.round(vol * 100)}%`;
          img.title = `Volume: ${Math.round(vol * 100)}%`;
        }
      });

      // 4. Update Properties settings slider if open
      const propSlider = document.getElementById('setting-vol-slider');
      const propLabel = document.getElementById('setting-vol-label');
      if (propSlider && Math.abs(parseFloat(propSlider.value) - vol) > 0.01) propSlider.value = vol;
      if (propLabel) propLabel.textContent = isMuted ? 'Muted' : `${Math.round(vol * 100)}%`;

      // 5. Update Vue Volume Modal slider and live label if open
      const modalSlider = document.querySelector('section.bg-window-blue-deactivated input.slider');
      if (modalSlider && Math.abs(parseFloat(modalSlider.value) - vol) > 0.01) {
        modalSlider.value = vol;
      }
      const liveLabel = document.getElementById('xp-tray-vol-text');
      if (liveLabel) {
        liveLabel.textContent = isMuted ? 'Muted' : `${Math.round(vol * 100)}%`;
      }
      const muteBox = document.getElementById('xp-tray-vol-mute-checkbox');
      if (muteBox) {
        muteBox.checked = !!isMuted;
      }

      saveState();
    }
  };
  window.VolumeManager = VolumeManager;

  const MusicController = {
    getTracks() { return TRACKS_LIST; },
    getCurrentTrack() {
      if (window.__musicPlayer && window.__musicPlayer.currentTrack) {
        return window.__musicPlayer.currentTrack;
      }
      return TRACKS_LIST[currentTrackIdx];
    },
    isPlaying() {
      if (window.__musicPlayer) return window.__musicPlayer.isPlaying;
      return isCurrentlyPlaying;
    },
    playTrack(idOrQuery) {
      if (typeof stopClippySpeech === 'function') stopClippySpeech();
      let tr = null;
      let idx = -1;
      if (typeof idOrQuery === 'number') {
        idx = ((idOrQuery % TRACKS_LIST.length) + TRACKS_LIST.length) % TRACKS_LIST.length;
        tr = TRACKS_LIST[idx];
      } else if (idOrQuery) {
        const q = String(idOrQuery).toLowerCase().trim();
        idx = TRACKS_LIST.findIndex(t => t.id === q || t.name.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
        if (idx !== -1) tr = TRACKS_LIST[idx];
      }

      if (!tr) {
        idx = currentTrackIdx;
        tr = TRACKS_LIST[idx];
      }

      currentTrackIdx = idx;

      // Auto unmute if user explicitly triggers music
      if (state.isMuted) {
        state.isMuted = false;
        saveState();
      }

      if (window.__musicPlayer && window.__musicPlayer.playTrack) {
        if (bgAudio && !bgAudio.paused) bgAudio.pause();
        const res = window.__musicPlayer.playTrack(tr.id);
        if (res) {
          isCurrentlyPlaying = true;
          updateClippyMusicNote(true);
          if (typeof updateAllClippyMusicCards === 'function') {
            updateAllClippyMusicCards(tr, true);
          }
          return tr;
        }
      }

      if (!bgAudio) {
        bgAudio = new Audio();
      }
      bgAudio.src = `/musics/${tr.id}.mp3`;
      bgAudio.volume = (VolumeManager.isMuted() || state.volume === 0) ? 0 : VolumeManager.getVolume();
      isCurrentlyPlaying = true;
      updateClippyMusicNote(true);
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isCurrentlyPlaying = true;
          updateClippyMusicNote(true);
          showMusicBalloonToast(tr);
          if (typeof updateAllClippyMusicCards === 'function') {
            updateAllClippyMusicCards(tr, true);
          }
        }).catch((err) => {
          console.warn("Background audio play error:", err);
          isCurrentlyPlaying = false;
          updateClippyMusicNote(false);
          if (typeof updateAllClippyMusicCards === 'function') {
            updateAllClippyMusicCards(tr, false);
          }
        });
      }

      bgAudio.onended = () => {
        MusicController.next();
      };

      return tr;
    },
    play(idOrQuery) {
      if (idOrQuery !== undefined) {
        return this.playTrack(idOrQuery);
      }
      if (this.isPlaying()) return this.getCurrentTrack();
      this.resume();
      return this.getCurrentTrack();
    },
    togglePlay() {
      if (typeof stopClippySpeech === 'function') stopClippySpeech();
      if (window.__musicPlayer && window.__musicPlayer.toggle) {
        window.__musicPlayer.toggle();
        isCurrentlyPlaying = window.__musicPlayer.isPlaying;
        updateClippyMusicNote(isCurrentlyPlaying);
        if (typeof updateAllClippyMusicCards === 'function') {
          updateAllClippyMusicCards(this.getCurrentTrack(), isCurrentlyPlaying);
        }
        return isCurrentlyPlaying;
      }
      if (bgAudio && bgAudio.src) {
        if (bgAudio.paused) {
          if (state.isMuted) { state.isMuted = false; saveState(); }
          bgAudio.volume = (VolumeManager.isMuted() || state.volume === 0) ? 0 : VolumeManager.getVolume();
          bgAudio.play().then(() => {
            isCurrentlyPlaying = true;
            updateClippyMusicNote(true);
            if (typeof updateAllClippyMusicCards === 'function') {
              updateAllClippyMusicCards(this.getCurrentTrack(), true);
            }
          }).catch(err => console.warn(err));
          isCurrentlyPlaying = true;
        } else {
          bgAudio.pause();
          isCurrentlyPlaying = false;
          updateClippyMusicNote(false);
          if (typeof updateAllClippyMusicCards === 'function') {
            updateAllClippyMusicCards(this.getCurrentTrack(), false);
          }
        }
        return isCurrentlyPlaying;
      }
      this.playTrack(currentTrackIdx);
      return true;
    },
    next() {
      let tr;
      if (window.__musicPlayer && window.__musicPlayer.next) {
        window.__musicPlayer.next();
        tr = this.getCurrentTrack();
      } else {
        tr = this.playTrack(currentTrackIdx + 1);
      }
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(tr, true);
      }
      return tr;
    },
    nextTrack() {
      return this.next();
    },
    prev() {
      let tr;
      if (window.__musicPlayer && window.__musicPlayer.prev) {
        window.__musicPlayer.prev();
        tr = this.getCurrentTrack();
      } else {
        tr = this.playTrack(currentTrackIdx - 1);
      }
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(tr, true);
      }
      return tr;
    },
    prevTrack() {
      return this.prev();
    },
    pause() {
      if (window.__musicPlayer && window.__musicPlayer.pause) {
        window.__musicPlayer.pause();
      }
      if (bgAudio && !bgAudio.paused) bgAudio.pause();
      isCurrentlyPlaying = false;
      updateClippyMusicNote(false);
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(this.getCurrentTrack(), false);
      }
    },
    resume() {
      if (typeof stopClippySpeech === 'function') stopClippySpeech();
      if (window.__musicPlayer && window.__musicPlayer.resume) {
        window.__musicPlayer.resume();
        isCurrentlyPlaying = true;
        updateClippyMusicNote(true);
        if (typeof updateAllClippyMusicCards === 'function') {
          updateAllClippyMusicCards(this.getCurrentTrack(), true);
        }
        return;
      }
      if (bgAudio && bgAudio.src && bgAudio.paused) {
        if (state.isMuted) { state.isMuted = false; saveState(); }
        bgAudio.volume = (VolumeManager.isMuted() || state.volume === 0) ? 0 : VolumeManager.getVolume();
        bgAudio.play().then(() => {
          isCurrentlyPlaying = true;
          updateClippyMusicNote(true);
          if (typeof updateAllClippyMusicCards === 'function') {
            updateAllClippyMusicCards(this.getCurrentTrack(), true);
          }
        }).catch(err => console.warn(err));
        isCurrentlyPlaying = true;
        return;
      }
      this.playTrack(currentTrackIdx);
    }
  };



  function createClippyMusicCardHTML(track, isPlaying) {

    if (!track) return '';

    const name = track.name || 'Unknown Track';

    const artist = track.artists ? track.artists[0].name : (track.artist || 'Unknown Artist');

    const album = track.album ? (track.album.name || track.album) : '';

    const cover = (track.album && track.album.images) ? track.album.images[0].url : (track.cover || `/img/album-covers/${track.id}.webp`);

    const playStateClass = isPlaying ? 'playing' : '';



    return `

      <div class="clippy-music-card">

        <img src="${cover}" class="clippy-music-art" alt="Album Cover" />

        <div class="clippy-music-info">

          <div class="clippy-music-title">${escapeHtml(name)}</div>

          <div class="clippy-music-artist">${escapeHtml(artist)}${album ? ' &bull; ' + escapeHtml(album) : ''}</div>

          <div class="clippy-music-eq ${playStateClass}">

            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>

          </div>

        </div>

      </div>

    `;

  }



  

  function updateAllClippyMusicCards(track, isPlaying) {
    if (!track) {
      if (typeof MusicController !== 'undefined' && MusicController.getCurrentTrack) {
        track = MusicController.getCurrentTrack();
      } else if (typeof TRACKS_LIST !== 'undefined' && TRACKS_LIST[currentTrackIdx]) {
        track = TRACKS_LIST[currentTrackIdx];
      }
    }
    if (isPlaying === undefined) {
      if (typeof MusicController !== 'undefined' && MusicController.isPlaying) {
        isPlaying = MusicController.isPlaying();
      } else {
        isPlaying = isCurrentlyPlaying;
      }
    }
    if (!track) return;

    const name = track.name || 'Unknown Track';
    const artist = track.artists ? track.artists[0].name : (track.artist || 'Unknown Artist');
    const album = track.album ? (track.album.name || track.album) : '';
    const cover = (track.album && track.album.images && track.album.images[0])
      ? track.album.images[0].url
      : (track.cover || `/img/album-covers/${track.id}.webp`);

    // 1. Instantly update all rendered music cards in Clippy chat bubbles
    const cards = document.querySelectorAll('.clippy-music-card');
    cards.forEach(card => {
      const img = card.querySelector('.clippy-music-art');
      if (img && img.getAttribute('src') !== cover) {
        img.src = cover;
      }
      const titleEl = card.querySelector('.clippy-music-title');
      if (titleEl && titleEl.textContent !== name) {
        titleEl.textContent = name;
      }
      const artistEl = card.querySelector('.clippy-music-artist');
      if (artistEl) {
        artistEl.innerHTML = escapeHtml(artist) + (album ? ' &bull; ' + escapeHtml(album) : '');
      }
      const eq = card.querySelector('.clippy-music-eq');
      if (eq) {
        if (isPlaying) {
          eq.classList.add('playing');
        } else {
          eq.classList.remove('playing');
        }
      }
    });

    // 2. Also keep in-memory chat history updated so re-renders retain current track info
    if (typeof clippyChatHistory !== 'undefined' && Array.isArray(clippyChatHistory)) {
      clippyChatHistory.forEach(item => {
        if (item && item.summary && item.summary.includes('clippy-music-card')) {
          item.summary = item.summary.replace(
            /<div class="clippy-music-card">[\s\S]*?<\/div>\s*<\/div>/,
            createClippyMusicCardHTML(track, isPlaying)
          );
        }
      });
    }
  }

  window.__updateAllClippyMusicCards = updateAllClippyMusicCards;
  window.MusicController = MusicController;


  function triggerMatrixMode() {

    let overlay = document.getElementById('xp-matrix-overlay');

    if (overlay) return;

    // Close balloon and hide Clippy cleanly so Matrix mode has a full, uninterrupted screen
    const clippyRoot = document.getElementById('xp-clippy-assistant-root');
    if (clippyRoot) {
      clippyRoot.classList.remove('balloon-open');
      const balloon = document.getElementById('clippy-balloon');
      if (balloon) balloon.style.display = 'none';
      const badge = document.getElementById('clippy-badge');
      if (badge) badge.style.display = '';
      clippyRoot.style.display = 'none';
    }

    overlay = document.createElement('div');

    overlay.id = 'xp-matrix-overlay';

    overlay.className = 'xp-matrix-overlay';



    overlay.innerHTML = `

      <canvas id="xp-matrix-canvas" class="xp-matrix-canvas"></canvas>

      <div class="xp-matrix-dialog">

        <h3>[ SYSTEM BREACH DETECTED ]</h3>

        <p>> Connected to Vedant's Matrix Core.<br>> SDE Candidate Status: ONLINE & READY TO HIRE.<br>> Knowledge: GraphRAG, AI Systems, Distributed Backends.</p>

        <button class="xp-matrix-exit-btn" id="xp-matrix-exit">Exit Matrix [ESC]</button>

      </div>

    `;



    document.body.appendChild(overlay);



    const canvas = overlay.querySelector('#xp-matrix-canvas');

    const ctx = canvas.getContext('2d');



    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;



    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]=/*+~';

    const fontSize = 16;

    const columns = Math.floor(canvas.width / fontSize);

    const drops = [];

    for (let x = 0; x < columns; x++) {

      drops[x] = Math.random() * -50;

    }



    let animId = null;

    function drawMatrix() {

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';

      ctx.fillRect(0, 0, canvas.width, canvas.height);



      ctx.fillStyle = '#00ff66';

      ctx.font = fontSize + 'px monospace';



      for (let i = 0; i < drops.length; i++) {

        const text = katakana.charAt(Math.floor(Math.random() * katakana.length));

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);



        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {

          drops[i] = 0;

        }

        drops[i]++;

      }

      animId = requestAnimationFrame(drawMatrix);

    }

    drawMatrix();



    function exitMatrix() {

      if (animId) cancelAnimationFrame(animId);

      overlay.remove();

      window.removeEventListener('keydown', onKey);

      // Restore Clippy smoothly onto desktop when exiting Matrix
      const clippyRoot = document.getElementById('xp-clippy-assistant-root');
      if (clippyRoot) {
        clippyRoot.style.display = 'flex';
      }

    }



    function onKey(e) {

      if (e.key === 'Escape') exitMatrix();

    }



    overlay.querySelector('#xp-matrix-exit').addEventListener('click', exitMatrix);

    window.addEventListener('keydown', onKey);

    SoundManager.playDing();

  }

  function toggleMatrixRain() {
    triggerMatrixMode();
  }
  window.toggleMatrixRain = toggleMatrixRain;
  window.triggerMatrixMode = triggerMatrixMode;
  window.getPinnedStartApps = getPinnedStartApps;
  window.savePinnedStartApps = savePinnedStartApps;
  window.handleSessionLifecycle = handleSessionLifecycle;
  window.getDeletedApps = getDeletedApps;
  window.getCustomPositions = getCustomPositions;
  window.renderQuickLaunchToolbar = renderQuickLaunchToolbar;
  window.renderPinnedStartApps = renderPinnedStartApps;



  // --------------------------------------------------------------------------

  // Clippy AI Assistant (Windows XP Interactive Knowledge Companion)

  // --------------------------------------------------------------------------

  const CLIPPY_KB = {
    certifications: {
      title: "Professional Certifications & Credentials 📜",
      summary: "Vedant's verified professional specializations and problem-solving ranks:",
      bullets: [
        "📜 <strong>Data Structures & Algorithms Specialization</strong>: Amazon / Coursera (2025) &ndash; Graph algorithms, dynamic programming, divide-and-conquer, greedy techniques.",
        "🌐 <strong>The Complete Full-Stack Web Development Bootcamp</strong>: Udemy (2026) &ndash; Modern React, Node.js, Express, RESTful APIs, PostgreSQL, Docker.",
        "🏛️ <strong>Software Design & Architecture Specialization</strong>: Univ of Alberta / Coursera &ndash; GoF Design Patterns, clean architecture, microservices, enterprise OOP.",
        "🏆 <strong>CodeChef 3-Star (Rating: 1,824)</strong>: Top 5% globally in algorithmic problem solving.",
        "🧩 <strong>LeetCode Contest Rating: 1,480</strong>: 150+ DSA problems solved across trees, graphs, and DP."
      ],
      actions: [
        { label: "📂 Open Certifications", action: "open_projects" },
        { label: "📄 View Full Resume", action: "open_cv" },
        { label: "📬 Contact Vedant", action: "open_contact" }
      ]
    },

    bio: {

      title: "Who is Vedant Kale?",

      summary: "Vedant Kale is a final-year B.Tech Computer Science student at Pimpri Chinchwad University (PCU), Pune, and a Software Developer Intern. He is actively targeting Software Development Engineer (SDE) roles in backend engineering and AI systems (RAG, GraphRAG, FastAPI, Distributed Systems).",

      bullets: [

        "🎓 <strong>Education</strong>: B.Tech in CSE at PCU, Pune (Aug 2023 &ndash; May 2027) with CGPA 7.69/10.",

        "💼 <strong>Internship</strong>: Software Developer Intern at Karst Technologies (Jul&ndash;Sep 2026).",

        "🧠 <strong>AI & Systems</strong>: Built GraphRAG and financial RAG engines, boosting Recall@10 from 42.6% to 73.3%.",

        "⚡ <strong>Problem Solving</strong>: 150+ LeetCode problems solved (Rating: 1,480); CodeChef 1,824."

      ],

      actions: [

        { label: "📄 View Resume", action: "open_cv" },

        { label: "📬 Contact Info", action: "open_contact" },

        { label: "🐙 GitHub Profile", link: "https://github.com/VedantKale244" },

        { label: "💼 LinkedIn", link: "https://linkedin.com/in/vedant-kale-33230a28b/" }

      ]

    },

    skills: {

      title: "Technical Skills & Competencies",

      summary: "Here is Vedant's complete technical arsenal:",

      bullets: [

        "💻 <strong>Languages</strong>: C++, Python, Java, JavaScript, TypeScript, SQL",

        "⚙️ <strong>Backend & Web</strong>: FastAPI, Node.js, Express.js, React.js, Next.js, Tailwind CSS, REST APIs, Microservices",

        "🗄️ <strong>Databases & Search</strong>: PostgreSQL, MongoDB, Redis, Neo4j, Pinecone, pgvector, SQLAlchemy, BM25, Hybrid Search, Cross-Encoder Reranking",

        "🤖 <strong>AI & Machine Learning</strong>: RAG, GraphRAG, Knowledge Graphs, Embeddings, RAGAS, LangChain, LangGraph, Ollama, Cohere Rerank, PyTorch, Scikit-learn",

        "☁️ <strong>Cloud & DevOps</strong>: Docker, Git, Linux, CI/CD, AWS (EC2, S3, Lambda, DynamoDB), Pytest, Latency Monitoring",

        "🧠 <strong>Core Computer Science</strong>: DSA, OOP, Operating Systems, DBMS, System Design, Distributed Systems"

      ],

      actions: [

        { label: "💻 Open Terminal", action: "open_terminal" },

        { label: "🚀 View Projects", action: "open_projects" },

        { label: "📥 Download Resume", link: "/pdf/Vedant_Kale_Resume.pdf" }

      ]

    },

    projects: {

      title: "Key Engineering Projects",

      summary: "Vedant has engineered three prominent backend and AI projects:",

      bullets: [

        "1. <strong>Neuro-Adaptive GraphRAG Platform</strong> (Jan&ndash;Apr 2026): Hybrid GraphRAG pipeline (Neo4j, Pinecone, Cohere reranking) with 534 passing tests across 36 modules, RAGAS evaluation gates, and 2.5s p95 latency threshold.",

        "2. <strong>ArthaSEC &ndash; Financial RAG & Evidence Verification</strong> (May&ndash;Jul 2026): Retrieval engine over 352 SEC filings (32,000 chunks) raising Recall@10 from 42.6% to 73.3%, with citation verification and BGE reranking (~17ms p50 latency).",

        "3. <strong>Adaptive Two-Tier Malware Detection</strong> (Research): Random Forest + sandbox detection for SQLi, XSS, and malware uploads across 9,000 API requests (98.1% accuracy; 99.30% accuracy on CIC-IDS/EMBER with 0.003ms CPU inference)."

      ],

      actions: [

        { label: "📂 Open My Projects", action: "open_projects" },

        { label: "🐙 GraphRAG Repo", link: "https://github.com/VedantKale244/RAG-pipeline" },

        { label: "🐙 ArthaSEC Repo", link: "https://github.com/VedantKale244/ArthaSEC" }

      ]

    },

    experience: {

      title: "Work Experience & Internship",

      summary: "Vedant's software industry experience:",

      bullets: [

        "🏢 <strong>Software Developer Intern</strong> &mdash; <em>Karst Technologies Private Limited, Pune, India</em> (Jul 2026 &ndash; Sep 2026)",

        "🛠️ <strong>Stack</strong>: JavaScript, Node.js, Express.js, React.js, MongoDB, REST APIs, Git",

        "✔️ Developed and maintained 3 core application components, resolving 5 software defects across dev workflows.",

        "✔️ Integrated and tested 4 REST API endpoints with database operations, validating data flow across components.",

        "✔️ Executed 10 functional test cases, verifying application behavior prior to feature delivery."

      ],

      actions: [

        { label: "📄 Open Full CV", action: "open_cv" },

        { label: "📬 Contact Vedant", action: "open_contact" }

      ]

    },

    education: {

      title: "Education & Academics",

      summary: "Vedant's educational background:",

      bullets: [

        "🏛️ <strong>Pimpri Chinchwad University (PCU), Pune, India</strong>",

        "🎓 <strong>Degree</strong>: B.Tech in Computer Science & Engineering",

        "📅 <strong>Duration</strong>: Aug 2023 &ndash; May 2027 (Final Year)",

        "📊 <strong>CGPA</strong>: 7.69 / 10.0",

        "🏆 <strong>Certifications</strong>: Amazon Data Structures & Algorithms Specialization (Coursera 2025), Complete Full-Stack Web Development (Udemy 2026)"

      ],

      actions: [

        { label: "📄 View CV in Window", action: "open_cv" },

        { label: "🖨️ Printable Resume", link: "/resume_print.html" }

      ]

    },

    leetcode: {

      title: "Competitive Programming & Problem Solving",

      summary: "Vedant is an active problem solver on top competitive coding platforms:",

      bullets: [

        "🧩 <strong>LeetCode</strong>: 150+ problems solved across Trees, Graphs, Dynamic Programming, Arrays, and Heaps (Rating: 1,480).",

        "⭐ <strong>CodeChef</strong>: Overall Rating 1,824 (DSA Rating: 1,659).",

        "⚡ Strong speed and intuition in C++ and Python for high-performance algorithm implementation."

      ],

      actions: [

        { label: "🎯 LeetCode Profile", link: "https://leetcode.com/u/Vedant_Kale27" },

        { label: "💻 Open Terminal", action: "open_terminal" }

      ]

    },

    contact: {

      title: "Contact & Hiring Inquiries",

      summary: "Vedant is open for SDE and Backend/AI Engineer roles! Reach out directly:",

      bullets: [

        "📧 <strong>Email</strong>: <a href='mailto:kalevedant750@gmail.com' style='color:#0058ee; font-weight:bold;'>kalevedant750@gmail.com</a>",

        "📱 <strong>Phone</strong>: +91 9356608540",

        "📍 <strong>Location</strong>: Pune, Maharashtra, India",

        "💼 <strong>LinkedIn</strong>: <a href='https://linkedin.com/in/vedant-kale-33230a28b/' target='_blank' style='color:#0058ee;'>linkedin.com/in/vedant-kale-33230a28b/</a>",

        "🐙 <strong>GitHub</strong>: <a href='https://github.com/VedantKale244' target='_blank' style='color:#0058ee;'>github.com/VedantKale244</a>"

      ],

      actions: [

        { label: "✉️ Send Email", link: "mailto:kalevedant750@gmail.com" },

        { label: "📝 ✉️ Message ME", action: "open_contact" },

        { label: "💼 LinkedIn Message", link: "https://linkedin.com/in/vedant-kale-33230a28b/" }

      ]

    },

    whyHire: {

      title: "Why Hire Vedant Kale?",

      summary: "Here is why Vedant stands out for SDE Backend & AI Engineering roles:",

      bullets: [

        "1. <strong>Production Rigor</strong>: His GraphRAG platform has 534 unit tests across 36 modules with strict RAGAS gates and p95 latency checks.",

        "2. <strong>Measurable Impact</strong>: Raised real retrieval Recall@10 from 42.6% to 73.3% on 352 SEC filings.",

        "3. <strong>Deep CS Fundamentals</strong>: 150+ LeetCode solved with strong C++/Python OOP and system design knowledge.",

        "4. <strong>Industry Ready</strong>: Previous internship experience shipping REST APIs, bug fixes, and testing in Agile workflows."

      ],

      actions: [

        { label: "📄 Inspect Resume", action: "open_cv" },

        { label: "📬 Schedule an Interview", link: "mailto:kalevedant750@gmail.com?subject=Interview%20Invitation%20-%20Vedant%20Kale" }

      ]

    }

  };



  function escapeHtml(str) {

    if (!str) return '';

    return String(str)

      .replace(/&/g, '&amp;')

      .replace(/</g, '&lt;')

      .replace(/>/g, '&gt;')

      .replace(/"/g, '&quot;');

  }



  let clippyChatHistory = [
    {
      sender: 'bot',
      time: 'Just now',
      title: "Hi! I'm Clippy &mdash; Vedant's SDE Copilot 📎",
      summary: "I can help you explore Vedant Kale's portfolio, systems engineering architecture, and background. Here is a quick snapshot:",
      bullets: [
        "🎓 <strong>Final-Year B.Tech CS</strong> at Pimpri Chinchwad University (PCU), Pune | CGPA: <strong>7.69/10</strong>",
        "🚀 <strong>Neuro-Adaptive GraphRAG</strong>: Neo4j + Pinecone + Cohere hybrid pipeline with 534 passing tests",
        "📈 <strong>ArthaSEC Engine</strong>: Financial RAG over 352 SEC filings (32K chunks), BGE cross-encoder (17ms p50 latency)",
        "🛡️ <strong>Adaptive Malware Detection</strong>: Two-tier ML sandbox with 99.30% accuracy, 0.003ms CPU latency",
        "💼 <strong>SDE Intern</strong> at Karst Technologies (Jul 2026 &ndash; Sep 2026)",
        "🏆 <strong>CodeChef 3-Star (1824)</strong> &amp; LeetCode (1480, 150+ solved)"
      ],
      actions: [
        { label: "🚀 GraphRAG Platform", action: "query_projects" },
        { label: "📈 ArthaSEC Engine", link: "https://github.com/VedantKale244/ArthaSEC" },
        { label: "🛡️ Malware Detection", action: "query_projects" },
        { label: "💼 Karst Tech Internship", action: "query_experience" },
        { label: "🏆 Certifications", action: "open_projects" },
        { label: "📄 View Resume", action: "open_cv" }
      ]
    }
  ];

  function matchClippyQuery(rawText) {
    const q = (rawText || '').toLowerCase().trim();
    if (!q) return null;

    // Specific Project: GraphRAG
    if (/(graphrag|graph\s*rag|hybrid\s*rag|neo4j|pinecone|cohere|ragas)/i.test(q)) {
      return {
        title: "Neuro-Adaptive GraphRAG Platform 🚀",
        summary: "Vedant built a production-grade Hybrid GraphRAG pipeline fusing Neo4j knowledge graphs, Pinecone vector indexing, and Cohere reranking:",
        bullets: [
          "🧪 <strong>534 passing tests</strong> across 36 modules with 100% CI reproducibility.",
          "🎯 <strong>RAGAS evaluation gates</strong> validating retrieval faithfulness and relevancy with a 2.5s p95 latency threshold.",
          "🔄 <strong>Self-optimization framework</strong> (quality 50%, latency 30%, feedback 20%) with 15% canary rollout."
        ],
        actions: [
          { label: "🐙 GraphRAG Repo ↗", link: "https://github.com/VedantKale244/RAG-pipeline" },
          { label: "📂 Open My Projects", action: "open_projects" }
        ]
      };
    }

    // Specific Project: ArthaSEC
    if (/(arthasec|artha|sec\s*filing|financial\s*rag|10-k|evidence\s*verification|bm25|bge)/i.test(q)) {
      return {
        title: "ArthaSEC &ndash; Financial RAG & Evidence Verification 📈",
        summary: "Financial intelligence retrieval engine over 352 SEC filings (32,000 chunks):",
        bullets: [
          "📊 <strong>Recall@10 jumped from 42.6% to 73.3%</strong> using BM25 + dense hybrid search.",
          "📑 <strong>Citation verification</strong> and deterministic mathematical validation to flag unsupported financial metrics.",
          "⚡ <strong>BGE cross-encoder reranking</strong> reaching ~17ms p50 latency in fast mode."
        ],
        actions: [
          { label: "🐙 ArthaSEC Repo ↗", link: "https://github.com/VedantKale244/ArthaSEC" },
          { label: "📂 Open My Projects", action: "open_projects" }
        ]
      };
    }

    // Specific Project: Malware Detection
    if (/(malware|evidential|two-tier|cic-ids|ember|sqli|xss|rce|random\s*forest|intrusion)/i.test(q)) {
      return {
        title: "Adaptive Two-Tier Malware Detection 🛡️",
        summary: "Ongoing machine learning research for API and payload security:",
        bullets: [
          "🛡️ <strong>Two-tier architecture</strong> (Random Forest + sandbox) for SQLi, XSS, malware uploads, and RCE on 9,000 API requests.",
          "⚙️ <strong>Confidence-based escalation</strong>: 98.1% accuracy with 58.8% fewer deep sandbox inspections.",
          "⚡ <strong>Evaluated on 10,000 CIC-IDS/EMBER records</strong>: 99.30% accuracy, 0.003ms CPU inference latency."
        ],
        actions: [
          { label: "📂 Open My Projects", action: "open_projects" },
          { label: "📄 View Resume", action: "open_cv" }
        ]
      };
    }

    // Work Experience / Karst Tech
    if (/(intern|internship|experience|work|karst|karst\s*tech)/i.test(q)) {
      return {
        title: "Work Experience &ndash; Karst Technologies 💼",
        summary: "Vedant worked as a Software Developer Engineer (SDE) Intern at Karst Technologies Private Limited (Jul 2026 &ndash; Sep 2026):",
        bullets: [
          "💻 <strong>Tech Stack</strong>: JavaScript, Node.js, Express.js, React.js, MongoDB, REST APIs, Git.",
          "⚙️ <strong>Component Architecture</strong>: Developed and maintained 3 core application modules, resolving 5 critical software defects.",
          "🔌 <strong>API Engineering</strong>: Integrated and tested 4 REST API endpoints with databases for real-time client sync.",
          "🧪 <strong>Quality Assurance</strong>: Executed 10 comprehensive functional test cases across production workflows."
        ],
        actions: [
          { label: "📂 Open Work Experience", action: "open_projects" },
          { label: "📄 View Resume", action: "open_cv" }
        ]
      };
    }

    // Certifications query
    if (/(certif|credential|amazon|udemy|coursera|codechef|leetcode)/i.test(q)) {
      return {
        title: "Verified Certifications & Coding Rankings 🏆",
        summary: "Vedant's verified credentials and competitive programming stats:",
        bullets: [
          "🌟 <strong>CodeChef</strong>: 1824 Rating (3-Star Coder)",
          "💡 <strong>LeetCode</strong>: 1480 Rating (150+ Data Structures & Algorithms problems solved)",
          "📦 <strong>Amazon / Coursera</strong>: Data Structures and Algorithms Specialization",
          "🌐 <strong>Udemy</strong>: Complete Full-Stack Web Development Bootcamp",
          "🏛️ <strong>University of Alberta</strong>: Software Design and Architecture Specialization"
        ],
        actions: [
          { label: "📂 View Certifications", action: "open_projects" },
          { label: "📄 View Resume", action: "open_cv" }
        ]
      };
    }

    // 1. Identity: "Who are you?", "Who is Clippy?", "What are you?"
    if (/\b(who are (you|u)|what are you|who is clippy|about clippy|your name|what is clippy)\b/i.test(q)) {
      return {
        title: "Hi! I'm Clippy! 📎",
        summary: "I'm <strong>Clippy</strong>, Vedant's personal AI Assistant on this Windows XP portfolio!<br><br>I can answer any questions about his background, technical skills, GraphRAG & backend projects, work experience, LeetCode stats, or help you launch retro apps, play music, and contact him.",
        actions: [
          { label: "👤 Who is Vedant?", action: "query_bio" },
          { label: "💻 Tech Skills", action: "query_skills" },
          { label: "🚀 Projects", action: "query_projects" },
          { label: "💼 Internship", action: "query_experience" },
          { label: "📄 View Resume", action: "open_cv" }
        ]
      };
    }

    // 2. Greetings: "Hi", "Hello", "Hey", "Yo", etc.
    if (/^(hi|hello|hey|yo|howdy|sup|greetings|good (morning|afternoon|evening))\b/i.test(q)) {
      return {
        title: "Hello there! 👋",
        summary: "Great to meet you! I'm Clippy, your desktop assistant. Ask me anything about Vedant's projects, experience, or skills!",
        actions: [
          { label: "👤 Who is Vedant?", action: "query_bio" },
          { label: "🚀 GraphRAG Project", action: "query_projects" },
          { label: "💼 Karst Tech Experience", action: "query_experience" }
        ]
      };
    }

    // 3. Bio / Background
    if (/(who is vedant|about vedant|bio|background|education|college|pcu|university|cgpa|gpa)/i.test(q)) {
      return {
        title: "Vedant Kale &ndash; Software & Systems Engineer 🎓",
        summary: "Vedant Kale is a final-year B.Tech Computer Science student at <strong>Pimpri Chinchwad University (PCU), Pune</strong> with a <strong>7.69/10 CGPA</strong>.",
        bullets: [
          "🎓 <strong>Degree</strong>: B.Tech in Computer Science & Engineering (2023 - 2027)",
          "💼 <strong>Experience</strong>: SDE Intern at Karst Technologies (Jul - Sep 2026)",
          "🚀 <strong>Specialization</strong>: GraphRAG, Vector Databases, High-Performance Backends, Machine Learning",
          "🏆 <strong>Achievements</strong>: CodeChef 1824 (3-Star), LeetCode 1480 (150+ solved)"
        ],
        actions: [
          { label: "📄 View Resume", action: "open_cv" },
          { label: "📧 Contact Vedant", action: "open_contact" }
        ]
      };
    }

    // 4. Skills / Technologies
    if (/(skill|skills|stack|tech|technolog|language|python|fastapi|react|node|docker)/i.test(q)) {
      return {
        title: "Technical Stack & Core Skills 💻",
        summary: "Vedant has strong hands-on expertise across systems, machine learning, and full-stack development:",
        bullets: [
          "🐍 <strong>Languages & Frameworks</strong>: Python, FastAPI, JavaScript, TypeScript, Node.js, Express, React.js, Next.js, C++",
          "🗄️ <strong>Databases & Vector Stores</strong>: Neo4j (Graph), Pinecone (Vector), PostgreSQL, MongoDB, Redis, BM25",
          "🤖 <strong>AI/ML & RAG</strong>: GraphRAG, Cohere Rerank, BGE Cross-Encoder, PyTorch, RAGAS, Scikit-Learn",
          "☁️ <strong>Tools & DevOps</strong>: Docker, Git, Linux, Postman, Swagger, CI/CD"
        ],
        actions: [
          { label: "🚀 View Projects", action: "open_projects" },
          { label: "📄 View Resume", action: "open_cv" }
        ]
      };
    }

    // 5. Contact / Hire / Email
    if (/(contact|email|reach|hire|phone|github|linkedin|social)/i.test(q)) {
      return {
        title: "Get in Touch with Vedant 📬",
        summary: "Vedant is actively open to Software Engineering and Systems Engineer opportunities:",
        bullets: [
          "📧 <strong>Email</strong>: <a href='mailto:kalevedant750@gmail.com' style='color:#0046dd;'>kalevedant750@gmail.com</a>",
          "📍 <strong>Location</strong>: Pune, Maharashtra, India",
          "🐙 <strong>GitHub</strong>: <a href='https://github.com/VedantKale244' target='_blank' style='color:#0046dd;'>github.com/VedantKale244</a>",
          "💼 <strong>LinkedIn</strong>: <a href='https://www.linkedin.com/in/vedant-kale-33230a28b/' target='_blank' style='color:#0046dd;'>linkedin.com/in/vedant-kale-33230a28b/</a>"
        ],
        actions: [
          { label: "✉️ ✉️ Message ME", action: "open_contact" },
          { label: "📄 View Resume", action: "open_cv" }
        ]
      };
    }

    // Music Controls: Specific pause / stop
    if (/(pause\s*(music|song|track)|stop\s*(music|song|track))/i.test(q)) {
      MusicController.pause();
      const tr = MusicController.getCurrentTrack();
      const cardHtml = createClippyMusicCardHTML(tr, false);
      return {
        title: "Windows XP Media Player ⏸️",
        summary: `Music paused.<br/>${cardHtml}`,
        actions: [
          { label: "▶️ Resume Music", action: "music_play" },
          { label: "⏭️ Next Track", action: "music_next" },
          { label: "🎵 Open Player", action: "open_music" }
        ]
      };
    }

    // Music Controls: Specific next / skip
    if (/(next\s*(song|track|music)|skip\s*(song|track))/i.test(q)) {
      const tr = MusicController.next();
      const cardHtml = createClippyMusicCardHTML(tr, true);
      return {
        title: "Windows XP Media Player ⏭️",
        summary: `Skipped to next track!<br/>${cardHtml}`,
        actions: [
          { label: "⏸️ Pause", action: "music_pause" },
          { label: "⏭️ Next Track", action: "music_next" },
          { label: "⏮️ Prev Track", action: "music_prev" },
          { label: "🎵 Open Player", action: "open_music" }
        ]
      };
    }

    // 6. Music / Audio (Auto-starts playback and renders live player card)
    if (/(music|song|play|track|audio|sound)/i.test(q)) {
      const songQuery = q.replace(/play|music|song|track|the/gi, '').trim();
      let tr = null;
      if (songQuery.length >= 3) {
        tr = MusicController.playTrack(songQuery);
      } else {
        tr = MusicController.play(currentTrackIdx);
      }
      if (!tr) tr = MusicController.getCurrentTrack();

      const cardHtml = createClippyMusicCardHTML(tr, true);

      return {
        title: "Windows XP Media Player 🎵",
        summary: `Now playing background music! You can control playback right here, from your desktop tray, or by opening the full Media Player.<br/>${cardHtml}`,
        actions: [
          { label: "⏸️ Pause", action: "music_pause" },
          { label: "▶️ Play", action: "music_play" },
          { label: "⏭️ Next", action: "music_next" },
          { label: "⏮️ Prev", action: "music_prev" },
          { label: "🎵 Open Player", action: "open_music" }
        ]
      };
    }

    // Default intelligent response
    return {
      title: "I'm on it! 📎",
      summary: "I'm familiar with all aspects of Vedant's portfolio. You can ask me about his <strong>GraphRAG</strong> pipeline, <strong>ArthaSEC</strong> financial engine, <strong>Malware AI</strong> research, <strong>Karst Technologies</strong> internship, or his <strong>certifications</strong>!",
      actions: [
        { label: "🚀 GraphRAG", action: "query_projects" },
        { label: "📈 ArthaSEC", link: "https://github.com/VedantKale244/ArthaSEC" },
        { label: "💼 Karst Tech", action: "query_experience" },
        { label: "🏆 Certifications", action: "open_projects" },
        { label: "📄 Resume", action: "open_cv" }
      ]
    };
  }

  function renderClippyMessages(container) {
    if (!container) return;
    container.innerHTML = '';
    if (typeof clippyChatHistory === 'undefined' || !Array.isArray(clippyChatHistory)) return;

    clippyChatHistory.forEach(item => {
      const msgDiv = document.createElement('div');
      msgDiv.className = item.sender === 'user' ? 'clippy-msg clippy-msg-user' : 'clippy-msg clippy-msg-bot';

      let html = '';
      if (item.title) {
        html += `<div class="clippy-msg-title">${item.title}</div>`;
      }
      if (item.summary) {
        html += `<div class="clippy-msg-summary">${item.summary}</div>`;
      }
      if (item.bullets && item.bullets.length > 0) {
        html += '<ul class="clippy-msg-bullets">';
        item.bullets.forEach(b => {
          html += `<li>${b}</li>`;
        });
        html += '</ul>';
      }
      if (item.actions && item.actions.length > 0) {
        html += '<div class="clippy-msg-actions">';
        item.actions.forEach(act => {
          if (act.link) {
            html += `<a href="${act.link}" target="_blank" class="clippy-action-btn">${escapeHtml(act.label)}</a>`;
          } else {
            html += `<button class="clippy-action-btn" data-act="${act.action}">${escapeHtml(act.label)}</button>`;
          }
        });
        html += '</div>';
      }
      if (item.time) {
        html += `<div class="clippy-msg-time">${item.time}</div>`;
      }
      msgDiv.innerHTML = html;
      container.appendChild(msgDiv);
    });
    container.scrollTop = container.scrollHeight;
  }

  function handleClippyAction(actCode, inputField, sendQueryFn) {

    if (!actCode) return;

    if (actCode === 'open_gallery') {
      if (window.__openWindow) window.__openWindow('pictures');
    } else if (actCode === 'open_paint') {

      openPaintApp();

    } else if (actCode === 'open_pinball') {

      openPinballApp();

    } else if (actCode === 'open_recycle') {

      openRecycleBinApp();

    } else if (actCode === 'open_notes') {

      toggleStickyNotes();

    } else if (actCode === 'open_cv') {

      if (window.__openWindow) window.__openWindow('myCV');

    } else if (actCode === 'open_projects') {

      if (window.__openWindow) window.__openWindow('myProjects');

    } else if (actCode === 'open_terminal') {

      if (window.__openWindow) window.__openWindow('terminal');

    } else if (actCode === 'open_calendar') {

      if (window.__openWindow) window.__openWindow('calendar');

    } else if (actCode === 'open_settings') {

      if (window.__openWindow) window.__openWindow('settings');

    } else if (actCode === 'open_contact') {

      if (window.__openWindow) window.__openWindow('contact');

    } else if (actCode === 'open_doom') {

      if (window.__openWindow) window.__openWindow('doom');

    } else if (actCode === 'open_minesweeper') {

      if (window.__openWindow) window.__openWindow('minesweeper');

    } else if (actCode === 'open_music') {

      if (window.__openWindow) window.__openWindow('music');

    } else if (actCode === 'query_bio') {

      sendQueryFn('Who is Vedant Kale?');

    } else if (actCode === 'query_skills') {

      sendQueryFn('What are your technical skills?');

    } else if (actCode === 'query_projects') {

      sendQueryFn('Tell me about your projects');

    } else if (actCode === 'query_experience') {

      sendQueryFn('Tell me about your work experience at Karst Technologies');

    } else if (actCode === 'query_education') {

      sendQueryFn('What is your education and CGPA?');

    } else if (actCode === 'query_contact') {

      sendQueryFn('How can I contact or hire you?');

    } else if (actCode === 'query_joke') {

      sendQueryFn('Tell me a joke');

    } else if (actCode === 'music_play') {
      MusicController.play(currentTrackIdx);
      SoundManager.playClick();
      const tr = MusicController.getCurrentTrack();
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(tr, true);
      }
    } else if (actCode === 'music_pause') {
      MusicController.pause();
      SoundManager.playClick();
      const tr = MusicController.getCurrentTrack();
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(tr, false);
      }
    } else if (actCode === 'music_toggle') {
      const isPlay = MusicController.togglePlay();
      SoundManager.playClick();
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(MusicController.getCurrentTrack(), isPlay);
      }
    } else if (actCode === 'music_next') {
      const tr = MusicController.next();
      SoundManager.playClick();
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(tr, true);
      }
    } else if (actCode === 'music_prev') {
      const tr = MusicController.prev();
      SoundManager.playClick();
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(tr, true);
      }
    } else if (actCode === 'music_play_random') {
      const total = MusicController.getTracks().length;
      const rnd = Math.floor(Math.random() * total);
      const tr = MusicController.playTrack(rnd);
      SoundManager.playClick();
      if (typeof updateAllClippyMusicCards === 'function') {
        updateAllClippyMusicCards(tr, true);
      }

    } else if (actCode === 'trigger_matrix') {

      triggerMatrixMode();

    } else if (actCode === 'clippy_dance') {

      sendQueryFn('Clippy dance');

    }

  }



  // --------------------------------------------------------------------------

  // Clippy Web Speech API Voice Narration

  // --------------------------------------------------------------------------

  function getClippyVoice() {

    if (!('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices();

    if (!voices || voices.length === 0) return null;



    // Prioritize cute, expressive female/girl voices over male/generic voices

    const cuteMatchRules = [

      // 1. Microsoft Ana (youthful / cute girl voice on Windows/Edge)

      v => v.lang.startsWith('en') && v.name.toLowerCase().includes('ana'),

      // 2. Microsoft Jenny (young, cheerful natural female voice)

      v => v.lang.startsWith('en') && v.name.toLowerCase().includes('jenny'),

      // 3. Microsoft Aria (friendly young female voice)

      v => v.lang.startsWith('en') && v.name.toLowerCase().includes('aria'),

      // 4. Microsoft Zira (standard Windows US English female voice)

      v => v.lang.startsWith('en') && v.name.toLowerCase().includes('zira'),

      // 5. Explicitly labeled female English voices

      v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'),

      // 6. Google US / UK English (Female by default on Chrome)

      v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google') && !v.name.toLowerCase().includes('male'),

      // 7. Samantha, Victoria, Karen, Tessa (Apple / WebKit female voices)

      v => v.lang.startsWith('en') && (v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria') || v.name.toLowerCase().includes('tessa')),

      // 8. Any English voice that is NOT explicitly male (exclude David, Mark, George, Richard, Guy, Male)

      v => v.lang.startsWith('en') && !['david', 'mark', 'george', 'richard', 'guy', 'male'].some(m => v.name.toLowerCase().includes(m))

    ];



    for (const rule of cuteMatchRules) {

      const match = voices.find(rule);

      if (match) return match;

    }



    return voices.find(v => v.lang.startsWith('en')) || voices[0];

  }



  window.stopClippySpeech = stopClippySpeech;
  function stopClippySpeech() {

    if ('speechSynthesis' in window) {

      window.speechSynthesis.cancel();

    }

    const avatar = document.getElementById('clippy-avatar-btn');

    const voiceBtn = document.getElementById('clippy-btn-voice');

    if (avatar) avatar.classList.remove('clippy-talking');

    if (voiceBtn) voiceBtn.classList.remove('voice-speaking');

  }



  function speakClippyText(text) {

    if (!state.clippyVoice || state.isMuted) return;

    if (!('speechSynthesis' in window)) return;

    // Stop speaking immediately if music is playing

    if (typeof MusicController !== 'undefined' && typeof MusicController.isPlaying === 'function' && MusicController.isPlaying()) return;

    if (window.__musicPlayer && window.__musicPlayer.isPlaying) return;



    try {

      window.speechSynthesis.cancel();



      // Clean HTML tags and markdown symbols for natural speech

      const clean = text

        .replace(/<[^>]+>/g, ' ')

        .replace(/&bull;|&mdash;|&ndash;/g, ', ')

        .replace(/[🎓💼🧠⚡🚀⭐💡🛠️🧩📬📄📎🎵🕶️✨🍸🎶]/g, '')

        .replace(/\s+/g, ' ')

        .trim();



      if (!clean) return;



      const utterance = new SpeechSynthesisUtterance(clean);

      const voice = getClippyVoice();

      if (voice) utterance.voice = voice;



      // Cute girl voice acoustic tuning: sweet elevated pitch & bright bouncy tempo

      utterance.rate = 1.12;  // Upbeat, cute pacing

      utterance.pitch = 1.52; // High, sweet cute girl pitch (scale 0 to 2)

      utterance.volume = Math.min(1, Math.max(0.2, state.volume * 1.5));



      const avatar = document.getElementById('clippy-avatar-btn');

      const voiceBtn = document.getElementById('clippy-btn-voice');



      utterance.onstart = () => {

        if (avatar) avatar.classList.add('clippy-talking');

        if (voiceBtn) voiceBtn.classList.add('voice-speaking');

      };



      utterance.onend = () => {

        if (avatar) avatar.classList.remove('clippy-talking');

        if (voiceBtn) voiceBtn.classList.remove('voice-speaking');

      };



      utterance.onerror = () => {

        if (avatar) avatar.classList.remove('clippy-talking');

        if (voiceBtn) voiceBtn.classList.remove('voice-speaking');

      };



      window.speechSynthesis.speak(utterance);

    } catch (err) {

      console.warn('Clippy speech synthesis error:', err);

    }

  }



  // Pre-load voices if asynchronous

  if ('speechSynthesis' in window) {

    window.speechSynthesis.onvoiceschanged = () => {

      getClippyVoice();

    };

  }



  function suppressFullscreenBubble() {
    try {
      document.querySelectorAll('.bubble, [data-v-063432f8].bubble').forEach(b => {
        b.style.display = 'none';
        b.style.visibility = 'hidden';
        b.style.pointerEvents = 'none';
      });
    } catch(e) {}
  }
  suppressFullscreenBubble();
  setInterval(suppressFullscreenBubble, 400);

  function initClippyAssistant() {

    // Suppress old static modal

    try {

      localStorage.setItem('clippyDismissed', 'true');

    } catch (e) { }



    const desktopBg = document.querySelector('.bg-office-pic');

    if (!desktopBg) return;



    let root = document.getElementById('xp-clippy-assistant-root');

    if (root) {

      if (!desktopBg.contains(root)) {

        desktopBg.appendChild(root);

      }

      return;

    }



    root = document.createElement('div');

    root.id = 'xp-clippy-assistant-root';



    root.innerHTML = `

      <!-- SPEECH BALLOON CHAT DIALOG -->

      <div class="clippy-balloon" id="clippy-balloon" style="display: none;">

        <!-- Header -->

        <div class="clippy-balloon-header">

          <div class="clippy-header-title">

            <span>📎</span>

            <span class="clippy-title-text">Clippy &mdash; AI Assistant</span>

            <span class="clippy-pulse-dot" title="Online"></span>

          </div>

          <div class="clippy-header-actions">

            <button class="clippy-header-btn" id="clippy-btn-voice" title="Toggle Voice Narration">🔊</button>

            <button class="clippy-header-btn" id="clippy-btn-clear" title="Clear chat history">↺</button>

            <button class="clippy-header-btn" id="clippy-btn-minimize" title="Minimize">─</button>

            <button class="clippy-header-btn close" id="clippy-btn-close" title="Close">✕</button>

          </div>

        </div>



        <!-- Suggestion Chips Bar -->

        <div class="clippy-chips-container" id="clippy-chips-bar">

          <button class="clippy-chip" data-q="Play music">🎵 Play Music</button>

          <button class="clippy-chip" data-q="Matrix mode">🕶️ Matrix Mode</button>

          <button class="clippy-chip" data-q="Who is Vedant?">💡 Who is Vedant?</button>

          <button class="clippy-chip" data-q="What are your core skills?">🛠️ Tech Skills</button>

          <button class="clippy-chip" data-q="Tell me about your GraphRAG project">🚀 GraphRAG</button>

          <button class="clippy-chip" data-q="Work experience at Karst Technologies">💼 Experience</button>

          <button class="clippy-chip" data-q="What is your education and CGPA?">🎓 Education</button>

          <button class="clippy-chip" data-q="Why should I hire Vedant?">⭐ Why Hire?</button>

          <button class="clippy-chip" data-q="LeetCode and problem solving">🧩 LeetCode</button>

          <button class="clippy-chip" data-q="How can I contact or hire you?">📬 Contact</button>

          <button class="clippy-chip" data-q="Open resume and CV">📄 Resume</button>

        </div>



        <!-- Messages Scroll Area -->

        <div class="clippy-messages-area" id="clippy-messages-container"></div>



        <!-- Typing Indicator -->

        <div id="clippy-typing-row" style="display:none; padding: 0 10px 6px 10px;">

          <div class="clippy-typing-bubble">

            <span>Clippy is thinking</span>

            <span class="clippy-dot"></span>

            <span class="clippy-dot"></span>

            <span class="clippy-dot"></span>

          </div>

        </div>



        <!-- Input Bar -->

        <div class="clippy-input-bar">

          <input type="text" id="clippy-chat-input" class="clippy-input-field" placeholder="Ask Clippy anything about Vedant..." autocomplete="off" />

          <button id="clippy-btn-send" class="clippy-send-btn" title="Send message">Send ➤</button>

        </div>

      </div>



      <!-- CLIPPY CHARACTER AVATAR -->

      <div class="clippy-avatar-container" id="clippy-avatar-btn" title="Click to chat with Clippy (Vedant's AI Assistant)">

        <div class="clippy-music-floating-note" id="clippy-music-note" style="display:none;" title="Music Playing!">🎵</div>

        <button class="clippy-avatar-close" id="clippy-avatar-close-btn" title="Dismiss Clippy">✕</button>

        <div class="clippy-tag-badge" id="clippy-floating-badge">

          <span class="clippy-pulse-dot"></span>

          <span>Ask me about Vedant!</span>

        </div>

        <img src="/videos/clippy.gif" alt="Clippy AI Assistant" class="clippy-img" />

      </div>

    `;



    desktopBg.appendChild(root);



    // Elements

    const balloon = document.getElementById('clippy-balloon');

    const avatarBtn = document.getElementById('clippy-avatar-btn');

    const badge = document.getElementById('clippy-floating-badge');

    const messagesBox = document.getElementById('clippy-messages-container');

    const inputField = document.getElementById('clippy-chat-input');

    const sendBtn = document.getElementById('clippy-btn-send');

    const minBtn = document.getElementById('clippy-btn-minimize');

    const voiceBtn = document.getElementById('clippy-btn-voice');



    if (voiceBtn) {

      voiceBtn.textContent = state.clippyVoice ? '🔊' : '🔇';

      voiceBtn.title = state.clippyVoice ? 'Mute Voice Narration' : 'Enable Voice Narration';

      voiceBtn.addEventListener('click', (e) => {

        e.stopPropagation();

        state.clippyVoice = !state.clippyVoice;

        saveState();

        voiceBtn.textContent = state.clippyVoice ? '🔊' : '🔇';

        voiceBtn.title = state.clippyVoice ? 'Mute Voice Narration' : 'Enable Voice Narration';

        SoundManager.playClick();

        if (!state.clippyVoice) {

          stopClippySpeech();

        } else {

          speakClippyText("Voice narration enabled!");

        }

      });

    }



    const closeBtn = document.getElementById('clippy-btn-close');

    const clearBtn = document.getElementById('clippy-btn-clear');

    const chipsBar = document.getElementById('clippy-chips-bar');

    const typingRow = document.getElementById('clippy-typing-row');



    // Initial render of chat messages

    renderClippyMessages(messagesBox);



    function openClippyBalloon() {
      root.classList.add('balloon-open');
      balloon.style.display = 'flex';
      badge.style.display = 'none';

      // Ensure root remains cleanly positioned on screen and never pushes off-screen
      if (!hasDraggedClippy) {
        root.style.left = '';
        root.style.top = '';
        root.style.right = '24px';
        root.style.bottom = '42px';
      } else {
        const rect = root.getBoundingClientRect();
        if (rect.right > window.innerWidth - 10) {
          root.style.left = Math.max(10, window.innerWidth - rect.width - 20) + 'px';
        }
      }

      renderClippyMessages(messagesBox);
      SoundManager.playClippyChime();
      if (inputField) {
        setTimeout(() => inputField.focus(), 150);
      }
    }



    function closeClippyBalloon() {
      root.classList.remove('balloon-open');
      balloon.style.display = 'none';
      badge.style.display = '';
      if (!hasDraggedClippy) {
        root.style.left = '';
        root.style.top = '';
        root.style.right = '24px';
        root.style.bottom = '42px';
      }
      stopClippySpeech();
      SoundManager.playClick();
    }



    function sendQuery(text) {

      const q = text.trim();

      if (!q) return;



      SoundManager.playClick();



      // Add user message

      const now = new Date();

      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      clippyChatHistory.push({

        sender: 'user',

        time: timeStr,

        summary: escapeHtml(q)

      });

      renderClippyMessages(messagesBox);



      if (inputField) inputField.value = '';



      // Show typing indicator

      if (typingRow) typingRow.style.display = 'block';

      messagesBox.scrollTop = messagesBox.scrollHeight;



      // Simulate AI response stream / thinking delay

      setTimeout(() => {

        if (typingRow) typingRow.style.display = 'none';

        const responseData = matchClippyQuery(q);



        clippyChatHistory.push({

          sender: 'bot',

          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

          title: responseData.title || '',

          summary: responseData.summary || '',

          bullets: responseData.bullets || [],

          actions: responseData.actions || []

        });



        renderClippyMessages(messagesBox);

        SoundManager.playClippyChime();

        const speechText = (responseData.title ? responseData.title + '. ' : '') + (responseData.summary || '');

        speakClippyText(speechText);

      }, 420);

    }



    let isDraggingClippy = false;
    let hasDraggedClippy = false;
    let clippyStartX = 0, clippyStartY = 0;
    let clippyInitLeft = 0, clippyInitTop = 0;

    // Bind event listeners

    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hasDraggedClippy) {
        hasDraggedClippy = false;
        return;
      }
      if (balloon.style.display === 'none') {
        SoundManager.playDing();
        openClippyBalloon();
      } else {
        closeClippyBalloon();
      }
    });



    minBtn.addEventListener('click', (e) => {

      e.stopPropagation();

      closeClippyBalloon();

    });



    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeClippyBalloon();
      SoundManager.playClick();
    });



    clearBtn.addEventListener('click', (e) => {

      e.stopPropagation();

      SoundManager.playClick();

      clippyChatHistory = [

        {

          sender: 'bot',

          time: 'Just now',

          title: "Hi there! 👋",

          summary: "Conversation cleared! Ask me anything about Vedant's projects, skills, or experience.",

          actions: [

            { label: "💡 Who is Vedant?", action: "query_bio" },

            { label: "🛠️ Tech Skills", action: "query_skills" },

            { label: "🚀 GraphRAG Projects", action: "query_projects" }

          ]

        }

      ];

      renderClippyMessages(messagesBox);

    });



    sendBtn.addEventListener('click', () => {

      sendQuery(inputField.value);

    });



    inputField.addEventListener('keydown', (e) => {

      if (e.key === 'Enter') {

        e.preventDefault();

        sendQuery(inputField.value);

      }

    });



    // Chips click

    

    // Avatar dismiss button

    const avatarCloseBtn = document.getElementById('clippy-avatar-close-btn');

    if (avatarCloseBtn) {

      avatarCloseBtn.addEventListener('click', (e) => {

        e.stopPropagation();

        root.style.display = 'none';

        SoundManager.playClick();

      });

    }



    // Allow user to re-summon Clippy globally
    window.openClippyAssistant = function() {
      root.style.display = 'flex';
      root.classList.add('balloon-open');
      openClippyBalloon();
      SoundManager.playClippyChime();
    };

    window.askClippy = function(q) {
      window.openClippyAssistant();
      if (q) sendQuery(q);
    };

    window.matchClippyQuery = matchClippyQuery;
    window.triggerClippySpeech = function(text) {
      speakClippyText(text);
    };



    avatarBtn.addEventListener('mousedown', (e) => {
      if (e.target.closest('#clippy-avatar-close-btn')) return;
      isDraggingClippy = true;
      hasDraggedClippy = false;
      clippyStartX = e.clientX;
      clippyStartY = e.clientY;
      const rect = root.getBoundingClientRect();
      clippyInitLeft = rect.left;
      clippyInitTop = rect.top;
      // Do NOT set root.style.left/right here! Only set during actual mouse dragging!
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDraggingClippy) return;
      const dx = e.clientX - clippyStartX;
      const dy = e.clientY - clippyStartY;
      if (!hasDraggedClippy) {
        if (Math.hypot(dx, dy) > 5) {
          hasDraggedClippy = true;
          root.style.bottom = 'auto';
          root.style.right = 'auto';
          root.style.left = clippyInitLeft + 'px';
          root.style.top = clippyInitTop + 'px';
        } else {
          return;
        }
      }
      const rootW = root.offsetWidth || 80;
      const rootH = root.offsetHeight || 80;
      root.style.left = Math.max(10, Math.min(window.innerWidth - rootW - 10, clippyInitLeft + dx)) + 'px';
      root.style.top = Math.max(10, Math.min(window.innerHeight - rootH - 40, clippyInitTop + dy)) + 'px';
    });

    document.addEventListener('mouseup', () => {
      isDraggingClippy = false;
    });



    chipsBar.addEventListener('click', (e) => {

      const chip = e.target.closest('.clippy-chip');

      if (chip && chip.dataset.q) {

        sendQuery(chip.dataset.q);

      }

    });



    // Action buttons click inside messages

    messagesBox.addEventListener('click', (e) => {

      const actBtn = e.target.closest('.clippy-action-btn[data-act]');

      if (actBtn) {

        e.preventDefault();

        SoundManager.playClick();

        handleClippyAction(actBtn.dataset.act, inputField, sendQuery);

      }

    });



    // Clippy only opens when explicitly requested

  }







  // --------------------------------------------------------------------------

  // Initialization on DOM Ready

  // --------------------------------------------------------------------------



  // ==========================================================================

  // RETRO APPS: MS PAINT, RECYCLE BIN, 3D PINBALL, STICKY NOTES

  // ==========================================================================



  // 1. MS PAINT HTML & LOGIC

  function createPaintHTML() {

    return `

      <div class="paint-app-container">

        <div class="retro-xp-menubar">

          <span id="paint-menu-clear">Clear Image</span>

          <span id="paint-menu-undo">Undo</span>

          <span id="paint-menu-pin">📌 Pin to Desktop</span>

          <span id="paint-menu-save" style="font-weight:bold; color:#0c327d;">💾 Save PNG</span>

        </div>

        <div class="paint-workspace">

          <div class="paint-toolbar">

            <button class="paint-tool-btn active" data-tool="pencil" title="Pencil">✏️</button>

            <button class="paint-tool-btn" data-tool="brush" title="Brush">🖌️</button>

            <button class="paint-tool-btn" data-tool="eraser" title="Eraser">🧼</button>

            <button class="paint-tool-btn" data-tool="bucket" title="Fill Bucket">🪣</button>

            <button class="paint-tool-btn" data-tool="line" title="Line">📏</button>

            <button class="paint-tool-btn" data-tool="rect" title="Rectangle">⬜</button>

            <button class="paint-tool-btn" data-tool="circle" title="Circle">⭕</button>



            <div class="paint-size-box">

              <div class="paint-size-opt active" data-size="1" title="1px"><div class="line-preview" style="height:1px;"></div></div>

              <div class="paint-size-opt" data-size="3" title="3px"><div class="line-preview" style="height:3px;"></div></div>

              <div class="paint-size-opt" data-size="6" title="6px"><div class="line-preview" style="height:6px;"></div></div>

              <div class="paint-size-opt" data-size="12" title="12px"><div class="line-preview" style="height:10px;"></div></div>

            </div>

          </div>



          <div class="paint-canvas-wrapper">

            <canvas id="paint-canvas" width="640" height="400"></canvas>

          </div>

        </div>



        <div class="paint-bottom-palette">

          <div class="paint-current-colors" title="Primary & Secondary Colors">

            <div class="paint-col-pri" id="paint-pri-color" style="background:#000000;"></div>

            <div class="paint-col-sec" id="paint-sec-color" style="background:#ffffff;"></div>

          </div>

          <div class="paint-swatches-grid" id="paint-swatches"></div>

          <div class="paint-actions-bar">

            <button class="paint-action-btn" id="paint-btn-undo">↩️ Undo</button>

            <button class="paint-action-btn" id="paint-btn-clear">🗑️ Clear</button>

            <button class="paint-action-btn" id="paint-btn-pin">📌 Pin to Desktop</button>

            <button class="paint-action-btn" id="paint-btn-save" style="font-weight:bold; color:#0c327d;">💾 Save PNG</button>

          </div>

        </div>



        <div class="retro-xp-statusbar">

          <span id="paint-status-tool">For Help, click Help Topics on the Help Menu.</span>

          <span id="paint-status-pos">0, 0px</span>

          <span>640 x 400px</span>

        </div>

      </div>

    `;

  }



  function bindPaintEvents(container) {

    const canvas = container.querySelector('#paint-canvas');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');



    // Fill initial white background

    ctx.fillStyle = '#ffffff';

    ctx.fillRect(0, 0, canvas.width, canvas.height);



    let activeTool = 'pencil';

    let strokeSize = 1;

    let primaryColor = '#000000';

    let secondaryColor = '#ffffff';

    let isDrawing = false;

    let startX = 0, startY = 0;

    let snapshot = null;

    const historyStack = [];



    function saveState() {

      if (historyStack.length >= 15) historyStack.shift();

      historyStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    }

    saveState();



    function undo() {

      if (historyStack.length > 1) {

        historyStack.pop();

        const prev = historyStack[historyStack.length - 1];

        ctx.putImageData(prev, 0, 0);

        SoundManager.playClick();

      }

    }



    // Palette Swatches

    const colors = [

      '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',

      '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'

    ];

    const swatchesContainer = container.querySelector('#paint-swatches');

    const priBox = container.querySelector('#paint-pri-color');

    const secBox = container.querySelector('#paint-sec-color');



    colors.forEach(col => {

      const sw = document.createElement('div');

      sw.className = 'paint-swatch';

      sw.style.backgroundColor = col;

      sw.addEventListener('click', () => {

        primaryColor = col;

        priBox.style.backgroundColor = col;

        SoundManager.playClick();

      });

      sw.addEventListener('contextmenu', (e) => {

        e.preventDefault();

        secondaryColor = col;

        secBox.style.backgroundColor = col;

        SoundManager.playClick();

      });

      swatchesContainer.appendChild(sw);

    });



    // Tool buttons

    const toolBtns = container.querySelectorAll('.paint-tool-btn');

    toolBtns.forEach(btn => {

      btn.addEventListener('click', () => {

        toolBtns.forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        activeTool = btn.dataset.tool;

        SoundManager.playClick();

        container.querySelector('#paint-status-tool').textContent = 'Tool: ' + activeTool.toUpperCase();

      });

    });



    // Size options

    const sizeOpts = container.querySelectorAll('.paint-size-opt');

    sizeOpts.forEach(opt => {

      opt.addEventListener('click', () => {

        sizeOpts.forEach(o => o.classList.remove('active'));

        opt.classList.add('active');

        strokeSize = parseInt(opt.dataset.size, 10);

        SoundManager.playClick();

      });

    });



    function getCoords(e) {

      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;

      const scaleY = canvas.height / rect.height;

      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);

      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);

      return {

        x: Math.floor((clientX - rect.left) * scaleX),

        y: Math.floor((clientY - rect.top) * scaleY)

      };

    }



    // Flood fill algorithm

    function floodFill(startCol, startRow, fillColorHex) {

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const data = imgData.data;

      const width = canvas.width;

      const height = canvas.height;



      const startIndex = (startRow * width + startCol) * 4;

      const targetR = data[startIndex];

      const targetG = data[startIndex + 1];

      const targetB = data[startIndex + 2];

      const targetA = data[startIndex + 3];



      const tc = document.createElement('div');

      tc.style.color = fillColorHex;

      document.body.appendChild(tc);

      const rgb = getComputedStyle(tc).color.match(/\d+/g).map(Number);

      tc.remove();

      const fillR = rgb[0], fillG = rgb[1], fillB = rgb[2], fillA = 255;



      if (targetR === fillR && targetG === fillG && targetB === fillB) return;



      const stack = [[startCol, startRow]];

      while (stack.length) {

        const [x, y] = stack.pop();

        if (x < 0 || x >= width || y < 0 || y >= height) continue;

        const idx = (y * width + x) * 4;

        if (data[idx] === targetR && data[idx + 1] === targetG && data[idx + 2] === targetB && data[idx + 3] === targetA) {

          data[idx] = fillR;

          data[idx + 1] = fillG;

          data[idx + 2] = fillB;

          data[idx + 3] = fillA;



          stack.push([x + 1, y]);

          stack.push([x - 1, y]);

          stack.push([x, y + 1]);

          stack.push([x, y - 1]);

        }

      }

      ctx.putImageData(imgData, 0, 0);

    }



    // Canvas pointer events

    canvas.addEventListener('pointerdown', (e) => {

      const pt = getCoords(e);

      startX = pt.x;

      startY = pt.y;

      isDrawing = true;



      if (activeTool === 'bucket') {

        saveState();

        floodFill(pt.x, pt.y, primaryColor);

        saveState();

        isDrawing = false;

        return;

      }



      snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = strokeSize;

      ctx.lineCap = 'round';

      ctx.lineJoin = 'round';



      if (activeTool === 'eraser') {

        ctx.strokeStyle = secondaryColor;

        ctx.fillStyle = secondaryColor;

      } else {

        ctx.strokeStyle = primaryColor;

        ctx.fillStyle = primaryColor;

      }



      ctx.beginPath();

      ctx.moveTo(startX, startY);

      if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {

        ctx.lineTo(startX, startY);

        ctx.stroke();

      }

    });



    window.addEventListener('pointermove', (e) => {

      const posEl = container.querySelector('#paint-status-pos');

      if (canvas.contains(e.target)) {

        const pt = getCoords(e);

        if (posEl) posEl.textContent = `${pt.x}, ${pt.y}px`;

      }

      if (!isDrawing) return;



      const pt = getCoords(e);

      if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {

        ctx.lineTo(pt.x, pt.y);

        ctx.stroke();

      } else if (snapshot) {

        ctx.putImageData(snapshot, 0, 0);

        ctx.beginPath();

        if (activeTool === 'line') {

          ctx.moveTo(startX, startY);

          ctx.lineTo(pt.x, pt.y);

          ctx.stroke();

        } else if (activeTool === 'rect') {

          ctx.strokeRect(startX, startY, pt.x - startX, pt.y - startY);

        } else if (activeTool === 'circle') {

          const rx = Math.abs(pt.x - startX) / 2;

          const ry = Math.abs(pt.y - startY) / 2;

          const cx = Math.min(startX, pt.x) + rx;

          const cy = Math.min(startY, pt.y) + ry;

          ctx.beginPath();

          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);

          ctx.stroke();

        }

      }

    });



    window.addEventListener('pointerup', () => {

      if (isDrawing) {

        isDrawing = false;

        saveState();

      }

    });



    const btnUndo = container.querySelector('#paint-btn-undo');

    const menuUndo = container.querySelector('#paint-menu-undo');

    if (btnUndo) btnUndo.addEventListener('click', undo);

    if (menuUndo) menuUndo.addEventListener('click', undo);



    const btnClear = container.querySelector('#paint-btn-clear');

    const menuClear = container.querySelector('#paint-menu-clear');

    function clearCanvas() {

      ctx.fillStyle = '#ffffff';

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      saveState();

      SoundManager.playClick();

    }

    if (btnClear) btnClear.addEventListener('click', clearCanvas);

    if (menuClear) menuClear.addEventListener('click', clearCanvas);



    const btnSave = container.querySelector('#paint-btn-save');

    const menuSave = container.querySelector('#paint-menu-save');

    function savePNG() {

      const link = document.createElement('a');

      link.download = 'vedant_paint_art.png';

      link.href = canvas.toDataURL('image/png');

      link.click();

      SoundManager.playDing();

    }

    if (btnSave) btnSave.addEventListener('click', savePNG);

    if (menuSave) menuSave.addEventListener('click', savePNG);



    // Pin to Desktop

    const btnPin = container.querySelector('#paint-btn-pin');

    const menuPin = container.querySelector('#paint-menu-pin');

    function pinToDesktop() {

      const desktopBg = document.querySelector('.bg-office-pic') || document.body;

      const doodle = document.createElement('div');

      doodle.className = 'desktop-pinned-doodle';

      const img = document.createElement('img');

      img.src = canvas.toDataURL('image/png');

      doodle.appendChild(img);



      const btnClose = document.createElement('button');

      btnClose.className = 'doodle-close';

      btnClose.innerHTML = '✕';

      btnClose.title = 'Remove pin';

      btnClose.addEventListener('click', () => {

        doodle.remove();

        SoundManager.playClick();

      });

      doodle.appendChild(btnClose);



      const rot = (Math.random() * 8 - 4).toFixed(1);

      doodle.style.transform = `rotate(${rot}deg)`;

      doodle.style.left = (Math.random() * 200 + 120) + 'px';

      doodle.style.top = (Math.random() * 160 + 120) + 'px';



      // Drag doodle

      let dX = 0, dY = 0, initL = 0, initT = 0, isD = false;

      doodle.addEventListener('pointerdown', (e) => {

        if (e.target.closest('.doodle-close')) return;

        isD = true;

        dX = e.clientX;

        dY = e.clientY;

        const r = doodle.getBoundingClientRect();

        initL = r.left;

        initT = r.top;

        const onMove = (ev) => {

          if (!isD) return;

          doodle.style.left = (initL + ev.clientX - dX) + 'px';

          doodle.style.top = (initT + ev.clientY - dY) + 'px';

        };

        const onUp = () => {

          isD = false;

          window.removeEventListener('pointermove', onMove);

          window.removeEventListener('pointerup', onUp);

        };

        window.addEventListener('pointermove', onMove);

        window.addEventListener('pointerup', onUp);

      });



      desktopBg.appendChild(doodle);

      SoundManager.playDing();

      container.querySelector('#paint-status-tool').textContent = '✨ Drawing pinned to desktop wallpaper!';

    }

    if (btnPin) btnPin.addEventListener('click', pinToDesktop);

    if (menuPin) menuPin.addEventListener('click', pinToDesktop);

  }



  // 2. RECYCLE BIN HTML & LOGIC
  let recycleBinItems = [];

  function syncRecycleBinFromStorage() {
    recycleBinItems = getDeletedApps();
    return recycleBinItems;
  }

  function createRecycleBinHTML() {
    syncRecycleBinFromStorage();
    const count = recycleBinItems.length;
    const isFull = count > 0;
    return `
      <div style="display:flex; flex-direction:column; width:100%; height:100%; background:#ece9d8;">
        <div class="retro-xp-menubar">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Favorites</span>
          <span>Tools</span>
          <span>Help</span>
        </div>
        <div class="retro-xp-addressbar">
          <span style="color:#555;">Address</span>
          <div class="retro-xp-address-input">
            <img src="${isFull ? '/img/icons/recycle-bin-full.svg' : '/img/icons/recycle-bin-empty.svg'}" style="width:14px; height:14px; margin-right:4px;" id="recycle-addr-icon" />
            <span>Recycle Bin</span>
          </div>
          <button style="background:#ece9d8; border:1px solid #7f9db9; padding:2px 6px; font-size:11px; cursor:pointer;">Go</button>
        </div>

        <div class="recycle-bin-layout">
          <div class="recycle-sidebar">
            <div class="recycle-box">
              <div class="recycle-box-header">Recycle Bin Tasks</div>
              <div class="recycle-box-body">
                <div class="recycle-task-link" id="recycle-btn-empty" style="cursor:pointer;">
                  <span>🗑️</span>
                  <b>Empty the Recycle Bin</b>
                </div>
                <div class="recycle-task-link" id="recycle-btn-restore" style="cursor:pointer;">
                  <span>🔄</span>
                  <span>Restore all items</span>
                </div>
              </div>
            </div>

            <div class="recycle-box">
              <div class="recycle-box-header">Other Places</div>
              <div class="recycle-box-body">
                <div class="recycle-task-link" onclick="if(window.__openWindow)window.__openWindow('myProjects')">
                  <span>📂</span>
                  <span>My Projects</span>
                </div>
                <div class="recycle-task-link" onclick="if(window.__openWindow)window.__openWindow('terminal')">
                  <span>💻</span>
                  <span>My Terminal</span>
                </div>
                <div class="recycle-task-link" onclick="if(window.__openWindow)window.__openWindow('myCV')">
                  <span>📄</span>
                  <span>My CV / Resume</span>
                </div>
              </div>
            </div>

            <div class="recycle-box">
              <div class="recycle-box-header">Details</div>
              <div class="recycle-box-body" id="recycle-details-box">
                <b>Recycle Bin</b><br>
                System Folder<br>
                Items: <span id="recycle-items-count">${count}</span>
              </div>
            </div>
          </div>

          <div class="recycle-content-area" id="recycle-table-wrapper">
            <!-- Table dynamically injected -->
          </div>
        </div>

        <div class="retro-xp-statusbar">
          <span id="recycle-status-text">${count} object(s)</span>
          <span>My Computer</span>
        </div>
      </div>
    `;
  }

  function showRecycleRowContextMenu(e, item) {
    e.preventDefault();
    e.stopPropagation();
    closeAllContextMenus();

    let rowMenu = document.getElementById('xp-recycle-row-menu');
    if (!rowMenu) {
      rowMenu = document.createElement('div');
      rowMenu.id = 'xp-recycle-row-menu';
      rowMenu.className = 'xp-context-menu';
      document.body.appendChild(rowMenu);
    }

    rowMenu.innerHTML = `
      <div class="xp-menu-item" data-action="restore">
        <span class="xp-menu-icon">🔄</span>
        <span class="xp-menu-text"><strong>Restore</strong></span>
      </div>
      <div class="xp-menu-item disabled" style="opacity:0.5; cursor:default;" data-action="cut">
        <span class="xp-menu-icon">✂️</span>
        <span class="xp-menu-text">Cut</span>
      </div>
      <div class="xp-menu-item" data-action="delete">
        <span class="xp-menu-icon">🗑️</span>
        <span class="xp-menu-text">Delete</span>
      </div>
      <div class="xp-menu-separator"></div>
      <div class="xp-menu-item" data-action="properties">
        <span class="xp-menu-icon">⚙️</span>
        <span class="xp-menu-text"><strong>Properties</strong></span>
      </div>
    `;

    rowMenu.onclick = (ev) => {
      const menuItem = ev.target.closest('.xp-menu-item');
      if (!menuItem || menuItem.classList.contains('disabled')) return;
      const action = menuItem.dataset.action;
      closeAllContextMenus();
      if (action === 'restore') {
        restoreSpecificApp(item.appId);
      } else if (action === 'delete') {
        permanentlyDeleteItem(item.id || item.appId);
      } else if (action === 'properties') {
        showAppPropertiesModal({
          name: item.displayName || item.name,
          icon: item.iconSrc || '/img/icons/recycle-bin-empty.svg',
          type: item.type || 'Shortcut',
          size: item.size || '2 KB',
          date: item.date || ''
        });
      }
    };

    rowMenu.style.display = 'block';
    positionMenu(rowMenu, e.clientX, e.clientY);
    SoundManager.playClick();
  }

  function bindRecycleBinEvents(container) {
    window.__refreshRecycleBinTable = renderTable;

    function renderTable() {
      syncRecycleBinFromStorage();
      const wrapper = container.querySelector('#recycle-table-wrapper');
      const countEl = container.querySelector('#recycle-items-count');
      const statusEl = container.querySelector('#recycle-status-text');
      const addrIcon = container.querySelector('#recycle-addr-icon');
      const detailsBox = container.querySelector('#recycle-details-box');

      const count = recycleBinItems.length;
      if (countEl) countEl.textContent = count;
      if (statusEl) statusEl.textContent = count + ' object(s)';
      if (addrIcon) addrIcon.src = count > 0 ? '/img/icons/recycle-bin-full.svg' : '/img/icons/recycle-bin-empty.svg';
      if (detailsBox) {
        detailsBox.innerHTML = `
          <b>Recycle Bin</b><br>
          System Folder<br>
          Items: <span id="recycle-items-count">${count}</span>
        `;
      }

      if (!wrapper) return;

      if (count === 0) {
        wrapper.innerHTML = `
          <div class="recycle-empty-view" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:220px; color:#555; text-align:center; padding:20px;">
            <img src="/img/icons/recycle-bin-empty.svg" style="width:64px; height:64px; margin-bottom:12px;" />
            <b style="font-size:12px; color:#222; margin-bottom:4px;">The Recycle Bin is empty.</b>
            <span style="font-size:11px; color:#666;">Items deleted from your desktop will appear here.</span>
          </div>
        `;
        return;
      }

      let rowsHtml = '';
      recycleBinItems.forEach(item => {
        const iconHtml = item.iconSrc
          ? `<img src="${item.iconSrc}" style="width:16px; height:16px; margin-right:6px; vertical-align:middle; display:inline-block;" />`
          : `<span style="margin-right:6px;">📄</span>`;
        const displayName = item.displayName || item.name;
        const loc = item.location || 'C:\\Documents and Settings\\Vedant\\Desktop';
        const date = item.date || '';
        const size = item.size || '2 KB';
        const type = item.type || 'Shortcut';

        rowsHtml += `
          <tr data-id="${item.id}" data-app-id="${item.appId}">
            <td>${iconHtml}<b>${escapeHtml(displayName)}</b></td>
            <td style="color:#666;">${escapeHtml(loc)}</td>
            <td>${escapeHtml(date)}</td>
            <td>${escapeHtml(size)}</td>
            <td style="color:#555;">${escapeHtml(type)}</td>
          </tr>
        `;
      });

      wrapper.innerHTML = `
        <table class="recycle-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Original Location</th>
              <th>Date Deleted</th>
              <th>Size</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;

      const rows = wrapper.querySelectorAll('tbody tr');
      rows.forEach(tr => {
        const id = tr.dataset.id;
        const appId = tr.dataset.appId;
        const item = recycleBinItems.find(i => String(i.id) === String(id) || String(i.appId) === String(appId));

        tr.addEventListener('click', (ev) => {
          ev.stopPropagation();
          rows.forEach(r => r.classList.remove('selected'));
          tr.classList.add('selected');
          SoundManager.playClick();
          if (detailsBox && item) {
            detailsBox.innerHTML = `
              <b>${escapeHtml(item.displayName || item.name)}</b><br>
              ${escapeHtml(item.type || 'Shortcut')}<br>
              Size: ${escapeHtml(item.size || '2 KB')}<br>
              Deleted: ${escapeHtml(item.date || '')}
            `;
          }
        });

        tr.addEventListener('dblclick', (ev) => {
          ev.stopPropagation();
          if (item) {
            const name = item.displayName || item.name;
            if (confirm("Do you want to restore '" + name + "' to the Desktop?")) {
              restoreSpecificApp(item.appId);
            }
          }
        });

        tr.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          rows.forEach(r => r.classList.remove('selected'));
          tr.classList.add('selected');
          if (item) {
            showRecycleRowContextMenu(e, item);
          }
        });
      });

      wrapper.onclick = (e) => {
        if (!e.target.closest('tbody tr')) {
          rows.forEach(r => r.classList.remove('selected'));
          if (detailsBox) {
            detailsBox.innerHTML = `
              <b>Recycle Bin</b><br>
              System Folder<br>
              Items: <span id="recycle-items-count">${recycleBinItems.length}</span>
            `;
          }
        }
      };
    }

    renderTable();

    const btnEmpty = container.querySelector('#recycle-btn-empty');
    if (btnEmpty) {
      btnEmpty.addEventListener('click', () => {
        emptyTheRecycleBin();
      });
    }

    const btnRestore = container.querySelector('#recycle-btn-restore');
    if (btnRestore) {
      btnRestore.addEventListener('click', () => {
        restoreAllRecycleBinItems();
      });
    }
  }

  // 3. 3D PINBALL HTML & LOGIC

  function createPinballHTML() {

    return `

      <div style="display:flex; flex-direction:column; width:100%; height:100%; background:#000000;">

        <div class="retro-xp-menubar" style="background:#ece9d8;">

          <span id="pinball-menu-new">Game (F2 - New Game)</span>

          <span id="pinball-menu-reload">Restart</span>

          <span id="pinball-menu-help">Controls</span>

        </div>

        <div style="flex:1; width:100%; height:100%; overflow:hidden; position:relative; background:#000;">

          <iframe id="pinball-iframe" src="https://alula.github.io/SpaceCadetPinball/" style="width:100%; height:100%; border:none;" allow="autoplay" tabindex="0"></iframe>

        </div>

        <div class="retro-xp-statusbar" style="background:#ece9d8; font-size:11px;">

          <span>🚀 <b>Space</b>: Plunge | <b>Z</b>: Left Flipper | <b>/</b>: Right Flipper | <b>X / .</b>: Nudge</span>

          <span>Space Cadet Table</span>

        </div>

      </div>

    `;

  }



  function bindPinballEvents(container) {

    const btnNew = container.querySelector('#pinball-menu-new');

    const btnReload = container.querySelector('#pinball-menu-reload');

    const btnHelp = container.querySelector('#pinball-menu-help');

    const iframe = container.querySelector('#pinball-iframe');



    function reloadGame() {

      if (iframe) iframe.src = iframe.src;

      SoundManager.playDing();

    }



    if (btnNew) btnNew.addEventListener('click', reloadGame);

    if (btnReload) btnReload.addEventListener('click', reloadGame);

    if (btnHelp) btnHelp.addEventListener('click', () => {

      alert("SPACE CADET PINBALL CONTROLS:\n\n- [Space]: Launch Ball / Plunger\n- [Z] or [Left Shift]: Left Flipper\n- [/] or [Right Shift]: Right Flipper\n- [X] / [.]: Table Nudge\n- [F2]: New Game");

    });

  }



  // 4. STICKY NOTES APP WINDOW HTML & LOGIC
  function createStickyNotesAppHTML() {
    const defaultContent = `<b>📌 VEDANT KALE — SDE &amp; SYSTEMS ENGINEER</b><br><br>
🎓 <b>Final-Year B.Tech Computer Science</b><br>
🏛️ Pimpri Chinchwad University (PCU), Pune | CGPA: <b>7.69/10</b><br><br>
<b>⚙️ Systems &amp; Core Architecture:</b><br>
• <b>Neuro-Adaptive GraphRAG</b>: Hybrid Neo4j + Pinecone + Cohere reranking pipeline with RAGAS evaluation gates (534 passing tests, 2.5s p95 latency threshold).<br>
• <b>ArthaSEC Engine</b>: Financial retrieval &amp; verification across 352 SEC filings (32K chunks), BGE cross-encoder (17ms p50 latency).<br>
• <b>Two-Tier Malware Detection</b>: Random forest + evidential deep learning sandbox (99.30% accuracy, 0.003ms CPU inference).<br>
• <b>SDE Intern</b> @ Karst Technologies (Jul 2026 – Sep 2026).<br><br>
<b>💻 Coding &amp; Credentials:</b><br>
• <b>CodeChef</b>: 1824 Rating (3-Star) | <b>LeetCode</b>: 1480 Rating (150+ solved)<br>
• Amazon / Coursera DSA Specialization | Udemy Full-Stack Web Dev<br><br>
📧 <a href="mailto:kalevedant750@gmail.com" style="color:#0046dd; font-weight:bold; text-decoration:underline;">kalevedant750@gmail.com</a> | 📍 Pune, India`;
    let savedContent = localStorage.getItem('xp_sticky_notes');
    if (!savedContent || savedContent.includes('dY') || savedContent.includes('DESKTOP MEMO') || savedContent.includes('WELCOME TO VEDANT') || savedContent.includes('?')) {
      savedContent = defaultContent;
      try { localStorage.setItem('xp_sticky_notes', defaultContent); } catch(e) {}
    }

    return `
      <div style="display:flex; flex-direction:column; width:100%; height:100%; background:#fef08a; padding:12px; font-family:'Comic Sans MS', 'Segoe Print', cursive, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eab308; padding-bottom:6px; margin-bottom:8px; font-family:Tahoma; font-size:11px; font-weight:bold; color:#713f12;">
          <span>📌 Sticky Notes</span>
          <button id="sticky-win-clear" style="background:#fef9c3; border:1px solid #ca8a04; border-radius:3px; padding:2px 8px; cursor:pointer; font-size:10px;">Clear Note</button>
        </div>
        <div id="sticky-win-body" contenteditable="true" spellcheck="false" style="flex:1; outline:none; font-size:13px; line-height:1.5; color:#1e293b; overflow-y:auto;">
          ${savedContent || defaultContent}
        </div>
      </div>
    `;
  }



  function bindStickyNotesEvents(container) {

    const bodyEl = container.querySelector('#sticky-win-body');

    if (bodyEl) {

      bodyEl.addEventListener('input', () => {

        localStorage.setItem('xp_sticky_notes', bodyEl.innerHTML);

      });

    }

    const btnClear = container.querySelector('#sticky-win-clear');

    if (btnClear) {

      btnClear.addEventListener('click', () => {

        if (confirm('Reset note to default welcome message?')) {

          localStorage.removeItem('xp_sticky_notes');

          bodyEl.innerHTML = '<b>Type your notes here...</b>';

          SoundManager.playClick();

        }

      });

    }

  }





  // --------------------------------------------------------------------------

  // 5. WINDOWS XP CALENDAR & SCHEDULE ORGANIZER APP

  // --------------------------------------------------------------------------

  const DEFAULT_CALENDAR_EVENTS = [

    // October 2026 (Current Demo Month)

    {

      id: 'evt-1',

      title: '📄 System Architecture & Resume v2.0',

      date: '2026-10-01',

      time: '10:00 AM',

      category: 'career',

      badge: 'Career',

      color: '#0058ee',

      location: 'Remote / GitHub',

      description: 'Finalized modern Windows XP portfolio design system, interactive resume, and terminal diagnostics.'

    },

    {

      id: 'evt-2',

      title: '⚡ FastAPI & Redis Caching Optimization',

      date: '2026-10-06',

      time: '02:30 PM',

      category: 'projects',

      badge: 'Projects',

      color: '#0284c7',

      location: 'Lab',

      description: 'Achieved sub-15ms response latency under 10k concurrent simulated requests with Redis connection pooling.'

    },

    {

      id: 'evt-3',

      title: '🤖 Malware AI: BiLSTM-CNN Classifier Trained',

      date: '2026-10-12',

      time: '11:00 AM',

      category: 'ai',

      badge: 'AI / ML',

      color: '#7c3aed',

      location: 'GPU Cluster',

      description: 'Trained deep learning model on 100,000 PE binary opcode sequences, reaching 98.4% detection accuracy.'

    },

    {

      id: 'evt-4',

      title: '🛡️ ArthaSEC: Financial Threat Intelligence',

      date: '2026-10-18',

      time: '04:00 PM',

      category: 'projects',

      badge: 'Security',

      color: '#ea580c',

      location: 'GitHub / ArthaSEC',

      description: 'Implemented automated security scanning for Indian banking APIs, detecting IDOR and misconfigurations.'

    },

    {

      id: 'evt-5',

      title: '🧠 GraphRAG: Neo4j Knowledge Graph Engine Deployed',

      date: '2026-10-24',

      time: '01:00 PM',

      category: 'flagship',

      badge: 'Flagship',

      color: '#16a34a',

      location: 'Cloud VPS',

      description: 'Deployed hybrid multi-hop knowledge graph retrieval system integrated with ChromaDB vector embeddings.'

    },

    {

      id: 'evt-6',

      title: '🎃 Windows XP Portfolio 2.0 Live Launch Demo',

      date: '2026-10-31',

      time: '12:00 PM',

      category: 'flagship',

      badge: 'Launch',

      color: '#d97706',

      location: 'vedantkale.dev',

      description: 'Official launch of the interactive Windows XP OS portfolio with Clippy AI voice assistant, retro music player, DOOM, and Paint.'

    },



    // November 2026

    {

      id: 'evt-7',

      title: '🎙️ Tech Talk: Knowledge Graphs & RAG in Production',

      date: '2026-11-04',

      time: '05:00 PM',

      category: 'conferences',

      badge: 'Tech Talk',

      color: '#9333ea',

      location: 'Discord Developer Community',

      description: 'Presenting architectural deep-dive into entity extraction, graph traversal, and reducing LLM hallucinations.'

    },

    {

      id: 'evt-8',

      title: '🚀 ArthaSEC v2.0 Microservices Architecture',

      date: '2026-11-12',

      time: '03:00 PM',

      category: 'projects',

      badge: 'Release',

      color: '#0284c7',

      location: 'GitHub',

      description: 'Refactoring ArthaSEC into asynchronous event-driven microservices using Celery and RabbitMQ.'

    },

    {

      id: 'evt-9',

      title: '🏆 AI Innovation Hackathon - Grand Finale',

      date: '2026-11-20',

      time: '09:00 AM',

      category: 'conferences',

      badge: 'Hackathon',

      color: '#16a34a',

      location: 'Tech Hub Convention Center',

      description: 'Live demonstration and pitching of GraphRAG multi-agent autonomous research assistant.'

    },

    {

      id: 'evt-10',

      title: '📚 Distributed Systems & Kubernetes Deep-Dive',

      date: '2026-11-27',

      time: '02:00 PM',

      category: 'career',

      badge: 'Study',

      color: '#0058ee',

      location: 'Library',

      description: 'Studying Raft consensus protocol, etcd internals, and Kubernetes operator patterns.'

    },



    // September 2026

    {

      id: 'evt-11',

      title: '📊 Neo4j Cypher Query Optimization (3.5x Speedup)',

      date: '2026-09-15',

      time: '11:30 AM',

      category: 'projects',

      badge: 'Milestone',

      color: '#0284c7',

      location: 'Local Dev',

      description: 'Profiled Cypher query execution plans, added composite indexes, reduced traversal times from 420ms to 120ms.'

    },

    {

      id: 'evt-12',

      title: '🎓 Completed Distributed Systems Certification',

      date: '2026-09-28',

      time: '04:00 PM',

      category: 'career',

      badge: 'Education',

      color: '#0058ee',

      location: 'Online',

      description: 'Earned certificate in Advanced Distributed Cloud Architecture and Microservices.'

    }

  ];



  let _cachedCalendarAppHTML = null;
  function createCalendarAppHTML() {
    if (_cachedCalendarAppHTML) return _cachedCalendarAppHTML;
    _cachedCalendarAppHTML = `
      <div class="xp-cal-app">

        <!-- XP Menubar & Navigation Toolbar -->

        <div class="xp-cal-toolbar">

          <div class="xp-cal-nav-group">

            <button class="xp-cal-btn" id="cal-prev-month" title="Previous Month">◀</button>

            <select class="xp-cal-select" id="cal-month-select">

              <option value="0">January</option>

              <option value="1">February</option>

              <option value="2">March</option>

              <option value="3">April</option>

              <option value="4">May</option>

              <option value="5">June</option>

              <option value="6">July</option>

              <option value="7">August</option>

              <option value="8">September</option>

              <option value="9">October</option>

              <option value="10">November</option>

              <option value="11">December</option>

            </select>

            <div class="xp-cal-year-spinner">

              <input type="number" id="cal-year-input" min="2000" max="2040" value="2026" class="xp-cal-year-num" />

            </div>

            <button class="xp-cal-btn" id="cal-next-month" title="Next Month">▶</button>

            <button class="xp-cal-btn xp-cal-today-btn" id="cal-today-btn" title="Go to Today">

              <span class="xp-cal-btn-icon">📅</span> Today

            </button>

          </div>



          <div class="xp-cal-view-group">

            <button class="xp-cal-tab-btn active" id="cal-view-month" data-view="month">Month View</button>

            <button class="xp-cal-tab-btn" id="cal-view-agenda" data-view="agenda">Day Agenda</button>

          </div>



          <div class="xp-cal-action-group">

            <button class="xp-cal-btn primary" id="cal-add-event-btn" title="Add New Event">

              <span class="xp-cal-btn-icon">➕</span> New Event

            </button>

            <button class="xp-cal-btn" id="cal-export-ics" title="Export to .ICS iCalendar">

              <span class="xp-cal-btn-icon">📥</span> Export

            </button>

          </div>

        </div>



        <!-- Main Body: Sidebar + Calendar Canvas -->

        <div class="xp-cal-body">

          <!-- Left Explorer Sidebar -->

          <div class="xp-cal-sidebar">

            <!-- Live Clock & Today Panel -->

            <div class="xp-cal-clock-box">

              <div class="xp-cal-analog-clock">

                <div class="mini-clock-face">

                  <div class="mini-clock-hand hour" id="mini-clock-hour"></div>

                  <div class="mini-clock-hand minute" id="mini-clock-min"></div>

                  <div class="mini-clock-hand second" id="mini-clock-sec"></div>

                  <div class="mini-clock-pin"></div>

                </div>

              </div>

              <div class="xp-cal-digital-time" id="cal-digital-clock">12:00:00 PM</div>

              <div class="xp-cal-current-date-str" id="cal-today-str">Saturday, Oct 31, 2026</div>

            </div>



            <!-- Mini Month Calendar -->

            <div class="xp-cal-sidebar-card">

              <div class="xp-cal-sidebar-title"><span>📅</span> Mini Calendar</div>

              <div class="mini-cal-header">

                <button id="mini-cal-prev">◀</button>

                <span id="mini-cal-label">Oct 2026</span>

                <button id="mini-cal-next">▶</button>

              </div>

              <div class="mini-cal-grid" id="mini-cal-grid"></div>

            </div>



            <!-- Categories Filter -->

            <div class="xp-cal-sidebar-card">

              <div class="xp-cal-sidebar-title"><span>🏷️</span> Categories</div>

              <div class="xp-cal-filter-list">

                <label class="xp-cal-filter-item">

                  <input type="checkbox" class="cal-cat-check" data-cat="flagship" checked />

                  <span class="cat-dot" style="background:#16a34a;"></span>

                  <span>Flagship Projects</span>

                </label>

                <label class="xp-cal-filter-item">

                  <input type="checkbox" class="cal-cat-check" data-cat="projects" checked />

                  <span class="cat-dot" style="background:#0284c7;"></span>

                  <span>Backend & Systems</span>

                </label>

                <label class="xp-cal-filter-item">

                  <input type="checkbox" class="cal-cat-check" data-cat="ai" checked />

                  <span class="cat-dot" style="background:#7c3aed;"></span>

                  <span>AI & Security</span>

                </label>

                <label class="xp-cal-filter-item">

                  <input type="checkbox" class="cal-cat-check" data-cat="conferences" checked />

                  <span class="cat-dot" style="background:#9333ea;"></span>

                  <span>Talks & Awards</span>

                </label>

                <label class="xp-cal-filter-item">

                  <input type="checkbox" class="cal-cat-check" data-cat="career" checked />

                  <span class="cat-dot" style="background:#0058ee;"></span>

                  <span>Career & Certs</span>

                </label>

                <label class="xp-cal-filter-item">

                  <input type="checkbox" class="cal-cat-check" data-cat="personal" checked />

                  <span class="cat-dot" style="background:#d97706;"></span>

                  <span>My Reminders</span>

                </label>

              </div>

            </div>



            <!-- Quick Summary -->

            <div class="xp-cal-sidebar-card">

              <div class="xp-cal-sidebar-title"><span>📊</span> Overview</div>

              <div class="xp-cal-stats-row">

                <span>Total Events:</span>

                <strong id="cal-stat-total">12</strong>

              </div>

              <div class="xp-cal-stats-row">

                <span>In Current View:</span>

                <strong id="cal-stat-month">6</strong>

              </div>

            </div>

          </div>



          <!-- Right Main Workspace -->

          <div class="xp-cal-main">

            <!-- 1. MONTH VIEW -->

            <div class="xp-cal-month-view" id="cal-month-view-container">

              <div class="xp-cal-weekday-row">

                <div class="xp-cal-weekday weekend">Sun</div>

                <div class="xp-cal-weekday">Mon</div>

                <div class="xp-cal-weekday">Tue</div>

                <div class="xp-cal-weekday">Wed</div>

                <div class="xp-cal-weekday">Thu</div>

                <div class="xp-cal-weekday">Fri</div>

                <div class="xp-cal-weekday weekend">Sat</div>

              </div>

              <div class="xp-cal-grid" id="cal-month-grid"></div>

            </div>



            <!-- 2. DAY / AGENDA VIEW -->

            <div class="xp-cal-agenda-view" id="cal-agenda-view-container" style="display:none;">

              <div class="xp-cal-agenda-header">

                <button class="xp-cal-btn" id="agenda-prev-day">◀ Prev Day</button>

                <div class="xp-cal-agenda-title" id="agenda-date-title">Saturday, October 31, 2026</div>

                <button class="xp-cal-btn" id="agenda-next-day">Next Day ▶</button>

              </div>

              <div class="xp-cal-agenda-timeline" id="agenda-timeline"></div>

            </div>

          </div>

        </div>



        <!-- Event Details / Add Event XP Modal -->

        <div class="xp-cal-modal-overlay" id="cal-modal" style="display:none;">

          <div class="xp-cal-modal-window">

            <div class="xp-cal-modal-titlebar">

              <span id="cal-modal-title">Add New Event</span>

              <button class="xp-cal-modal-close" id="cal-modal-close">✕</button>

            </div>

            <div class="xp-cal-modal-body">

              <div class="xp-cal-form-group">

                <label>Event Title:</label>

                <input type="text" id="cal-form-title" class="xp-cal-input" placeholder="e.g. GraphRAG v2.0 System Deployment" />

              </div>

              <div class="xp-cal-form-row">

                <div class="xp-cal-form-group" style="flex:1;">

                  <label>Date:</label>

                  <input type="date" id="cal-form-date" class="xp-cal-input" />

                </div>

                <div class="xp-cal-form-group" style="flex:1;">

                  <label>Time:</label>

                  <input type="text" id="cal-form-time" class="xp-cal-input" placeholder="e.g. 10:00 AM or All Day" />

                </div>

              </div>

              <div class="xp-cal-form-row">

                <div class="xp-cal-form-group" style="flex:1;">

                  <label>Category:</label>

                  <select id="cal-form-cat" class="xp-cal-input">

                    <option value="flagship">Flagship Project</option>

                    <option value="projects">Backend & Systems</option>

                    <option value="ai">AI / Security</option>

                    <option value="conferences">Conferences & Talks</option>

                    <option value="career">Career / Certs</option>

                    <option value="personal">Personal Reminder</option>

                  </select>

                </div>

                <div class="xp-cal-form-group" style="flex:1;">

                  <label>Location / Link:</label>

                  <input type="text" id="cal-form-location" class="xp-cal-input" placeholder="e.g. GitHub / Bangalore / Remote" />

                </div>

              </div>

              <div class="xp-cal-form-group">

                <label>Description / Notes:</label>

                <textarea id="cal-form-desc" class="xp-cal-input" rows="3" placeholder="Key deliverables, agenda, or milestones..."></textarea>

              </div>

            </div>

            <div class="xp-cal-modal-footer">

              <button class="xp-btn" id="cal-modal-delete" style="display:none; color:#c00; margin-right:auto;">🗑️ Delete</button>

              <button class="xp-btn primary" id="cal-modal-save">Save Event</button>

              <button class="xp-btn" id="cal-modal-cancel">Cancel</button>

            </div>

          </div>

        </div>

      </div>

    `;
    return _cachedCalendarAppHTML;
  }

  function bindCalendarEvents(container) {

    if (!container) return;



    const now = new Date();

    let calYear = 2026; // Match portfolio simulated timeline, fallback to current year

    let calMonth = 9;   // October (0-indexed)

    let selectedDate = new Date(2026, 9, 31);

    let currentView = 'month';

    const activeCategories = new Set(['flagship', 'projects', 'ai', 'conferences', 'career', 'personal']);

    let editingEventId = null;



    // Load events from localStorage

    function getStoredEvents() {

      try {

        const raw = localStorage.getItem('xp_calendar_events_v2');

        if (raw) return JSON.parse(raw);

      } catch (e) {}

      localStorage.setItem('xp_calendar_events_v2', JSON.stringify(DEFAULT_CALENDAR_EVENTS));

      return [...DEFAULT_CALENDAR_EVENTS];

    }



    let allEvents = getStoredEvents();



    function persistEvents() {

      localStorage.setItem('xp_calendar_events_v2', JSON.stringify(allEvents));

    }



    // Category styling map

    const catStyleMap = {

      flagship: { bg: '#e6f4ea', color: '#137333', border: '#16a34a' },

      projects: { bg: '#e8f0fe', color: '#1a73e8', border: '#0284c7' },

      ai: { bg: '#f3e8fd', color: '#8430ce', border: '#7c3aed' },

      conferences: { bg: '#fef7e0', color: '#b06000', border: '#9333ea' },

      career: { bg: '#e0f2fe', color: '#0369a1', border: '#0058ee' },

      personal: { bg: '#fef3c7', color: '#92400e', border: '#d97706' }

    };



    // DOM References

    const monthSelect = container.querySelector('#cal-month-select');

    const yearInput = container.querySelector('#cal-year-input');

    const prevMonthBtn = container.querySelector('#cal-prev-month');

    const nextMonthBtn = container.querySelector('#cal-next-month');

    const todayBtn = container.querySelector('#cal-today-btn');

    const viewMonthBtn = container.querySelector('#cal-view-month');

    const viewAgendaBtn = container.querySelector('#cal-view-agenda');

    const monthViewContainer = container.querySelector('#cal-month-view-container');

    const agendaViewContainer = container.querySelector('#cal-agenda-view-container');

    const monthGrid = container.querySelector('#cal-month-grid');

    const addEventBtn = container.querySelector('#cal-add-event-btn');

    const exportIcsBtn = container.querySelector('#cal-export-ics');



    // Sidebar clock refs

    const secHand = container.querySelector('#mini-clock-sec');

    const minHand = container.querySelector('#mini-clock-min');

    const hourHand = container.querySelector('#mini-clock-hour');

    const digitalClock = container.querySelector('#cal-digital-clock');

    const todayStrEl = container.querySelector('#cal-today-str');

    const miniCalGrid = container.querySelector('#mini-cal-grid');

    const miniCalLabel = container.querySelector('#mini-cal-label');

    const miniCalPrev = container.querySelector('#mini-cal-prev');

    const miniCalNext = container.querySelector('#mini-cal-next');



    // Modal refs

    const modal = container.querySelector('#cal-modal');

    const modalTitle = container.querySelector('#cal-modal-title');

    const modalClose = container.querySelector('#cal-modal-close');

    const modalCancel = container.querySelector('#cal-modal-cancel');

    const modalSave = container.querySelector('#cal-modal-save');

    const modalDelete = container.querySelector('#cal-modal-delete');

    const formTitle = container.querySelector('#cal-form-title');

    const formDate = container.querySelector('#cal-form-date');

    const formTime = container.querySelector('#cal-form-time');

    const formCat = container.querySelector('#cal-form-cat');

    const formLocation = container.querySelector('#cal-form-location');

    const formDesc = container.querySelector('#cal-form-desc');



    // Helper: format date as YYYY-MM-DD

    function formatDateKey(y, m, d) {

      const mm = String(m + 1).padStart(2, '0');

      const dd = String(d).padStart(2, '0');

      return `${y}-${mm}-${dd}`;

    }



    // Helper: is same day

    function isSameDay(d1, d2) {

      return d1.getFullYear() === d2.getFullYear() &&

             d1.getMonth() === d2.getMonth() &&

             d1.getDate() === d2.getDate();

    }



    // 1. Live Clock & Today Panel

    function tickClock() {

      const t = new Date();

      const s = t.getSeconds();

      const m = t.getMinutes();

      const h = t.getHours();



      if (secHand) secHand.style.transform = `rotate(${s * 6}deg)`;

      if (minHand) minHand.style.transform = `rotate(${m * 6 + s * 0.1}deg)`;

      if (hourHand) hourHand.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`;



      if (digitalClock) {

        digitalClock.textContent = t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      }

      if (todayStrEl) {

        todayStrEl.textContent = t.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

      }

    }

    if (window._calClockInterval) {
      clearInterval(window._calClockInterval);
    }
    tickClock();
    window._calClockInterval = setInterval(tickClock, 1000);



    // 2. Render Mini Calendar

    function renderMiniCalendar() {

      if (!miniCalGrid) return;

      miniCalGrid.innerHTML = '';



      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if (miniCalLabel) miniCalLabel.textContent = `${monthNames[calMonth]} ${calYear}`;



      const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

      dayHeaders.forEach(dh => {

        const hEl = document.createElement('div');

        hEl.className = 'mini-cal-day-head';

        hEl.textContent = dh;

        miniCalGrid.appendChild(hEl);

      });



      const firstDay = new Date(calYear, calMonth, 1).getDay();

      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

      const daysInPrev = new Date(calYear, calMonth, 0).getDate();



      // Prev month filler

      for (let i = firstDay - 1; i >= 0; i--) {

        const dEl = document.createElement('div');

        dEl.className = 'mini-cal-day other-month';

        dEl.textContent = daysInPrev - i;

        miniCalGrid.appendChild(dEl);

      }



      // Current month days

      for (let d = 1; d <= daysInMonth; d++) {

        const dEl = document.createElement('div');

        dEl.className = 'mini-cal-day';

        dEl.textContent = d;



        const cellDate = new Date(calYear, calMonth, d);

        if (isSameDay(cellDate, now) || (calYear === 2026 && calMonth === 9 && d === 31)) {

          dEl.classList.add('today');

        }

        if (isSameDay(cellDate, selectedDate)) {

          dEl.classList.add('selected');

        }



        dEl.addEventListener('click', () => {

          selectedDate = cellDate;

          renderMonth();

          if (currentView === 'agenda') renderAgenda();

          SoundManager.playClick();

        });



        miniCalGrid.appendChild(dEl);

      }

    }



    if (miniCalPrev) {

      miniCalPrev.addEventListener('click', () => {

        calMonth--;

        if (calMonth < 0) { calMonth = 11; calYear--; }

        renderMonth();

      });

    }

    if (miniCalNext) {

      miniCalNext.addEventListener('click', () => {

        calMonth++;

        if (calMonth > 11) { calMonth = 0; calYear++; }

        renderMonth();

      });

    }



    // 3. Render Month Grid

    function renderMonth() {

      if (!monthGrid) return;

      monthGrid.innerHTML = '';



      if (monthSelect) monthSelect.value = calMonth;

      if (yearInput) yearInput.value = calYear;



      const firstDay = new Date(calYear, calMonth, 1).getDay();

      const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

      const daysInPrev = new Date(calYear, calMonth, 0).getDate();

      const totalCells = (firstDay + daysInMonth > 35) ? 42 : 35;



      let monthEventsCount = 0;



      // 1. Trailing days from previous month

      for (let i = firstDay - 1; i >= 0; i--) {

        const dayNum = daysInPrev - i;

        const prevMonthIndex = calMonth === 0 ? 11 : calMonth - 1;

        const prevYear = calMonth === 0 ? calYear - 1 : calYear;

        const dateKey = formatDateKey(prevYear, prevMonthIndex, dayNum);



        const cell = createDayCell(dayNum, dateKey, true, false);

        monthGrid.appendChild(cell);

      }



      // 2. Current month days

      for (let d = 1; d <= daysInMonth; d++) {

        const dateKey = formatDateKey(calYear, calMonth, d);

        const dayDate = new Date(calYear, calMonth, d);

        const isTodayDate = isSameDay(dayDate, now) || (calYear === 2026 && calMonth === 9 && d === 31);

        const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;



        const cell = createDayCell(d, dateKey, false, isTodayDate, isWeekend, dayDate);

        monthGrid.appendChild(cell);



        // Count events in current month

        const dayEvts = allEvents.filter(e => e.date === dateKey && activeCategories.has(e.category));

        monthEventsCount += dayEvts.length;

      }



      // 3. Leading days of next month

      const remainingCells = totalCells - (firstDay + daysInMonth);

      for (let d = 1; d <= remainingCells; d++) {

        const nextMonthIndex = calMonth === 11 ? 0 : calMonth + 1;

        const nextYear = calMonth === 11 ? calYear + 1 : calYear;

        const dateKey = formatDateKey(nextYear, nextMonthIndex, d);



        const cell = createDayCell(d, dateKey, true, false);

        monthGrid.appendChild(cell);

      }



      // Update overview stats

      const totalStat = container.querySelector('#cal-stat-total');

      const monthStat = container.querySelector('#cal-stat-month');

      if (totalStat) totalStat.textContent = allEvents.length;

      if (monthStat) monthStat.textContent = monthEventsCount;



      renderMiniCalendar();

    }



    // Helper: Build a Day Cell element

    function createDayCell(dayNum, dateKey, isOtherMonth, isTodayDate, isWeekend, dayDate) {

      const cell = document.createElement('div');

      cell.className = 'xp-cal-cell';

      if (isOtherMonth) cell.classList.add('is-other-month');

      if (isTodayDate) cell.classList.add('is-today');

      if (isWeekend) cell.classList.add('is-weekend');



      const head = document.createElement('div');

      head.className = 'xp-cal-day-head';



      const numEl = document.createElement('span');

      numEl.className = 'xp-cal-day-num';

      numEl.textContent = dayNum;

      head.appendChild(numEl);



      const plusHint = document.createElement('span');

      plusHint.className = 'xp-cal-day-plus';

      plusHint.textContent = '➕';

      head.appendChild(plusHint);



      cell.appendChild(head);



      // Event list

      const evtsList = document.createElement('div');

      evtsList.className = 'xp-cal-events-list';



      const dayEvts = allEvents.filter(e => e.date === dateKey && activeCategories.has(e.category));

      const maxDisplay = 2;

      const displayEvts = dayEvts.slice(0, maxDisplay);



      displayEvts.forEach(evt => {

        const pill = document.createElement('div');

        pill.className = 'xp-cal-event-pill';

        const st = catStyleMap[evt.category] || catStyleMap.flagship;

        pill.style.background = st.bg;

        pill.style.color = st.color;

        pill.style.borderLeftColor = st.border;

        pill.title = `${evt.title} (${evt.time}) - Click to inspect`;

        pill.innerHTML = `<strong>${evt.title}</strong>`;



        pill.addEventListener('click', (e) => {

          e.stopPropagation();

          SoundManager.playClick();

          openEditModal(evt);

        });



        evtsList.appendChild(pill);

      });



      if (dayEvts.length > maxDisplay) {

        const morePill = document.createElement('div');

        morePill.className = 'xp-cal-more-pill';

        morePill.textContent = `+${dayEvts.length - maxDisplay} more...`;

        morePill.addEventListener('click', (e) => {

          e.stopPropagation();

          if (dayDate) {

            selectedDate = dayDate;

            switchView('agenda');

          }

        });

        evtsList.appendChild(morePill);

      }



      cell.appendChild(evtsList);



      // Clicking cell adds a new event

      cell.addEventListener('click', () => {

        SoundManager.playClick();

        if (dayDate) selectedDate = dayDate;

        openAddModal(dateKey);

      });



      return cell;

    }



    // 4. Render Day / Agenda View

    function renderAgenda() {

      if (!agendaViewContainer) return;

      const timeline = container.querySelector('#agenda-timeline');

      const titleEl = container.querySelector('#agenda-date-title');

      if (!timeline) return;



      timeline.innerHTML = '';

      if (titleEl) {

        titleEl.textContent = selectedDate.toLocaleDateString('en-US', {

          weekday: 'long',

          month: 'long',

          day: 'numeric',

          year: 'numeric'

        });

      }



      const dateKey = formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

      const dayEvts = allEvents.filter(e => e.date === dateKey && activeCategories.has(e.category));



      const hours = [

        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',

        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',

        '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'

      ];



      hours.forEach(hr => {

        const slot = document.createElement('div');

        slot.className = 'xp-cal-agenda-slot';



        const timeLbl = document.createElement('div');

        timeLbl.className = 'xp-cal-agenda-time';

        timeLbl.textContent = hr;

        slot.appendChild(timeLbl);



        const evtsContainer = document.createElement('div');

        evtsContainer.className = 'xp-cal-agenda-events';



        // Match events for this hour roughly or all-day

        const matchingEvts = dayEvts.filter(e => {

          if (!e.time) return hr === '09:00 AM';

          return e.time.toLowerCase().includes(hr.slice(0, 5).toLowerCase()) || (e.time.toLowerCase().includes('all day') && hr === '09:00 AM');

        });



        if (matchingEvts.length > 0) {

          matchingEvts.forEach(evt => {

            const card = document.createElement('div');

            card.className = 'xp-cal-agenda-card';

            const st = catStyleMap[evt.category] || catStyleMap.flagship;

            card.style.borderLeftColor = st.border;



            card.innerHTML = `

              <div class="xp-cal-agenda-card-title">${evt.title}</div>

              <div class="xp-cal-agenda-card-meta">

                <span>⏰ ${evt.time}</span> | <span>📍 ${evt.location || 'Remote'}</span> | <span>🏷️ ${evt.badge || evt.category}</span>

              </div>

              <div style="font-size:10px; color:#334155; margin-top:3px;">${evt.description || ''}</div>

            `;



            card.addEventListener('click', () => {

              SoundManager.playClick();

              openEditModal(evt);

            });



            evtsContainer.appendChild(card);

          });

        } else {

          evtsContainer.innerHTML = `<span style="color:#aaa; font-size:9.5px; cursor:pointer;" title="Click to schedule">+ Add appointment at ${hr}</span>`;

          evtsContainer.addEventListener('click', () => {

            SoundManager.playClick();

            openAddModal(dateKey, hr);

          });

        }



        slot.appendChild(evtsContainer);

        timeline.appendChild(slot);

      });

    }



    const agendaPrevBtn = container.querySelector('#agenda-prev-day');

    const agendaNextBtn = container.querySelector('#agenda-next-day');

    if (agendaPrevBtn) {

      agendaPrevBtn.addEventListener('click', () => {

        selectedDate.setDate(selectedDate.getDate() - 1);

        renderAgenda();

        SoundManager.playClick();

      });

    }

    if (agendaNextBtn) {

      agendaNextBtn.addEventListener('click', () => {

        selectedDate.setDate(selectedDate.getDate() + 1);

        renderAgenda();

        SoundManager.playClick();

      });

    }



    // Switch view tabs

    function switchView(viewName) {

      currentView = viewName;

      if (viewName === 'month') {

        viewMonthBtn.classList.add('active');

        viewAgendaBtn.classList.remove('active');

        monthViewContainer.style.display = 'flex';

        agendaViewContainer.style.display = 'none';

        renderMonth();

      } else {

        viewMonthBtn.classList.remove('active');

        viewAgendaBtn.classList.add('active');

        monthViewContainer.style.display = 'none';

        agendaViewContainer.style.display = 'flex';

        renderAgenda();

      }

      SoundManager.playClick();

    }



    if (viewMonthBtn) viewMonthBtn.addEventListener('click', () => switchView('month'));

    if (viewAgendaBtn) viewAgendaBtn.addEventListener('click', () => switchView('agenda'));



    // Navigation controls

    if (prevMonthBtn) {

      prevMonthBtn.addEventListener('click', () => {

        calMonth--;

        if (calMonth < 0) { calMonth = 11; calYear--; }

        renderMonth();

        SoundManager.playClick();

      });

    }

    if (nextMonthBtn) {

      nextMonthBtn.addEventListener('click', () => {

        calMonth++;

        if (calMonth > 11) { calMonth = 0; calYear++; }

        renderMonth();

        SoundManager.playClick();

      });

    }

    if (monthSelect) {

      monthSelect.addEventListener('change', (e) => {

        calMonth = parseInt(e.target.value);

        renderMonth();

        SoundManager.playClick();

      });

    }

    if (yearInput) {

      yearInput.addEventListener('change', (e) => {

        calYear = parseInt(e.target.value) || 2026;

        renderMonth();

        SoundManager.playClick();

      });

    }

    if (todayBtn) {

      todayBtn.addEventListener('click', () => {

        calYear = 2026;

        calMonth = 9;

        selectedDate = new Date(2026, 9, 31);

        renderMonth();

        if (currentView === 'agenda') renderAgenda();

        SoundManager.playClick();

      });

    }



    // Category filter checkboxes

    const catChecks = container.querySelectorAll('.cal-cat-check');

    catChecks.forEach(chk => {

      chk.addEventListener('change', () => {

        const cat = chk.dataset.cat;

        if (chk.checked) activeCategories.add(cat);

        else activeCategories.delete(cat);

        renderMonth();

        if (currentView === 'agenda') renderAgenda();

        SoundManager.playClick();

      });

    });



    // 5. Modal Management

    function openAddModal(dateKey, defaultTime = '10:00 AM') {

      editingEventId = null;

      if (modalTitle) modalTitle.textContent = 'Add New Event';

      if (formTitle) formTitle.value = '';

      if (formDate) formDate.value = dateKey;

      if (formTime) formTime.value = defaultTime;

      if (formCat) formCat.value = 'projects';

      if (formLocation) formLocation.value = 'Remote / Local';

      if (formDesc) formDesc.value = '';

      if (modalDelete) modalDelete.style.display = 'none';

      if (modal) modal.style.display = 'flex';

      if (formTitle) formTitle.focus();

    }



    function openEditModal(evt) {

      editingEventId = evt.id;

      if (modalTitle) modalTitle.textContent = 'Edit Event Details';

      if (formTitle) formTitle.value = evt.title || '';

      if (formDate) formDate.value = evt.date || '';

      if (formTime) formTime.value = evt.time || '';

      if (formCat) formCat.value = evt.category || 'projects';

      if (formLocation) formLocation.value = evt.location || '';

      if (formDesc) formDesc.value = evt.description || '';

      if (modalDelete) modalDelete.style.display = 'block';

      if (modal) modal.style.display = 'flex';

    }



    function closeModal() {

      if (modal) modal.style.display = 'none';

      editingEventId = null;

    }



    if (modalClose) modalClose.addEventListener('click', closeModal);

    if (modalCancel) modalCancel.addEventListener('click', closeModal);

    if (addEventBtn) addEventBtn.addEventListener('click', () => {

      const todayKey = formatDateKey(calYear, calMonth, 15);

      openAddModal(todayKey);

    });



    // Save Event

    if (modalSave) {

      modalSave.addEventListener('click', () => {

        const title = formTitle.value.trim();

        const date = formDate.value;

        if (!title || !date) {

          alert('Please enter an event title and select a date.');

          return;

        }



        const cat = formCat.value;

        const time = formTime.value.trim() || 'All Day';

        const location = formLocation.value.trim();

        const desc = formDesc.value.trim();



        if (editingEventId) {

          const idx = allEvents.findIndex(e => e.id === editingEventId);

          if (idx !== -1) {

            allEvents[idx] = {

              ...allEvents[idx],

              title,

              date,

              time,

              category: cat,

              badge: cat.toUpperCase(),

              location,

              description: desc

            };

          }

        } else {

          allEvents.push({

            id: 'evt-' + Date.now(),

            title,

            date,

            time,

            category: cat,

            badge: cat.toUpperCase(),

            location,

            description: desc

          });

        }



        persistEvents();

        closeModal();

        renderMonth();

        if (currentView === 'agenda') renderAgenda();

        SoundManager.playAsterisk();

      });

    }



    // Delete Event

    if (modalDelete) {

      modalDelete.addEventListener('click', () => {

        if (editingEventId && confirm('Are you sure you want to delete this event?')) {

          allEvents = allEvents.filter(e => e.id !== editingEventId);

          persistEvents();

          closeModal();

          renderMonth();

          if (currentView === 'agenda') renderAgenda();

          SoundManager.playAsterisk();

        }

      });

    }



    // Export to .ICS iCalendar

    if (exportIcsBtn) {

      exportIcsBtn.addEventListener('click', () => {

        SoundManager.playClick();

        let ics = [

          'BEGIN:VCALENDAR',

          'VERSION:2.0',

          'PRODID:-//Vedant Kale//Windows XP Portfolio Calendar//EN',

          'CALSCALE:GREGORIAN',

          'METHOD:PUBLISH'

        ];



        allEvents.forEach(e => {

          const cleanDate = (e.date || '2026-10-31').replace(/-/g, '');

          ics.push('BEGIN:VEVENT');

          ics.push(`UID:${e.id}@vedantkale.dev`);

          ics.push(`DTSTAMP:${cleanDate}T000000Z`);

          ics.push(`DTSTART;VALUE=DATE:${cleanDate}`);

          ics.push(`SUMMARY:${e.title}`);

          ics.push(`DESCRIPTION:${(e.description || '').replace(/\n/g, '\\n')}`);

          ics.push(`LOCATION:${e.location || 'Remote'}`);

          ics.push('END:VEVENT');

        });



        ics.push('END:VCALENDAR');

        const icsBlob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });

        const url = URL.createObjectURL(icsBlob);

        const a = document.createElement('a');

        a.href = url;

        a.download = 'vedant_kale_schedule.ics';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

      });

    }



    // Initial render

    renderMonth();

  }





  // 6. WALLPAPER STICKY NOTE (PINNED ON DESKTOP)
  window.initStickyNotes = initStickyNotes;
  function initStickyNotes() {
    const desktopBg = document.querySelector('.bg-office-pic');
    if (!desktopBg) {
      // Must ONLY exist on the desktop (/office). Remove if on bootscreen/welcome screen.
      const stray = document.getElementById('xp-desktop-stickynote');
      if (stray) stray.remove();
      return;
    }
    let note = document.getElementById('xp-desktop-stickynote');
    if (note) {
      if (!desktopBg.contains(note)) desktopBg.appendChild(note);
      return;
    }

    note = document.createElement('div');
    note.id = 'xp-desktop-stickynote';
    note.className = 'xp-sticky-note';
    try {
      const savedStickyPos = JSON.parse(localStorage.getItem('xp_sticky_pos') || 'null');
      if (savedStickyPos && (savedStickyPos.left === 720 || (typeof savedStickyPos.left === 'number' && savedStickyPos.left < 500))) {
        localStorage.removeItem('xp_sticky_pos');
        throw new Error('reset bad sticky');
      }
      if (savedStickyPos && typeof savedStickyPos.right === 'number' && typeof savedStickyPos.top === 'number') {
        note.style.left = 'auto';
        note.style.right = Math.max(10, savedStickyPos.right) + 'px';
        note.style.top = Math.max(10, savedStickyPos.top) + 'px';
      } else if (savedStickyPos && typeof savedStickyPos.left === 'number' && typeof savedStickyPos.top === 'number') {
        note.style.right = 'auto';
        note.style.left = Math.max(10, Math.min(window.innerWidth - 200, savedStickyPos.left)) + 'px';
        note.style.top = Math.max(10, Math.min(window.innerHeight - 200, savedStickyPos.top)) + 'px';
      } else {
        note.style.top = '20px';
        note.style.right = '220px';
      }
    } catch(e) {
      note.style.top = '20px';
      note.style.right = '220px';
    }

    const colors = ['yellow', 'blue', 'pink', 'green'];
    let currentColorIndex = 0;

    const defaultContent = `<b>📌 VEDANT KALE — SDE &amp; SYSTEMS ENGINEER</b><br><br>
🎓 <b>Final-Year B.Tech Computer Science</b><br>
🏛️ Pimpri Chinchwad University (PCU), Pune | CGPA: <b>7.69/10</b><br><br>
<b>⚙️ Systems &amp; Core Architecture:</b><br>
• <b>Neuro-Adaptive GraphRAG</b>: Hybrid Neo4j + Pinecone + Cohere reranking pipeline with RAGAS evaluation gates (534 passing tests, 2.5s p95 latency threshold).<br>
• <b>ArthaSEC Engine</b>: Financial retrieval &amp; verification across 352 SEC filings (32K chunks), BGE cross-encoder (17ms p50 latency).<br>
• <b>Two-Tier Malware Detection</b>: Random forest + evidential deep learning sandbox (99.30% accuracy, 0.003ms CPU inference).<br>
• <b>SDE Intern</b> @ Karst Technologies (Jul 2026 – Sep 2026).<br><br>
<b>💻 Coding &amp; Credentials:</b><br>
• <b>CodeChef</b>: 1824 Rating (3-Star) | <b>LeetCode</b>: 1480 Rating (150+ solved)<br>
• Amazon / Coursera DSA Specialization | Udemy Full-Stack Web Dev<br><br>
📧 <a href="mailto:kalevedant750@gmail.com" style="color:#0046dd; font-weight:bold; text-decoration:underline;">kalevedant750@gmail.com</a> | 📍 Pune, India`;

    let savedContent = localStorage.getItem('xp_sticky_notes');
    if (!savedContent || savedContent.includes('dY') || savedContent.includes('DESKTOP MEMO') || savedContent.includes('WELCOME TO VEDANT') || savedContent.includes('?')) {
      savedContent = defaultContent;
      try { localStorage.setItem('xp_sticky_notes', defaultContent); } catch(e) {}
    }

    note.innerHTML = `
      <div class="xp-sticky-header">
        <span>📌 Sticky Note</span>
        <div class="xp-sticky-tools">
          <button class="xp-sticky-btn" id="sticky-btn-color" title="Cycle color">🎨</button>
          <button class="xp-sticky-btn" id="sticky-btn-close" title="Minimize / Restore note">✕</button>
        </div>
      </div>
      <div class="xp-sticky-body" contenteditable="true" spellcheck="false">${savedContent || defaultContent}</div>
    `;

    desktopBg.appendChild(note);

    // Draggable header
    const header = note.querySelector('.xp-sticky-header');
    let isDragging = false, startX = 0, startY = 0, initLeft = 0, initTop = 0;
    header.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.xp-sticky-btn')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const r = note.getBoundingClientRect();
      initLeft = r.left;
      initTop = r.top;
      note.style.zIndex = Math.max(100, (window.__highestZIndex ? ++window.__highestZIndex : 5000));
      const onMove = (ev) => {
        if (!isDragging) return;
        note.style.left = (initLeft + ev.clientX - startX) + 'px';
        note.style.top = (initTop + ev.clientY - startY) + 'px';
        note.style.right = 'auto';
      };
      const onUp = () => {
        isDragging = false;
        delete note.dataset.isDragging;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        try {
          const rect = note.getBoundingClientRect();
          const distFromRight = window.innerWidth - rect.right;
          const distFromLeft = rect.left;
          let toSave = {};
          if (distFromRight < distFromLeft) {
            toSave = { right: Math.max(10, Math.round(distFromRight)), top: Math.max(10, Math.round(rect.top)) };
          } else {
            toSave = { left: Math.max(10, Math.round(distFromLeft)), top: Math.max(10, Math.round(rect.top)) };
          }
          localStorage.setItem('xp_sticky_pos', JSON.stringify(toSave));
        } catch(e) {}
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });

    const bodyEl = note.querySelector('.xp-sticky-body');

    bodyEl.addEventListener('input', () => {

      localStorage.setItem('xp_sticky_notes', bodyEl.innerHTML);

    });



    const btnColor = note.querySelector('#sticky-btn-color');

    btnColor.addEventListener('click', (e) => {

      e.stopPropagation();

      SoundManager.playClick();

      currentColorIndex = (currentColorIndex + 1) % colors.length;

      note.className = 'xp-sticky-note note-' + colors[currentColorIndex];

    });



    const btnClose = note.querySelector('#sticky-btn-close');

    btnClose.addEventListener('click', (e) => {

      e.stopPropagation();

      SoundManager.playClick();

      note.style.display = 'none';

    });

  }



  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  // ==========================================================================

  // AUTHENTIC WINDOWS XP DESKTOP SYSTEM

  // Strict Grid Alignment, Windows 11 Style Drag Shadow, Pinned Start & Recycle Bin

  // ==========================================================================



  const APP_REGISTRY = {

    'myProjects': { id: 'myProjects', name: 'My Projects', type: 'Folder / Project Directory', size: '2.4 MB', icon: '/img/icons/projects/projects-icon-lg.webp' },

    'pictures': { id: 'pictures', name: 'Gallery', type: 'Picture and Fax Viewer', size: '1.4 MB', icon: '/img/icons/pictures/gallery-icon-lg.svg' },
    'contact': { id: 'contact', name: 'Contact me', type: 'System Utility', size: '340 KB', icon: '/img/icons/contact/email-icon-lg.webp' },

    'myCV': { id: 'myCV', name: 'My CV', type: 'Adobe Acrobat Document', size: '1.2 MB', icon: '/img/icons/cv/cv-icon-lg.webp' },

    'music': { id: 'music', name: 'My Musics', type: 'Media Player Application', size: '8.4 MB', icon: '/img/icons/music/music-icon-lg.webp' },

    'minesweeper': { id: 'minesweeper', name: 'Minesweeper', type: 'Windows Game Application', size: '120 KB', icon: '/img/icons/minesweeper/minesweeper-icon-lg.webp' },

    'notepad': { id: 'notepad', name: 'Notepad', type: 'Text Document Editor', size: '88 KB', icon: '/img/icons/notepad/notepad-icon-lg.webp' },

    'doom': { id: 'doom', name: 'Doom', type: 'MS-DOS Retro Game', size: '24.1 MB', icon: '/img/icons/doom/doom-icon-lg.webp' },

    'terminal': { id: 'terminal', name: 'My Terminal', type: 'Command Prompt Console', size: '450 KB', icon: '/img/icons/terminal/terminal-icon-lg.webp' },

    'settings': { id: 'settings', name: 'Settings', type: 'Control Panel Applet', size: '1.1 MB', icon: '/img/icons/settings-icon-lg.webp' },

    'recyclebin': { id: 'recyclebin', name: 'Recycle Bin', type: 'System Folder', size: 'Variable', icon: '/img/icons/recycle-bin-empty.svg' },

    'paint': { id: 'paint', name: 'Paint', type: 'Graphic Painting Utility', size: '750 KB', icon: '/img/icons/paint.svg' },

    'pinball': { id: 'pinball', name: '3D Pinball', type: 'Space Cadet 3D Game', size: '5.6 MB', icon: '/img/icons/pinball.svg' },

    'stickynotes': { id: 'stickynotes', name: 'Sticky Notes', type: 'Desktop Notes Utility', size: '180 KB', icon: '/img/icons/sticky-notes.svg' },

    'services': { id: 'services', name: 'Services', type: 'System Catalog', size: '600 KB', icon: '/img/icons/services/services-icon-lg.webp' }

  };



  const GRID_ORIGIN_X = 20;

  const GRID_ORIGIN_Y = 20;

  const GRID_COL_WIDTH = 84;

  const GRID_ROW_HEIGHT = 86;



  let currentContextApp = null;

  let clipboardState = null; // { mode: 'cut'|'copy', app: {...}, btn: HTMLElement }

  let lastDesktopClickX = 220;

  let lastDesktopClickY = 160;



  function getDesktopGridDimensions() {

    const maxRows = Math.max(7, Math.floor((window.innerHeight - 40) / GRID_ROW_HEIGHT));

    const maxCols = Math.max(4, Math.floor((window.innerWidth - 40) / GRID_COL_WIDTH));

    return { maxRows, maxCols };

  }



  function coordToGrid(rawX, rawY) {

    const { maxRows, maxCols } = getDesktopGridDimensions();

    const col = Math.max(0, Math.min(maxCols - 1, Math.round((rawX - GRID_ORIGIN_X) / GRID_COL_WIDTH)));

    const row = Math.max(0, Math.min(maxRows - 1, Math.round((rawY - GRID_ORIGIN_Y) / GRID_ROW_HEIGHT)));

    return {

      col,

      row,

      x: col * GRID_COL_WIDTH + GRID_ORIGIN_X,

      y: row * GRID_ROW_HEIGHT + GRID_ORIGIN_Y

    };

  }



  function isPortfolioReload() {
    try {
      const navEntries = (window.performance && performance.getEntriesByType)
        ? performance.getEntriesByType('navigation')
        : null;
      if (navEntries && navEntries.length > 0 && navEntries[0].type) {
        return navEntries[0].type === 'reload';
      }
      if (window.performance && performance.navigation) {
        return performance.navigation.type === 1;
      }
    } catch (e) {}
    return false;
  }

  function isPortfolioRevisit() {
    try {
      const hasSession = sessionStorage.getItem('xp_portfolio_session_active');
      return !hasSession;
    } catch (e) {
      return false;
    }
  }

  // Unified Session Lifecycle & Per-User Clean State
  function handleSessionLifecycle() {
    try {
      localStorage.removeItem('windows');
      sessionStorage.removeItem('windows');
      localStorage.removeItem('openWindowIds');
      sessionStorage.removeItem('openWindowIds');
      sessionStorage.setItem('xp_portfolio_session_active', 'true');
    } catch (e) {}
  }

  function getDeletedApps() {
    try {
      if (isPortfolioRevisit()) return [];
      const raw = sessionStorage.getItem('xp_deleted_desktop_apps') || localStorage.getItem('xp_deleted_desktop_apps');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveDeletedApps(list) {
    try {
      const serialized = JSON.stringify(list);
      sessionStorage.setItem('xp_deleted_desktop_apps', serialized);
      localStorage.setItem('xp_deleted_desktop_apps', serialized);
      sessionStorage.setItem('xp_portfolio_session_active', 'true');
    } catch (e) {}
  }

  function getCustomPositions() {
    try {
      const raw = localStorage.getItem('xp_desktop_icon_positions') || sessionStorage.getItem('xp_desktop_icon_positions');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCustomPositions(map) {
    try {
      const serialized = JSON.stringify(map);
      localStorage.setItem('xp_desktop_icon_positions', serialized);
      sessionStorage.setItem('xp_desktop_icon_positions', serialized);
      sessionStorage.setItem('xp_portfolio_session_active', 'true');
    } catch (e) {}
  }

  function getCustomShortcuts() {
    try {
      if (isPortfolioRevisit()) return [];
      const raw = sessionStorage.getItem('xp_custom_desktop_items') || localStorage.getItem('xp_custom_desktop_items');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCustomShortcuts(list) {
    try {
      const serialized = JSON.stringify(list);
      sessionStorage.setItem('xp_custom_desktop_items', serialized);
      localStorage.setItem('xp_custom_desktop_items', serialized);
      sessionStorage.setItem('xp_portfolio_session_active', 'true');
    } catch (e) {}
  }

  function getPinnedStartApps() {
    try {
      const raw = sessionStorage.getItem('xp_pinned_start_apps');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function savePinnedStartApps(list) {
    try {
      const serialized = JSON.stringify(list);
      sessionStorage.setItem('xp_pinned_start_apps', serialized);
      localStorage.setItem('xp_pinned_start_apps', serialized);
      sessionStorage.setItem('xp_portfolio_session_active', 'true');
    } catch (e) {}
  }


  function resolveAppFromButton(btn) {

    if (!btn) return null;

    if (btn.dataset && btn.dataset.appId && APP_REGISTRY[btn.dataset.appId]) {

      return APP_REGISTRY[btn.dataset.appId];

    }

    if (btn.dataset && btn.dataset.isCustomShortcut) {

      return {

        id: btn.dataset.appId,

        name: btn.dataset.appName || 'Shortcut',

        type: btn.dataset.appType || 'Shortcut',

        size: '2 KB',

        icon: btn.querySelector('img') ? btn.querySelector('img').src : '/img/icons/settings-icon-sm.webp',

        isCustomShortcut: true,

        targetId: btn.dataset.targetId

      };

    }



    const txt = (btn.textContent || '').trim();

    const txtLower = txt.toLowerCase();

    const img = btn.querySelector('img');

    const src = img ? (img.getAttribute('src') || '') : '';

    const alt = img ? (img.getAttribute('alt') || '').toLowerCase() : '';



    for (const [key, info] of Object.entries(APP_REGISTRY)) {

      if (txtLower.includes(info.name.toLowerCase()) || alt.includes(info.name.toLowerCase())) {

        btn.dataset.appId = key;

        return info;

      }

      if (src.includes(key.toLowerCase()) || (key === 'myProjects' && src.includes('projects')) || (key === 'myCV' && src.includes('cv'))) {

        btn.dataset.appId = key;

        return info;

      }

    }



    const cleanName = txt.split('\n')[0].trim() || 'Desktop Item';

    const genId = 'app_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const genInfo = {

      id: genId,

      name: cleanName,

      type: 'Desktop Item',

      size: '1.2 MB',

      icon: img ? img.src : '/img/icons/settings-icon-sm.webp'

    };

    btn.dataset.appId = genId;

    return genInfo;

  }



  function saveAppPosition(appId, x, y) {

    const positions = getCustomPositions();

    positions[appId] = { x, y };

    saveCustomPositions(positions);

  }



  function findRecycleBinButton() {

    return document.querySelector('button[data-app-id="recyclebin"]') ||

      Array.from(document.querySelectorAll('section.absolute.top-0.left-0 button')).find(b => {

        const text = (b.textContent || '').toLowerCase();

        return text.includes('recycle');

      });

  }



  function updateDesktopRecycleBinIcon(isFull) {
    const btn = findRecycleBinButton();
    if (btn) {
      const img = btn.querySelector('img');
      if (img) {
        img.src = isFull ? '/img/icons/recycle-bin-full.svg' : '/img/icons/recycle-bin-empty.svg';
      }
    }
    const addrIcon = document.getElementById('recycle-addr-icon');
    if (addrIcon) {
      addrIcon.src = isFull ? '/img/icons/recycle-bin-full.svg' : '/img/icons/recycle-bin-empty.svg';
    }
  }



  // --------------------------------------------------------------------------

  // MODERN DRAG SHADOW ENGINE (Keeps original app in place & snaps to strict grid)

  // --------------------------------------------------------------------------

  function attachIconDrag(btn, appInfo) {

    btn.setAttribute('draggable', 'false');

    btn.ondragstart = (e) => { e.preventDefault(); return false; };



    const img = btn.querySelector('img');

    if (img) {

      img.setAttribute('draggable', 'false');

      img.ondragstart = () => false;

      img.style.pointerEvents = 'none';

      img.style.userSelect = 'none';

      img.style.webkitUserDrag = 'none';

    }

    const label = btn.querySelector('p');

    if (label) {

      label.style.userSelect = 'none';

      label.style.pointerEvents = 'none';

    }



    let isDragging = false;

    let startX = 0, startY = 0;

    let origLeft = 0, origTop = 0;

    let grabOffsetX = 0, grabOffsetY = 0;

    let isOverBin = false;

    let activePointerId = null;



    let dragGhost = null;

    let snapIndicator = null;

    const DRAG_THRESHOLD = 12; // 12px threshold: normal clicks will NEVER trigger dragging!



    const onPointerDown = (e) => {

      if (e.button !== 0) return; // Left click only for dragging

      if (e.target.closest('.xp-icon-rename-input')) return; // Allow typing in rename input



      activePointerId = e.pointerId !== undefined ? e.pointerId : null;

      startX = e.clientX;

      startY = e.clientY;



      origLeft = parseFloat(btn.style.left);

      origTop = parseFloat(btn.style.top);

      if (isNaN(origLeft)) origLeft = btn.offsetLeft || 20;

      if (isNaN(origTop)) origTop = btn.offsetTop || 20;



      grabOffsetX = startX - origLeft;

      grabOffsetY = startY - origTop;



      isDragging = false;

      isOverBin = false;



      // Select this icon

      document.querySelectorAll('.desktop-icon-draggable').forEach(b => b.classList.remove('selected'));

      btn.classList.add('selected');



      const onPointerMove = (ev) => {

        const dx = ev.clientX - startX;

        const dy = ev.clientY - startY;



        // ONLY enter dragging mode if movement strictly exceeds threshold

        if (!isDragging && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {

          isDragging = true;

          // Capture pointer once dragging has actually started

          if (activePointerId !== null && btn.setPointerCapture) {

            try { btn.setPointerCapture(activePointerId); } catch (err) {}

          }

          btn.classList.add('xp-icon-drag-source');



          // Create floating drag ghost / shadow preview that follows cursor

          if (!dragGhost) {

            dragGhost = document.createElement('div');

            dragGhost.className = 'xp-icon-drag-ghost';

            dragGhost.innerHTML = `

              <img src="${appInfo.icon}" alt="${escapeHtml(appInfo.name)}" />

              <p>${escapeHtml(appInfo.name)}</p>

            `;

            document.body.appendChild(dragGhost);

          }



          // Create snap guide outline on the desktop grid

          if (!snapIndicator) {

            snapIndicator = document.createElement('div');

            snapIndicator.className = 'xp-grid-snap-indicator';

            const desktopContainer = document.querySelector('section.absolute.top-0.left-0') || document.body;

            desktopContainer.appendChild(snapIndicator);

          }

        }



        if (isDragging && dragGhost) {

          ev.preventDefault();

          // Ghost follows cursor exactly

          dragGhost.style.left = `${ev.clientX}px`;

          dragGhost.style.top = `${ev.clientY}px`;



          // Check hover over Recycle Bin icon
          const binBtn = findRecycleBinButton();
          if (binBtn && binBtn !== btn) {
            const binRect = binBtn.getBoundingClientRect();
            if (ev.clientX >= binRect.left && ev.clientX <= binRect.right &&
                ev.clientY >= binRect.top && ev.clientY <= binRect.bottom) {
              isOverBin = true;
              binBtn.classList.add('recycle-bin-drop-hover');
              if (snapIndicator) snapIndicator.style.display = 'none';
            } else {
              isOverBin = false;
              binBtn.classList.remove('recycle-bin-drop-hover');
              if (snapIndicator) snapIndicator.style.display = 'block';
            }
          }

          // Update snap indicator box using accurate grab offset
          if (snapIndicator && !isOverBin) {
            const curLeft = ev.clientX - grabOffsetX;
            const curTop = ev.clientY - grabOffsetY;
            const slot = coordToGrid(curLeft, curTop);
            snapIndicator.style.left = `${slot.x}px`;
            snapIndicator.style.top = `${slot.y}px`;
            snapIndicator.style.display = 'block';
          }
        }
      };

      const cleanupDrag = () => {
        const bBtn = findRecycleBinButton();
        if (bBtn) bBtn.classList.remove('recycle-bin-drop-hover');

        if (activePointerId !== null && btn.releasePointerCapture) {
          try { btn.releasePointerCapture(activePointerId); } catch (err) {}
        }

        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerCancel);
        btn.removeEventListener('pointermove', onPointerMove);
        btn.removeEventListener('pointerup', onPointerUp);
        btn.removeEventListener('pointercancel', onPointerCancel);

        document.removeEventListener('mousemove', onPointerMove);
        document.removeEventListener('mouseup', onPointerUp);

        // Remove ghost and snap outline
        if (dragGhost) {
          try { dragGhost.remove(); } catch (e) {}
          dragGhost = null;
        }
        if (snapIndicator) {
          try { snapIndicator.remove(); } catch (e) {}
          snapIndicator = null;
        }

        btn.classList.remove('xp-icon-drag-source');
        btn.style.opacity = '1';
        btn.style.display = 'flex';
        btn.style.visibility = 'visible';
        btn.style.transform = 'none';
        btn.style.transition = 'none';
      };

      const onPointerCancel = () => {
        cleanupDrag();
        btn.style.left = `${origLeft}px`;
        btn.style.top = `${origTop}px`;
        isDragging = false;
      };

      const onPointerUp = (ev) => {
        cleanupDrag();

        const bBtn = findRecycleBinButton();
        if (bBtn) bBtn.classList.remove('recycle-bin-drop-hover');

        if (isDragging) {
          if (isOverBin && appInfo && appInfo.id !== 'recyclebin') {
            isOverBin = false;
            btn.style.left = `${origLeft}px`;
            btn.style.top = `${origTop}px`;
            showConfirmDeleteDialog(appInfo.name, () => {
              moveAppToRecycleBin(appInfo.id, appInfo.name, appInfo.icon, btn);
            });
            btn.dataset.justDragged = 'true';
            setTimeout(() => delete btn.dataset.justDragged, 300);
            return;
          }
          isOverBin = false;
          const totalMoved = Math.hypot(ev.clientX - startX, ev.clientY - startY);
          const curLeft = ev.clientX - grabOffsetX;
          const curTop = ev.clientY - grabOffsetY;
          const slot = coordToGrid(curLeft, curTop);
          const targetX = slot.x;
          const targetY = slot.y;

          // If dropped back in the same slot or tiny drag jitter, keep exact orig position
          if (totalMoved < DRAG_THRESHOLD || (targetX === origLeft && targetY === origTop)) {
            btn.style.left = `${origLeft}px`;
            btn.style.top = `${origTop}px`;
          } else {
            // Check if another desktop icon is already parked in that slot
            const allIcons = Array.from(document.querySelectorAll('section.absolute.top-0.left-0 button, button.desktop-icon-draggable'));
            const occupiedBtn = allIcons.find(b => {
              if (b === btn || b.classList.contains('xp-app-deleted')) return false;
              let bx = parseFloat(b.style.left);
              let by = parseFloat(b.style.top);
              if (isNaN(bx) || isNaN(by)) {
                bx = b.offsetLeft || 0;
                by = b.offsetTop || 0;
              }
              return Math.abs(bx - targetX) < 25 && Math.abs(by - targetY) < 25;
            });

            if (occupiedBtn) {
              // Swap with occupied icon so NO overlap or collision ever occurs
              occupiedBtn.style.left = `${origLeft}px`;
              occupiedBtn.style.top = `${origTop}px`;
              occupiedBtn.style.display = 'flex';
              occupiedBtn.style.visibility = 'visible';
              occupiedBtn.style.opacity = '1';
              const occupiedInfo = resolveAppFromButton(occupiedBtn);
              if (occupiedInfo) saveAppPosition(occupiedInfo.id, origLeft, origTop);
            }

            btn.style.left = `${targetX}px`;
            btn.style.top = `${targetY}px`;
            btn.style.display = 'flex';
            btn.style.visibility = 'visible';
            btn.style.opacity = '1';
            saveAppPosition(appInfo.id, targetX, targetY);
            SoundManager.playClick();
          }

          // Suppress click so opening window is avoided only if genuinely dragged
          btn.dataset.justDragged = 'true';
          setTimeout(() => delete btn.dataset.justDragged, 300);
        }
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      document.addEventListener('pointercancel', onPointerCancel);
      btn.addEventListener('pointermove', onPointerMove);
      btn.addEventListener('pointerup', onPointerUp);
      btn.addEventListener('pointercancel', onPointerCancel);

      if (!('PointerEvent' in window)) {
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mouseup', onPointerUp);
      }
    };

    if ('PointerEvent' in window) {

      btn.addEventListener('pointerdown', onPointerDown);

    } else {

      btn.addEventListener('mousedown', onPointerDown);

    }



        // Bulletproof click handler: Open application immediately on click (if not dragged)
    btn.addEventListener('click', (e) => {
      if (btn.dataset.justDragged) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }
      if (e.target.closest('.xp-icon-rename-input')) return;

      btn.classList.add('desktop-icon-draggable');
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
      btn.style.display = 'flex';

      SoundManager.playClick();
      if (appInfo && appInfo.isCustomShortcut && appInfo.targetId) {
        if (window.__openWindow) window.__openWindow(appInfo.targetId);
      } else if (appInfo && appInfo.id) {
        if (window.__openWindow) window.__openWindow(appInfo.id);
      }
    });

    // Also support double-click
    btn.addEventListener('dblclick', (e) => {
      if (e.target.closest('.xp-icon-rename-input')) return;
      btn.classList.add('desktop-icon-draggable');
      btn.style.opacity = '1';
      btn.style.visibility = 'visible';
      btn.style.display = 'flex';
      if (appInfo && appInfo.isCustomShortcut && appInfo.targetId) {
        if (window.__openWindow) window.__openWindow(appInfo.targetId);
      } else if (appInfo && appInfo.id) {
        if (window.__openWindow) window.__openWindow(appInfo.id);
      }
    });

    // Keyboard support: Enter key opens app, Delete key moves to Recycle Bin
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (appInfo && appInfo.isCustomShortcut && appInfo.targetId) {
          if (window.__openWindow) window.__openWindow(appInfo.targetId);
        } else if (appInfo && appInfo.id) {
          if (window.__openWindow) window.__openWindow(appInfo.id);
        }
      } else if (e.key === 'Delete' || e.key === 'Del') {
        if (appInfo && appInfo.id !== 'recyclebin') {
          showConfirmDeleteDialog(appInfo.name, () => {
            moveAppToRecycleBin(appInfo.id, appInfo.name, appInfo.icon, btn);
          });
        }
      }
    });



    // DIRECT APP RIGHT-CLICK CONTEXT MENU (Intercepts instantly and stops bubbling)

    btn.addEventListener('contextmenu', (e) => {

      e.preventDefault();

      e.stopPropagation();

      e.stopImmediatePropagation();

      showAppContextMenu(e, btn, appInfo);

    });

  }



  // --------------------------------------------------------------------------
  function showXpNotification(title, message) {
    try {
      let toast = document.getElementById('xp-system-balloon-toast');
      if (toast) toast.remove();

      toast = document.createElement('div');
      toast.id = 'xp-system-balloon-toast';
      toast.className = 'xp-balloon-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '36px';
      toast.style.right = '12px';
      toast.style.zIndex = '999999';
      toast.style.maxWidth = '280px';
      toast.style.background = '#ffffe1';
      toast.style.border = '1px solid #000';
      toast.style.borderRadius = '5px';
      toast.style.padding = '8px 12px';
      toast.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.4)';
      toast.style.fontFamily = 'Tahoma, Arial, sans-serif';
      toast.style.fontSize = '11px';
      toast.style.color = '#000';
      toast.style.lineHeight = '1.3';
      toast.style.cursor = 'pointer';

      toast.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-weight:bold; color:#0055ea;">
          <span>${escapeHtml(title || 'Information')}</span>
          <span style="font-size:10px; color:#888; cursor:pointer;" id="xp-toast-close">✕</span>
        </div>
        <div>${escapeHtml(message || '')}</div>
      `;

      document.body.appendChild(toast);

      toast.onclick = () => toast.remove();
      const closeBtn = toast.querySelector('#xp-toast-close');
      if (closeBtn) closeBtn.onclick = (e) => { e.stopPropagation(); toast.remove(); };

      setTimeout(() => {
        if (toast && toast.parentElement) {
          toast.remove();
        }
      }, 4000);
    } catch(e) {}
  }

  // RECYCLE BIN ENGINE (Drop, Delete, Restore, Empty)
  // --------------------------------------------------------------------------
  const CANONICAL_APP_NAMES = {
    'myProjects': 'My Projects',
    'terminal': 'My Terminal',
    'pictures': 'Gallery',
    'contact': 'Contact me',
    'settings': 'Settings',
    'myCV': 'My CV',
    'recyclebin': 'Recycle Bin',
    'music': 'My Musics',
    'paint': 'Paint',
    'minesweeper': 'Minesweeper',
    'pinball': '3D Pinball',
    'notepad': 'Notepad',
    'stickynotes': 'Sticky Notes',
    'doom': 'Doom',
    'services': 'Services'
  };

  const CANONICAL_APP_ICONS = {
    'myProjects': '/img/icons/projects/projects-icon-lg.webp',
    'terminal': '/img/icons/terminal/terminal-icon-lg.webp',
    'pictures': '/img/icons/pictures/gallery-icon-lg.svg',
    'contact': '/img/icons/contact/contact-icon-lg.webp',
    'settings': '/img/icons/settings/settings-icon-lg.webp',
    'myCV': '/img/icons/cv/cv-icon-lg.webp',
    'recyclebin': '/img/icons/recycle-bin-empty.svg',
    'music': '/img/icons/music/music-icon-lg.webp',
    'paint': '/img/icons/paint.svg',
    'minesweeper': '/img/icons/minesweeper/minesweeper-icon-lg.webp',
    'pinball': '/img/icons/pinball.png',
    'notepad': '/img/icons/notepad/notepad-icon-lg.webp',
    'stickynotes': '/img/icons/notes/sticky-note.png',
    'doom': '/img/icons/doom.webp',
    'services': '/img/icons/services/services-icon-lg.webp'
  };

  function moveAppToRecycleBin(appId, appName, iconSrc, targetBtn = null) {
    if (appId === 'recyclebin') return;
    SoundManager.playRecycle();

    const btn = targetBtn || document.querySelector(`button[data-app-id="${appId}"]`) ||
      Array.from(document.querySelectorAll('section.absolute.top-0.left-0 button')).find(b => {
        const a = resolveAppFromButton(b);
        return a && a.id === appId;
      });

    if (btn) {
      btn.style.transition = 'transform 0.22s ease-in, opacity 0.22s ease-in';
      btn.style.transform = 'scale(0.05)';
      btn.style.opacity = '0';
      setTimeout(() => {
        btn.classList.add('xp-app-deleted');
        btn.style.display = 'none';
        btn.style.transition = '';
        btn.style.transform = '';
        btn.style.opacity = '1';
      }, 220);
    }

    const resolvedName = appName || CANONICAL_APP_NAMES[appId] || appId;
    const resolvedIcon = iconSrc || CANONICAL_APP_ICONS[appId] || (btn && btn.querySelector('img') ? btn.querySelector('img').src : '/img/icons/notepad/notepad-icon-lg.webp');
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const isCustom = btn ? (btn.dataset.isCustomShortcut === 'true') : false;
    let customData = null;
    if (isCustom) {
      const customList = getCustomShortcuts();
      customData = customList.find(c => c.id === appId);
      const filtered = customList.filter(c => c.id !== appId);
      saveCustomShortcuts(filtered);
    }

    const newItem = {
      id: 'del_' + appId,
      appId: appId,
      name: resolvedName.endsWith('.lnk') ? resolvedName : (resolvedName + " - Shortcut.lnk"),
      displayName: resolvedName,
      location: "C:\\Documents and Settings\\Vedant\\Desktop",
      date: dateStr,
      size: "2 KB",
      type: "Shortcut",
      previewKey: "shortcut",
      iconSrc: resolvedIcon,
      isRestorableApp: true,
      isCustom: isCustom,
      customData: customData
    };

    const deletedList = getDeletedApps().filter(d => d.appId !== appId);
    deletedList.unshift(newItem);
    saveDeletedApps(deletedList);
    recycleBinItems = deletedList;

    updateDesktopRecycleBinIcon(true);
    showXpNotification("Recycle Bin", `'${resolvedName}' was moved to the Recycle Bin.`);

    if (window.__refreshRecycleBinTable) {
      window.__refreshRecycleBinTable();
    }
  }

  function restoreSpecificApp(appId) {
    SoundManager.playClick();
    const deletedList = getDeletedApps();
    const item = deletedList.find(d => d.appId === appId) || recycleBinItems.find(i => i.appId === appId);
    const remaining = deletedList.filter(d => d.appId !== appId);
    saveDeletedApps(remaining);
    recycleBinItems = remaining;

    if (item && item.isCustom && item.customData) {
      const customList = getCustomShortcuts();
      if (!customList.some(c => c.id === item.customData.id)) {
        customList.push(item.customData);
        saveCustomShortcuts(customList);
        spawnCustomShortcutElement(item.customData);
      }
    } else {
      const btn = document.querySelector(`button[data-app-id="${appId}"]`) ||
        Array.from(document.querySelectorAll('section.absolute.top-0.left-0 button')).find(b => {
          const a = resolveAppFromButton(b);
          return a && a.id === appId;
        });

      if (btn) {
        btn.classList.remove('xp-app-deleted');
        btn.style.display = 'flex';
        btn.style.visibility = 'visible';
        btn.style.transform = 'scale(1)';
        btn.style.opacity = '1';
      }
    }

    updateDesktopRecycleBinIcon(remaining.length > 0);

    const appName = item ? (item.displayName || item.name) : 'Item';
    showXpNotification("Recycle Bin", `Restored '${appName}' to Desktop.`);

    if (window.__refreshRecycleBinTable) {
      window.__refreshRecycleBinTable();
    }
  }

  function restoreAllRecycleBinItems() {
    SoundManager.playClick();
    const deletedList = getDeletedApps();
    deletedList.forEach(item => {
      if (item.isCustom && item.customData) {
        const customList = getCustomShortcuts();
        if (!customList.some(c => c.id === item.customData.id)) {
          customList.push(item.customData);
          saveCustomShortcuts(customList);
          spawnCustomShortcutElement(item.customData);
        }
      } else {
        const btn = document.querySelector(`button[data-app-id="${item.appId}"]`) ||
          Array.from(document.querySelectorAll('section.absolute.top-0.left-0 button')).find(b => {
            const a = resolveAppFromButton(b);
            return a && a.id === item.appId;
          });

        if (btn) {
          btn.classList.remove('xp-app-deleted');
          btn.style.display = 'flex';
          btn.style.visibility = 'visible';
          btn.style.transform = 'scale(1)';
          btn.style.opacity = '1';
        }
      }
    });

    saveDeletedApps([]);
    recycleBinItems = [];
    updateDesktopRecycleBinIcon(false);
    showXpNotification("Recycle Bin", "All desktop shortcuts have been restored.");

    if (window.__refreshRecycleBinTable) {
      window.__refreshRecycleBinTable();
    }
  }

  function emptyTheRecycleBin() {
    const list = getDeletedApps();
    if (list.length === 0 && recycleBinItems.length === 0) {
      alert("The Recycle Bin is already empty.");
      return;
    }
    const count = list.length || recycleBinItems.length;
    if (confirm("Are you sure you want to permanently delete all " + count + " items?")) {
      SoundManager.playRecycle();
      recycleBinItems = [];
      saveDeletedApps([]);
      updateDesktopRecycleBinIcon(false);
      showXpNotification("Recycle Bin", "Recycle Bin has been emptied.");
      if (window.__refreshRecycleBinTable) {
        window.__refreshRecycleBinTable();
      }
    }
  }

  function permanentlyDeleteItem(idOrAppId) {
    const list = getDeletedApps();
    const item = list.find(i => String(i.id) === String(idOrAppId) || String(i.appId) === String(idOrAppId));
    const name = item ? (item.displayName || item.name) : 'this item';
    if (confirm("Are you sure you want to permanently delete '" + name + "'?")) {
      SoundManager.playRecycle();
      const remaining = list.filter(i => String(i.id) !== String(idOrAppId) && String(i.appId) !== String(idOrAppId));
      saveDeletedApps(remaining);
      recycleBinItems = remaining;
      updateDesktopRecycleBinIcon(remaining.length > 0);
      showXpNotification("Recycle Bin", `'${name}' was permanently deleted.`);
      if (window.__refreshRecycleBinTable) {
        window.__refreshRecycleBinTable();
      }
    }
  }

  window.moveAppToRecycleBin = moveAppToRecycleBin;
  window.updateDesktopRecycleBinIcon = updateDesktopRecycleBinIcon;
  window.restoreAppToDesktop = restoreSpecificApp;
  window.restoreSpecificApp = restoreSpecificApp;
  window.restoreAllRecycleBinItems = restoreAllRecycleBinItems;
  window.emptyTheRecycleBin = emptyTheRecycleBin;
  window.permanentlyDeleteItem = permanentlyDeleteItem;

  // --------------------------------------------------------------------------

  // CREATE SHORTCUTS, COMPRESSED FOLDERS & NEW FILES

  // --------------------------------------------------------------------------

  function createDesktopShortcut(appInfo, atX = null, atY = null) {

    SoundManager.playClick();

    const customList = getCustomShortcuts();

    const newId = 'shortcut_' + appInfo.id + '_' + Date.now();

    const shortcutName = `Shortcut to ${appInfo.name}`;



    const rawX = atX !== null ? atX : (lastDesktopClickX || 190);

    const rawY = atY !== null ? atY : (lastDesktopClickY || 120);

    const slot = coordToGrid(rawX, rawY);



    const newItem = {

      id: newId,

      targetId: appInfo.id,

      name: shortcutName,

      type: 'Shortcut',

      icon: appInfo.icon,

      x: slot.x,

      y: slot.y

    };



    customList.push(newItem);

    saveCustomShortcuts(customList);

    spawnCustomShortcutElement(newItem);

    showXpNotification("Desktop", `Created shortcut for '${appInfo.name}'.`);

  }



  function createZipArchive(appInfo) {

    SoundManager.playClick();

    showXpNotification("Compressed (zipped) Folder", `Compressing '${appInfo.name}'...`);

    setTimeout(() => {

      const customList = getCustomShortcuts();

      const newId = 'zip_' + appInfo.id + '_' + Date.now();

      const slot = coordToGrid(lastDesktopClickX || 190, lastDesktopClickY || 120);

      const newItem = {

        id: newId,

        targetId: 'zip_archive',

        name: `${appInfo.name}.zip`,

        type: 'Compressed (zipped) Folder',

        icon: '/img/icons/cv/cv-icon-sm.webp',

        x: slot.x,

        y: slot.y,

        isZip: true

      };

      customList.push(newItem);

      saveCustomShortcuts(customList);

      spawnCustomShortcutElement(newItem);

      SoundManager.playDing();

      showXpNotification("Compression Complete", `Created '${appInfo.name}.zip' on Desktop.`);

    }, 800);

  }



  function createNewFileOnDesktop(type, atX = null, atY = null) {

    SoundManager.playClick();

    const customList = getCustomShortcuts();

    const timestamp = Date.now();

    let name = "New Folder";

    let icon = "/img/icons/projects/projects-icon-lg.webp";

    let target = "myProjects";



    if (type === 'txt') {

      name = "New Text Document.txt";

      icon = "/img/icons/notepad/notepad-icon-lg.webp";

      target = "notepad";

    } else if (type === 'bmp') {

      name = "New Bitmap Image.bmp";

      icon = "/img/icons/paint.svg";

      target = "paint";

    }



    const rawX = atX !== null ? atX : (lastDesktopClickX || 190);

    const rawY = atY !== null ? atY : (lastDesktopClickY || 120);

    const slot = coordToGrid(rawX, rawY);



    const newItem = {

      id: 'custom_' + type + '_' + timestamp,

      targetId: target,

      name: name,

      type: type === 'folder' ? 'File Folder' : 'Document',

      icon: icon,

      x: slot.x,

      y: slot.y

    };



    customList.push(newItem);

    saveCustomShortcuts(customList);

    spawnCustomShortcutElement(newItem);

    showXpNotification("New Item", `Created '${name}' on Desktop.`);

  }



  function spawnCustomShortcutElement(item) {

    const grid = document.querySelector('section.absolute.top-0.left-0 > div') || document.querySelector('section.absolute.top-0.left-0');

    if (!grid) return;



    const btn = document.createElement('button');

    btn.className = 'flex flex-col gap-2 items-center w-full cursor-pointer desktop-icon-draggable';

    btn.dataset.appId = item.id;

    btn.dataset.isCustomShortcut = 'true';

    btn.dataset.targetId = item.targetId || '';

    btn.dataset.appName = item.name;

    btn.style.left = `${item.x}px`;

    btn.style.top = `${item.y}px`;

    btn.style.position = 'absolute';

    btn.style.opacity = '1';



    btn.innerHTML = `

      <div style="position:relative;">

        <img class="w-11 h-11" src="${item.icon}" alt="${escapeHtml(item.name)}" draggable="false" style="pointer-events:none; user-select:none;" />

        <span style="position:absolute; bottom:-2px; left:-2px; font-size:10px; background:#fff; border:1px solid #777; border-radius:2px; line-height:10px; padding:0 1px;">↗</span>

      </div>

      <p class="text-white text-xs font-normal py-px px-1" style="text-shadow:0px 1px 1px #000, 0px 0px 4px #000; pointer-events:none; user-select:none;">${escapeHtml(item.name)}</p>

    `;



    grid.appendChild(btn);



    // Double click to open target

    btn.addEventListener('dblclick', () => {

      if (item.targetId && window.__openWindow) {

        window.__openWindow(item.targetId);

      } else {

        alert(`Opening ${item.name}`);

      }

    });



    const appInfo = resolveAppFromButton(btn);

    attachIconDrag(btn, appInfo);

  }



  // --------------------------------------------------------------------------

  // INLINE RENAME ENGINE

  // --------------------------------------------------------------------------

  function inlineRenameApp(btn, appInfo) {

    const label = btn.querySelector('p');

    if (!label) return;



    const oldName = label.textContent.trim();

    const input = document.createElement('input');

    input.type = 'text';

    input.value = oldName;

    input.className = 'xp-icon-rename-input';



    label.style.display = 'none';

    btn.appendChild(input);

    input.focus();

    input.select();



    let committed = false;

    const commit = () => {

      if (committed) return;

      committed = true;

      const newName = input.value.trim() || oldName;

      label.textContent = newName;

      label.style.display = '';

      input.remove();



      if (newName !== oldName) {

        localStorage.setItem('xp_app_name_' + appInfo.id, newName);

        appInfo.name = newName;

        SoundManager.playClick();

      }

    };



    input.addEventListener('keydown', (ev) => {

      if (ev.key === 'Enter') {

        commit();

      } else if (ev.key === 'Escape') {

        committed = true;

        label.style.display = '';

        input.remove();

      }

    });



    input.addEventListener('blur', commit);

  }



  // --------------------------------------------------------------------------

  // CONFIRM FILE DELETE DIALOG

  // --------------------------------------------------------------------------

  function showConfirmDeleteDialog(appName, onConfirm) {

    if (SoundManager.playChord) SoundManager.playChord();

    else if (SoundManager.playDing) SoundManager.playDing();



    let overlay = document.getElementById('xp-confirm-delete-dialog');

    if (overlay) overlay.remove();



    overlay = document.createElement('div');

    overlay.id = 'xp-confirm-delete-dialog';

    overlay.className = 'xp-dialog-overlay';



    overlay.innerHTML = `

      <div class="xp-dialog-box" role="dialog" aria-modal="true">

        <div class="xp-dialog-header">

          <span class="xp-dialog-title">Confirm File Delete</span>

          <button class="xp-dialog-close-btn" id="dlg-btn-x">✕</button>

        </div>

        <div class="xp-dialog-body" style="display:flex; align-items:center; gap:16px;">

          <img src="/img/icons/recycle-bin-empty.svg" style="width:36px; height:36px; flex-shrink:0;" />

          <div style="font-size:12px; color:#000; line-height:1.4;">

            Are you sure you want to send '<strong>${escapeHtml(appName)}</strong>' to the Recycle Bin?

          </div>

        </div>

        <div class="xp-dialog-footer">

          <button class="xp-btn xp-btn-primary" id="dlg-btn-yes">Yes</button>

          <button class="xp-btn" id="dlg-btn-no">No</button>

        </div>

      </div>

    `;



    document.body.appendChild(overlay);



    const closeDlg = () => {

      SoundManager.playClick();

      overlay.remove();

    };



    overlay.querySelector('#dlg-btn-yes').addEventListener('click', () => {

      overlay.remove();

      if (onConfirm) onConfirm();

    });



    overlay.querySelector('#dlg-btn-no').addEventListener('click', closeDlg);

    overlay.querySelector('#dlg-btn-x').addEventListener('click', closeDlg);

    overlay.addEventListener('click', (e) => {

      if (e.target === overlay) closeDlg();

    });

  }



  // --------------------------------------------------------------------------

  // AUTHENTIC PROPERTIES MODAL

  // --------------------------------------------------------------------------

  function showAppPropertiesModal(appInfo) {

    SoundManager.playClick();



    let modal = document.getElementById('xp-app-props-modal');

    if (modal) modal.remove();



    modal = document.createElement('div');

    modal.id = 'xp-app-props-modal';

    modal.className = 'xp-prop-modal';



    const isBin = appInfo.id === 'recyclebin';

    const now = new Date();

    const createdDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });



    modal.innerHTML = `

      <div class="xp-dialog-header" style="cursor:move;" id="prop-drag-header">

        <span class="xp-dialog-title">${escapeHtml(appInfo.name)} Properties</span>

        <button class="xp-dialog-close-btn" id="prop-btn-close">✕</button>

      </div>



      <div class="xp-prop-tabs">

        <div class="xp-prop-tab active" data-tab="general">General</div>

        <div class="xp-prop-tab" data-tab="shortcut">${isBin ? 'Global' : 'Shortcut'}</div>

      </div>



      <div class="xp-prop-content">

        <div class="xp-prop-row" style="margin-bottom:12px;">

          <img src="${appInfo.icon}" style="width:32px; height:32px; margin-right:12px;" />

          <input type="text" value="${escapeHtml(appInfo.name)}" style="flex:1; border:1px solid #7f9db9; padding:2px 4px; font-size:11px;" readonly />

        </div>



        <div class="xp-prop-divider"></div>



        <div class="xp-prop-row">

          <span class="xp-prop-label">Type of file:</span>

          <span>${escapeHtml(appInfo.type || 'Application')}</span>

        </div>

        <div class="xp-prop-row">

          <span class="xp-prop-label">Description:</span>

          <span>Windows XP Portfolio Feature</span>

        </div>



        <div class="xp-prop-divider"></div>



        <div class="xp-prop-row">

          <span class="xp-prop-label">Location:</span>

          <span>C:\\Documents and Settings\\Vedant\\Desktop</span>

        </div>

        <div class="xp-prop-row">

          <span class="xp-prop-label">Size:</span>

          <span>${appInfo.size || '1.4 MB'}</span>

        </div>

        <div class="xp-prop-row">

          <span class="xp-prop-label">Size on disk:</span>

          <span>${appInfo.size || '1.4 MB'}</span>

        </div>



        <div class="xp-prop-divider"></div>



        <div class="xp-prop-row">

          <span class="xp-prop-label">Created:</span>

          <span>${createdDate}</span>

        </div>



        <div class="xp-prop-divider"></div>



        <div class="xp-prop-row" style="align-items:center;">

          <span class="xp-prop-label">Attributes:</span>

          <label style="margin-right:12px; font-size:11px;"><input type="checkbox" checked disabled /> Read-only</label>

          <label style="font-size:11px;"><input type="checkbox" disabled /> Hidden</label>

        </div>

      </div>



      <div class="xp-prop-footer">

        <button class="xp-btn xp-btn-primary" id="prop-btn-ok">OK</button>

        <button class="xp-btn" id="prop-btn-cancel">Cancel</button>

        <button class="xp-btn" id="prop-btn-apply" disabled>Apply</button>

      </div>

    `;



    document.body.appendChild(modal);



    const closeModal = () => {

      SoundManager.playClick();

      modal.remove();

    };



    modal.querySelector('#prop-btn-ok').addEventListener('click', closeModal);

    modal.querySelector('#prop-btn-cancel').addEventListener('click', closeModal);

    modal.querySelector('#prop-btn-close').addEventListener('click', closeModal);



    const header = modal.querySelector('#prop-drag-header');

    header.addEventListener('pointerdown', (e) => {

      if (e.target.closest('#prop-btn-close')) return;

      let ox = e.clientX - modal.offsetLeft;

      let oy = e.clientY - modal.offsetTop;

      const onMove = (ev) => {

        modal.style.left = `${ev.clientX - ox + modal.offsetWidth / 2}px`;

        modal.style.top = `${ev.clientY - oy + modal.offsetHeight / 2}px`;

      };

      const onUp = () => {

        document.removeEventListener('pointermove', onMove);

        document.removeEventListener('pointerup', onUp);

      };

      document.addEventListener('pointermove', onMove);

      document.addEventListener('pointerup', onUp);

    });

  }



  // --------------------------------------------------------------------------

  // PIN TO START MENU & TASKBAR QUICK LAUNCH TOOLBAR

  // --------------------------------------------------------------------------

    // --------------------------------------------------------------------------
  // Windows XP Run Dialog (Start -> Run / Win+R / Alt+R)
  // --------------------------------------------------------------------------
  function showRunDialog(prefill = '') {
    const existing = document.getElementById('xp-run-dialog');
    if (existing) {
      const input = existing.querySelector('#xp-run-input');
      if (input) { input.focus(); input.select(); }
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'xp-run-dialog';
    overlay.className = 'xp-run-dialog-wrapper';

    overlay.innerHTML = `
      <div class="xp-run-modal">
        <div class="xp-run-header">
          <div class="xp-run-title">
            <img src="/img/icons/cmd-icon-sm.webp" alt="Run" />
            <span>Run</span>
          </div>
          <button class="xp-run-close" id="xp-run-btn-close" title="Close">✕</button>
        </div>
        <div class="xp-run-body">
          <div class="xp-run-desc-row">
            <img src="/img/icons/cmd-icon-sm.webp" class="xp-run-icon-large" alt="Run" />
            <p class="xp-run-desc">Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
          </div>
          <div class="xp-run-input-row">
            <label for="xp-run-input" class="xp-run-label"><u>O</u>pen:</label>
            <input type="text" id="xp-run-input" class="xp-run-input" value="${escapeHtml(prefill)}" placeholder="e.g. matrix, cmd, paint, notepad" autofocus autocomplete="off" />
          </div>
        </div>
        <div class="xp-run-footer">
          <button class="xp-run-btn xp-run-btn-primary" id="xp-run-btn-ok">OK</button>
          <button class="xp-run-btn" id="xp-run-btn-cancel">Cancel</button>
          <button class="xp-run-btn" id="xp-run-btn-browse">Browse...</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    const input = overlay.querySelector('#xp-run-input');
    if (input) {
      input.focus();
      input.select();
    }

    function executeRun() {
      const cmdVal = (input ? input.value : '').trim();
      if (!cmdVal) {
        closeRun();
        return;
      }
      closeRun();
      SoundManager.playClick();
      const lower = cmdVal.toLowerCase();

      if (lower === 'matrix' || lower === 'matrix run' || lower === 'run matrix' || lower === 'matrix.exe') {
        triggerMatrixMode();
        return;
      }
      if (lower === 'cmd' || lower === 'terminal' || lower === 'command') {
        if (window.__openWindow) window.__openWindow('terminal');
        return;
      }
      if (lower === 'gallery' || lower === 'pictures' || lower === 'photos' || lower === 'images') {
        if (window.__openWindow) window.__openWindow('pictures');
        return;
      }
      if (lower === 'paint' || lower === 'mspaint') {
        if (window.__openWindow) window.__openWindow('paint');
        return;
      }
      if (lower === 'pinball') {
        if (window.__openWindow) window.__openWindow('pinball');
        return;
      }
      if (lower === 'doom') {
        if (window.__openWindow) window.__openWindow('doom');
        return;
      }
      if (lower === 'notepad') {
        if (window.__openWindow) window.__openWindow('notepad');
        return;
      }
      if (lower === 'clippy' || lower === 'clappy' || lower === 'ai' || lower === 'clippy.exe') {
        if (typeof window.openClippyAssistant === 'function') window.openClippyAssistant();
        return;
      }
      if (lower === 'calc' || lower === 'calendar') {
        if (window.__openWindow) window.__openWindow('calendar');
        return;
      }
      if (lower === 'settings' || lower === 'control') {
        if (window.__openWindow) window.__openWindow('settings');
        return;
      }
      if (lower === 'cv' || lower === 'resume') {
        if (window.__openWindow) window.__openWindow('myCV');
        return;
      }
      if (lower === 'projects') {
        if (window.__openWindow) window.__openWindow('myProjects');
        return;
      }
      if (lower === 'contact' || lower === 'mail') {
        if (window.__openWindow) window.__openWindow('contact');
        return;
      }
      if (lower === 'music') {
        if (window.__openWindow) window.__openWindow('music');
        return;
      }
      if (lower === 'recycle' || lower === 'trash') {
        if (window.__openWindow) window.__openWindow('recyclebin');
        return;
      }

      // Terminal fallback
      if (window.__customTerminalDispatcher) {
        window.__customTerminalDispatcher(cmdVal);
        if (window.__openWindow) window.__openWindow('terminal');
      } else {
        SoundManager.playDing();
        alert("Windows cannot find '" + cmdVal + "'. Make sure you typed the name correctly, and then try again.");
      }
    }

    function closeRun() {
      overlay.remove();
    }

    overlay.querySelector('#xp-run-btn-ok').addEventListener('click', executeRun);
    overlay.querySelector('#xp-run-btn-cancel').addEventListener('click', closeRun);
    overlay.querySelector('#xp-run-btn-close').addEventListener('click', closeRun);
    overlay.querySelector('#xp-run-btn-browse').addEventListener('click', () => {
      if (window.__openWindow) window.__openWindow('myProjects');
      closeRun();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeRun();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeRun();
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeRun();
    });
  }
  window.showRunDialog = showRunDialog;

  // Context menu for Quick Launch Toolbar & Pinned Start Apps
  function showQuickLaunchContextMenu(x, y, appId, info) {
    const existing = document.getElementById('xp-app-context-menu') || document.getElementById('xp-desktop-context-menu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'xp-app-context-menu';
    menu.className = 'xp-context-menu';

    menu.innerHTML = `
      <div class="xp-menu-item" data-action="open_app">
        <span class="xp-menu-icon">📂</span>
        <span class="xp-menu-text"><strong>Open ${escapeHtml(info.name)}</strong></span>
      </div>
      <div class="xp-menu-separator"></div>
      <div class="xp-menu-item" data-action="unpin_app">
        <span class="xp-menu-icon">📌</span>
        <span class="xp-menu-text">Unpin from Taskbar</span>
      </div>
    `;

    document.body.appendChild(menu);

    const menuW = 190;
    const menuH = 75;
    const posX = Math.min(x, window.innerWidth - menuW - 10);
    const posY = Math.max(10, y - menuH - 5);

    menu.style.left = posX + 'px';
    menu.style.top = posY + 'px';

    menu.addEventListener('click', (e) => {
      const item = e.target.closest('.xp-menu-item');
      if (!item) return;
      const act = item.dataset.action;
      menu.remove();

      if (act === 'open_app') {
        SoundManager.playClick();
        if (window.__openWindow) window.__openWindow(appId);
      } else if (act === 'unpin_app') {
        const list = getPinnedStartApps().filter(id => id !== appId);
        savePinnedStartApps(list);
        renderPinnedStartApps();
        renderQuickLaunchToolbar();
        SoundManager.playDing();
        showXpNotification("Taskbar", "'" + info.name + "' was unpinned from the Taskbar.");
      }
    });

    const closeHandler = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 50);
  }

  function renderQuickLaunchToolbar() {

    const startBtn = document.querySelector('.start-button');

    if (!startBtn) return;

    const taskbarContainer = startBtn.parentElement;

    if (!taskbarContainer) return;



    let ql = taskbarContainer.querySelector('.xp-quick-launch-toolbar');

    if (!ql) {

      ql = document.createElement('div');

      ql.className = 'xp-quick-launch-toolbar';

      // Insert right after the start button

      startBtn.insertAdjacentElement('afterend', ql);

    }



    const pinnedList = getPinnedStartApps();

    const currentFingerprint = pinnedList.join(',');

    if (ql.dataset.pinnedFingerprint === currentFingerprint) return;

    ql.dataset.pinnedFingerprint = currentFingerprint;

    ql.innerHTML = '';

    pinnedList.forEach(appId => {

      const info = APP_REGISTRY[appId];

      if (!info) return;



      const btn = document.createElement('button');

      btn.className = 'xp-quick-launch-btn';

      btn.title = info.name;

      btn.innerHTML = `<img src="${info.icon}" alt="${escapeHtml(info.name)}" />`;

      btn.addEventListener('click', (e) => {

        e.stopPropagation();

        SoundManager.playClick();

        if (window.__openWindow) window.__openWindow(appId);

      });

            btn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showQuickLaunchContextMenu(e.clientX, e.clientY, appId, info);
      });
      ql.appendChild(btn);

    });

  }



  function renderPinnedStartApps() {
    // Disabled to prevent duplicate pinned programs from cluttering Start Menu
    const existing = document.querySelector('.xp-start-pinned-block');
    if (existing) existing.remove();
  }



  // --------------------------------------------------------------------------

  // APPLICATION CONTEXT MENU (#xp-app-context-menu)

  // --------------------------------------------------------------------------

  function closeAllContextMenus() {
    const dMenu = document.getElementById('xp-desktop-context-menu');
    if (dMenu) dMenu.style.display = 'none';
    const aMenu = document.getElementById('xp-app-context-menu');
    if (aMenu) aMenu.style.display = 'none';
    const rMenu = document.getElementById('xp-recycle-row-menu');
    if (rMenu) rMenu.style.display = 'none';
  }



  function positionMenu(menu, clickX, clickY) {

    const menuWidth = menu.offsetWidth || 190;

    const menuHeight = menu.offsetHeight || 300;



    let x = clickX;

    let y = clickY;



    if (x + menuWidth > window.innerWidth) {

      x = window.innerWidth - menuWidth - 4;

    }

    if (y + menuHeight > window.innerHeight - 30) {

      y = window.innerHeight - menuHeight - 34;

    }



    menu.style.left = `${Math.max(4, x)}px`;

    menu.style.top = `${Math.max(4, y)}px`;



    const submenus = menu.querySelectorAll('.xp-submenu');

    submenus.forEach(sub => {

      if (x + menuWidth + 160 > window.innerWidth) {

        sub.style.left = 'auto';

        sub.style.right = '100%';

      } else {

        sub.style.left = '100%';

        sub.style.right = 'auto';

      }

    });

  }



  function showAppContextMenu(e, btn, appInfo) {

    e.preventDefault();

    e.stopPropagation();

    closeAllContextMenus();

    currentContextApp = { btn, appInfo };



    let appMenu = document.getElementById('xp-app-context-menu');

    if (!appMenu) {

      appMenu = document.createElement('div');

      appMenu.id = 'xp-app-context-menu';

      appMenu.className = 'xp-context-menu';

      document.body.appendChild(appMenu);



      appMenu.addEventListener('click', (ev) => {

        const item = ev.target.closest('.xp-menu-item[data-app-action]');

        if (!item || !currentContextApp) return;

        const act = item.dataset.appAction;

        const { btn: targetBtn, appInfo: targetApp } = currentContextApp;

        executeAppCommand(act, targetApp, targetBtn);

      });

    }



    const isBin = appInfo.id === 'recyclebin';

    if (isBin) {

      appMenu.innerHTML = `

        <div class="xp-menu-item" data-app-action="open">

          <span class="xp-menu-icon">📂</span>

          <span class="xp-menu-text"><strong>Open</strong></span>

        </div>

        <div class="xp-menu-item" data-app-action="open">

          <span class="xp-menu-icon">🔍</span>

          <span class="xp-menu-text">Explore</span>

        </div>

        <div class="xp-menu-item" data-app-action="empty_bin">

          <span class="xp-menu-icon">🗑️</span>

          <span class="xp-menu-text">Empty Recycle Bin</span>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-app-action="create_shortcut">

          <span class="xp-menu-icon">🔗</span>

          <span class="xp-menu-text">Create Shortcut</span>

        </div>

        <div class="xp-menu-item" data-app-action="rename">

          <span class="xp-menu-icon">✏️</span>

          <span class="xp-menu-text">Rename</span>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-app-action="properties">

          <span class="xp-menu-icon">⚙️</span>

          <span class="xp-menu-text"><strong>Properties</strong></span>

        </div>

      `;

    } else {

      appMenu.innerHTML = `

        <div class="xp-menu-item" data-app-action="open">

          <span class="xp-menu-icon">📂</span>

          <span class="xp-menu-text"><strong>Open</strong></span>

        </div>

        ${getPinnedStartApps().includes(appInfo && appInfo.id) ? `
        <div class="xp-menu-item" data-app-action="unpin_start">
          <span class="xp-menu-icon">📌</span>
          <span class="xp-menu-text">Unpin from Taskbar & Start menu</span>
        </div>` : `
        <div class="xp-menu-item" data-app-action="pin_start">
          <span class="xp-menu-icon">📌</span>
          <span class="xp-menu-text">Pin to Taskbar & Start menu</span>
        </div>`}

        <div class="xp-menu-item has-submenu" id="app-ctx-sendto">

          <span class="xp-menu-icon">📤</span>

          <span class="xp-menu-text">Send To</span>

          <span class="xp-menu-arrow">▶</span>

          <div class="xp-submenu">

            <div class="xp-menu-item" data-app-action="send_desktop">

              <span class="xp-menu-icon">🖥️</span>

              <span class="xp-menu-text">Desktop (create shortcut)</span>

            </div>

            <div class="xp-menu-item" data-app-action="send_mail">

              <span class="xp-menu-icon">📧</span>

              <span class="xp-menu-text">Mail Recipient</span>

            </div>

            <div class="xp-menu-item" data-app-action="send_zip">

              <span class="xp-menu-icon">🗜️</span>

              <span class="xp-menu-text">Compressed Folder</span>

            </div>

          </div>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-app-action="cut">

          <span class="xp-menu-icon">✂️</span>

          <span class="xp-menu-text">Cut</span>

        </div>

        <div class="xp-menu-item" data-app-action="copy">

          <span class="xp-menu-icon">📋</span>

          <span class="xp-menu-text">Copy</span>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-app-action="create_shortcut">

          <span class="xp-menu-icon">🔗</span>

          <span class="xp-menu-text">Create Shortcut</span>

        </div>

        <div class="xp-menu-item" data-app-action="delete">

          <span class="xp-menu-icon">🗑️</span>

          <span class="xp-menu-text">Delete</span>

        </div>

        <div class="xp-menu-item" data-app-action="rename">

          <span class="xp-menu-icon">✏️</span>

          <span class="xp-menu-text">Rename</span>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-app-action="properties">

          <span class="xp-menu-icon">⚙️</span>

          <span class="xp-menu-text"><strong>Properties</strong></span>

        </div>

      `;

    }



    appMenu.style.display = 'block';

    positionMenu(appMenu, e.clientX, e.clientY);

    SoundManager.playClick();

  }



  function executeAppCommand(act, targetApp, targetBtn) {

    SoundManager.playClick();

    closeAllContextMenus();



    if (act === 'open') {

      if (targetApp.isCustomShortcut && targetApp.targetId) {

        if (window.__openWindow) window.__openWindow(targetApp.targetId);

      } else if (window.__openWindow) {

        window.__openWindow(targetApp.id);

      } else if (targetBtn) {

        targetBtn.click();

      }

    } else if (act === 'delete') {

      showConfirmDeleteDialog(targetApp.name, () => {

        moveAppToRecycleBin(targetApp.id, targetApp.name, targetApp.icon, targetBtn);

      });

    } else if (act === 'empty_bin') {

      emptyTheRecycleBin();

    } else if (act === 'rename') {

      inlineRenameApp(targetBtn, targetApp);

    } else if (act === 'properties') {

      showAppPropertiesModal(targetApp);

    } else if (act === 'pin_start') {
      const list = getPinnedStartApps();
      if (!list.includes(targetApp.id)) {
        list.push(targetApp.id);
        savePinnedStartApps(list);
      }
      renderPinnedStartApps();
      renderQuickLaunchToolbar();
      SoundManager.playDing();
      showXpNotification("Taskbar & Start Menu", "'" + targetApp.name + "' was pinned to the Taskbar & Start Menu.");
    } else if (act === 'unpin_start') {
      const list = getPinnedStartApps().filter(id => id !== targetApp.id);
      savePinnedStartApps(list);
      renderPinnedStartApps();
      renderQuickLaunchToolbar();
      SoundManager.playDing();
      showXpNotification("Taskbar & Start Menu", "'" + targetApp.name + "' was unpinned from the Taskbar & Start Menu.");

    } else if (act === 'send_desktop' || act === 'create_shortcut') {

      createDesktopShortcut(targetApp);

    } else if (act === 'send_mail') {

      if (window.__openWindow) window.__openWindow('contact');

    } else if (act === 'send_zip') {

      createZipArchive(targetApp);

    } else if (act === 'cut') {

      // NEVER DIM OPACITY! Full natural color preserved!

      clipboardState = { mode: 'cut', app: targetApp, btn: targetBtn };

      targetBtn.style.opacity = '1';

      showXpNotification("Clipboard", `Cut '${targetApp.name}'. Right-click desktop to Paste.`);

    } else if (act === 'copy') {

      // NEVER DIM OPACITY! Full natural color preserved!

      clipboardState = { mode: 'copy', app: targetApp, btn: targetBtn };

      targetBtn.style.opacity = '1';

      showXpNotification("Clipboard", `Copied '${targetApp.name}'. Right-click desktop to Paste.`);

    }

  }



  // --------------------------------------------------------------------------

  // DESKTOP WALLPAPER CONTEXT MENU

  // --------------------------------------------------------------------------

  function initDesktopContextMenu() {

    let menu = document.getElementById('xp-desktop-context-menu');

    if (!menu) {

      menu = document.createElement('div');

      menu.id = 'xp-desktop-context-menu';

      menu.className = 'xp-context-menu';

      menu.style.display = 'none';



      menu.innerHTML = `

        <div class="xp-menu-item has-submenu" id="ctx-arrange">

          <span class="xp-menu-icon">🗂️</span>

          <span class="xp-menu-text">Arrange Icons By</span>

          <span class="xp-menu-arrow">▶</span>

          <div class="xp-submenu">

            <div class="xp-menu-item" data-action="arrange_name">

              <span class="xp-menu-icon">🔤</span>

              <span class="xp-menu-text">Name</span>

            </div>

            <div class="xp-menu-item" data-action="arrange_type">

              <span class="xp-menu-icon">📁</span>

              <span class="xp-menu-text">Type</span>

            </div>

            <div class="xp-menu-item" data-action="arrange_auto">

              <span class="xp-menu-icon">✨</span>

              <span class="xp-menu-text">Auto Arrange</span>

            </div>

            <div class="xp-menu-item" data-action="arrange_grid">

              <span class="xp-menu-icon">📐</span>

              <span class="xp-menu-text">Align to Grid</span>

            </div>

          </div>

        </div>

        <div class="xp-menu-item" data-action="refresh">

          <span class="xp-menu-icon">🔄</span>

          <span class="xp-menu-text">Refresh</span>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-action="paste" id="ctx-item-paste" style="opacity:0.5; pointer-events:none;">

          <span class="xp-menu-icon">📋</span>

          <span class="xp-menu-text">Paste</span>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-action="music_toggle">

          <span class="xp-menu-icon">🎵</span>

          <span class="xp-menu-text">Play / Pause Music</span>

        </div>

        <div class="xp-menu-item" data-action="music_next">

          <span class="xp-menu-icon">⏭️</span>

          <span class="xp-menu-text">Next Song</span>

        </div>

        <div class="xp-menu-item" data-action="open_music">

          <span class="xp-menu-icon">📻</span>

          <span class="xp-menu-text">My Musics</span>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-action="open_clippy">

          <span class="xp-menu-icon">📎</span>

          <span class="xp-menu-text">Ask Clippy AI...</span>

        </div>

        <div class="xp-menu-item" data-action="matrix_rain">

          <span class="xp-menu-icon">🕶️</span>

          <span class="xp-menu-text">Matrix Digital Rain</span>

        </div>

        <div class="xp-menu-item" data-action="open_cmd">

          <span class="xp-menu-icon">💻</span>

          <span class="xp-menu-text">Command Prompt (CMD)</span>

        </div>

        <div class="xp-menu-item" data-action="open_calendar">

          <span class="xp-menu-icon">📅</span>

          <span class="xp-menu-text">Calendar & Schedule</span>

        </div>

        <div class="xp-menu-item" data-action="open_cv">

          <span class="xp-menu-icon">📄</span>

          <span class="xp-menu-text">View Vedant's Resume</span>

        </div>

        <div class="xp-menu-item" data-action="open_projects">

          <span class="xp-menu-icon">🚀</span>

          <span class="xp-menu-text">View Projects (GraphRAG)</span>

        </div>

        <div class="xp-menu-separator"></div>

        

        <div class="xp-menu-item has-submenu" id="ctx-wallpaper">

          <span class="xp-menu-icon">🖼️</span>

          <span class="xp-menu-text">Desktop Wallpaper</span>

          <span class="xp-menu-arrow">▶</span>

          <div class="xp-submenu">

            <div class="xp-menu-item" data-action="wp_bliss">

              <span class="xp-menu-icon">🌄</span>

              <span class="xp-menu-text">Bliss (Classic)</span>

            </div>

            <div class="xp-menu-item" data-action="wp_autumn">

              <span class="xp-menu-icon">🍂</span>

              <span class="xp-menu-text">Autumn</span>

            </div>

            <div class="xp-menu-item" data-action="wp_desert">

              <span class="xp-menu-icon">🏜️</span>

              <span class="xp-menu-text">Desert</span>

            </div>

            <div class="xp-menu-item" data-action="wp_azul">

              <span class="xp-menu-icon">🌊</span>

              <span class="xp-menu-text">Azul</span>

            </div>

          </div>

        </div>

        <div class="xp-menu-separator"></div>

        <div class="xp-menu-item" data-action="open_settings">

          <span class="xp-menu-icon">⚙️</span>

          <span class="xp-menu-text"><strong>Properties</strong></span>

        </div>

      `;



      document.body.appendChild(menu);



      menu.addEventListener('click', (e) => {

        const item = e.target.closest('.xp-menu-item[data-action]');

        if (!item) return;



        const act = item.dataset.action;

        SoundManager.playClick();

        closeAllContextMenus();



        if (act === 'arrange_name') {

          arrangeDesktopIcons('name');

        } else if (act === 'arrange_type') {

          arrangeDesktopIcons('type');

        } else if (act === 'arrange_auto') {

          arrangeDesktopIcons('auto');

        } else if (act === 'arrange_grid') {

          arrangeDesktopIcons('grid');

        } else if (act === 'refresh') {

          const icons = document.querySelectorAll('.desktop-icon-draggable');

          icons.forEach(ic => {

            ic.style.opacity = '0.25';

            setTimeout(() => ic.style.opacity = '1', 90);

          });

          initDesktopDraggableAndMenus();
          initIndianFlagTray();
          initStickyNotes();
          initCertificationsEnhancement();

        } else if (act === 'paste') {

          if (clipboardState && clipboardState.app) {

            const slot = coordToGrid(lastDesktopClickX || 200, lastDesktopClickY || 200);

            if (clipboardState.mode === 'cut') {

              if (clipboardState.btn) {

                clipboardState.btn.style.opacity = '1';

                clipboardState.btn.style.left = `${slot.x}px`;

                clipboardState.btn.style.top = `${slot.y}px`;

                saveAppPosition(clipboardState.app.id, slot.x, slot.y);

              }

              showXpNotification("Clipboard", `Moved '${clipboardState.app.name}'.`);

              clipboardState = null;

            } else {

              createDesktopShortcut(clipboardState.app, slot.x, slot.y);

            }

          }

        } else if (act === 'new_folder') {

          createNewFileOnDesktop('folder', lastDesktopClickX, lastDesktopClickY);

        } else if (act === 'new_txt') {

          createNewFileOnDesktop('txt', lastDesktopClickX, lastDesktopClickY);

        } else if (act === 'new_bmp') {

          createNewFileOnDesktop('bmp', lastDesktopClickX, lastDesktopClickY);

        } else if (act === 'music_toggle') {

          MusicController.togglePlay();

        } else if (act === 'music_next') {

          MusicController.nextTrack();

        } else if (act === 'open_music') {

          if (window.__openWindow) window.__openWindow('music');

        } else if (act === 'open_clippy') {
          if (typeof window.openClippyAssistant === 'function') {
            window.openClippyAssistant();
          } else {
            initClippyAssistant();
            if (typeof window.openClippyAssistant === 'function') window.openClippyAssistant();
          }

        } else if (act === 'matrix_rain') {

          toggleMatrixRain();

        } else if (act === 'open_cmd') {

          if (window.__openWindow) window.__openWindow('terminal');

        } else if (act === 'open_calendar') {

          if (window.__openWindow) window.__openWindow('calendar');

        } else if (act === 'open_cv') {

          if (window.__openWindow) window.__openWindow('myCV');

        } else if (act === 'open_projects') {

          if (window.__openWindow) window.__openWindow('myProjects');

        } else if (act === 'open_settings') {

          if (window.__openWindow) window.__openWindow('settings');

        } else if (act && act.startsWith('wp_')) {

          const wpKey = act.replace('wp_', '');

          setDesktopWallpaper(wpKey);

        }

      });

    }



    document.addEventListener('contextmenu', (e) => {

      // 1. Don't intercept inputs, textareas, Doom or canvas

      if (e.target.closest('input, textarea, select, #doom, #dosbox, .paint-canvas, #stickynotes, .sticky-note-textarea')) {

        return;

      }



      // 2. Check if right-clicking an app button on desktop

      const appBtn = e.target.closest('button.cursor-pointer, .desktop-icon-draggable, [data-app-id], button');

      if (appBtn && (appBtn.closest('section.absolute.top-0.left-0') || appBtn.classList.contains('desktop-icon-draggable'))) {

        const appInfo = resolveAppFromButton(appBtn);

        if (appInfo) {

          showAppContextMenu(e, appBtn, appInfo);

          return;

        }

      }



      // 3. Check if inside an open application window

      if (e.target.closest('section[id], section.absolute.rounded-t-lg, .window-container')) {

        return;

      }



      e.preventDefault();

      SoundManager.playClick();

      closeAllContextMenus();



      lastDesktopClickX = e.clientX;

      lastDesktopClickY = e.clientY;



      const pasteBtn = menu.querySelector('#ctx-item-paste');

      if (pasteBtn) {

        if (clipboardState && clipboardState.app) {

          pasteBtn.style.opacity = '1';

          pasteBtn.style.pointerEvents = 'auto';

        } else {

          pasteBtn.style.opacity = '0.5';

          pasteBtn.style.pointerEvents = 'none';

        }

      }



      menu.style.display = 'block';

      positionMenu(menu, e.clientX, e.clientY);

    });



    document.addEventListener('click', (e) => {

      if (!e.target.closest('.xp-context-menu')) {

        closeAllContextMenus();

      }

      if (!e.target.closest('.desktop-icon-draggable')) {

        document.querySelectorAll('.desktop-icon-draggable').forEach(b => b.classList.remove('selected'));

      }

      const startModal = document.querySelector('.header-component .modal-size');
      if (startModal && startModal.offsetParent !== null) {
        if (!e.target.closest('.header-component') && !e.target.closest('.start-button')) {
          const startBtn = document.querySelector('.start-button');
          if (startBtn) startBtn.click();
        }
      }

    });



    window.addEventListener('blur', closeAllContextMenus);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllContextMenus();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Del') {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
          return;
        }

        // Check if a row in the Recycle Bin window is selected
        const selectedBinRow = document.querySelector('#recycle-table-wrapper tr.selected');
        if (selectedBinRow) {
          const id = selectedBinRow.dataset.id || selectedBinRow.dataset.appId;
          permanentlyDeleteItem(id);
          return;
        }

        // Check if a desktop icon is selected
        const selectedDesktopBtn = document.querySelector('.desktop-icon-draggable.selected, section.absolute.top-0.left-0 button.selected');
        if (selectedDesktopBtn && !selectedDesktopBtn.classList.contains('xp-app-deleted')) {
          const appInfo = resolveAppFromButton(selectedDesktopBtn);
          if (appInfo && appInfo.id !== 'recyclebin') {
            showConfirmDeleteDialog(appInfo.name, () => {
              moveAppToRecycleBin(appInfo.id, appInfo.name, appInfo.icon, selectedDesktopBtn);
            });
          }
        }
      }
    });

  }



  // --------------------------------------------------------------------------

  // INITIALIZE ALL DESKTOP DRAGGABLE ICONS & MENUS (Strict Grid Alignment)

  // --------------------------------------------------------------------------

  function initDesktopDraggableAndMenus() {

    const iconButtons = Array.from(document.querySelectorAll('section.absolute.top-0.left-0 button, button.desktop-icon-draggable'));

    if (!iconButtons.length) return;



    const savedPositions = getCustomPositions();

    const deletedList = getDeletedApps();

    if (isPortfolioRevisit()) {
      try {
        Object.keys(localStorage).forEach(k => {
          if (k && k.startsWith('xp_app_name_')) localStorage.removeItem(k);
        });
      } catch(e) {}
    }

    const { maxRows, maxCols } = getDesktopGridDimensions();



    // Map occupied slots so NO two icons can ever share a slot or overlap

    const occupiedSlots = {};

    const iconsToPlace = [];



    iconButtons.forEach((btn) => {

      const appInfo = resolveAppFromButton(btn);

      if (!appInfo) {

        btn.dataset.dragBound = 'true';

        return;

      }



      const customName = localStorage.getItem('xp_app_name_' + appInfo.id);

      if (customName) {

        const labelEl = btn.querySelector('p');

        if (labelEl) labelEl.textContent = customName;

      }



      const isDeleted = deletedList.some(d => d.appId === appInfo.id);
      if (isDeleted) {
        btn.classList.add('xp-app-deleted');
        btn.style.display = 'none';
      } else {
        btn.classList.remove('xp-app-deleted');
        btn.style.display = 'flex';
      }

      btn.classList.add('desktop-icon-draggable');
      btn.style.opacity = '1';

      iconsToPlace.push({ btn, appInfo, isDeleted });

    });



    // 1. Assign strict grid slots to all icons without any overlaps

    let nextDefaultIndex = 0;

    iconsToPlace.forEach(({ btn, appInfo, isDeleted }) => {

            const DEFAULT_CANONICAL_POSITIONS = {
        'myProjects': { x: 20, y: 20 },
        'pictures': { x: 20, y: 106 },
        'myCV': { x: 20, y: 192 },
        'music': { x: 20, y: 278 },
        'minesweeper': { x: 20, y: 364 },
        'notepad': { x: 20, y: 450 },
        'doom': { x: 20, y: 536 },
        'terminal': { x: 104, y: 20 },
        'settings': { x: 104, y: 106 },
        'recyclebin': { x: 104, y: 192 },
        'paint': { x: 104, y: 278 },
        'pinball': { x: 104, y: 364 },
        'stickynotes': { x: 104, y: 450 },
        'services': { x: 104, y: 536 }
      };

      let slot = null;
      let pos = savedPositions[appInfo.id] || DEFAULT_CANONICAL_POSITIONS[appInfo.id];



      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {

        // Snap saved position to strict grid coordinates

        const snapped = coordToGrid(pos.x, pos.y);

        const key = `${snapped.col},${snapped.row}`;

        if (!occupiedSlots[key]) {

          slot = snapped;

        }

      }



      // If no valid saved slot or collision, find the next clean grid slot in vertical columns

      if (!slot) {

        const safeMaxRows = Math.max(1, maxRows || 8);

        for (let attempt = 0; attempt < 100; attempt++) {

          const col = Math.floor(nextDefaultIndex / safeMaxRows);

          const row = nextDefaultIndex % safeMaxRows;

          const key = `${col},${row}`;

          nextDefaultIndex++;

          if (!occupiedSlots[key]) {

            slot = {

              col,

              row,

              x: col * GRID_COL_WIDTH + GRID_ORIGIN_X,

              y: row * GRID_ROW_HEIGHT + GRID_ORIGIN_Y

            };

            break;

          }

        }

        if (!slot) {

          slot = { col: 0, row: 0, x: GRID_ORIGIN_X, y: GRID_ORIGIN_Y };

        }

      }



      occupiedSlots[`${slot.col},${slot.row}`] = appInfo.id;
      btn.style.left = `${slot.x}px`;
      btn.style.top = `${slot.y}px`;
      btn.style.position = 'absolute';
      if (isDeleted) {
        btn.classList.add('xp-app-deleted');
        btn.style.display = 'none';
      } else {
        btn.classList.remove('xp-app-deleted');
        btn.style.display = 'flex';
        btn.style.visibility = 'visible';
        btn.style.opacity = '1';
      }
      savedPositions[appInfo.id] = { x: slot.x, y: slot.y };



      if (!btn.dataset.dragBound) {

        btn.dataset.dragBound = 'true';

        attachIconDrag(btn, appInfo);

      }

    });



    saveCustomPositions(savedPositions);



        // Clean up any stale custom shortcuts or folders (only real applications on desktop)
    try {
      localStorage.removeItem('xp_custom_desktop_items');
    } catch(e) {}
    document.querySelectorAll('button[data-is-custom-shortcut], button[data-app-id*="folder"], button[data-app-id*="shortcut"]').forEach(el => el.remove());
    Array.from(document.querySelectorAll('section.absolute.top-0.left-0 button')).forEach(b => {
      const text = (b.textContent || '').trim();
      if (text === 'New Folder' || text.startsWith('Shortcut to') || b.dataset.isCustomShortcut) {
        b.remove();
      }
    });



    const hasDeleted = deletedList.length > 0;
    updateDesktopRecycleBinIcon(hasDeleted);



    renderQuickLaunchToolbar();

    renderPinnedStartApps();

  }



  function arrangeDesktopIcons(sortMode) {

    const iconButtons = Array.from(document.querySelectorAll('section.absolute.top-0.left-0 button:not(.xp-app-deleted), button.desktop-icon-draggable:not(.xp-app-deleted)'));

    if (!iconButtons.length) return;



    if (sortMode === 'name') {

      iconButtons.sort((a, b) => {

        const nameA = (a.textContent || '').trim().toLowerCase();

        const nameB = (b.textContent || '').trim().toLowerCase();

        return nameA.localeCompare(nameB);

      });

    } else if (sortMode === 'type') {

      iconButtons.sort((a, b) => {

        const infoA = resolveAppFromButton(a);

        const infoB = resolveAppFromButton(b);

        const typeA = infoA ? infoA.type : 'Z';

        const typeB = infoB ? infoB.type : 'Z';

        return typeA.localeCompare(typeB);

      });

    }



    const { maxRows } = getDesktopGridDimensions();

    const savedPositions = getCustomPositions();



    iconButtons.forEach((btn, index) => {

      const appInfo = resolveAppFromButton(btn);

      let col, row, x, y;

      if (sortMode === 'grid') {

        const curX = parseFloat(btn.style.left) || 20;

        const curY = parseFloat(btn.style.top) || 20;

        const snapped = coordToGrid(curX, curY);

        x = snapped.x;

        y = snapped.y;

      } else {

        col = Math.floor(index / maxRows);

        row = index % maxRows;

        x = col * GRID_COL_WIDTH + GRID_ORIGIN_X;

        y = row * GRID_ROW_HEIGHT + GRID_ORIGIN_Y;

      }

      btn.style.left = `${x}px`;

      btn.style.top = `${y}px`;

      if (appInfo) {

        savedPositions[appInfo.id] = { x, y };

      }

    });



    saveCustomPositions(savedPositions);

    SoundManager.playClick();

  }





  // UNIVERSAL INTERACTIVE BUTTONS & CONTROLS SYSTEM

  // Makes EVERY dummy button in the portfolio fully functional & interactive!

  // ==========================================================================



  // 1. Universal Window Menubar Dropdown Menus (File, Edit, View, Favorites, Tools, Help, Game)

  function initUniversalWindowMenus() {

    let activeMenu = null;

    let activeBtn = null;



    function closeActiveMenu() {

      if (activeMenu) {

        activeMenu.remove();

        activeMenu = null;

      }

      if (activeBtn) {

        activeBtn.classList.remove('xp-menu-active-btn');

        activeBtn = null;

      }

    }



    document.addEventListener('click', (e) => {

      // Check if clicking a menubar item

      const menuBtn = e.target.closest('.border-window-header-bot button, .border-window-header-bot .cursor-pointer, .retro-xp-menubar span');

      if (menuBtn) {

        e.stopPropagation();

        SoundManager.playClick();



        if (activeBtn === menuBtn) {

          closeActiveMenu();

          return;

        }



        closeActiveMenu();

        activeBtn = menuBtn;

        activeBtn.classList.add('xp-menu-active-btn');



        const label = menuBtn.textContent.trim();

        const winEl = menuBtn.closest('section[id]') || menuBtn.closest('.window-container') || document.body;

        const winId = winEl.id || '';



        const rect = menuBtn.getBoundingClientRect();

        const menuWrapper = document.createElement('div');

        menuWrapper.className = 'xp-dropdown-menu-wrapper';

        menuWrapper.style.top = (rect.bottom + 1) + 'px';

        menuWrapper.style.left = Math.max(4, rect.left) + 'px';



        const items = getMenuItemsFor(label, winId, winEl);

        items.forEach(item => {

          if (item.type === 'separator') {

            const sep = document.createElement('div');

            sep.className = 'xp-dropdown-divider';

            menuWrapper.appendChild(sep);

          } else {

            const row = document.createElement('div');

            row.className = 'xp-dropdown-item' + (item.disabled ? ' disabled' : '');

            row.innerHTML = `

              <div class="xp-item-label">

                <span class="xp-item-icon">${item.icon || ''}</span>

                <span>${item.text}</span>

              </div>

              ${item.shortcut ? `<span class="xp-item-shortcut">${item.shortcut}</span>` : ''}

            `;



            if (!item.disabled) {

              row.addEventListener('click', (ev) => {

                ev.stopPropagation();

                SoundManager.playClick();

                closeActiveMenu();

                if (item.action) item.action();

              });

            }

            menuWrapper.appendChild(row);

          }

        });



        document.body.appendChild(menuWrapper);

        activeMenu = menuWrapper;



        // Reposition if overflows screen

        const menuRect = menuWrapper.getBoundingClientRect();

        if (menuRect.right > window.innerWidth) {

          menuWrapper.style.left = (window.innerWidth - menuRect.width - 6) + 'px';

        }

        return;

      }



      // Close menu if clicking anywhere else

      if (!e.target.closest('.xp-dropdown-menu-wrapper')) {

        closeActiveMenu();

      }

    });



    window.addEventListener('blur', closeActiveMenu);

    document.addEventListener('keydown', (e) => {

      if (e.key === 'Escape') closeActiveMenu();

    });



    function getMenuItemsFor(label, winId, winEl) {

      const items = [];

      const cleanLabel = label.toLowerCase();



      if (cleanLabel.includes('file') || cleanLabel.includes('fichier')) {

        items.push({

          icon: '📄',

          text: 'New Document / Note',

          shortcut: 'Ctrl+N',

          action: () => {

            if (winId === 'notepad') {

              const ta = winEl.querySelector('textarea');

              if (ta) ta.value = '';

            } else {

              if (window.__openWindow) window.__openWindow('notepad');

            }

          }

        });

        items.push({

          icon: '📂',

          text: 'Open Application...',

          shortcut: 'Ctrl+O',

          action: () => {

            const startBtn = document.querySelector('.start-button');

            if (startBtn) startBtn.click();

          }

        });

        items.push({

          icon: '💾',

          text: 'Save As...',

          shortcut: 'Ctrl+S',

          action: () => {

            const ta = winEl.querySelector('textarea, .xp-sticky-body, input[type="text"]');

            const content = ta ? (ta.value || ta.innerText) : `Vedant Kale Portfolio - Window ${winId}`;

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

            const a = document.createElement('a');

            a.href = URL.createObjectURL(blob);

            a.download = `${winId || 'portfolio'}_export.txt`;

            a.click();

          }

        });

        items.push({

          icon: '🖨️',

          text: 'Print Page / Resume...',

          shortcut: 'Ctrl+P',

          action: () => {

            if (winId === 'myCV') {

              window.open('/resume_print.html', '_blank');

            } else {

              window.print();

            }

          }

        });

        items.push({ type: 'separator' });

        items.push({

          icon: '⚙️',

          text: 'Settings',

          action: () => {

            if (window.__openWindow) window.__openWindow('settings');

          }

        });

        items.push({ type: 'separator' });

        items.push({

          icon: '✕',

          text: 'Close Window',

          shortcut: 'Alt+F4',

          action: () => {

            const closeBtn = winEl.querySelector('button.bg-window-close, button:last-child');

            if (closeBtn) closeBtn.click();

          }

        });

      }

      else if (cleanLabel.includes('edit') || cleanLabel.includes('édition')) {

        items.push({

          icon: '↩️',

          text: 'Undo',

          shortcut: 'Ctrl+Z',

          action: () => document.execCommand('undo')

        });

        items.push({ type: 'separator' });

        items.push({

          icon: '✂️',

          text: 'Cut',

          shortcut: 'Ctrl+X',

          action: () => document.execCommand('cut')

        });

        items.push({

          icon: '📋',

          text: 'Copy',

          shortcut: 'Ctrl+C',

          action: () => {

            const sel = window.getSelection().toString();

            if (sel) {

              navigator.clipboard?.writeText(sel);

            } else {

              navigator.clipboard?.writeText(window.location.href);

            }

          }

        });

        items.push({

          icon: '📋',

          text: 'Paste',

          shortcut: 'Ctrl+V',

          action: async () => {

            try {

              const text = await navigator.clipboard?.readText();

              if (text) document.execCommand('insertText', false, text);

            } catch (e) {}

          }

        });

        items.push({ type: 'separator' });

        items.push({

          icon: '☑️',

          text: 'Select All',

          shortcut: 'Ctrl+A',

          action: () => {

            const ta = winEl.querySelector('textarea, input, [contenteditable="true"]');

            if (ta) ta.select?.() || document.execCommand('selectAll');

            else document.execCommand('selectAll');

          }

        });

      }

      else if (cleanLabel.includes('view') || cleanLabel.includes('affichage')) {

        items.push({

          icon: '🔄',

          text: 'Refresh View',

          shortcut: 'F5',

          action: () => {

            SoundManager.playClick();

            const originalTransform = winEl.style.transform;

            winEl.style.opacity = '0.5';

            setTimeout(() => { winEl.style.opacity = '1'; }, 150);

          }

        });

        items.push({

          icon: '🖥️',

          text: 'Toggle Full Screen',

          shortcut: 'F11',

          action: () => toggleFullScreen()

        });

        items.push({ type: 'separator' });

        items.push({

          icon: '🎨',

          text: 'Theme: Luna Blue',

          action: () => applyTheme('luna')

        });

        items.push({

          icon: '🍃',

          text: 'Theme: Olive Green',

          action: () => applyTheme('olive')

        });

        items.push({

          icon: '🥈',

          text: 'Theme: Metallic Silver',

          action: () => applyTheme('silver')

        });

        items.push({

          icon: '👑',

          text: 'Theme: Royale Blue',

          action: () => applyTheme('royale')

        });

        items.push({

          icon: '🌙',

          text: 'Theme: Dark XP',

          action: () => applyTheme('dark')

        });

      }

      else if (cleanLabel.includes('favorite') || cleanLabel.includes('favoris')) {

        items.push({

          icon: '⭐',

          text: 'Add to Bookmarks',

          shortcut: 'Ctrl+D',

          action: () => alert('Press Ctrl+D (or Cmd+D) to bookmark Vedant\'s Windows XP Portfolio!')

        });

        items.push({ type: 'separator' });

        items.push({

          icon: '🐙',

          text: 'Vedant\'s GitHub Profile',

          action: () => window.open('https://github.com/VedantKale244', '_blank')

        });

        items.push({

          icon: '💼',

          text: 'LinkedIn Developer Profile',

          action: () => window.open('https://linkedin.com/in/vedant-kale-33230a28b/', '_blank')

        });

        items.push({

          icon: '🧩',

          text: 'LeetCode (Top 5% Solver)',

          action: () => window.open('https://leetcode.com/u/Vedant_Kale27', '_blank')

        });

        items.push({

          icon: '✉️',

          text: 'Contact Vedant Directly',

          action: () => {

            if (window.__openWindow) window.__openWindow('contact');

          }

        });

      }

      else if (cleanLabel.includes('tool') || cleanLabel.includes('outils')) {

        items.push({

          icon: '💻',

          text: 'Command Prompt (CMD)',

          action: () => {

            if (window.__openWindow) window.__openWindow('terminal');

          }

        });

        items.push({

          icon: '⚙️',

          text: 'System & Display Settings',

          action: () => {

            if (window.__openWindow) window.__openWindow('settings');

          }

        });

        items.push({

          icon: '🟢',

          text: 'Matrix Code Rain Mode',

          action: () => triggerMatrixMode()

        });

        items.push({

          icon: '📁',

          text: 'Explore Recycle Bin',

          action: () => {

            if (window.__openWindow) window.__openWindow('recyclebin');

          }

        });

        items.push({

          icon: '🎨',

          text: 'Microsoft Paint',

          action: () => {

            if (window.__openWindow) window.__openWindow('paint');

          }

        });

      }

      else if (cleanLabel.includes('help') || cleanLabel.includes('aide')) {

        items.push({

          icon: '❓',

          text: 'Help and Support Center',

          shortcut: 'F1',

          action: () => {

            const avatar = document.getElementById('clippy-avatar-btn');

            if (avatar) avatar.click();

            setTimeout(() => {

              const clippyInput = document.getElementById('clippy-chat-input');

              if (clippyInput) {

                clippyInput.value = `Tell me about the ${winId || 'portfolio'} window`;

                const sendBtn = document.getElementById('clippy-send-btn');

                if (sendBtn) sendBtn.click();

              }

            }, 300);

          }

        });

        items.push({

          icon: '📎',

          text: 'Ask Clippy AI...',

          action: () => {

            const avatar = document.getElementById('clippy-avatar-btn');

            if (avatar) avatar.click();

          }

        });

        items.push({ type: 'separator' });

        items.push({

          icon: 'ℹ️',

          text: 'About Windows XP Portfolio...',

          action: () => showAboutWindowsXPDialog()

        });

      }

      else if (cleanLabel.includes('game') || cleanLabel.includes('jeu')) {

        items.push({

          icon: '🚩',

          text: 'New Game',

          shortcut: 'F2',

          action: () => {

            const restartBtn = winEl.querySelector('button[title*="restart"], .minesweeper-face, img[src*="minesweeper"]');

            if (restartBtn) restartBtn.click();

            else {

              const btn = winEl.querySelector('button');

              if (btn) btn.click();

            }

          }

        });

        items.push({ type: 'separator' });

        items.push({

          icon: '❌',

          text: 'Exit',

          action: () => {

            const closeBtn = winEl.querySelector('button:last-child');

            if (closeBtn) closeBtn.click();

          }

        });

      }

      else {

        // Generic fallback items

        items.push({

          icon: '🔍',

          text: 'Explore ' + label,

          action: () => SoundManager.playClick()

        });

        items.push({

          icon: 'ℹ️',

          text: 'About Windows XP...',

          action: () => showAboutWindowsXPDialog()

        });

      }



      return items;

    }

  }



  // 2. Window Header Tools Enhancements (Search, Folders, Views, Up, Go)

  function initWindowToolbarEnhancements() {

    document.addEventListener('click', (e) => {

      const btn = e.target.closest('button, .cursor-pointer');

      if (!btn) return;



      const img = btn.querySelector('img');

      const alt = (img?.alt || '').toLowerCase();

      const text = btn.textContent.toLowerCase();

      const winEl = btn.closest('section[id]');

      if (!winEl) return;



      // 1. Search Companion Button

      if (alt.includes('search') || text.includes('search')) {

        e.stopPropagation();

        SoundManager.playClick();

        toggleSearchCompanion(winEl);

        return;

      }



      // 2. Folders Tree Button

      if (alt.includes('folder') || text.includes('folder')) {

        e.stopPropagation();

        SoundManager.playClick();

        toggleFoldersTree(winEl);

        return;

      }



      // 3. Views Mode Button

      if (alt.includes('projects') || text.includes('views') || btn.querySelector('.down-arrow')) {

        e.stopPropagation();

        SoundManager.playClick();

        cycleWindowViews(winEl);

        return;

      }



      // 4. Address Bar "Go" Button

      if (text.includes('go') || alt.includes('go')) {

        e.stopPropagation();

        SoundManager.playClick();

        const input = winEl.querySelector('input[type="text"]');

        if (input) handleAddressGo(input.value.trim());

        return;

      }

    });



    function toggleSearchCompanion(winEl) {

      let companion = winEl.querySelector('.xp-search-companion-box');

      if (companion) {

        companion.remove();

        return;

      }



      const contentSlot = winEl.querySelector('.h-content-window, .h-full.w-full, .p-0\\.75 > div:last-child');

      if (!contentSlot) return;



      companion = document.createElement('div');

      companion.className = 'xp-search-companion-box';

      companion.innerHTML = `

        <div class="xp-rover-container">

          <div class="xp-rover-dog">🔍</div>

          <div style="font-size:10px; line-height:1.3; color:#1e3a8a;">

            <strong>Search Companion:</strong><br>What are you looking for?

          </div>

        </div>

        <div class="xp-search-input-group">

          <input type="text" placeholder="Type keyword (e.g. GraphRAG, Python)..." id="rover-search-input" />

        </div>

        <div style="font-size:9.5px; color:#475569; padding:2px;">

          Filters active projects, skills & files instantly!

        </div>

      `;



      contentSlot.style.display = 'flex';

      contentSlot.insertBefore(companion, contentSlot.firstChild);



      const input = companion.querySelector('#rover-search-input');

      input.focus();

      input.addEventListener('input', () => {

        const query = input.value.toLowerCase().trim();

        const cards = contentSlot.querySelectorAll('article, .project-card, .service-card, p, h3');

        cards.forEach(card => {

          if (!query || card.textContent.toLowerCase().includes(query)) {

            card.style.display = '';

          } else {

            card.style.display = 'none';

          }

        });

      });

    }



    function toggleFoldersTree(winEl) {

      let tree = winEl.querySelector('.xp-explorer-tree-sidebar');

      if (tree) {

        tree.remove();

        return;

      }



      const contentSlot = winEl.querySelector('.h-content-window, .h-full.w-full, .p-0\\.75 > div:last-child');

      if (!contentSlot) return;



      tree = document.createElement('div');

      tree.className = 'xp-explorer-tree-sidebar';

      tree.innerHTML = `

        <div class="xp-tree-header">

          <span>Folders</span>

          <span style="cursor:pointer;" id="close-tree-btn">✕</span>

        </div>

        <div class="xp-tree-item" data-app="myProjects"><span>📁</span><span>Flagship Projects</span></div>

        <div class="xp-tree-item" data-app="myCV"><span>📄</span><span>Curriculum Vitae</span></div>

        <div class="xp-tree-item" data-app="documents"><span>📚</span><span>Documents</span></div>

        <div class="xp-tree-item" data-app="calendar"><span>📅</span><span>Calendar & Schedule</span></div>

        <div class="xp-tree-item" data-app="music"><span>🎵</span><span>My Musics</span></div>

        <div class="xp-tree-item" data-app="pictures"><span>🖼️</span><span>Pictures & Visuals</span></div>

        <div class="xp-tree-item" data-app="terminal"><span>💻</span><span>Command Prompt</span></div>

        <div class="xp-tree-item" data-app="recyclebin"><span>🗑️</span><span>Recycle Bin</span></div>

      `;



      contentSlot.style.display = 'flex';

      contentSlot.insertBefore(tree, contentSlot.firstChild);



      tree.querySelector('#close-tree-btn').addEventListener('click', () => tree.remove());

      tree.querySelectorAll('.xp-tree-item').forEach(it => {

        it.addEventListener('click', () => {

          SoundManager.playClick();

          const target = it.dataset.app;

          if (window.__openWindow) window.__openWindow(target);

        });

      });

    }



    function cycleWindowViews(winEl) {

      const container = winEl.querySelector('.grid, .flex-wrap, .overflow-y-auto');

      if (!container) return;



      const views = ['grid-view', 'list-view', 'compact-view'];

      const current = container.dataset.currentView || 'grid-view';

      const nextIdx = (views.indexOf(current) + 1) % views.length;

      const nextView = views[nextIdx];



      container.dataset.currentView = nextView;

      if (nextView === 'list-view') {

        container.style.display = 'flex';

        container.style.flexDirection = 'column';

        container.style.gap = '8px';

      } else if (nextView === 'compact-view') {

        container.style.display = 'grid';

        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(130px, 1fr))';

      } else {

        container.style.display = '';

        container.style.flexDirection = '';

        container.style.gridTemplateColumns = '';

      }

    }



    function handleAddressGo(path) {

      const p = path.toLowerCase();

      if (p.includes('project')) {

        if (window.__openWindow) window.__openWindow('myProjects');

      } else if (p.includes('cv') || p.includes('resume')) {

        if (window.__openWindow) window.__openWindow('myCV');

      } else if (p.includes('calendar')) {

        if (window.__openWindow) window.__openWindow('calendar');

      } else if (p.includes('contact') || p.includes('mail')) {

        if (window.__openWindow) window.__openWindow('contact');

      } else if (p.includes('music')) {

        if (window.__openWindow) window.__openWindow('music');

      } else if (p.startsWith('http')) {

        window.open(path, '_blank');

      } else {

        alert(`Location '${path}' was not found in local disk.`);

      }

    }

  }



  // 3. Contact Me Interactive Toolbar Buttons (Cut, Copy, Paste, Spelling, Attach, Sign, Priority)

  
  // Native Outlook Express Toolbar Integration for LinkedIn & Description Link
  function syncMessageMeLinkedIn() {
    const contactWin = document.getElementById('contact');
    if (!contactWin) return;

    // Remove any leftover glitchy floating banner if present
    const oldBanner = contactWin.querySelector('.xp-message-me-linkedin-bar');
    if (oldBanner) oldBanner.remove();

    // Ensure active window is above desktop gadgets
    if (contactWin && (!contactWin.style.zIndex || parseInt(contactWin.style.zIndex) < 30)) {
      contactWin.style.zIndex = '35';
    }

    // 1. Add native LinkedIn toolbar button to the action toolbar right after Send
    const toolbar = contactWin.querySelector('form > div:first-child');
    if (toolbar && !toolbar.querySelector('.xp-contact-linkedin-btn')) {
      const sep = document.createElement('div');
      sep.className = 'h-full w-px bg-gray-192 mx-1 md:mx-0.5 xp-linkedin-sep';

      const btn = document.createElement('div');
      btn.className = 'flex items-center rounded-sm justify-center px-2 py-1 cursor-pointer flex-col hover:border-gray-300 hover:shadow-header-tools xp-contact-linkedin-btn';
      btn.title = 'Connect with Vedant on LinkedIn (vedant-kale-33230a28b)';
      btn.innerHTML = `
        <img src="/img/icons/side-menu/linkedin-icon.webp" alt="LinkedIn" class="w-6 h-6 object-contain" />
        <p class="text-xxs select-none">LinkedIn</p>
      `;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        SoundManager.playClick();
        window.open('https://www.linkedin.com/in/vedant-kale-33230a28b/', '_blank');
      });

      // Insert right after Send button
      const sendBtn = toolbar.querySelector('button');
      if (sendBtn && sendBtn.nextSibling) {
        toolbar.insertBefore(sep, sendBtn.nextSibling);
        toolbar.insertBefore(btn, sep.nextSibling);
      } else {
        toolbar.prepend(btn);
      }
    }

    // 2. Add clickable LinkedIn link in the description footer below the textarea
    const desc = contactWin.querySelector('p.font-trebuchet-pixel.italic') || contactWin.querySelector('p.text-xs.italic') || contactWin.querySelector('p.text-xs.font-trebuchet-pixel');
    if (desc && !desc.dataset.linkedinLinked) {
      desc.dataset.linkedinLinked = 'true';
      desc.innerHTML = `If you'd like to talk about a project, or just have a chat, leave me a message or connect directly on <a href="https://www.linkedin.com/in/vedant-kale-33230a28b/" target="_blank" rel="noopener noreferrer" style="color:#0046dd; font-weight:bold; text-decoration:underline;">LinkedIn (Vedant Kale)</a>!`;
    }
  }

  setInterval(syncMessageMeLinkedIn, 400);

  function initContactToolbarInteractivity() {

    document.addEventListener('click', (e) => {

      const contactWin = document.getElementById('contact');

      if (!contactWin) return;



      const clickedBtn = e.target.closest('div, button');

      if (!clickedBtn || !contactWin.contains(clickedBtn)) return;



      const img = clickedBtn.querySelector('img');

      const label = clickedBtn.textContent.trim().toLowerCase();

      const alt = (img?.alt || '').toLowerCase();



      const msgArea = contactWin.querySelector('textarea');

      const subjectInput = contactWin.querySelector('input[placeholder*="subject"], input:not([readonly])');



      // 1. Cut

      if (alt.includes('cut') || label === 'cut') {

        SoundManager.playClick();

        if (msgArea && msgArea.selectionStart !== msgArea.selectionEnd) {

          const sel = msgArea.value.substring(msgArea.selectionStart, msgArea.selectionEnd);

          navigator.clipboard?.writeText(sel);

          msgArea.setRangeText('');

        }

      }

      // 2. Copy

      else if (alt.includes('copy') || label === 'copy') {

        SoundManager.playClick();

        if (msgArea && msgArea.selectionStart !== msgArea.selectionEnd) {

          const sel = msgArea.value.substring(msgArea.selectionStart, msgArea.selectionEnd);

          navigator.clipboard?.writeText(sel);

        } else if (msgArea) {

          navigator.clipboard?.writeText(msgArea.value);

        }

      }

      // 3. Paste

      else if (alt.includes('paste') || label === 'paste') {

        SoundManager.playClick();

        navigator.clipboard?.readText().then(text => {

          if (text && msgArea) {

            msgArea.setRangeText(text);

          }

        }).catch(() => {});

      }

      // 4. Undo

      else if (alt.includes('undo') || label === 'undo') {

        SoundManager.playClick();

        document.execCommand('undo');

      }

      // 5. Spelling & Grammar Check

      else if (alt.includes('spelling') || label === 'spelling') {

        SoundManager.playClick();

        const content = (msgArea?.value || '').trim();

        if (!content) {

          alert('Windows XP Spell Check: Please write your message first.');

        } else {

          SoundManager.playAsterisk();

          alert('✓ Windows XP Spell Check Complete:\n\nNo spelling or grammatical errors found! Your message is clear and ready to dispatch to Vedant Kale.');

        }

      }

      // 6. Attach File

      else if (alt.includes('attach') || label === 'attach') {

        SoundManager.playClick();

        let fileInput = contactWin.querySelector('#contact-file-input');

        if (!fileInput) {

          fileInput = document.createElement('input');

          fileInput.type = 'file';

          fileInput.id = 'contact-file-input';

          fileInput.style.display = 'none';

          contactWin.appendChild(fileInput);



          fileInput.addEventListener('change', () => {

            const file = fileInput.files[0];

            if (file) {

              let chip = contactWin.querySelector('.xp-contact-attachment-chip');

              if (!chip) {

                chip = document.createElement('div');

                chip.className = 'xp-contact-attachment-chip';

                msgArea?.parentNode?.appendChild(chip);

              }

              const sizeKb = (file.size / 1024).toFixed(1);

              chip.innerHTML = `📎 <strong>${file.name}</strong> (${sizeKb} KB) <span style="cursor:pointer; color:#c00; margin-left:6px;" id="rm-att">✕</span>`;

              chip.querySelector('#rm-att').addEventListener('click', () => chip.remove());

              SoundManager.playAsterisk();

            }

          });

        }

        fileInput.click();

      }

      // 7. Priority

      else if (alt.includes('priority') || label === 'priority') {

        SoundManager.playClick();

        let pill = contactWin.querySelector('.xp-priority-indicator');

        if (!pill) {

          pill = document.createElement('span');

          pill.className = 'xp-priority-indicator';

          const toLabel = contactWin.querySelector('label');

          if (toLabel) toLabel.appendChild(pill);

        }

        const current = pill.dataset.level || 'normal';

        if (current === 'normal') {

          pill.dataset.level = 'high';

          pill.style.background = '#ffebee';

          pill.style.color = '#c62828';

          pill.style.border = '1px solid #ef9a9a';

          pill.textContent = '❗ High Priority';

        } else if (current === 'high') {

          pill.dataset.level = 'low';

          pill.style.background = '#e8f5e9';

          pill.style.color = '#2e7d32';

          pill.style.border = '1px solid #a5d6a7';

          pill.textContent = '⬇️ Low Priority';

        } else {

          pill.dataset.level = 'normal';

          pill.style.background = '#e3f2fd';

          pill.style.color = '#1565c0';

          pill.style.border = '1px solid #90caf9';

          pill.textContent = 'Normal';

        }

      }

      // 8. Sign (Professional Email Signature)

      else if (alt.includes('sign') || label === 'sign') {

        SoundManager.playClick();

        if (msgArea) {

          const signText = '\n\n--\nBest regards,\n[Your Name / Recruiter]\nSent via Vedant Kale\'s Windows XP Desktop Portfolio';

          if (!msgArea.value.includes('--')) {

            msgArea.value += signText;

            msgArea.dispatchEvent(new Event('input', { bubbles: true }));

          }

        }

      }

    });

  }



  // 4. Windows XP Authentic Shutdown & Log Off Dialogs

  function initShutdownAndLogoff() {

    // Intercept with capture: true to prevent Vue Router navigation on router-link buttons

    document.addEventListener('click', (e) => {

      // 1. Intercept Start Menu footer: Turn Off and Log Off

      const btn = e.target.closest('.buttons-header-bottom, a[href="/"], button, div');

      if (btn) {

        const text = (btn.textContent || '').trim().toLowerCase();

        const imgAlt = (btn.querySelector('img')?.getAttribute('alt') || '').toLowerCase();



        if (text === 'turn off computer' || text.includes('turn off') || text.includes('éteindre') || imgAlt.includes('turn off') || imgAlt.includes('shutdown')) {

          e.preventDefault();

          e.stopPropagation();

          SoundManager.playClick();

          showShutdownDialog();

          return;

        }



        if (text === 'log off' || text.includes('log off') || text.includes('déconnecter') || imgAlt.includes('log') || imgAlt.includes('key-log')) {

          e.preventDefault();

          e.stopPropagation();

          SoundManager.playClick();

          showLogoffDialog();

          return;

        }

      }



      // 2. Intercept Start Menu top profile header (Vedant Kale avatar/name) -> opens About dialog

      const profileHeader = e.target.closest('.header-top-background, .bg-profile-pic, .text-shadow-header');

      if (profileHeader) {

        e.stopPropagation();

        SoundManager.playClick();

        showAboutWindowsXPDialog();

        return;

      }

    }, true);



    // Turn Off Computer Dialog

    window.showShutdownDialog = function() {

      if (document.querySelector('.xp-shutdown-backdrop')) return;



      const backdrop = document.createElement('div');

      backdrop.className = 'xp-shutdown-backdrop';



      backdrop.innerHTML = `

        <div class="xp-shutdown-box">

          <div class="xp-shutdown-header">

            <span class="xp-shutdown-title">Turn off computer</span>

            <span style="font-size:12px; font-weight:bold; color:#ffddaa; letter-spacing:0.5px;">Windows XP</span>

          </div>

          <div class="xp-shutdown-body">

            <div class="xp-shutdown-btn-group" id="shutdown-act-standby" title="Put system on standby">

              <div class="xp-shutdown-circle standby">💤</div>

              <span class="xp-shutdown-label">Stand By</span>

            </div>

            <div class="xp-shutdown-btn-group" id="shutdown-act-turnoff" title="Turn off and power down">

              <div class="xp-shutdown-circle turnoff">⏻</div>

              <span class="xp-shutdown-label">Turn Off</span>

            </div>

            <div class="xp-shutdown-btn-group" id="shutdown-act-restart" title="Restart system">

              <div class="xp-shutdown-circle restart">🔄</div>

              <span class="xp-shutdown-label">Restart</span>

            </div>

          </div>

          <div class="xp-shutdown-footer">

            <button class="xp-shutdown-cancel-btn" id="shutdown-btn-cancel">Cancel</button>

          </div>

        </div>

      `;



      document.body.appendChild(backdrop);



      backdrop.querySelector('#shutdown-btn-cancel').addEventListener('click', () => {

        SoundManager.playClick();

        backdrop.remove();

      });



      backdrop.querySelector('#shutdown-act-standby').addEventListener('click', () => {

        backdrop.remove();

        triggerStandbyMode();

      });



      backdrop.querySelector('#shutdown-act-turnoff').addEventListener('click', () => {

        backdrop.remove();

        triggerPowerOff();

      });



      backdrop.querySelector('#shutdown-act-restart').addEventListener('click', () => {

        backdrop.remove();

        triggerRestart();

      });

    };



    // Log Off Windows Dialog

    window.showLogoffDialog = function() {

      if (document.querySelector('.xp-shutdown-backdrop')) return;



      const backdrop = document.createElement('div');

      backdrop.className = 'xp-shutdown-backdrop';



      backdrop.innerHTML = `

        <div class="xp-shutdown-box" style="width:360px;">

          <div class="xp-shutdown-header" style="background:linear-gradient(180deg, #0947ba 0%, #1562e8 100%);">

            <span class="xp-shutdown-title">Log Off Windows</span>

            <span style="font-size:12px; font-weight:bold; color:#ffddaa;">Windows XP</span>

          </div>

          <div class="xp-shutdown-body" style="justify-content:center; gap:36px; padding:28px 20px;">

            <div class="xp-shutdown-btn-group" id="logoff-act-switch" title="Switch User">

              <div class="xp-shutdown-circle standby" style="background:linear-gradient(180deg, #ff9900 0%, #d87000 100%); border-color:#ffa500; font-size:22px;">👥</div>

              <span class="xp-shutdown-label">Switch User</span>

            </div>

            <div class="xp-shutdown-btn-group" id="logoff-act-logoff" title="Log Off Vedant">

              <div class="xp-shutdown-circle restart" style="background:linear-gradient(180deg, #2b78e4 0%, #0c4bb2 100%); border-color:#5599ff; font-size:22px;">🔑</div>

              <span class="xp-shutdown-label">Log Off</span>

            </div>

          </div>

          <div class="xp-shutdown-footer">

            <button class="xp-shutdown-cancel-btn" id="logoff-btn-cancel">Cancel</button>

          </div>

        </div>

      `;



      document.body.appendChild(backdrop);



      backdrop.querySelector('#logoff-btn-cancel').addEventListener('click', () => {

        SoundManager.playClick();

        backdrop.remove();

      });



      backdrop.querySelector('#logoff-act-switch').addEventListener('click', () => {

        backdrop.remove();

        triggerLogonScreen('switch');

      });



      backdrop.querySelector('#logoff-act-logoff').addEventListener('click', () => {

        backdrop.remove();

        triggerLogonScreen('logoff');

      });

    };



    function triggerLogonScreen(mode) {

      SoundManager.playShutdown();

      const logon = document.createElement('div');

      logon.id = 'xp-logon-screen';

      logon.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:linear-gradient(180deg, #001e6c 0%, #003399 50%, #001e6c 100%); z-index:10000000; display:flex; flex-direction:column; justify-content:space-between; font-family:Tahoma; color:#fff;';

      

      logon.innerHTML = `

        <div style="height:60px; background:#00174e; border-bottom:2px solid #5388cc; display:flex; align-items:center; justify-content:space-between; px:20px; padding:0 24px;">

          <div style="font-size:20px; font-weight:bold; letter-spacing:0.5px;">

            Microsoft <span style="color:#418cf0;">Windows</span><span style="color:#ff6600;">XP</span>

          </div>

          <div style="font-size:12px; color:#8cb8e6;">Professional Edition</div>

        </div>

        

        <div style="display:flex; align-items:center; justify-content:center; flex:1; gap:60px;">

          <div style="text-align:right; border-right:1px solid rgba(255,255,255,0.25); padding-right:40px;">

            <div style="font-size:24px; font-weight:bold; color:#ffddaa; margin-bottom:6px;">Welcome</div>

            <div style="font-size:12px; color:#cce0ff;">To begin, click your user name</div>

          </div>



          <div id="xp-logon-user-card" style="display:flex; align-items:center; gap:16px; padding:12px 24px; border-radius:8px; cursor:pointer; background:rgba(255,255,255,0.08); border:2px solid rgba(255,255,255,0.2); transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.18)'; this.style.borderColor='#ffaa00';" onmouseout="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(255,255,255,0.2)';">

            <div style="width:54px; height:54px; border-radius:6px; background:#fff url('/img/icons/icon-profile-user.webp') no-repeat center/cover; border:2px solid #ffcc00; box-shadow:0 0 8px rgba(0,0,0,0.4);"></div>

            <div>

              <div style="font-size:16px; font-weight:bold; color:#fff;">Vedant Kale</div>

              <div style="font-size:11px; color:#ffddaa;">Software Development Engineer</div>

              <div style="font-size:10px; color:#8cb8e6; margin-top:2px;">(Click to Log On)</div>

            </div>

          </div>

        </div>



        <div style="height:60px; background:#00174e; border-top:2px solid #5388cc; display:flex; align-items:center; justify-content:space-between; padding:0 24px;">

          <button id="xp-logon-turnoff-btn" style="background:transparent; border:none; color:#ffcc66; font-size:12px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:6px;">

            <span style="background:#cc2200; color:#fff; width:22px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px;">⏻</span>

            Turn off computer

          </button>

          <div style="font-size:11px; color:#6699cc;">After you log on, your programs will remain open.</div>

        </div>

      `;



      document.body.appendChild(logon);



      // Click user to log back on

      logon.querySelector('#xp-logon-user-card').addEventListener('click', () => {

        logon.style.opacity = '0';

        logon.style.transition = 'opacity 0.4s ease';

        SoundManager.playStartup();

        setTimeout(() => logon.remove(), 400);

      });



      // Turn off button from logon screen

      logon.querySelector('#xp-logon-turnoff-btn').addEventListener('click', () => {

        logon.remove();

        showShutdownDialog();

      });

    }



    function triggerStandbyMode() {

      const cur = document.createElement('div');

      cur.id = 'xp-standby-screen';

      cur.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000; z-index:10000000; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#555; font-family:Tahoma; font-size:12px;';

      cur.innerHTML = '<span>(System in Standby Mode - Click or press any key to resume)</span>';

      document.body.appendChild(cur);



      const resume = () => {

        SoundManager.playStartup();

        cur.remove();

        window.removeEventListener('keydown', resume);

      };

      cur.addEventListener('click', resume);

      window.addEventListener('keydown', resume);

    }



    function triggerPowerOff() {

      SoundManager.playShutdown();

      const off = document.createElement('div');

      off.id = 'xp-power-off-screen';

      off.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000000; z-index:10000000; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px;';

      off.innerHTML = `

        <div style="font-family:'Trebuchet MS', Tahoma; font-size:24px; color:#ff8800; font-weight:bold; letter-spacing:1px; text-shadow:0 0 10px rgba(255,136,0,0.6);">

          It is now safe to turn off your computer.

        </div>

        <button id="xp-power-on-btn" style="background:#0055ea; color:#fff; border:2px solid #fff; padding:10px 24px; border-radius:4px; font-family:Tahoma; font-weight:bold; cursor:pointer; font-size:14px; box-shadow:0 0 15px rgba(0,85,234,0.8);">

          ⏻ Turn Back On

        </button>

      `;

      document.body.appendChild(off);



      off.querySelector('#xp-power-on-btn').addEventListener('click', () => {

        off.remove();

        SoundManager.playStartup();

      });

    }



    function triggerRestart() {

      SoundManager.playShutdown();

      const restartScreen = document.createElement('div');

      restartScreen.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000; z-index:10000000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; font-family:Tahoma;';

      restartScreen.innerHTML = `

        <div style="font-size:28px; font-weight:bold; margin-bottom:15px; color:#fff;">

          Microsoft <span style="color:#2a75d3;">Windows</span><span style="color:#d83b01;">XP</span>

        </div>

        <div style="width:160px; height:10px; border:1px solid #555; border-radius:4px; overflow:hidden; position:relative; background:#111;">

          <div style="width:35px; height:100%; background:linear-gradient(90deg, #2a75d3, #55aaff); position:absolute; animation:xpBootScan 1.2s infinite linear;"></div>

        </div>

        <style>@keyframes xpBootScan { 0% { left:-35px; } 100% { left:160px; } }</style>

      `;

      document.body.appendChild(restartScreen);



      setTimeout(() => {

        restartScreen.remove();

        SoundManager.playStartup();

      }, 2400);

    }

  }



  // 5. System Tray Interactive Popups (Volume, Network, Clock)

  function initSystemTrayControls() {
      
    

    let volumePopup = null;



    document.addEventListener('click', (e) => {

      // Volume / Speaker Icon
      const speakerIcon = e.target.closest('img[src*="volume-icon-sm"], img[src*="mute-icon-sm"], [title*="Volume"]');
      if (speakerIcon) {
        SoundManager.playClick();
      }



      // Fullscreen Icon

      const fsIcon = e.target.closest('img[src*="full-screen"]');

      if (fsIcon) {

        e.stopPropagation();

        SoundManager.playClick();

        toggleFullScreen();

        return;

      }



      // Network Icon

      const netIcon = e.target.closest('img[src*="lan"], img[src*="network"], img[src*="wifi"]');

      if (netIcon) {

        e.stopPropagation();

        SoundManager.playClick();

        showNetworkStatusDialog();

        return;

      }






      // Clock / Time in Taskbar

      const clockEl = e.target.closest('.text-xxs.md\\:text-xs.cursor-default, [class*="CurrentTime"]');

      if (clockEl) {

        e.stopPropagation();

        SoundManager.playClick();

        if (window.__openWindow) window.__openWindow('calendar');

        return;

      }



      // Close volume popup if clicked outside

      if (volumePopup && !e.target.closest('.xp-tray-volume-popup')) {

        volumePopup.remove();

        volumePopup = null;

      }

    });



        function initVolumeModalObserver() {
      function enhanceModal(modal) {
        if (!modal || modal.dataset.xpEnhanced === 'true') return;
        modal.dataset.xpEnhanced = 'true';

        // 1. Title
        const h4 = modal.querySelector('h4');
        if (h4) h4.textContent = 'Volume';

        // 2. Slider
        const slider = modal.querySelector('input.slider, input[type="range"]');
        if (slider) {
          slider.min = '0';
          slider.max = '1';
          slider.step = '0.02';
          slider.value = VolumeManager.getVolume().toString();

          slider.addEventListener('input', (ev) => {
            const v = parseFloat(ev.target.value);
            VolumeManager.setVolume(v, false);
          });

          slider.addEventListener('change', () => {
            SoundManager.playClick();
          });
        }

        // 3. Adjust container layout so Mute checkbox & percentage are clearly visible
        const container = modal.querySelector('div.bg-light-yellow') || modal;
        if (container) {
          container.style.height = 'auto';
          container.style.paddingBottom = '6px';
          const innerFlex = container.querySelector('.h-full');
          if (innerFlex) {
            innerFlex.classList.remove('h-full');
            innerFlex.style.height = '130px';
          }
        }
        if (container && !modal.querySelector('#xp-tray-vol-text')) {
          const infoDiv = document.createElement('div');
          infoDiv.style.cssText = 'padding: 4px 6px; text-align: center; border-top: 1px solid #d4d0c8; margin-top: 4px;';
          
          const isMuted = VolumeManager.isMuted();
          const curVol = Math.round(VolumeManager.getVolume() * 100);

          infoDiv.innerHTML = `
            <div id="xp-tray-vol-text" style="font-weight:bold; font-size:11px; color:#1e3a8a; margin-bottom:4px;">
              ${isMuted ? 'Muted' : curVol + '%'}
            </div>
            <label style="display:flex; align-items:center; justify-content:center; gap:5px; font-size:11px; font-family:'Tahoma',sans-serif; cursor:pointer; color:#111;">
              <input type="checkbox" id="xp-tray-vol-mute-checkbox" ${isMuted ? 'checked' : ''} style="cursor:pointer;" />
              <span>Mute</span>
            </label>
          `;
          container.appendChild(infoDiv);

          const muteBox = infoDiv.querySelector('#xp-tray-vol-mute-checkbox');
          muteBox.addEventListener('change', (ev) => {
            VolumeManager.setVolume(slider ? slider.value : VolumeManager.getVolume(), ev.target.checked);
            SoundManager.playClick();
          });
        }
      }

      // Check right now if modal is already open
      const existing = document.querySelector('section.bg-window-blue-deactivated');
      if (existing) enhanceModal(existing);

      // Watch for modal being opened
      const obs = new MutationObserver(() => {
        const m = document.querySelector('section.bg-window-blue-deactivated');
        if (m) enhanceModal(m);
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
    initVolumeModalObserver();

    function showNetworkStatusDialog() {

      SoundManager.playAsterisk();

      alert(`🌐 Local Area Connection Status\n\nStatus: Connected\nDuration: Active Session\nSpeed: 1.0 Gbps\nBytes Sent: 24,892 KB\nBytes Received: 198,421 KB\nIP Address: 192.168.1.244\n\nAll portfolio services (GraphRAG, FastAPI, Audio Engine) are fully operational.`);

    }

  }



  // 6. About Windows XP Dialog

  window.showAboutWindowsXPDialog = function() {

    if (document.querySelector('.xp-about-overlay')) return;



    SoundManager.playAsterisk();

    const overlay = document.createElement('div');

    overlay.className = 'xp-about-overlay';



    overlay.innerHTML = `

      <div class="xp-about-window">

        <div class="xp-about-banner">

          <div>

            <div class="xp-about-banner-title">Microsoft® Windows® XP</div>

            <div class="xp-about-banner-sub">Professional Edition (Portfolio Edition 2026)</div>

          </div>

          <div style="font-size:26px;">🪟</div>

        </div>

        <div class="xp-about-body">

          <div style="font-weight:bold; font-size:12px; color:#0f172a;">

            Vedant Kale — Software Development Engineer

          </div>

          <div>

            Final-year B.Tech Computer Science student specializing in backend systems, high-performance APIs, distributed caching, and GraphRAG knowledge graphs.

          </div>

          <div class="xp-about-sys-box">

            <strong>System Specifications:</strong><br>

            • Kernel: Windows XP Professional v5.1 (Build 2600.xpsp_sp3_gdr)<br>

            • Flagship Systems: GraphRAG, ArthaSEC, Malware AI Detector<br>

            • Core Stack: Python, FastAPI, PyTorch, Neo4j, Redis, Docker, Vue.js<br>

            • Physical Memory: 16,384 MB High-Performance System RAM<br>

            • Status: Open for Software Engineering Opportunities (2026/2027)

          </div>

          <div style="font-size:10px; color:#64748b;">

            This product is licensed to: Vedant Kale (kalevedant750@gmail.com).<br>

            Portfolio architecture inspired by retro computing excellence.

          </div>

        </div>

        <div class="xp-about-footer">

          <button class="xp-btn primary" id="about-btn-ok" style="min-width:70px;">OK</button>

        </div>

      </div>

    `;



    document.body.appendChild(overlay);



    overlay.querySelector('#about-btn-ok').addEventListener('click', () => {

      SoundManager.playClick();

      overlay.remove();

    });

    overlay.addEventListener('click', (e) => {

      if (e.target === overlay) overlay.remove();

    });

  };



  function toggleFullScreen() {

    if (!document.fullscreenElement) {

      document.documentElement.requestFullscreen().catch(() => {});

    } else {

      document.exitFullscreen().catch(() => {});

    }

  }





  
  window.__DesktopPet = null;


function removeStalePetElements() {
    const turtleContainer = document.getElementById('xp-cursor-turtle-container');
    if (turtleContainer) turtleContainer.remove();
    const turtleTrayBtn = document.getElementById('xp-tray-turtle-toggle');
    if (turtleTrayBtn) turtleTrayBtn.remove();
    const el = document.getElementById('xp-desktop-pet-container');
    if (el) el.remove();
    const btn = document.getElementById('xp-tray-pet-toggle');
    if (btn) btn.remove();
  }
  removeStalePetElements();
  setInterval(removeStalePetElements, 2000);

  function initEnhancements() {
    handleSessionLifecycle();


    // 1. Apply persisted theme & wallpaper

    applyTheme(state.theme);

    applyWallpaper(state.wallpaper, state.customWallpaperUrl);

    applyCrt(state.crtEffect);



    // 2. Setup Desktop Gadgets, Clippy AI Assistant & Desktop Context Menu

    
  // --------------------------------------------------------------------------
  // REGIONAL & LANGUAGE OPTIONS DIALOG & INDIAN FLAG TRAY HANDLER
  // --------------------------------------------------------------------------
  function showRegionalLanguageDialog() {
    let existing = document.getElementById('xp-regional-modal');
    if (existing) {
      existing.style.display = 'flex';
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'xp-regional-modal';
    modal.className = 'xp-regional-modal-overlay';

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    const dateStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const longDateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    modal.innerHTML = `
      <div class="xp-regional-dialog">
        <div class="xp-reg-titlebar">
          <div style="display:flex; align-items:center; gap:6px;">
            <img src="/img/icons/langs/flag-in.webp" style="width:16px; height:11px; border:1px solid #fff;" alt="India">
            <span>Regional and Language Options</span>
          </div>
          <button class="xp-reg-close-btn" id="reg-close-btn">✕</button>
        </div>

        <div class="xp-reg-tabs">
          <div class="xp-reg-tab active">Regional Options</div>
          <div class="xp-reg-tab">Languages</div>
          <div class="xp-reg-tab">Advanced</div>
        </div>

        <div class="xp-reg-body">
          <fieldset class="xp-reg-group">
            <legend class="xp-reg-legend">Standards and formats</legend>
            <p style="margin:2px 0 6px 0; color:#333;">This option affects how some programs format numbers, currencies, dates, and time.</p>
            <div style="margin-bottom:8px;">
              <select style="width:100%; padding:3px; font-family:Tahoma; font-size:11px;">
                <option selected>English (India) - [hi-IN / en-IN]</option>
                <option>Hindi (India)</option>
                <option>English (United States)</option>
              </select>
            </div>
            <div style="background:#fff; border:1px solid #7f9db9; padding:8px; border-radius:3px; display:flex; flex-direction:column; gap:4px; font-size:10.5px;">
              <div><strong>Time sample:</strong> <span style="color:#0055ea;">${timeStr}</span></div>
              <div><strong>Short date sample:</strong> <span style="color:#0055ea;">${dateStr}</span></div>
              <div><strong>Long date sample:</strong> <span style="color:#0055ea;">${longDateStr}</span></div>
              <div><strong>Time Zone:</strong> (UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</div>
            </div>
          </fieldset>

          <fieldset class="xp-reg-group">
            <legend class="xp-reg-legend">Location</legend>
            <p style="margin:2px 0 6px 0; color:#333;">To help services provide you with local information, select your current location:</p>
            <select style="width:100%; padding:3px; font-family:Tahoma; font-size:11px;">
              <option selected>India (Pune, Maharashtra)</option>
            </select>
          </fieldset>
        </div>

        <div class="xp-reg-buttons">
          <button class="xp-run-btn xp-run-btn-primary" id="reg-btn-ok">OK</button>
          <button class="xp-run-btn" id="reg-btn-cancel">Cancel</button>
          <button class="xp-run-btn" id="reg-btn-apply">Apply</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
      SoundManager.playClick();
      modal.remove();
    };

    modal.querySelector('#reg-close-btn').addEventListener('click', closeModal);
    modal.querySelector('#reg-btn-ok').addEventListener('click', closeModal);
    modal.querySelector('#reg-btn-cancel').addEventListener('click', closeModal);
    modal.querySelector('#reg-btn-apply').addEventListener('click', () => {
      SoundManager.playClick();
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function initIndianFlagTray() {
    const updateFlags = () => {
      const flagImgs = document.querySelectorAll('img[src*="flag-"]');
      flagImgs.forEach(img => {
        if (!img.src.includes('flag-in.webp') && !img.src.includes('flag-en.webp')) {
          img.src = '/img/icons/langs/flag-in.webp';
        }
        img.alt = 'English (India) - IST';
        img.title = 'English (India) - Indian Standard Time (IST)';
        img.style.cursor = 'pointer';

        if (!img.dataset.hasIndianHandler) {
          img.dataset.hasIndianHandler = 'true';
          img.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            SoundManager.playClick();
            showRegionalLanguageDialog();
          });
        }
      });
    };

    updateFlags();
    setInterval(updateFlags, 1500);
  }

  // --------------------------------------------------------------------------
  // CERTIFICATIONS SHOWCASE IN MY PROJECTS (NO VIDEO, AUTHENTIC CREDENTIALS)
  // --------------------------------------------------------------------------
  function createCertificationsShowcaseHTML() {
    return `
      <div class="certifications-showcase-wrap">
        <div class="cert-hero">
          <div class="cert-hero-badge">Verified Credentials</div>
          <h2 class="cert-hero-title">Professional Certifications &amp; Competitive Ranks</h2>
          <p class="cert-hero-sub">Specializations in Data Structures &amp; Algorithms, Full-Stack Architecture, and System Design</p>
        </div>

        <div class="cert-cards-list">
          <!-- 1. Amazon DSA Specialization -->
          <div class="cert-item-card">
            <div class="cert-item-icon">📜</div>
            <div class="cert-item-content">
              <div class="cert-item-top">
                <span class="cert-item-name">Data Structures and Algorithms Specialization</span>
                <span class="cert-item-issuer">Amazon / Coursera (2025)</span>
              </div>
              <p class="cert-item-desc">Advanced algorithmic paradigms, dynamic programming, divide-and-conquer, greedy techniques, graph algorithms, and NP-complete complexity analysis.</p>
              <div class="cert-item-tags">
                <span class="cert-tag">Graph Algorithms</span>
                <span class="cert-tag">Dynamic Programming</span>
                <span class="cert-tag">Complexity Analysis</span>
                <span class="cert-tag">Greedy Paradigms</span>
              </div>
            </div>
          </div>

          <!-- 2. Full-Stack Web Development -->
          <div class="cert-item-card">
            <div class="cert-item-icon">🌐</div>
            <div class="cert-item-content">
              <div class="cert-item-top">
                <span class="cert-item-name">The Complete Full-Stack Web Development Bootcamp</span>
                <span class="cert-item-issuer">Udemy (2026)</span>
              </div>
              <p class="cert-item-desc">Comprehensive full-stack engineering covering modern React, Node.js, Express, RESTful APIs, PostgreSQL, Docker containerization, and async state management.</p>
              <div class="cert-item-tags">
                <span class="cert-tag">React / TypeScript</span>
                <span class="cert-tag">Node.js / Express</span>
                <span class="cert-tag">PostgreSQL</span>
                <span class="cert-tag">Docker</span>
              </div>
            </div>
          </div>

          <!-- 3. Software Design & Architecture -->
          <div class="cert-item-card">
            <div class="cert-item-icon">🏛️</div>
            <div class="cert-item-content">
              <div class="cert-item-top">
                <span class="cert-item-name">Software Design &amp; Architecture Specialization</span>
                <span class="cert-item-issuer">University of Alberta / Coursera</span>
              </div>
              <p class="cert-item-desc">Object-oriented design patterns (GoF), SOLID principles, enterprise microservices architectures, domain-driven design, and clean code methodologies.</p>
              <div class="cert-item-tags">
                <span class="cert-tag">Design Patterns</span>
                <span class="cert-tag">Microservices</span>
                <span class="cert-tag">Clean Architecture</span>
                <span class="cert-tag">OOP</span>
              </div>
            </div>
          </div>

          <!-- 4. Competitive Coding Credentials -->
          <div class="cert-item-card cert-coding-card">
            <div class="cert-item-icon">🏆</div>
            <div class="cert-item-content">
              <div class="cert-item-top">
                <span class="cert-item-name">Competitive Programming &amp; Problem Solving</span>
                <span class="cert-item-issuer">CodeChef &amp; LeetCode</span>
              </div>
              <div class="cert-ratings-row">
                <div class="rating-badge">
                  <span class="rating-value">1,824</span>
                  <span class="rating-title">CodeChef (3-Star &bull; Top 5%)</span>
                </div>
                <div class="rating-badge">
                  <span class="rating-value">1,480</span>
                  <span class="rating-title">LeetCode Rating (150+ Solved)</span>
                </div>
              </div>
              <p class="cert-item-desc">Demonstrated algorithmic speed and accuracy in high-stress contest environments across dynamic programming, binary search, trees, and graph algorithms.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

    function initCertificationsEnhancement() {
    const checkCertifications = () => {
      const myProjects = document.getElementById('myProjects');
      if (!myProjects) return;

      const placeholder = myProjects.querySelector('#xp-certifications-placeholder');
      if (placeholder) {
        const sec = placeholder.closest('section') || placeholder.parentElement;
        if (sec && !sec.dataset.certRendered) {
          sec.dataset.certRendered = 'true';
          sec.innerHTML = createCertificationsShowcaseHTML();
        }
      }
    };

    setInterval(checkCertifications, 200);
  }

initDesktopGadgets();
    initClippyAssistant();
    initDesktopContextMenu();
    initDesktopDraggableAndMenus();
    initIndianFlagTray();
    initStickyNotes();
    initCertificationsEnhancement();

    const ensureDesktopLifecycle = () => {
      const desktopBg = document.querySelector('.bg-office-pic') || document.querySelector('section.h-svh') || document.querySelector('section');
      if (desktopBg) {
        if (!document.getElementById('xp-desktop-clock-gadget') || !document.getElementById('xp-desktop-calendar-gadget')) {
          initDesktopGadgets();
        }
        if (!document.getElementById('xp-desktop-stickynote')) {
          initStickyNotes();
        }
        if (!document.getElementById('xp-clippy-assistant-root')) {
          initClippyAssistant();
        }

        const clockEl = document.getElementById('xp-desktop-clock-gadget');
        if (clockEl) {
          if (clockEl.style.display === 'none') clockEl.style.display = 'block';
          if (!desktopBg.contains(clockEl)) desktopBg.appendChild(clockEl);
        }
        const calEl = document.getElementById('xp-desktop-calendar-gadget');
        if (calEl) {
          if (calEl.style.display === 'none') calEl.style.display = 'block';
          if (!desktopBg.contains(calEl)) desktopBg.appendChild(calEl);
        }
        const noteEl = document.getElementById('xp-desktop-stickynote');
        if (noteEl && !desktopBg.contains(noteEl)) {
          desktopBg.appendChild(noteEl);
        }

        // Anti-overlap guarantee: If Clock overlaps Sticky Note or Calendar, snap Clock directly above Calendar!
        if (clockEl && noteEl && clockEl.dataset.isDragging !== 'true' && noteEl.dataset.isDragging !== 'true') {
          const cRect = clockEl.getBoundingClientRect();
          const nRect = noteEl.getBoundingClientRect();
          const isOverlapping = !(cRect.right < nRect.left || cRect.left > nRect.right || cRect.bottom < nRect.top || cRect.top > nRect.bottom);
          if (isOverlapping) {
            clockEl.style.left = 'auto';
            clockEl.style.right = '49px';
            clockEl.style.top = '20px';
            try { localStorage.removeItem('xp_clock_pos'); } catch(e) {}
          }
        }
        if (clockEl && calEl && clockEl.dataset.isDragging !== 'true' && calEl.dataset.isDragging !== 'true') {
          const cRect = clockEl.getBoundingClientRect();
          const calRect = calEl.getBoundingClientRect();
          const isOverlappingCal = !(cRect.right < calRect.left || cRect.left > calRect.right || cRect.bottom < calRect.top || cRect.top > calRect.bottom);
          if (isOverlappingCal) {
            clockEl.style.left = 'auto';
            clockEl.style.right = '49px';
            clockEl.style.top = '20px';
            try { localStorage.removeItem('xp_clock_pos'); } catch(e) {}
          }
        }

        // Permanently unhide all portfolio apps on desktop
        document.querySelectorAll('section.absolute.top-0.left-0 button').forEach(b => {
          b.classList.remove('xp-app-deleted');
          if (!b.classList.contains('desktop-icon-draggable')) {
            b.classList.add('desktop-icon-draggable');
          }
          b.style.opacity = '1';
          b.style.visibility = 'visible';
          if (b.style.display === 'none') {
            b.style.display = 'flex';
          }
        });

        const unhooked = document.querySelector('section.absolute.top-0.left-0 button:not([data-drag-bound]), button.desktop-icon-draggable:not([data-drag-bound])');
        if (unhooked) {
          initDesktopDraggableAndMenus();
        }

        // Enforce saved or canonical position for desktop icons so they NEVER drift or vanish
        const savedPositions = getCustomPositions();
        const DEFAULT_CANONICAL_POSITIONS = {
          'myProjects': { x: 20, y: 20 },
          'pictures': { x: 20, y: 106 },
          'myCV': { x: 20, y: 192 },
          'music': { x: 20, y: 278 },
          'minesweeper': { x: 20, y: 364 },
          'notepad': { x: 20, y: 450 },
          'doom': { x: 20, y: 536 },
          'terminal': { x: 104, y: 20 },
          'settings': { x: 104, y: 106 },
          'recyclebin': { x: 104, y: 192 },
          'paint': { x: 104, y: 278 },
          'pinball': { x: 104, y: 364 },
          'stickynotes': { x: 104, y: 450 },
          'services': { x: 104, y: 536 }
        };

        document.querySelectorAll('section.absolute.top-0.left-0 button, button.desktop-icon-draggable').forEach(btn => {
          if (btn.dataset.isDragging === 'true') return;
          const info = resolveAppFromButton(btn);
          if (!info) return;
          const pos = savedPositions[info.id] || DEFAULT_CANONICAL_POSITIONS[info.id];
          if (pos && typeof pos.x === 'number') {
            const curX = parseFloat(btn.style.left);
            const curY = parseFloat(btn.style.top);
            if (isNaN(curX) || Math.abs(curX - pos.x) > 1 || Math.abs(curY - pos.y) > 1) {
              btn.style.position = 'absolute';
              btn.style.left = pos.x + 'px';
              btn.style.top = pos.y + 'px';
            }
          }
        });

        initIndianFlagTray();
        initCertificationsEnhancement();
      } else {
        const strayNote = document.getElementById('xp-desktop-stickynote');
        if (strayNote) strayNote.remove();
        const strayClock = document.getElementById('xp-desktop-clock-gadget');
        if (strayClock) strayClock.remove();
        const strayCal = document.getElementById('xp-desktop-calendar-gadget');
        if (strayCal) strayCal.remove();
        const strayClippy = document.getElementById('xp-clippy-assistant-root');
        if (strayClippy) strayClippy.remove();
      }
    };

    ensureDesktopLifecycle();
    setInterval(ensureDesktopLifecycle, 400);

    initUniversalWindowMenus();

    initWindowToolbarEnhancements();

    initContactToolbarInteractivity();

    initShutdownAndLogoff();

    initSystemTrayControls();
    VolumeManager.applyVolume(VolumeManager.getVolume(), VolumeManager.isMuted());



// Auto-open disabled on refresh



    // 3. Monitor click sounds

    document.addEventListener('click', (e) => {

      if (e.target.closest('button, .service-card, .wallpaper-card, input[type="checkbox"], input[type="radio"]')) {

        SoundManager.playClick();

      }

    });



    // 4. MutationObserver to inject Settings content if window mounts

    const observer = new MutationObserver(() => {





      // Paint Window Injection

      const paintWin = document.getElementById('paint');

      if (paintWin && !paintWin.dataset.initialized) {

        const bodySlot = paintWin.querySelector('.h-content-headless-toolbox') || paintWin.querySelector('.h-content-window') || paintWin.querySelector('.h-full.w-full') || paintWin.querySelector('.p-0\\.75 > div:last-child');

        if (bodySlot) {

          paintWin.dataset.initialized = 'true';

          bodySlot.innerHTML = createPaintHTML();

          bodySlot.style.height = 'calc(100% - 2.5rem)';

          bodySlot.style.overflow = 'hidden';

          bodySlot.style.backgroundColor = '#ece9d8';

          bindPaintEvents(bodySlot);

        }

      }



      // Recycle Bin Window Injection

      const recycleWin = document.getElementById('recyclebin');

      if (recycleWin && !recycleWin.dataset.initialized) {

        const bodySlot = recycleWin.querySelector('.h-content-headless-toolbox') || recycleWin.querySelector('.h-content-window') || recycleWin.querySelector('.h-full.w-full') || recycleWin.querySelector('.p-0\\.75 > div:last-child');

        if (bodySlot) {

          recycleWin.dataset.initialized = 'true';

          bodySlot.innerHTML = createRecycleBinHTML();

          bodySlot.style.height = 'calc(100% - 2.5rem)';

          bodySlot.style.overflow = 'hidden';

          bodySlot.style.backgroundColor = '#ece9d8';

          bindRecycleBinEvents(bodySlot);

        }

      }



      // 3D Pinball Window Injection

      const pinballWin = document.getElementById('pinball');

      if (pinballWin && !pinballWin.dataset.initialized) {

        const bodySlot = pinballWin.querySelector('.h-content-headless-toolbox') || pinballWin.querySelector('.h-content-window') || pinballWin.querySelector('.h-full.w-full') || pinballWin.querySelector('.p-0\\.75 > div:last-child');

        if (bodySlot) {

          pinballWin.dataset.initialized = 'true';

          bodySlot.innerHTML = createPinballHTML();

          bodySlot.style.height = 'calc(100% - 2.5rem)';

          bodySlot.style.overflow = 'hidden';

          bodySlot.style.backgroundColor = '#000000';

          bindPinballEvents(bodySlot);

        }

      }



      // Calendar Window Injection
      const calWin = document.getElementById('calendar');
      if (calWin && !calWin.dataset.initialized) {
        const bodySlot = calWin.querySelector('.h-content-headless-toolbox') || calWin.querySelector('.h-content-window') || calWin.querySelector('.h-full.w-full') || calWin.querySelector('.p-0\\.75 > div:last-child');
        if (bodySlot) {
          calWin.dataset.initialized = 'true';
          const availHeight = window.innerHeight - 35;
          const targetW = Math.min(860, window.innerWidth - 40);
          const targetH = Math.min(580, availHeight - 50);
          calWin.style.width = targetW + 'px';
          calWin.style.height = targetH + 'px';

          // Maintain smooth centered position without layout shift
          if (!calWin.style.transform && !calWin.style.top) {
            calWin.style.top = Math.max(40, Math.floor((availHeight - targetH) / 2)) + 'px';
            calWin.style.left = Math.max(30, Math.floor((window.innerWidth - targetW) / 2)) + 'px';
          }
          if (window.__highestZIndex) {
            calWin.style.zIndex = ++window.__highestZIndex;
          }

          bodySlot.innerHTML = createCalendarAppHTML();
          bodySlot.style.height = 'calc(100% - 2.5rem)';
          bodySlot.style.overflow = 'hidden';
          bodySlot.style.backgroundColor = '#ece9d8';
          bindCalendarEvents(bodySlot);
        }
      }

      // Sticky Notes Window Injection

      const stickyWin = document.getElementById('stickynotes');

      if (stickyWin && !stickyWin.dataset.initialized) {

        const bodySlot = stickyWin.querySelector('.h-content-headless-toolbox') || stickyWin.querySelector('.h-content-window') || stickyWin.querySelector('.h-full.w-full') || stickyWin.querySelector('.p-0\\.75 > div:last-child');

        if (bodySlot) {

          stickyWin.dataset.initialized = 'true';

          bodySlot.innerHTML = createStickyNotesAppHTML();

          bodySlot.style.height = 'calc(100% - 2.5rem)';

          bodySlot.style.overflow = 'hidden';

          bodySlot.style.backgroundColor = '#fef08a';

          bindStickyNotesEvents(bodySlot);

        }

      }



      // Doom Window Injection

      const doomWin = document.getElementById('doom');

      if (doomWin && !doomWin.dataset.initialized) {

        const bodySlot = doomWin.querySelector('#dosbox') || doomWin.querySelector('.h-content-headless-toolbox') || doomWin.querySelector('.h-content-window') || doomWin.querySelector('.h-full.w-full');

        if (bodySlot) {

          doomWin.dataset.initialized = 'true';

          bodySlot.innerHTML = '<iframe id="doom-runner-iframe" src="/doom_player.html" style="width:100%; height:100%; border:none; background:#000; display:block;" allow="autoplay" tabindex="0"></iframe>';

          bodySlot.style.height = '100%';

          bodySlot.style.boxSizing = 'border-box';

          bodySlot.style.backgroundColor = '#000000';

          bodySlot.style.overflow = 'hidden';



          // Ensure closing the window cleanly destroys the iframe and stops the emulation loop

          const titleControls = doomWin.querySelectorAll('button');

          titleControls.forEach(btn => {

            btn.addEventListener('click', () => {

              setTimeout(() => {

                if (!document.getElementById('doom')) {

                  const ifr = document.getElementById('doom-runner-iframe');

                  if (ifr) {

                    ifr.src = 'about:blank';

                    ifr.remove();

                  }

                }

              }, 50);

            });

          });

        }

      } else if (!doomWin) {

        // Window closed - ensure emulator process and audio are cleanly destroyed

        const staleIframe = document.getElementById('doom-runner-iframe');

        if (staleIframe) {

          staleIframe.src = 'about:blank';

          staleIframe.remove();

        }

      }



      const settingsWin = document.getElementById('settings');

      if (settingsWin && !settingsWin.dataset.initialized) {

        const bodySlot = settingsWin.querySelector('.h-content-headless-toolbox') || settingsWin.querySelector('.h-content-window') || settingsWin.querySelector('.h-full.w-full');

        if (bodySlot) {

          settingsWin.dataset.initialized = 'true';

          bodySlot.innerHTML = createSettingsHTML();

          bodySlot.style.height = 'calc(100% - 2.5rem)';

          bodySlot.style.overflowY = 'auto';

          bodySlot.style.backgroundColor = '#ece9d8';

          bindSettingsEvents(bodySlot, () => {

            if (window.__minimizeWindow) window.__minimizeWindow('settings');

          });

        }

      }



      // Keep Vue base window z-index above desktop layer

      if (window.__highestZIndex && typeof window.__highestZIndex.value === 'number' && window.__highestZIndex.value < 10) {

        window.__highestZIndex.value = 10;

      }



      // Re-apply wallpaper if user changes it or element re-rendered

      const desktopBg = document.querySelector('.bg-office-pic');

      if (desktopBg && desktopBg.dataset.appliedWp !== state.wallpaper) {

        desktopBg.dataset.appliedWp = state.wallpaper;

        applyWallpaper(state.wallpaper, state.customWallpaperUrl);

      }

    });



    observer.observe(document.body, { childList: true, subtree: true });

  }



  // Windows XP Photo Gallery helper API (for user picture uploads)
  window.addGalleryPicture = function(title, url) {
    if (Array.isArray(window.__galleryPictures)) {
      const newPic = { id: window.__galleryPictures.length + 1, title: title || ('Photo ' + (window.__galleryPictures.length + 1)), url: url };
      window.__galleryPictures.push(newPic);
      console.log('[Gallery] Photo added:', newPic);
      return newPic;
    }
  };
  window.setGalleryPictures = function(picturesArray) {
    if (Array.isArray(window.__galleryPictures) && Array.isArray(picturesArray)) {
      window.__galleryPictures.length = 0;
      picturesArray.forEach((p, idx) => {
        window.__galleryPictures.push({ id: idx + 1, title: p.title || ('Photo ' + (idx + 1)), url: p.url || p });
      });
      console.log('[Gallery] Photos updated. Total:', window.__galleryPictures.length);
    }
  };

  if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', initEnhancements);

  } else {

    initEnhancements();

  }

})();

