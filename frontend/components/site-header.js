"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_NAME, Logo } from "@/components/ui/Logo";
import { useCart } from "@/store/cart";

const links = [
  { href: "/", label: "Boutique" },
  { href: "/admin/login", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-yellow-200/70 bg-white/90 backdrop-blur-xl">
        <div className="page-shell relative flex flex-col gap-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Logo priority className="h-14 w-14 sm:h-16 sm:w-16" />

              <div className="min-w-0">
                <p className="truncate text-base font-black leading-tight tracking-tight text-foreground sm:text-lg">
                  {BRAND_NAME}
                </p>

                <p className="hidden text-xs font-semibold text-muted sm:block">
                  Boutique d'outillage
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((currentValue) => !currentValue)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white/90 shadow-sm hover:bg-yellow-50"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label="Ouvrir le menu"
            >
              <span className="flex w-5 flex-col gap-1">
                <span
                  className={`h-0.5 rounded-full bg-foreground transition ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />

                <span
                  className={`h-0.5 rounded-full bg-foreground transition ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />

                <span
                  className={`h-0.5 rounded-full bg-foreground transition ${
                    menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          {menuOpen ? (
            <nav
              id="site-menu"
              className="absolute right-0 top-full mt-2 grid w-48 gap-1 rounded-2xl border border-line bg-white p-2 shadow-[0_22px_60px_rgba(22,22,22,0.16)]"
            >
              {links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/" &&
                    pathname.startsWith(`${link.href}/`)) ||
                  (link.href === "/" && pathname === "/");

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                      active
                        ? "bg-accent-strong text-slate-950 shadow-sm"
                        : "text-muted-strong hover:bg-yellow-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>
      </header>

      {itemCount > 0 ? (
        <Link
          href="/cart"
          className="fixed bottom-5 right-4 z-50 inline-flex min-h-14 items-center gap-3 rounded-2xl border border-yellow-300 bg-slate-950 px-5 text-sm font-bold text-white shadow-[0_18px_45px_rgba(22,22,22,0.24)] hover:-translate-y-0.5 hover:bg-slate-800 sm:right-6"
          aria-label={`Panier avec ${itemCount} articles`}
        >
          <span>Panier</span>

          <span className="flex h-7 min-w-7 items-center justify-center rounded-xl bg-accent-strong px-2 text-xs text-slate-950">
            {itemCount}
          </span>
        </Link>
      ) : null}
    </>
  );
}