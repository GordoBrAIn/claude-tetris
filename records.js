'use strict';

// Tabla de records local (localStorage). Depende de game.js: init(), restartBtn.
const Records = (() => {
  const KEY = 'tetris.records';
  const MAX = 5;
  const NAME_MAX = 12;

  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');
  const startList = document.getElementById('start-records');
  const startStats = document.getElementById('start-stats');
  const goBox = document.getElementById('gameover-records');
  const goList = document.getElementById('gameover-list');
  const goStats = document.getElementById('gameover-stats');
  const nameForm = document.getElementById('name-form');
  const nameInput = document.getElementById('name-input');

  let pending = null;   // partida pendiente de guardar {score, lines}
  let highlight = null; // record de la partida actual

  function empty() {
    return { entries: [], bestCombo: 0, maxLines: 0 };
  }

  function num(v) {
    return Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return empty();
      const entries = (Array.isArray(data.entries) ? data.entries : [])
        .filter(e => e && typeof e === 'object' && typeof e.name === 'string')
        .map(e => ({
          name: e.name.slice(0, NAME_MAX),
          score: num(e.score),
          lines: num(e.lines),
          date: typeof e.date === 'string' ? e.date : '',
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX);
      return { entries, bestCombo: num(data.bestCombo), maxLines: num(data.maxLines) };
    } catch (_) {
      return empty();
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (_) { /* modo privado o cuota llena */ }
  }

  function qualifies(data, score) {
    return score > 0 && (data.entries.length < MAX || score > data.entries[data.entries.length - 1].score);
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return isNaN(d) ? '-' : d.toLocaleDateString('es');
  }

  function render(listEl, statsEl, data) {
    listEl.textContent = '';
    if (!data.entries.length) {
      const li = document.createElement('li');
      li.className = 'rec-empty';
      li.textContent = 'Sin records todavía';
      listEl.appendChild(li);
    }
    data.entries.forEach((e, i) => {
      const li = document.createElement('li');
      if (highlight && e.name === highlight.name && e.score === highlight.score && e.date === highlight.date) {
        li.className = 'rec-current';
      }
      [`${i + 1}.`, e.name, e.score.toLocaleString(), `${e.lines} L`, formatDate(e.date)].forEach(t => {
        const s = document.createElement('span');
        s.textContent = t;
        li.appendChild(s);
      });
      listEl.appendChild(li);
    });
    statsEl.textContent = `Mejor combo: ${data.bestCombo} · Líneas máximas: ${data.maxLines}`;
  }

  function renderAll() {
    const data = load();
    render(startList, startStats, data);
    render(goList, goStats, data);
  }

  function resetRecords() {
    if (!confirm('¿Borrar todos los records?')) return;
    try { localStorage.removeItem(KEY); } catch (_) { /* ignorar */ }
    highlight = null;
    pending = null;
    nameForm.classList.add('hidden');
    renderAll();
  }

  // Llamado desde endGame() de game.js.
  function onGameOver(stats) {
    const data = load();
    if (stats.maxCombo > data.bestCombo) data.bestCombo = stats.maxCombo;
    if (stats.lines > data.maxLines) data.maxLines = stats.lines;
    save(data);
    highlight = null;
    pending = null;
    if (qualifies(data, stats.score)) {
      pending = { score: stats.score, lines: stats.lines };
      nameForm.classList.remove('hidden');
      nameInput.value = '';
    } else {
      nameForm.classList.add('hidden');
    }
    renderAll();
    goBox.classList.remove('hidden');
    // Retraso para que el Space/flechas aún pulsados no se escriban en el campo.
    if (pending) setTimeout(() => { if (pending) nameInput.focus(); }, 400);
  }

  function confirmName() {
    if (!pending) return;
    const data = load();
    const rec = {
      name: nameInput.value.trim().slice(0, NAME_MAX) || 'ANÓNIMO',
      score: pending.score,
      lines: pending.lines,
      date: new Date().toISOString(),
    };
    data.entries.push(rec);
    data.entries.sort((a, b) => b.score - a.score);
    data.entries = data.entries.slice(0, MAX);
    save(data);
    highlight = rec;
    pending = null;
    nameForm.classList.add('hidden');
    renderAll();
  }

  function hideGameOver() {
    confirmName(); // no perder un record si se reinicia sin pulsar Guardar
    pending = null;
    highlight = null;
    goBox.classList.add('hidden');
    nameForm.classList.add('hidden');
  }

  nameInput.maxLength = NAME_MAX;
  nameForm.addEventListener('submit', e => { e.preventDefault(); confirmName(); });
  document.querySelectorAll('.reset-records-btn').forEach(b => b.addEventListener('click', resetRecords));

  startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    hideGameOver();
    startBtn.blur();
    init();
  });
  // Se registra después del listener de game.js, así que corre tras init().
  restartBtn.addEventListener('click', hideGameOver);

  renderAll();
  return { onGameOver };
})();
