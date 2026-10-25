/**
 * Desktop Portfolio — Modern Windows 11 Operating System Engine
 * Fully interactive desktop, window manager, and native apps
 */

(function () {
  'use strict';

  // State Management
  const state = {
    activeWindows: new Map(), // id -> { el, tabEl, minimized }
    highestZIndex: 110,
    selectedIcon: null,
    wallpaperIdx: 0,
    audioInitialized: false,
    wallpapers: [
      'assets/mountain_wallpaper.jpg',
      'assets/wallpaper.jpg'
    ]
  };

  // DOM Elements
  const desktop = document.getElementById('desktop');
  const desktopCanvas = document.getElementById('desktopCanvas');
  const desktopGrid = document.getElementById('desktopGrid');
  const selectionBox = document.getElementById('selectionBox');
  const windowsContainer = document.getElementById('windowsContainer');
  const modernStartMenu = document.getElementById('modernStartMenu');
  const win11StartBtn = document.getElementById('win11StartBtn');
  const taskbarActiveTabs = document.getElementById('taskbarActiveTabs');
  const modernClockTime = document.getElementById('modernClockTime');
  const modernClockDate = document.getElementById('modernClockDate');
  const modernContextMenu = document.getElementById('modernContextMenu');
  const taskbarSearchInput = document.getElementById('taskbarSearchInput');
  const startMenuSearch = document.getElementById('startMenuSearch');
  const startPowerBtn = document.getElementById('startPowerBtn');

  // =========================================================================
  // Web Audio Synthesizer (Modern subtle haptic clicks)
  // =========================================================================
  let audioCtx = null;

  function initAudio() {
    if (!state.audioInitialized) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
        state.audioInitialized = true;
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSoftClick() {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.035);
    } catch (e) {
      // Audio error ignored
    }
  }

  // =========================================================================
  // Real-Time Clock Engine (Two-line format: 10:24 PM \n 26 Oct 2026)
  // =========================================================================
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeString = `${hours}:${minutes} ${ampm}`;

    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${day} ${month} ${year}`;

    if (modernClockTime) modernClockTime.textContent = timeString;
    if (modernClockDate) modernClockDate.textContent = dateString;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // =========================================================================
  // Desktop Icons Selection & Launching
  // =========================================================================
  const desktopIcons = document.querySelectorAll('.desktop-icon');

  desktopIcons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      playSoftClick();

      desktopIcons.forEach((i) => i.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedIcon = btn;
    });

    btn.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const appKey = btn.getAttribute('data-app');
      openApp(appKey);
    });
  });

  // Also support single click or Enter key on keyboard
  desktopIcons.forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const appKey = btn.getAttribute('data-app');
        openApp(appKey);
      }
    });
  });

  // Taskbar Pinned Apps Click
  document.querySelectorAll('.taskbar-app-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      playSoftClick();
      const appKey = btn.getAttribute('data-app');
      openApp(appKey);
    });
  });

  // Start Menu Items Click
  document.querySelectorAll('.start-app-item').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      playSoftClick();
      const appKey = btn.getAttribute('data-app');
      modernStartMenu.hidden = true;
      win11StartBtn.classList.remove('active');
      openApp(appKey);
    });
  });

  // =========================================================================
  // Desktop Marquee Drag Selection
  // =========================================================================
  let isDragging = false;
  let startX = 0, startY = 0;

  desktopCanvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || e.target !== desktopCanvas) return;
    initAudio();

    // Clear icon selection
    desktopIcons.forEach((i) => i.classList.remove('selected'));
    state.selectedIcon = null;

    // Close menus
    modernStartMenu.hidden = true;
    win11StartBtn.classList.remove('active');
    modernContextMenu.hidden = true;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
    selectionBox.hidden = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selectionBox.style.left = `${left}px`;
    selectionBox.style.top = `${top}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;

    // Highlight icons overlapping the selection box
    const selRect = { left, top, right: left + width, bottom: top + height };
    desktopIcons.forEach((icon) => {
      const rect = icon.getBoundingClientRect();
      const isOverlap = !(
        rect.right < selRect.left ||
        rect.left > selRect.right ||
        rect.bottom < selRect.top ||
        rect.top > selRect.bottom
      );
      if (isOverlap) {
        icon.classList.add('selected');
      } else {
        icon.classList.remove('selected');
      }
    });
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      selectionBox.hidden = true;
    }
  });

  // =========================================================================
  // Context Menu
  // =========================================================================
  desktopCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    initAudio();
    playSoftClick();

    modernStartMenu.hidden = true;
    win11StartBtn.classList.remove('active');

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    modernContextMenu.hidden = false;
    const menuWidth = 170;
    const menuHeight = 150;
    const posX = mouseX + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 8 : mouseX;
    const posY = mouseY + menuHeight > window.innerHeight - 50 ? window.innerHeight - menuHeight - 52 : mouseY;

    modernContextMenu.style.left = `${posX}px`;
    modernContextMenu.style.top = `${posY}px`;
  });

  document.querySelectorAll('.modern-context-menu .menu-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      playSoftClick();
      modernContextMenu.hidden = true;
      const action = item.getAttribute('data-action');

      if (action === 'refresh') {
        desktop.style.opacity = '0.7';
        setTimeout(() => { desktop.style.opacity = '1'; }, 150);
      } else if (action === 'open-all') {
        openApp('computer');
        setTimeout(() => openApp('projects'), 100);
      } else if (action === 'switch-wallpaper') {
        state.wallpaperIdx = (state.wallpaperIdx + 1) % state.wallpapers.length;
        desktop.style.backgroundImage = `url('${state.wallpapers[state.wallpaperIdx]}')`;
      } else if (action === 'properties') {
        openApp('contact');
      }
    });
  });

  // =========================================================================
  // Windows 11 Start Button & Search
  // =========================================================================
  win11StartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    playSoftClick();

    const isOpen = !modernStartMenu.hidden;
    modernStartMenu.hidden = isOpen;
    win11StartBtn.classList.toggle('active', !isOpen);
  });

  startPowerBtn.addEventListener('click', () => {
    playSoftClick();
    modernStartMenu.hidden = true;
    win11StartBtn.classList.remove('active');
    alert('System Online. Developer Portfolio active & ready!');
  });

  // Search Bar Integration
  taskbarSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = taskbarSearchInput.value.toLowerCase().trim();
      handleSearch(q);
      taskbarSearchInput.value = '';
    }
  });

  startMenuSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = startMenuSearch.value.toLowerCase().trim();
      handleSearch(q);
      startMenuSearch.value = '';
      modernStartMenu.hidden = true;
      win11StartBtn.classList.remove('active');
    }
  });

  function handleSearch(q) {
    if (q.includes('about') || q.includes('bio') || q.includes('comp')) openApp('computer');
    else if (q.includes('proj') || q.includes('work')) openApp('projects');
    else if (q.includes('skill') || q.includes('tech') || q.includes('term')) openApp('skills');
    else if (q.includes('resume') || q.includes('cv') || q.includes('pdf')) openApp('resume');
    else if (q.includes('exp') || q.includes('job')) openApp('experience');
    else if (q.includes('chess') || q.includes('game')) openApp('chess');
    else if (q.includes('photo') || q.includes('gal')) openApp('gallery');
    else if (q.includes('blog') || q.includes('thought')) openApp('blog');
    else if (q.includes('play') || q.includes('side')) openApp('playground');
    else if (q.includes('contact') || q.includes('mail')) openApp('contact');
    else if (q.includes('music') || q.includes('spot')) openApp('spotify');
    else openApp('projects');
  }

  // =========================================================================
  // Application Window Builder & Manager
  // =========================================================================
  const appsData = {
    computer: {
      title: 'Computer — About Me',
      icon: '💻',
      width: 520,
      height: 420,
      render: () => `
        <div class="about-hero">
          <div class="about-avatar">👨‍💻</div>
          <div>
            <h2 style="font-size:18px; margin-bottom:4px;">Full Stack Engineer &amp; Designer</h2>
            <p style="color:var(--text-secondary); font-size:12px;">Passionate about building state-of-the-art interactive web platforms, AI applications, and delightful digital user experiences.</p>
          </div>
        </div>
        <p style="font-size:12.5px; line-height:1.6; margin-bottom:12px;">
          Welcome to my desktop portfolio! I specialize in modern JavaScript/TypeScript, React, Python, cloud architectures, and intuitive UI/UX engineering with pixel precision.
        </p>
        <div class="about-stats">
          <div class="stat-card">
            <div class="stat-val">5+</div>
            <div class="stat-lbl">Years Experience</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">30+</div>
            <div class="stat-lbl">Projects Built</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">99.9%</div>
            <div class="stat-lbl">Code Quality</div>
          </div>
        </div>
      `
    },

    projects: {
      title: 'Projects — My Work',
      icon: '📁',
      width: 640,
      height: 480,
      render: () => `
        <div class="projects-grid">
          <div class="project-card">
            <div class="project-title">🚀 Cloud Orchestration Engine</div>
            <div class="project-desc">Serverless distributed task workflow system with real-time telemetry and sub-second queue processing.</div>
            <div class="project-tags">
              <span class="tag-badge">TypeScript</span>
              <span class="tag-badge">Node.js</span>
              <span class="tag-badge">GCP</span>
            </div>
          </div>

          <div class="project-card">
            <div class="project-title">✨ AI Copilot IDE Extension</div>
            <div class="project-desc">Context-aware multi-modal code assistant featuring automated linting and AST refactoring.</div>
            <div class="project-tags">
              <span class="tag-badge">Python</span>
              <span class="tag-badge">Gemini API</span>
              <span class="tag-badge">React</span>
            </div>
          </div>

          <div class="project-card">
            <div class="project-title">🎨 Desktop OS Portfolio</div>
            <div class="project-desc">Authentic interactive desktop interface featuring glassmorphism, responsive windows, and audio feedback.</div>
            <div class="project-tags">
              <span class="tag-badge">Vanilla JS</span>
              <span class="tag-badge">CSS3</span>
              <span class="tag-badge">Web Audio</span>
            </div>
          </div>

          <div class="project-card">
            <div class="project-title">⚡ Real-Time Financial Dashboard</div>
            <div class="project-desc">High-frequency market data visualizer rendering over 60FPS using Canvas and WebSockets.</div>
            <div class="project-tags">
              <span class="tag-badge">React</span>
              <span class="tag-badge">WebSockets</span>
              <span class="tag-badge">D3.js</span>
            </div>
          </div>
        </div>
      `
    },

    resume: {
      title: 'Resume — Download & Credentials',
      icon: '📄',
      width: 520,
      height: 460,
      render: () => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1);">
          <div>
            <h3 style="font-size:16px;">Curriculum Vitae</h3>
            <span style="font-size:11px; color:var(--text-muted);">Updated Q4 2026 • Verified</span>
          </div>
          <button class="contact-btn" style="padding:6px 14px; font-size:12px;" onclick="window.print()">📥 Download PDF</button>
        </div>
        <div style="font-size:12.5px; line-height:1.6;">
          <h4 style="color:var(--accent-cyan); margin:10px 0 4px;">Experience Highlights</h4>
          <p><b>Senior Full Stack Developer</b> • Tech Innovators (2023 - Present)<br>
          Architected high-throughput cloud microservices and responsive web platforms serving over 1M+ active monthly users.</p>
          
          <h4 style="color:var(--accent-cyan); margin:14px 0 4px;">Education &amp; Credentials</h4>
          <p><b>B.S. in Computer Science &amp; Software Engineering</b><br>
          Certifications: GCP Professional Cloud Architect, AWS Certified Developer.</p>
        </div>
      `
    },

    skills: {
      title: 'Skills — Interactive Terminal',
      icon: '⚡',
      width: 560,
      height: 400,
      render: () => `
        <div class="terminal-window" style="height:100%; display:flex; flex-direction:column;">
          <div class="terminal-logs" id="terminalLogs">
            <div class="terminal-line term-gray">Portfolio Terminal [Version 2.4.0]</div>
            <div class="terminal-line term-gray">Type <span class="term-cyan">'help'</span> or <span class="term-cyan">'skills'</span> to inspect capabilities.</div>
            <div class="terminal-line"><span class="term-green">guest@portfolio:~$</span> skills</div>
            <div class="terminal-line term-cyan">
              [Frontend]   JavaScript (ESNext), TypeScript, React, Next.js, CSS3/Sass, Canvas<br>
              [Backend]    Node.js, Express, Python (FastAPI/Django), REST, GraphQL<br>
              [Databases]  PostgreSQL, MongoDB, Redis, BigQuery<br>
              [Cloud/Ops]  Docker, Kubernetes, GCP, AWS, CI/CD Actions, Linux
            </div>
          </div>
          <div class="terminal-input-row" style="margin-top:auto;">
            <span class="term-green">guest@portfolio:~$</span>
            <input type="text" id="termInput" placeholder="try 'help', 'projects', 'clear'..." autocomplete="off">
          </div>
        </div>
      `
    },

    experience: {
      title: 'Experience — My Journey',
      icon: '🌐',
      width: 540,
      height: 440,
      render: () => `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="border-left:2px solid var(--accent-cyan); padding-left:14px; position:relative;">
            <div style="position:absolute; left:-6px; top:0; width:10px; height:10px; border-radius:50%; background:var(--accent-cyan);"></div>
            <span style="font-size:11px; color:var(--accent-cyan); font-weight:600;">2024 — PRESENT</span>
            <h4 style="font-size:14px;">Lead Solutions Architect</h4>
            <p style="color:var(--text-secondary); font-size:12px;">Spearheaded end-to-end full stack architecture for enterprise SaaS apps, driving 40% reduction in latency.</p>
          </div>

          <div style="border-left:2px solid rgba(255,255,255,0.2); padding-left:14px; position:relative;">
            <div style="position:absolute; left:-6px; top:0; width:10px; height:10px; border-radius:50%; background:#94a3b8;"></div>
            <span style="font-size:11px; color:var(--text-muted); font-weight:600;">2021 — 2024</span>
            <h4 style="font-size:14px;">Senior Frontend &amp; UI Engineer</h4>
            <p style="color:var(--text-secondary); font-size:12px;">Crafted responsive design systems, animations, and high performance data visualizers.</p>
          </div>

          <div style="border-left:2px solid rgba(255,255,255,0.2); padding-left:14px; position:relative;">
            <div style="position:absolute; left:-6px; top:0; width:10px; height:10px; border-radius:50%; background:#94a3b8;"></div>
            <span style="font-size:11px; color:var(--text-muted); font-weight:600;">2019 — 2021</span>
            <h4 style="font-size:14px;">Full Stack Developer</h4>
            <p style="color:var(--text-secondary); font-size:12px;">Engineered robust APIs, database migrations, and microservice containerization.</p>
          </div>
        </div>
      `
    },

    chess: {
      title: 'Chess — Play a Game',
      icon: '♟️',
      width: 420,
      height: 480,
      render: () => `
        <div class="chess-container">
          <div style="font-size:12px; color:var(--text-secondary);">Interactive Desktop Chessboard (White vs Black)</div>
          <div class="chess-board" id="chessBoard"></div>
          <div style="font-size:11px; color:var(--text-muted);" id="chessStatus">Select a piece and click a square to move!</div>
        </div>
      `
    },

    gallery: {
      title: 'Gallery — Snapshots',
      icon: '🖼️',
      width: 580,
      height: 430,
      render: () => `
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
          <div style="border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); background:#000;">
            <img src="assets/mountain_wallpaper.jpg" style="width:100%; height:130px; object-fit:cover;" alt="Alpine Mountains">
            <div style="padding:8px; font-size:11px;">Misty Alpine Peaks • Mountain Horizon</div>
          </div>
          <div style="border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); background:#000;">
            <img src="assets/wallpaper.jpg" style="width:100%; height:130px; object-fit:cover;" alt="Retro Landscape">
            <div style="padding:8px; font-size:11px;">Serene Lake &amp; Solitary Oak • Retro Bliss</div>
          </div>
        </div>
      `
    },

    blog: {
      title: 'Blog — My Thoughts',
      icon: '📝',
      width: 520,
      height: 430,
      render: () => `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <article style="background:rgba(255,255,255,0.05); padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
            <span style="font-size:10px; color:var(--accent-cyan);">OCTOBER 2026 • 5 MIN READ</span>
            <h4 style="margin:4px 0;">Why Web Craftsmanship Matters More Than Ever</h4>
            <p style="font-size:12px; color:var(--text-secondary);">In an era of mass-generated code, deep empathy for user interactions, tactile feedback, and frame-rate precision stand out.</p>
          </article>

          <article style="background:rgba(255,255,255,0.05); padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
            <span style="font-size:10px; color:var(--accent-cyan);">SEPTEMBER 2026 • 8 MIN READ</span>
            <h4 style="margin:4px 0;">Architecting Low-Latency Distributed Systems</h4>
            <p style="font-size:12px; color:var(--text-secondary);">Practical patterns for microservice resilience, event streams, and edge computing.</p>
          </article>
        </div>
      `
    },

    playground: {
      title: 'Playground — Interactive Particle Physics',
      icon: '🎮',
      width: 500,
      height: 420,
      render: () => `
        <div style="display:flex; flex-direction:column; align-items:center; height:100%;">
          <div style="font-size:11px; color:var(--text-secondary); margin-bottom:8px;">Move your mouse across the canvas to emit interactive glowing particles!</div>
          <canvas id="particleCanvas" width="460" height="280" style="background:#090d16; border-radius:8px; border:1px solid rgba(255,255,255,0.1); cursor:crosshair;"></canvas>
        </div>
      `
    },

    contact: {
      title: 'Contact — Let\'s Talk',
      icon: '⚙️',
      width: 460,
      height: 410,
      render: () => `
        <form class="contact-form" id="contactForm" onsubmit="event.preventDefault(); alert('Message received! Thank you for reaching out.');">
          <label style="font-size:12px; font-weight:600;">Your Name</label>
          <input type="text" class="contact-input" placeholder="e.g. Alex Hunter" required>

          <label style="font-size:12px; font-weight:600;">Email Address</label>
          <input type="email" class="contact-input" placeholder="alex@example.com" required>

          <label style="font-size:12px; font-weight:600;">Message</label>
          <textarea class="contact-input" rows="4" placeholder="Hi! I loved your portfolio..." required style="resize:none;"></textarea>

          <button type="submit" class="contact-btn">Send Message 🚀</button>
        </form>
      `
    },

    spotify: {
      title: 'Spotify — Ambient Lofi Player',
      icon: '🎵',
      width: 380,
      height: 240,
      render: () => `
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:8px;">
          <div style="width:70px; height:70px; border-radius:50%; background:#1db954; display:flex; align-items:center; justify-content:center; font-size:36px; box-shadow:0 0 20px rgba(29,185,84,0.4);">
            🎧
          </div>
          <div style="font-weight:600; font-size:14px;">Midnight Code Sessions</div>
          <div style="font-size:11px; color:var(--text-muted);">Lofi Synthwave • Ambient Focus</div>
          <button class="contact-btn" id="lofiPlayBtn" style="padding:6px 20px; font-size:12px; background:#1db954; color:#000;">▶ Play Track</button>
        </div>
      `
    },

    recycle: {
      title: 'Recycle Bin',
      icon: '🗑️',
      width: 400,
      height: 280,
      render: () => `
        <div style="text-align:center; padding:20px;">
          <div style="font-size:42px; margin-bottom:8px;">🗑️</div>
          <h4 style="margin-bottom:6px;">Recycle Bin is Empty</h4>
          <p style="font-size:12px; color:var(--text-muted);">All obsolete bugs and legacy code have been permanently cleaned up.</p>
        </div>
      `
    }
  };

  function openApp(appKey) {
    initAudio();
    playSoftClick();

    if (state.activeWindows.has(appKey)) {
      const winData = state.activeWindows.get(appKey);
      if (winData.minimized) {
        winData.el.hidden = false;
        winData.minimized = false;
      }
      bringToFront(winData.el);
      return;
    }

    const appConfig = appsData[appKey];
    if (!appConfig) return;

    // Create Window DOM
    const win = document.createElement('section');
    win.className = 'win-window';
    win.setAttribute('aria-label', appConfig.title);
    win.style.width = `${Math.min(appConfig.width, window.innerWidth - 40)}px`;
    win.style.height = `${Math.min(appConfig.height, window.innerHeight - 80)}px`;

    // Stagger window position
    const offset = (state.activeWindows.size % 6) * 24;
    const initialLeft = Math.max(30, (window.innerWidth - appConfig.width) / 2 + offset);
    const initialTop = Math.max(20, (window.innerHeight - appConfig.height) / 2 - 40 + offset);
    win.style.left = `${initialLeft}px`;
    win.style.top = `${initialTop}px`;

    win.innerHTML = `
      <header class="window-header">
        <div class="window-title-group">
          <span>${appConfig.icon}</span>
          <span>${appConfig.title}</span>
        </div>
        <div class="window-controls">
          <button class="window-ctrl-btn ctrl-min" title="Minimize">─</button>
          <button class="window-ctrl-btn ctrl-max" title="Maximize">□</button>
          <button class="window-ctrl-btn ctrl-close" title="Close">✕</button>
        </div>
      </header>
      <div class="window-body">
        ${appConfig.render()}
      </div>
    `;

    windowsContainer.appendChild(win);

    // Create Taskbar Tab
    const tab = document.createElement('button');
    tab.className = 'taskbar-tab active';
    tab.innerHTML = `<span>${appConfig.icon}</span><span>${appConfig.title.split('—')[0].trim()}</span>`;
    taskbarActiveTabs.appendChild(tab);

    const winData = { el: win, tabEl: tab, minimized: false, isMax: false };
    state.activeWindows.set(appKey, winData);

    bringToFront(win);
    makeWindowDraggable(win);

    // Window Control Handlers
    const minBtn = win.querySelector('.ctrl-min');
    const maxBtn = win.querySelector('.ctrl-max');
    const closeBtn = win.querySelector('.ctrl-close');

    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSoftClick();
      win.hidden = true;
      winData.minimized = true;
      tab.classList.remove('active');
    });

    maxBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSoftClick();
      if (!winData.isMax) {
        winData.prevLeft = win.style.left;
        winData.prevTop = win.style.top;
        winData.prevWidth = win.style.width;
        winData.prevHeight = win.style.height;

        win.style.left = '0px';
        win.style.top = '0px';
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - var(--taskbar-height))';
        win.style.borderRadius = '0';
        winData.isMax = true;
      } else {
        win.style.left = winData.prevLeft;
        win.style.top = winData.prevTop;
        win.style.width = winData.prevWidth;
        win.style.height = winData.prevHeight;
        win.style.borderRadius = '10px';
        winData.isMax = false;
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSoftClick();
      closeApp(appKey);
    });

    tab.addEventListener('click', () => {
      playSoftClick();
      if (winData.minimized) {
        win.hidden = false;
        winData.minimized = false;
        bringToFront(win);
      } else if (win === getTopWindow()) {
        win.hidden = true;
        winData.minimized = true;
        tab.classList.remove('active');
      } else {
        bringToFront(win);
      }
    });

    win.addEventListener('mousedown', () => {
      bringToFront(win);
    });

    // Special App initializers
    if (appKey === 'skills') initTerminal(win);
    if (appKey === 'chess') initChess(win);
    if (appKey === 'playground') initParticles(win);
    if (appKey === 'spotify') initSpotify(win);
  }

  function closeApp(appKey) {
    if (!state.activeWindows.has(appKey)) return;
    const winData = state.activeWindows.get(appKey);
    winData.el.remove();
    winData.tabEl.remove();
    state.activeWindows.delete(appKey);
  }

  function bringToFront(winEl) {
    state.highestZIndex += 1;
    winEl.style.zIndex = state.highestZIndex;

    // Update active tab styling
    state.activeWindows.forEach((data) => {
      if (data.el === winEl && !data.minimized) {
        data.tabEl.classList.add('active');
      } else {
        data.tabEl.classList.remove('active');
      }
    });
  }

  function getTopWindow() {
    let topWin = null;
    let maxZ = -1;
    state.activeWindows.forEach((data) => {
      if (!data.minimized) {
        const z = parseInt(data.el.style.zIndex || '0', 10);
        if (z > maxZ) {
          maxZ = z;
          topWin = data.el;
        }
      }
    });
    return topWin;
  }

  // Draggable Window Functionality
  function makeWindowDraggable(win) {
    const header = win.querySelector('.window-header');
    let posX = 0, posY = 0, startMouseX = 0, startMouseY = 0;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-ctrl-btn')) return;
      initAudio();
      bringToFront(win);

      startMouseX = e.clientX;
      startMouseY = e.clientY;

      function onDrag(ev) {
        posX = startMouseX - ev.clientX;
        posY = startMouseY - ev.clientY;
        startMouseX = ev.clientX;
        startMouseY = ev.clientY;

        const newTop = win.offsetTop - posY;
        const newLeft = win.offsetLeft - posX;

        win.style.top = `${Math.max(0, Math.min(window.innerHeight - 60, newTop))}px`;
        win.style.left = `${Math.max(-100, Math.min(window.innerWidth - 100, newLeft))}px`;
      }

      function stopDrag() {
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', stopDrag);
      }

      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDrag);
    });
  }

  // =========================================================================
  // Interactive Terminal Logic (Skills App)
  // =========================================================================
  function initTerminal(win) {
    const input = win.querySelector('#termInput');
    const logs = win.querySelector('#terminalLogs');
    if (!input || !logs) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="term-green">guest@portfolio:~$</span> ${input.value}`;
        logs.appendChild(line);

        const res = document.createElement('div');
        res.className = 'terminal-line';

        if (cmd === 'help') {
          res.className += ' term-cyan';
          res.innerHTML = 'Available commands: skills, projects, clear, about, contact, date, echo [text]';
        } else if (cmd === 'clear') {
          logs.innerHTML = '';
          input.value = '';
          return;
        } else if (cmd === 'skills') {
          res.className += ' term-cyan';
          res.innerHTML = 'TypeScript, React, Python, Cloud Architectures, Web Audio, UI/UX';
        } else if (cmd === 'projects') {
          openApp('projects');
          res.innerHTML = 'Opening Projects Explorer...';
        } else if (cmd === 'about') {
          openApp('computer');
          res.innerHTML = 'Opening About Me...';
        } else if (cmd === 'contact') {
          openApp('contact');
          res.innerHTML = 'Opening Contact Form...';
        } else if (cmd === 'date') {
          res.innerHTML = new Date().toString();
        } else if (cmd.startsWith('echo ')) {
          res.innerHTML = cmd.replace('echo ', '');
        } else if (cmd === '') {
          // do nothing
        } else {
          res.innerHTML = `command not found: ${cmd}. Type 'help' for available commands.`;
        }

        logs.appendChild(res);
        input.value = '';
        logs.scrollTop = logs.scrollHeight;
      }
    });
  }

  // =========================================================================
  // Interactive Playable Chess Logic (Chess App)
  // =========================================================================
  function initChess(win) {
    const board = win.querySelector('#chessBoard');
    const status = win.querySelector('#chessStatus');
    if (!board) return;

    const initialPieces = [
      ['♜','♞','♝','♛','♚','♝','♞','♜'],
      ['♟','♟','♟','♟','♟','♟','♟','♟'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['♙','♙','♙','♙','♙','♙','♙','♙'],
      ['♖','♘','♗','♕','♔','♗','♘','♖']
    ];

    let selectedSquare = null;

    function renderBoard() {
      board.innerHTML = '';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const sq = document.createElement('div');
          sq.className = `chess-square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
          sq.textContent = initialPieces[r][c];
          sq.dataset.r = r;
          sq.dataset.c = c;

          sq.addEventListener('click', () => {
            initAudio();
            playSoftClick();

            if (!selectedSquare) {
              if (sq.textContent !== '') {
                selectedSquare = sq;
                sq.classList.add('selected');
                status.textContent = `Selected: ${sq.textContent}. Choose destination square.`;
              }
            } else {
              const srcR = parseInt(selectedSquare.dataset.r, 10);
              const srcC = parseInt(selectedSquare.dataset.c, 10);
              const destR = r;
              const destC = c;

              // Move piece
              initialPieces[destR][destC] = initialPieces[srcR][srcC];
              initialPieces[srcR][srcC] = '';

              selectedSquare.classList.remove('selected');
              selectedSquare = null;
              renderBoard();
              status.textContent = 'Move recorded! Your turn continues.';
            }
          });

          board.appendChild(sq);
        }
      }
    }

    renderBoard();
  }

  // =========================================================================
  // Playground Particle Physics Demo (Playground App)
  // =========================================================================
  function initParticles(win) {
    const canvas = win.querySelector('#particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function addParticle(x, y) {
      for (let i = 0; i < 4; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: Math.random() * 3 + 1,
          color: `hsl(${Math.random() * 60 + 180}, 90%, 65%)`,
          alpha: 1
        });
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      addParticle(e.clientX - rect.left, e.clientY - rect.top);
    });

    function loop() {
      if (!win.isConnected) return;
      ctx.fillStyle = 'rgba(9, 13, 22, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(loop);
    }
    loop();
  }

  // =========================================================================
  // Spotify Ambient Synthesizer (Spotify App)
  // =========================================================================
  function initSpotify(win) {
    const btn = win.querySelector('#lofiPlayBtn');
    if (!btn) return;
    let isPlaying = false;
    let synthTimer = null;

    btn.addEventListener('click', () => {
      initAudio();
      if (!isPlaying) {
        isPlaying = true;
        btn.textContent = '⏸ Pause Track';
        btn.style.background = '#e11d48';
        btn.style.color = '#fff';

        // Play ambient pentatonic chords using Web Audio
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        synthTimer = setInterval(() => {
          if (!audioCtx) return;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const freq = notes[Math.floor(Math.random() * notes.length)];
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 1.8);
        }, 1200);
      } else {
        isPlaying = false;
        btn.textContent = '▶ Play Track';
        btn.style.background = '#1db954';
        btn.style.color = '#000';
        clearInterval(synthTimer);
      }
    });
  }

  // =========================================================================
  // Global Click Outside Dismissals
  // =========================================================================
  document.addEventListener('click', (e) => {
    if (!modernStartMenu.contains(e.target) && !win11StartBtn.contains(e.target)) {
      modernStartMenu.hidden = true;
      win11StartBtn.classList.remove('active');
    }
    if (!modernContextMenu.contains(e.target)) {
      modernContextMenu.hidden = true;
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modernStartMenu.hidden = true;
      win11StartBtn.classList.remove('active');
      modernContextMenu.hidden = true;
    }
  });

})();
