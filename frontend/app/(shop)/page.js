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
    <div>
      <section className="page-shell relative flex min-h-[calc(100svh-8.75rem)] items-center justify-center py-10 sm:min-h-[calc(100svh-5.25rem)]">
        <div className="w-full max-w-4xl px-4">
          <label htmlFor="home-search" className="sr-only">
            Search products
          </label>
          {/* Search Bar with Category, Search Input, Filter and Search Button */}
          <div className="rounded-[1.75rem] border border-line bg-white/90 p-2 shadow-[0_24px_70px_rgba(22,22,22,0.12)] backdrop-blur flex items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="px-3 py-2 min-h-14 sm:min-h-16 rounded-[1.25rem] border border-line bg-white text-foreground outline-none focus:border-accent-strong text-xs sm:text-sm font-semibold"
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
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  // Search is already filtered in real-time
                }
              }}
              placeholder="Search tools, equipment..."
              className="min-h-14 flex-1 rounded-[1.25rem] border-0 bg-transparent px-4 text-base font-semibold text-foreground outline-none placeholder:text-muted sm:min-h-16 sm:px-6 sm:text-lg"
            />

        

            {/* Search Button */}
            <button
              onClick={() => {
                // Search is already filtered in real-time
              }}
              className="mr-2 px-6 py-3 min-h-14 sm:min-h-16 rounded-[1.25rem] bg-accent-strong hover:bg-accent-strong/90 text-white font-semibold transition-colors"
            >
              Search
            </button>
          </div>

          {/* Price Filter Panel */}
          {showFilters && (
            <div className="rounded-xl border border-line bg-white/90 p-4 space-y-4 backdrop-blur mt-4">
              <p className="text-sm font-semibold text-muted-strong">Price Range</p>
              {/* Price Filter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="min-price" className="block text-sm font-semibold text-muted-strong mb-2">
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
                    className="w-full px-4 py-2 rounded-lg border border-line bg-white text-foreground outline-none focus:border-accent-strong text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="block text-sm font-semibold text-muted-strong mb-2">
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
                    className="w-full px-4 py-2 rounded-lg border border-line bg-white text-foreground outline-none focus:border-accent-strong text-sm"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="pt-2 border-t border-line">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-2 rounded-lg bg-danger/10 hover:bg-danger/20 text-danger font-semibold text-sm transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <a
          href="#catalog"
          className="absolute bottom-5 left-1/2 min-h-11 -translate-x-1/2 px-4 py-3 text-xs font-black uppercase tracking-[0.24em] text-muted-strong hover:text-foreground"
        >
          scroll
        </a>
      </section>

      <section id="catalog" className="page-shell scroll-mt-28 space-y-5 py-8 md:py-12">
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
          <LoadingState title="Loading products" description="Pulling the latest inventory from the API." />
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
