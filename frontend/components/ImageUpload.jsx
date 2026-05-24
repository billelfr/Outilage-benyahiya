"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";

function formatMegabytes(bytes) {
  return `${Math.round((bytes / 1024 / 1024) * 10) / 10}MB`;
}

function getProgressWidth(progress) {
  if (progress >= 100) {
    return "w-full";
  }

  if (progress >= 75) {
    return "w-3/4";
  }

  if (progress >= 50) {
    return "w-1/2";
  }

  if (progress >= 25) {
    return "w-1/4";
  }

  return "w-1/12";
}

export function ImageUpload({ value, onChange, disabled = false, onUploadStateChange }) {
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [localError, setLocalError] = useState("");
  const { uploadImage, uploading, progress, error, maxSize, allowedTypes } = useImageUpload({
    onUploaded: onChange,
  });

  const helperText = useMemo(
    () => `JPG, PNG, WebP, GIF, or AVIF up to ${formatMegabytes(maxSize)}.`,
    [maxSize],
  );

  useEffect(() => {
    onUploadStateChange?.(uploading);
  }, [onUploadStateChange, uploading]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    setLocalError("");

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return objectUrl;
    });

    try {
      await uploadImage(file);
    } catch (uploadError) {
      setLocalError(uploadError.message);
    } finally {
      event.target.value = "";
    }
  }

  const uploadError = localError || error;
  const accept = allowedTypes.join(",");
  const previewUrl = localPreviewUrl || value;

  return (
    <div className="rounded-2xl border border-line bg-white/75 p-4">
      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Selected product"
              fill
              sizes="180px"
              className="object-cover"
              unoptimized={previewUrl.startsWith("blob:")}
            />
          ) : (
            <div className="grid h-full place-items-center px-6 text-center text-sm font-semibold text-muted">
              Product image
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-muted-strong">Product image</p>
            <p className="mt-1 text-sm leading-6 text-muted">{helperText}</p>
          </div>

          <label className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-60">
            {uploading ? "Uploading..." : "Choose image"}
            <input
              type="file"
              accept={accept}
              disabled={disabled || uploading}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          {uploading ? (
            <div>
              <div className="h-2 overflow-hidden rounded-full bg-yellow-100">
                <div className={`h-full rounded-full bg-accent-strong transition-all ${getProgressWidth(progress)}`} />
              </div>
              <p className="mt-2 text-xs font-semibold text-muted">{progress}% uploaded</p>
            </div>
          ) : null}

          {!uploading && value ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              Image uploaded and ready.
            </p>
          ) : null}

          {uploadError ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-danger">{uploadError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
