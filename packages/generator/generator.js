/**
 * SVG Placeholder Image Generator
 * Pure SVG — no native image dependencies required.
 */

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function autoFontSize(width, height, text) {
  const maxDim = Math.min(width, height);
  const charCount = text.length || 1;
  // Scale font relative to the shorter dimension, shrink for longer text
  return clamp(Math.floor(maxDim / (charCount * 0.6 + 1)), 10, maxDim * 0.8);
}

// ── Basic placeholder ────────────────────────────────────────────────
function generatePlaceholder({
  width,
  height,
  bg,
  fg,
  text,
  rounded,
  fontSize,
  gradient,
  maxWidth = 4000,
  maxHeight = 4000,
}) {
  const wMax = Math.max(1, parseInt(maxWidth, 10) || 4000);
  const hMax = Math.max(1, parseInt(maxHeight, 10) || 4000);
  width = clamp(parseInt(width) || 300, 1, wMax);
  height = clamp(parseInt(height) || 300, 1, hMax);
  bg = bg || 'cccccc';
  fg = fg || '333333';
  text = text || `${width}×${height}`;
  rounded = parseInt(rounded) || 0;
  fontSize = parseInt(fontSize) || autoFontSize(width, height, text);

  let bgFill;
  let defs = '';

  if (gradient) {
    // gradient format: "dir-color1-color2"  e.g. "h-3498db-2ecc71" or "v-e74c3c-8e44ad"
    const parts = gradient.split('-');
    const dir = parts[0] || 'h';
    const c1 = parts[1] || bg;
    const c2 = parts[2] || bg;
    const x2 = dir === 'v' ? '0' : '1';
    const y2 = dir === 'v' ? '1' : '0';
    defs = `<defs><linearGradient id="grad" x1="0" y1="0" x2="${x2}" y2="${y2}">
      <stop offset="0%" stop-color="#${c1}"/>
      <stop offset="100%" stop-color="#${c2}"/>
    </linearGradient></defs>`;
    bgFill = 'url(#grad)';
  } else {
    bgFill = `#${bg}`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${defs}
  <rect width="${width}" height="${height}" fill="${bgFill}" rx="${rounded}" ry="${rounded}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" fill="#${fg}">${escapeXml(text)}</text>
</svg>`;
}

// ── Avatar (circle with initials) ────────────────────────────────────
function generateAvatar({ initials, bg, fg, size, fontSize }) {
  size = clamp(parseInt(size) || 128, 16, 2000);
  bg = bg || '3498db';
  fg = fg || 'ffffff';
  initials = (initials || '?').toUpperCase().slice(0, 3);
  fontSize = parseInt(fontSize) || Math.floor(size * 0.42);

  const r = size / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${r}" cy="${r}" r="${r}" fill="#${bg}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${fontSize}" fill="#${fg}">${escapeXml(initials)}</text>
</svg>`;
}

// ── Pattern placeholder ──────────────────────────────────────────────
function generatePattern({ width, height, bg, fg, pattern, rounded }) {
  width = clamp(parseInt(width) || 300, 1, 4000);
  height = clamp(parseInt(height) || 300, 1, 4000);
  bg = bg || 'eeeeee';
  fg = fg || 'cccccc';
  pattern = pattern || 'grid';
  rounded = parseInt(rounded) || 0;

  let patternDef = '';
  const spacing = 20;

  switch (pattern) {
    case 'dots': {
      const r = 2;
      patternDef = `<defs><pattern id="pat" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
        <circle cx="${spacing / 2}" cy="${spacing / 2}" r="${r}" fill="#${fg}"/>
      </pattern></defs>`;
      break;
    }
    case 'lines': {
      patternDef = `<defs><pattern id="pat" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
        <line x1="0" y1="${spacing}" x2="${spacing}" y2="0" stroke="#${fg}" stroke-width="1"/>
      </pattern></defs>`;
      break;
    }
    case 'crosshatch': {
      patternDef = `<defs><pattern id="pat" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="${spacing}" y2="${spacing}" stroke="#${fg}" stroke-width="0.5"/>
        <line x1="${spacing}" y1="0" x2="0" y2="${spacing}" stroke="#${fg}" stroke-width="0.5"/>
      </pattern></defs>`;
      break;
    }
    case 'grid':
    default: {
      patternDef = `<defs><pattern id="pat" x="0" y="0" width="${spacing}" height="${spacing}" patternUnits="userSpaceOnUse">
        <path d="M ${spacing} 0 L 0 0 0 ${spacing}" fill="none" stroke="#${fg}" stroke-width="0.5"/>
      </pattern></defs>`;
      break;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${patternDef}
  <rect width="${width}" height="${height}" fill="#${bg}" rx="${rounded}" ry="${rounded}"/>
  <rect width="${width}" height="${height}" fill="url(#pat)" rx="${rounded}" ry="${rounded}"/>
</svg>`;
}

module.exports = { generatePlaceholder, generateAvatar, generatePattern };
