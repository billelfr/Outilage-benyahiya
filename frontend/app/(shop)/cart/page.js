"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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

    if (items.length === 0) return;

    const cleanedPhone = formValues.userPhone.replace(/[\s\-\(\)]/g, "");
    if (!DZ_PHONE_REGEX.test(cleanedPhone)) {
      setError("Veuillez entrer un numéro de téléphone algérien valide (ex. : 05XXXXXXXX).");
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
      setError(orderError.message || "Impossible de passer votre commande pour le moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="page-shell py-12">
        <LoadingState
          title="Chargement du panier"
          description="Restauration des articles enregistrés localement."
        />
      </div>
    );
  }

  if (successOrder) {
    return (
      <div className="page-shell py-12">
        <div className="panel rounded-2xl px-6 py-14 text-center">
          <DotLottieReact
            src="/animations/Success.lottie"
            autoplay
            loop={false}
            className="mx-auto mb-5 h-28 w-28 max-w-full"
          />
          <h2 className="text-2xl font-bold tracking-tight">Commande reçue</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
            Nous vous contacterons bientôt pour confirmer votre commande.
          </p>
          <Button href="/" className="mt-6 min-h-12 px-5 text-sm">
            Continuer les achats
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-shell py-12">
        <EmptyState
          title="Votre panier est vide"
          description="Parcourez le catalogue et ajoutez des produits pour passer une commande."
          actionHref="/"
          actionLabel="Commencer les achats"
        />
      </div>
    );
  }

  return (
    <div className="page-shell grid gap-6 py-8 md:py-12 lg:grid-cols-[1fr_380px]">
      <Card className="p-6 md:p-8">
        <div className="border-b border-line pb-6">
          <SectionHeader
            eyebrow="Panier"
            title="Vérifiez vos sélections"
            description="Ajustez les quantités, renseignez vos coordonnées de livraison et passez la commande sans saisir de données de carte bancaire."
            action={
              <Button onClick={clearCart} variant="danger" size="sm">
                Vider le panier
              </Button>
            }
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
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">
          Passer la commande
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Sous-total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Livraison</span>
            <span>Calculée hors ligne</span>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
          <FormField
            label="Nom complet"
            name="userName"
            value={formValues.userName}
            onChange={handleChange}
            placeholder="Mohamed Amine"
            required
          />
          <FormField
            label="Téléphone"
            name="userPhone"
            value={formValues.userPhone}
            onChange={handleChange}
            placeholder="+213xxxxxxxx"
            required
            error={error?.toLowerCase().includes("téléphone") ? error : null}
          />
          <FormField
            label="Adresse"
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
            placeholder="Description de la livraison"
            rows={4}
            required
          />

          <p className="rounded-2xl bg-yellow-50 px-4 py-3 text-xs font-semibold leading-5 text-muted-strong">
            Aucune donnée de carte bancaire n'est collectée. Le paiement est géré en dehors de la plateforme après confirmation par l'administrateur.
          </p>

          {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Commande en cours..." : "Passer la commande"}
          </Button>
        </form>

        <Button href="/" variant="secondary" className="mt-3 w-full">
          Continuer les achats
        </Button>
      </Card>
    </div>
  );
}
