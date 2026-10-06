# Testnan — 1 area = 1 file test/test_<slug>.*

Aturan wajib, bukan opsional. Setiap eksekusi ubah kode (bahasa apa
pun) tutup dengan test di `test/` folder project. Hanya saat eksekusi
(ada file kode diubah). Skip untuk obrolan biasa, plan tanpa eksekusi,
dan baca kode tanpa perubahan.

Format nama: `test/test_<slug>.<ext>` (flat, tanpa tanggal)
Contoh: `test/test_auth_login.py`, `test/test_auth_login.test.js`
Ext ikut bahasa + konvensi native. Cek duplikat dulu:
`ls test/test_*` + `grep -l <keyword> test/test_*`.
Ada cocok: tambah case di file itu. Jangan buat baru.

Runner: pakai runner bawaan project (`python3 test/run.py`,
`npm test`, `go test ./...`, `cargo test`, dst). Stdlib/native saja,
tanpa deps baru bila tak perlu.

Template isi ada di `skills/testnan/SKILL.md`.

Kontrol: `/testnan on` | `/testnan off`. Default: `on`.
