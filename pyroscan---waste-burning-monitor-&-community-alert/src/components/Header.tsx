import React from "react";
import { 
  Flame, 
  ShieldAlert, 
  Radio, 
  Wind, 
  Users, 
  FileText, 
  Cpu, 
  PlusCircle, 
  Sparkles,
  AlertTriangle,
  Building2,
  MapPin
} from "lucide-react";
import { BurnIncident, CommunityReport, AirSensorStation, PatrolUnit } from "../types";

interface HeaderProps {
  activeTab: "COMMAND" | "COMMUNITY" | "SATELLITE_GRID" | "ENFORCEMENT" | "AI_LAB";
  setActiveTab: (tab: "COMMAND" | "COMMUNITY" | "SATELLITE_GRID" | "ENFORCEMENT" | "AI_LAB") => void;
  incidents: BurnIncident[];
  communityReports: CommunityReport[];
  sensors: AirSensorStation[];
  patrols: PatrolUnit[];
  onOpenReportModal: () => void;
  onTriggerSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  incidents,
  communityReports,
  sensors,
  patrols,
  onOpenReportModal,
  onTriggerSimulation,
}) => {
  const activeFires = incidents.filter(i => i.status !== "RESOLVED_FINED" && i.status !== "FALSE_ALARM");
  const criticalFires = activeFires.filter(i => i.severity === "CRITICAL");
  const pendingReports = communityReports.filter(r => r.status === "PENDING_VERIFICATION");
  const totalFines = incidents.reduce((acc, i) => acc + (i.fineAmountUSD || 0), 0);
  
  // Calculate average AQI across municipal sensors
  const avgAqi = sensors.length > 0
    ? Math.round(sensors.reduce((acc, s) => acc + s.aqi, 0) / sensors.length)
    : 110;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top emergency announcement ticker if critical burns exist */}
      {criticalFires.length > 0 && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 flex items-center justify-between text-xs font-medium text-amber-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-semibold text-amber-300 uppercase tracking-wider">MUNICIPAL ALERT:</span>
            <span className="truncate">
              {criticalFires.length} CRITICAL open burn event(s) detected in East Metal Yard & North Agro-Belt. High dioxin & PM2.5 plume drifting West-Southwest.
            </span>
          </div>
          <span className="hidden sm:inline text-amber-400/80 font-mono">Response Squads En-Route</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-950/50 border border-amber-400/40">
              <Flame className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                  PyroScan
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Muni-Guard v3.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Municipal Illegal Waste Burning Surveillance & Community Defense
              </p>
            </div>
          </div>

          {/* Mobile report trigger */}
          <button
            onClick={onOpenReportModal}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white shadow-md shadow-orange-950"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Report Burn
          </button>
        </div>

        {/* Live Status Telemetry Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-1 text-red-400 font-semibold">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{activeFires.length}</span>
            </div>
            <span className="text-slate-400">Active Burns</span>
            {criticalFires.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">
                {criticalFires.length} Critical
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Wind className="h-3.5 w-3.5" />
              <span>AQI {avgAqi}</span>
            </div>
            <span className="text-slate-400 hidden sm:inline">City Avg</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Radio className="h-3.5 w-3.5" />
              <span>{patrols.filter(p => p.status !== "STANDBY").length}</span>
            </div>
            <span className="text-slate-400 hidden sm:inline">Patrols Active</span>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onTriggerSimulation}
              title="Simulate new detected flare or satellite spike"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Simulate Flare</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold text-xs shadow-lg shadow-orange-950 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Report Burning Activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-slate-800 bg-slate-950/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("COMMAND")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === "COMMAND"
                ? "bg-orange-600/20 text-orange-400 border border-orange-500/40 shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Municipal Command & Map</span>
            {activeFires.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500/30 text-red-300 text-[10px] font-bold">
                {activeFires.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("COMMUNITY")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === "COMMUNITY"
                ? "bg-orange-600/20 text-orange-400 border border-orange-500/40 shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Public Community Reports</span>
            {pendingReports.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold">
                {pendingReports.length} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("SATELLITE_GRID")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === "SATELLITE_GRID"
                ? "bg-orange-600/20 text-orange-400 border border-orange-500/40 shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Thermal Sensors & Satellite Grid</span>
          </button>

          <button
            onClick={() => setActiveTab("ENFORCEMENT")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === "ENFORCEMENT"
                ? "bg-orange-600/20 text-orange-400 border border-orange-500/40 shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Enforcement & Fines</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
              ${(totalFines / 1000).toFixed(1)}k
            </span>
          </button>

          <button
            onClick={() => setActiveTab("AI_LAB")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === "AI_LAB"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Cpu className="h-4 w-4 text-amber-400" />
            <span>AI Plume & Forensic Lab</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold tracking-wider">
              GEMINI 3.7
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
