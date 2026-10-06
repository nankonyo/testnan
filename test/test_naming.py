"""Kontrak nama file test: flat, tanpa tanggal, agnostik bahasa."""
import os
import re
import unittest

TEST_DIR = os.path.dirname(os.path.abspath(__file__))

NAME_RE = re.compile(r"^test_[a-z0-9_]{1,50}(\.test)?\.(py|js|ts|mjs|cjs|jsx|tsx|go|rs|java|rb|php)$")
DATE_RE = re.compile(r"\d{4}-?\d{2}-?\d{2}|\d{6,8}")


class TestNaming(unittest.TestCase):
    def test_semua_file_cocok_pola(self):
        files = [
            f for f in os.listdir(TEST_DIR)
            if f.startswith("test_") and os.path.isfile(os.path.join(TEST_DIR, f))
        ]
        self.assertTrue(files, "test/ kosong, harus ada minimal 1 test_*")
        for f in files:
            self.assertRegex(f, NAME_RE, f"nama salah: {f}")

    def test_tanpa_tanggal_di_nama(self):
        for f in os.listdir(TEST_DIR):
            if not f.startswith("test_"):
                continue
            self.assertNotRegex(f, DATE_RE, f"tanggal di nama: {f}")

    def test_flat_tanpa_subfolder(self):
        for entry in os.listdir(TEST_DIR):
            full = os.path.join(TEST_DIR, entry)
            if entry == "__pycache__":
                continue
            self.assertFalse(os.path.isdir(full), f"subfolder dilarang: {entry}")


if __name__ == "__main__":
    unittest.main()
