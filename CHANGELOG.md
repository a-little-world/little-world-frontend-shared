# @a-little-world/little-world-frontend-shared

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
