"use client";

import { Fragment, useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { fetchOrders, updateOrderStatus } from "@/lib/orders";
import { formatCurrency, formatDate } from "@/lib/format";
import { normalizeOrder } from "@/lib/normalize";
import { Card, SectionHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
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

        if (!active) {
          return;
        }

        setOrders(response.map(normalizeOrder));
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message || "We could not load orders.");
      } finally {
        if (active) {
          setLoading(false);
        }
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
        currentOrders.map((order) => (order.id === orderId ? normalizeOrder(updatedOrder) : order)),
      );
    } catch (updateError) {
      setError(updateError.message || "We could not update the order status.");
    } finally {
      setUpdatingId("");
    }
  }

  if (loading) {
    return <LoadingState title="Loading orders" description="Fetching orders from MongoDB." />;
  }

  const filteredOrders =
    statusFilter === "ALL" ? orders : orders.filter((order) => String(order.status).toUpperCase() === statusFilter);
  const statuses = ["ALL", "PENDING", "CONFIRMED", "DELIVERED"];

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <SectionHeader
          eyebrow="Orders"
          title="Track order progress"
          description="Click any order row to reveal delivery instructions and item-level order details."
        />
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${statusFilter === status
                  ? "bg-slate-950 text-white"
                  : "border border-line bg-white/75 text-muted-strong hover:bg-white"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
        {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}
      </Card>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Guest orders will appear here as soon as customers place an order from the cart."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-3">Order ID</th>
                  <th className="px-2 py-3">Customer</th>
                  <th className="px-2 py-3">Phone</th>
                  <th className="px-2 py-3">Items</th>
                  <th className="px-2 py-3">Total</th>
                  <th className="px-2 py-3">Placed</th>
                  <th className="px-2 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const expanded = selectedOrderId === order.id;

                  return (
                    <Fragment key={order.id}>
                      <tr
                        className="align-top border-t cursor-pointer hover:bg-slate-50"
                        onClick={() =>
                          setSelectedOrderId(expanded ? "" : order.id)
                        }
                        role="button"
                      >
                        <td className="px-2 py-3 font-bold break-words">
                          #{order.id}
                        </td>

                        <td className="px-2 py-3 break-words">
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-muted break-all">
                            {order.customerEmail || "No email provided"}
                          </p>
                          <p className="mt-1 text-xs text-muted break-words">
                            {order.address}
                          </p>
                        </td>

                        <td className="px-2 py-3 break-all">
                          {order.customerPhone || "No phone"}
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
                              onChange={(status) =>
                                handleStatusChange(order.id, status)
                              }
                            />
                          </div>
                        </td>
                      </tr>

                      {expanded ? (
                        <tr className="bg-slate-50">
                          <td colSpan={7} className="px-2 py-4">
                            <div className="space-y-6 rounded-2xl border border-line bg-white/90 p-4 shadow-sm">
                              <div className="space-y-2">
                                <p className="text-sm font-semibold">Delivery instructions</p>
                                <p className="text-sm text-muted">
                                  {order.description || "No additional description provided."}
                                </p>
                              </div>

                              <div className="space-y-3">
                                <p className="text-sm font-semibold">Items</p>
                                <div className="overflow-x-auto rounded-2xl border border-line">
                                  <table className="min-w-full text-sm">
                                    <thead>
                                      <tr>
                                        <th className="px-3 py-2 text-left">Product</th>
                                        <th className="px-3 py-2 text-center">Qty</th>
                                        <th className="px-3 py-2 text-right">Unit price</th>
                                        <th className="px-3 py-2 text-right">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item) => (
                                        <tr key={item.id || item.name} className="border-t border-line">
                                          <td className="px-3 py-2">
                                            {item.name}
                                          </td>
                                          <td className="px-3 py-2 text-center">
                                            {item.quantity}
                                          </td>
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
              No orders match this filter.
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}
