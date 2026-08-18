import React, { useState } from "react";
import { 
  X, 
  Flame, 
  AlertTriangle, 
  MapPin, 
  Thermometer, 
  Wind, 
  ShieldCheck, 
  Send, 
  Cpu, 
  DollarSign, 
  FileCheck, 
  Radio, 
  Camera, 
  CheckCircle2, 
  Sparkles,
  Users,
  ChevronRight
} from "lucide-react";
import { BurnIncident, PatrolUnit, AIAnalysisResult, HazardSeverity } from "../types";
import { requestBurnAnalysis, requestDispatchBriefing } from "../utils/aiService";

interface IncidentDetailModalProps {
  incident: BurnIncident;
  patrols: PatrolUnit[];
  onClose: () => void;
  onUpdateStatus: (incidentId: string, newStatus: BurnIncident["status"], fine?: number, logMessage?: string) => void;
  onAssignUnit: (incidentId: string, unitId: string) => void;
  onOpenDroneFeed: (incident: BurnIncident) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  patrols,
  onClose,
  onUpdateStatus,
  onAssignUnit,
  onOpenDroneFeed,
}) => {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "AI_ASSESSMENT" | "DISPATCH_BRIEF" | "CITATION">("OVERVIEW");
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [dispatchBrief, setDispatchBrief] = useState<any>(null);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [customFineAmount, setCustomFineAmount] = useState<number>(incident.fineAmountUSD || 2500);
  const [violatorInput, setViolatorInput] = useState<string>(incident.violatorName || "Unknown Occupant / Landowner");
  const [newLogText, setNewLogText] = useState("");
  const [alertSent, setAlertSent] = useState(false);

  // Trigger Gemini AI Plume & Hazard Analysis
  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const result = await requestBurnAnalysis({
        description: incident.description,
        materialHint: incident.materialType,
        locationName: incident.locationName,
        aqiValue: incident.pm25Spike,
      });
      setAiAnalysis(result);
      if (result.estimatedFineUSD) {
        setCustomFineAmount(result.estimatedFineUSD);
      }
      setActiveTab("AI_ASSESSMENT");
    } finally {
      setLoadingAi(false);
    }
  };

  // Trigger Gemini AI Squad Dispatch Briefing
  const handleGenerateBriefing = async () => {
    setLoadingBrief(true);
    try {
      const brief = await requestDispatchBriefing({
        incidentId: incident.id,
        location: incident.locationName,
        materials: incident.materialType,
      });
      setDispatchBrief(brief);
      setActiveTab("DISPATCH_BRIEF");
    } finally {
      setLoadingBrief(false);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;
    onUpdateStatus(incident.id, incident.status, undefined, `Municipal Dispatcher: ${newLogText.trim()}`);
    setNewLogText("");
  };

  const handleIssueCitation = () => {
    onUpdateStatus(
      incident.id, 
      "RESOLVED_FINED", 
      customFineAmount, 
      `Statutory Citation issued to ${violatorInput} for $${customFineAmount.toLocaleString()} USD under Clean Air Act Section 14-B.`
    );
    alert(`Official Municipal Violation Citation #${incident.id}-FINE has been logged and registered against ${violatorInput}.`);
  };

  const handleBroadcastAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 4000);
  };

  const isCritical = incident.severity === "CRITICAL";
  const isResolved = incident.status === "RESOLVED_FINED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden text-slate-100 my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isCritical ? "bg-red-950/40 border-red-800/60" : "bg-slate-800/80 border-slate-700"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isResolved 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : isCritical 
                ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
            }`}>
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {incident.id}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isCritical 
                    ? "bg-red-500/20 text-red-300 border border-red-500/40" 
                    : incident.severity === "HIGH"
                    ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                }`}>
                  {incident.severity} HAZARD
                </span>
                <span className="text-xs text-slate-400">
                  Detected via {incident.detectedVia.replace("_", " ")} • {incident.reportedAt}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {incident.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs Sub-Header */}
        <div className="border-b border-slate-800 bg-slate-950/40 px-6 flex items-center justify-between flex-wrap gap-2 py-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("OVERVIEW")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "OVERVIEW"
                  ? "bg-orange-600/20 text-orange-300 border border-orange-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Incident Dossier
            </button>
            <button
              onClick={() => {
                if (!aiAnalysis) handleRunAiAnalysis();
                else setActiveTab("AI_ASSESSMENT");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "AI_ASSESSMENT"
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Plume Analysis</span>
              {loadingAi && <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />}
            </button>
            <button
              onClick={() => {
                if (!dispatchBrief) handleGenerateBriefing();
                else setActiveTab("DISPATCH_BRIEF");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "DISPATCH_BRIEF"
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <span>Squad Briefing</span>
              {loadingBrief && <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-400" />}
            </button>
            <button
              onClick={() => setActiveTab("CITATION")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "CITATION"
                  ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statutory Citation</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDroneFeed(incident)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Drone Recon Cockpit</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === "OVERVIEW" && (
            <div className="space-y-6">
              {/* Media Preview & Quick Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Photo Evidence with FLIR toggle preview */}
                <div className="md:col-span-1 space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-48 bg-slate-950 group">
                    <img 
                      src={incident.imageUrl} 
                      alt="Burn incident evidence" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                      GPS Tagged Evidence
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-red-600/90 text-[10px] font-bold text-white">
                      {incident.temperatureCelsius}°C Core
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Material:</span>
                    <span className="font-semibold text-amber-300">
                      {incident.materialType.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Burn Area:</span>
                    <span className="font-semibold text-white">~{incident.estimatedAreaM2} m²</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Plume Drift:</span>
                    <span className="font-semibold text-white">{incident.plumeLengthM} meters downwind</span>
                  </div>
                </div>

                {/* Telemetry & Toxins breakdown */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Thermometer className="w-3.5 h-3.5 text-red-400" />
                        <span>Thermal Core</span>
                      </div>
                      <div className="text-xl font-bold text-white mt-1 font-mono">
                        {incident.temperatureCelsius}°C
                      </div>
                      <div className="text-[10px] text-red-400 mt-0.5">Pyrolysis active</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Wind className="w-3.5 h-3.5 text-amber-400" />
                        <span>PM2.5 Surge</span>
                      </div>
                      <div className="text-xl font-bold text-amber-300 mt-1 font-mono">
                        +{incident.pm25Spike} µg/m³
                      </div>
                      <div className="text-[10px] text-amber-400 mt-0.5">Severe spike</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>Citizen Alerts</span>
                      </div>
                      <div className="text-xl font-bold text-purple-300 mt-1 font-mono">
                        {incident.communityConfirmations} Reports
                      </div>
                      <div className="text-[10px] text-purple-400 mt-0.5">Corroborated</div>
                    </div>
                  </div>

                  {/* Primary Toxic Compounds emitted */}
                  <div className="bg-slate-800/60 border border-slate-700/80 p-3.5 rounded-xl space-y-2">
                    <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Identified Hazardous Emissions:
                      </span>
                      <span className="text-[11px] text-slate-400">Atmospheric hazard</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {incident.primaryToxins.map((toxin, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/50 text-red-300 text-xs font-medium"
                        >
                          ⚠ {toxin}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operational Status Control Bar */}
                  <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="text-xs text-slate-400">Current Incident Status:</div>
                      <div className="font-bold text-orange-400 text-sm">
                        {incident.status.replace("_", " ")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => onUpdateStatus(incident.id, "DRONE_RECON", undefined, "Drone reconnaissance squad dispatched.")}
                        className="px-3 py-1.5 rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 text-xs font-medium border border-cyan-700/50 transition"
                      >
                        Deploy Drone
                      </button>
                      <button
                        onClick={() => onUpdateStatus(incident.id, "UNDER_SUPPRESSION", undefined, "Ground team initiating fire suppression.")}
                        className="px-3 py-1.5 rounded-lg bg-orange-700 hover:bg-orange-600 text-white text-xs font-medium shadow transition"
                      >
                        Under Suppression
                      </button>
                      <button
                        onClick={() => onUpdateStatus(incident.id, "RESOLVED_FINED", customFineAmount, "Burn completely extinguished. Violation notice issued.")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium shadow transition"
                      >
                        Resolve & Issue Fine
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assign Patrol Squad & Public Broadcast */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patrol Dispatch Selector */}
                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" /> Assigned Municipal Patrol Unit
                    </span>
                    <span className="text-xs text-slate-400">
                      {incident.assignedUnit || "Unassigned"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {patrols.map((unit) => {
                      const isCurrent = incident.assignedUnit === unit.id;
                      return (
                        <div 
                          key={unit.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg border transition ${
                            isCurrent
                              ? "bg-blue-950/40 border-blue-600 text-blue-200"
                              : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold">{unit.callsign}</div>
                            <div className="text-[10px] text-slate-400">
                              Status: {unit.status.replace("_", " ")} • Battery: {unit.batteryOrFuelPercent}%
                            </div>
                          </div>
                          <button
                            onClick={() => onAssignUnit(incident.id, unit.id)}
                            disabled={isCurrent}
                            className={`px-2.5 py-1 rounded text-xs font-semibold ${
                              isCurrent
                                ? "bg-blue-600 text-white cursor-default"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                            }`}
                          >
                            {isCurrent ? "Assigned" : "Reassign"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Downwind Neighborhood Alert Broadcaster */}
                <div className="bg-slate-800/70 border border-slate-700 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Wind className="w-4 h-4 text-amber-400" /> Downwind Public Safety Broadcast
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">SMS / Siren / App Push</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Automated push notification to all citizens within <strong>{incident.plumeLengthM}m</strong> downwind radius advising indoor sheltering and HVAC air intake filtration.
                  </p>
                  <button
                    onClick={handleBroadcastAlert}
                    disabled={alertSent}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                      alertSent 
                        ? "bg-emerald-600 text-white" 
                        : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950"
                    }`}
                  >
                    {alertSent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Broadcast Sent to 1,420 Residents!
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Broadcast Downwind Air Advisory Now
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action History & Officer Log */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Municipal Action Log & Chain of Custody
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {incident.actionLog.map((log, idx) => (
                    <div key={idx} className="text-xs flex items-start gap-2 text-slate-300">
                      <span className="font-mono text-slate-500 shrink-0">{log.timestamp}</span>
                      <span className="font-semibold text-orange-400 shrink-0">{log.actor}:</span>
                      <span className="text-slate-300">{log.action}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddLog} className="flex gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={newLogText}
                    onChange={(e) => setNewLogText(e.target.value)}
                    placeholder="Enter dispatch notes, officer badge ID, or containment updates..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Append Log
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* AI Plume & Toxic Forensics Tab */}
          {activeTab === "AI_ASSESSMENT" && (
            <div className="space-y-4">
              <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-purple-800/40">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="text-sm font-bold text-purple-200">
                        Gemini 3.7 Flash Plume Forensic Analysis
                      </h3>
                      <p className="text-xs text-purple-400">
                        AI Spectrometry, Thermodynamics & Statutory Assessment
                      </p>
                    </div>
                  </div>
                  {aiAnalysis && (
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
                      Confidence: {aiAnalysis.confidenceScore}%
                    </span>
                  )}
                </div>

                {loadingAi ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-purple-300">
                    <Sparkles className="w-8 h-8 animate-spin text-purple-400" />
                    <p className="text-xs font-medium">Analyzing plume spectral signature & toxic dispersion model...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-purple-900/60">
                        <span className="text-slate-400">Plume Classification:</span>
                        <div className="font-bold text-purple-200 text-sm mt-0.5">
                          {aiAnalysis.plumeClassification}
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-purple-900/60">
                        <span className="text-slate-400">Hazard Category:</span>
                        <div className="font-bold text-red-400 text-sm mt-0.5">
                          {aiAnalysis.hazardLevel}
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-purple-900/60">
                        <span className="text-slate-400">Statutory Fine Rec.:</span>
                        <div className="font-bold text-emerald-400 text-sm mt-0.5 font-mono">
                          ${aiAnalysis.estimatedFineUSD.toLocaleString()} USD
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-purple-900/60 space-y-1.5">
                      <div className="font-semibold text-slate-300">Tactical Squad Direction:</div>
                      <p className="text-slate-200 leading-relaxed">{aiAnalysis.recommendedAction}</p>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-purple-900/60 space-y-1.5">
                      <div className="font-semibold text-slate-300">Public Health Advisory:</div>
                      <p className="text-amber-300 leading-relaxed">{aiAnalysis.publicSafetyAdvisory}</p>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-purple-900/60 space-y-1.5">
                      <div className="font-semibold text-slate-300">AI Forensic Rationale:</div>
                      <p className="text-slate-400 leading-relaxed italic">{aiAnalysis.rationale}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <button
                      onClick={handleRunAiAnalysis}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-950 transition"
                    >
                      Run Full AI Plume Spectrum Analysis
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Squad Dispatch Tactical Briefing Tab */}
          {activeTab === "DISPATCH_BRIEF" && (
            <div className="space-y-4">
              <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-800/40">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-sm font-bold text-blue-200">
                        Tactical Patrol Dispatch Briefing
                      </h3>
                      <p className="text-xs text-blue-400">
                        Operational orders for Interceptor Squad & Drone Recon
                      </p>
                    </div>
                  </div>
                </div>

                {loadingBrief ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-blue-300">
                    <Sparkles className="w-8 h-8 animate-spin text-blue-400" />
                    <p className="text-xs font-medium">Synthesizing upwind routing, gear checklists & legal steps...</p>
                  </div>
                ) : dispatchBrief ? (
                  <div className="mt-4 space-y-4 text-xs">
                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-blue-900/60">
                      <span className="text-slate-400 font-semibold">Approach & Upwind Routing:</span>
                      <p className="text-slate-200 mt-1">{dispatchBrief.routeAdvisory}</p>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-blue-900/60">
                      <span className="text-slate-400 font-semibold">Required Equipment & Respirators:</span>
                      <ul className="mt-1 list-disc list-inside space-y-1 text-slate-300">
                        {dispatchBrief.equipmentNeeded?.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-blue-900/60">
                      <span className="text-slate-400 font-semibold">Containment & Suppression Tactics:</span>
                      <p className="text-slate-200 mt-1">{dispatchBrief.containmentTactics}</p>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-blue-900/60">
                      <span className="text-slate-400 font-semibold">Statutory Legal Enforcement Step:</span>
                      <p className="text-amber-300 mt-1">{dispatchBrief.legalEnforcementStep}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <button
                      onClick={handleGenerateBriefing}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-950 transition"
                    >
                      Generate AI Dispatch Briefing
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statutory Violation Citation Tab */}
          {activeTab === "CITATION" && (
            <div className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-emerald-800/40">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-200">
                      Municipal Statutory Violation Notice & Penalty Calculator
                    </h3>
                    <p className="text-xs text-emerald-400">
                      Clean Air & Municipal Solid Waste Enforcement Code § 44-B
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Identified Violator / Property Titleholder:
                    </label>
                    <input
                      type="text"
                      value={violatorInput}
                      onChange={(e) => setViolatorInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">
                      Statutory Fine Amount (USD):
                    </label>
                    <input
                      type="number"
                      step="250"
                      value={customFineAmount}
                      onChange={(e) => setCustomFineAmount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-white uppercase tracking-wider">Citation Summary:</div>
                  <div className="text-slate-300">
                    <strong>Violation:</strong> Unlawful open incineration of {incident.materialType.replace("_", " ")} creating public nuisance & airborne dioxin emission.
                  </div>
                  <div className="text-slate-300">
                    <strong>Evidence:</strong> GPS thermal satellite timestamp #{incident.id}, Optical CCTV logs, and {incident.communityConfirmations} verified citizen affidavits.
                  </div>
                  <div className="text-slate-300">
                    <strong>Location:</strong> {incident.locationName}
                  </div>
                </div>

                <button
                  onClick={handleIssueCitation}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Issue Statutory Citation & Register in Enforcement Ledger</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
