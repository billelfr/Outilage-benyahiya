"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormField } from "@/components/form-field";
import { loginAdmin, getErrorMessage } from "@/lib/adminApi";
import { setAdminToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await loginAdmin(formValues);

      if (!response.token) {
        throw new Error(
          "La réponse de connexion ne contient pas de jeton JWT."
        );
      }

      setAdminToken(response.token);

      router.replace(searchParams.get("next") || "/admin");
    } catch (loginError) {
      setError(
        getErrorMessage(loginError, "Échec de la connexion administrateur.")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg p-8 md:p-10">
      <div className="mb-8 flex items-center gap-3">
        <Logo size="small" priority className="!h-15 !w-20" />

        <div>
          <p className="font-bold">Portail administrateur</p>

          <p className="text-sm text-muted">
            Accès administrateur
          </p>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">
        Console sécurisée
      </p>

      <h1 className="mt-4 text-4xl font-bold leading-none tracking-tight">
        Connectez-vous pour gérer la boutique
      </h1>

      <p className="mt-4 text-sm leading-6 text-muted">
        Cette connexion stocke le JWT dans le localStorage pour Axios
        et le copie dans un cookie afin de protéger les routes
        administrateur lors de la navigation.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <FormField
          label="E-mail"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="admin@exemple.com"
          required
        />

        <FormField
          label="Mot de passe"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        {error ? (
          <p className="text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full"
        >
          {submitting
            ? "Connexion en cours..."
            : "Se connecter"}
        </Button>
      </form>

      <Button
        href="/"
        variant="secondary"
        className="mt-4 w-full"
      >
        Retour à la boutique
      </Button>
    </Card>
  );
}