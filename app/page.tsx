"use client";

import { useMemo, useState } from "react";

import { ComparisonTable, type ComparisonColumn } from "./components/ComparisonTable";
import { useCatalog } from "./hooks/useCatalog";
import { evaluateBuild } from "@/lib/validation";
import type {
  Battery,
  BuildState,
  Deck,
  DriveKit,
  Esc,
  Remote,
  Trucks,
  Wheels,
  BuildPart,
  Offer,
} from "@/types";

function capitalize(word?: string) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDisplayName(part: BuildPart) {
  return `${part.brand} ${part.name}`;
}

type PriceInfo = { value?: number; currency?: string };

function formatPrice(value?: number, currency = "USD") {
  if (value === undefined) return undefined;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function getPrimaryOffer(part?: BuildPart): Offer | undefined {
  return part?.offers?.[0];
}

function getPriceInfo(part?: BuildPart): PriceInfo {
  if (!part) return {};
  if (part.category === "deck") {
    return { value: part.priceValue, currency: part.priceCurrency };
  }

  const offer = getPrimaryOffer(part);
  return { value: offer?.priceUsd, currency: offer ? "USD" : undefined };
}

function formatNameWithPrice(part?: BuildPart) {
  if (!part) return "Not selected";
  const price = formatPriceDisplay(part);
  return `${formatDisplayName(part)}${price ? ` · ${price}` : ""}`;
}

function getFlexLabel(deck: Deck) {
  if (deck.flex !== undefined) return `Flex ${deck.flex}`;
  return undefined;
}

function formatWheelbase(deck: Deck) {
  if (deck.wheelbaseMinCm && deck.wheelbaseMaxCm) {
    return `${deck.wheelbaseMinCm.toFixed(1)}–${deck.wheelbaseMaxCm.toFixed(1)} cm`;
  }
  if (deck.wheelbaseMinCm) return `${deck.wheelbaseMinCm.toFixed(1)} cm`;
  return undefined;
}

function formatDeckSummary(deck: Deck) {
  const flexLabel = getFlexLabel(deck);
  return [
    `${deck.lengthCm} cm`,
    deck.widthCm ? `${deck.widthCm} cm wide` : undefined,
    deck.style,
    flexLabel,
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatTrucksSummary(trucks: Trucks) {
  return [`${trucks.hangerWidthMm}mm hanger`, `${trucks.baseplateAngleDeg}°`, trucks.type]
    .filter(Boolean)
    .join(" · ");
}

function formatWheelsSummary(wheels: Wheels) {
  return [`${wheels.diameterMm}mm`, `${wheels.durometerA}A`, capitalize(wheels.type)]
    .filter(Boolean)
    .join(" · ");
}

function formatBatterySummary(battery: Battery) {
  return [`${battery.cells}`, `${battery.capacityWh}Wh`, battery.voltageClass]
    .filter(Boolean)
    .join(" · ");
}

function formatEscSummary(esc: Esc) {
  const motorLabel = esc.motorCount === "dual" ? "Dual" : "Single";
  return [
    `Supports ${esc.supportedVoltageClasses.join("/")}`,
    `${motorLabel} motor`,
    `${esc.maxContinuousCurrentA}A max`,
    esc.hasTelemetry ? "Telemetry" : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatDriveKitSummary(driveKit: DriveKit) {
  return [
    `${capitalize(driveKit.driveType)} drive`,
    `${driveKit.kv}KV`,
    `${capitalize(driveKit.characterTag)}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function formatRemoteSummary(remote: Remote) {
  return [
    `ESC: ${remote.escFamilies.join("/")}`,
    remote.hasTelemetry ? "Telemetry" : "No telemetry",
  ]
    .filter(Boolean)
    .join(" · ");
}

function getPriceValue(part?: BuildPart) {
  const { value } = getPriceInfo(part);
  return value;
}

function calculateEstimatedTotal(parts: BuildPart[]) {
  return parts.reduce((total, part) => total + (getPriceValue(part) ?? 0), 0);
}

function formatPriceDisplay(part?: BuildPart) {
  const { value, currency } = getPriceInfo(part);
  return formatPrice(value, currency) ?? "N/A";
}

function getKeySpec(item?: BuildPart) {
  if (!item) return "";
  switch (item.category) {
    case "deck":
      return formatDeckSummary(item);
    case "trucks":
      return formatTrucksSummary(item);
    case "wheels":
      return formatWheelsSummary(item);
    case "battery":
      return formatBatterySummary(item);
    case "esc":
      return formatEscSummary(item);
    case "drive_kit":
      return formatDriveKitSummary(item);
    case "remote":
      return formatRemoteSummary(item);
    default:
      return "";
  }
}

function SectionHeader({
  title,
  subtitle,
  selectedLabel,
}: {
  title: string;
  subtitle: string;
  selectedLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      {selectedLabel ? (
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
          {selectedLabel}
        </span>
      ) : null}
    </div>
  );
}

function SelectorCard({
  title,
  description,
  meta,
  onSelect,
  isSelected,
  badge,
  offer,
}: {
  title: string;
  description?: string;
  meta: string[];
  onSelect: () => void;
  isSelected: boolean;
  badge?: string;
  offer?: Offer;
}) {
  return (
    <div
      className={`rounded-xl border bg-slate-900/70 p-3 text-sm shadow-sm transition ${
        isSelected ? "border-emerald-500/60" : "border-slate-800 hover:border-emerald-500/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          {description ? <p className="text-[11px] text-slate-400">{description}</p> : null}
          <p className="mt-2 text-[11px] text-slate-300">
            {offer?.priceUsd !== undefined ? (
              <span className="font-semibold text-white">{formatPrice(offer.priceUsd)}</span>
            ) : (
              <span className="text-slate-500">Price N/A</span>
            )}
            {offer?.vendorName ? (
              <>
                {" "}·{" "}
                {offer.productUrl ? (
                  <a
                    href={offer.productUrl}
                    target="_blank"
                    className="text-emerald-300 underline-offset-2 hover:text-emerald-200 hover:underline"
                  >
                    {offer.vendorName}
                  </a>
                ) : (
                  offer.vendorName
                )}
              </>
            ) : null}
          </p>
        </div>
        {badge ? (
          <span className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-200">{badge}</span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
        {meta.map((item) => (
          <span key={item} className="rounded-full bg-slate-800 px-2 py-1">
            {item}
          </span>
        ))}
      </div>
      <button
        onClick={onSelect}
        className={`mt-3 w-full rounded-lg px-3 py-2 text-[12px] font-semibold transition ${
          isSelected
            ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/60"
            : "bg-slate-800 text-slate-100 border border-slate-700 hover:border-emerald-400/40"
        }`}
      >
        {isSelected ? "Selected" : "Choose"}
      </button>
    </div>
  );
}

function DeckSelectorCard({
  deck,
  isSelected,
  onSelect,
}: {
  deck: Deck;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const wheelbase = formatWheelbase(deck);
  const weightLabel =
    deck.weightDeckOnlyLb !== undefined ? `~${deck.weightDeckOnlyLb.toFixed(1)} lb deck only` : undefined;
  const flexLabel = getFlexLabel(deck);
  const price = formatPrice(deck.priceValue, deck.priceCurrency);
  const specLine = [
    `${deck.lengthCm.toFixed(0)} cm`,
    deck.style,
    flexLabel,
    deck.widthCm ? `${deck.widthCm.toFixed(1)} cm wide` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition shadow-sm ${
        isSelected
          ? "border-emerald-400/70 bg-emerald-500/5 shadow-emerald-500/10"
          : "border-slate-800 bg-slate-950/60 hover:border-emerald-400/50 hover:bg-slate-900/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">{deck.brand}</p>
          <p className="text-base font-semibold text-white leading-5">{deck.name}</p>
          <p className="text-[12px] text-slate-200">{specLine}</p>
        </div>
        <div className="text-right text-sm font-semibold text-emerald-200">
          {price ?? "Price N/A"}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-200">
        {deck.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-800/80 px-2 py-1 text-[11px] uppercase tracking-wide">
            {tag}
          </span>
        ))}
        {wheelbase ? <span className="rounded-full bg-slate-800/80 px-2 py-1">Wheelbase: {wheelbase}</span> : null}
        {weightLabel ? <span className="rounded-full bg-slate-800/80 px-2 py-1">{weightLabel}</span> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-slate-300">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-white">{price ?? "N/A"}</span>
          <span className="text-slate-400">·</span>
          {deck.productUrl ? (
            <a
              href={deck.productUrl}
              target="_blank"
              className="text-emerald-200 underline-offset-2 hover:text-emerald-100 hover:underline"
            >
              {deck.vendorName}
            </a>
          ) : (
            deck.vendorName
          )}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
            isSelected ? "bg-emerald-500/20 text-emerald-200" : "bg-slate-800 text-slate-200"
          }`}
        >
          {isSelected ? "Selected" : "Tap to compare"}
        </span>
      </div>
    </button>
  );
}

function formatBoardName(deck?: Deck) {
  if (!deck) return "Custom Electric Longboard";
  return `${deck.name} Build`;
}

export default function HomePage() {
  const catalog = useCatalog();
  const [build, setBuild] = useState<BuildState>({});
  const [showDeckComparison, setShowDeckComparison] = useState(false);

  const validations = useMemo(() => evaluateBuild(build), [build]);

  const selectedParts = useMemo(
    () =>
      [
        build.selectedDeck,
        build.selectedTrucks,
        build.selectedWheels,
        build.selectedBattery,
        build.selectedEsc,
        build.selectedDriveKit,
        build.selectedRemote,
      ].filter(Boolean) as BuildPart[],
    [build]
  );

  const estimatedTotal = useMemo(() => calculateEstimatedTotal(selectedParts), [selectedParts]);

  const sharedIntentTags = useMemo(() => {
    const partsWithTags = selectedParts.filter((part) => part.tags && part.tags.length);
    const total = partsWithTags.length;
    if (!total) return undefined;

    const counts = new Map<string, number>();
    partsWithTags.forEach((part) => {
      part.tags?.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
    });

    if (!counts.size) return undefined;

    const max = Math.max(...Array.from(counts.values()));
    if (max < Math.ceil(total * 0.6)) return undefined;

    return Array.from(counts.entries())
      .filter(([, count]) => count === max)
      .map(([tag]) => tag);
  }, [selectedParts]);

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
      {
        key: "name",
        label: "Name",
        render: (deck) => deck.name,
      },
      {
        key: "length",
        label: "Length (cm)",
        sortable: true,
        align: "right",
        getSortValue: (deck) => deck.lengthCm,
        render: (deck) => `${deck.lengthCm.toFixed(1)}`,
      },
      {
        key: "style",
        label: "Style",
        render: (deck) => deck.style,
      },
      {
        key: "flex",
        label: "Flex",
        sortable: true,
        align: "center",
        getSortValue: flexSortValue,
        render: (deck) => getFlexLabel(deck) ?? "—",
      },
      {
        key: "wheelbase",
        label: "Wheelbase",
        render: (deck) => formatWheelbase(deck) ?? "—",
      },
      {
        key: "weight",
        label: "Weight",
        align: "center",
        render: (deck) =>
          deck.weightDeckOnlyLb !== undefined
            ? `${deck.weightDeckOnlyLb.toFixed(1)} lb`
            : "—",
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

  const handleDeckSelect = (deck: Deck) => setBuild((prev) => ({ ...prev, selectedDeck: deck }));
  const handleTrucksSelect = (trucks: Trucks) =>
    setBuild((prev) => ({ ...prev, selectedTrucks: trucks }));
  const handleWheelsSelect = (wheels: Wheels) =>
    setBuild((prev) => ({ ...prev, selectedWheels: wheels }));
  const handleBatterySelect = (battery: Battery) =>
    setBuild((prev) => ({ ...prev, selectedBattery: battery }));
  const handleEscSelect = (esc: Esc) => setBuild((prev) => ({ ...prev, selectedEsc: esc }));
  const handleDriveKitSelect = (driveKit: DriveKit) =>
    setBuild((prev) => ({ ...prev, selectedDriveKit: driveKit }));
  const handleRemoteSelect = (remote: Remote) =>
    setBuild((prev) => ({ ...prev, selectedRemote: remote }));

  const renderVendor = (part?: BuildPart) => {
    if (!part) return "N/A";

    if (part.category === "deck") {
      if (!part.vendorName) return "N/A";
      return part.productUrl ? (
        <a
          href={part.productUrl}
          target="_blank"
          className="text-emerald-200 underline-offset-2 hover:underline"
        >
          {part.vendorName}
        </a>
      ) : (
        part.vendorName
      );
    }

    const offer = getPrimaryOffer(part);
    if (!offer?.vendorName) return "N/A";
    return offer.productUrl ? (
      <a
        href={offer.productUrl}
        target="_blank"
        className="text-emerald-200 underline-offset-2 hover:underline"
      >
        {offer.vendorName}
      </a>
    ) : (
      offer.vendorName
    );
  };

  const bomEntries: Array<{
    label: string;
    item: BuildPart | undefined;
    specs: (item?: BuildPart) => string | undefined;
  }> = [
    {
      label: "Deck",
      item: build.selectedDeck,
      specs: (item?: BuildPart) => (item ? getKeySpec(item) : undefined),
    },
    {
      label: "Trucks",
      item: build.selectedTrucks,
      specs: (item?: BuildPart) => (item ? getKeySpec(item) : undefined),
    },
    {
      label: "Wheels",
      item: build.selectedWheels,
      specs: (item?: BuildPart) => (item ? getKeySpec(item) : undefined),
    },
    {
      label: "Battery",
      item: build.selectedBattery,
      specs: (item?: BuildPart) => (item ? getKeySpec(item) : undefined),
    },
    {
      label: "ESC",
      item: build.selectedEsc,
      specs: (item?: BuildPart) => (item ? getKeySpec(item) : undefined),
    },
    {
      label: "Drive Kit",
      item: build.selectedDriveKit,
      specs: (item?: BuildPart) => (item ? getKeySpec(item) : undefined),
    },
    {
      label: "Remote",
      item: build.selectedRemote,
      specs: (item?: BuildPart) => (item ? getKeySpec(item) : undefined),
    },
  ];

  const overviewEntries: Array<{
    label: string;
    title: string;
    summary: string;
    detail?: string;
  }> = [
    {
      label: "Deck",
      title: formatNameWithPrice(build.selectedDeck),
      summary: build.selectedDeck ? formatDeckSummary(build.selectedDeck) : "Select a deck to view specs",
      detail: build.selectedDeck
        ? [
            formatWheelbase(build.selectedDeck)
              ? `Wheelbase: ${formatWheelbase(build.selectedDeck)}`
              : undefined,
            build.selectedDeck.weightDeckOnlyLb
              ? `~${build.selectedDeck.weightDeckOnlyLb.toFixed(1)} lb deck only`
              : undefined,
          ]
            .filter(Boolean)
            .join(" · ") || undefined
        : undefined,
    },
    {
      label: "Trucks",
      title: formatNameWithPrice(build.selectedTrucks),
      summary: build.selectedTrucks ? formatTrucksSummary(build.selectedTrucks) : "Choose trucks to see stance",
    },
    {
      label: "Wheels",
      title: formatNameWithPrice(build.selectedWheels),
      summary: build.selectedWheels ? formatWheelsSummary(build.selectedWheels) : "Pick wheels to compare diameter",
    },
    {
      label: "Battery",
      title: formatNameWithPrice(build.selectedBattery),
      summary: build.selectedBattery ? formatBatterySummary(build.selectedBattery) : "Select a pack to see Wh and cells",
    },
    {
      label: "ESC",
      title: formatNameWithPrice(build.selectedEsc),
      summary: build.selectedEsc ? formatEscSummary(build.selectedEsc) : "Add an ESC to check voltage support",
    },
    {
      label: "Drive Kit",
      title: formatNameWithPrice(build.selectedDriveKit),
      summary: build.selectedDriveKit ? formatDriveKitSummary(build.selectedDriveKit) : "Pick a drive kit to view KV and type",
    },
    {
      label: "Remote",
      title: formatNameWithPrice(build.selectedRemote),
      summary: build.selectedRemote ? formatRemoteSummary(build.selectedRemote) : "Choose a remote to see controls",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-sm font-bold">
            BB
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">BoardBuilder</h1>
            <p className="text-xs text-slate-400">Design and validate electric longboards.</p>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] text-emerald-200 border border-slate-800">
            BoardBuilder v0.2.0
          </span>
        </nav>
      </header>

      <section className="flex-1 grid grid-cols-1 xl:grid-cols-[1.1fr,1.2fr,1fr] gap-4 p-4 lg:p-6">
        {/* Left: Configuration */}
        <div className="border border-slate-800 rounded-2xl p-4 lg:p-5 bg-slate-900/40 space-y-6">
          <h2 className="text-sm font-semibold text-slate-200 mb-2 uppercase tracking-wide">
            1. Configure Your Board
          </h2>

          <div className="space-y-5">
            <div>
              <SectionHeader
                title="Deck"
                subtitle="Choose your platform"
                selectedLabel={
                  build.selectedDeck ? formatDisplayName(build.selectedDeck) : undefined
                }
              />
              {build.selectedDeck ? (
                <div className="mt-2 text-[11px] text-emerald-200">
                  Selected: {formatDisplayName(build.selectedDeck)}
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-slate-400">Not selected yet</div>
              )}
              {build.selectedDeck ? (
                <button
                  className="mt-2 text-[11px] text-slate-300 underline"
                  onClick={() => setBuild((prev) => ({ ...prev, selectedDeck: undefined }))}
                >
                  Remove deck
                </button>
              ) : null}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {catalog.decks.map((deck) => (
                  <DeckSelectorCard
                    key={deck.id}
                    deck={deck}
                    onSelect={() => handleDeckSelect(deck)}
                    isSelected={build.selectedDeck?.id === deck.id}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-[12px] text-slate-300">Compare specs and pricing across decks.</p>
                <button
                  className="text-[12px] rounded-lg border border-emerald-500/60 px-3 py-1 font-semibold text-emerald-200 hover:bg-emerald-500/10"
                  onClick={() => setShowDeckComparison((prev) => !prev)}
                >
                  {showDeckComparison ? "Hide deck comparison" : "Compare decks"}
                </button>
              </div>

              {showDeckComparison ? (
                <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                  <ComparisonTable
                    items={catalog.decks}
                    columns={deckComparisonColumns}
                    highlightedId={build.selectedDeck?.id}
                  />
                </div>
              ) : null}
            </div>

            <div>
              <SectionHeader
                title="Trucks"
                subtitle="Dial in your turning style"
                selectedLabel={
                  build.selectedTrucks ? formatDisplayName(build.selectedTrucks) : undefined
                }
              />
              {build.selectedTrucks ? (
                <div className="mt-2 text-[11px] text-emerald-200">
                  Selected: {formatDisplayName(build.selectedTrucks)}
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-slate-400">Not selected yet</div>
              )}
              {build.selectedTrucks ? (
                <button
                  className="mt-2 text-[11px] text-slate-300 underline"
                  onClick={() => setBuild((prev) => ({ ...prev, selectedTrucks: undefined }))}
                >
                  Remove trucks
                </button>
              ) : null}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {catalog.trucks.map((truck) => (
                  <SelectorCard
                    key={truck.id}
                    title={formatDisplayName(truck)}
                    description={truck.notes}
                    meta={
                      [
                        `${truck.hangerWidthMm}mm hanger`,
                        `${truck.baseplateAngleDeg}° baseplate`,
                        `${truck.type}`,
                      ].filter(Boolean) as string[]
                    }
                    onSelect={() => handleTrucksSelect(truck)}
                    isSelected={build.selectedTrucks?.id === truck.id}
                    badge="Trucks"
                    offer={getPrimaryOffer(truck)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader
                title="Wheels"
                subtitle="Set your ride feel"
                selectedLabel={
                  build.selectedWheels ? formatDisplayName(build.selectedWheels) : undefined
                }
              />
              {build.selectedWheels ? (
                <div className="mt-2 text-[11px] text-emerald-200">
                  Selected: {formatDisplayName(build.selectedWheels)}
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-slate-400">Not selected yet</div>
              )}
              {build.selectedWheels ? (
                <button
                  className="mt-2 text-[11px] text-slate-300 underline"
                  onClick={() => setBuild((prev) => ({ ...prev, selectedWheels: undefined }))}
                >
                  Remove wheels
                </button>
              ) : null}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {catalog.wheels.map((wheel) => (
                  <SelectorCard
                    key={wheel.id}
                    title={formatDisplayName(wheel)}
                    description={wheel.notes}
                    meta={[
                      `${wheel.diameterMm}mm`,
                      `${wheel.durometerA}A`,
                      wheel.type === "all-terrain" ? "All-terrain" : "Street",
                    ]}
                    onSelect={() => handleWheelsSelect(wheel)}
                    isSelected={build.selectedWheels?.id === wheel.id}
                    badge="Wheels"
                    offer={getPrimaryOffer(wheel)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader
                title="Powertrain"
                subtitle="Battery, ESC, and drive kit"
                selectedLabel={
                  build.selectedBattery || build.selectedEsc || build.selectedDriveKit
                    ? "In progress"
                    : undefined
                }
              />

              <div className="grid gap-3 sm:grid-cols-2">
                {catalog.batteries.map((battery) => (
                  <SelectorCard
                    key={battery.id}
                    title={formatDisplayName(battery)}
                    description={battery.notes}
                    meta={
                      [
                        `${battery.cells}`,
                        `${battery.capacityWh}Wh`,
                        `${battery.voltageClass}`,
                      ].filter(Boolean) as string[]
                    }
                    onSelect={() => handleBatterySelect(battery)}
                    isSelected={build.selectedBattery?.id === battery.id}
                    badge="Battery"
                    offer={getPrimaryOffer(battery)}
                  />
                ))}
              </div>
              {build.selectedBattery ? (
                <button
                  className="text-[11px] text-slate-300 underline"
                  onClick={() => setBuild((prev) => ({ ...prev, selectedBattery: undefined }))}
                >
                  Remove battery
                </button>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                {catalog.escs.map((esc) => (
                  <SelectorCard
                    key={esc.id}
                    title={formatDisplayName(esc)}
                    description={esc.notes}
                    meta={
                      [
                        `Supports ${esc.supportedVoltageClasses.join("/")}`,
                        `${esc.maxContinuousCurrentA}A max`,
                        `${esc.motorCount === "dual" ? "Dual" : "Single"} motor`,
                        esc.hasTelemetry ? "Telemetry" : undefined,
                      ].filter(Boolean) as string[]
                    }
                    onSelect={() => handleEscSelect(esc)}
                    isSelected={build.selectedEsc?.id === esc.id}
                    badge="ESC"
                    offer={getPrimaryOffer(esc)}
                  />
                ))}
              </div>
              {build.selectedEsc ? (
                <button
                  className="text-[11px] text-slate-300 underline"
                  onClick={() => setBuild((prev) => ({ ...prev, selectedEsc: undefined }))}
                >
                  Remove ESC
                </button>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                {catalog.driveKits.map((driveKit) => (
                  <SelectorCard
                    key={driveKit.id}
                    title={formatDisplayName(driveKit)}
                    description={driveKit.notes}
                    meta={
                      [
                        `${capitalize(driveKit.driveType)} drive`,
                        `${driveKit.kv}KV`,
                        `${capitalize(driveKit.characterTag)}`,
                      ] as string[]
                    }
                    onSelect={() => handleDriveKitSelect(driveKit)}
                    isSelected={build.selectedDriveKit?.id === driveKit.id}
                    badge="Drive Kit"
                    offer={getPrimaryOffer(driveKit)}
                  />
                ))}
              </div>
              {build.selectedDriveKit ? (
                <button
                  className="text-[11px] text-slate-300 underline"
                  onClick={() => setBuild((prev) => ({ ...prev, selectedDriveKit: undefined }))}
                >
                  Remove drive kit
                </button>
              ) : null}
            </div>

            <div>
              <SectionHeader
                title="Remote"
                subtitle="Control your ride"
                selectedLabel={
                  build.selectedRemote ? formatDisplayName(build.selectedRemote) : undefined
                }
              />
              {build.selectedRemote ? (
                <div className="mt-2 text-[11px] text-emerald-200">
                  Selected: {formatDisplayName(build.selectedRemote)}
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-slate-400">Not selected yet</div>
              )}
              {build.selectedRemote ? (
                <button
                  className="mt-2 text-[11px] text-slate-300 underline"
                  onClick={() => setBuild((prev) => ({ ...prev, selectedRemote: undefined }))}
                >
                  Remove remote
                </button>
              ) : null}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {catalog.remotes.map((remote) => (
                  <SelectorCard
                    key={remote.id}
                    title={formatDisplayName(remote)}
                    description={remote.notes}
                    meta={
                      [
                        `ESC: ${remote.escFamilies.join("/")}`,
                        remote.hasTelemetry ? "Telemetry" : "No telemetry",
                      ].filter(Boolean) as string[]
                    }
                    onSelect={() => handleRemoteSelect(remote)}
                    isSelected={build.selectedRemote?.id === remote.id}
                    badge="Remote"
                    offer={getPrimaryOffer(remote)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Build Overview */}
        <div className="border border-slate-800 rounded-2xl p-4 lg:p-5 bg-slate-900/60 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-1 uppercase tracking-wide">
            2. Build Overview
          </h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Current Build</p>
                <p className="text-lg font-semibold text-white leading-tight">{formatBoardName(build.selectedDeck)}</p>
                <p className="text-xs text-slate-400">A quick snapshot of your setup, kept in sync as you select parts.</p>
              </div>
              {build.selectedDeck ? (
                <span className="mt-1 inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                  Deck locked in
                </span>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {overviewEntries.map((entry) => (
                <div
                  key={entry.label}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 shadow-sm"
                >
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">{entry.label}</p>
                  <p className="text-sm font-semibold text-white leading-tight">{entry.title}</p>
                  <p className="text-[12px] text-slate-300 mt-1">{entry.summary}</p>
                  {entry.detail ? <p className="text-[11px] text-slate-400 mt-1">{entry.detail}</p> : null}
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Estimated build cost</p>
                <p className="text-2xl font-bold text-emerald-200 mt-1">
                  {formatPrice(estimatedTotal) ?? "$0"}
                </p>
                <p className="text-xs text-slate-400">Updated from all selected parts.</p>
              </div>

              {sharedIntentTags?.length ? (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm text-emerald-100">
                  <p className="text-[11px] uppercase tracking-wide text-emerald-300">Build intent</p>
                  <p className="font-semibold">
                    This build leans toward: {sharedIntentTags.map(capitalize).join(" / ")}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Build intent</p>
                  <p className="text-xs text-slate-400">Add more parts to reveal the common riding style.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 space-y-2">
            <p className="text-xs text-slate-400 uppercase font-semibold">Key Metrics</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
              <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Estimated Top Speed</p>
                <p className="text-lg font-semibold">Coming soon</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-3">
                <p className="text-xs text-slate-400">Estimated Range</p>
                <p className="text-lg font-semibold">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Validation & BOM */}
        <div className="border border-slate-800 rounded-2xl p-4 lg:p-5 bg-slate-900/80 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-1 uppercase tracking-wide">
            3. Checks & Parts List
          </h2>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
            <p className="font-semibold text-emerald-300 text-sm">Compatibility</p>
            {validations.length === 0 ? (
              <p className="text-xs text-slate-400">No warnings yet. Add components to validate.</p>
            ) : (
              <ul className="space-y-2 text-xs text-slate-200">
                {validations.map((validation) => (
                  <li key={validation.id} className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3">
                    <p className="font-semibold text-amber-300">{validation.message}</p>
                    {validation.hint ? <p className="text-slate-200 mt-1">{validation.hint}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="font-semibold text-sky-300 text-sm mb-3">Bill of Materials</p>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="grid grid-cols-[1.1fr,0.9fr,0.6fr] items-center px-2 py-1 text-[11px] uppercase tracking-wide text-slate-400">
                <span>Part</span>
                <span>Vendor</span>
                <span className="text-right">Price</span>
              </div>
              {bomEntries.map(({ label, item, specs }) => (
                <div
                  key={label}
                  className="grid grid-cols-[1.1fr,0.9fr,0.6fr] items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3"
                >
                  <div>
                    <p className="text-[11px] uppercase text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-white">
                      {item ? formatDisplayName(item) : "Not selected"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">{item ? specs(item) : "Choose a part"}</p>
                  </div>
                  <div className="text-[11px] text-slate-200">{renderVendor(item)}</div>
                  <div className="text-right text-[11px] font-semibold text-emerald-200">
                    {item ? formatPriceDisplay(item) : "—"}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[1.1fr,0.9fr,0.6fr] items-center gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm font-semibold text-emerald-100">
                <span>Subtotal</span>
                <span className="text-xs text-emerald-100/80">Selected parts</span>
                <span className="text-right text-base">{formatPrice(estimatedTotal) ?? "$0"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-3 text-xs text-slate-500 flex items-center justify-between">
        <span>BoardBuilder v0.2.0 · Electric longboard prototype</span>
        <span>Next step: expand metrics and compatibility rules.</span>
      </footer>
    </main>
  );
}
