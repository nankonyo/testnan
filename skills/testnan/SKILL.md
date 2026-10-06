---

name: testnan
description: >
  Wajibkan validasi test setelah setiap perubahan kode. Gunakan test
  existing bila sudah mencakup behavior. Jika belum, tambah atau
  perbarui test di test/test_<slug>.*. Satu area/fitur = satu file test.
  Cek duplikat sebelum membuat file. Gunakan runner bawaan project dan
  standard library/native testing framework bila memungkinkan.
argument-hint: "[on|off]"
license: MIT
---

# Testnan

Testnan memastikan setiap perubahan kode memiliki validasi test yang
relevan dan dapat dijalankan.

Prinsip utama:

> Jangan membuat test hanya agar terlihat ada test.
> Test harus membuktikan behavior yang benar.

## Mode

Default:

```text
on
```

Perintah:

```text
/testnan on
/testnan off
```

Jika mode `off`, kewajiban Testnan dihentikan sampai `/testnan on`.

Environment:

```text
TESTNAN_DEFAULT_MODE=off
```

dapat digunakan untuk mengubah default menjadi `off`.

Mode `off` hanya menonaktifkan kewajiban otomatis. Jika user secara
eksplisit meminta test, test tetap harus dibuat.

---

# 1. Kapan Test Wajib

Testnan aktif ketika eksekusi agent menyebabkan perubahan pada file kode,
termasuk:

* membuat file kode
* mengubah file kode
* menghapus file kode
* menambah fitur
* mengubah behavior
* memperbaiki bug
* mengubah logic
* refactor yang berpotensi memengaruhi behavior
* mengubah API/function/method
* mengubah validation
* mengubah query/data-access logic
* mengubah error handling

Contoh file kode:

```text
.py
.js
.ts
.tsx
.go
.rs
.java
.kt
.php
.rb
.cpp
.c
.cs
```

dan bahasa kode lain yang digunakan project.

## Tidak wajib membuat test baru

Tidak perlu membuat test baru jika perubahan tidak menyentuh kode,
misalnya:

* dokumentasi
* README
* markdown
* komentar saja
* konfigurasi murni
* formatting tanpa perubahan behavior
* rename file non-kode

Namun test existing yang relevan tidak boleh sengaja dibiarkan gagal.

---

# 2. Perubahan Bug = Regression Test

Setiap bug fix harus diperiksa apakah bug tersebut dapat direproduksi
sebagai test.

Jika bisa:

```text
1. Reproduksi behavior yang salah
2. Buat regression test
3. Pastikan test gagal sebelum fix jika memungkinkan
4. Implementasikan fix
5. Jalankan test
6. Pastikan test sekarang lolos
```

Tujuannya adalah memastikan bug yang sama tidak kembali.

Jangan hanya memperbaiki source code tanpa test untuk bug yang dapat
diuji secara unit.

---

# 3. Perubahan Fitur = Test Behavior Baru

Jika fitur atau behavior baru ditambahkan:

```text
1. Cari test yang sudah ada untuk area tersebut
2. Reuse file test yang cocok
3. Tambahkan test case untuk behavior baru
4. Jalankan test
```

Jangan membuat file test baru jika file existing sudah mewakili area
yang sama.

---

# 4. Refactor

Refactor tidak otomatis membutuhkan test baru.

Jika behavior tidak berubah:

```text
existing test
    ↓
jalankan
    ↓
PASS
```

sudah cukup.

Tetapi jika refactor mengubah behavior, API, error handling, atau
interface, perlakukan sebagai perubahan kode biasa dan tambahkan atau
perbarui test yang relevan.

Jangan mengubah assertion hanya untuk membuat test lama menjadi PASS
kecuali behavior yang diharapkan memang sengaja berubah.

---

# 5. Workflow Wajib

Setiap eksekusi yang mengubah kode harus mengikuti urutan:

```text
1. Identifikasi perubahan
2. Identifikasi area/behavior yang terkena
3. Cari test existing
4. Baca test yang relevan
5. Tentukan apakah test existing sudah cukup
6. Reuse test file jika cocok
7. Buat/perbarui test jika coverage behavior belum cukup
8. Jalankan test
9. Analisis hasil
10. Perbaiki source atau test sesuai penyebab sebenarnya
11. Jalankan ulang test
12. Laporkan hasil
```

Jangan langsung membuat file test sebelum memeriksa test existing.

---

# 6. Anti-Duplikat

Sebelum membuat test file baru, wajib memeriksa folder:

```text
test/
```

Minimal:

