#!/usr/bin/env python3
"""testnan runner: 1 script untuk semua atau satuan. Stdlib saja.

- Semua:  python3 test/run.py
- Satuan: python3 test/run.py <keyword>  (cocok nama file/class/method,
  contoh: python3 test/run.py auth_login)
"""
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent  # folder test/, absolut, anti salah cwd
PATTERN = "test_*.py"


def build_command(keyword=None):
    """Bangun perintah unittest discover. Pure, gampang ditest."""
    cmd = [
        sys.executable, "-m", "unittest",
        "discover", "-s", str(HERE), "-p", PATTERN, "-v",
    ]
    if keyword:
        cmd += ["-k", keyword]
    return cmd


def main(argv):
    if len(argv) > 1 and argv[1] in ("-h", "--help"):
        print("Usage: python3 test/run.py [keyword]")
        return 0
    keyword = argv[1] if len(argv) > 1 else None
    cmd = build_command(keyword)
    print("+ " + " ".join(cmd))
    proc = subprocess.run(cmd)
    return proc.returncode


if __name__ == "__main__":
    sys.exit(main(sys.argv))
