/**
 * INTER-STATE TRANSIT SIMULATOR & GPS AUTO-TERRITORY CONTROLLER
 * Allows travelers, authorities, and evaluators to simulate crossing state boundaries
 * and observe the entire platform dynamically adapt in real-time.
 */

import React, { useState } from "react";
import { useSafety } from "@/contexts/SafetyContext";
import {
  INTER_STATE_TRANSIT_ROUTES,
  type InterStateTransitRoute,
} from "@/lib/inter-state-geofence";
import {
  Navigation,
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  Shield,
  LocateFixed,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface InterStateTransitSimulatorProps {
  className?: string;
  compact?: boolean;
}

export const InterStateTransitSimulator: React.FC<InterStateTransitSimulatorProps> = ({
  className = "",
  compact = false,
}) => {
  const { location, locationName, activeState, setLocation } = useSafety();
  const [isLocating, setIsLocating] = useState(false);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

  const handleTransit = (route: InterStateTransitRoute) => {
    setActiveRouteId(route.id);
    setLocation(
      { lat: route.destination.lat, lng: route.destination.lng },
      route.destination.locationName
    );
  };

  const handleBrowserGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by this browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
        };
        setLocation(coords, "Current Device GPS Position");
      },
      (err) => {
        setIsLocating(false);
        toast.warning("GPS location access denied or unavailable. Using simulated GPS telemetry.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div
      className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                DYNAMIC INTER-STATE GEOFENCE ENGINE
              </span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-800 dark:text-emerald-300">
                AUTO-SYNCHRONIZED
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cross-Border Transit & Territory Simulator
            </h3>
          </div>
        </div>

        {/* Live Detected State Badge */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBrowserGPS}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
            title="Fetch browser device GPS coordinates"
          >
            <LocateFixed className={`h-3.5 w-3.5 text-cyan-600 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Locating..." : "Device GPS"}</span>
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition"
          >
            <span>Google Maps</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Current Telemetry Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Current Monitored Point:</span>
            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-md">
              {locationName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            GPS: <strong className="text-cyan-600 dark:text-cyan-400">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-300 font-bold">
            State: {activeState.name} ({activeState.code})
          </span>
        </div>
      </div>

      {/* Inter-State Travel Route Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Click any journey to cross state borders on Google Maps and watch the entire portal adapt:
        </p>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {INTER_STATE_TRANSIT_ROUTES.map((route) => {
            const isSelected = activeState.code === route.toState;

            return (
              <button
                key={route.id}
                type="button"
                onClick={() => handleTransit(route)}
                className={`text-left p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/40 ring-2 ring-cyan-500/30 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-400 dark:hover:border-cyan-600 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    {route.title}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {route.description}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-cyan-700 dark:text-cyan-400 font-bold">
                  <span>Enter {route.toState} Boundary</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
