#!/usr/bin/env node
// testnan — shared instruction builder (mirip docsnan-instructions.js).
// SKILL.md sumber tunggal. Fallback bila file tak terbaca.

const fs = require('fs');
const path = require('path');
const { DEFAULT_MODE, normalizePersistedMode } = require('./testnan-config.cjs');

const SKILL_PATH = path.join(__dirname, '..', 'skills', 'testnan', 'SKILL.md');

function getFallbackInstructions() {
  return 'TESTNAN MODE ACTIVE — level: on\n\n' +
    'Tutup setiap eksekusi ubah kode (semua bahasa) dengan test di test/test_<slug>.* (flat, tanpa tanggal). ' +
    'Cek duplikat dulu via `ls test/test_*` + `grep`. Ada yang cocok: tambah case di file itu. ' +
    'Jalankan via runner bawaan project (`python3 test/run.py`, `npm test`, `go test ./...`, dst). Stdlib/native saja.';
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
