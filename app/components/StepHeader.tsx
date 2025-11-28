import type { ComponentCategory, BuildState } from "@/types";

const BUILD_STEPS: { key: ComponentCategory; label: string }[] = [
  { key: "deck", label: "Deck" },
  { key: "trucks", label: "Trucks" },
  { key: "drive_kit", label: "Drive" },
  { key: "battery", label: "Battery" },
  { key: "esc", label: "ESC" },
  { key: "wheels", label: "Wheels" },
  { key: "remote", label: "Remote" },
];

type StepHeaderProps = {
  activeCategory: ComponentCategory;
  onChange: (category: ComponentCategory) => void;
  build: BuildState;
};

function isCompleted(build: BuildState, category: ComponentCategory) {
  switch (category) {
    case "deck":
      return Boolean(build.selectedDeck);
    case "trucks":
      return Boolean(build.selectedTrucks);
    case "drive_kit":
      return Boolean(build.selectedDriveKit);
    case "battery":
      return Boolean(build.selectedBattery);
    case "esc":
      return Boolean(build.selectedEsc);
    case "wheels":
      return Boolean(build.selectedWheels);
    case "remote":
      return Boolean(build.selectedRemote);
    default:
      return false;
  }
}

export function StepHeader({ activeCategory, onChange, build }: StepHeaderProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {BUILD_STEPS.map((step) => {
        const selected = activeCategory === step.key;
        const completed = isCompleted(build, step.key);
        return (
          <button
            key={step.key}
            type="button"
            onClick={() => onChange(step.key)}
            className={[
              "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs uppercase tracking-wide transition",
              selected
                ? "border-emerald-400/80 bg-emerald-500/10 text-emerald-200 shadow-sm"
                : "border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-500",
            ].join(" ")}
          >
            {completed ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> : null}
            <span>{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
