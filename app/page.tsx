"use client";

import { useMemo, useState } from "react";

import { BuildTab } from "./components/BuildTab";
import { PartsTab } from "./components/PartsTab";
import { AppShell, type AppShellTab } from "./components/AppShell";
import { BuildSummaryBar } from "./components/BuildSummaryBar";
import { useCatalog } from "./hooks/useCatalog";
import { evaluateBuild } from "@/lib/validation";
import type { BuildPart, BuildState } from "@/types";
import { getPriceValue } from "@/lib/formatters";

function calculateEstimatedTotal(parts: BuildPart[]) {
  return parts.reduce((total, part) => total + (getPriceValue(part) ?? 0), 0);
}

function SavedTabPlaceholder() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
      Saved builds & favorite parts coming soon.
    </div>
  );
}

function MoreTabPlaceholder() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-slate-50">About BoardBuilder</h2>
        <p className="mt-1 text-slate-400">Mall of eSk8 · Electric longboard prototype</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300 space-y-2">
        <p className="text-sm font-semibold text-slate-100">Roadmap</p>
        <p className="text-slate-400">Filters, saved builds, and shareable links are on the way.</p>
        <a
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-emerald-200 hover:border-emerald-400"
          href="mailto:team@boardbuilder.dev"
        >
          Feedback
        </a>
      </div>
    </div>
  );
}

export default function HomePage() {
  const catalog = useCatalog();
  const [build, setBuild] = useState<BuildState>({});
  const [showDeckComparison, setShowDeckComparison] = useState(false);
  const [activeTab, setActiveTab] = useState<AppShellTab>("build");

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
    [build],
  );

  const estimatedTotal = useMemo(() => calculateEstimatedTotal(selectedParts), [selectedParts]);

  const summaryBar =
    activeTab === "build" ? (
      <BuildSummaryBar build={build} validations={validations} estimatedTotal={estimatedTotal} />
    ) : null;

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab} summaryBar={summaryBar}>
      {activeTab === "build" && (
        <BuildTab
          catalog={catalog}
          build={build}
          setBuild={setBuild}
          validations={validations}
          estimatedTotal={estimatedTotal}
          showDeckComparison={showDeckComparison}
          setShowDeckComparison={setShowDeckComparison}
        />
      )}

      {activeTab === "parts" && <PartsTab catalog={catalog} build={build} />}

      {activeTab === "saved" && <SavedTabPlaceholder />}

      {activeTab === "more" && <MoreTabPlaceholder />}
    </AppShell>
  );
}
