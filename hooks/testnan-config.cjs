#!/usr/bin/env node
// testnan — shared configuration resolver (mirip docsnan-config.js).
//
// Resolution order:
//   1. TESTNAN_DEFAULT_MODE env (on|off)
//   2. $XDG_CONFIG_HOME/testnan/config.json atau ~/.config/testnan/config.json
//   3. 'on'

const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_MODE = 'on';
const VALID_MODES = ['on', 'off'];

function normalizeMode(mode) {
  if (typeof mode !== 'string') return null;
  const m = mode.trim().toLowerCase();
  return VALID_MODES.includes(m) ? m : null;
}

function normalizePersistedMode(mode) {
  return normalizeMode(mode);
}

function getConfigDir() {
  if (process.env.XDG_CONFIG_HOME) {
    return path.join(process.env.XDG_CONFIG_HOME, 'testnan');
  }
  return path.join(os.homedir(), '.config', 'testnan');
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

function getDefaultMode() {
  const env = process.env.TESTNAN_DEFAULT_MODE;
  if (env && VALID_MODES.includes(String(env).toLowerCase())) {
    return String(env).toLowerCase();
  }
  try {
    const raw = fs.readFileSync(getConfigPath(), 'utf8');
    const cfg = JSON.parse(raw);
    if (cfg && normalizeMode(cfg.defaultMode)) return normalizeMode(cfg.defaultMode);
  } catch (e) {}
  return DEFAULT_MODE;
}

module.exports = {
  DEFAULT_MODE,
  VALID_MODES,
  normalizeMode,
  normalizePersistedMode,
  getConfigDir,
  getConfigPath,
  getDefaultMode,
};
