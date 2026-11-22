'use strict';

// Skins visuales. Cada tema define paleta (índices 1-8), grilla y drawBlock propio.
(function () {
  const STORAGE_KEY = 'tetris.theme';

  function reset(ctx) {
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.globalAlpha = 1;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const THEMES = {
    retro: {
      label: 'Retro',
      grid: '#22222e',
      colors: [null, '#4dd0e1', '#ffd54f', '#ba68c8', '#81c784', '#e57373', '#7986cb', '#ffb74d', '#f06292'],
      drawBlock(ctx, x, y, i, size, alpha) {
        ctx.globalAlpha = alpha ?? 1;
        ctx.fillStyle = this.colors[i];
        ctx.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(x * size + 1, y * size + 1, size - 2, 4);
        reset(ctx);
      },
    },
    neon: {
      label: 'Neón',
      grid: '#1a1a24',
      colors: [null, '#00fff2', '#ffee00', '#d400ff', '#39ff14', '#ff1744', '#4d6bff', '#ff9100', '#ff2bd6'],
      drawBlock(ctx, x, y, i, size, alpha) {
        const c = this.colors[i];
        const a = alpha ?? 1;
        const px = x * size + 3, py = y * size + 3, s = size - 6;
        ctx.globalAlpha = a;
        ctx.shadowColor = c;
        ctx.shadowBlur = 12;
        ctx.strokeStyle = c;
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, s, s);
        ctx.fillStyle = c;
        ctx.globalAlpha = a * 0.35;
        ctx.fillRect(px, py, s, s);
        reset(ctx);
      },
    },
    pastel: {
      label: 'Pastel',
      grid: '#e6dff0',
      colors: [null, '#a8e6ef', '#fff1a8', '#d9b8f0', '#b8ecc0', '#ffb3b3', '#b5bff5', '#ffd3a1', '#ffb8d1'],
      drawBlock(ctx, x, y, i, size, alpha) {
        ctx.globalAlpha = alpha ?? 1;
        ctx.fillStyle = this.colors[i];
        roundRect(ctx, x * size + 2, y * size + 2, size - 4, size - 4, 8);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        roundRect(ctx, x * size + 8, y * size + 5, size - 16, 4, 2);
        ctx.fill();
        reset(ctx);
      },
    },
    pixel: {
      label: 'Pixel art',
      grid: '#262633',
      colors: [null, '#29adff', '#ffec27', '#c2579a', '#00e436', '#ff004d', '#5f57ff', '#ffa300', '#ff77a8'],
      drawBlock(ctx, x, y, i, size, alpha) {
        const px = x * size, py = y * size, u = size / 6;
        ctx.globalAlpha = alpha ?? 1;
        ctx.fillStyle = this.colors[i];
        ctx.fillRect(px + 1, py + 1, size - 2, size - 2);
        // textura: luz arriba/izquierda, sombra abajo/derecha, puntos en damero
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(px + 1, py + 1, size - 2, u);
        ctx.fillRect(px + 1, py + 1, u, size - 2);
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(px + 1, py + size - 1 - u, size - 2, u);
        ctx.fillRect(px + size - 1 - u, py + 1, u, size - 2);
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        for (let a = 2; a < 4; a++)
          for (let b = 2; b < 4; b++)
            if ((a + b) % 2 === 0) ctx.fillRect(px + a * u, py + b * u, u, u);
        reset(ctx);
      },
    },
  };

  let themeName = 'retro';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (Object.prototype.hasOwnProperty.call(THEMES, saved)) themeName = saved;
  } catch (e) { /* modo privado */ }

  window.THEMES = THEMES;
  window.activeTheme = THEMES[themeName];
  document.body.dataset.theme = themeName;

  window.setTheme = function (name, redraw) {
    if (!Object.prototype.hasOwnProperty.call(THEMES, name)) return;
    window.activeTheme = THEMES[name];
    document.body.dataset.theme = name;
    try { localStorage.setItem(STORAGE_KEY, name); } catch (e) { /* ignorar */ }
    if (redraw) {
      draw();
      drawNext();
    }
  };

  const select = document.getElementById('theme-select');
  if (select) {
    for (const key of Object.keys(THEMES)) {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = THEMES[key].label;
      select.appendChild(opt);
    }
    select.value = themeName;
    select.addEventListener('change', () => {
      window.setTheme(select.value, true);
      select.blur();
    });
  }
})();
