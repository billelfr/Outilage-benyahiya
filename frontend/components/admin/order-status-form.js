"use client";

const statuses = ["pending", "confirmed", "delivered"];

export function OrderStatusForm({ value, updating, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={updating}
        className="rounded-2xl border border-line bg-white px-3 py-2 text-sm font-bold text-muted-strong outline-none focus:ring-4 focus:ring-yellow-200"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status.toUpperCase()}
          </option>
        ))}
      </select>
      {updating ? <span className="text-xs text-muted">Saving...</span> : null}
    </label>
  );
}
