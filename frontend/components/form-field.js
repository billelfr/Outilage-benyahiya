export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  children,
  helpText,
}) {
  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    required,
    className: "input-base",
  };

  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-muted-strong">{label}</span>
      {type === "textarea" ? <textarea {...commonProps} rows={rows} /> : null}
      {type === "select" ? <select {...commonProps}>{children}</select> : null}
      {type !== "textarea" && type !== "select" ? <input {...commonProps} type={type} /> : null}
      {helpText ? <span className="block text-xs text-muted">{helpText}</span> : null}
    </label>
  );
}
