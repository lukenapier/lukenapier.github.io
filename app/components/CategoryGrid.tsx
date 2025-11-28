import type { CatalogData, ComponentCategory } from "@/types";

const CATEGORY_CONFIG: { key: ComponentCategory; label: string; icon: string }[] = [
  { key: "deck", label: "Decks", icon: "🛹" },
  { key: "trucks", label: "Trucks", icon: "🛼" },
  { key: "drive_kit", label: "Drive Kits", icon: "🔧" },
  { key: "battery", label: "Batteries", icon: "🔋" },
  { key: "esc", label: "ESCs", icon: "🔌" },
  { key: "wheels", label: "Wheels", icon: "🔬" },
  { key: "remote", label: "Remotes", icon: "🗞" },
];

type CategoryGridProps = {
  activeCategory: ComponentCategory;
  onChange: (category: ComponentCategory) => void;
  catalog: CatalogData;
};

export function CategoryGrid({ activeCategory, onChange, catalog }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
      {CATEGORY_CONFIG.map((category) => {
        const active = activeCategory === category.key;
        const count = getPartsForCategory(category.key, catalog).length;
        return (
          <button
            key={category.key}
            type="button"
            onClick={() => onChange(category.key)}
            className={[
              "flex h-full flex-col justify-between rounded-2xl border px-3 py-3 text-left transition",
              active
                ? "border-emerald-400/80 bg-emerald-500/10 text-emerald-200 shadow"
                : "border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700",
            ].join(" ")}
          >
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{category.label}</span>
              <span aria-hidden>{category.icon}</span>
            </div>
            <span className="mt-2 text-[11px] text-slate-400">{count} items</span>
          </button>
        );
      })}
    </div>
  );
}

function getPartsForCategory(category: ComponentCategory, catalog: CatalogData) {
  switch (category) {
    case "deck":
      return catalog.decks;
    case "trucks":
      return catalog.trucks;
    case "drive_kit":
      return catalog.driveKits;
    case "battery":
      return catalog.batteries;
    case "esc":
      return catalog.escs;
    case "wheels":
      return catalog.wheels;
    case "remote":
      return catalog.remotes;
    default:
      return [];
  }
}
