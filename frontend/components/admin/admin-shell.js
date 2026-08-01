import { Sidebar } from "@/components/admin/sidebar";

export function AdminShell({ children }) {
  return (
    <div className="min-h-screen">
      <div className="page-shell flex flex-col gap-4 px-3 py-4 sm:px-4 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:py-6">
        <Sidebar />
        <main className="min-w-0 space-y-6">{children}</main>
      </div>
    </div>
  );
}
