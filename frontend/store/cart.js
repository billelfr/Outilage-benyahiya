"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { normalizeProduct } from "@/lib/normalize";

const STORAGE_KEY = "atelier-market-cart";

const CartContext = createContext(null);

const initialState = {
  hydrated: false,
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return {
        hydrated: true,
        items: Array.isArray(action.payload) ? action.payload : [],
      };
    case "ADD_ITEM": {
      const product = normalizeProduct(action.payload.product);
      const quantity = Math.max(1, Number(action.payload.quantity) || 1);
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            images: product.images,
            category: product.category,
            quantity,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "SET_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, Number(action.payload.quantity) || 1) }
            : item,
        ),
      };
    case "CLEAR":
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const rawCart = window.localStorage.getItem(STORAGE_KEY);
      const parsedCart = rawCart ? JSON.parse(rawCart) : [];
      dispatch({ type: "HYDRATE", payload: parsedCart });
    } catch {
      dispatch({ type: "HYDRATE", payload: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.hydrated, state.items]);

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items: state.items,
    hydrated: state.hydrated,
    subtotal,
    itemCount,
    addItem(product, quantity = 1) {
      dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    },
    removeItem(id) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    },
    updateQuantity(id, quantity) {
      dispatch({ type: "SET_QUANTITY", payload: { id, quantity } });
    },
    clearCart() {
      dispatch({ type: "CLEAR" });
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
