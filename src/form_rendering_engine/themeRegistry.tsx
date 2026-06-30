import { DatePicker, RadioGroup, TextInput } from '@a-little-world/little-world-design-system';
import { RadioGroupVariations } from '@a-little-world/little-world-design-system-core';
import { createRef, type ReactElement, type RefObject } from 'react';
import styled from 'styled-components';

export type FormFieldKind =
  | 'label'
  | 'text'
  | 'date'
  | 'radio'
  | 'checkbox_group'
  | 'checkbox'
  | 'select'
  | 'textarea'
  | 'number'
  | 'tel'
  | 'email';

export type FormFieldValue = string | boolean | string[];

export type FormFieldOption = {
  value: string;
  label?: string | Record<string, string>;
};

export type ThemeFieldRendererProps = {
  fieldUuid: string;
  fieldType: string;
  label: string;
  prompt: string;
  language: string;
  required: boolean;
  value: FormFieldValue;
  options: FormFieldOption[];
  onChange: (nextValue: FormFieldValue) => void;
  disabled?: boolean;
  preview?: boolean;
};

export type ThemeFieldRenderer = (props: ThemeFieldRendererProps) => ReactElement;

export type FormThemeDefinition = {
  id: string;
  fieldRenderers: Partial<Record<FormFieldKind, ThemeFieldRenderer>>;
};

const CheckList = styled.div`
  display: grid;
  gap: 0.35rem;
  margin-top: 0.35rem;
`;

const CheckItem = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
`;

const EsfFieldShell = styled.div`
  padding: 10px 12px;
  border: 1px solid #f2d5c0;
  border-radius: 10px;
  background: #fffaf6;
`;

const EsfFieldLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #8b4a25;
  margin-bottom: 6px;
  text-transform: uppercase;
`;

const InfoHintCard = styled.div`
  margin-bottom: 4px;
  border-left: 3.75px solid #d85509;
  background: #fff5f0;
  border-radius: 0 12px 12px 0;
  padding: 16px 18px;
`;

const InfoHintRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const InfoHintIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid #d85509;
  color: #d85509;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
`;

const InfoHintTitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #1b1c1c;
`;

const InfoHintText = styled.div`
  margin-top: 4px;
  font-size: 14px;
  line-height: 22px;
  color: #594138;
`;

const PreviewFieldShell = styled.div`
  border: 0.625px solid #e8e8e8;
  border-radius: 10px;
  background: #ffffff;
  padding: 12px 14px;
`;

const PreviewFieldLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.35px;
  text-transform: uppercase;
  color: #6b6b6b;
`;

const PreviewFieldValue = styled.div`
  margin-top: 6px;
  font-size: 15px;
  line-height: 22px;
  color: #1b1c1c;
`;

const formatPreviewValue = (value: FormFieldValue): string => {
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : '-';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  const normalized = String(value ?? '').trim();
  return normalized || '-';
};

const renderPreviewField = (label: string, value: FormFieldValue): ReactElement => (
  <PreviewFieldShell>
    <PreviewFieldLabel>{label}</PreviewFieldLabel>
    <PreviewFieldValue>{formatPreviewValue(value)}</PreviewFieldValue>
  </PreviewFieldShell>
);

const normalizeFieldKind = (fieldType: string): FormFieldKind => {
  const normalized = fieldType.toLowerCase();
  if (normalized === 'dropdown') {
    return 'select';
  }
  if (normalized === 'boolean') {
    return 'checkbox';
  }
  if (normalized === 'numeric') {
    return 'number';
  }
  if (normalized === 'phone') {
    return 'tel';
  }
  if (
    normalized === 'label'
    || normalized === 'hint'
    || normalized === 'info'
    || normalized === 'notice'
  ) {
    return 'label';
  }
  if (
    normalized === 'text'
    || normalized === 'date'
    || normalized === 'radio'
    || normalized === 'checkbox_group'
    || normalized === 'checkbox'
    || normalized === 'select'
    || normalized === 'textarea'
    || normalized === 'number'
    || normalized === 'tel'
    || normalized === 'email'
  ) {
    return normalized;
  }
  return 'text';
};

const parseDateForPicker = (value: FormFieldValue): Date | undefined => {
  const raw = typeof value === 'string' ? value : '';
  if (!raw) {
    return undefined;
  }
  const parsed = new Date(`${raw}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const resolveOptionLabel = (option: FormFieldOption, language: string): string => {
  if (!option.label) {
    return option.value;
  }
  if (typeof option.label === 'string') {
    return option.label;
  }
  return option.label[language] ?? option.label.de ?? option.label.en ?? option.value;
};

