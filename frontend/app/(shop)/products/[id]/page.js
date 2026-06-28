"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { fetchProduct, getErrorMessage } from "@/lib/publicApi";
import { formatCurrency, formatCategory } from "@/lib/format";
import { normalizeProduct } from "@/lib/normalize";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductImageCarousel } from "@/components/product-image-carousel";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const hasPromotionPrice = product?.isPromotion && product?.promotionPrice > 0;
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="page-shell py-12">
        <LoadingState
          title="Chargement du produit"
          description="Récupération des détails du produit depuis l&apos;API."
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-shell py-12">
        <EmptyState
          title="Produit indisponible"
          description={error || "Ce produit est introuvable."}
          actionHref="/"
          actionLabel="Retour à la boutique"
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
          ← Retour à la boutique
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="overflow-hidden">
          <ProductImageCarousel
            images={product.images}
            alt={product.name}
            priorityImage
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Card>

        <Card className="p-7 md:p-10">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">
              {formatCategory(product.category)}
            </p>
            {!product.inStock && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                Rupture de stock
              </span>
            )}
          </div>

          {product.reference && (
            <p className="mt-2 text-xs text-muted font-mono">Réf : {product.reference}</p>
          )}

          <h1 className="mt-4 text-4xl font-bold leading-none tracking-tight md:text-6xl">
            {product.name}
          </h1>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2">
            {hasPromotionPrice ? (
              <>
                <span className="text-2xl font-black text-red-600 line-through decoration-2">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-4xl font-black tracking-tight text-slate-950">
                  {formatCurrency(product.promotionPrice)}
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold tracking-tight">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            {product.inStock ? (
              <>
                <label className="flex min-h-14 items-center justify-between rounded-2xl border border-line bg-white/80 px-4 sm:min-w-40">
                  <span className="text-sm font-bold text-muted-strong">Quantité</span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                    className="w-16 bg-transparent text-right font-semibold outline-none"
                  />
                </label>
                <Button onClick={() => addItem(product, quantity)} size="lg" className="sm:flex-1">
                  Ajouter au panier
                </Button>
              </>
            ) : (
              <Button disabled size="lg" className="sm:flex-1">
                Rupture de stock
              </Button>
            )}
          </div>
          
          <p className="mt-5 text-base leading-7 text-muted">{product.description}</p>
          

          

          <div className="mt-8 grid gap-3 text-sm text-muted md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em]">Commande sans compte</p>
              <p className="mt-2 leading-6">Aucun compte client ni coordonnées bancaires ne sont requis pour passer une commande.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em]">Panier local</p>
              <p className="mt-2 leading-6">Les articles restent dans le navigateur jusqu&apos;à la validation de la commande ou leur suppression manuelle.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
