---
description: Control testnan (on|off|version, default status)
---

Switch testnan. Subcommand = $ARGUMENTS (satu kata, case-insensitive).

- `` (kosong): lapor mode aktif + versi. Tanpa ubah apa pun.
- `on`: nyalakan kewajiban test (berlaku pesan berikut).
- `off`: matikan sampai dinyalakan lagi.
- `version`: lapor versi terpasang (dari package.json). Tanpa ubah apa pun.
- Selain itu: abaikan, beri tahu pemakaian valid.

When on: tutup setiap eksekusi ubah kode (semua bahasa) dengan test di `test/test_<slug>.*` (flat di root, tanpa tanggal, tanpa subfolder). Sebelum buat file baru, cek duplikat via `ls test/test_*` + `grep <keyword> test/test_*`. File cocok ada: tambah case di file itu, jangan buat baru. Belum ada: buat `test/test_<slug>.<ext>` dari template di SKILL.md (ext ikut bahasa). Runner: runner bawaan project (`python3 test/run.py`, `npm test`, `go test ./...`, dst). Stdlib/native saja, tanpa deps baru bila tak perlu.
