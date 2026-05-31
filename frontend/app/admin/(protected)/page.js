"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/loading-state";
import { fetchAdminProducts, getErrorMessage } from "@/lib/api";
import { fetchOrders } from "@/lib/orders";
import { formatCurrency, formatDate } from "@/lib/format";
import { normalizeOrder, normalizeProduct } from "@/lib/normalize";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [products, orders] = await Promise.all([
          fetchAdminProducts(),
          fetchOrders(),
        ]);

        if (!active) {
          return;
        }

        const normalizedProducts = products.map(normalizeProduct);
        const normalizedOrders = orders.map(normalizeOrder);

        setStats({
          products: normalizedProducts.length,
          orders: normalizedOrders.length,
          pendingOrders: normalizedOrders.filter(
            (order) => String(order.status).toLowerCase() === "pending"
          ).length,
          revenue: normalizedOrders.reduce(
            (sum, order) => sum + order.total,
            0
          ),
          recentOrders: normalizedOrders.slice(0, 5),
        });

        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          getErrorMessage(
            loadError,
            "Nous n'avons pas pu charger le tableau de bord administrateur."
          )
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <LoadingState
        title="Chargement du tableau de bord"
        description="Récupération des statistiques des produits et des commandes."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Vue d'ensemble"
          title="Centre de contrôle de la boutique"
          description="Surveillez le catalogue, le volume des commandes et les revenus depuis une interface claire."
          action={
            <>
              <Button href="/admin/products/new">
                Ajouter un produit
              </Button>

              <Button href="/admin/orders" variant="secondary">
                Voir les commandes
              </Button>
            </>
          }
        />

        {error ? (
          <p className="mt-4 text-sm font-medium text-danger">{error}</p>
        ) : null}
      </Card>

      {stats ? (
        <>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Produits", stats.products],
              ["Commandes", stats.orders],
              ["En attente", stats.pendingOrders],
              ["Revenus", formatCurrency(stats.revenue)],
            ].map(([label, value]) => (
              <Card
                key={label}
                className="p-5 transition duration-300 hover:-translate-y-1"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {label}
                </p>

                <p className="mt-4 text-3xl font-bold tracking-tight">
                  {value}
                </p>
              </Card>
            ))}
          </section>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              <div className="p-6 pb-0 md:p-8 md:pb-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">
                  Commandes récentes
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Dernières commandes du panier
                </h2>
              </div>

              <Link
                href="/admin/orders"
                className="mr-6 mt-6 text-sm font-bold text-accent-strong md:mr-8 md:mt-8"
              >
                Voir toutes les commandes
              </Link>
            </div>

            <div className="mt-6">
              <DataTable
                columns={[
                  "Commande",
                  "Client",
                  "Statut",
                  "Total",
                  "Date",
                ]}
              >
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4 font-bold">
                      #{order.id}
                    </td>

                    <td className="px-5 py-4">
                      {order.customerName}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-5 py-4">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="px-5 py-4">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </DataTable>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}