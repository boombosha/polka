'use strict';

const path = require('path');
const dotenv = require('dotenv');

/** Monorepo root (../../ from packages/config). */
const repoRoot = path.resolve(__dirname, '..', '..');

dotenv.config({ path: path.join(repoRoot, '.env') });
dotenv.config();

function intEnv(name, fallback, min, max) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = parseInt(String(raw), 10);
  if (Number.isNaN(n)) return fallback;
  let v = n;
  if (min != null) v = Math.max(min, v);
  if (max != null) v = Math.min(max, v);
  return v;
}

/**
 * @typedef {object} PolkaConfig
 * @property {'development'|'production'|'test'|string} nodeEnv
 * @property {number} port
 * @property {string} publicOrigin — без завершающего `/`; пустая строка = «не задано»
 * @property {number} placeholderMaxWidth
 * @property {number} placeholderMaxHeight
 */

const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: intEnv('PORT', 4700, 1, 65535),
  publicOrigin: String(process.env.PUBLIC_ORIGIN || '').replace(/\/$/, ''),
  placeholderMaxWidth: intEnv('PLACEHOLDER_MAX_WIDTH', 4000, 1, 32000),
  placeholderMaxHeight: intEnv('PLACEHOLDER_MAX_HEIGHT', 4000, 1, 32000),
});

module.exports = { config, repoRoot };
