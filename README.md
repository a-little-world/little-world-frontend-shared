# Little World Frontend Shared Library

Shared library of components, translations and utilities for Little World's frontend applications.
It is published publicly to npm as [`@a-little-world/little-world-frontend-shared`](https://www.npmjs.com/package/@a-little-world/little-world-frontend-shared).

## Installation

```bash
npm install @a-little-world/little-world-frontend-shared
# or
pnpm add @a-little-world/little-world-frontend-shared
```

The package has the following peer dependencies, which the host app must provide:

- `react` / `react-dom` `>=19`
- `styled-components` `^6.1.18`
- `@a-little-world/little-world-design-system` `^3.1.2`
- `@a-little-world/little-world-design-system-core` `^1.17.1`

## What This Library Contains

- **Dynamic form rendering engine** – render, validate and localise forms from a JSON description.
- **Constants** – shared configuration and field/code mappings.
- **Translations** – internationalisation (i18n) resources.

> This library is **not** the design system. The design system (buttons, inputs, design tokens)
> lives in `@a-little-world/little-world-design-system`; this package composes those primitives
> into functional, business-specific features.

## Dynamic Form Rendering Engine

`LittleWorldDynamicFormRenderer` renders a form described by a JSON document. It uses the Little
World design system components directly for every field type (`TextInput`, `DatePicker`,
`RadioGroup`, `Select`, `TextArea`, `Checkbox`, `CheckboxGroup`), validates values client-side and
resolves translated labels, prompts, validation messages and option labels.

```tsx
import {
  LittleWorldDynamicFormRenderer,
  type LittleWorldFormJson,
} from '@a-little-world/little-world-frontend-shared';
import { useState } from 'react';

const documentJson: LittleWorldFormJson = {
  document: { id: 'demo', name: 'Demo', default_language: 'en', languages: ['en', 'de'] },
  sections: [
    {
      uuid: 'section-1',
      id: 'personal',
      title: 'Personal details',
      fields: [
        { uuid: 'field-1', id: 'first_name', name: 'first_name', label: 'First name', type: 'text', required: true },
      ],
    },
  ],
};

export const Example = () => {
  const [values, setValues] = useState({});

  return (
    <LittleWorldDynamicFormRenderer
      documentJson={documentJson}
      language="en"
      fieldValues={values}
      onChangeFieldValue={(fieldUuid, nextValue) =>
        setValues((current) => ({ ...current, [fieldUuid]: nextValue }))
      }
    />
  );
};
```

Additional capabilities:

- **Validation lifecycle hooks** – `onValidationStateChange`, `onFormFieldValidate`,
  `onFormFieldValidationPassed`, `onFormFieldSectionValidationComplete`.
- **Themes** – the built-in `default`, `esf` and `esf_ux_audit_example` themes can be replaced or
  extended with `registerFormTheme` / `createFormTheme`.
- **Render hooks** – `renderFieldOverlay`, `renderFieldEditActions`, `renderFieldInsertionSlot`,
  `renderSectionFields` for embedding custom UI.
- **Imperative handle** – `getFormFieldValue`, `getCurrentFormValues`, `setFormFieldValue`,
  `revalidateCurrentForm` via `ref`.

See `src/form_rendering_engine/` for the full type surface.

## Development

```bash
npm install        # install dependencies
npm run typecheck  # tsc --noEmit
npm run build      # tsup -> dist/ (cjs + esm + d.ts)
```

## Releasing

The package is released with [Changesets](https://github.com/changesets/changesets):

1. Add a changeset describing your change:
   ```bash
   npm run changeset
   ```
2. Merge to `main`. The `Release` workflow opens a "version packages" pull request
   (or publishes directly if one is already pending).
3. Merge the version pull request to publish to npm.

Publishing requires an `NPM_TOKEN` repository secret with publish rights for the
`@a-little-world` scope. The workflow publishes with `--access public`.