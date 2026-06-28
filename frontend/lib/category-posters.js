"use client";

const CATEGORY_POSTERS_STORAGE_KEY = "si-chrif-category-posters";

export function readCategoryPosterOverrides() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const storedValue = window.localStorage.getItem(CATEGORY_POSTERS_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : {};

    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch {
    return {};
  }
}

export function writeCategoryPosterOverrides(overrides) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    CATEGORY_POSTERS_STORAGE_KEY,
    JSON.stringify(overrides || {}),
  );
}

export function applyCategoryPosterOverrides(categories, overrides) {
  return categories.map((category) => ({
    ...category,
    image: overrides?.[category.value] || category.image,
  }));
}
