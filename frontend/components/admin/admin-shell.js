import { Sidebar } from "@/components/admin/sidebar";

export function AdminShell({ children }) {
  return (
    <div className="min-h-screen">
      <div className="page-shell grid gap-6 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Sidebar />
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
