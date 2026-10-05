# Testnan — 1 area = 1 file test/test_<slug>.py

Aturan wajib, bukan opsional. Setiap eksekusi ubah kode Python tutup
dengan test di `test/` folder project. Hanya saat eksekusi (ada file
Python diubah). Skip untuk obrolan biasa, plan tanpa eksekusi, dan
baca kode tanpa perubahan.

Format nama: `test/test_<slug>.py` (flat, tanpa tanggal)
Contoh: `test/test_auth_login.py`
Cek duplikat dulu: `ls test/test_*.py` + `grep -l <keyword> test/test_*.py`.
Ada cocok: tambah case di file itu. Jangan buat baru.

Runner: `python3 test/run.py` (semua) atau
`python3 test/run.py <keyword>` (satuan). Stdlib `unittest` saja.

Template isi ada di `skills/testnan/SKILL.md`.

Kontrol: `/testnan on` | `/testnan off`. Default: `on`.
