"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ProductCard } from "@/components/product-card";
import { fetchProducts, getErrorMessage } from "@/lib/api";
import { normalizeProduct } from "@/lib/normalize";
import { SectionHeader } from "@/components/ui/card";

const CATEGORIES = [
  { value: "OUTILLAGE_ELECTRIQUE", label: "Outillage électrique" },
  { value: "OUTILLAGE_SANS_FIL", label: "Outillage sans fil" },
  { value: "OUTILLAGE_A_MAIN", label: "Outillage à main" },
  { value: "PIECE_ACCESSOIRES", label: "Pièce & accessoires" },
  { value: "QUINCAILLERIE_CONSOMMABLES", label: "Quincaillerie & consommables" },
  { value: "ELECTRICITE_LUMIERE", label: "Électricité & lumière" },
  { value: "PLOMBERIE", label: "Plomberie" },
  { value: "NOUVEAUTE", label: "Nouveauté" },
  { value: "PROMOTION", label: "Promotion" },
];

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

        if (!active) {
          return;
        }

        setProducts(response.map(normalizeProduct));
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(getErrorMessage(loadError, "We could not load products right now."));
      } finally {
        if (active) {
          setLoading(false);
        }
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

    // Search filter
    if (query) {
      const searchFields = [product.name, product.category, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchFields.includes(query)) {
        return false;
      }
    }

    // Category filter
    if (deferredCategory && product.category !== deferredCategory) {
      return false;
    }

    // Price filter
    if (product.price < minPriceNum || product.price > maxPriceNum) {
      return false;
    }

    return true;
  });

  const hasActiveFilters = deferredSearch || deferredCategory || deferredMinPrice || deferredMaxPrice;

  function handleClearFilters() {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <div className="w-full overflow-x-hidden">
  <section className="page-shell relative flex min-h-[calc(100svh-6rem)] items-center justify-center py-6 sm:py-10">
    <div className="w-full max-w-4xl px-4">
      <label htmlFor="home-search" className="sr-only">
        Search products
      </label>

      {/* Search Bar */}
      <div className="flex flex-col gap-3 rounded-3xl border border-line bg-white/90 p-3 shadow-[0_24px_70px_rgba(22,22,22,0.12)] backdrop-blur md:flex-row md:items-center">
        
        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="
            w-full
            rounded-2xl
            border
            border-line
            bg-white
            px-4
            py-3
            text-sm
            font-semibold
            text-foreground
            outline-none
            focus:border-accent-strong
            md:w-auto
            md:min-w-[180px]
          "
        >
          <option value="">Category</option>

          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <input
          id="home-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tools, equipment..."
          className="
            w-full
            flex-1
            rounded-2xl
            bg-transparent
            px-4
            py-3
            text-sm
            font-semibold
            text-foreground
            outline-none
            placeholder:text-muted
            md:text-base
          "
        />

        {/* Search Button */}
        <button
          onClick={() => {}}
          className="
            w-full
            rounded-2xl
            bg-accent-strong
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition-colors
            hover:bg-accent-strong/90
            md:w-auto
          "
        >
          Search
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 space-y-4 rounded-2xl border border-line bg-white/90 p-4 backdrop-blur">
          <p className="text-sm font-semibold text-muted-strong">
            Price Range
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="min-price"
                className="mb-2 block text-sm font-semibold text-muted-strong"
              >
                Min Price (DA)
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
                  w-full
                  rounded-xl
                  border
                  border-line
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-foreground
                  outline-none
                  focus:border-accent-strong
                "
              />
            </div>

            <div>
              <label
                htmlFor="max-price"
                className="mb-2 block text-sm font-semibold text-muted-strong"
              >
                Max Price (DA)
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
                  w-full
                  rounded-xl
                  border
                  border-line
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-foreground
                  outline-none
                  focus:border-accent-strong
                "
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="border-t border-line pt-2">
              <button
                onClick={handleClearFilters}
                className="
                  w-full
                  rounded-xl
                  bg-danger/10
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-danger
                  transition-colors
                  hover:bg-danger/20
                "
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Scroll Indicator */}
    <a
      href="#catalog"
      className="
        absolute
        bottom-4
        left-1/2
        hidden
        -translate-x-1/2
        px-4
        py-3
        text-[10px]
        font-black
        uppercase
        tracking-[0.24em]
        text-muted-strong
        hover:text-foreground
        sm:block
      "
    >
      scroll
    </a>
  </section>

  {/* Catalog */}
  <section
    id="catalog"
    className="page-shell scroll-mt-28 space-y-5 py-8 md:py-12"
  >
    <SectionHeader
      eyebrow="Products"
      title={hasActiveFilters ? "Search results" : "All products"}
      description={
        hasActiveFilters
          ? `Showing ${filteredProducts.length} matching products.`
          : `Browse all ${products.length} products in stock.`
      }
    />

    {loading ? (
      <LoadingState
        title="Loading products"
        description="Pulling the latest inventory from the API."
      />
    ) : null}

    {!loading && error ? (
      <EmptyState
        title="We could not load the catalog"
        description={error}
        actionHref="/"
        actionLabel="Refresh page"
      />
    ) : null}

    {!loading && !error && filteredProducts.length === 0 ? (
      <EmptyState
        title="No products matched your search"
        description="Try a different keyword or adjust the filters to see the full catalog."
        actionHref="/"
        actionLabel="Clear filters"
      />
    ) : null}

    {!loading && !error && filteredProducts.length > 0 ? (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    ) : null}
  </section>
</div>
  );
}
