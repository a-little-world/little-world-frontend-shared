# @a-little-world/little-world-frontend-shared

## 0.2.1

### Patch Changes

- 7602cc8: Add a dependency-free `@a-little-world/little-world-frontend-shared/translations` entry point.

  The root entry also loads the form rendering engine, which imports the web design system and
  `styled-components` at module load and crashes React Native apps. Apps that only need the
  translations (e.g. the native app) should import them from the new subpath instead.

  All peer dependencies are now optional, so translation-only consumers no longer get the web
  design system installed.

## 0.2.0

### Minor Changes

- 0b6a774: Add the `LittleWorldDynamicFormRenderer` JSON-driven form rendering engine.

  - Renders, validates and localises forms from a JSON document description.
  - Uses Little World design system components directly for every control
    (`TextInput`, `DatePicker`, `RadioGroup`, `Select`, `TextArea`, `Checkbox`,
    `CheckboxGroup`, `FieldHint`, `InputError`).
  - Extensible through pluggable themes (`registerFormTheme`) and render hooks.
  - Package is now published publicly to npm via the changesets release workflow.

## 0.2.0

### Minor Changes

- Initial setup of shared frontend library
