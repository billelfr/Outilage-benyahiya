"use client";

import { CartProvider } from "@/store/cart";

export function RootProviders({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
