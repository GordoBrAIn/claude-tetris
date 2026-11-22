'use strict';

// Menu de pausa. Depende de globals de game.js: paused, startLevel, init(), togglePause().
const pauseMenu = document.getElementById('pause-menu');
const pauseResumeBtn = document.getElementById('pause-resume');
const pauseRestartBtn = document.getElementById('pause-restart');
const pauseControlsBtn = document.getElementById('pause-controls-btn');
const pauseControlsList = document.getElementById('pause-controls');
const pauseLevelSelect = document.getElementById('pause-level');

for (let i = 1; i <= 15; i++) {
  const opt = document.createElement('option');
  opt.value = String(i);
  opt.textContent = String(i);
  pauseLevelSelect.appendChild(opt);
}
pauseLevelSelect.value = String(startLevel);

function hidePauseMenu() {
  pauseMenu.classList.add('hidden');
  pauseControlsList.classList.add('hidden');
  pauseControlsBtn.setAttribute('aria-expanded', 'false');
  if (pauseMenu.contains(document.activeElement)) document.activeElement.blur();
}

// Llamado desde togglePause() en game.js tras cambiar `paused`.
function syncPauseMenu() {
  if (paused) {
    pauseLevelSelect.value = String(startLevel);
    pauseMenu.classList.remove('hidden');
    pauseResumeBtn.focus();
  } else {
    hidePauseMenu();
  }
}

pauseResumeBtn.addEventListener('click', () => { if (paused) togglePause(); });

pauseRestartBtn.addEventListener('click', () => {
  hidePauseMenu();
  init();
});

pauseControlsBtn.addEventListener('click', () => {
  const show = pauseControlsList.classList.toggle('hidden') === false;
  pauseControlsBtn.setAttribute('aria-expanded', String(show));
});

pauseLevelSelect.addEventListener('change', () => {
  startLevel = parseInt(pauseLevelSelect.value, 10) || 1;
});

// Con el menu abierto, Space no debe pulsar el boton enfocado por accidente
// (Enter si funciona para navegar con teclado; el foco se quita al cerrar).
document.addEventListener('keydown', e => {
  if (!paused || pauseMenu.classList.contains('hidden')) return;
  if (e.code === 'Space' && e.target.tagName === 'BUTTON') e.preventDefault();
}, true);

// Tras reiniciar desde game over, el boton no debe quedar enfocado (Space = caida).
document.getElementById('restart-btn').addEventListener('click', e => e.currentTarget.blur());
