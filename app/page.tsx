"use client";

import { useCatalog } from "./hooks/useCatalog";

export default function HomePage() {
  const { microcontrollers, components } = useCatalog();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-sm font-bold">
            BB
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">BoardBuilder</h1>
            <p className="text-xs text-slate-400">
              Plan and validate your next electronic board build.
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <button className="hover:text-emerald-300 transition">Demo</button>
          <button className="hover:text-emerald-300 transition">Docs</button>
          <button className="hover:text-emerald-300 transition">About</button>
        </nav>
      </header>

      {/* Main 3-column layout */}
      <section className="flex-1 grid grid-cols-1 xl:grid-cols-[1.1fr,1.2fr,1fr] gap-4 p-4 lg:p-6">
        {/* Left: Configuration */}
        <div className="border border-slate-800 rounded-2xl p-4 lg:p-5 bg-slate-900/40">
          <h2 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide">
            1. Configuration
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 mb-2">
                Microcontroller
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {microcontrollers.map((mcu) => (
                  <div
                    key={mcu.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 shadow-sm hover:border-emerald-500/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">
                          {mcu.name}
                        </p>
                        <p className="text-[11px] text-slate-400">{mcu.id}</p>
                      </div>
                      <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                        {mcu.voltage}V
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
                      <span className="rounded-full bg-slate-800 px-2 py-1">
                        {mcu.gpioCount} GPIO
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-1">
                        {mcu.maxCurrent} mA max
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400 flex flex-wrap gap-1">
                      {mcu.protocols.map((protocol) => (
                        <span
                          key={protocol}
                          className="rounded-full bg-slate-800 px-2 py-1 capitalize"
                        >
                          {protocol}
                        </span>
                      ))}
                    </div>
                    {mcu.notes ? (
                      <p className="mt-2 text-[11px] text-slate-500">{mcu.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 mb-2">
                Components
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {components.map((component) => (
                  <div
                    key={component.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-200 shadow-sm hover:border-sky-400/50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">
                          {component.name}
                        </p>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          {component.category}
                        </p>
                      </div>
                      <span className="rounded-lg bg-slate-800 px-2 py-1 text-[11px] text-slate-200">
                        {component.voltage}V
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {component.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-300">
                      <span className="rounded-full bg-slate-800 px-2 py-1 capitalize">
                        {component.protocol}
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-1">
                        {component.requiredPins} pin{component.requiredPins !== 1 ? "s" : ""}
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-1">
                        ~{component.estimatedCurrent} mA
                      </span>
                      {component.i2cAddress ? (
                        <span className="rounded-full bg-slate-800 px-2 py-1">
                          I2C {component.i2cAddress}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Build Details */}
        <div className="border border-slate-800 rounded-2xl p-4 lg:p-5 bg-slate-900/60">
          <h2 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide">
            2. Build Overview
          </h2>

          <div className="space-y-4 text-sm text-slate-300">
            <p className="text-slate-400 text-xs">
              This panel will show a human-readable summary of your build:
              selected MCU, attached components, and simple wiring hints.
            </p>

            <div className="border border-dashed border-slate-700 rounded-xl p-4 space-y-2">
              <p className="text-xs text-slate-400">
                Example future features:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                <li>Natural language summary of the design</li>
                <li>Simple wiring hints (“Connect sensor X to GPIO Y”)</li>
                <li>Links to datasheets and example code</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Validation & BOM */}
        <div className="border border-slate-800 rounded-2xl p-4 lg:p-5 bg-slate-900/80">
          <h2 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wide">
            3. Validation & BOM
          </h2>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/40">
              <p className="font-semibold text-emerald-300">
                Validation (placeholder)
              </p>
              <p className="mt-1 text-slate-400">
                Here we&apos;ll show voltage compatibility, current draw,
                GPIO pin usage, and bus address conflicts.
              </p>
            </div>

            <div className="border border-slate-800 rounded-lg p-3 bg-slate-950/40">
              <p className="font-semibold text-sky-300">Bill of Materials</p>
              <p className="mt-1 text-slate-400">
                This will list each part in the design with vendor, voltage,
                estimated current, and price links.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-3 text-xs text-slate-500 flex items-center justify-between">
        <span>BoardBuilder · Early prototype</span>
        <span>Next step: hook real component data and validation logic.</span>
      </footer>
    </main>
  );
}
