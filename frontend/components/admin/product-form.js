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
  reference: "",
  // `image` may be a File (new upload) or a string URL (existing product)
  image: "",
  stock: "",
  description: "",
  featured: false,
};

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

export function ProductForm({ initialValues, submitLabel, onSubmit, submitting, errorMessage }) {
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

    // Build FormData for multipart/form-data submission.
    const form = new FormData();
    form.append("name", String(values.name || "").trim());
    form.append("category", String(values.category || "").trim());
    form.append("price", String(Number(values.price) || 0));
    form.append("reference", String(values.reference || "").trim());
    form.append("stock", String(Number(values.stock || 0)));
    form.append("description", String(values.description || "").trim());
    form.append("featured", values.featured ? "true" : "false");

    // Image handling: may be a File (new upload) or a string URL (existing image)
    if (values.image instanceof File) {
      form.append("image", values.image);
    } else if (typeof values.image === "string" && values.image) {
      // pass existing image URL so backend keeps it unchanged
      form.append("imageUrl", values.image);
    }

    await onSubmit(form);
  }

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Product name"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Stoneware mug"
            required
          />
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-muted-strong mb-2">
              Category <span className="text-danger">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-line bg-white text-foreground outline-none focus:border-accent-strong"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <FormField
            label="Price"
            name="price"
            type="number"
            value={values.price}
            onChange={handleChange}
            placeholder="24.99"
            required
          />
          <FormField
            label="Reference (SKU)"
            name="reference"
            value={values.reference}
            onChange={handleChange}
            placeholder="e.g., SKU-12345"
            required
          />
          <FormField
            label="Stock"
            name="stock"
            type="number"
            value={values.stock}
            onChange={handleChange}
            placeholder="80"
          />
        </div>

        <div className="mt-5">
          <ImageUpload
            value={values.image}
            disabled={submitting}
            onUploadStateChange={setImageUploading}
            onChange={(fileOrUrl) => {
              // fileOrUrl will be a File when a new image is chosen, or may be a URL string for existing images
              setValues((currentValues) => ({ ...currentValues, image: fileOrUrl }));
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
            placeholder="A short, useful description of the product."
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
          <span className="text-sm font-semibold text-muted-strong">Mark as featured</span>
        </label>

        {errorMessage ? <p className="mt-5 text-sm font-medium text-danger">{errorMessage}</p> : null}
        {imageUploading ? (
          <p className="mt-5 rounded-2xl bg-yellow-50 px-4 py-3 text-sm font-semibold text-muted-strong">
            Uploading image before saving product.
          </p>
        ) : null}

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={submitting || imageUploading}>
            {imageUploading ? "Uploading image..." : submitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
