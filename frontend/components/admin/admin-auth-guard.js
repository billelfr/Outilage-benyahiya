"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingState } from "@/components/loading-state";
import { useAdminSession } from "@/components/admin/admin-session-provider";

export function AdminAuthGuard({ children }) {
  const { admin, loading } = useAdminSession();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace(
        `/admin/login?next=${encodeURIComponent(
          pathname || "/admin"
        )}`
      );
    }
  }, [admin, loading, pathname, router]);

  if (loading) {
    return (
      <div className="page-shell py-16">
        <LoadingState
          title="Vérification de la session administrateur"
          description="Validation de vos identifiants avant le chargement du tableau de bord."
        />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return children;
}