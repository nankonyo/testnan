#!/usr/bin/env node
// testnan — shared instruction builder (mirip docsnan-instructions.js).
// SKILL.md sumber tunggal. Fallback bila file tak terbaca.

const fs = require('fs');
const path = require('path');
const { DEFAULT_MODE, normalizePersistedMode } = require('./testnan-config');

const SKILL_PATH = path.join(__dirname, '..', 'skills', 'testnan', 'SKILL.md');

function getFallbackInstructions() {
  return 'TESTNAN MODE ACTIVE — level: on\n\n' +
    'Tutup setiap eksekusi ubah kode Python dengan test di test/test_<slug>.py (flat, tanpa tanggal). ' +
    'Cek duplikat dulu via `ls test/test_*.py` + `grep`. Ada yang cocok: tambah case di file itu. ' +
    'Jalankan via `python3 test/run.py` (semua) atau `python3 test/run.py <keyword>` (satuan). Stdlib unittest saja.';
}

function getTestnanInstructions(mode) {
  const m = normalizePersistedMode(mode) || DEFAULT_MODE;
  if (m === 'off') return '';
  try {
    const body = String(fs.readFileSync(SKILL_PATH, 'utf8')).replace(/^---[\s\S]*?---\s*/, '');
    return 'TESTNAN MODE ACTIVE — level: on\n\n' + body.trim();
  } catch (e) {
    return getFallbackInstructions();
  }
}

module.exports = { getTestnanInstructions, getFallbackInstructions };
