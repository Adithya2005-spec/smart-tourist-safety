import { useSafety } from "@/contexts/SafetyContext";
import { cn } from "@/lib/utils";
import { AlertTriangle, Cross, Hospital, MapPinned, ShieldCheck } from "lucide-react";
import { RiskBadge } from "./SafetyShell";

function computeBounds(points: { lat: number; lng: number }[]) {
  if (!points.length) {
    return { minLat: 12.966, maxLat: 12.982, minLng: 77.588, maxLng: 77.614 };
  }
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;

  points.forEach((p) => {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  });

  const latPad = Math.max(0.008, (maxLat - minLat) * 0.35);
  const lngPad = Math.max(0.008, (maxLng - minLng) * 0.35);

  return {
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad,
  };
}

const styles = {
  SAFE: "border-emerald-500/70 bg-emerald-500/20 dark:bg-emerald-500/30",
  CAUTION: "border-amber-400/80 bg-amber-400/20 dark:bg-amber-400/30",
  DANGER: "border-rose-500/80 bg-rose-500/25 dark:bg-rose-500/35",
};

export function DemoSafetyMap({
  compact = false,
  onSelectZone,
}: {
  compact?: boolean;
  onSelectZone?: (zoneId: string) => void;
}) {
  const { zones, incidents, location, simulateHighRisk, activeState } = useSafety();

  const allPoints = [location, ...zones.map((z) => z.center)];
  const bounds = computeBounds(allPoints);

  function position(point: { lat: number; lng: number }) {
    const left = ((point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const top = ((bounds.maxLat - point.lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return {
      left: `${Math.max(6, Math.min(94, left))}%`,
      top: `${Math.max(8, Math.min(92, top))}%`,
    };
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-[#e2edea] dark:bg-[#0c1a24] transition-colors duration-200 shadow-inner",
        compact ? "h-[350px]" : "h-[540px]",
      )}
    >
      {/* Decorative Grid and Contours */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(30deg, rgba(14,116,144,.15) 12%, transparent 12.5%, transparent 87%, rgba(14,116,144,.15) 87.5%, rgba(14,116,144,.15)), linear-gradient(150deg, rgba(14,116,144,.15) 12%, transparent 12.5%, transparent 87%, rgba(14,116,144,.15) 87.5%, rgba(14,116,144,.15)), linear-gradient(30deg, rgba(14,116,144,.15) 12%, transparent 12.5%, transparent 87%, rgba(14,116,144,.15) 87.5%, rgba(14,116,144,.15)), linear-gradient(150deg, rgba(14,116,144,.15) 12%, transparent 12.5%, transparent 87%, rgba(14,116,144,.15) 87.5%, rgba(14,116,144,.15))",
          backgroundSize: "42px 74px",
          backgroundPosition: "0 0, 0 0, 21px 37px, 21px 37px",
        }}
      />
      <div className="absolute inset-x-[-8%] top-[47%] h-8 rotate-[-7deg] bg-slate-300/40 dark:bg-slate-700/30" />
      <div className="absolute inset-y-[-5%] left-[49%] w-7 rotate-[16deg] bg-slate-300/40 dark:bg-slate-700/30" />

      {/* Geofenced Zones */}
      {zones.map((zone) => {
        const pos = position(zone.center);
        const size = `${Math.max(100, zone.radiusM / 2.2)}px`;
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelectZone?.(zone.id)}
            style={{ ...pos, width: size, height: size }}
            className={cn(
              "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/40 backdrop-blur-[1px]",
              styles[zone.band],
            )}
            aria-label={`View ${zone.name}`}
          >
            <span className="absolute left-1/2 top-1/2 w-max max-w-[140px] truncate -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 px-2 py-1 text-[10px] font-bold text-slate-800 dark:text-slate-200 shadow-md">
              {zone.name}
            </span>
          </button>
        );
      })}

      {/* Active Incidents */}
      {incidents
        .filter((incident) => incident.status !== "RESOLVED")
        .map((incident) => (
          <div
            key={incident.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 animate-bounce"
            style={position(incident.coordinate)}
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-500/40 ring-4 ring-white/90 dark:ring-slate-900">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
        ))}

      {/* Current Location Marker */}
      <div className="absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-500" style={position(location)}>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-[#082235] dark:bg-cyan-500 text-cyan-300 dark:text-slate-950 shadow-xl ring-4 ring-white/90 dark:ring-slate-900">
          <MapPinned className="h-6 w-6" />
        </div>
        <span className="absolute left-1/2 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#082235] dark:bg-cyan-500 px-2 py-0.5 text-[9px] font-black uppercase text-white dark:text-slate-950 shadow-md">
          YOU ({activeState.code})
        </span>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-md backdrop-blur-md">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {activeState.name} Geofence Map
        </p>
        <div className="flex flex-wrap gap-2 text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1 text-[10px] font-semibold">
            <i className="h-2 w-2 rounded-full bg-emerald-500" />
            Safe
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold">
            <i className="h-2 w-2 rounded-full bg-amber-500" />
            Caution
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold">
            <i className="h-2 w-2 rounded-full bg-rose-500" />
            Danger
          </span>
        </div>
      </div>

      {/* Top Banner Tag */}
      {!compact && (
        <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full border border-cyan-300/50 dark:border-cyan-800 bg-white/95 dark:bg-slate-900/95 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.1em] text-cyan-900 dark:text-cyan-300 shadow-md">
          {activeState.name.toUpperCase()} · HAVERSINE EDGE GEOFENCING ACTIVE
        </div>
      )}

      {/* Simulation Button */}
      <div className="absolute right-4 top-4 z-20">
        <button
          type="button"
          onClick={simulateHighRisk}
          className="rounded-xl bg-[#082235] hover:bg-[#103653] dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-white px-3.5 py-2 text-xs font-bold shadow-lg transition"
        >
          Simulate Zonal Alarm
        </button>
      </div>
    </div>
  );
}

export function ZoneRiskList() {
  const { zones, activeState } = useSafety();
  return (
    <div className="space-y-3">
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm"
        >
          <div
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
              zone.band === "DANGER"
                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300"
                : zone.band === "CAUTION"
                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300"
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300",
            )}
          >
            {zone.band === "SAFE" ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{zone.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {zone.factor} · {activeState.name}
            </p>
          </div>
          <RiskBadge score={zone.score} band={zone.band} compact />
        </div>
      ))}
    </div>
  );
}
