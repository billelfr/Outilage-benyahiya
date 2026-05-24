import Link from "next/link";

export function EmptyState({ title, description, actionHref, actionLabel }) {
  return (
    <div className="panel rounded-2xl px-6 py-14 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-xl font-bold text-accent-strong">
        +
      </div>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn-primary mt-6 min-h-12 px-5 text-sm">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
