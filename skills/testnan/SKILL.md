---
name: testnan
description: >
  Wajibkan tiap ubah kode Python ditutup test di test/test_<slug>.py.
  Flat di root tanpa tanggal. Cek duplikat dulu, reuse file cocok.
  Runner test/run.py untuk semua atau satuan. Stdlib unittest saja.
argument-hint: "[on|off]"
license: MIT
---

# Testnan

Tutup setiap eksekusi ubah kode Python dengan test. 1 area = 1 file.

## Kapan wajib test

Hanya saat ada file Python diubah/dibuat/dihapus, atau bug difix,
fitur ditambah, refactor dijalankan. Berlaku untuk semua jenis
eksekusi yang sentuh kode Python.

## Kapan skip (tanpa test)

- Obrolan biasa: salam, tanya jawab, penjelasan, diskusi konsep.
- Plan / rencana saja tanpa eksekusi: belum ada file diubah.
- Baca/browse kode saja tanpa perubahan.
- Ubah non-Python saja (docs, config): test tak wajib, tulis alasan
  di log bila pakai docsnan.

Aturan putus: tidak ada file Python diubah = tidak ada test baru.
Tapi test lama yang relevan tetap harus lolos (`python3 test/run.py`).

## Lokasi dan nama

- Folder: `test/` di root project. Flat. Tanpa subfolder tanggal.
- Nama: `test_<slug>.py`. Contoh: `test_auth_login.py`,
  `test_api_cache.py`.
- Slug: dari area/fitur. Lowercase snake_case. Non-alfanumerik jadi
  `_`. Maks 50 char. Contoh: "Auth Login" jadi `auth_login`.
- Jangan pakai tanggal/jam di nama file. Jangan buat file baru bila
  slug sama sudah ada.

## Anti-duplikat (wajib sebelum tulis)

1. `ls test/test_*.py` — lihat file yang ada.
2. `grep -l <keyword> test/test_*.py` — cari area cocok
   (nama fungsi, modul, keyword fitur).
3. Kena: tambah `TestCase`/`test_*` baru di file itu. Jangan buat
   file baru.
4. Tak kena: buat `test/test_<slug>.py` baru dari template bawah.
5. Satu area = satu file. Dua file test satu area = salah.

## Isi (stdlib unittest saja)

Tanpa pytest, tanpa deps tambahan. Butuh Python 3.8+.

Template:

```python
import unittest

from auth.login import guard_kosong


class TestGuardKosong(unittest.TestCase):
    def test_tolak_password_kosong(self):
        self.assertFalse(guard_kosong(""))


if __name__ == "__main__":
    unittest.main()
```

Aturan: 1 file = 1 area. Class per unit, method `test_*` per case.
Import modul target langsung, bukan via path hack bila bisa.
Tak boleh ada test kosong tanpa assert.

## Runner

Satu file: `test/run.py`. Stdlib saja.

- Semua: `python3 test/run.py`
- Satuan: `python3 test/run.py <keyword>` (cocok nama file,
  class, atau method; contoh `python3 test/run.py auth_login`
  atau `python3 test/run.py test_tolak_password_kosong`)
- Keluar 0 bila lolos semua, non-0 bila ada gagal.
- Jangan tambah runner bash/Makefile/pytest. Satu runner cukup.

## Batas

- `/testnan off` hentikan kewajiban sampai `/testnan on` lagi.
- Mode default `on`. Env `TESTNAN_DEFAULT_MODE=off` ubah default.
- Test tulis normal, jelas. Bukan gaya caveman/ponytail.
