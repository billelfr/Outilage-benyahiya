const styles = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 ring-blue-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export function StatusBadge({ status }) {
  const value = String(status || "PENDING").toUpperCase();

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles[value] || styles.PENDING}`}>
      {value}
    </span>
  );
}
