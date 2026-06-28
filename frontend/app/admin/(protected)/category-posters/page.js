"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import {
  applyCategoryPosterOverrides,
  readCategoryPosterOverrides,
  writeCategoryPosterOverrides,
} from "@/lib/category-posters";

export default function AdminCategoryPostersPage() {
  const [selectedCategory, setSelectedCategory] = useState(PRODUCT_CATEGORIES[0]?.value || "");
  const [posterOverrides, setPosterOverrides] = useState(() => readCategoryPosterOverrides());
  const [imageUploading, setImageUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const categories = applyCategoryPosterOverrides(PRODUCT_CATEGORIES, posterOverrides);
  const selectedCategoryData = categories.find((category) => category.value === selectedCategory);
  const currentPoster = posterOverrides[selectedCategory] || selectedCategoryData?.image || "";

  function handlePosterChange(fileOrUrl) {
    setSaved(false);
    setPosterOverrides((currentOverrides) => ({
      ...currentOverrides,
      [selectedCategory]: fileOrUrl,
    }));
  }

  function handleResetPoster() {
    setSaved(false);
    setPosterOverrides((currentOverrides) => {
      const nextOverrides = { ...currentOverrides };
      delete nextOverrides[selectedCategory];
      return nextOverrides;
    });
  }

  function handleSave() {
    writeCategoryPosterOverrides(posterOverrides);
    window.dispatchEvent(new Event("category-posters-updated"));
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Posters des catégories</h2>
            <p className="mt-1 text-muted">
              Modifiez l&apos;image utilisée dans le carrousel des catégories de la boutique.
            </p>
          </div>

          <Button onClick={handleSave} disabled={imageUploading}>
            {saved ? "Enregistré" : "Enregistrer"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <label
              htmlFor="category-poster"
              className="mb-2 block text-sm font-semibold text-muted-strong"
            >
              Catégorie
            </label>
            <select
              id="category-poster"
              value={selectedCategory}
              onChange={(event) => {
                setSaved(false);
                setSelectedCategory(event.target.value);
              }}
              className="min-h-12 w-full rounded-xl border border-line bg-white px-4 text-sm font-semibold text-foreground outline-none focus:border-accent-strong"
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {selectedCategoryData ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-slate-100">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={currentPoster}
                    alt={selectedCategoryData.label}
                    fill
                    sizes="(min-width: 1024px) 32vw, 100vw"
                    className="object-cover"
                    unoptimized={currentPoster.startsWith("data:") || currentPoster.startsWith("blob:")}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <ImageUpload
              value={currentPoster}
              disabled={imageUploading}
              onUploadStateChange={setImageUploading}
              onChange={handlePosterChange}
              title="Poster de catégorie"
              emptyLabel="Poster"
              alt="Poster de catégorie sélectionné"
              uploadValue="url"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleResetPoster}
                disabled={imageUploading || !posterOverrides[selectedCategory]}
              >
                Revenir au poster par défaut
              </Button>
              <Button type="button" onClick={handleSave} disabled={imageUploading}>
                {imageUploading ? "Téléchargement..." : "Enregistrer le poster"}
              </Button>
            </div>

            {saved ? (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                Poster enregistré pour cette session de navigateur.
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
