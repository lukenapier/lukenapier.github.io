import type { AppShellTab } from "./AppShell";

type BottomNavProps = {
  activeTab: AppShellTab;
  onTabChange: (tab: AppShellTab) => void;
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const items = [
    { key: "build", label: "Build", icon: "🛠" },
    { key: "parts", label: "Parts", icon: "🤌" },
    { key: "saved", label: "Saved", icon: "🔖" },
    { key: "more", label: "More", icon: "☰" },
  ] as const satisfies { key: AppShellTab; label: string; icon: string }[];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2 text-[11px]">
        {items.map((item) => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange(item.key)}
              className={[
                "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition",
                active ? "text-emerald-300" : "text-slate-400 hover:text-slate-200",
              ].join(" ")}
            >
              <span className="text-lg" aria-hidden>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
