import { useState } from "react";
import { useSafety } from "@/contexts/SafetyContext";
import { SafetyShell, RiskBadge, SafetyNotice } from "@/components/SafetyShell";
import { allIndianStates, type IndianStateData } from "@/lib/india-safety-data";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Compass,
  FileText,
  Filter,
  Flame,
  Globe2,
  HeartPulse,
  Info,
  MapPin,
  MapPinned,
  PhoneCall,
  Radio,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "wouter";

export default function PanIndiaExplorer() {
  const { activeState, setActiveState, role } = useSafety();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [activeStateModal, setActiveStateModal] = useState<IndianStateData | null>(null);

  const regions = ["ALL", "North", "South", "East", "West", "Central", "North-East", "Islands"];

  const filteredStates = allIndianStates.filter((state) => {
    const matchesRegion = selectedRegion === "ALL" || state.region === selectedRegion;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesRegion;

    const matchesName = state.name.toLowerCase().includes(query) || state.code.toLowerCase().includes(query);
    const matchesCapital = state.capital.toLowerCase().includes(query);
    const matchesDestinations = state.popularDestinations.some((dest) => dest.toLowerCase().includes(query));
    const matchesZonal = state.riskZones.some((z) => z.name.toLowerCase().includes(query));

    return matchesRegion && (matchesName || matchesCapital || matchesDestinations || matchesZonal);
  });

  const handleSelectState = (state: IndianStateData) => {
    setActiveState(state.id);
    toast.success(`Active State Updated to ${state.name}!`, {
      description: `Loaded local emergency helplines, ${state.riskZones.length} risk zones, and geofence profiles for ${state.capital}.`,
    });
  };

  return (
    <SafetyShell
      eyebrow="Pan-India Safety Network"
      title="All-India State Safety Intelligence & Directory"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/tourist/map"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <MapPinned className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            Live Map
          </Link>
          <Link
            href="/tourist/sos"
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
          >
            <Siren className="h-4 w-4" />
            SOS
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#082235] via-[#0d3450] to-[#082235] p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
          <div className="absolute right-[-40px] top-[-40px] -z-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute left-[30%] bottom-[-50px] -z-0 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.3fr_.7fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pan-India Coverage · 28 States + 8 Union Territories</span>
              </div>
              <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white">
                Comprehensive Tourist Safety for Every Corner of India
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Switch your active travel location instantly to download dedicated police helplines, local geofences, disaster management contacts, and contextual advisories for any Indian state or union territory.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm border border-white/10">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Current Active: <strong className="text-cyan-300">{activeState.name} ({activeState.code})</strong></span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm border border-white/10">
                  <Radio className="h-4 w-4 text-cyan-400" />
                  <span>State Police: <strong className="text-white">{activeState.emergency.touristPolice}</strong></span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm border border-white/10">
                  <PhoneCall className="h-4 w-4 text-rose-400" />
                  <span>National SOS: <strong className="text-white">112</strong></span>
                </div>
              </div>
            </div>

            {/* Active State Card Summary */}
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                    Active Travel Location
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-white">{activeState.name}</h3>
                  <p className="text-xs text-slate-300">Capital: {activeState.capital} · {activeState.region} India</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                  LIVE SYNC
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="text-slate-400">Monitored Risk Zones:</span>
                  <span className="font-bold">{activeState.riskZones.length} Zones</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="text-slate-400">Emergency Police Desk:</span>
                  <span className="font-bold text-cyan-300">{activeState.emergency.touristPolice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Women Helpline:</span>
                  <span className="font-bold">{activeState.emergency.womenHelpline}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStateModal(activeState)}
                className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-bold text-[#082235] transition hover:bg-cyan-300 shadow-md"
              >
                View Full {activeState.name} Safety Profile
              </button>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by state, capital, destination (e.g. Goa, Leh, Jaipur, Manali, Munnar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Region:
            </span>
            {regions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedRegion === region
                    ? "bg-[#082235] dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {region === "ALL" ? "All India (36)" : region}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <p>
            Showing <strong>{filteredStates.length}</strong> of <strong>{allIndianStates.length}</strong> States & Union Territories
          </p>
          <p className="hidden sm:block">Click "Set as My Location" to switch live coordinates and safety feeds</p>
        </div>

        {/* States Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStates.map((state) => {
            const isActive = state.id === activeState.id;
            const highestRisk = state.riskZones.length > 0
              ? Math.max(...state.riskZones.map((z) => z.score))
              : 20;

            return (
              <div
                key={state.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${
                  isActive
                    ? "border-cyan-500 dark:border-cyan-400 ring-2 ring-cyan-500/20 bg-cyan-50/20 dark:bg-cyan-950/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                          {state.name}
                        </h3>
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {state.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Capital: {state.capital} · <span className="font-semibold text-slate-700 dark:text-slate-300">{state.region}</span>
                      </p>
                    </div>

                    {isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {state.type}
                      </span>
                    )}
                  </div>

                  {/* Destinations snippet */}
                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-1.5">
                      Key Tourist Hotspots
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {state.popularDestinations.slice(0, 3).map((dest) => (
                        <span
                          key={dest}
                          className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {dest}
                        </span>
                      ))}
                      {state.popularDestinations.length > 3 && (
                        <span className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-1.5 py-0.5 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          +{state.popularDestinations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Helplines snapshot */}
                  <div className="mt-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        Tourist Police:
                      </span>
                      <strong className="text-slate-900 dark:text-slate-100">{state.emergency.touristPolice}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Siren className="h-3.5 w-3.5 text-rose-500" />
                        National Emergency:
                      </span>
                      <strong className="text-rose-600 dark:text-rose-400">112</strong>
                    </div>
                  </div>

                  {/* Zonal preview */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{state.riskZones.length} Monitored Zones</span>
                    <span>Peak Zonal Risk: <strong>{highestRisk}/100</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveStateModal(state)}
                    className="flex-1 text-xs font-bold border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    View Details
                  </Button>
                  {!isActive ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSelectState(state)}
                      className="flex-1 text-xs font-bold bg-[#082235] hover:bg-[#103653] dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white"
                    >
                      Set as Location
                    </Button>
                  ) : (
                    <Link
                      href="/tourist/map"
                      className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white py-2"
                    >
                      Open Map
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* State Detail Modal Dialog */}
        {activeStateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold px-2 py-0.5 text-xs">
                      {activeStateModal.code} · {activeStateModal.region} India
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{activeStateModal.type}</span>
                  </div>
                  <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                    {activeStateModal.name} Safety Profile
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Capital: {activeStateModal.capital} · Primary Languages: {activeStateModal.language}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStateModal(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Emergency Contacts Section */}
              <div className="mt-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">
                    Emergency Helplines & Assistance Desks
                  </h4>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40">
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">National Police & Emergency</p>
                      <p className="text-base font-black text-rose-600 dark:text-rose-400">112</p>
                      <p className="text-[10px] text-slate-400">Direct satellite & cellular dispatch</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40">
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{activeStateModal.name} Tourist Police</p>
                      <p className="text-base font-black text-cyan-700 dark:text-cyan-300">{activeStateModal.emergency.touristPolice}</p>
                      <p className="text-[10px] text-slate-400">Dedicated tourist security desk</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40">
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Women Safety Helpline</p>
                      <p className="text-base font-black text-purple-600 dark:text-purple-400">{activeStateModal.emergency.womenHelpline}</p>
                      <p className="text-[10px] text-slate-400">24x7 special assistance</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40">
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Medical / Ambulance</p>
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{activeStateModal.emergency.ambulance}</p>
                      <p className="text-[10px] text-slate-400">Trauma care & hospital network</p>
                    </div>
                  </div>
                </div>

                {/* Popular Destinations */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">
                    Popular Destinations in {activeStateModal.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeStateModal.popularDestinations.map((dest) => (
                      <span
                        key={dest}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        📍 {dest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk & Safety Zones */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">
                    Monitored Risk & Safety Zones ({activeStateModal.riskZones.length})
                  </h4>
                  <div className="space-y-2">
                    {activeStateModal.riskZones.map((zone) => (
                      <div
                        key={zone.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-800/60 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{zone.name}</p>
                          <p className="text-slate-500 dark:text-slate-400 mt-0.5">Factor: {zone.factor}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">City: {zone.city} · Monitored Radius: {zone.radiusM}m</p>
                        </div>
                        <RiskBadge score={zone.score} band={zone.band} compact />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advisories & Guidelines */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-2">
                    Local Safety Guidelines & Advisories
                  </h4>
                  <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 space-y-2 text-xs">
                    {activeStateModal.advisories.map((adv, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-amber-950 dark:text-amber-200">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Do's & Don'ts */}
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
                    <p className="font-bold text-emerald-900 dark:text-emerald-300 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Recommended Do's
                    </p>
                    <ul className="space-y-1 text-emerald-950 dark:text-emerald-200 list-disc list-inside">
                      {activeStateModal.dosAndDonts.dos.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-3">
                    <p className="font-bold text-rose-900 dark:text-rose-300 mb-1.5 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      Important Don'ts
                    </p>
                    <ul className="space-y-1 text-rose-950 dark:text-rose-200 list-disc list-inside">
                      {activeStateModal.dosAndDonts.donts.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveStateModal(null)}
                  className="text-xs"
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      handleSelectState(activeStateModal);
                      setActiveStateModal(null);
                    }}
                    className="bg-[#082235] hover:bg-[#103653] dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white text-xs font-bold"
                  >
                    Set {activeStateModal.name} as Active Location
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SafetyShell>
  );
}
