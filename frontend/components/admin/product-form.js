"use client";

import { useState } from "react";
import { FormField } from "@/components/form-field";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const defaultValues = {
  name: "",
  category: "",
  price: "",
  promotionPrice: "",
  reference: "",
  image: "",
  isAvailable: true,
  isNouvellite: false,
  isPromotion: false,
  description: "",
  featured: false,
};

const CATEGORIES = [
  { value: "OUTILLAGE_ELECTRIQUE", label: "Outillage électrique" },
  { value: "OUTILLAGE_SANS_FIL", label: "Outillage sans fil" },
  { value: "OUTILLAGE_A_MAIN", label: "Outillage à main" },
  { value: "PIECE_ACCESSOIRES", label: "Pièces & accessoires" },
  { value: "QUINCAILLERIE_CONSOMMABLES", label: "Quincaillerie & consommables" },
  { value: "ELECTRICITE_LUMIERE", label: "Électricité & lumière" },
  { value: "PLOMBERIE", label: "Plomberie" },
];

export function ProductForm({
  initialValues,
  submitLabel,
  onSubmit,
  submitting,
  errorMessage,
}) {
  const [values, setValues] = useState({
    ...defaultValues,
    ...initialValues,
  });

  const [imageUploading, setImageUploading] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (imageUploading) {
      return;
    }

    const form = new FormData();

    form.append("name", String(values.name || "").trim());
    form.append("category", String(values.category || "").trim());
    form.append("price", String(Number(values.price) || 0));
    form.append("promotionPrice", values.isPromotion ? String(Number(values.promotionPrice) || 0) : "");
    form.append("reference", String(values.reference || "").trim());
    form.append("isAvailable", values.isAvailable ? "true" : "false");
    form.append("isNouvellite", values.isNouvellite ? "true" : "false");
    form.append("isPromotion", values.isPromotion ? "true" : "false");
    form.append("description", String(values.description || "").trim());
    form.append("featured", values.featured ? "true" : "false");

    if (values.image instanceof File) {
      form.append("image", values.image);
    } else if (typeof values.image === "string" && values.image) {
      form.append("imageUrl", values.image);
    }

    await onSubmit(form);
  }

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Nom du produit"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Perceuse sans fil"
            required
          />

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-muted-strong mb-2"
            >
              Catégorie <span className="text-danger">*</span>
            </label>

            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-line bg-white text-foreground outline-none focus:border-accent-strong"
            >
              <option value="">Sélectionnez une catégorie</option>

              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Prix"
            name="price"
            type="number"
            value={values.price}
            onChange={handleChange}
            placeholder="2499"
            required
          />

          {values.isPromotion ? (
            <FormField
              label="Prix promotion"
              name="promotionPrice"
              type="number"
              value={values.promotionPrice}
              onChange={handleChange}
              placeholder="1999"
              required
            />
          ) : null}

          <FormField
            label="Référence (SKU)"
            name="reference"
            value={values.reference}
            onChange={handleChange}
            placeholder="ex : SKU-12345"
            required
          />
        </div>

        <div className="mt-5 space-y-3">
          <label className="flex items-center gap-3 rounded-2xl border border-line bg-white/75 px-4 py-3">
            <input
              type="checkbox"
              name="isAvailable"
              checked={values.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 accent-[var(--accent-strong)]"
            />

            <span className="text-sm font-semibold text-muted-strong">
              Produit disponible
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-line bg-white/75 px-4 py-3">
            <input
              type="checkbox"
              name="isNouvellite"
              checked={values.isNouvellite}
              onChange={handleChange}
              className="h-4 w-4 accent-[var(--accent-strong)]"
            />

            <span className="text-sm font-semibold text-muted-strong">
              Marquer comme nouveauté
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-line bg-white/75 px-4 py-3">
            <input
              type="checkbox"
              name="isPromotion"
              checked={values.isPromotion}
              onChange={handleChange}
              className="h-4 w-4 accent-[var(--accent-strong)]"
            />

            <span className="text-sm font-semibold text-muted-strong">
              Marquer comme promotion
            </span>
          </label>
        </div>

        <div className="mt-5">
          <ImageUpload
            value={values.image}
            disabled={submitting}
            onUploadStateChange={setImageUploading}
            onChange={(fileOrUrl) => {
              setValues((currentValues) => ({
                ...currentValues,
                image: fileOrUrl,
              }));
            }}
          />
        </div>

        <div className="mt-5">
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={values.description}
            onChange={handleChange}
            placeholder="Une description courte et utile du produit."
            required
            rows={6}
          />
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-white/75 px-4 py-3">
          <input
            type="checkbox"
            name="featured"
            checked={values.featured}
            onChange={handleChange}
            className="h-4 w-4 accent-[var(--accent-strong)]"
          />

          <span className="text-sm font-semibold text-muted-strong">
            Marquer comme produit vedette
          </span>
        </label>

        {errorMessage ? (
          <p className="mt-5 text-sm font-medium text-danger">
            {errorMessage}
          </p>
        ) : null}

        {imageUploading ? (
          <p className="mt-5 rounded-2xl bg-yellow-50 px-4 py-3 text-sm font-semibold text-muted-strong">
            Téléchargement de l'image avant l'enregistrement du produit.
          </p>
        ) : null}

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={submitting || imageUploading}
          >
            {imageUploading
              ? "Téléchargement..."
              : submitting
              ? "Enregistrement..."
              : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
