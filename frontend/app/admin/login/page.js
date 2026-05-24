import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { LoadingState } from "@/components/loading-state";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Suspense
        fallback={
          <div className="w-full max-w-lg">
            <LoadingState title="Loading login" description="Preparing the admin sign-in form." />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
