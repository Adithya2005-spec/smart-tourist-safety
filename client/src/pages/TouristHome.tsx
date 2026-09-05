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
  TrendingUp,
  Clock,
  HelpCircle,
  CheckCircle2,
  CloudRain,
  Wind,
  Thermometer,
  Info,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { getNearbyLocationWeatherIntelligence } from "@/lib/environmental-risk-model";
import { WhyRiskExplanationModal } from "@/components/WhyRiskExplanationModal";

export default function TouristHome() {
  const {
    risk,
    locationName,
    online,
    activeGeofences,
    incidents,
    profile,
    language,
    activeState,
    journeyState,
    preSOSWarning,
    riskForecast,
    riskTimeline,
    counterfactuals,
    location,
  } = useSafety();

  const [showWhyModal, setShowWhyModal] = useState(false);
  const envRisk = getNearbyLocationWeatherIntelligence(location);

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
      {/* Pre-SOS Risk Warning Banner (Preventive Signal) */}
      {preSOSWarning.triggered && (
        <div className="mb-5 rounded-3xl border-2 border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 p-5 text-amber-950 dark:text-amber-200 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-500 text-slate-950 font-bold">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 dark:bg-amber-900/80 px-2 py-0.5 rounded-md text-amber-900 dark:text-amber-200">
                  {preSOSWarning.title}
                </span>
                <h3 className="mt-1 text-base font-black">{preSOSWarning.message}</h3>
                <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
                  {preSOSWarning.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/tourist/map"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-black transition shadow-sm"
              >
                Accept Safer Route <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/tourist/sos"
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/50 bg-amber-100 dark:bg-amber-900/40 px-3 py-2 text-xs font-bold transition"
              >
                Contact Emergency
              </Link>
            </div>
          </div>
        </div>
      )}

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
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Journey State: {journeyState}
                </span>
              </div>
              <h2 className="max-w-xl text-2xl font-black tracking-tight sm:text-3xl">
                Stay informed. Act with confidence in {activeState.name}.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Your edge safety layer continuously evaluates zonal risk, police helplines ({activeState.emergency.touristPolice}), and multi-horizon forecasts.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center backdrop-blur-sm">
              <p className="text-4xl font-black tabular-nums">{risk.score}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Current Risk / 100</p>
            </div>
          </div>

          {/* Multi-Horizon Risk Forecasting Row */}
          <div className="relative z-10 mt-6 grid gap-2 sm:grid-cols-4 border-t border-white/10 pt-5">
            <ForecastCard label="Current Risk" score={riskForecast.currentScore} severity={riskForecast.currentSeverity} highlight />
            <ForecastCard label="+15 Min Forecast" score={riskForecast.forecast15m.score} severity={riskForecast.forecast15m.severity} />
            <ForecastCard label="+30 Min Forecast" score={riskForecast.forecast30m.score} severity={riskForecast.forecast30m.severity} />
            <ForecastCard label="+60 Min Forecast" score={riskForecast.forecast60m.score} severity={riskForecast.forecast60m.severity} />
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

        {/* Counterfactual "WHAT IF?" Scenario Comparison */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                  DECISION SUPPORT [MODEL-DERIVED]
                </span>
                <h3 className="mt-0.5 text-base font-black text-slate-900 dark:text-white">Counterfactual "WHAT IF?" Analysis</h3>
              </div>
              <HelpCircle className="h-5 w-5 text-cyan-600" />
            </div>

            <div className="mt-4 space-y-2.5">
              {counterfactuals.map((scen) => (
                <div
                  key={scen.id}
                  className={`rounded-2xl border p-3.5 transition ${
                    scen.isRecommended
                      ? "border-emerald-500/40 bg-emerald-50/70 dark:bg-emerald-950/30"
                      : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {scen.isRecommended && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{scen.title}</p>
                    </div>
                    <span
                      className={`text-xs font-black ${
                        scen.riskScore >= 70
                          ? "text-rose-600"
                          : scen.riskScore >= 45
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      Risk {scen.riskScore}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{scen.recommendationReason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Compact Environmental Safety Card (AWS Intelligence) */}
      <div className="mt-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
              <CloudRain className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                AWS ENVIRONMENTAL SAFETY INTELLIGENCE
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Environmental Risk:</span>
                <span
                  className={`font-black uppercase text-sm ${
                    envRisk.environmentalRiskLevel === "HIGH" || envRisk.environmentalRiskLevel === "CRITICAL"
                      ? "text-rose-500"
                      : envRisk.environmentalRiskLevel === "MEDIUM"
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {envRisk.environmentalRiskLevel} ({envRisk.environmentalRiskScore}/100)
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowWhyModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/60 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/60 px-3.5 py-2 text-xs font-bold text-cyan-900 dark:text-cyan-300 hover:bg-cyan-100 transition shadow-sm"
            >
              <Info className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Why Did AI Give This Risk?
            </button>
            <Link
              href="/tourist/map"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              View AWS Map
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Station Distance</p>
            <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white font-mono">
              {envRisk.nearestStationDistanceKm} km ({envRisk.primaryStationId || "AWS-KA-101"})
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Weather Confidence</p>
            <p className="mt-0.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {Math.round(envRisk.weatherConfidence * 100)}% ({envRisk.agreeingStationCount}/{envRisk.nearbyStationCount} Agree)
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Sensor Health</p>
            <p className="mt-0.5 text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono">
              {Math.round(envRisk.sensorHealthScore * 100)}% ({envRisk.flaggedStationCount > 0 ? `${envRisk.flaggedStationCount} Fault Isolated` : "100% Operational"})
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Weather Trend</p>
            <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
              <span>{envRisk.weatherTrend}</span>
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {envRisk.summary}
        </p>
      </div>

      {/* Risk Explanation Timeline */}
      <div className="mt-5">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                EXPLAINABILITY PIPELINE [MODEL-DERIVED]
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Risk Change Explanation Timeline</h3>
            </div>
            <Clock className="h-5 w-5 text-cyan-600" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {riskTimeline.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>{item.time}</span>
                  <span className={item.delta > 0 ? "text-rose-600 font-black" : "text-emerald-600 font-black"}>
                    {item.delta > 0 ? `+${item.delta}` : item.delta} pts
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{item.eventTitle}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Why Risk Explanation Modal */}
      <WhyRiskExplanationModal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        risk={risk}
        envRisk={envRisk}
        locationName={locationName}
      />
    </SafetyShell>
  );
}

function ForecastCard({ label, score, severity, highlight }: { label: string; score: number; severity: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-3 border backdrop-blur-sm ${
        highlight
          ? "bg-cyan-400/20 border-cyan-400/40 text-cyan-200"
          : "bg-white/5 border-white/10 text-slate-300"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <p className="text-xl font-black text-white">{score}</p>
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">{severity}</span>
      </div>
    </div>
  );
}
