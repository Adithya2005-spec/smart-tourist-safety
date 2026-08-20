import { EdgeConnectivity, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { allIndianStates } from "@/lib/india-safety-data";
import {
  Globe2,
  HardDriveDownload,
  MapPin,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  User,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";

export default function TouristSettings() {
  const {
    online,
    language,
    setLanguage,
    pendingSyncCount,
    zones,
    contacts,
    activeStateId,
    activeState,
    setActiveState,
    userSession,
  } = useSafety();

  const { theme, toggleTheme } = useTheme();

  return (
    <SafetyShell eyebrow="Traveller workspace" title="Safety settings">
      <div className="mx-auto max-w-4xl space-y-5">
        {/* User Session & Travel Territory */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400 dark:text-slate-500">
                  Active Tourist Profile
                </p>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                  {userSession.fullName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Digital ID: <strong className="text-cyan-700 dark:text-cyan-400">{userSession.digitalId}</strong> · {userSession.email}
                </p>
              </div>
            </div>

            {/* Active State Dropdown */}
            <div className="w-full sm:w-auto">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Active State / Territory
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1.5">
                <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400 ml-1.5" />
                <select
                  value={activeStateId}
                  onChange={(e) => {
                    setActiveState(e.target.value);
                    const st = allIndianStates.find((s) => s.id === e.target.value);
                    toast.success(`Active State changed to ${st?.name}!`);
                  }}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none pr-2"
                >
                  {allIndianStates.map((st) => (
                    <option key={st.id} value={st.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Edge Connectivity Simulator */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
              <WifiOff className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                Edge connectivity simulator
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                {online ? "Connected safety mode" : "Offline safety mode"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                The edge layer retains cached risk zones, your latest risk state, contacts, and a local SOS queue. Cloud coordination, command-centre response, and data synchronization occur when online.
              </p>
              <div className="mt-5">
                <EdgeConnectivity />
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Settings */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Appearance / Theme Mode Section */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Palette className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                  Appearance / Mode
                </p>
              </div>
              <ThemeToggle showLabel />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Current mode is <strong className="capitalize">{theme} mode</strong>. Toggle between clean light mode and high-contrast night safety dark mode.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (theme !== "light" && toggleTheme) toggleTheme();
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  theme === "light"
                    ? "border-cyan-500 bg-cyan-50 text-cyan-900 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                Light Mode
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== "dark" && toggleTheme) toggleTheme();
                }}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  theme === "dark"
                    ? "border-cyan-500 bg-cyan-950/60 text-cyan-300 shadow-sm ring-1 ring-cyan-500/30"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Moon className="h-4 w-4 text-cyan-400" />
                Dark Mode
              </button>
            </div>
          </section>

          {/* Language Selection */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <Globe2 className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
              Language / भाषा
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Select your preferred traveller interface language.
            </p>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as typeof language)}
              className="mt-4 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-cyan-600/20"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी / Hindi</option>
              <option value="kn">ಕನ್ನಡ / Kannada</option>
            </select>
          </section>
        </div>

        {/* Cached local assets */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <HardDriveDownload className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
            Cached Local Edge Assets ({activeState.name})
          </p>
          <div className="mt-4 space-y-3">
            <State label={`Risk zones in ${activeState.name}`} value={`${zones.length} cached`} />
            <State label="Active emergency contacts" value={`${contacts.length} stored`} />
            <State label="Pending SOS queue" value={`${pendingSyncCount} waiting`} />
          </div>
        </section>

        <SafetyNotice tone="slate">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <p>
              <strong>Security posture:</strong> production safety data uses authenticated, role-authorized transport and server-side cryptographic audit verification. Local state allows demonstrability in offline and remote terrain across all Indian states.
            </p>
          </div>
        </SafetyNotice>
      </div>
    </SafetyShell>
  );
}

function State({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-slate-600 dark:text-slate-300">
        {value}
      </span>
    </div>
  );
}
