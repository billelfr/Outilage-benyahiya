export function LoadingState({
  title = "Loading",
  description = "Please wait while we fetch the latest data.",
}) {
  return (
    <div className="panel rounded-2xl px-6 py-12 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-yellow-50">
        <div className="h-7 w-7 animate-spin rounded-full border-4 border-yellow-100 border-t-accent-strong" />
      </div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
