export function Card({ children, className = "" }) {
  return <div className={`panel rounded-2xl ${className}`}>{children}</div>;
}

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}
