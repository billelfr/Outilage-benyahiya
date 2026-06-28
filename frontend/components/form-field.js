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
  error,
  readOnly = false,
  disabled = false,
}) {
  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    required,
    readOnly,
    disabled,
    className: `input-base ${error ? "border-danger ring-danger/20" : ""} ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`,
  };

  return (
    <label className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-muted-strong">{label}</span>
        {error ? <span className="text-xs font-semibold text-danger">{error}</span> : null}
      </div>
      {type === "textarea" ? <textarea {...commonProps} rows={rows} /> : null}
      {type === "select" ? <select {...commonProps}>{children}</select> : null}
      {type !== "textarea" && type !== "select" ? <input {...commonProps} type={type} /> : null}
      {helpText && !error ? <span className="block text-xs text-muted">{helpText}</span> : null}
    </label>
  );
}
