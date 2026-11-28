# Android preview validation — 28 November 2026

Baseline: GitHub main `67c6bc8420a9eb5517ffca31c516123347931766`.
Catalogue: **14 unique Indian recipes**, **9,986 below** the goal of 10,000. No recipes were added in this Android conversion.

## Completed checks

- `npm test`: 10 passed. Includes catalogue and photos, all Hinglish step counts and numeric quantities/timings, fallback languages, beginner-step boundaries, preserved ingredient checks, six-serving ingredient/method agreement, restoring two servings, saved favourites, personal recipe retrieval and language preference across document reloads at the Android app origin.
- `testDebugUnitTest`: 3 passed, 0 failures/errors. Local route allowlist, external HTTPS handling and rejected schemes/origins.
- `lintDebug`: 0 errors, 3 warnings (API-specific manifest attributes ignored on older Android, and JavaScript enabled for the bundled recipe UI). Remote content is blocked in the WebView and no native JavaScript bridge is exposed.
- `assembleDebug`: APK produced for Android 8.0+ (`minSdk 26`, `targetSdk 35`).
- `python android/check-apk.py`: all 43 web files in the APK match `dist/` byte-for-byte, including photos and language packs.
- `apksigner verify --verbose`: signature verifies using APK Signature Scheme v2.
- APK size: 3,430,112 bytes. SHA-256: `59ec053ef6246a6483b8d9751ccbe480508b943c80d0fc696895e81c2803c1c0`.

## Limits

The web integration tests use jsdom, not an Android WebView. No Android device or emulator was connected (`adb devices` empty; no KVM available). Installation, real-device rendering, TalkBack, system photo selection, orientation handling and airplane-mode behavior remain unverified. Bundling and no-network permissions do not by themselves prove all offline workflows work on a phone.

This is a debug-signed preview, not a production-signed or Play Store release. It uses separate app-local storage and does not sync/import browser personal data. See README for device acceptance checks and signing limitations.
