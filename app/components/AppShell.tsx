import type React from "react";

import { BottomNav } from "./BottomNav";

export type AppShellTab = "build" | "parts" | "saved" | "more";

type AppShellProps = {
  activeTab: AppShellTab;
  onTabChange: (tab: AppShellTab) => void;
  children: React.ReactNode;
  summaryBar?: React.ReactNode;
};

export function AppShell({ activeTab, onTabChange, children, summaryBar }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            BoardBuilder
          </div>
          <div className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
            Mall of eSk8
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="hidden rounded-full border border-slate-800 px-2 py-1 md:inline">Saved</span>
            <span className="hidden rounded-full border border-slate-800 px-2 py-1 md:inline">Info</span>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-12">
        <div className="mx-auto max-w-6xl px-3 py-4 space-y-4 md:py-6">{children}</div>
      </main>

      {summaryBar}

      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
