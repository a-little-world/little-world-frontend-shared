import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactElement,
} from 'react';
import styled from 'styled-components';

import { getResolvedThemeId, renderFieldForTheme, type FormFieldValue } from './themeRegistry';

export type LittleWorldFormJsonOption = {
  value: string;
  label?: string | Record<string, string>;
};

export type LittleWorldFormJsonField = {
  uuid: string;
  id: string;
  name: string;
  canonical_name?: string;
  tag?: string;
  label: string;
  label_i18n?: Record<string, string>;
  q?: Record<string, string>;
  required?: boolean;
  validation_rules?: Array<{
    rule: string;
    params?: Record<string, unknown>;
    message_i18n?: Record<string, string>;
  }>;
  type: string;
  user_input?: boolean;
  options?: LittleWorldFormJsonOption[];
  current_user_value?: string;
  current_user_value_mode?: 'encrypted' | 'decrypted';
  current_user_value_updated_at?: string;
};

export type LittleWorldFormJsonSection = {
  uuid: string;
  id: string;
  title?: string;
  description?: string;
  fields: LittleWorldFormJsonField[];
};

export type LittleWorldFormJson = {
  document: {
    id: string;
    name: string;
    theme?: string;
    default_language?: string;
    languages?: string[];
  };
  sections: LittleWorldFormJsonSection[];
};

export type LittleWorldFieldContext = {
  document: LittleWorldFormJson['document'];
  section: LittleWorldFormJsonSection;
  field: LittleWorldFormJsonField;
};

export type LittleWorldFormFieldValidationPayload = {
  sectionId: string;
  sectionUuid: string;
  fieldUuid: string;
  value: FormFieldValue;
  error: string | null;
  isValid: boolean;
};

export type LittleWorldFormSectionValidationPayload = {
  sectionId: string;
  sectionUuid: string;
  isComplete: boolean;
};

export type LittleWorldDynamicFormRendererHandle = {
  getFormFieldValue: (fieldUuid: string) => FormFieldValue | undefined;
  getCurrentFormValues: () => Record<string, FormFieldValue>;
  setFormFieldValue: (fieldUuid: string, nextValue: FormFieldValue) => boolean;
  revalidateCurrentForm: () => {
    isValid: boolean;
    errorsByField: Record<string, string>;
    invalidFieldUuids: string[];
  };
};

export type LittleWorldFieldDecorationArgs = {
  section: LittleWorldFormJsonSection;
  field: LittleWorldFormJsonField;
  preview: boolean;
  editMode: boolean;
  error: string | null;
};

type RenderFieldArgs = {
  field: LittleWorldFormJsonField;
  labelOverride?: string;
  promptOverride?: string;
};

type SectionFieldsRendererArgs = {
  section: LittleWorldFormJsonSection;
  fields: LittleWorldFormJsonField[];
  language: string;
  renderField: (args: RenderFieldArgs) => ReactElement;
};

export type LittleWorldDynamicFormRendererProps = {
  documentJson: LittleWorldFormJson | null;
  language: string;
  sectionSelector?: string | null;
  fieldValues: Record<string, FormFieldValue>;
  hideNonUserInputFields?: boolean;
  preview?: boolean;
  filterEmptyPreviewValues?: boolean;
  editMode?: boolean;
  onChangeFieldValue?: (fieldUuid: string, nextValue: FormFieldValue, context: LittleWorldFieldContext) => void;
  onEditDeleteField?: (fieldUuid: string, context: LittleWorldFieldContext) => void;
  onEditUpdateField?: (fieldUuid: string, context: LittleWorldFieldContext) => void;
  onRequestFieldDebug?: (fieldUuid: string, context: LittleWorldFieldContext) => void;
  onEditReorderFields?: (sectionUuid: string, orderedFieldUuids: string[]) => void;
  onRequestSectionDebug?: (section: LittleWorldFormJsonSection) => void;
  onValidationStateChange?: (payload: {
    isValid: boolean;
    errorsByField: Record<string, string>;
    invalidFieldUuids: string[];
  }) => void;
  onFormFieldValidate?: (payload: LittleWorldFormFieldValidationPayload) => void;
  onFormFieldValidationPassed?: (payload: LittleWorldFormFieldValidationPayload) => void;
  onFormFieldSectionValidationComplete?: (payload: LittleWorldFormSectionValidationPayload) => void;
  renderFieldEditActions?: (args: LittleWorldFieldDecorationArgs) => ReactElement | null;
  renderFieldOverlay?: (args: LittleWorldFieldDecorationArgs) => ReactElement | null;
  renderSectionFields?: (args: SectionFieldsRendererArgs) => ReactElement;
  emptyState?: ReactElement;
};

