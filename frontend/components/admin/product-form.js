"use client";

import { useState } from "react";
import { FormField } from "@/components/form-field";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const defaultValues = {
  name: "",
  category: "",
  price: "",
  promotionPrice: "",
  reference: "",
  images: [],
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
  const isEditing = Boolean(initialValues?.reference);
  const [values, setValues] = useState({
    ...defaultValues,
    ...initialValues,
  });

  const [validationMessage, setValidationMessage] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!Array.isArray(values.images) || values.images.length === 0) {
      setValidationMessage("Ajoutez au moins une image du produit.");
      return;
    }

    setValidationMessage("");

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

    values.images.slice(0, 6).forEach((imageValue) => {
      if (imageValue instanceof File) {
        form.append("images", imageValue);
      } else if (typeof imageValue === "string" && imageValue) {
        form.append("imageUrls", imageValue);
      }
    });

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
            readOnly={isEditing}
            disabled={isEditing}
            helpText={isEditing ? "La référence ne peut pas être modifiée." : undefined}
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
          <MultiImageUpload
            value={values.images}
            disabled={submitting}
            onChange={(images) => {
              setValues((currentValues) => ({
                ...currentValues,
                images,
              }));
              setValidationMessage("");
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

        {validationMessage ? (
          <p className="mt-5 text-sm font-medium text-danger">
            {validationMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 text-sm font-medium text-danger">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Enregistrement..."
              : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
