"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ProductCard } from "@/components/product-card";
import { fetchProducts, getErrorMessage } from "@/lib/publicApi";
import { normalizeProduct } from "@/lib/normalize";
import { PRODUCT_CATEGORIES, productMatchesCategory } from "@/lib/product-categories";
import { SectionHeader } from "@/components/ui/card";

const CATEGORIES = PRODUCT_CATEGORIES;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const deferredCategory = useDeferredValue(selectedCategory);
  const deferredMinPrice = useDeferredValue(minPrice);
  const deferredMaxPrice = useDeferredValue(maxPrice);

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

  const filteredProducts = products.filter((product) => {
    const query = deferredSearch.trim().toLowerCase();
    const minPriceNum = deferredMinPrice ? parseFloat(deferredMinPrice) : 0;
    const maxPriceNum = deferredMaxPrice ? parseFloat(deferredMaxPrice) : Infinity;

    if (query) {
      const searchFields = [product.name, product.category, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchFields.includes(query)) return false;
    }

    if (deferredCategory && !productMatchesCategory(product, deferredCategory)) {
      return false;
    }

    if (product.price < minPriceNum || product.price > maxPriceNum) return false;

    return true;
  });

  const hasActiveFilters = deferredSearch || deferredCategory || deferredMinPrice || deferredMaxPrice;

  function handleClearFilters() {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
  }

  function getCategoryCount(categoryValue) {
    return products.filter((product) => productMatchesCategory(product, categoryValue)).length;
  }

  return (
    <div className="w-full overflow-x-hidden">
      <section className="page-shell space-y-5 py-6 md:py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Catégories"
            title="Choisissez votre rayon"
            description="Parcourez les familles de produits et ouvrez un catalogue filtré par catégorie."
          />

          <p className="hidden rounded-full border border-line bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-muted-strong shadow-sm md:block">
            Glisser pour voir
          </p>
        </div>

        <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PRODUCT_CATEGORIES.map((category) => (
            <Link
              key={category.value}
              href={`/categories/${category.value}`}
              className="group relative h-56 w-[78vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-slate-100 shadow-[0_18px_45px_rgba(22,22,22,0.10)] outline-none transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(22,22,22,0.14)] focus-visible:ring-4 focus-visible:ring-yellow-200 sm:w-80"
            >
              <Image
                src={category.image}
                alt={category.label}
                fill
                priority
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 640px) 320px, 78vw"
                className="object-cover transition duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-slate-950 shadow-sm backdrop-blur">
                {getCategoryCount(category.value)} produit(s)
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="max-w-[15rem] text-xl font-black leading-tight tracking-tight">
                  {category.label}
                </p>
                <span className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-accent-strong px-4 text-sm font-black text-slate-950 shadow-sm transition group-hover:bg-[#eab308]">
                  Voir la catégorie
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell relative flex items-center justify-center py-6 sm:py-8">
        <div className="w-full max-w-4xl px-4">
          <label htmlFor="home-search" className="sr-only">
            Rechercher des produits
          </label>

          {/* Barre de recherche */}
          <div className="flex flex-col gap-3 rounded-3xl border border-line bg-white/90 p-3 shadow-[0_24px_70px_rgba(22,22,22,0.12)] backdrop-blur md:flex-row md:items-center">

            {/* Catégorie */}
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="
                w-full rounded-2xl border border-line bg-white px-4 py-3
                text-sm font-semibold text-foreground outline-none
                focus:border-accent-strong md:w-auto md:min-w-[180px]
              "
            >
              <option value="">Catégorie</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Champ de recherche */}
            <input
              id="home-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher outils, équipements..."
              className="
                w-full flex-1 rounded-2xl bg-transparent px-4 py-3
                text-sm font-semibold text-foreground outline-none
                placeholder:text-muted md:text-base
              "
            />

            {/* Bouton rechercher */}
            <button
              onClick={() => {}}
              className="
                w-full rounded-2xl bg-accent-strong px-5 py-3 text-sm
                font-semibold text-white transition-colors
                hover:bg-accent-strong/90 md:w-auto
              "
            >
              Rechercher
            </button>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="mt-4 space-y-4 rounded-2xl border border-line bg-white/90 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-muted-strong">
                Fourchette de prix
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="min-price"
                    className="mb-2 block text-sm font-semibold text-muted-strong"
                  >
                    Prix minimum (DA)
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    step="100"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="0"
                    className="
                      w-full rounded-xl border border-line bg-white px-4 py-3
                      text-sm text-foreground outline-none focus:border-accent-strong
                    "
                  />
                </div>

                <div>
                  <label
                    htmlFor="max-price"
                    className="mb-2 block text-sm font-semibold text-muted-strong"
                  >
                    Prix maximum (DA)
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    step="100"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="∞"
                    className="
                      w-full rounded-xl border border-line bg-white px-4 py-3
                      text-sm text-foreground outline-none focus:border-accent-strong
                    "
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="border-t border-line pt-2">
                  <button
                    onClick={handleClearFilters}
                    className="
                      w-full rounded-xl bg-danger/10 px-4 py-3 text-sm
                      font-semibold text-danger transition-colors hover:bg-danger/20
                    "
                  >
                    Effacer les filtres
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </section>

      {/* Catalogue */}
      <section
        id="catalog"
        className="page-shell scroll-mt-28 space-y-5 py-8 md:py-12"
      >
        <SectionHeader
          eyebrow="Produits"
          title={hasActiveFilters ? "Résultats de recherche" : "Tous les produits"}
          description={
            hasActiveFilters
              ? `${filteredProducts.length} produit(s) trouvé(s).`
              : `Parcourez les ${products.length} produits disponibles en stock.`
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
            actionLabel="Actualiser la page"
          />
        ) : null}

        {!loading && !error && filteredProducts.length === 0 ? (
          <EmptyState
            title="Aucun produit ne correspond à votre recherche"
            description="Essayez un autre mot-clé ou ajustez les filtres pour voir le catalogue complet."
            actionHref="/"
            actionLabel="Effacer les filtres"
          />
        ) : null}

        {!loading && !error && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priorityImage={index === 0} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