const SectionBlock = styled.section`
  margin-top: 30px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  line-height: 30px;
`;

const SectionDescription = styled.p`
  margin: 6px 0 0;
  color: #5f5e5e;
  font-size: 14px;
  line-height: 22px;
`;

const FieldStack = styled.div`
  display: grid;
  gap: 20px;
  margin-top: 20px;
`;

const DebugButton = styled.button`
  border: 1px solid #f2d5c0;
  background: #fff5ee;
  color: #a04512;
  border-radius: 999px;
  padding: 2px 9px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
`;

const FieldError = styled.div`
  margin-top: 4px;
  color: #b42318;
  font-size: 12px;
  line-height: 18px;
`;

const EditModeBanner = styled.div`
  margin-top: 16px;
  border: 1px solid #d6d0ff;
  background: #f7f6ff;
  color: #3d3279;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
`;

const EditFieldCard = styled.div<{ $dragging: boolean; $dropTarget: boolean }>`
  border: 1px solid ${({ $dropTarget }) => ($dropTarget ? '#9078ff' : '#d7d7df')};
  background: ${({ $dropTarget }) => ($dropTarget ? '#f6f4ff' : '#fcfcfe')};
  border-radius: 12px;
  padding: 10px;
  opacity: ${({ $dragging }) => ($dragging ? 0.45 : 1)};
`;

const EditActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`;

const EditIconButton = styled.button`
  border: 1px solid #d8d8dd;
  background: #ffffff;
  color: #3a3a3f;
  border-radius: 999px;
  width: 26px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
`;

const DragHandleButton = styled(EditIconButton)`
  cursor: grab;
  letter-spacing: -1px;

  &:active {
    cursor: grabbing;
  }
`;

const FieldRenderShell = styled.div`
  position: relative;
