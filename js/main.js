/**
 * Desktop Portfolio — Interactive Retro OS Engine
 * Pixel-perfect Windows 95/98 experience
 */

(function () {
  'use strict';

  // State Management
  const state = {
    volume: 80,
    muted: false,
    audioInitialized: false,
    highestZIndex: 10010
  };

  // DOM Elements
  const desktop = document.getElementById('desktop');
  const desktopCanvas = document.getElementById('desktopCanvas');
  const selectionBox = document.getElementById('selectionBox');
  const contextMenu = document.getElementById('contextMenu');
  const startBtn = document.getElementById('startBtn');
  const startMenu = document.getElementById('startMenu');
  const clockTime = document.getElementById('clockTime');
  const clockDate = document.getElementById('clockDate');
  const trayClock = document.getElementById('trayClock');
  const trayVolumeBtn = document.getElementById('trayVolumeBtn');
  const trayMonitorBtn = document.getElementById('trayMonitorBtn');
  const volumePopup = document.getElementById('volumePopup');
  const volRange = document.getElementById('volRange');
  const volMute = document.getElementById('volMute');
  const volumeCloseBtn = document.getElementById('volumeCloseBtn');
  const datetimePopup = document.getElementById('datetimePopup');
  const datetimeCloseBtn = document.getElementById('datetimeCloseBtn');
  const datetimeOkBtn = document.getElementById('datetimeOkBtn');
  const datetimeCancelBtn = document.getElementById('datetimeCancelBtn');
  const propertiesPopup = document.getElementById('propertiesPopup');
  const propertiesCloseBtn = document.getElementById('propertiesCloseBtn');
  const propsOkBtn = document.getElementById('propsOkBtn');
  const propsCancelBtn = document.getElementById('propsCancelBtn');
  const shutdownModal = document.getElementById('shutdownModal');
  const shutdownCloseBtn = document.getElementById('shutdownCloseBtn');
  const shutdownCancelBtn = document.getElementById('shutdownCancelBtn');
  const startShutdown = document.getElementById('startShutdown');
  const menuRefresh = document.getElementById('menuRefresh');
  const menuProperties = document.getElementById('menuProperties');

  // =========================================================================
  // Web Audio Synthesizer (Retro clicks & chimes without external files)
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

  function playRetroClick() {
    if (state.muted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08 * (state.volume / 100), audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio context error ignore
    }
  }

  // =========================================================================
  // Clock & Date Real-Time Engine (Two-line format matching reference screenshot)
  // =========================================================================
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function updateClock() {
    const now = new Date();

    // Format Hours & Minutes: 10:24 PM
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // '0' should be '12'
    const timeString = `${hours}:${minutes} ${ampm}`;

    // Format Date: 26 Oct 2026
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${day} ${month} ${year}`;

    // Update Taskbar Clock
    clockTime.textContent = timeString;
    clockDate.textContent = dateString;

    // Update Analog & Digital Clock in Calendar Popup if open
    const popupDigitalTime = document.getElementById('popupDigitalTime');
    if (popupDigitalTime) {
      const seconds = now.getSeconds().toString().padStart(2, '0');
      popupDigitalTime.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    }

    const handHour = document.getElementById('handHour');
    const handMinute = document.getElementById('handMinute');
    const handSecond = document.getElementById('handSecond');
    if (handHour && handMinute && handSecond) {
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      const secDeg = (sec / 60) * 360;
      const minDeg = ((min + sec / 60) / 60) * 360;
      const hrDeg = ((hr + min / 60) / 12) * 360;

      handSecond.style.transform = `rotate(${secDeg}deg)`;
      handMinute.style.transform = `rotate(${minDeg}deg)`;
      handHour.style.transform = `rotate(${hrDeg}deg)`;
    }
  }

  // Build Calendar Grid for Current Month
  function buildCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const calendarMonthYear = document.getElementById('calendarMonthYear');
    if (!calendarDays || !calendarMonthYear) return;

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    calendarMonthYear.textContent = `${fullMonths[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarDays.innerHTML = '';

    // Empty cells for padding before the 1st
    for (let i = 0; i < firstDay; i++) {
      const emptySpan = document.createElement('span');
      calendarDays.appendChild(emptySpan);
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const daySpan = document.createElement('span');
      daySpan.textContent = d;
      if (d === now.getDate()) {
        daySpan.classList.add('today');
      }
      calendarDays.appendChild(daySpan);
    }
  }

  // =========================================================================
  // Desktop Drag Marquee Selection Box
  // =========================================================================
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  desktopCanvas.addEventListener('mousedown', (e) => {
    // Only respond to main left click and ignore if clicked on a dialog or menu
    if (e.button !== 0 || e.target !== desktopCanvas) return;
    initAudio();

    // Close open menus/popups
    closeAllPopups();

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
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      selectionBox.hidden = true;
    }
  });

  // =========================================================================
  // Right-Click Context Menu
  // =========================================================================
  desktopCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    initAudio();
    playRetroClick();

    closeAllPopups();

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    contextMenu.hidden = false;

    // Viewport bounds detection
    const menuWidth = contextMenu.offsetWidth || 150;
    const menuHeight = contextMenu.offsetHeight || 180;
    const posX = mouseX + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 4 : mouseX;
    const posY = mouseY + menuHeight > window.innerHeight - 34 ? window.innerHeight - menuHeight - 36 : mouseY;

    contextMenu.style.left = `${posX}px`;
    contextMenu.style.top = `${posY}px`;
  });

  menuRefresh.addEventListener('click', () => {
    playRetroClick();
    contextMenu.hidden = true;
    desktop.style.opacity = '0.7';
    setTimeout(() => {
      desktop.style.opacity = '1';
    }, 120);
  });

  menuProperties.addEventListener('click', () => {
    playRetroClick();
    contextMenu.hidden = true;
    openDialog(propertiesPopup);
  });

  // =========================================================================
  // Start Button & Start Menu
  // =========================================================================
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    playRetroClick();

    const isOpen = !startMenu.hidden;
    if (isOpen) {
      closeStartMenu();
    } else {
      openStartMenu();
    }
  });

  function openStartMenu() {
    startMenu.hidden = false;
    startBtn.classList.add('active');
    startBtn.setAttribute('aria-expanded', 'true');
    closeOtherPopups(startMenu);
  }

  function closeStartMenu() {
    startMenu.hidden = true;
    startBtn.classList.remove('active');
    startBtn.setAttribute('aria-expanded', 'false');
  }

  startShutdown.addEventListener('click', () => {
    playRetroClick();
    closeStartMenu();
    shutdownModal.showModal();
  });

  // =========================================================================
  // System Tray Popups & Interactivity
  // =========================================================================
  trayVolumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    playRetroClick();
    if (volumePopup.hidden) {
      openDialog(volumePopup);
    } else {
      volumePopup.hidden = true;
    }
  });

  volumeCloseBtn.addEventListener('click', () => {
    playRetroClick();
    volumePopup.hidden = true;
  });

  volRange.addEventListener('input', (e) => {
    state.volume = parseInt(e.target.value, 10);
    trayVolumeBtn.title = `Volume: ${state.volume}%`;
    playRetroClick();
  });

  volMute.addEventListener('change', (e) => {
    state.muted = e.target.checked;
    trayVolumeBtn.title = state.muted ? 'Volume: Muted' : `Volume: ${state.volume}%`;
    playRetroClick();
  });

  // Tray Clock Click -> Date/Time Properties
  trayClock.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    playRetroClick();
    if (datetimePopup.hidden) {
      buildCalendar();
      openDialog(datetimePopup);
    } else {
      datetimePopup.hidden = true;
    }
  });

  datetimeCloseBtn.addEventListener('click', () => {
    playRetroClick();
    datetimePopup.hidden = true;
  });

  datetimeOkBtn.addEventListener('click', () => {
    playRetroClick();
    datetimePopup.hidden = true;
  });

  datetimeCancelBtn.addEventListener('click', () => {
    playRetroClick();
    datetimePopup.hidden = true;
  });

  // Tray Monitor click tooltip feedback
  trayMonitorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    playRetroClick();
  });

  // Display Properties Close / OK / Cancel
  propertiesCloseBtn.addEventListener('click', () => {
    playRetroClick();
    propertiesPopup.hidden = true;
  });
  propsOkBtn.addEventListener('click', () => {
    playRetroClick();
    propertiesPopup.hidden = true;
  });
  propsCancelBtn.addEventListener('click', () => {
    playRetroClick();
    propertiesPopup.hidden = true;
  });

  // Wallpaper selector in Properties popup
  const wallpaperItems = document.querySelectorAll('.wallpaper-item');
  wallpaperItems.forEach((item) => {
    item.addEventListener('click', () => {
      wallpaperItems.forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');
      const bg = item.getAttribute('data-bg');
      if (bg) {
        desktop.style.backgroundImage = `url('${bg}')`;
        const crtScreenImg = document.getElementById('crtScreenImg');
        if (crtScreenImg) {
          crtScreenImg.style.backgroundImage = `url('${bg}')`;
        }
      }
      playRetroClick();
    });
  });

  // Shutdown Modal Controls
  shutdownCloseBtn.addEventListener('click', () => {
    playRetroClick();
    shutdownModal.close();
  });

  shutdownCancelBtn.addEventListener('click', () => {
    playRetroClick();
    shutdownModal.close();
  });

  document.getElementById('shutdownConfirmBtn').addEventListener('click', () => {
    playRetroClick();
    shutdownModal.close();
    // Retro shutdown screen effect
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.position = 'fixed';
    fadeOverlay.style.top = '0';
    fadeOverlay.style.left = '0';
    fadeOverlay.style.width = '100vw';
    fadeOverlay.style.height = '100vh';
    fadeOverlay.style.background = '#000000';
    fadeOverlay.style.zIndex = '99999';
    fadeOverlay.style.display = 'flex';
    fadeOverlay.style.flexDirection = 'column';
    fadeOverlay.style.alignItems = 'center';
    fadeOverlay.style.justifyContent = 'center';
    fadeOverlay.style.color = '#ff9900';
    fadeOverlay.style.fontFamily = "'Courier New', Courier, monospace";
    fadeOverlay.style.fontSize = '24px';
    fadeOverlay.style.textAlign = 'center';
    fadeOverlay.style.padding = '20px';
    fadeOverlay.innerHTML = '<p>It\'s now safe to turn off your computer.</p><button id="rebootBtn" class="win-button" style="margin-top:24px; color:#000;">Restart System</button>';
    document.body.appendChild(fadeOverlay);

    document.getElementById('rebootBtn').addEventListener('click', () => {
      document.body.removeChild(fadeOverlay);
    });
  });

  // =========================================================================
  // Dragging Windows / Dialogs by Titlebar
  // =========================================================================
  function makeDraggable(dialog) {
    const titlebar = dialog.querySelector('.win-titlebar');
    if (!titlebar) return;

    let posX = 0, posY = 0, mouseStartX = 0, mouseStartY = 0;

    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.win-close-btn')) return;
      e.preventDefault();
      initAudio();
      bringToFront(dialog);

      mouseStartX = e.clientX;
      mouseStartY = e.clientY;

      function onMouseMove(ev) {
        ev.preventDefault();
        posX = mouseStartX - ev.clientX;
        posY = mouseStartY - ev.clientY;
        mouseStartX = ev.clientX;
        mouseStartY = ev.clientY;

        const newTop = dialog.offsetTop - posY;
        const newLeft = dialog.offsetLeft - posX;

        // Keep within bounds
        dialog.style.top = `${Math.max(0, Math.min(window.innerHeight - 60, newTop))}px`;
        dialog.style.left = `${Math.max(0, Math.min(window.innerWidth - 60, newLeft))}px`;
        dialog.style.bottom = 'auto';
        dialog.style.right = 'auto';
        dialog.style.transform = 'none';
      }

      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    dialog.addEventListener('mousedown', () => {
      bringToFront(dialog);
    });
  }

  function bringToFront(el) {
    state.highestZIndex += 1;
    el.style.zIndex = state.highestZIndex;
  }

  function openDialog(dialog) {
    dialog.hidden = false;
    bringToFront(dialog);
    closeOtherPopups(dialog);
  }

  function closeOtherPopups(exceptEl) {
    if (exceptEl !== startMenu) closeStartMenu();
    if (exceptEl !== contextMenu) contextMenu.hidden = true;
    if (exceptEl !== volumePopup) volumePopup.hidden = true;
  }

  function closeAllPopups() {
    closeStartMenu();
    contextMenu.hidden = true;
    volumePopup.hidden = true;
  }

  // Initialize Draggable Dialogs
  [volumePopup, datetimePopup, propertiesPopup].forEach(makeDraggable);

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
      closeStartMenu();
    }
    if (!contextMenu.contains(e.target)) {
      contextMenu.hidden = true;
    }
    if (!volumePopup.contains(e.target) && !trayVolumeBtn.contains(e.target)) {
      volumePopup.hidden = true;
    }
  });

  // Keyboard Navigation: Esc closes start menu and context menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopups();
      if (datetimePopup) datetimePopup.hidden = true;
      if (propertiesPopup) propertiesPopup.hidden = true;
      if (shutdownModal.open) shutdownModal.close();
    }
  });

  // Start Real-Time Clock
  updateClock();
  setInterval(updateClock, 1000);
  buildCalendar();

})();
