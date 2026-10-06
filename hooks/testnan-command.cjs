#!/usr/bin/env node
// testnan — command router (pure, no deps).
// Distinguishes: bare, on, off, version. No ambiguous behavior.

const { normalizeMode } = require('./testnan-config.cjs');

function routeCommand(rawArgs) {
  const arg = String(rawArgs || '').trim().toLowerCase();
  if (arg === '') return { action: 'status' };
  if (normalizeMode(arg)) return { action: 'mode', mode: normalizeMode(arg) };
  if (arg === 'version' || arg === '-v' || arg === '--version') return { action: 'version' };
  return { action: 'unknown', arg: String(rawArgs || '').trim() };
}

module.exports = { routeCommand };
