import { useSafety } from "@/contexts/SafetyContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Activity,
  ArrowRight,
  BotMessageSquare,
  ClipboardCheck,
  Globe2,
  Lock,
  MapPin,
  MapPinned,
  ShieldCheck,
  Siren,
  Sparkles,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function RoleLanding() {
  const { setRole, activeState } = useSafety();
  const [, setLocation] = useLocation();

  const enter = (role: "TOURIST" | "AUTHORITY") => {
    setRole(role);
    setLocation(role === "TOURIST" ? "/tourist" : "/authority");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f7f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#082235] text-cyan-300 shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">Suraksha Link</p>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-800 dark:text-cyan-400">
              Smart Tourist Safety Portal
            </p>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/pan-india"
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/60 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-900 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>Pan-India (36 States)</span>
          </Link>

          {/* Theme Switcher */}
          <ThemeToggle />

          <Link
            href="/signin"
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="hidden sm:inline-flex rounded-xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#103653] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-3.5 py-2 text-xs font-bold transition shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative mx-auto max-w-7xl px-5 pb-14 pt-6 sm:px-8 lg:pt-10">
        <div className="absolute left-[45%] top-[-5%] -z-0 h-[500px] w-[500px] rounded-full bg-cyan-200/35 dark:bg-cyan-500/10 blur-3xl" />

        <section className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-100/70 dark:bg-cyan-950/60 px-3.5 py-1 text-xs font-bold text-cyan-900 dark:text-cyan-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pan-India Edition · 28 States & 8 Union Territories</span>
            </div>

            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.08] tracking-[-.04em] text-[#082235] dark:text-white sm:text-5xl lg:text-6xl">
              Tourist safety, coordinated across all of India.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              An offline-first national tourist safety monitoring system with contextual risk predictions, state-specific emergency helplines, verifiable digital identities, and tamper-evident incident audit trails.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => enter("TOURIST")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#082235] dark:bg-cyan-500 hover:bg-[#103653] dark:hover:bg-cyan-400 text-white dark:text-slate-950 px-5 py-3.5 text-sm font-bold shadow-lg shadow-slate-900/10 transition active:scale-[.98]"
              >
                Enter Traveller Portal <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => enter("AUTHORITY")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 transition hover:border-cyan-300 hover:bg-cyan-50 dark:hover:bg-slate-800"
              >
                Open Command Centre <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/pan-india"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-50/70 dark:bg-cyan-950/40 px-5 py-3.5 text-sm font-bold text-cyan-900 dark:text-cyan-300 transition hover:bg-cyan-100 dark:hover:bg-cyan-900/60"
              >
                <Globe2 className="h-4 w-4" />
                Explore All 36 States
              </Link>
            </div>

            {/* Location quick tag */}
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>
                Default Region: <strong>{activeState.name} ({activeState.capital})</strong> · Switchable across all Indian territories.
              </span>
            </div>
          </div>

          {/* Right Live State Card */}
          <div className="relative rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl shadow-slate-900/10 sm:p-6">
            <div className="rounded-2xl bg-[#082235] p-5 text-white shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-300">
                    Live Safety State · {activeState.name}
                  </p>
                  <p className="mt-2 text-2xl font-black">Contextual Risk: HIGH</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500/15 text-rose-300">
                  <Siren className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <Mini label="Edge Sync" value="Ready" />
                <Mini label="State Police" value={activeState.emergency.touristPolice} />
                <Mini label="Blockchain" value="Verified" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Preview
                icon={Globe2}
                title="Pan-India Directory"
                body="Full safety contacts and local risk profiles for all 36 Indian States & UTs."
                href="/pan-india"
              />
              <Preview
                icon={MapPinned}
                title="Safety map & zones"
                body="Cached risk zones, geofencing, and safer alternate routes."
                href="/tourist/map"
              />
              <Preview
                icon={BotMessageSquare}
                title="Guardian AI"
                body="Intelligent multi-state travel advisor and safe zone guidance."
                href="/tourist/guardian"
              />
              <Preview
                icon={UsersRound}
                title="Command centre"
                body="Role-gated responder coordination and incident dispatch."
                href="/authority"
              />
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="relative z-10 mt-12 grid gap-4 border-t border-slate-200 dark:border-slate-800 pt-8 sm:grid-cols-3">
          <Value
            icon={Globe2}
            title="Pan-India Multi-State Coverage"
            body="Seamlessly switch across all 28 states and 8 union territories with state-specific police helplines, disaster units, and local dos & don'ts."
          />
          <Value
            icon={Activity}
            title="Offline-First Edge Layer"
            body="Cached risk zones, local geofences, emergency contacts, and an offline SOS queue remain functional even with zero cellular connectivity."
          />
          <Value
            icon={ShieldCheck}
            title="Selective Blockchain Auditing"
            body="Incident lifecycles are cryptographically anchored with SHA-256 hashes for transparency while private traveler data remains off-chain."
          />
        </section>
      </main>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[9px] font-bold uppercase tracking-[.12em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-xs font-bold text-white">{value}</p>
    </div>
  );
}

function Preview({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 transition hover:border-cyan-400 hover:bg-cyan-50/30 dark:hover:bg-slate-800"
    >
      <Icon className="h-4 w-4 text-cyan-700 dark:text-cyan-400" />
      <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{body}</p>
    </Link>
  );
}

function Value({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{body}</p>
      </div>
    </div>
  );
}
