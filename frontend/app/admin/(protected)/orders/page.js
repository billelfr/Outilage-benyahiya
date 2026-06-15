"use client";

import { Fragment, useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { fetchOrders, updateOrderStatus } from "@/lib/adminOrders";
import { formatCurrency, formatDate } from "@/lib/format";
import { normalizeOrder } from "@/lib/normalize";
import { Card, SectionHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const response = await fetchOrders();

        if (!active) return;

        setOrders(response.map(normalizeOrder));
        setError("");
      } catch (loadError) {
        if (!active) return;

        setError(loadError.message || "Impossible de charger les commandes.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  async function handleStatusChange(orderId, status) {
    try {
      setUpdatingId(orderId);
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? normalizeOrder(updatedOrder) : order
        )
      );
    } catch (updateError) {
      setError(updateError.message || "Impossible de mettre à jour le statut de la commande.");
    } finally {
      setUpdatingId("");
    }
  }

  if (loading) {
    return (
      <LoadingState
        title="Chargement des commandes"
        description="Récupération des commandes depuis MongoDB."
      />
    );
  }

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => String(order.status).toUpperCase() === statusFilter);

  const statuses = ["ALL", "PENDING", "CONFIRMED", "DELIVERED"];

  const statusLabels = {
    ALL: "Tout",
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    DELIVERED: "Livrée",
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Commandes"
          title="Suivre l'avancement des commandes"
          description="Cliquez sur une ligne de commande pour afficher les instructions de livraison et le détail des articles."
        />
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                statusFilter === status
                  ? "bg-slate-950 text-white"
                  : "border border-line bg-white/75 text-muted-strong hover:bg-white"
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>
        {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}
      </Card>

      {orders.length === 0 ? (
        <EmptyState
          title="Aucune commande pour l'instant"
          description="Les commandes des clients apparaîtront ici dès qu'une commande sera passée depuis le panier."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-3">N° commande</th>
                  <th className="px-2 py-3">Client</th>
                  <th className="px-2 py-3">Téléphone</th>
                  <th className="px-2 py-3">Articles</th>
                  <th className="px-2 py-3">Total</th>
                  <th className="px-2 py-3">Date</th>
                  <th className="px-2 py-3">Statut</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const expanded = selectedOrderId === order.id;

                  return (
                    <Fragment key={order.id}>
                      <tr
                        className="align-top border-t cursor-pointer hover:bg-slate-50"
                        onClick={() => setSelectedOrderId(expanded ? "" : order.id)}
                        role="button"
                      >
                        <td className="px-2 py-3 font-bold break-words">
                          #{order.id}
                        </td>

                        <td className="px-2 py-3 break-words">
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-muted break-all">
                            {order.customerEmail || "Aucun e-mail fourni"}
                          </p>
                          <p className="mt-1 text-xs text-muted break-words">
                            {order.address}
                          </p>
                        </td>

                        <td className="px-2 py-3 break-all">
                          {order.customerPhone || "Aucun téléphone"}
                        </td>

                        <td className="px-2 py-3 text-center">{order.items.length}</td>

                        <td className="px-2 py-3 font-bold whitespace-nowrap">
                          {formatCurrency(order.total)}
                        </td>

                        <td className="px-2 py-3 break-words text-xs">
                          {formatDate(order.createdAt)}
                        </td>

                        <td className="px-2 py-3">
                          <div className="space-y-2">
                            <StatusBadge status={order.status} />
                            <OrderStatusForm
                              value={order.status}
                              updating={updatingId === order.id}
                              onChange={(status) => handleStatusChange(order.id, status)}
                            />
                          </div>
                        </td>
                      </tr>

                      {expanded ? (
                        <tr className="bg-slate-50">
                          <td colSpan={7} className="px-2 py-4">
                            <div className="space-y-6 rounded-2xl border border-line bg-white/90 p-4 shadow-sm">
                              <div className="space-y-2">
                                <p className="text-sm font-semibold">Instructions de livraison</p>
                                <p className="text-sm text-muted">
                                  {order.description || "Aucune description supplémentaire fournie."}
                                </p>
                              </div>

                              <div className="space-y-3">
                                <p className="text-sm font-semibold">Articles</p>
                                <div className="overflow-x-auto rounded-2xl border border-line">
                                  <table className="min-w-full text-sm">
                                    <thead>
                                      <tr>
                                        <th className="px-3 py-2 text-left">Produit</th>
                                        <th className="px-3 py-2 text-center">Qté</th>
                                        <th className="px-3 py-2 text-right">Prix unitaire</th>
                                        <th className="px-3 py-2 text-right">Sous-total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item) => (
                                        <tr key={item.id || item.name} className="border-t border-line">
                                          <td className="px-3 py-2">{item.name}</td>
                                          <td className="px-3 py-2 text-center">{item.quantity}</td>
                                          <td className="px-3 py-2 text-right">
                                            {formatCurrency(item.price)}
                                          </td>
                                          <td className="px-3 py-2 text-right font-semibold">
                                            {formatCurrency(item.price * item.quantity)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="border-t border-line p-8 text-center text-sm text-muted">
              Aucune commande ne correspond à ce filtre.
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}