"use client";

import { useMemo, useState } from "react";

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
} from "@/types";

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
}: {
  title: string;
  description?: string;
  meta: string[];
  onSelect: () => void;
  isSelected: boolean;
  badge?: string;
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

function formatBoardName(deck?: Deck) {
  if (!deck) return "Custom Electric Longboard";
  return `${deck.name} Build`;
}

export default function HomePage() {
  const catalog = useCatalog();
  const [build, setBuild] = useState<BuildState>({});

  const validations = useMemo(() => evaluateBuild(build), [build]);

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

  const bomEntries = [
    { label: "Deck", item: build.selectedDeck, specs: (deck?: Deck) => deck && `${deck.lengthCm}cm · ${deck.flex} flex` },
    {
      label: "Trucks",
      item: build.selectedTrucks,
      specs: (trucks?: Trucks) =>
        trucks && `${trucks.widthMm}mm · ${trucks.truckType}`,
    },
    {
      label: "Wheels",
      item: build.selectedWheels,
      specs: (wheels?: Wheels) => wheels && `${wheels.diameterMm}mm · ${wheels.hardnessA}A`,
    },
    {
      label: "Battery",
      item: build.selectedBattery,
      specs: (battery?: Battery) =>
        battery && `${battery.capacityWh}Wh · ${battery.voltageClass}`,
    },
    {
      label: "ESC",
      item: build.selectedEsc,
      specs: (esc?: Esc) => esc && `${esc.supportedVoltageClasses.join("/")} · ${esc.maxContinuousCurrentA}A`,
    },
    {
      label: "Drive Kit",
      item: build.selectedDriveKit,
      specs: (driveKit?: DriveKit) =>
        driveKit && `${driveKit.kv}KV · ${driveKit.supportedVoltageClasses.join("/")}`,
    },
    {
      label: "Remote",
      item: build.selectedRemote,
      specs: (remote?: Remote) => remote && `${remote.frequency}`,
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
            Longboard Phase 2
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
                selectedLabel={build.selectedDeck?.name}
              />
              {build.selectedDeck ? (
                <div className="mt-2 text-[11px] text-emerald-200">Selected: {build.selectedDeck.name}</div>
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
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {catalog.decks.map((deck) => (
                  <SelectorCard
                    key={deck.id}
                    title={deck.name}
                    description={deck.notes}
                    meta={[`${deck.lengthCm}cm`, `${deck.mountStyle}`, `${deck.flex} flex`]}
                    onSelect={() => handleDeckSelect(deck)}
                    isSelected={build.selectedDeck?.id === deck.id}
                    badge="Deck"
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader
                title="Trucks"
                subtitle="Dial in your turning style"
                selectedLabel={build.selectedTrucks?.name}
              />
              {build.selectedTrucks ? (
                <div className="mt-2 text-[11px] text-emerald-200">
                  Selected: {build.selectedTrucks.name}
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
                    title={truck.name}
                    description={truck.notes}
                    meta={[`${truck.widthMm}mm`, truck.truckType, `${truck.mountCompatibility.join(" & ")}`]}
                    onSelect={() => handleTrucksSelect(truck)}
                    isSelected={build.selectedTrucks?.id === truck.id}
                    badge="Trucks"
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionHeader
                title="Wheels"
                subtitle="Set your ride feel"
                selectedLabel={build.selectedWheels?.name}
              />
              {build.selectedWheels ? (
                <div className="mt-2 text-[11px] text-emerald-200">
                  Selected: {build.selectedWheels.name}
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
                    title={wheel.name}
                    description={wheel.notes}
                    meta={[`${wheel.diameterMm}mm`, `${wheel.hardnessA}A`, wheel.wheelType]}
                    onSelect={() => handleWheelsSelect(wheel)}
                    isSelected={build.selectedWheels?.id === wheel.id}
                    badge="Wheels"
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
                    title={battery.name}
                    description={battery.notes}
                    meta={[`${battery.capacityWh}Wh`, `${battery.voltageClass}`, `${battery.continuousDischargeA}A`]}
                    onSelect={() => handleBatterySelect(battery)}
                    isSelected={build.selectedBattery?.id === battery.id}
                    badge="Battery"
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
                    title={esc.name}
                    description={esc.notes}
                    meta={[`Supports ${esc.supportedVoltageClasses.join("/")}`, `${esc.maxContinuousCurrentA}A`, esc.motorCount]}
                    onSelect={() => handleEscSelect(esc)}
                    isSelected={build.selectedEsc?.id === esc.id}
                    badge="ESC"
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
                    title={driveKit.name}
                    description={driveKit.notes}
                    meta={[
                      `${driveKit.kv}KV`,
                      `${driveKit.supportedVoltageClasses.join("/")}`,
                      driveKit.profile.replace("_", " "),
                    ]}
                    onSelect={() => handleDriveKitSelect(driveKit)}
                    isSelected={build.selectedDriveKit?.id === driveKit.id}
                    badge="Drive Kit"
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
                selectedLabel={build.selectedRemote?.name}
              />
              {build.selectedRemote ? (
                <div className="mt-2 text-[11px] text-emerald-200">
                  Selected: {build.selectedRemote.name}
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
                    title={remote.name}
                    description={remote.notes}
                    meta={[remote.frequency, ...(remote.compatibleEscFamilies || [])]}
                    onSelect={() => handleRemoteSelect(remote)}
                    isSelected={build.selectedRemote?.id === remote.id}
                    badge="Remote"
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

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner">
            <p className="text-lg font-semibold text-white">{formatBoardName(build.selectedDeck)}</p>
            <p className="text-xs text-slate-400 mt-1">
              Snapshot of your electric longboard configuration.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">Deck</p>
                <p>{build.selectedDeck?.name || "Not selected"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">Trucks</p>
                <p>{build.selectedTrucks?.name || "Not selected"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">Wheels</p>
                <p>{build.selectedWheels?.name || "Not selected"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">Battery</p>
                <p>{build.selectedBattery?.name || "Not selected"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">ESC</p>
                <p>{build.selectedEsc?.name || "Not selected"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">Drive Kit</p>
                <p>{build.selectedDriveKit?.name || "Not selected"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase text-slate-400">Remote</p>
                <p>{build.selectedRemote?.name || "Not selected"}</p>
              </div>
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
              {bomEntries.map(({ label, item, specs }) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3"
                >
                  <div>
                    <p className="text-[11px] uppercase text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-white">{item?.name || "Not selected"}</p>
                    {item?.notes ? <p className="text-[11px] text-slate-400 mt-1">{item.notes}</p> : null}
                  </div>
                  <div className="text-right text-[11px] text-slate-300 min-w-[120px]">
                    {item ? specs(item) : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-3 text-xs text-slate-500 flex items-center justify-between">
        <span>BoardBuilder · Electric longboard prototype</span>
        <span>Next step: expand metrics and compatibility rules.</span>
      </footer>
    </main>
  );
}
