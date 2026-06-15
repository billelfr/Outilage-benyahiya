"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { createAdminProduct, getErrorMessage } from "@/lib/adminApi";
import { Card, SectionHeader } from "@/components/ui/card";

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    try {
      setSubmitting(true);
      setError("");
      await createAdminProduct(values);
      router.replace("/admin/products");
    } catch (submitError) {
      setError(
        getErrorMessage(
          submitError,
          "Nous n'avons pas pu créer le produit."
        )
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Produits"
          title="Créer un nouveau produit"
          description="Ajoutez une description claire du produit, le prix, le stock et les images pour le catalogue de la boutique."
        />
      </Card>

      <ProductForm
        submitLabel="Créer le produit"
        onSubmit={handleSubmit}
        submitting={submitting}
        errorMessage={error}
      />
    </div>
  );
}