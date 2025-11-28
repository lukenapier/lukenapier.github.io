import type { BuildState, ValidationResult } from "@/types";
import { formatPrice } from "@/lib/formatters";

type BuildSummaryBarProps = {
  build: BuildState;
  validations: ValidationResult[];
  estimatedTotal: number;
};

export function BuildSummaryBar({ build, validations, estimatedTotal }: BuildSummaryBarProps) {
  const selectedCount = [
    build.selectedDeck,
    build.selectedTrucks,
    build.selectedDriveKit,
    build.selectedBattery,
    build.selectedEsc,
    build.selectedWheels,
    build.selectedRemote,
  ].filter(Boolean).length;

  const totalParts = 7;

  let statusLabel = "All good";
  let statusClass = "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";

  const hasError = validations.some((v) => v.severity === "error");
  const warningCount = validations.filter((v) => v.severity === "warning").length;

  if (hasError) {
    statusLabel = "Issues found";
    statusClass = "bg-red-500/10 text-red-300 border-red-500/40";
  } else if (warningCount > 0) {
    statusLabel = `${warningCount} warning${warningCount > 1 ? "s" : ""}`;
    statusClass = "bg-amber-500/10 text-amber-300 border-amber-500/40";
  }

  return (
    <div className="fixed inset-x-0 bottom-12 z-30 md:bottom-0">
      <div className="mx-auto max-w-3xl px-3">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-xs text-slate-200 shadow-lg shadow-black/40"
        >
          <div className="flex flex-col">
            <span className="font-semibold uppercase tracking-wide text-[10px] text-slate-400">
              Build summary
            </span>
            <span className="mt-0.5 text-[11px] text-slate-200">
              {selectedCount} / {totalParts} parts selected · {formatPrice(estimatedTotal) ?? "$0"}
            </span>
          </div>
          <span
            className={[
              "ml-3 rounded-full border px-2 py-0.5 text-[10px] font-medium",
              statusClass,
            ].join(" ")}
          >
            {statusLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
