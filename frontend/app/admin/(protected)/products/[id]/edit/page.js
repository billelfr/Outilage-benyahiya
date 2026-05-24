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

        if (!active) {
          return;
        }

        setProduct(normalizeProduct(response));
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(getErrorMessage(loadError, "We could not load this product."));
      } finally {
        if (active) {
          setLoading(false);
        }
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
      setError(getErrorMessage(submitError, "We could not update the product."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingState title="Loading product" description="Preparing the edit form." />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Products"
          title="Edit product"
          description="Update storefront details while preserving the existing product record."
        />
        {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}
      </Card>

      {product ? (
        <ProductForm
          initialValues={{
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            stock: product.stock,
            description: product.description,
            featured: product.featured,
          }}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          submitting={submitting}
          errorMessage={error}
        />
      ) : null}
    </div>
  );
}
