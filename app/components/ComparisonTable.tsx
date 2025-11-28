"use client";

import { useMemo, useState } from "react";

export type ComparisonColumn<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  getSortValue?: (item: T) => string | number | undefined;
  render: (item: T) => React.ReactNode;
};

export type ComparisonTableProps<T extends { id: string }> = {
  items: T[];
  columns: ComparisonColumn<T>[];
  highlightedId?: string;
};

type SortDirection = "asc" | "desc";

type SortState = {
  key: string;
  direction: SortDirection;
};

export function ComparisonTable<T extends { id: string }>({
  items,
  columns,
  highlightedId,
}: ComparisonTableProps<T>) {
  const firstSortable = columns.find((col) => col.sortable);
  const [sortState, setSortState] = useState<SortState | undefined>(
    firstSortable
      ? {
          key: firstSortable.key,
          direction: "asc",
        }
      : undefined,
  );

  const sortedItems = useMemo(() => {
    if (!sortState) return items;
    const column = columns.find((col) => col.key === sortState.key);
    if (!column) return items;

    const sorted = [...items].sort((a, b) => {
      const aVal = column.getSortValue ? column.getSortValue(a) : undefined;
      const bVal = column.getSortValue ? column.getSortValue(b) : undefined;

      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return aVal - bVal;
      }

      return String(aVal).localeCompare(String(bVal));
    });

    if (sortState.direction === "desc") {
      sorted.reverse();
    }

    return sorted;
  }, [columns, items, sortState]);

  const handleSort = (key: string) => {
    if (!sortState || sortState.key !== key) {
      setSortState({ key, direction: "asc" });
      return;
    }

    setSortState({
      key,
      direction: sortState.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900/60 text-[11px] uppercase tracking-wide text-slate-400">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-semibold ${col.sortable ? "cursor-pointer select-none" : ""}`}
                onClick={() => (col.sortable ? handleSort(col.key) : undefined)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortState?.key === col.key ? (
                    <span className="text-[10px] text-emerald-300">
                      {sortState.direction === "asc" ? "▲" : "▼"}
                    </span>
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr
              key={item.id}
              className={`border-t border-slate-800 text-slate-200 ${
                highlightedId === item.id
                  ? "bg-emerald-500/5"
                  : "hover:bg-slate-900/50"
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
