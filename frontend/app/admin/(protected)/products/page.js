"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { deleteAdminProduct, fetchAdminProducts, getErrorMessage } from "@/lib/api";
import { formatCurrency, formatCategory } from "@/lib/format";
import { normalizeProduct } from "@/lib/normalize";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const deferredCategory = useDeferredValue(selectedCategory);
  const deferredMinPrice = useDeferredValue(minPrice);
  const deferredMaxPrice = useDeferredValue(maxPrice);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetchAdminProducts();

        if (!active) {
          return;
        }

        setProducts(response.map(normalizeProduct));
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(getErrorMessage(loadError, "We could not load the product list."));
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

  async function handleDelete(productId) {
    try {
      setDeletingId(productId);
      await deleteAdminProduct(productId);
      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "We could not delete this product."));
    } finally {
      setDeletingId("");
    }
  }

  if (loading) {
    return <LoadingState title="Loading products" description="Fetching products for admin management." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-muted mt-1">Manage your product inventory</p>
          </div>
          <Button href="/admin/products/new">Add Product</Button>
        </div>
      </Card>

      {/* Search and Filter Bar */}
      <Card className="p-4 md:p-6">
        {/* Search Bar with Category, Search Input, Filter and Search Button */}
        <div className="rounded-[1.75rem] border border-line bg-white/90 p-2 shadow-[0_24px_70px_rgba(22,22,22,0.12)] backdrop-blur flex items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="px-3 py-2 min-h-12 rounded-[1.25rem] border border-line bg-white text-foreground outline-none focus:border-accent-strong text-xs sm:text-sm font-semibold"
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
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="min-h-12 flex-1 rounded-[1.25rem] border-0 bg-transparent px-4 text-sm font-semibold text-foreground outline-none placeholder:text-muted"
          />

          {/* Filter Icon Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 min-h-12 rounded-[1.25rem] border border-line hover:bg-white/50 text-foreground font-semibold transition-colors"
            title={showFilters ? "Hide filters" : "Show filters"}
          >
            ⚙️
          </button>

          {/* Search Button */}
          <button
            className="mr-2 px-6 py-2 min-h-12 rounded-[1.25rem] bg-accent-strong hover:bg-accent-strong/90 text-white font-semibold transition-colors text-sm"
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
                <label htmlFor="min-price-admin" className="block text-xs font-semibold text-muted-strong mb-2">
                  Min Price (DA)
                </label>
                <input
                  id="min-price-admin"
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
                <label htmlFor="max-price-admin" className="block text-xs font-semibold text-muted-strong mb-2">
                  Max Price (DA)
                </label>
                <input
                  id="max-price-admin"
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

        {/* Results Info */}
        {hasActiveFilters && (
          <div className="mt-3 text-sm text-muted-strong">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of{" "}
            <span className="font-semibold text-foreground">{products.length}</span> products
          </div>
        )}
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-danger/10 border border-danger/20">
          <p className="text-sm text-danger font-medium">{error}</p>
        </Card>
      )}

      {/* Products Table or Empty State */}
      {filteredProducts.length === 0 && !hasActiveFilters ? (
        <EmptyState
          title="No products yet"
          description="Create your first product to start building the catalog."
          actionHref="/admin/products/new"
          actionLabel="Create product"
        />
      ) : filteredProducts.length === 0 && hasActiveFilters ? (
        <Card className="p-8 text-center">
          <p className="text-muted-strong font-semibold">No products match your filters</p>
          <p className="text-muted text-sm mt-1">Try adjusting your search or filter criteria</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-line">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-strong">Product</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-strong">Reference</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-strong">Category</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-strong">Price</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-strong">Stock</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-strong">Status</th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-strong">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-slate-100 flex-shrink-0">
                          <Image
                            src={
                              product.image ||
                              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80"
                            }
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-foreground font-mono">{product.reference || "-"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-foreground">{formatCategory(product.category)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-sm text-foreground">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-foreground font-medium">{product.stock || 0}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button
                          href={`/admin/products/${product.id}/edit`}
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          variant="danger"
                          size="sm"
                          className="text-xs"
                        >
                          {deletingId === product.id ? "..." : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
