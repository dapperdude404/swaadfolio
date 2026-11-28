"""Verify the built APK contains the exact web snapshot, including recipe photos."""
from pathlib import Path
import hashlib
import zipfile
root = Path(__file__).resolve().parent.parent
apk = root / 'android/app/build/outputs/apk/debug/app-debug.apk'
with zipfile.ZipFile(apk) as archive:
    files = sorted(p for p in (root / 'dist').rglob('*') if p.is_file())
    for path in files:
        bundled = archive.read('assets/www/' + path.relative_to(root / 'dist').as_posix())
        assert bundled == path.read_bytes(), str(path)
    for required in ['AndroidManifest.xml', 'classes.dex']:
        assert required in archive.namelist(), required
print(f'PASS: {len(files)} web files match the APK byte-for-byte.')
print('APK SHA-256:', hashlib.sha256(apk.read_bytes()).hexdigest())
