"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatCategory } from "@/lib/format";
import { normalizeProduct } from "@/lib/normalize";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";

const fallbackImage =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80";

export function ProductCard({ product }) {
  const normalizedProduct = normalizeProduct(product);
  const { addItem } = useCart();

  return (
    <article className="panel group overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(16,24,40,0.12)]">
      <Link href={`/products/${normalizedProduct.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={normalizedProduct.image || fallbackImage}
            alt={normalizedProduct.name}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
            className="object-cover transition duration-700 group-hover:scale-[1.05]"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-muted-strong shadow-sm backdrop-blur">
            {formatCategory(normalizedProduct.category)}
          </div>
        </div>
      </Link>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <Link href={`/products/${normalizedProduct.id}`} className="block">
            <h3 className="text-lg font-bold tracking-tight hover:text-accent-strong">
              {normalizedProduct.name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-muted">
            {normalizedProduct.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-2xl font-bold tracking-tight">{formatCurrency(normalizedProduct.price)}</p>
          <Button onClick={() => addItem(normalizedProduct, 1)} size="sm">
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
