"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/card";
import { fetchProducts, getErrorMessage } from "@/lib/api";
import { normalizeProduct } from "@/lib/normalize";
import { getProductCategory, productMatchesCategory } from "@/lib/product-categories";

export default function CategoryPage() {
  const params = useParams();
  const selectedCategory = decodeURIComponent(String(params?.category || ""));
  const category = getProductCategory(selectedCategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetchProducts();

        if (!active) return;

        setProducts(response.map(normalizeProduct));
        setError("");
      } catch (loadError) {
        if (!active) return;

        setError(getErrorMessage(loadError, "Impossible de charger les produits pour le moment."));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => productMatchesCategory(product, selectedCategory));

  if (!category) {
    return (
      <div className="page-shell py-12">
        <EmptyState
          title="Catégorie introuvable"
          description="Cette catégorie n'existe pas dans le catalogue."
          actionHref="/"
          actionLabel="Retour à la boutique"
        />
      </div>
    );
  }

  return (
    <div className="page-shell space-y-5 py-8 md:py-12">
      <SectionHeader
        eyebrow="Catégorie"
        title={category.label}
        description={category.description}
        action={
          <Button href="/" variant="secondary" size="sm">
            Tous les produits
          </Button>
        }
      />

      {loading ? (
        <LoadingState
          title="Chargement des produits"
          description="Récupération du dernier inventaire depuis l'API."
        />
      ) : null}

      {!loading && error ? (
        <EmptyState
          title="Impossible de charger le catalogue"
          description={error}
          actionHref="/"
          actionLabel="Retour à la boutique"
        />
      ) : null}

      {!loading && !error && filteredProducts.length === 0 ? (
        <EmptyState
          title="Aucun produit dans cette catégorie"
          description="Revenez au catalogue complet pour découvrir les autres produits disponibles."
          actionHref="/"
          actionLabel="Voir tous les produits"
        />
      ) : null}

      {!loading && !error && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
