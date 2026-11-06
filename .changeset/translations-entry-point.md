---
'@a-little-world/little-world-frontend-shared': patch
---

Add a dependency-free `@a-little-world/little-world-frontend-shared/translations` entry point.

The root entry also loads the form rendering engine, which imports the web design system and
`styled-components` at module load and crashes React Native apps. Apps that only need the
translations (e.g. the native app) should import them from the new subpath instead.

All peer dependencies are now optional, so translation-only consumers no longer get the web
design system installed.
