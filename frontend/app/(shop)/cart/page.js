"use client";

import { useState } from "react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { EmptyState } from "@/components/empty-state";
import { FormField } from "@/components/form-field";
import { LoadingState } from "@/components/loading-state";
import { formatCurrency } from "@/lib/format";
import { createOrder } from "@/lib/orders";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";

const initialOrderForm = {
  userName: "",
  userEmail: "",
  userPhone: "",
  location: "Alger",
  address: "",
  description: "",
};

const DZ_PHONE_REGEX = /^(0|\+213|213)([567]\d{8}|[234]\d{7,8})$/;

const deliveryLocations = ["Alger", "Blida", "Tipaza", "Boumerdes"];

export default function CartPage() {
  const { hydrated, items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [formValues, setFormValues] = useState(initialOrderForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  async function handlePlaceOrder(event) {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    const cleanedPhone = formValues.userPhone.replace(/[\s\-\(\)]/g, "");
    if (!DZ_PHONE_REGEX.test(cleanedPhone)) {
      setError("Please enter a valid Algerian phone number (e.g., 05XXXXXXXX).");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const order = await createOrder({
        user_name: formValues.userName,
        user_email: formValues.userEmail,
        user_phone: formValues.userPhone,
        address: `${formValues.location} - ${formValues.address}`,
        description: formValues.description || "",
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total_price: subtotal,
      });

      setSuccessOrder(order);
      setFormValues(initialOrderForm);
      clearCart();
    } catch (orderError) {
      setError(orderError.message || "We could not place your order right now.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="page-shell py-12">
        <LoadingState title="Loading cart" description="Restoring your locally stored cart items." />
      </div>
    );
  }

  if (successOrder) {
    return (
      <div className="page-shell py-12">
        <EmptyState
          title="Order received"
          description={`Your order #${successOrder.id} is pending confirmation. The admin team has been notified on Telegram.`}
          actionHref="/"
          actionLabel="Continue shopping"
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-shell py-12">
        <EmptyState
          title="Your cart is empty"
          description="Browse the catalog and add a few products to start a guest order."
          actionHref="/"
          actionLabel="Start shopping"
        />
      </div>
    );
  }

  return (
    <div className="page-shell grid gap-6 py-8 md:py-12 lg:grid-cols-[1fr_380px]">
      <Card className="p-6 md:p-8">
        <div className="border-b border-line pb-6">
          <SectionHeader
            eyebrow="Cart"
            title="Review your selections"
            description="Adjust quantities, add your delivery details, and place the order without entering payment card data."
            action={<Button onClick={clearCart} variant="danger" size="sm">Clear cart</Button>}
          />
        </div>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      </Card>

      <Card className="h-fit p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">Place order</p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Shipping</span>
            <span>Calculated offline</span>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
          <FormField
            label="Full name"
            name="userName"
            value={formValues.userName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <FormField
            label="Phone"
            name="userPhone"
            value={formValues.userPhone}
            onChange={handleChange}
            placeholder="+213xxxxxxxx"
            required
            error={error?.toLowerCase().includes("phone") ? error : null}
          />
          <FormField
            label="Address"
            name="address"
            placeholder="Blida"
            value={formValues.address}
            onChange={handleChange}
            required
          >
            {deliveryLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </FormField>
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Delivery description"
            rows={4}
            required
          />

          <p className="rounded-2xl bg-yellow-50 px-4 py-3 text-xs font-semibold leading-5 text-muted-strong">
            No credit card details are collected. Payment is handled externally after admin confirmation.
          </p>

          {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Placing order..." : "Place Order"}
          </Button>
        </form>
        <Button href="/" variant="secondary" className="mt-3 w-full">Keep shopping</Button>
      </Card>
    </div>
  );
}
