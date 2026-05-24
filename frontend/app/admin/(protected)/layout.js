import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { AdminSessionProvider } from "@/components/admin/admin-session-provider";
import { AdminShell } from "@/components/admin/admin-shell";

export default function ProtectedAdminLayout({ children }) {
  return (
    <AdminSessionProvider>
      <AdminAuthGuard>
        <AdminShell>{children}</AdminShell>
      </AdminAuthGuard>
    </AdminSessionProvider>
  );
}
