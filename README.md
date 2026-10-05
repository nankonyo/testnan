<p align="center"><em>Satu area, satu file test. Tak ada kerja tanpa bukti jalan.</em></p>

# Testnan

Setiap kali agent ubah kode Python, ia wajib menutupnya dengan test
di folder `test/` project tersebut. Satu area, satu file. Obrolan
biasa dan plan tanpa eksekusi tak perlu test.

## Contoh hasil

Selesai fix login, agent tulis `test/test_auth_login.py`:

```python
import unittest

from auth.login import guard_kosong


class TestGuardKosong(unittest.TestCase):
    def test_tolak_password_kosong(self):
        self.assertFalse(guard_kosong(""))
```

## Cara kerja

1. Plugin injeksi aturan testnan ke system prompt setiap turn (bila mode `on`).
2. Agent kerja seperti biasa.
3. Sebelum tulis test, agent cek duplikat: `ls test/test_*.py` +
   `grep -l <keyword> test/test_*.py`.
4. File cocok ada: tambah case di file itu. Belum ada: buat baru
   `test/test_<slug>.py`. Slug snake_case, maks 50 char, tanpa tanggal.
5. Verifikasi: `python3 test/run.py` (semua) atau
   `python3 test/run.py <keyword>` (satuan).

Kapan wajib: ada file Python diubah/dibuat/dihapus. Kapan skip:
obrolan biasa, tanya jawab, plan tanpa eksekusi, baca kode tanpa
perubahan. Aturan putus: tidak ada file Python diubah = tidak ada
test baru. Test lama relevan tetap harus lolos.

## Install

Satu file plugin dukung OpenCode 1.x (`server()`) dan 2.x (`id`+`setup`).

### OpenCode 2.x (dari checkout)

Entry harus direktori, bukan file:

```json
{ "plugins": ["/abs/path/testnan-checkout"] }
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

Stdlib `unittest` saja, tanpa pytest. Butuh Python 3.8+.

```bash
python3 test/run.py            # semua
python3 test/run.py auth_login # satuan (file/class/method cocok keyword)
```

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
```

## Lisensi

MIT. Lihat [LICENSE](LICENSE).
