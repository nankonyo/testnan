---
description: Control testnan (on|off|version, default status)
---

Switch testnan. Subcommand = $ARGUMENTS (satu kata, case-insensitive).

- `` (kosong): lapor mode aktif + versi. Tanpa ubah apa pun.
- `on`: nyalakan kewajiban test (berlaku pesan berikut).
- `off`: matikan sampai dinyalakan lagi.
- `version`: lapor versi terpasang (dari package.json). Tanpa ubah apa pun.
- Selain itu: abaikan, beri tahu pemakaian valid.

When on: tutup setiap eksekusi ubah kode Python dengan test di `test/test_<slug>.py` (flat di root, tanpa tanggal, tanpa subfolder). Sebelum buat file baru, cek duplikat via `ls test/test_*.py` + `grep <keyword> test/test_*.py`. File cocok ada: tambah case di file itu, jangan buat baru. Belum ada: buat `test/test_<slug>.py` dari template unittest di SKILL.md. Runner: `python3 test/run.py` (semua) atau `python3 test/run.py <keyword>` (satuan). Stdlib `unittest` saja, tanpa pytest.
