<p align="center">
  <img src="testnan-cover.jpeg" width="700" alt="Testnan, tiap ubah kode wajib ada test">
</p>

<h1 align="center">Testnan</h1>

<p align="center">
  <em>Satu area, satu file test. Tidak ada ubah kode tanpa bukti jalan.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/works%20with-opencode-111111?style=flat-square" alt="Works with opencode">
  <img src="https://img.shields.io/badge/tests-stdlib_native-111111?style=flat-square" alt="Stdlib native tests">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
</p>

---

AI rajin nulis kode, malas nulis test. Testnan memaksanya.

Setiap kali agent mengubah kode (bahasa apa pun) — fitur, fix, debug,
refactor — ia wajib menutupnya dengan test di folder `test/` project
tersebut. Satu area, satu file. Obrolan biasa dan plan tanpa eksekusi
tidak butuh test.

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
3. Sebelum tulis test, agent cek duplikat: `ls test/test_*` +
   `grep -l <keyword> test/test_*`.
4. File cocok ada: tambah case di file itu, jangan buat baru. Belum ada:
   buat `test/test_<slug>.<ext>` (ext ikut bahasa, contoh `.py`,
   `.test.js`). Slug snake_case, maks 50 char, tanpa
   tanggal, tanpa subfolder.
5. Verifikasi: runner bawaan project (`python3 test/run.py`,
   `npm test`, `go test ./...`, dst). Harus hijau.

Kapan wajib: ada file kode diubah/dibuat/dihapus (bahasa apa pun).
Kapan skip: obrolan biasa, tanya jawab, plan tanpa eksekusi, baca kode
tanpa perubahan, ubah non-kode saja (docs, config, markdown).
Aturan putus: tidak ada file kode diubah = tidak ada test baru.
Tapi test lama yang relevan tetap harus lolos.

## Install

Plugin dukung OpenCode 1.x (`server()`) dan 2.x (`id`+`setup`).
Entry root `index.js` (resolve direktori plugin).

### OpenCode 2.x (dari npm, disarankan)

Paket sudah rilis publik: `nankonyo-testnan` v0.1.0.

```bash
npm i nankonyo-testnan
```

Lalu di `opencode.json(c)`:

```jsonc
{ "plugins": ["nankonyo-testnan"] }
```

Pin versi bila perlu: `"nankonyo-testnan@0.1.0"`.

Aktifkan ulang config tanpa restart:

```bash
opencode reload
```

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

Env override default: `TESTNAN_DEFAULT_MODE=off` (env menang atas
`~/.config/testnan/config.json`, default `on`). Mode aktif
tersimpan di `~/.config/opencode/.testnan-active`.

## Isi test

Stdlib/native saja, tanpa deps baru bila tak perlu. Python pakai
`unittest`, JS pakai `node:test`, Go pakai `testing`, dst.

- 1 file = 1 area. Class per unit, method `test_*` per case.
- Import modul target langsung. Tak boleh ada test kosong tanpa assert.
- Dua file test untuk satu area = salah. Extend, jangan duplikat.

## Runner

Pakai runner bawaan project. Stdlib saja.

```bash
python3 test/run.py              # python semua
python3 test/run.py auth_login   # python satuan
npm test                         # js semua
go test ./...                    # go semua
cargo test                       # rust semua
```

Keluar 0 bila lolos semua, non-0 bila ada gagal. Jangan tambah
runner bash/Makefile/pytest bila sudah ada.

## Tes plugin ini

Repo ini dogfood pakai aturannya sendiri:

```bash
python3 test/run.py            # python semua
python3 test/run.py naming     # python satuan
npm test                       # js semua
```

`test/test_naming.py`: kontrak nama flat tanpa tanggal (semua bahasa).
`test/test_runner.py`: kontrak runner python semua/satuan.
`test/test_testnan_command.test.js`: kontrak router command JS.

## Struktur

```text
index.js                        # entrypoint root (resolve direktori plugin)
package.json                    # nama nankonyo-testnan, versi, entry npm
AGENTS.md                       # ringkasan aturan (sumber injeksi ringan)
.opencode/plugins/testnan.mjs  # plugin: command, skills, injeksi prompt
.opencode/command/testnan.md    # template /testnan
skills/testnan/SKILL.md         # aturan test + anti-duplikat (sumber injeksi)
hooks/testnan-config.cjs        # mode on/off
hooks/testnan-instructions.cjs  # bangun teks injeksi
hooks/testnan-command.cjs       # router bare/on/off/version
test/test_naming.py             # kontrak nama flat tanpa tanggal (semua bahasa)
test/test_runner.py             # kontrak runner python semua/satuan
test/test_testnan_command.test.js # kontrak router command JS
test/run.py                     # runner python: semua atau satuan via -k
testnan-cover.jpeg              # cover
docs/YYYYMMDD/                  # log eksekusi harian (ala docsnan)
```

## Lisensi

MIT. Lihat [LICENSE](LICENSE).
