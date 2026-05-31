"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminSession } from "@/components/admin/admin-session-provider";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { href: "/admin", label: "Aperçu" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/orders", label: "Commandes" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout } = useAdminSession();

  return (
    <aside className="panel rounded-2xl p-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white">
          <Logo size="small" priority className="!h-7 !w-14" />

          <div>
            <p className="text-sm font-bold">Console admin</p>
            <p className="text-xs text-slate-300">Console d'opérations</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-white/70 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Connecté
          </p>

          <p className="mt-2 font-bold">{admin?.name}</p>

          <p className="truncate text-sm text-muted">
            {admin?.email}
          </p>
        </div>

        <nav className="mt-4 grid gap-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(`${item.href}/`)) ||
              (item.href === "/admin" && pathname === "/admin");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-accent-strong text-slate-950 shadow-[0_14px_30px_rgba(246,200,0,0.25)]"
                    : "text-muted-strong hover:bg-yellow-50 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto grid gap-3 pt-6">
          <Button
            href="/"
            variant="secondary"
            className="w-full"
          >
            Retour à la boutique
          </Button>

          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
          >
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}