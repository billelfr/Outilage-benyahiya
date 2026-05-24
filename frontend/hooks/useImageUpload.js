"use client";

import { useCallback, useRef, useState } from "react";

const MAX_IMAGE_SIZE = 6 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function getFileSignature(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function validateImage(file) {
  if (!file) {
    throw new Error("Choose an image to upload.");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Upload a JPG, PNG, WebP, GIF, or AVIF image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 6MB or smaller.");
  }
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("Could not read the image file.")));
    reader.readAsDataURL(file);
  });
}

export function useImageUpload({ onUploaded } = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedPath, setUploadedPath] = useState("");
  const lastUploadRef = useRef(null);

  const uploadImage = useCallback(
    async (file) => {
      try {
        validateImage(file);

        const signature = getFileSignature(file);

        if (lastUploadRef.current?.signature === signature && lastUploadRef.current?.url) {
          setUploadedUrl(lastUploadRef.current.url);
          setUploadedPath(lastUploadRef.current.path);
          onUploaded?.(lastUploadRef.current.url);
          return lastUploadRef.current;
        }

        setUploading(true);
        setError("");
        setProgress(25);

        const publicUrl = await readAsDataUrl(file);

        if (!publicUrl) {
          throw new Error("Could not prepare the image.");
        }

        setProgress(100);

        const result = { path: signature, url: publicUrl, signature };
        lastUploadRef.current = result;
        setUploadedUrl(publicUrl);
        setUploadedPath(signature);
        onUploaded?.(publicUrl);

        return result;
      } catch (uploadError) {
        const message = uploadError?.message || "Image upload failed.";
        setError(message);
        setProgress(0);
        throw new Error(message);
      } finally {
        setUploading(false);
      }
    },
    [onUploaded],
  );

  const resetUpload = useCallback(() => {
    setProgress(0);
    setError("");
    setUploadedUrl("");
    setUploadedPath("");
    lastUploadRef.current = null;
  }, []);

  return {
    uploadImage,
    resetUpload,
    uploading,
    progress,
    error,
    uploadedUrl,
    uploadedPath,
    maxSize: MAX_IMAGE_SIZE,
    allowedTypes: ALLOWED_IMAGE_TYPES,
  };
}
