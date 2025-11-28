"use client";

import { useEffect, useMemo, useState } from "react";

import { PartCard } from "./PartCard";
import { StepHeader } from "./StepHeader";
import { ComparisonTable, type ComparisonColumn } from "./ComparisonTable";
import type {
  Battery,
  BuildPart,
  BuildState,
  CatalogData,
  ComponentCategory,
  Deck,
  DriveKit,
  Esc,
  Remote,
  Trucks,
  Wheels,
  ValidationResult,
} from "@/types";
import {
  formatBatterySummary,
  formatDeckSummary,
  formatDriveKitSummary,
  formatEscSummary,
  formatRemoteSummary,
  formatTrucksSummary,
  formatWheelsSummary,
  formatPriceDisplay,
  getFlexLabel,
  formatWheelbase,
  getPriceValue,
} from "@/lib/formatters";

const VALIDATION_CLASS: Record<ValidationResult["severity"], string> = {
  error: "border-red-500/40 bg-red-500/10 text-red-200",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-200",
};

type BuildTabProps = {
  catalog: CatalogData;
  build: BuildState;
  setBuild: React.Dispatch<React.SetStateAction<BuildState>>;
  validations: ValidationResult[];
  estimatedTotal: number;
  showDeckComparison: boolean;
  setShowDeckComparison: (value: boolean | ((prev: boolean) => boolean)) => void;
};

