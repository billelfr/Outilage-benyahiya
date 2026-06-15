const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/products`;

// Custom helper mirroring your old response structure parsing
function unwrapCollection(data, key) {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.[key])) {
    return data[key];
  }
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  return [];
}

function unwrapEntity(data, key) {
  return data?.[key] || data?.data || data;
}

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

// --- Public API Functions ---

export async function fetchProducts() {
  const res = await fetch(PRODUCTS_ENDPOINT);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || "Failed to fetch products");
    error.response = { data: errorData, status: res.status };
    throw error;
  }

  const data = await res.json();
  return unwrapCollection(data, "products");
}

export async function fetchProduct(reference) {
  const encodedRef = encodeURIComponent(reference);
  const res = await fetch(`${PRODUCTS_ENDPOINT}/${encodedRef}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || "Failed to fetch product");
    error.response = { data: errorData, status: res.status };
    throw error;
  }

  const data = await res.json();
  return unwrapEntity(data, "product");
}