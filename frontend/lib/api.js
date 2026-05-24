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

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

export async function fetchProducts() {
  const { data } = await api.get(PRODUCTS_ENDPOINT);
  return unwrapCollection(data, "products");
}

export async function fetchProduct(id) {
  const { data } = await api.get(`${PRODUCTS_ENDPOINT}/${id}`);
  return unwrapEntity(data, "product");
}

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

export async function createAdminProduct(payload) {
  const { data } = await adminApi.post(PRODUCTS_ENDPOINT, {
    name: payload.name,
    description: payload.description,
    category: payload.category,
    price: payload.price,
    imageUrl: payload.image,
    stock: payload.stock,
  });
  return unwrapEntity(data, "product");
}

export async function updateAdminProduct(id, payload) {
  const { data } = await adminApi.put(`${PRODUCTS_ENDPOINT}/${id}`, {
    name: payload.name,
    description: payload.description,
    category: payload.category,
    price: payload.price,
    imageUrl: payload.image,
    stock: payload.stock,
  });
  return unwrapEntity(data, "product");
}

export async function deleteAdminProduct(id) {
  const { data } = await adminApi.delete(`${PRODUCTS_ENDPOINT}/${id}`);
  return unwrapEntity(data, "product");
}