```bash
ls test/
```

Kemudian cari test yang berhubungan dengan area yang diubah.

Contoh:

```bash
grep -R "login" test/ 2>/dev/null
grep -R "guard_kosong" test/ 2>/dev/null
```

Gunakan tool pencarian native/IDE/CLI yang tersedia jika lebih sesuai.

## Keputusan

Jika ditemukan test file yang mewakili area yang sama:

```text
JANGAN membuat file baru.
Tambahkan atau perbarui test pada file existing.
```

Jika tidak ditemukan:

```text
Buat test/test_<slug>.<ext>
```

Prinsip:

```text
1 area = 1 test file
```

Jangan membuat:

```text
test_auth.py
test_auth_login.py
test_login.py
```

jika ketiganya menguji area authentication/login yang sama.

---

# 7. Nama Test File

Lokasi:

```text
test/
```

Flat.

Tidak menggunakan:

```text
test/2026/
test/auth/
test/login/
```

Nama:

```text
test_<slug>.<ext>
```

Contoh:

```text
test_auth_login.py
test_auth_login.test.js
test_auth_login_test.go
test_auth_login.rs
```

Slug:

```text
lowercase_snake_case
```

Aturan:

* lowercase
* spasi menjadi `_`
* karakter non-alfanumerik menjadi `_`
* hindari underscore berulang
* maksimum 50 karakter
* tidak menggunakan tanggal
* tidak menggunakan timestamp

Contoh:

```text
Auth Login       → auth_login
User Registration → user_registration
JWT Refresh      → jwt_refresh
```

---

# 8. Isi Test

Test harus menguji behavior yang bermakna.

Setiap test harus memiliki assertion atau mekanisme verifikasi yang
setara.

Dilarang:

```text
test yang hanya memanggil function
test tanpa assertion
test yang selalu PASS
test yang hanya memeriksa object tidak null tanpa alasan
test yang menduplikasi implementation
```

Test harus sebisa mungkin:

```text
input
  ↓
unit/function
  ↓
expected behavior
```

Contoh Python:

```python
import unittest

from auth.login import guard_kosong


class TestGuardKosong(unittest.TestCase):
    def test_tolak_password_kosong(self):
        self.assertFalse(guard_kosong(""))


if __name__ == "__main__":
    unittest.main()
```

Contoh JavaScript:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { guardKosong } from '../src/auth/login.js';

test('menolak password kosong', () => {
  assert.equal(guardKosong(''), false);
});
```

Gunakan framework testing native/stdlib jika sudah tersedia.

---

# 9. Dependency

Prioritas:

```text
standard library
    ↓
native testing framework bahasa
    ↓
existing project test framework
```

Jangan menambahkan dependency baru hanya untuk membuat unit test jika
standard library atau framework yang sudah digunakan project sudah cukup.

Dilarang menambahkan dependency testing hanya karena Testnan
membutuhkannya, kecuali user secara eksplisit meminta.

Contoh:

Python:

```text
unittest
```

JavaScript:

```text
node:test
node:assert
```

Go:

```text
testing
```

Rust:

```text
#[test]
cargo test
```

---

# 10. Runner

Gunakan test runner yang sudah digunakan project.

Prioritas:

```text
existing project runner
    ↓
native language runner
    ↓
manual runner hanya jika project memang menggunakannya
```

Jangan membuat runner baru hanya untuk Testnan.

## Python

Gunakan runner project jika tersedia.

Jika project menggunakan unittest:

```bash
python3 -m unittest
```

Jika project memiliki runner khusus:

```bash
python3 test/run.py
```

ikuti runner tersebut.

## JavaScript / TypeScript

Gunakan runner existing project.

Contoh native Node:

```bash
node --test
```

atau command yang sudah didefinisikan project:

```bash
npm test
```

Jangan mengganti runner project dengan `node --test` jika project
memang menggunakan framework lain.

## Go

```bash
go test ./...
```

## Rust

```bash
cargo test
```

## Bahasa lain

Gunakan native/project test runner yang sudah tersedia.

---

# 11. Test Satuan

Jika project runner mendukung menjalankan test tertentu, gunakan test
satuan ketika debugging agar lebih cepat.

Contoh:

```text
single file
single class
single test
```

Setelah test target PASS, jalankan test suite yang relevan.

Untuk perubahan yang berpotensi berdampak luas, jalankan seluruh suite.

Prinsip:

```text
targeted test
    ↓
relevant suite
    ↓