`;

const FieldOverlayLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const normalizeValueForField = (field: LittleWorldFormJsonField, raw: FormFieldValue | undefined): FormFieldValue => {
  if (raw !== undefined) {
    return raw;
  }
  if (field.type === 'checkbox_group') {
    return [];
  }
  if (field.type === 'checkbox' || field.type === 'boolean') {
    return false;
  }
  return '';
};

const hasPreviewValue = (value: FormFieldValue): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return String(value ?? '').trim().length > 0;
};

const resolveFieldPrompt = (field: LittleWorldFormJsonField, language: string): string => {
  return field.q?.[language] ?? field.q?.de ?? field.q?.en ?? field.label;
};

const resolveFieldLabel = (field: LittleWorldFormJsonField, language: string): string => {
  if (!field.label_i18n) {
    return field.label;
  }
  return field.label_i18n[language] ?? field.label_i18n.de ?? field.label_i18n.en ?? field.label;
};

const isEmptyValue = (value: FormFieldValue): boolean => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'boolean') {
    return value === false;
  }
  return String(value ?? '').trim().length === 0;
};

const asNumber = (value: FormFieldValue): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const parsed = Number(String(value ?? '').trim());
  return Number.isFinite(parsed) ? parsed : null;
};

const getRuleMessage = (
  rule: { message_i18n?: Record<string, string> } | undefined,
  language: string,
  fallback: string,
): string => {
  if (!rule?.message_i18n) {
    return fallback;
  }
  return rule.message_i18n[language] ?? rule.message_i18n.de ?? rule.message_i18n.en ?? fallback;
};

const validateField = (
  field: LittleWorldFormJsonField,
  value: FormFieldValue,
  language: string,
): string | null => {
  const rules = field.validation_rules ?? [];
  const requiredByRule = rules.some((rule) => rule.rule === 'required');
  const isRequired = Boolean(field.required) || requiredByRule;
  const empty = isEmptyValue(value);

  if (isRequired && empty) {
    return getRuleMessage(
      rules.find((rule) => rule.rule === 'required'),
      language,
      'This field is required.',
    );
  }

  if (!isRequired && empty) {
    return null;
  }

  for (const rule of rules) {
    const params = rule.params ?? {};
    if (rule.rule === 'required') {
      continue;
    }
    if (rule.rule === 'string_length') {
      const text = String(value ?? '');
      const min = typeof params.min === 'number' ? params.min : null;
      const max = typeof params.max === 'number' ? params.max : null;
      if (min !== null && text.length < min) {
        return getRuleMessage(rule, language, `Minimum ${min} characters required.`);
      }
      if (max !== null && text.length > max) {
        return getRuleMessage(rule, language, `Maximum ${max} characters allowed.`);
      }
    }
    if (rule.rule === 'number_range') {
      const parsed = asNumber(value);
      if (parsed === null) {
        return getRuleMessage(rule, language, 'Please enter a valid number.');
      }
      const min = typeof params.min === 'number' ? params.min : null;
      const max = typeof params.max === 'number' ? params.max : null;
      if (min !== null && parsed < min) {
        return getRuleMessage(rule, language, `Number must be at least ${min}.`);
      }
      if (max !== null && parsed > max) {
        return getRuleMessage(rule, language, `Number must be at most ${max}.`);
      }
    }
    if (rule.rule === 'regex') {
      const pattern = typeof params.pattern === 'string' ? params.pattern : '';
      if (pattern) {
        try {
          const flags = typeof params.flags === 'string' ? params.flags : undefined;
          const regex = new RegExp(pattern, flags);
          if (!regex.test(String(value ?? ''))) {
            return getRuleMessage(rule, language, 'The value format is invalid.');
          }
        } catch {
          return getRuleMessage(rule, language, 'The value format is invalid.');
        }
      }
    }
    if (rule.rule === 'email_format') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value ?? ''))) {
        return getRuleMessage(rule, language, 'Please enter a valid email address.');
      }
    }
    if (rule.rule === 'phone_format') {
      const phoneRegex = /^\+?[0-9()\-\s]{6,}$/;
      if (!phoneRegex.test(String(value ?? ''))) {
        return getRuleMessage(rule, language, 'Please enter a valid phone number.');
      }
    }
    if (rule.rule === 'enum') {
      const values = Array.isArray(params.values) ? params.values.map((entry) => String(entry)) : [];
      if (values.length && !values.includes(String(value ?? ''))) {
        return getRuleMessage(rule, language, 'Please select a valid option.');
      }
    }
    if (rule.rule === 'selection_count') {
      const selected = Array.isArray(value) ? value : [];
      const min = typeof params.min === 'number' ? params.min : null;
      const max = typeof params.max === 'number' ? params.max : null;
      if (min !== null && selected.length < min) {
        return getRuleMessage(rule, language, `Select at least ${min} option(s).`);
      }
      if (max !== null && selected.length > max) {
        return getRuleMessage(rule, language, `Select at most ${max} option(s).`);
      }
    }
  }

  return null;
};

type ValidationSnapshot = {
  errorsByField: Record<string, string>;
  fieldValidationPayloads: LittleWorldFormFieldValidationPayload[];
  sectionValidationPayloads: LittleWorldFormSectionValidationPayload[];
};

const LittleWorldDynamicFormRenderer = forwardRef<
  LittleWorldDynamicFormRendererHandle,
  LittleWorldDynamicFormRendererProps
>(function LittleWorldDynamicFormRenderer({
  documentJson,
  language,
  sectionSelector,
  fieldValues,
  hideNonUserInputFields = true,
  preview = false,
  filterEmptyPreviewValues = false,
  editMode = false,
  onChangeFieldValue,
  onEditDeleteField,
  onEditUpdateField,
  onRequestFieldDebug,
  onEditReorderFields,
  onRequestSectionDebug,
  onValidationStateChange,
  onFormFieldValidate,
  onFormFieldValidationPassed,
  onFormFieldSectionValidationComplete,
  renderFieldEditActions,
  renderFieldOverlay,
  renderSectionFields,
  emptyState,
}, ref): ReactElement {
  const [draggedFieldUuid, setDraggedFieldUuid] = useState<string | null>(null);
  const [dropTargetFieldUuid, setDropTargetFieldUuid] = useState<string | null>(null);
  const [dragSectionUuid, setDragSectionUuid] = useState<string | null>(null);
  const previousFieldValidityRef = useRef<Record<string, boolean>>({});
  const previousSectionCompletionRef = useRef<Record<string, boolean>>({});
  const validationSnapshotRef = useRef<ValidationSnapshot>({
    errorsByField: {},
    fieldValidationPayloads: [],
    sectionValidationPayloads: [],
  });
  const sectionsRef = useRef<LittleWorldFormJsonSection[]>([]);
  const fieldValuesRef = useRef<Record<string, FormFieldValue>>({});
  const activeThemeId = getResolvedThemeId(documentJson?.document.theme);
  const normalizedSectionSelector = sectionSelector?.trim();

  const sections = useMemo(() => {
    if (!documentJson) {
      return [] as LittleWorldFormJsonSection[];
    }

    const candidateSections = normalizedSectionSelector
      ? documentJson.sections.filter(
        (section) => section.id === normalizedSectionSelector || section.uuid === normalizedSectionSelector,
      )
      : documentJson.sections;

    return candidateSections
      .map((section) => ({
        ...section,
        fields: section.fields.filter(
          (field) => !hideNonUserInputFields || field.user_input !== false || field.type === 'label',
        ),
      }))
      .map((section) => {
        if (!preview || !filterEmptyPreviewValues) {
          return section;
        }
        return {
          ...section,
          fields: section.fields.filter((field) => {
            if (field.type === 'label') {
              return false;
            }
            return hasPreviewValue(normalizeValueForField(field, fieldValues[field.uuid]));
          }),
        };
      })
      .filter((section) => section.fields.length > 0);
  }, [
    documentJson,
    fieldValues,
    filterEmptyPreviewValues,
    hideNonUserInputFields,
    normalizedSectionSelector,
    preview,
  ]);

  const errorsByField = useMemo(() => {
    if (preview) {
      return {};
    }
    const nextErrors: Record<string, string> = {};
    for (const section of sections) {
      for (const field of section.fields) {
        if (field.type === 'label') {
          continue;
        }
        const value = normalizeValueForField(field, fieldValues[field.uuid]);
        const error = validateField(field, value, language);
        if (error) {
          nextErrors[field.uuid] = error;
        }
      }
    }
    return nextErrors;
  }, [fieldValues, language, preview, sections]);

  const fieldValidationPayloads = useMemo(() => {
    const payloads: LittleWorldFormFieldValidationPayload[] = [];
    for (const section of sections) {
      for (const field of section.fields) {
        if (field.type === 'label') {
          continue;
        }
        const value = normalizeValueForField(field, fieldValues[field.uuid]);
        const error = errorsByField[field.uuid] ?? null;
        payloads.push({
          sectionId: section.id,
          sectionUuid: section.uuid,
          fieldUuid: field.uuid,
          value,
          error,
          isValid: error === null,
        });
      }
    }
    return payloads;
  }, [errorsByField, fieldValues, sections]);

  const sectionValidationPayloads = useMemo(() => {
    return sections.map((section) => {
      const interactiveFields = section.fields.filter((field) => field.type !== 'label');
      const isComplete = interactiveFields.every((field) => !errorsByField[field.uuid]);
      return {
        sectionId: section.id,
        sectionUuid: section.uuid,
        isComplete,
      } satisfies LittleWorldFormSectionValidationPayload;
    });
  }, [errorsByField, sections]);

  const emitValidationLifecycle = useCallback(({
    snapshot,
    emitSectionCompletionOnUnchanged = false,
  }: {
    snapshot: ValidationSnapshot;
    emitSectionCompletionOnUnchanged?: boolean;
  }) => {
    const invalidFieldUuids = Object.keys(snapshot.errorsByField);
    onValidationStateChange?.({
      isValid: invalidFieldUuids.length === 0,
      errorsByField: snapshot.errorsByField,
      invalidFieldUuids,
    });

    const previousValidity = previousFieldValidityRef.current;
    for (const payload of snapshot.fieldValidationPayloads) {
      onFormFieldValidate?.(payload);
      if (onFormFieldValidationPassed) {
        const previous = previousValidity[payload.fieldUuid];
        if (previous === false && payload.isValid) {
          onFormFieldValidationPassed(payload);
        }
      }
    }

    const nextValidity: Record<string, boolean> = {};
    for (const payload of snapshot.fieldValidationPayloads) {
      nextValidity[payload.fieldUuid] = payload.isValid;
    }
    previousFieldValidityRef.current = nextValidity;

    const previousCompletion = previousSectionCompletionRef.current;
    for (const payload of snapshot.sectionValidationPayloads) {
      if (
        emitSectionCompletionOnUnchanged
        || previousCompletion[payload.sectionUuid] !== payload.isComplete
      ) {
        onFormFieldSectionValidationComplete?.(payload);
      }
    }

    const nextCompletion: Record<string, boolean> = {};
    for (const payload of snapshot.sectionValidationPayloads) {
      nextCompletion[payload.sectionUuid] = payload.isComplete;
    }
    previousSectionCompletionRef.current = nextCompletion;
  }, [
    onFormFieldSectionValidationComplete,
    onFormFieldValidate,
    onFormFieldValidationPassed,
    onValidationStateChange,
  ]);

  validationSnapshotRef.current = {
    errorsByField,
    fieldValidationPayloads,
    sectionValidationPayloads,
  };
  sectionsRef.current = sections;
  fieldValuesRef.current = fieldValues;

  useImperativeHandle(ref, () => ({
    getFormFieldValue: (fieldUuid: string) => {
      const section = sectionsRef.current.find((candidateSection) =>
        candidateSection.fields.some((field) => field.uuid === fieldUuid)
      );
      const field = section?.fields.find((candidateField) => candidateField.uuid === fieldUuid);
      if (!field) {
        return undefined;
      }
      return normalizeValueForField(field, fieldValuesRef.current[fieldUuid]);
    },
    getCurrentFormValues: () => ({ ...fieldValuesRef.current }),
    setFormFieldValue: (fieldUuid: string, nextValue: FormFieldValue) => {
      if (!documentJson || !onChangeFieldValue || preview) {
        return false;
      }
      const section = sectionsRef.current.find((candidateSection) =>
        candidateSection.fields.some((field) => field.uuid === fieldUuid)
      );
      if (!section) {
        return false;
      }
      const field = section.fields.find((candidateField) => candidateField.uuid === fieldUuid);
      if (!field || field.type === 'label') {
        return false;
      }

      const context: LittleWorldFieldContext = {
        document: documentJson.document,
        section,
        field,
      };
      onChangeFieldValue(fieldUuid, nextValue, context);
      return true;
    },
    revalidateCurrentForm: () => {
      const snapshot = validationSnapshotRef.current;
      emitValidationLifecycle({
        snapshot,
        emitSectionCompletionOnUnchanged: true,
      });
      const invalidFieldUuids = Object.keys(snapshot.errorsByField);
      return {
        isValid: invalidFieldUuids.length === 0,
        errorsByField: snapshot.errorsByField,
        invalidFieldUuids,
      };
    },
  }), [documentJson, emitValidationLifecycle, onChangeFieldValue, preview]);

  useEffect(() => {
    emitValidationLifecycle({
      snapshot: {
        errorsByField,
        fieldValidationPayloads,
        sectionValidationPayloads,
      },
    });
  }, [
    errorsByField,
    emitValidationLifecycle,
    fieldValidationPayloads,
    sectionValidationPayloads,
  ]);

  if (!documentJson || sections.length === 0) {
    return emptyState ?? <></>;
  }

  return (
    <>
      {editMode && !preview ? (
        <EditModeBanner>
          Edit view enabled. Drag fields by handle (::), use i to inspect JSON, * to toggle required, and x to delete.
        </EditModeBanner>
      ) : null}
      {sections.map((section) => {
        const renderField = ({ field, labelOverride, promptOverride }: RenderFieldArgs): ReactElement => {
          const context: LittleWorldFieldContext = {
            document: documentJson.document,
            section,
            field,
          };
          const prompt = promptOverride ?? resolveFieldPrompt(field, language);
          const labelBase = labelOverride ?? resolveFieldLabel(field, language);
          const label = `${labelBase}${field.required ? ' *' : ''}`;

          const onDropOnField = (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (!onEditReorderFields || !draggedFieldUuid || draggedFieldUuid === field.uuid) {
              return;
            }
            const sourceIndex = section.fields.findIndex((sectionField) => sectionField.uuid === draggedFieldUuid);
            const targetIndex = section.fields.findIndex((sectionField) => sectionField.uuid === field.uuid);
            if (sourceIndex < 0 || targetIndex < 0) {
              return;
            }
            const ordered = [...section.fields];
            const [movedField] = ordered.splice(sourceIndex, 1);
            if (!movedField) {
              return;
            }
            ordered.splice(targetIndex, 0, movedField);
            onEditReorderFields(section.uuid, ordered.map((sectionField) => sectionField.uuid));
            setDraggedFieldUuid(null);
            setDropTargetFieldUuid(null);
            setDragSectionUuid(null);
          };

          const rendered = renderFieldForTheme(activeThemeId, {
            fieldUuid: field.uuid,
            fieldType: field.type,
            label,
            prompt,
            language,
            required: Boolean(field.required),
            value: normalizeValueForField(field, fieldValues[field.uuid]),
            options: field.options ?? [],
            preview,
            disabled: preview,
            editMode: false,
            onChange: (nextValue) => onChangeFieldValue?.(field.uuid, nextValue, context),
          });
          const decorationArgs: LittleWorldFieldDecorationArgs = {
            section,
            field,
            preview,
            editMode,
            error: errorsByField[field.uuid] ?? null,
          };
          const renderedOverlay = renderFieldOverlay?.(decorationArgs);
          const renderedWithOverlay = renderedOverlay ? (
            <FieldRenderShell>
              {rendered}
              <FieldOverlayLayer>{renderedOverlay}</FieldOverlayLayer>
            </FieldRenderShell>
          ) : rendered;

          if (!editMode || preview) {
            return (
              <div key={field.uuid}>
                {renderedWithOverlay}
                {!preview && errorsByField[field.uuid] ? <FieldError>{errorsByField[field.uuid]}</FieldError> : null}
              </div>
            );
          }

          const isDragging = draggedFieldUuid === field.uuid;
          const isDropTarget = dropTargetFieldUuid === field.uuid;
          const draggable = Boolean(onEditReorderFields);

          return (
            <EditFieldCard
              key={field.uuid}
              $dragging={isDragging}
              $dropTarget={isDropTarget}
              draggable={draggable}
              onDragStart={(event) => {
                if (!draggable) {
                  return;
                }
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', field.uuid);
                setDraggedFieldUuid(field.uuid);
                setDragSectionUuid(section.uuid);
              }}
              onDragOver={(event) => {
                if (!draggable || dragSectionUuid !== section.uuid) {
                  return;
                }
                event.preventDefault();
                setDropTargetFieldUuid(field.uuid);
              }}
              onDragLeave={() => {
                if (dropTargetFieldUuid === field.uuid) {
                  setDropTargetFieldUuid(null);
                }
              }}
              onDrop={onDropOnField}
              onDragEnd={() => {
                setDraggedFieldUuid(null);
                setDropTargetFieldUuid(null);
                setDragSectionUuid(null);
              }}
            >
              <EditActionRow>
                {onRequestFieldDebug ? (
                  <EditIconButton
                    type="button"
                    aria-label="Show field JSON"
                    title="Show field JSON"
                    onClick={() => onRequestFieldDebug(field.uuid, context)}
                  >
                    i
                  </EditIconButton>
                ) : null}
                {onEditUpdateField ? (
                  <EditIconButton
                    type="button"
                    aria-label="Toggle required"
                    title="Toggle required"
                    onClick={() => onEditUpdateField(field.uuid, context)}
                  >
                    *
                  </EditIconButton>
                ) : null}
                {onEditDeleteField ? (
                  <EditIconButton
                    type="button"
                    aria-label="Delete field"
                    title="Delete field"
                    onClick={() => onEditDeleteField(field.uuid, context)}
                  >
                    x
                  </EditIconButton>
                ) : null}
                {renderFieldEditActions ? renderFieldEditActions(decorationArgs) : null}
                {draggable ? (
                  <DragHandleButton
                    type="button"
                    aria-label="Drag to reorder"
                    title="Drag to reorder"
                  >
                    ::
                  </DragHandleButton>
                ) : null}
              </EditActionRow>
              {renderedWithOverlay}
              {errorsByField[field.uuid] ? <FieldError>{errorsByField[field.uuid]}</FieldError> : null}
            </EditFieldCard>
          );
        };

        return (
          <SectionBlock key={section.uuid}>
            <SectionHeader>
              <SectionTitle>{section.title ?? section.id}</SectionTitle>
              {editMode && onRequestSectionDebug ? (
                <DebugButton type="button" onClick={() => onRequestSectionDebug(section)}>
                  json
                </DebugButton>
              ) : null}
            </SectionHeader>
            {section.description ? <SectionDescription>{section.description}</SectionDescription> : null}
            <FieldStack>
              {renderSectionFields
                ? renderSectionFields({
                  section,
                  fields: section.fields,
                  language,
                  renderField,
                })
                : section.fields.map((field) => renderField({ field }))}
            </FieldStack>
          </SectionBlock>
        );
      })}
    </>
  );
});

LittleWorldDynamicFormRenderer.displayName = 'LittleWorldDynamicFormRenderer';

export default LittleWorldDynamicFormRenderer;
