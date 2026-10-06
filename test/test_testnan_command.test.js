import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { routeCommand } = require('../hooks/testnan-command.cjs');

test('bare kembali status', () => {
  assert.equal(routeCommand('').action, 'status');
});

test('on/off jadi mode', () => {
  assert.equal(routeCommand('on').mode, 'on');
  assert.equal(routeCommand('OFF').mode, 'off');
});

test('version dikenali', () => {
  assert.equal(routeCommand('version').action, 'version');
  assert.equal(routeCommand('--version').action, 'version');
});

test('arg tak dikenal ditolak', () => {
  assert.equal(routeCommand('rusak').action, 'unknown');
});
