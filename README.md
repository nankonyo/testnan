<p align="center">
  <img src="testnan-cover.jpeg" width="700" alt="Testnan, tiap ubah kode wajib ada test">
</p>

<h1 align="center">Testnan</h1>

<p align="center">
  <em>Satu area, satu file test. Tidak ada ubah kode tanpa bukti jalan.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/works%20with-opencode-111111?style=flat-square" alt="Works with opencode">
  <img src="https://img.shields.io/badge/python-3.8%2B-111111?style=flat-square" alt="Python 3.8+">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
</p>

---

AI rajin nulis kode, malas nulis test. Testnan memaksanya.

Setiap kali agent mengubah kode Python — fitur, fix, debug, refactor —
ia wajib menutupnya dengan test di folder `test/` project tersebut.
Satu area, satu file. Obrolan biasa dan plan tanpa eksekusi tidak
butuh test.

## Contoh hasil

Selesai fix login, agent tulis `test/test_auth_login.py`:

```python
import unittest

from auth.login import guard_kosong


class TestGuardKosong(unittest.TestCase):
    def test_tolak_password_kosong(self):
        self.assertFalse(guard_kosong(""))
```

Lalu bukti jalan:

```bash
$ python3 test/run.py
......
Ran 6 tests in 0.071s
OK
```

## Cara kerja

1. Plugin injeksi aturan testnan ke system prompt setiap turn (bila mode `on`).
2. Agent kerja seperti biasa.
3. Sebelum tulis test, agent cek duplikat: `ls test/test_*.py` +
   `grep -l <keyword> test/test_*.py`.
4. File cocok ada: tambah case di file itu, jangan buat baru. Belum ada:
   buat `test/test_<slug>.py`. Slug snake_case, maks 50 char, tanpa
   tanggal, tanpa subfolder.
5. Verifikasi: `python3 test/run.py` (semua) atau
   `python3 test/run.py <keyword>` (satuan). Harus hijau.

Kapan wajib: ada file Python diubah/dibuat/dihapus. Kapan skip:
obrolan biasa, tanya jawab, plan tanpa eksekusi, baca kode tanpa
perubahan, ubah non-Python saja. Aturan putus: tidak ada file Python
diubah = tidak ada test baru. Tapi test lama yang relevan tetap
harus lolos.

## Install

Satu file plugin dukung OpenCode 1.x (`server()`) dan 2.x (`id`+`setup`).

### OpenCode 2.x (dari checkout)

Entry harus direktori, bukan file:

```json
{ "plugins": ["/abs/path/testnan-checkout"] }
```

Path `./` relatif terhadap `opencode.json` project. Untuk satu checkout
dipakai banyak project, isi path absolut ke root checkout (ia temukan
`hooks/` dan `skills/` relatif ke lokasi plugin).

Aktifkan ulang config tanpa restart:

```bash
opencode reload
```

### OpenCode 1.x

```json
{ "plugin": ["./.opencode/plugins/testnan.mjs"] }
```

## Perintah

| Perintah | Efek |
|---|---|
| `/testnan` | Lapor mode + versi, tanpa ubah apa pun |
| `/testnan on` | Nyalakan kewajiban test (default) |
| `/testnan off` | Matikan sampai dinyalakan lagi |
| `/testnan version` | Lapor versi terpasang (dari `package.json`) |

Env override default: `TESTNAN_DEFAULT_MODE=off`.

## Isi test

Stdlib `unittest` saja, tanpa pytest, tanpa deps tambahan.
Butuh Python 3.8+.

- 1 file = 1 area. Class per unit, method `test_*` per case.
- Import modul target langsung. Tak boleh ada test kosong tanpa assert.
- Dua file test untuk satu area = salah. Extend, jangan duplikat.

## Runner

Satu file: `test/run.py`. Stdlib saja. Path absolut dari lokasi
file, aman dipanggil dari cwd mana pun.

```bash
python3 test/run.py              # semua test
python3 test/run.py auth_login   # satuan (cocok nama file/class/method)
```

Keluar 0 bila lolos semua, non-0 bila ada gagal. Jangan tambah
runner bash/Makefile/pytest. Satu runner cukup.

## Tes plugin ini

Repo ini dogfood pakai aturannya sendiri:

```bash
python3 test/run.py            # semua
python3 test/run.py naming     # satuan
```

`test/test_naming.py`: kontrak nama flat tanpa tanggal.
`test/test_runner.py`: kontrak runner semua/satuan.

## Struktur

```text
.opencode/plugins/testnan.mjs  # plugin: command, skills, injeksi prompt
.opencode/command/testnan.md    # template /testnan
skills/testnan/SKILL.md         # aturan test + anti-duplikat (sumber injeksi)
hooks/testnan-config.js         # mode on/off
hooks/testnan-instructions.js   # bangun teks injeksi
hooks/testnan-command.js        # router bare/on/off/version
test/test_naming.py             # kontrak nama flat tanpa tanggal
test/test_runner.py             # kontrak runner semua/satuan
test/run.py                     # runner: semua atau satuan via -k
testnan-cover.jpeg              # cover
docs/YYYYMMDD/                  # log eksekusi harian (ala docsnan)
```

## Lisensi

MIT. Lihat [LICENSE](LICENSE).