full suite jika diperlukan
```

---

# 12. Jangan Memanipulasi Test Agar PASS

Jika test gagal, jangan langsung mengubah assertion agar sesuai dengan
implementasi.

Cari penyebabnya.

Kemungkinan:

```text
source code salah
test salah
requirement berubah
environment/dependency bermasalah
existing behavior memang berubah
```

Jika requirement berubah, update test berdasarkan requirement baru.

Jika implementation salah, perbaiki implementation.

Jangan melakukan:

```text
expected = actual
```

hanya supaya test menjadi hijau.

---

# 13. Coverage Behavior

Test tidak harus mengejar angka coverage tertentu.

Yang lebih penting:

```text
behavior utama teruji
error behavior teruji
edge case penting teruji
regression bug teruji
```

Untuk perubahan kecil, test kecil sudah cukup.

Jangan membuat puluhan test hanya untuk perubahan satu behavior sederhana.

---

# 14. Test yang Sudah Ada

Jika test existing sudah mencakup behavior yang diubah:

```text
JANGAN membuat test duplikat.
```

Namun test harus tetap dijalankan.

Contoh:

```text
source berubah
    ↓
existing test sudah mencakup behavior
    ↓
tidak perlu membuat test baru
    ↓
jalankan existing test
```

Ini lebih baik daripada membuat test baru setiap kali source berubah.

---

# 15. Penghapusan Kode

Jika kode dihapus:

1. Cari test yang hanya menguji kode tersebut.
2. Hapus test jika sudah tidak relevan.
3. Pastikan test lain tetap PASS.
4. Jangan meninggalkan test mati/orphan.

Jika penghapusan kode tidak menghilangkan behavior publik,
pertahankan test yang masih relevan.

---

# 16. Perubahan API / Interface

Jika function/method/API berubah:

```text
1. Cari seluruh test yang menggunakan interface lama.
2. Update test sesuai interface baru.
3. Cari production code lain yang masih menggunakan interface lama.
4. Jalankan test terkait.
5. Jalankan full suite bila dampaknya luas.
```

Jangan membuat test baru jika test existing dapat diperbarui.

---

# 17. Database / External Service

Unit test sebaiknya tidak bergantung pada service eksternal jika
behavior dapat diuji tanpa service tersebut.

Hindari unit test yang membutuhkan:

```text
internet
API production
database production
real payment provider
real cloud service
```

Gunakan abstraction/mock/fake hanya jika project sudah menyediakan
mekanisme tersebut atau memang diperlukan.

Jangan menambahkan mocking framework baru hanya untuk Testnan jika
stdlib/native mechanism sudah cukup.

---

# 18. Output Setelah Test

Setelah perubahan selesai, laporan harus singkat dan jelas.

Format:

```text
Testnan

Area: auth/login
Action: updated existing test

Tests:
- test_auth_login.py
- 4 passed

Result: PASS
```

Jika tidak membuat test baru karena existing test sudah mencakup:

```text
Testnan

Area: auth/login
Action: reused existing tests

Tests:
- test_auth_login.py
- 4 passed

Result: PASS
```

Jika test gagal:

```text
Testnan

Area: auth/login

Result: FAIL
Failed:
- test_reject_empty_password

Reason:
- implementation returns true for empty password

Action:
- source code requires fix
```

Jangan menyatakan PASS jika runner mengembalikan exit code non-zero.

---

# 19. Definition of Done

Perubahan kode dianggap selesai jika:

```text
[ ] Area perubahan sudah diidentifikasi
[ ] Test existing sudah dicari
[ ] Tidak ada test file duplikat
[ ] Test relevan tersedia
[ ] Behavior baru memiliki validasi
[ ] Bug fix memiliki regression test jika memungkinkan
[ ] Tidak ada test kosong
[ ] Tidak ada assertion palsu
[ ] Tidak ada dependency testing yang tidak perlu
[ ] Test sudah dijalankan
[ ] Exit code sesuai hasil
[ ] Test gagal sudah dianalisis
[ ] Relevant/full suite dijalankan sesuai dampak perubahan
```

Jangan menyatakan pekerjaan selesai sebelum langkah testing selesai.

---

# 20. Prinsip Utama

Testnan mengikuti lima prinsip:

```text
1. Reuse before create
2. Behavior before coverage
3. Regression test for bugs
4. Never modify tests just to hide a bug
5. Every code change ends with verification
```

Testnan bukan alat untuk memperbanyak file test.

Tujuannya adalah menjaga agar perubahan kode tetap dapat diverifikasi
dengan cepat, jelas, dan konsisten.

