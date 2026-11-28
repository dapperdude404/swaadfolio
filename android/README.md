# Swaadfolio Android preview

Package: `com.dapperdude404.swaadfolio`. Android 8.0+ with an up-to-date Android System WebView. This is a bundled WebView app, not a native rewrite or Play Store release.

The Gradle build copies `../dist` into generated APK assets. Recipes, photos, ingredient aliases, search, favourites, personal recipes, Beginner cooking mode, Besan Chilla portions and language packs therefore use the same implementation as the website. No duplicate catalogue is maintained. All 14 current methods and kitchen notes have Hinglish versions. Spanish/French remain basic interface packs with English recipe text.

The APK uses AndroidX WebViewAssetLoader at a fixed HTTPS app origin, DOM storage, Android Back navigation, system-bar insets and the system image picker. There is no JavaScript/native bridge. It requests no network, camera or broad storage permission. External HTTPS credits open in the device browser. Photos are restricted to JPG, PNG and WebP; the web app validates size and decodes them before storing.

## Build

Install JDK 17+, Android SDK platform 35 and build-tools 35.0.0. Set `ANDROID_HOME`, then:

```sh
npm ci --ignore-scripts
npm test
cd android
./gradlew assembleDebug testDebugUnitTest lintDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`. The debug APK is signed with the build machine's debug key and is intended for testing. Future APKs signed with a different key cannot update it in place. Do not uninstall or clear app data without preserving any personal recipes you need. Production signing and Play Store publication are not configured.

## Storage and updates

Personal recipes, photos, bookmarks and language choice live in app-local WebView storage. They do not import from the website or sync between devices. Uninstalling or clearing app data can erase them; Android backup is disabled. Cooking steps and ingredient checks are session state, preserved across orientation changes but not process death. Restoring after process death opens the last recipe route.

Catalogue updates require rebuilding and installing a compatible signed APK. The bundle is designed to load without a network, but device-level offline operation and the image-picker flow must be tested before claiming full offline support.

## Acceptance checks on a device

- Launch, search `pyaaz`, filter courses and open every recipe; verify photos render.
- Choose Hinglish, restart, and verify language persistence. Check French/Spanish coverage notices.
- Start Besan Chilla, choose 1–6 portions, and verify water in ingredients and method agrees; navigate to both end steps and back.
- Check ingredients, rotate the phone, and ensure the cooking step and checks remain.
- Save a favourite and create/edit/delete a personal recipe; choose a small JPEG/PNG/WebP, cancel the picker, and reject oversized or invalid files.
- Relaunch and check saved data; test Android Back, keyboard insets and TalkBack.
- In airplane mode, repeat recipe browsing and check photos. Network-isolated Android runtime verification has not yet been performed.

Implementation reference: https://developer.android.com/develop/ui/views/layout/webapps/load-local-content
