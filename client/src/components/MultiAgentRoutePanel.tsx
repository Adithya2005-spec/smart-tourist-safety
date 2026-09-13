/**
 * MULTI-AGENT SAFE ROUTE CORRIDOR PANEL
 * Evaluates route options (Safe Corridor vs Direct Short-cut), displays waypoint
 * hazard scores, police kiosk proximity, and Google Maps integration status.
 */

import React, { useEffect, useState } from "react";
import { Navigation, Shield, AlertTriangle, Clock, MapPin, CheckCircle, ExternalLink } from "lucide-react";

export interface RouteOption {
  id: string;
  name: string;
  isRecommended: boolean;
  recommendationReason: string;
  totalDistanceKm: number;
  estimatedTimeMinutes: number;
  averageRiskScore: number;
  riskTier: "LOW" | "MODERATE" | "HIGH";
  waypoints?: Array<{
    lat: number;
    lng: number;
    instruction: string;
    distanceMeters: number;
    segmentRiskScore: number;
    segmentRiskTier: string;
  }>;
  dataSource: "GOOGLE_MAPS" | "MODEL-DERIVED";
}

interface MultiAgentRoutePanelProps {
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  className?: string;
}

export const MultiAgentRoutePanel: React.FC<MultiAgentRoutePanelProps> = ({
  origin = { lat: 12.9716, lng: 77.5946 },
  destination = { lat: 12.9800, lng: 77.6050 },
  className = "",
}) => {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mapsConfigured, setMapsConfigured] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/routes/safe-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.routes) {
          setRoutes(data.routes);
          setSelectedRouteId(data.recommendedRouteId || data.routes[0]?.id);
          setMapsConfigured(Boolean(data.mapsApiKeyConfigured));
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [origin.lat, origin.lng, destination.lat, destination.lng]);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div
      className={`rounded-xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-md p-5 text-slate-100 shadow-xl ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              Safe Tourist Corridor Routing
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {mapsConfigured ? "GOOGLE MAPS LIVE" : "AI SAFE CORRIDOR"}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Evaluates route segments for CCTV density, police kiosk presence & illumination
            </p>
          </div>
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Open Directions</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Routes Selector */}
      {isLoading ? (
        <div className="py-8 text-center text-xs text-slate-400">Computing safe corridor routes...</div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              const isRecommended = route.isRecommended;

              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-3.5 rounded-lg border text-left transition-all relative ${
                    isSelected
                      ? "bg-slate-800/90 border-blue-500/70 shadow-md ring-1 ring-blue-500/30"
                      : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600"
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 right-3 bg-emerald-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                      <CheckCircle className="w-2.5 h-2.5" /> Recommended
                    </span>
                  )}

                  <div className="font-semibold text-white text-xs mb-1">{route.name}</div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {route.estimatedTimeMinutes} min
                    </span>
                    <span>{route.totalDistanceKm} km</span>
                    <span
                      className={`font-semibold px-1.5 py-0.2 rounded text-[10px] ${
                        route.averageRiskScore < 25
                          ? "text-emerald-400 bg-emerald-950/60"
                          : "text-amber-400 bg-amber-950/60"
                      }`}
                    >
                      Risk: {route.averageRiskScore}/100
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {route.recommendationReason}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Route Waypoints Breakdown */}
          {activeRoute && activeRoute.waypoints && activeRoute.waypoints.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <div className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Waypoint Hazard Audit ({activeRoute.name})</span>
              </div>
              <div className="space-y-2 text-xs">
                {activeRoute.waypoints.map((step, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 text-[11px] text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 font-mono flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step.instruction}</span>
                    </div>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                        step.segmentRiskScore < 25
                          ? "bg-emerald-950/60 text-emerald-300"
                          : step.segmentRiskScore < 50
                          ? "bg-amber-950/60 text-amber-300"
                          : "bg-rose-950/60 text-rose-300"
                      }`}
                    >
                      Risk: {step.segmentRiskScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
