import React, { useState } from "react";
import { DemoSafetyMap } from "@/components/DemoSafetyMap";
import { Layers, Eye, ShieldAlert, Users, RadioTower, Compass } from "lucide-react";

export function DigitalTwinMap({ compact = false }: { compact?: boolean }) {
  const [layers, setLayers] = useState({
    tourists: true,
    incidents: true,
    zones: true,
    responders: true,
    connectivity: true,
    corridors: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-3">
      {/* Map Layer Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
          <Layers className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span>DIGITAL TWIN VISUAL LAYERS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LayerToggle label="Tourists" active={layers.tourists} onClick={() => toggleLayer("tourists")} />
          <LayerToggle label="Incidents" active={layers.incidents} onClick={() => toggleLayer("incidents")} />
          <LayerToggle label="Risk Zones" active={layers.zones} onClick={() => toggleLayer("zones")} />
          <LayerToggle label="Responders" active={layers.responders} onClick={() => toggleLayer("responders")} />
          <LayerToggle label="Connectivity" active={layers.connectivity} onClick={() => toggleLayer("connectivity")} />
          <LayerToggle label="Safety Corridors" active={layers.corridors} onClick={() => toggleLayer("corridors")} />
        </div>
      </div>

      {/* Main Map Canvas */}
      <DemoSafetyMap compact={compact} />
    </div>
  );
}

function LayerToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-[11px] font-black transition border ${
        active
          ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm"
          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
      }`}
    >
      <Eye className={`h-3 w-3 ${active ? "text-slate-950" : "text-slate-400"}`} />
      {label}
    </button>
  );
}
