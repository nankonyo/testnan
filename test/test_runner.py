"""Kontrak runner: 1 script untuk semua atau satuan."""
import os
import subprocess
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from run import build_command  # noqa: E402

RUN_PY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "run.py")


class TestRunner(unittest.TestCase):
    def test_tanpa_keyword_jalan_semua(self):
        cmd = build_command()
        self.assertIn("discover", cmd)
        self.assertNotIn("-k", cmd)

    def test_dengan_keyword_filter_satuan(self):
        cmd = build_command("naming")
        self.assertIn("-k", cmd)
        self.assertIn("naming", cmd)

    def test_runner_asli_lolos(self):
        # ponytail: keyword harus TIDAK cocok test ini sendiri,
        # kalau tidak subprocess panggil diri sendiri tanpa henti (fork bomb).
        proc = subprocess.run(
            [sys.executable, RUN_PY, "tanpa_tanggal_di_nama"],
            capture_output=True, text=True, timeout=120,
        )
        self.assertEqual(proc.returncode, 0, proc.stdout + proc.stderr)


if __name__ == "__main__":
    unittest.main()
