export default function HomePage() {
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
              <div className="border border-dashed border-slate-700 rounded-xl p-4 text-xs text-slate-400">
                This is where you&apos;ll choose a base MCU (ESP32, Arduino Uno,
                Raspberry Pi Pico, etc.) and see its core specs.
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 mb-2">
                Components
              </h3>
              <div className="border border-dashed border-slate-700 rounded-xl p-4 space-y-2 text-xs text-slate-400">
                <p>
                  Here you&apos;ll search and add sensors, power modules,
                  communication modules, and actuators to your build.
                </p>
                <p className="text-slate-500">
                  For now this is just a static placeholder. Next iterations
                  will add real data and state.
                </p>
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