export function BuildTab({
  catalog,
  build,
  setBuild,
  validations,
  estimatedTotal,
  showDeckComparison,
  setShowDeckComparison,
}: BuildTabProps) {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>("deck");

  const flexSortValue = (deck: Deck) => {
    if (deck.flex === undefined) return undefined;
    const numeric = Number(deck.flex);
    return Number.isNaN(numeric) ? undefined : numeric;
  };

  const deckComparisonColumns = useMemo<ComparisonColumn<Deck>[]>(
    () => [
      {
        key: "brand",
        label: "Brand",
        render: (deck) => <span className="font-semibold text-slate-100">{deck.brand}</span>,
      },
      { key: "name", label: "Name", render: (deck) => deck.name },
      {
        key: "length",
        label: "Length (cm)",
        sortable: true,
        align: "right",
        getSortValue: (deck) => deck.lengthCm,
        render: (deck) => `${deck.lengthCm.toFixed(1)}`,
      },
      { key: "style", label: "Style", render: (deck) => deck.style },
      {
        key: "flex",
        label: "Flex",
        sortable: true,
        align: "center",
        getSortValue: flexSortValue,
        render: (deck) => getFlexLabel(deck) ?? "—",
      },
      { key: "wheelbase", label: "Wheelbase", render: (deck) => formatWheelbase(deck) ?? "—" },
      {
        key: "weight",
        label: "Weight",
        align: "center",
        render: (deck) => (deck.weightDeckOnlyLb !== undefined ? `${deck.weightDeckOnlyLb.toFixed(1)} lb` : "—"),
      },
      {
        key: "price",
        label: "Price",
        sortable: true,
        align: "right",
        getSortValue: (deck) => getPriceValue(deck),
        render: (deck) => formatPriceDisplay(deck),
      },
    ],
    [],
  );

  const handleSelect = (category: ComponentCategory, part: BuildPart) => {
    switch (category) {
      case "deck":
        setBuild((prev) => ({ ...prev, selectedDeck: part as Deck }));
        break;
      case "trucks":
        setBuild((prev) => ({ ...prev, selectedTrucks: part as Trucks }));
        break;
      case "drive_kit":
        setBuild((prev) => ({ ...prev, selectedDriveKit: part as DriveKit }));
        break;
      case "battery":
        setBuild((prev) => ({ ...prev, selectedBattery: part as Battery }));
        break;
      case "esc":
        setBuild((prev) => ({ ...prev, selectedEsc: part as Esc }));
        break;
      case "wheels":
        setBuild((prev) => ({ ...prev, selectedWheels: part as Wheels }));
        break;
      case "remote":
        setBuild((prev) => ({ ...prev, selectedRemote: part as Remote }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Build</p>
        <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">Build your electric longboard</h1>
        <p className="text-sm text-slate-400">Plan and compare electric longboard builds, part by part.</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
        <StepHeader activeCategory={activeCategory} onChange={setActiveCategory} build={build} />
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="space-y-3">
          <CategoryPartList
            category={activeCategory}
            catalog={catalog}
            build={build}
            onSelect={(part) => handleSelect(activeCategory, part)}
            showDeckComparison={showDeckComparison}
            setShowDeckComparison={setShowDeckComparison}
            deckComparisonColumns={deckComparisonColumns}
          />
        </div>

        <div className="space-y-3 md:sticky md:top-20 md:self-start">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
            <h3 className="text-sm font-semibold text-slate-100">Build status</h3>
            <p className="text-xs text-slate-400">Validation highlights</p>
            <div className="mt-2 space-y-2 text-xs">
              {validations.length === 0 ? (
                <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-200">
                  All good! No issues detected.
                </p>
              ) : (
                validations.map((validation) => (
                  <div
                    key={validation.id}
                    className={`rounded-xl border px-3 py-2 ${VALIDATION_CLASS[validation.severity]}`}
                  >
                    <p className="text-[11px] uppercase tracking-wide">
                      {validation.ruleId.replace(/-/g, " ")}
                    </p>
                    <p className="text-sm font-semibold">{validation.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
            <h3 className="text-sm font-semibold text-slate-100">Estimated total</h3>
            <p className="text-xs text-slate-400">Based on selected parts</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-200">${estimatedTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type CategoryPartListProps = {
  category: ComponentCategory;
  catalog: CatalogData;
  build: BuildState;
  onSelect: (part: BuildPart) => void;
  showDeckComparison: boolean;
  setShowDeckComparison: (value: boolean | ((prev: boolean) => boolean)) => void;
  deckComparisonColumns: ComparisonColumn<Deck>[];
};

function CategoryPartList({
  category,
  catalog,
  build,
  onSelect,
  showDeckComparison,
  setShowDeckComparison,
  deckComparisonColumns,
}: CategoryPartListProps) {
  const selectedId = getSelectedIdForCategory(build, category);
  const { parts, heading, subtitle } = useMemo(() => getCategoryConfig(category, catalog), [category, catalog]);
  const [deckQuery, setDeckQuery] = useState("");
  const [visibleDeckCount, setVisibleDeckCount] = useState(24);
  const [visibleComparisonCount, setVisibleComparisonCount] = useState(40);

  useEffect(() => {
    setDeckQuery("");
    setVisibleDeckCount(24);
    setVisibleComparisonCount(40);
  }, [category, parts.length]);

  const normalizedDeckQuery = deckQuery.trim().toLowerCase();
  const filteredDecks = useMemo(() => {
    if (category !== "deck") return parts;
    if (!normalizedDeckQuery) return parts;

    return (parts as Deck[]).filter((deck) => {
      const haystack = [
        deck.brand,
        deck.name,
        deck.style,
        deck.tags?.join(" ") ?? "",
        deck.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedDeckQuery);
    });
  }, [category, normalizedDeckQuery, parts]);

  const visibleParts = useMemo(() => {
    if (category !== "deck") return filteredDecks;
    return filteredDecks.slice(0, visibleDeckCount);
  }, [category, filteredDecks, visibleDeckCount]);

  const comparisonDecks = useMemo(() => {
    if (category !== "deck") return catalog.decks;
    return filteredDecks.slice(0, visibleComparisonCount) as Deck[];
  }, [category, catalog.decks, filteredDecks, visibleComparisonCount]);

  const hasMoreDeckCards = category === "deck" && filteredDecks.length > visibleDeckCount;
  const hasMoreComparisonRows = category === "deck" && filteredDecks.length > visibleComparisonCount;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{heading}</h2>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
        <span className="text-[11px] text-slate-500">{filteredDecks.length} options</span>
      </div>

      {category === "deck" ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowDeckComparison((v) => !v)}
            className="text-[11px] rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-slate-300 hover:border-slate-500"
          >
            {showDeckComparison ? "Hide deck comparison" : "Compare decks"}
          </button>
          <input
            value={deckQuery}
            onChange={(event) => setDeckQuery(event.target.value)}
            placeholder="Filter decks by name, style, or tag"
            className="text-[11px] w-full max-w-xs rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      ) : null}

      <div className="space-y-3">
        {visibleParts.map((part) => (
          <PartCard
            key={part.id}
            part={part as BuildPart}
            isSelected={part.id === selectedId}
            onSelect={() => onSelect(part as BuildPart)}
            specChips={getSpecChips(category, part as BuildPart)}
            badges={renderBadges(part as BuildPart)}
          />
        ))}
      </div>

      {category === "deck" && hasMoreDeckCards ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleDeckCount((count) => count + 24)}
            className="text-xs rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-100"
          >
            Load more decks
          </button>
        </div>
      ) : null}

      {category === "deck" && showDeckComparison ? (
        <div className="mt-3 space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 overflow-x-auto">
          <ComparisonTable
            items={comparisonDecks}
            columns={deckComparisonColumns}
            highlightedId={build.selectedDeck?.id}
          />
          {hasMoreComparisonRows ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleComparisonCount((count) => count + 40)}
                className="text-xs rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-slate-200 transition hover:border-emerald-500/50 hover:text-emerald-100"
              >
                Load more rows
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
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

function getCategoryConfig(category: ComponentCategory, catalog: CatalogData) {
  switch (category) {
    case "deck":
      return { parts: catalog.decks, heading: "Deck", subtitle: "Choose your platform" };
    case "trucks":
      return { parts: catalog.trucks, heading: "Trucks", subtitle: "Dial in your turning style" };
    case "drive_kit":
      return { parts: catalog.driveKits, heading: "Drive", subtitle: "Pick your drivetrain" };
    case "battery":
      return { parts: catalog.batteries, heading: "Battery", subtitle: "Range and voltage" };
    case "esc":
      return { parts: catalog.escs, heading: "ESC", subtitle: "Power and telemetry" };
    case "wheels":
      return { parts: catalog.wheels, heading: "Wheels", subtitle: "Ride feel and grip" };
    case "remote":
      return { parts: catalog.remotes, heading: "Remote", subtitle: "Control and feedback" };
    default:
      return { parts: [], heading: "Parts", subtitle: "" };
  }
}

function getSpecChips(category: ComponentCategory, part: BuildPart): string[] {
  switch (category) {
    case "deck":
      return formatDeckSummary(part as Deck).split(" · ").filter(Boolean);
    case "trucks":
      return formatTrucksSummary(part as Trucks).split(" · ").filter(Boolean);
    case "drive_kit":
      return formatDriveKitSummary(part as DriveKit).split(" · ").filter(Boolean);
    case "battery":
      return formatBatterySummary(part as Battery).split(" · ").filter(Boolean);
    case "esc":
      return formatEscSummary(part as Esc).split(" · ").filter(Boolean);
    case "wheels":
      return formatWheelsSummary(part as Wheels).split(" · ").filter(Boolean);
    case "remote":
      return formatRemoteSummary(part as Remote).split(" · ").filter(Boolean);
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
