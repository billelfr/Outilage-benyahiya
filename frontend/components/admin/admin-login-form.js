"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormField } from "@/components/form-field";
import { loginAdmin, getErrorMessage } from "@/lib/api";
import { setAdminToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      const response = await loginAdmin(formValues);

      if (!response.token) {
        throw new Error("The login response did not include a JWT token.");
      }

      setAdminToken(response.token);
      router.replace(searchParams.get("next") || "/admin");
    } catch (loginError) {
      setError(getErrorMessage(loginError, "Admin login failed."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg p-8 md:p-10">
      <div className="mb-8 flex items-center gap-3">
        <Logo size="small" priority className="!h-15 !w-20" />
        <div>
          <p className="font-bold">Admin portal</p>
          <p className="text-sm text-muted">Admin access</p>
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">Secure console</p>
      <h1 className="mt-4 text-4xl font-bold leading-none tracking-tight">Sign in to manage the shop</h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        This login stores the JWT in localStorage for Axios and mirrors it into a cookie so admin
        routes can be protected on navigation.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="admin@example.com"
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <Button href="/" variant="secondary" className="mt-4 w-full">Back to store</Button>
    </Card>
  );
}
