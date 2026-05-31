import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function CartLineItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white/85 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={
              item.image ||
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
            }
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold">{item.name}</h3>

          <p className="text-sm text-muted">{item.category}</p>

          <p className="text-sm font-semibold text-muted-strong">
            {formatCurrency(item.price)} / unité
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end">
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-card px-3 py-2 text-sm">
          <span>Qté</span>

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(event) =>
              onQuantityChange(item.id, Number(event.target.value))
            }
            className="w-16 bg-transparent text-right outline-none"
          />
        </label>

        <p className="min-w-24 text-right font-semibold">
          {formatCurrency(item.price * item.quantity)}
        </p>

        <Button
          onClick={() => onRemove(item.id)}
          variant="danger"
          size="sm"
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
}