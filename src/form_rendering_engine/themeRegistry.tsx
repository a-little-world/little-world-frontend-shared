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
  editMode?: boolean;
  onFormEditDeleteField?: (fieldUuid: string) => void;
  onFormEditUpdateField?: (fieldUuid: string) => void;
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

const EsfFieldLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.35px;
  color: #6b6b6b;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const EsfFieldShell = styled.div`
  display: grid;
  gap: 8px;
`;

const EsfTextInput = styled.input`
  width: 100%;
  height: 49px;
  border: 0.625px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.3;
  color: #1b1c1c;
  background: #ffffff;

  &:focus {
    outline: 2px solid #ffd5be;
    border-color: #d85509;
  }

  &:disabled {
    background: #f6f6f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const EsfSelect = styled.select`
  width: 100%;
  height: 49px;
  border: 0.625px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.3;
  color: #1b1c1c;
  background: #ffffff;

  &:focus {
    outline: 2px solid #ffd5be;
    border-color: #d85509;
  }

  &:disabled {
    background: #f6f6f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const EsfTextarea = styled.textarea`
  width: 100%;
  min-height: 96px;
  border: 0.625px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.35;
  color: #1b1c1c;
  background: #ffffff;
  resize: vertical;

  &:focus {
    outline: 2px solid #ffd5be;
    border-color: #d85509;
  }

  &:disabled {
    background: #f6f6f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const EsfOptionGrid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 960px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const EsfOptionCard = styled.button<{ $active: boolean }>`
  border: 1.875px solid ${({ $active }) => ($active ? '#d85509' : '#e0e0e0')};
  background: ${({ $active }) => ($active ? '#d85509' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#0f172a')};
  border-radius: 4px;
  min-height: 56px;
  padding: 12px 14px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const EsfCheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #1b1c1c;
`;

const UxAuditFieldLabel = styled(EsfFieldLabel)`
  color: #4e4b47;
  letter-spacing: 0.25px;
`;

const UxAuditFieldShell = styled(EsfFieldShell)`
  gap: 9px;
`;

const UxAuditTextInput = styled(EsfTextInput)`
  border-color: #d7c9ba;
  border-radius: 10px;
  background: #fffdfb;

  &:focus {
    outline: 2px solid #ffdcc2;
    border-color: #d85509;
  }
`;

const UxAuditSelect = styled(EsfSelect)`
  border-color: #d7c9ba;
  border-radius: 10px;
  background: #fffdfb;
`;

const UxAuditTextarea = styled(EsfTextarea)`
  border-color: #d7c9ba;
  border-radius: 10px;
  background: #fffdfb;
`;

const UxAuditOptionCard = styled(EsfOptionCard)<{ $active: boolean }>`
  border-radius: 12px;
  border-width: 1.25px;
  border-color: ${({ $active }) => ($active ? '#d85509' : '#ddcfc3')};
  background: ${({ $active }) => ($active ? '#d85509' : '#fffdfa')};
`;

const UxAuditCheckboxRow = styled(EsfCheckboxRow)`
  padding: 2px 0;
  color: #242423;
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

const EditModeFieldShell = styled.div`
  display: grid;
  gap: 6px;
`;

const EditModeActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EditModeDeleteButton = styled.button`
  border: 1px solid #efc6c6;
  background: #fff3f3;
  color: #8d1f1f;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
`;

const EditModeUpdateButton = styled.button`
  border: 1px solid #d9d6f8;
  background: #f5f4ff;
  color: #4531a5;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
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

const renderEsfField = (props: ThemeFieldRendererProps, child: ReactElement): ReactElement => {
  if (props.preview) {
    return child;
  }
  return (
    <EsfFieldShell>
      <EsfFieldLabel>{props.label}</EsfFieldLabel>
      {child}
    </EsfFieldShell>
  );
};

const renderUxAuditField = (props: ThemeFieldRendererProps, child: ReactElement): ReactElement => {
  if (props.preview) {
    return child;
  }
  return (
    <UxAuditFieldShell>
      <UxAuditFieldLabel>{props.label}</UxAuditFieldLabel>
      {child}
    </UxAuditFieldShell>
  );
};

const ESF_FIELD_RENDERERS: Partial<Record<FormFieldKind, ThemeFieldRenderer>> = {
  label: DEFAULT_FIELD_RENDERERS.label,
  text: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfTextInput
        id={props.fieldUuid}
        type="text"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  date: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfTextInput
        id={props.fieldUuid}
        type="date"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  number: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfTextInput
        id={props.fieldUuid}
        type="number"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  tel: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfTextInput
        id={props.fieldUuid}
        type="tel"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  email: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfTextInput
        id={props.fieldUuid}
        type="email"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  textarea: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfTextarea
        id={props.fieldUuid}
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  select: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfSelect
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      >
        <option value="">Select...</option>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {resolveOptionLabel(option, props.language)}
          </option>
        ))}
      </EsfSelect>,
    );
  },
  radio: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfOptionGrid>
        {props.options.map((option) => {
          const optionValue = option.value;
          const selected = String(props.value ?? '') === optionValue;
          return (
            <EsfOptionCard
              key={`${props.fieldUuid}-${optionValue}`}
              type="button"
              $active={selected}
              disabled={props.disabled}
              onClick={() => props.onChange(optionValue)}
            >
              {resolveOptionLabel(option, props.language)}
            </EsfOptionCard>
          );
        })}
      </EsfOptionGrid>,
    );
  },
  checkbox_group: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    const selectedValues = Array.isArray(props.value) ? props.value : [];
    return renderEsfField(
      props,
      <CheckList>
        {props.options.map((option) => (
          <EsfCheckboxRow key={option.value}>
            <input
              type="checkbox"
              disabled={props.disabled}
              checked={selectedValues.includes(option.value)}
              onChange={(event) => {
                const next = event.target.checked
                  ? [...selectedValues, option.value]
                  : selectedValues.filter((entry) => entry !== option.value);
                props.onChange(next);
              }}
            />
            <span>{resolveOptionLabel(option, props.language)}</span>
          </EsfCheckboxRow>
        ))}
      </CheckList>,
    );
  },
  checkbox: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderEsfField(
      props,
      <EsfCheckboxRow>
        <input
          type="checkbox"
          disabled={props.disabled}
          checked={Boolean(props.value)}
          onChange={(event) => props.onChange(event.target.checked)}
        />
        <span>{props.prompt}</span>
      </EsfCheckboxRow>,
    );
  },
};

const ESF_UX_AUDIT_EXAMPLE_FIELD_RENDERERS: Partial<Record<FormFieldKind, ThemeFieldRenderer>> = {
  ...ESF_FIELD_RENDERERS,
  text: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <UxAuditTextInput
        id={props.fieldUuid}
        type="text"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  date: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <UxAuditTextInput
        id={props.fieldUuid}
        type="date"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  number: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <UxAuditTextInput
        id={props.fieldUuid}
        type="number"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  tel: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <UxAuditTextInput
        id={props.fieldUuid}
        type="tel"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  email: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <UxAuditTextInput
        id={props.fieldUuid}
        type="email"
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  textarea: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <UxAuditTextarea
        id={props.fieldUuid}
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      />,
    );
  },
  select: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <UxAuditSelect
        disabled={props.disabled}
        value={typeof props.value === 'string' ? props.value : ''}
        onChange={(event) => props.onChange(event.target.value)}
      >
        <option value="">Select...</option>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {resolveOptionLabel(option, props.language)}
          </option>
        ))}
      </UxAuditSelect>,
    );
  },
  radio: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <EsfOptionGrid>
        {props.options.map((option) => {
          const optionValue = option.value;
          const selected = String(props.value ?? '') === optionValue;
          return (
            <UxAuditOptionCard
              key={`${props.fieldUuid}-${optionValue}`}
              type="button"
              $active={selected}
              disabled={props.disabled}
              onClick={() => props.onChange(optionValue)}
            >
              {resolveOptionLabel(option, props.language)}
            </UxAuditOptionCard>
          );
        })}
      </EsfOptionGrid>,
    );
  },
  checkbox_group: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    const selectedValues = Array.isArray(props.value) ? props.value : [];
    return renderUxAuditField(
      props,
      <CheckList>
        {props.options.map((option) => (
          <UxAuditCheckboxRow key={option.value}>
            <input
              type="checkbox"
              disabled={props.disabled}
              checked={selectedValues.includes(option.value)}
              onChange={(event) => {
                const next = event.target.checked
                  ? [...selectedValues, option.value]
                  : selectedValues.filter((entry) => entry !== option.value);
                props.onChange(next);
              }}
            />
            <span>{resolveOptionLabel(option, props.language)}</span>
          </UxAuditCheckboxRow>
        ))}
      </CheckList>,
    );
  },
  checkbox: (props) => {
    if (props.preview) {
      return renderPreviewField(props.label, props.value);
    }
    return renderUxAuditField(
      props,
      <UxAuditCheckboxRow>
        <input
          type="checkbox"
          disabled={props.disabled}
          checked={Boolean(props.value)}
          onChange={(event) => props.onChange(event.target.checked)}
        />
        <span>{props.prompt}</span>
      </UxAuditCheckboxRow>,
    );
  },
};

const DEFAULT_THEME: FormThemeDefinition = {
  id: 'default',
  fieldRenderers: DEFAULT_FIELD_RENDERERS,
};

const ESF_THEME: FormThemeDefinition = {
  id: 'esf',
  fieldRenderers: {
    ...ESF_FIELD_RENDERERS,
  },
};

const ESF_UX_AUDIT_EXAMPLE_THEME: FormThemeDefinition = {
  id: 'esf_ux_audit_example',
  fieldRenderers: {
    ...ESF_UX_AUDIT_EXAMPLE_FIELD_RENDERERS,
  },
};

const themeRegistry = new Map<string, FormThemeDefinition>([
  [DEFAULT_THEME.id, DEFAULT_THEME],
  [ESF_THEME.id, ESF_THEME],
  [ESF_UX_AUDIT_EXAMPLE_THEME.id, ESF_UX_AUDIT_EXAMPLE_THEME],
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
  const renderedField = renderer(props);
  if (!props.editMode || props.preview) {
    return renderedField;
  }
  return (
    <EditModeFieldShell>
      <EditModeActionRow>
        {props.onFormEditUpdateField ? (
          <EditModeUpdateButton
            type="button"
            onClick={() => props.onFormEditUpdateField?.(props.fieldUuid)}
            title="Update field"
          >
            update
          </EditModeUpdateButton>
        ) : null}
        <EditModeDeleteButton
          type="button"
          onClick={() => props.onFormEditDeleteField?.(props.fieldUuid)}
          title="Delete field"
        >
          delete
        </EditModeDeleteButton>
      </EditModeActionRow>
      {renderedField}
    </EditModeFieldShell>
  );
};
