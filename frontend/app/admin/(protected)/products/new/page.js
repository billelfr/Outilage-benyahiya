"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { createAdminProduct, getErrorMessage } from "@/lib/api";
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
      setError(getErrorMessage(submitError, "We could not create the product."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Products"
          title="Create a new product"
          description="Add clear product copy, pricing, stock, and imagery for the storefront catalog."
        />
      </Card>

      <ProductForm
        submitLabel="Create product"
        onSubmit={handleSubmit}
        submitting={submitting}
        errorMessage={error}
      />
    </div>
  );
}
