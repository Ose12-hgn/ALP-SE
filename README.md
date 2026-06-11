# ALP-SE

## Prerequisites
- Node.js
- Android Studio (with JDK 21 bundled)
- Capacitor CLI

## First Time Setup

1. Set JAVA_HOME to Android Studio's bundled JDK
   ```
   C:\Program Files\Android\Android Studio\jbr
   ```

2. Install dependencies
   ```bash
   cd UCEF
   npm install
   ```

3. Build the web app
   ```bash
   npm run build
   ```

4. Sync to Android
   ```bash
   cd ..
   npx cap sync android
   ```

5. Open in Android Studio
   ```bash
   npx cap open android
   ```

6. Run the app using the Run button or `Shift+F10`

## Development Workflow

Whenever you make changes to source code in `UCEF/src/`:

```bash
cd UCEF
npm run build
cd ..
npx cap sync android
```

Then re-run in Android Studio.

## Project Structure

- `UCEF/src/` — main source code (edit here)
- `www/` — built output (auto-generated, do not edit)
- `android/` — native Android wrapper (auto-generated, do not edit)
- `ios/` — native iOS wrapper (auto-generated, do not edit)
