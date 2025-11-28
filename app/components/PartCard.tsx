import type { BuildPart } from "@/types";
import { formatPrice, getPriceInfo } from "@/lib/formatters";

type PartCardProps<T extends BuildPart> = {
  part: T;
  isSelected: boolean;
  onSelect: () => void;
  specChips: string[];
  badges?: React.ReactNode;
};

export function PartCard<T extends BuildPart>({ part, isSelected, onSelect, specChips, badges }: PartCardProps<T>) {
  const { value, currency } = getPriceInfo(part);
  const priceLabel = formatPrice(value, currency) ?? "See vendor";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-left transition",
        isSelected
          ? "border-emerald-400/80 bg-emerald-500/10 shadow-sm shadow-emerald-500/20"
          : "border-slate-800 bg-slate-900/60 hover:border-slate-600",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-slate-400">{part.brand}</div>
          <div className="text-sm font-semibold text-slate-100">{part.name}</div>
        </div>
        <div className="text-right text-sm font-semibold text-emerald-200">{priceLabel}</div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-300">
        {specChips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-slate-800 bg-slate-900/80 px-2 py-0.5"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex flex-wrap gap-1">{badges}</div>
        {isSelected ? (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
            Selected
          </span>
        ) : null}
      </div>
    </button>
  );
}
