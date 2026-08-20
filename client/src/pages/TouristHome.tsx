import { EdgeConnectivity, RiskBadge, SafetyNotice, SafetyShell } from "@/components/SafetyShell";
import { useSafety } from "@/contexts/SafetyContext";
import {
  AlertTriangle,
  ArrowRight,
  BotMessageSquare,
  Globe2,
  IdCard,
  MapPin,
  MapPinned,
  RadioTower,
  ShieldCheck,
  Siren,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

export default function TouristHome() {
  const { risk, locationName, online, activeGeofences, incidents, profile, language, activeState } = useSafety();

  const labels =
    language === "hi"
      ? { greeting: "सुरक्षा अवलोकन", status: "आपकी सुरक्षा स्थिति", map: "सुरक्षा मानचित्र देखें", sos: "एसओएस" }
      : language === "kn"
        ? { greeting: "ಸುರಕ್ಷತಾ ಅವಲೋಕನ", status: "ನಿಮ್ಮ ಸುರಕ್ಷತಾ ಸ್ಥಿತಿ", map: "ಸುರಕ್ಷತಾ ನಕ್ಷೆ ನೋಡಿ", sos: "ತುರ್ತು ಎಸ್‌ಒಎಸ್" }
        : { greeting: "Safety overview", status: "Your current safety status", map: "View safety map", sos: "SOS centre" };

  const activeIncident = incidents.find(
    (incident) => incident.touristId === profile.touristId && incident.status !== "RESOLVED",
  );
  const primaryZone = activeGeofences[0]?.zone;

  return (
    <SafetyShell
      eyebrow="Traveller workspace"
      title={labels.greeting}
      actions={
        <Link
          href="/tourist/sos"
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
        >
          <Siren className="h-4 w-4" />
          {labels.sos}
        </Link>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[1.4fr_.75fr]">
        {/* Main Status Banner */}
        <section className="rounded-3xl bg-[#082235] p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8 relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] h-60 w-60 rounded-full bg-cyan-400/10 blur-2xl" />
          
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  <MapPin className="h-3 w-3" />
                  {activeState.name} ({activeState.code})
                </span>
                <Link
                  href="/pan-india"
                  className="text-[10px] font-bold text-slate-300 hover:text-white underline"
                >
                  Change State (36)
                </Link>
              </div>
              <h2 className="max-w-xl text-2xl font-black tracking-tight sm:text-3xl">
                Stay informed. Act with confidence in {activeState.name}.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Your edge safety layer continuously checks cached risk zones, local police helplines ({activeState.emergency.touristPolice}), and keeps critical emergency actions ready.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center backdrop-blur-sm">
              <p className="text-4xl font-black tabular-nums">{risk.score}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Risk score / 100</p>
            </div>
          </div>

          <div className="relative z-10 mt-7 grid gap-3 sm:grid-cols-3">
            <InfoStat icon={MapPinned} label="Current Location" value={locationName} />
            <InfoStat icon={online ? RadioTower : AlertTriangle} label="Edge Network" value={online ? "Connected" : "Offline Safe"} />
            <InfoStat icon={ShieldCheck} label="Tourist Identity" value={profile.verification} />
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap gap-3">
            <Link
              href="/tourist/map"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-[#082235] transition hover:bg-cyan-300"
            >
              {labels.map}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pan-india"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <Globe2 className="h-4 w-4 text-cyan-300" />
              Pan-India Directory
            </Link>
            <Link
              href="/tourist/guardian"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <BotMessageSquare className="h-4 w-4" />
              Guardian AI
            </Link>
          </div>
        </section>

        {/* Contextual Risk Factors */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">
                Contextual Risk Evaluation
              </p>
              <RiskBadge score={risk.score} band={risk.band} />
            </div>

            <div className="mt-5 space-y-3.5">
              {risk.factors.map((factor, index) => (
                <div key={factor} className="flex gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                    0{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{factor}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Zonal factor for {activeState.name} corridor
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-3">
            <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              State Tourist Police: <strong>{activeState.emergency.touristPolice}</strong> · Central SOS: <strong>112</strong>
            </p>
          </div>
        </section>
      </div>

      {/* Safety Actions & Active Alert Grid */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_.75fr]">
        <div className="space-y-5">
          {primaryZone ? (
            <SafetyNotice tone="rose">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-bold text-rose-950 dark:text-rose-200">High-risk area detected locally</p>
                  <p className="mt-1 text-sm text-rose-900 dark:text-rose-300">
                    You are within <strong>{primaryZone.name}</strong> ({activeState.name}). Current zone risk is <strong>{primaryZone.score}/100</strong>.
                  </p>
                  <Link href="/tourist/map" className="mt-2 inline-block text-xs font-bold underline underline-offset-4">
                    Review safer alternate route options
                  </Link>
                </div>
              </div>
            </SafetyNotice>
          ) : (
            <SafetyNotice>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
                <p>
                  <strong>Edge geofence active for {activeState.name}.</strong> {activeState.riskZones.length} cached risk zones remain actively evaluated on this device even with zero network.
                </p>
              </div>
            </SafetyNotice>
          )}

          {/* Prepared Actions Grid */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">Safety actions</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Prepared for the next decision</h3>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <QuickLink href="/tourist/sos" icon={Siren} label={labels.sos} description="Create or queue emergency SOS" critical />
              <QuickLink href="/pan-india" icon={Globe2} label="Pan-India (36)" description="Switch state safety & contacts" />
              <QuickLink href="/tourist/identity" icon={IdCard} label="Digital ID" description="Show verified travel profile" />
            </div>
          </div>
        </div>

        {/* Right Active Incident & Edge Connectivity Card */}
        <aside className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500 dark:text-slate-400">Active incident</p>
              {activeIncident && <span className="text-xs font-bold text-rose-600 animate-pulse">LIVE SOS</span>}
            </div>

            {activeIncident ? (
              <div className="mt-5">
                <p className="text-lg font-black text-slate-900 dark:text-white">{activeIncident.id}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {activeIncident.type} · {activeIncident.location}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 px-3 py-1 text-[11px] font-bold tracking-[.1em] text-cyan-800 dark:text-cyan-300">
                    {activeIncident.status}
                  </span>
                  <Link href="/tourist/incidents" className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline">
                    Track status →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No active emergency</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Your incident status and responder ETA will appear here after an alert is dispatched.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            <EdgeConnectivity />
          </div>
        </aside>
      </div>
    </SafetyShell>
  );
}

function InfoStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.05] p-3.5 backdrop-blur-sm">
      <Icon className="h-4 w-4 text-cyan-300" />
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  description,
  critical,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  critical?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-4 transition-all ${
        critical
          ? "border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 hover:border-rose-300"
          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-cyan-300 dark:hover:border-cyan-700 hover:bg-cyan-50/30 dark:hover:bg-slate-800"
      }`}
    >
      <Icon className={`h-5 w-5 ${critical ? "text-rose-600 dark:text-rose-400" : "text-cyan-700 dark:text-cyan-400"}`} />
      <p className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">{label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
      <ArrowRight className="mt-3 h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
