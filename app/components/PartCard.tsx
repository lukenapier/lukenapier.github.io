import Link from "next/link";
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

  const primaryOffer = part.offers?.[0];
  const productUrl = "productUrl" in part && part.productUrl ? part.productUrl : primaryOffer?.productUrl;
  const vendorName = "vendorName" in part && part.vendorName ? part.vendorName : primaryOffer?.vendorName;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  const linkLabel = vendorName ? `View at ${vendorName}` : "View product";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
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

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex flex-wrap gap-1">{badges}</div>
        {isSelected ? (
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
            Selected
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
        {productUrl ? (
          <Link
            href={productUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(event) => event.stopPropagation()}
            className="text-emerald-200 underline underline-offset-4 hover:text-emerald-100"
          >
            {linkLabel}
          </Link>
        ) : (
          <span className="text-slate-500">Vendor link unavailable</span>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1 text-[11px] font-semibold text-slate-100 transition hover:border-emerald-500/50 hover:text-emerald-100"
        >
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}
