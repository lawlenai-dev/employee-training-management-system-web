import { Form, Formik } from "formik";
import { X } from "lucide-react";
import { useEffect, useId, useMemo } from "react";
import { Button } from "../../../components/Ui";
import type {
  SettingDefinition,
  SettingFormValues,
} from "../settings.types";

export type SettingFormModalProps = {
  open: boolean;
  setting: SettingDefinition;
  onClose: () => void;
  onSave: (values: Record<string, unknown>) => void;
};

export default function SettingFormModal({
  open,
  setting,
  onClose,
  onSave,
}: SettingFormModalProps) {
  const formId = useId();
  const titleId = `${formId}-title`;

  const initialValues = useMemo(
    () =>
      setting.formFields.reduce<SettingFormValues>((result, field) => {
        result[field.key] = field.defaultValue ?? "";
        return result;
      }, {}),
    [setting.formFields],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <Formik<SettingFormValues>
        initialValues={initialValues}
        validationSchema={setting.validationSchema}
        enableReinitialize
        onSubmit={(values, helpers) => {
          const normalizedValues = setting.formFields.reduce<
            Record<string, unknown>
          >((result, field) => {
            const value = values[field.key]?.trim() ?? "";
            result[field.key] =
              field.type === "number" ? Number(value || 0) : value;
            return result;
          }, {});

          onSave(normalizedValues);
          helpers.resetForm();
          helpers.setSubmitting(false);
        }}
      >
        {({
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          isSubmitting,
        }) => (
          <Form
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            noValidate
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-white px-5 py-5 sm:px-6">
              <div>
                <h2 id={titleId} className="text-xl font-bold text-heading">
                  {setting.addLabel}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  กรอกข้อมูลให้ครบ แล้วกดบันทึก
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="ปิดหน้าต่าง"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
              {setting.formFields.map((field, index) => {
                const inputId = `${formId}-${field.key}`;
                const errorId = `${inputId}-error`;
                const error =
                  touched[field.key] && errors[field.key]
                    ? String(errors[field.key])
                    : undefined;
                const controlClassName = `mt-1.5 w-full rounded-control border bg-white px-3.5 py-2.5 text-sm text-body outline-none transition placeholder:text-placeholder focus:ring-4 ${
                  error
                    ? "border-danger-500 focus:border-danger-500 focus:ring-danger-100"
                    : "border-border focus:border-brand-500 focus:ring-brand-100"
                }`;
                const commonProps = {
                  id: inputId,
                  name: field.key,
                  value: values[field.key] ?? "",
                  onChange: handleChange,
                  onBlur: handleBlur,
                  "aria-required": field.required,
                  "aria-invalid": Boolean(error),
                  "aria-describedby": error ? errorId : undefined,
                };

                return (
                  <div
                    key={field.key}
                    className={field.fullWidth ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={inputId}
                      className="text-sm font-semibold text-heading"
                    >
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-danger-600">*</span>
                      )}
                    </label>

                    {field.type === "select" ? (
                      <select {...commonProps} className={controlClassName}>
                        {!field.defaultValue && (
                          <option value="">เลือก{field.label}</option>
                        )}
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        {...commonProps}
                        rows={3}
                        maxLength={field.maxLength}
                        autoFocus={index === 0}
                        className={`${controlClassName} resize-y`}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        {...commonProps}
                        type={field.type}
                        min={field.min}
                        max={field.max}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        autoFocus={index === 0}
                        className={controlClassName}
                        placeholder={field.placeholder}
                      />
                    )}

                    {error && (
                      <p id={errorId} className="mt-1 text-xs text-danger-600">
                        {error}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-border bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <Button type="button" variant="secondary" onClick={onClose}>
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                บันทึก
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
