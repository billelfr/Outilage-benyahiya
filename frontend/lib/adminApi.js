import axios from "axios";
import { clearAdminToken, getAdminToken } from "@/lib/auth";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
const PRODUCTS_ENDPOINT = "/api/products";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// Interceptor to inject bearer token safely
adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle session expiration (401)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAdminToken();
    }
    return Promise.reject(error);
  },
);

function unwrapCollection(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
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

// --- Admin API Functions ---

export async function loginAdmin(credentials) {
  const { data } = await api.post("/api/admin/login", credentials);

  return {
    token:
      data?.token ||
      data?.accessToken ||
      data?.jwt ||
      data?.data?.token ||
      data?.data?.accessToken ||
      null,
    admin: data?.admin || data?.user || data?.data?.admin || data?.data?.user || null,
  };
}

export async function fetchAdminMe() {
  const { data } = await adminApi.get("/api/admin/me");
  return unwrapEntity(data, "admin");
}

export async function fetchAdminProducts() {
  const { data } = await adminApi.get(PRODUCTS_ENDPOINT);
  return unwrapCollection(data, "products");
}

export async function fetchAdminProduct(reference) {
  const encodedRef = encodeURIComponent(reference);
  const { data } = await adminApi.get(`${PRODUCTS_ENDPOINT}/${encodedRef}`);
  return unwrapEntity(data, "product");
}

export async function createAdminProduct(payload) {
  const form = payload instanceof FormData ? payload : new FormData();

  if (!(payload instanceof FormData)) {
    form.append("name", payload.name);
    form.append("description", payload.description || "");
    form.append("category", payload.category || "");
    form.append("price", payload.price);
    form.append("promotionPrice", payload.promotionPrice || "");
    form.append("isAvailable", payload.isAvailable ?? true);
    form.append("isNouvellite", payload.isNouvellite ?? false);
    form.append("isPromotion", payload.isPromotion ?? false);
    if (Array.isArray(payload.images)) {
      payload.images.forEach((image) => {
        if (image instanceof File) {
          form.append("images", image);
        } else if (typeof image === "string" && image) {
          form.append("imageUrls", image);
        }
      });
    } else if (payload.image) {
      form.append("images", payload.image);
    }
  }

  const { data } = await adminApi.post(PRODUCTS_ENDPOINT, form, {
    headers: { ...adminApi.defaults.headers },
  });
  return unwrapEntity(data, "product");
}

export async function updateAdminProduct(reference, payload) {
  const form = payload instanceof FormData ? payload : new FormData();

  if (!(payload instanceof FormData)) {
    form.append("name", payload.name);
    form.append("description", payload.description || "");
    form.append("category", payload.category || "");
    form.append("price", payload.price);
    form.append("promotionPrice", payload.promotionPrice || "");
    form.append("isAvailable", payload.isAvailable ?? true);
    form.append("isNouvellite", payload.isNouvellite ?? false);
    form.append("isPromotion", payload.isPromotion ?? false);
    if (Array.isArray(payload.images)) {
      payload.images.forEach((image) => {
        if (image instanceof File) {
          form.append("images", image);
        } else if (typeof image === "string" && image) {
          form.append("imageUrls", image);
        }
      });
    } else if (payload.image) {
      form.append("images", payload.image);
    }
  }

  const encodedRef = encodeURIComponent(reference);
  const { data } = await adminApi.put(`${PRODUCTS_ENDPOINT}/${encodedRef}`, form, {
    headers: { ...adminApi.defaults.headers },
  });
  return unwrapEntity(data, "product");
}

export async function deleteAdminProduct(reference) {
  const encodedRef = encodeURIComponent(reference);
  const { data } = await adminApi.delete(`${PRODUCTS_ENDPOINT}/${encodedRef}`);
  return unwrapEntity(data, "product");
}
