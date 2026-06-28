"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MAX_IMAGES = 6;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function getPreviewUrl(image) {
  return image.previewUrl || image.url || "";
}

function normalizeInitialImages(images = []) {
  return images
    .filter(Boolean)
    .slice(0, MAX_IMAGES)
    .map((image, index) => {
      if (image instanceof File) {
        const previewUrl = URL.createObjectURL(image);

        return {
          id: `${image.name}-${image.size}-${image.lastModified}`,
          url: "",
          previewUrl,
          file: image,
        };
      }

      return {
        id: `existing-${index}-${image}`,
        url: image,
        previewUrl: image,
        file: null,
      };
    });
}

export function MultiImageUpload({ value = [], onChange, disabled = false }) {
  const inputRef = useRef(null);
  const initializedRef = useRef(false);
  const imagesRef = useRef([]);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const canAddMore = images.length < MAX_IMAGES;

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    setImages(normalizeInitialImages(value));
  }, [value]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        if (image.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, []);

  function updateImages(nextImages) {
    setImages(nextImages);
    onChange?.(nextImages.map((image) => image.file || image.url).filter(Boolean));
  }

  function handleFilesChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    setError("");

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;
    const nextFiles = selectedFiles.slice(0, remainingSlots);
    const invalidFile = nextFiles.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));

    if (invalidFile) {
      setError("Utilisez JPG, PNG, WebP, GIF ou AVIF.");
      event.target.value = "";
      return;
    }

    if (selectedFiles.length > remainingSlots) {
      setError(`Maximum ${MAX_IMAGES} images par produit.`);
    }

    const nextImages = [
      ...images,
      ...nextFiles.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        url: "",
        previewUrl: URL.createObjectURL(file),
      })),
    ];

    updateImages(nextImages);
    event.target.value = "";
  }

  function handleRemove(indexToRemove) {
    const removedImage = images[indexToRemove];

    if (removedImage?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(removedImage.previewUrl);
    }

    updateImages(images.filter((image, index) => index !== indexToRemove));
    setError("");
  }

  return (
    <div className="rounded-2xl border border-line bg-white/75 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-muted-strong">Images du produit</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            Ajoutez 1 à {MAX_IMAGES} images. Elles seront affichées dans cet ordre.
          </p>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || !canAddMore}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-60"
        >
          Choisir des images
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          disabled={disabled || !canAddMore}
          onChange={handleFilesChange}
          className="sr-only"
        />
      </div>

      {images.length > 0 ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const previewUrl = getPreviewUrl(image);

            return (
              <div key={image.id} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={previewUrl}
                  alt={`Image produit ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  unoptimized={previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")}
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-slate-950/85 text-base font-black leading-none text-white shadow-sm"
                  aria-label={`Supprimer image ${index + 1}`}
                >
                  x
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-yellow-50 px-4 py-3 text-sm font-semibold text-muted-strong">
          Au moins une image est obligatoire.
        </p>
      )}

      {error ? (
        <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-danger">{error}</p>
      ) : null}
    </div>
  );
}
