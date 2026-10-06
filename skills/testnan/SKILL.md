---
name: testnan
description: >
  Wajibkan tiap ubah kode (semua bahasa) ditutup test di test/test_<slug>.*.
  Flat di root tanpa tanggal. Cek duplikat dulu, reuse file cocok.
  Runner bawaan project untuk semua atau satuan. Stdlib/native saja.
argument-hint: "[on|off]"
license: MIT
---

# Testnan

Tutup setiap eksekusi ubah kode (semua bahasa) dengan test. 1 area = 1 file.

## Kapan wajib test

Hanya saat ada file kode diubah/dibuat/dihapus — bahasa apa pun
(`.py`, `.js`, `.ts`, `.go`, `.rs`, `.java`, dst), atau bug difix,
fitur ditambah, refactor dijalankan. Berlaku untuk semua jenis
eksekusi yang sentuh kode.

## Kapan skip (tanpa test)

- Obrolan biasa: salam, tanya jawab, penjelasan, diskusi konsep.
- Plan / rencana saja tanpa eksekusi: belum ada file diubah.
- Baca/browse kode saja tanpa perubahan.
- Ubah non-kode saja (docs, config, markdown): test tak wajib, tulis
  alasan di log bila pakai docsnan.

Aturan putus: tidak ada file kode diubah = tidak ada test baru.
Tapi test lama yang relevan tetap harus lolos.

## Lokasi dan nama

- Folder: `test/` di root project. Flat. Tanpa subfolder tanggal.
- Nama: `test_<slug>.<ext>`. Contoh: `test_auth_login.py`,
  `test_auth_login.test.js`, `test_auth_login_test.go`.
- Ext ikut bahasa + konvensi native. Slug: dari area/fitur. Lowercase
  snake_case. Non-alfanumerik jadi `_`. Maks 50 char. Contoh:
  "Auth Login" jadi `auth_login`.
- Jangan pakai tanggal/jam di nama file. Jangan buat file baru bila
  slug sama sudah ada.

## Anti-duplikat (wajib sebelum tulis)

1. `ls test/test_*` — lihat file yang ada.
2. `grep -l <keyword> test/test_*` — cari area cocok
   (nama fungsi, modul, keyword fitur).
3. Kena: tambah `TestCase`/`test_*` baru di file itu. Jangan buat
   file baru.
4. Tak kena: buat `test/test_<slug>.<ext>` baru dari template bawah.
5. Satu area = satu file. Dua file test satu area = salah.

## Isi (stdlib/native saja)

Tanpa deps tambahan bila stdlib cukup. Python 3.8+ pakai `unittest`,
JS pakai `node:test`, Go pakai `testing`, dst.

Template (Python):

```python
import unittest

from auth.login import guard_kosong


class TestGuardKosong(unittest.TestCase):
    def test_tolak_password_kosong(self):
        self.assertFalse(guard_kosong(""))


if __name__ == "__main__":
    unittest.main()
```

Template (JS):

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('tolak password kosong', () => {
  assert.equal(guardKosong(''), false);
});
```

Aturan: 1 file = 1 area. Class per unit, method `test_*` per case.
Import modul target langsung, bukan via path hack bila bisa.
Tak boleh ada test kosong tanpa assert.

## Runner

Pakai runner bawaan project. Stdlib saja, jangan tambah
runner bash/Makefile/pytest bila sudah ada.

- Python: `python3 test/run.py` (semua) atau
  `python3 test/run.py <keyword>` (satuan, cocok nama file/class/method)
- JS: `npm test` atau `node --test test/*.test.js`
- Go: `go test ./...`
- Rust: `cargo test`

Keluar 0 bila lolos semua, non-0 bila ada gagal.

## Batas

- `/testnan off` hentikan kewajiban sampai `/testnan on` lagi.
- Mode default `on`. Env `TESTNAN_DEFAULT_MODE=off` ubah default.
- Test tulis normal, jelas. Bukan gaya caveman/ponytail.
