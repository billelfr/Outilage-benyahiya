"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { fetchProduct, getErrorMessage } from "@/lib/api";
import { formatCurrency, formatCategory } from "@/lib/format";
import { normalizeProduct } from "@/lib/normalize";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="page-shell py-12">
        <LoadingState title="Loading product" description="Fetching product details from the API." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-shell py-12">
        <EmptyState
          title="Product unavailable"
          description={error || "This product could not be found."}
          actionHref="/"
          actionLabel="Back to shop"
        />
      </div>
    );
  }

  return (
    <div className="page-shell py-8 md:py-12">
      <div className="mb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          ← Back to Shop
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-[4/5] bg-slate-100 md:aspect-square">
            <Image
              src={
                product.image ||
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
              }
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Card>

        <Card className="p-7 md:p-10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">
              {formatCategory(product.category)}
            </p>
            {!product.inStock && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                Out of Stock
              </span>
            )}
          </div>
          {product.reference && (
            <p className="mt-2 text-xs text-muted font-mono">Ref: {product.reference}</p>
          )}
          <h1 className="mt-4 text-4xl font-bold leading-none tracking-tight md:text-6xl">{product.name}</h1>
          <p className="mt-5 text-base leading-7 text-muted">{product.description}</p>
          <p className="mt-8 text-4xl font-bold tracking-tight">{formatCurrency(product.price)}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            {product.inStock ? (
              <>
                <label className="flex min-h-14 items-center justify-between rounded-2xl border border-line bg-white/80 px-4 sm:min-w-40">
                  <span className="text-sm font-bold text-muted-strong">Quantity</span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                    className="w-16 bg-transparent text-right font-semibold outline-none"
                  />
                </label>
                <Button onClick={() => addItem(product, quantity)} size="lg" className="sm:flex-1">
                  Add to cart
                </Button>
              </>
            ) : (
              <Button disabled size="lg" className="sm:flex-1">
                Out of Stock
              </Button>
            )}
          </div>

          <div className="mt-8 grid gap-3 text-sm text-muted md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em]">Guest ordering</p>
              <p className="mt-2 leading-6">No customer account or card details are required to place an order.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em]">Local cart storage</p>
              <p className="mt-2 leading-6">Items stay in the browser until order placement or manual removal.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
