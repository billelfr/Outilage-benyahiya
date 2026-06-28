"use client";

import Link from "next/link";
import { formatCurrency, formatCategory } from "@/lib/format";
import { normalizeProduct } from "@/lib/normalize";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ProductImageCarousel } from "@/components/product-image-carousel";

export function ProductCard({ product, priorityImage = false }) {
  const normalizedProduct = normalizeProduct(product);
  const { addItem } = useCart();
  const stockValue = Number(product?.stock ?? product?.quantity);
  const hasEmptyStockCount = Number.isFinite(stockValue) && stockValue <= 0;
  const hasPromotionPrice = normalizedProduct.isPromotion && normalizedProduct.promotionPrice > 0;
  const isOutOfStock =
    !normalizedProduct.inStock ||
    product?.isAvailable === false ||
    product?.is_available === false ||
    product?.inStock === false ||
    hasEmptyStockCount;

  function handleAddToCart() {
    if (isOutOfStock) {
      return;
    }

    addItem(normalizedProduct, 1);
  }

  return (
    <article
      className={`panel group overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(16,24,40,0.12)] ${
        isOutOfStock ? "opacity-75" : ""
      }`}
    >
      <div className="relative overflow-hidden bg-slate-100">
        <ProductImageCarousel
          images={normalizedProduct.images}
          alt={normalizedProduct.name}
          href={`/products/${normalizedProduct.id}`}
          priorityImage={priorityImage}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-muted-strong shadow-sm backdrop-blur">
            {formatCategory(normalizedProduct.category)}
          </div>

          {normalizedProduct.isNouvellite && (
            <div className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              Nouveauté
            </div>
          )}

          {normalizedProduct.isPromotion && (
            <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              Promotion
            </div>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <Link href={`/products/${normalizedProduct.id}`} className="block">
            <h3 className="text-lg font-bold tracking-tight hover:text-accent-strong">
              {normalizedProduct.name}
            </h3>
          </Link>

          {normalizedProduct.reference && (
            <p className="text-xs text-muted font-mono">
              Réf : {normalizedProduct.reference}
            </p>
          )}

          <p className="line-clamp-2 text-sm leading-6 text-muted">
            {normalizedProduct.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {hasPromotionPrice ? (
              <>
                <span className="text-base font-black text-red-600 line-through decoration-2">
                  {formatCurrency(normalizedProduct.originalPrice)}
                </span>
                <span className="text-2xl font-black tracking-tight text-slate-950">
                  {formatCurrency(normalizedProduct.promotionPrice)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold tracking-tight">
                {formatCurrency(normalizedProduct.price)}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <Button
              onClick={handleAddToCart}
              size="sm"
              disabled={isOutOfStock}
              className={isOutOfStock ? "!pointer-events-auto cursor-not-allowed opacity-50" : ""}
            >
              Ajouter au panier
            </Button>

            {isOutOfStock && (
              <p className="text-xs font-semibold text-danger">
                Rupture de stock
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