const DEFAULT_FIELD_RENDERERS: Record<FormFieldKind, ThemeFieldRenderer> = {
  label: ({ label, prompt }) => {
    const body = prompt && prompt !== label ? prompt : '';
    return (
      <InfoHintCard>
        <InfoHintRow>
          <InfoHintIcon>i</InfoHintIcon>
          <div>
            <InfoHintTitle>{label}</InfoHintTitle>
            {body ? <InfoHintText>{body}</InfoHintText> : null}
          </div>
        </InfoHintRow>
      </InfoHintCard>
    );
  },
  text: ({ fieldUuid, label, value, onChange, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <TextInput
        id={fieldUuid}
        label={label}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    );
  },
  date: ({ fieldUuid, label, value, onChange, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <DatePicker
        id={fieldUuid}
        label={label}
        value={parseDateForPicker(value)}
        onChange={(nextDate) => onChange(nextDate ? nextDate.toISOString().slice(0, 10) : '')}
        disabled={disabled}
      />
    );
  },
  radio: ({ fieldUuid, label, value, options, onChange, language, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <RadioGroup
        label={label}
        type={RadioGroupVariations.Pill}
        value={typeof value === 'string' ? value : ''}
        onValueChange={(nextValue) => onChange(nextValue)}
        items={options.map((option) => ({
          id: `${fieldUuid}-${option.value}`,
          value: option.value,
          label: resolveOptionLabel(option, language),
        }))}
        inputRef={createRef<HTMLInputElement>() as RefObject<HTMLInputElement>}
        disabled={disabled}
      />
    );
  },
  checkbox_group: ({ label, value, options, onChange, language, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <CheckList>
          {options.map((option) => (
            <CheckItem key={option.value}>
              <input
                type="checkbox"
                disabled={disabled}
                checked={selectedValues.includes(option.value)}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...selectedValues, option.value]
                    : selectedValues.filter((entry) => entry !== option.value);
                  onChange(next);
                }}
              />
              <span>{resolveOptionLabel(option, language)}</span>
            </CheckItem>
          ))}
        </CheckList>
      </div>
    );
  },
  checkbox: ({ label, value, onChange, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <CheckItem>
        <input
          type="checkbox"
          disabled={disabled}
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{label}</span>
      </CheckItem>
    );
  },
  select: ({ label, value, options, onChange, language, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <select
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          style={{ marginTop: 8, width: '100%', minHeight: 34 }}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {resolveOptionLabel(option, language)}
            </option>
          ))}
        </select>
      </div>
    );
  },
  textarea: ({ label, value, onChange, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <textarea
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          style={{ marginTop: 8, width: '100%', resize: 'vertical' }}
        />
      </div>
    );
  },
  number: ({ label, value, onChange, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <input
          type="number"
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          style={{ marginTop: 8, width: '100%', minHeight: 34 }}
        />
      </div>
    );
  },
  tel: ({ label, value, onChange, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <input
          type="tel"
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          style={{ marginTop: 8, width: '100%', minHeight: 34 }}
        />
      </div>
    );
  },
  email: ({ label, value, onChange, disabled, preview }) => {
    if (preview) {
      return renderPreviewField(label, value);
    }
    return (
      <div>
        <div style={{ fontWeight: 600 }}>{label}</div>
        <input
          type="email"
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          style={{ marginTop: 8, width: '100%', minHeight: 34 }}
        />
      </div>
    );
  },
};

const esfWrap = (renderer: ThemeFieldRenderer): ThemeFieldRenderer => (props) => (
  <EsfFieldShell>
    <EsfFieldLabel>{props.label}</EsfFieldLabel>
    {renderer({ ...props, label: props.prompt })}
  </EsfFieldShell>
);

const DEFAULT_THEME: FormThemeDefinition = {
  id: 'default',
  fieldRenderers: DEFAULT_FIELD_RENDERERS,
};

const ESF_THEME: FormThemeDefinition = {
  id: 'esf',
  fieldRenderers: {
    label: DEFAULT_FIELD_RENDERERS.label,
    text: esfWrap(DEFAULT_FIELD_RENDERERS.text),
    date: esfWrap(DEFAULT_FIELD_RENDERERS.date),
    radio: esfWrap(DEFAULT_FIELD_RENDERERS.radio),
    checkbox_group: esfWrap(DEFAULT_FIELD_RENDERERS.checkbox_group),
    checkbox: esfWrap(DEFAULT_FIELD_RENDERERS.checkbox),
    select: esfWrap(DEFAULT_FIELD_RENDERERS.select),
    textarea: esfWrap(DEFAULT_FIELD_RENDERERS.textarea),
    number: esfWrap(DEFAULT_FIELD_RENDERERS.number),
    tel: esfWrap(DEFAULT_FIELD_RENDERERS.tel),
    email: esfWrap(DEFAULT_FIELD_RENDERERS.email),
  },
};

const themeRegistry = new Map<string, FormThemeDefinition>([
  [DEFAULT_THEME.id, DEFAULT_THEME],
  [ESF_THEME.id, ESF_THEME],
]);

export const createFormTheme = (theme: FormThemeDefinition): FormThemeDefinition => theme;

export const registerFormTheme = (theme: FormThemeDefinition): void => {
  themeRegistry.set(theme.id, {
    id: theme.id,
    fieldRenderers: {
      ...DEFAULT_THEME.fieldRenderers,
      ...theme.fieldRenderers,
    },
  });
};

export const getResolvedThemeId = (theme?: string | null): string => {
  if (!theme) {
    return 'default';
  }
  return themeRegistry.has(theme) ? theme : 'default';
};

export const getRegisteredThemeIds = (): string[] => Array.from(themeRegistry.keys());

export const renderFieldForTheme = (themeId: string, props: ThemeFieldRendererProps): ReactElement => {
  const resolvedThemeId = getResolvedThemeId(themeId);
  const theme = themeRegistry.get(resolvedThemeId) ?? DEFAULT_THEME;
  const kind = normalizeFieldKind(props.fieldType);
  const renderer =
    theme.fieldRenderers[kind]
    ?? DEFAULT_THEME.fieldRenderers[kind]
    ?? DEFAULT_FIELD_RENDERERS.text;
  return renderer(props);
};
