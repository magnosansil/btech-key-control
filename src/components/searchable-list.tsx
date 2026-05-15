"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ListItem = {
  id: string;
  primary: string;
  secondary: string;
  meta?: string;
};

export function SearchableList({
  items,
  placeholder = "Buscar nome ou identificador…",
  emptyMessage = "Nenhum item encontrado.",
  selectedId,
  onSelect,
  renderAction,
}: {
  items: ListItem[];
  placeholder?: string;
  emptyMessage?: string;
  selectedId?: string;
  onSelect: (id: string) => void;
  renderAction?: (id: string) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.primary.toLowerCase().includes(q) ||
        i.secondary.toLowerCase().includes(q) ||
        i.meta?.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="min-h-12 pl-10 text-base"
          aria-label={placeholder}
        />
      </div>

      <ul className="flex flex-col gap-2" role="listbox">
        {filtered.length === 0 ? (
          <li className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
            {emptyMessage}
          </li>
        ) : (
          filtered.map((item) => {
            const selected = selectedId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition-colors",
                    "min-h-[4.5rem] touch-manipulation",
                    selected
                      ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/30"
                      : "border-border bg-card hover:bg-muted/50",
                  )}
                >
                  <p className="font-semibold leading-snug">{item.primary}</p>
                  <p className="text-muted-foreground">{item.secondary}</p>
                  {item.meta && (
                    <p className="mt-1 text-sm font-medium text-emerald-800">
                      {item.meta}
                    </p>
                  )}
                </button>
                {selected && renderAction?.(item.id)}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
