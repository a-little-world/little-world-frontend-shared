import {
  Checkbox,
  CheckboxGroup,
  DatePicker,
  FieldHint,
  InfoIcon,
  RadioGroup,
  Select,
  TextArea,
  TextInput,
} from '@a-little-world/little-world-design-system';
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

const UxAuditFieldLabel = styled(EsfFieldLabel)`
  color: #4e4b47;
  letter-spacing: 0.25px;
`;

const UxAuditFieldShell = styled(EsfFieldShell)`
  gap: 9px;
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

const InfoHintTitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #1b1c1c;
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

const toDataSelectOptions = (options: FormFieldOption[], language: string) =>
  options.map((option) => ({
    value: option.value,
    label: resolveOptionLabel(option, language),
  }));

const InfoHint: ThemeFieldRenderer = ({ label, prompt }) => {
  const body = prompt && prompt !== label ? prompt : '';
  return (
    <InfoHintCard>
      <InfoHintRow>
        <InfoIcon label="hint" width={20} height={20} color="#d85509" />
        <div>
          <InfoHintTitle>{label}</InfoHintTitle>
          {body ? <FieldHint text={body} /> : null}
        </div>
      </InfoHintRow>
    </InfoHintCard>
  );
};

const LabeledTextInput = ({
  id,
  label,
  type,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label?: string;
  type: 'text' | 'number' | 'tel' | 'email';
  value: string;
  onChange: (nextValue: string) => void;
  disabled?: boolean;
}) => {
  const sharedProps = {
    id,
    type,
    value,
    disabled,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
  };
  if (label === undefined) {
    return <TextInput {...sharedProps} />;
  }
  return <TextInput {...sharedProps} label={label} />;
};

const LabeledDatePicker = ({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label?: string;
  value: FormFieldValue;
  onChange: (nextValue: string) => void;
  disabled?: boolean;
}) => {
  const sharedProps = {
    id,
    value: parseDateForPicker(value),
    disabled,
    onChange: (nextDate: Date | undefined) =>
      onChange(nextDate ? nextDate.toISOString().slice(0, 10) : ''),
  };
  if (label === undefined) {
    return <DatePicker {...sharedProps} />;
  }
  return <DatePicker {...sharedProps} label={label} />;
};

const LabeledTextArea = ({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (nextValue: string) => void;
  disabled?: boolean;
}) => {
  const sharedProps = {
    id,
    value,
    disabled,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value),
  };
  if (label === undefined) {
    return <TextArea {...sharedProps} />;
  }
  return <TextArea {...sharedProps} label={label} />;
};

type RenderDsControlOptions = {
  withLabel: boolean;
};

const renderDsControl = (
  props: ThemeFieldRendererProps,
  { withLabel }: RenderDsControlOptions,
): ReactElement => {
  if (props.preview) {
    return renderPreviewField(props.label, props.value);
  }

  const kind = normalizeFieldKind(props.fieldType);
  const label = withLabel ? props.label : undefined;
  const stringValue = typeof props.value === 'string' ? props.value : '';

  switch (kind) {
    case 'text':
    case 'number':
    case 'tel':
    case 'email': {
      const type = kind === 'number' ? 'number' : kind === 'tel' ? 'tel' : kind === 'email' ? 'email' : 'text';
      return (
        <LabeledTextInput
          id={props.fieldUuid}
          label={label}
          type={type}
          value={stringValue}
          onChange={(nextValue) => props.onChange(nextValue)}
          disabled={props.disabled}
        />
      );
    }
    case 'date':
      return (
        <LabeledDatePicker
          id={props.fieldUuid}
          label={label}
          value={props.value}
          onChange={(nextValue) => props.onChange(nextValue)}
          disabled={props.disabled}
        />
      );
    case 'textarea':
      return (
        <LabeledTextArea
          id={props.fieldUuid}
          label={label}
          value={stringValue}
          onChange={(nextValue) => props.onChange(nextValue)}
          disabled={props.disabled}
        />
      );
    case 'select':
      return (
        <Select
          key={`${props.fieldUuid}-${stringValue}`}
          id={props.fieldUuid}
          label={label}
          value={stringValue}
          onValueChange={(nextValue) => props.onChange(nextValue)}
          options={toDataSelectOptions(props.options, props.language)}
          placeholder="Select..."
          disabled={props.disabled}
        />
      );
    case 'radio':
      return (
        <RadioGroup
          label={label}
          type={RadioGroupVariations.Pill}
          value={stringValue}
          onValueChange={(nextValue) => props.onChange(nextValue)}
          items={props.options.map((option) => ({
            id: `${props.fieldUuid}-${option.value}`,
            value: option.value,
            label: resolveOptionLabel(option, props.language),
          }))}
          inputRef={createRef<HTMLInputElement>() as RefObject<HTMLInputElement>}
          disabled={props.disabled}
        />
      );
    case 'checkbox':
      return (
        <Checkbox
          id={props.fieldUuid}
          label={props.prompt && props.prompt !== props.label ? props.prompt : props.label}
          checked={Boolean(props.value)}
          onCheckedChange={(checked) => props.onChange(checked === true)}
          disabled={props.disabled}
          required={false}
        />
      );
    case 'checkbox_group': {
      const selectedValues = Array.isArray(props.value) ? props.value : [];
      return (
        <CheckboxGroup
          key={`${props.fieldUuid}-${selectedValues.join(',')}`}
          name={props.fieldUuid}
          heading={label}
          options={toDataSelectOptions(props.options, props.language)}
          preSelected={selectedValues}
          onSelection={(selected) => props.onChange(selected)}
          orientation="vertical"
        />
      );
    }
    default:
      return renderPreviewField(props.label, props.value);
  }
};

const DEFAULT_FIELD_RENDERERS: Record<FormFieldKind, ThemeFieldRenderer> = {
  label: InfoHint,
  text: (props) => renderDsControl(props, { withLabel: true }),
  date: (props) => renderDsControl(props, { withLabel: true }),
  radio: (props) => renderDsControl(props, { withLabel: true }),
  checkbox_group: (props) => renderDsControl(props, { withLabel: true }),
  checkbox: (props) => renderDsControl(props, { withLabel: true }),
  select: (props) => renderDsControl(props, { withLabel: true }),
  textarea: (props) => renderDsControl(props, { withLabel: true }),
  number: (props) => renderDsControl(props, { withLabel: true }),
  tel: (props) => renderDsControl(props, { withLabel: true }),
  email: (props) => renderDsControl(props, { withLabel: true }),
};

const renderThemedField = (
  props: ThemeFieldRendererProps,
  Shell: typeof EsfFieldShell,
  FieldLabel: typeof EsfFieldLabel,
): ReactElement => {
  if (props.preview) {
    return renderPreviewField(props.label, props.value);
  }
  const kind = normalizeFieldKind(props.fieldType);
  if (kind === 'checkbox' || kind === 'checkbox_group' || kind === 'radio') {
    return renderDsControl(props, { withLabel: true });
  }
  return (
    <Shell>
      <FieldLabel>{props.label}</FieldLabel>
      {renderDsControl(props, { withLabel: false })}
    </Shell>
  );
};

const createThemedFieldRenderers = (
  Shell: typeof EsfFieldShell,
  FieldLabel: typeof EsfFieldLabel,
): Partial<Record<FormFieldKind, ThemeFieldRenderer>> => {
  const themed = (props: ThemeFieldRendererProps) => renderThemedField(props, Shell, FieldLabel);
  return {
    label: InfoHint,
    text: themed,
    date: themed,
    number: themed,
    tel: themed,
    email: themed,
    textarea: themed,
    select: themed,
    radio: (props) => renderDsControl(props, { withLabel: true }),
    checkbox: (props) => renderDsControl(props, { withLabel: true }),
    checkbox_group: (props) => renderDsControl(props, { withLabel: true }),
  };
};

const ESF_FIELD_RENDERERS = createThemedFieldRenderers(EsfFieldShell, EsfFieldLabel);
const ESF_UX_AUDIT_EXAMPLE_FIELD_RENDERERS = createThemedFieldRenderers(
  UxAuditFieldShell,
  UxAuditFieldLabel,
);

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