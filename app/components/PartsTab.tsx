"use client";

import { useMemo, useState } from "react";

import { PartCard } from "./PartCard";
import { CategoryGrid } from "./CategoryGrid";
import type { CatalogData, ComponentCategory, BuildState, BuildPart } from "@/types";
import {
  formatBatterySummary,
  formatDeckSummary,
  formatDriveKitSummary,
  formatEscSummary,
  formatRemoteSummary,
  formatTrucksSummary,
  formatWheelsSummary,
} from "@/lib/formatters";

type PartsTabProps = {
  catalog: CatalogData;
  build: BuildState;
};

export function PartsTab({ catalog, build }: PartsTabProps) {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>("deck");

  const parts = useMemo(() => {
    switch (activeCategory) {
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
  }, [activeCategory, catalog]);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-lg font-semibold text-slate-50">Browse parts</h1>
        <span className="text-xs text-slate-400">Mall of eSk8</span>
      </div>

      <CategoryGrid activeCategory={activeCategory} onChange={setActiveCategory} catalog={catalog} />

      <PartsCategoryList
        category={activeCategory}
        parts={parts as BuildPart[]}
        selectedBuildPartId={getSelectedIdForCategory(build, activeCategory)}
        onSelect={() => null}
      />
    </div>
  );
}

type PartsCategoryListProps = {
  category: ComponentCategory;
  parts: BuildPart[];
  selectedBuildPartId?: string;
  onSelect: (part: BuildPart) => void;
};

function PartsCategoryList({ category, parts, selectedBuildPartId, onSelect }: PartsCategoryListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{labelForCategory(category)}</h2>
        <span className="text-[11px] text-slate-500">Showing {parts.length} items</span>
      </div>
      <div className="space-y-3">
        {parts.map((part) => (
          <PartCard
            key={part.id}
            part={part}
            isSelected={part.id === selectedBuildPartId}
            onSelect={() => onSelect(part)}
            specChips={getSpecChips(category, part)}
            badges={renderBadges(part)}
          />
        ))}
      </div>
    </div>
  );
}

function labelForCategory(category: ComponentCategory) {
  switch (category) {
    case "deck":
      return "Decks";
    case "trucks":
      return "Trucks";
    case "drive_kit":
      return "Drive kits";
    case "battery":
      return "Batteries";
    case "esc":
      return "ESCs";
    case "wheels":
      return "Wheels";
    case "remote":
      return "Remotes";
    default:
      return "Parts";
  }
}

function getSelectedIdForCategory(build: BuildState, category: ComponentCategory) {
  switch (category) {
    case "deck":
      return build.selectedDeck?.id;
    case "trucks":
      return build.selectedTrucks?.id;
    case "drive_kit":
      return build.selectedDriveKit?.id;
    case "battery":
      return build.selectedBattery?.id;
    case "esc":
      return build.selectedEsc?.id;
    case "wheels":
      return build.selectedWheels?.id;
    case "remote":
      return build.selectedRemote?.id;
    default:
      return undefined;
  }
}

function getSpecChips(category: ComponentCategory, part: BuildPart): string[] {
  switch (category) {
    case "deck":
      return formatDeckSummary(part as any).split(" · ").filter(Boolean);
    case "trucks":
      return formatTrucksSummary(part as any).split(" · ").filter(Boolean);
    case "drive_kit":
      return formatDriveKitSummary(part as any).split(" · ").filter(Boolean);
    case "battery":
      return formatBatterySummary(part as any).split(" · ").filter(Boolean);
    case "esc":
      return formatEscSummary(part as any).split(" · ").filter(Boolean);
    case "wheels":
      return formatWheelsSummary(part as any).split(" · ").filter(Boolean);
    case "remote":
      return formatRemoteSummary(part as any).split(" · ").filter(Boolean);
    default:
      return [];
  }
}

function renderBadges(part: BuildPart) {
  return part.tags?.map((tag) => (
    <span key={tag} className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 uppercase tracking-wide">
      {tag}
    </span>
  ));
}
