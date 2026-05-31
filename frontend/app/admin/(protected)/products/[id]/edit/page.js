"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { LoadingState } from "@/components/loading-state";
import { fetchProduct, getErrorMessage, updateAdminProduct } from "@/lib/api";
import { normalizeProduct } from "@/lib/normalize";
import { Card, SectionHeader } from "@/components/ui/card";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        const response = await fetchProduct(params.id);

        if (!active) return;

        setProduct(normalizeProduct(response));
        setError("");
      } catch (loadError) {
        if (!active) return;

        setError(getErrorMessage(loadError, "Impossible de charger ce produit."));
      } finally {
        if (active) setLoading(false);
      }
    }

    if (params?.id) {
      loadProduct();
    }

    return () => {
      active = false;
    };
  }, [params?.id]);

  async function handleSubmit(values) {
    try {
      setSubmitting(true);
      setError("");
      await updateAdminProduct(params.id, values);
      router.replace("/admin/products");
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Impossible de mettre à jour le produit."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Chargement du produit"
        description="Préparation du formulaire de modification."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Produits"
          title="Modifier le produit"
          description="Mettez à jour les informations de la boutique tout en conservant l'enregistrement existant du produit."
        />
        {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}
      </Card>

      {product ? (
        <ProductForm
          initialValues={{
            name: product.name,
            category: product.category,
            price: product.price,
            reference: product.reference,
            image: product.image,
            isAvailable: product.inStock,
            isNouvellite: product.isNouvellite,
            isPromotion: product.isPromotion,
            description: product.description,
            featured: product.featured,
          }}
          submitLabel="Enregistrer les modifications"
          onSubmit={handleSubmit}
          submitting={submitting}
          errorMessage={error}
        />
      ) : null}
    </div>
  );
}