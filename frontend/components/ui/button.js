import Link from "next/link";

const variants = {
  primary: "bg-accent-strong text-slate-950 shadow-[0_14px_30px_rgba(246,200,0,0.28)] hover:bg-[#eab308]",
  secondary: "border border-line bg-white/85 text-foreground shadow-sm hover:bg-white",
  ghost: "text-muted-strong hover:bg-slate-100 hover:text-foreground",
  danger: "border border-red-200 bg-white text-danger hover:bg-red-50",
};

const sizes = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-5 text-sm",
  lg: "min-h-14 px-6 text-base",
};

export function Button({ href, children, className = "", variant = "primary", size = "md", ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-2xl font-semibold outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-yellow-200 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
