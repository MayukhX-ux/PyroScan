import React, { useState } from "react";
import { Header } from "./components/Header";
import { TacticalMap } from "./components/TacticalMap";
import { IncidentDetailModal } from "./components/IncidentDetailModal";
import { DroneReconModal } from "./components/DroneReconModal";
import { CommunityPortal } from "./components/CommunityPortal";
import { ReportSubmitModal } from "./components/ReportSubmitModal";
import { EnforcementLedger } from "./components/EnforcementLedger";
import { TelemetryView } from "./components/TelemetryView";
import { AiPlumeLab } from "./components/AiPlumeLab";
import { 
  INITIAL_INCIDENTS, 
  INITIAL_COMMUNITY_REPORTS, 
  INITIAL_SENSORS, 
  INITIAL_PATROL_UNITS, 
  INITIAL_ZONES 
} from "./data/mockData";
import { 
  BurnIncident, 
  CommunityReport, 
  AirSensorStation, 
  PatrolUnit, 
  MunicipalZone 
} from "./types";
import { 
  Flame, 
  ShieldAlert, 
  Filter, 
  Eye, 
  PlusCircle, 
  Radio, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Send,
  Camera
} from "lucide-react";
import confetti from "canvas-confetti";

export default function App() {
  const [activeTab, setActiveTab] = useState<"COMMAND" | "COMMUNITY" | "SATELLITE_GRID" | "ENFORCEMENT" | "AI_LAB">("COMMAND");
  
  // Data State
  const [incidents, setIncidents] = useState<BurnIncident[]>(INITIAL_INCIDENTS);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(INITIAL_COMMUNITY_REPORTS);
  const [sensors, setSensors] = useState<AirSensorStation[]>(INITIAL_SENSORS);
  const [patrols, setPatrols] = useState<PatrolUnit[]>(INITIAL_PATROL_UNITS);
  const [zones, setZones] = useState<MunicipalZone[]>(INITIAL_ZONES);

  // Map & Environmental parameters
  const [windAngle, setWindAngle] = useState(45); // North-East
  const [windSpeedKmh, setWindSpeedKmh] = useState(14);

  // Modals state
  const [selectedIncident, setSelectedIncident] = useState<BurnIncident | null>(null);
  const [selectedDroneIncident, setSelectedDroneIncident] = useState<BurnIncident | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Command View Filters
  const [incidentFilter, setIncidentFilter] = useState<string>("ALL");

  // Handler: Update incident status & append action log
  const handleUpdateStatus = (
    incidentId: string, 
    newStatus: BurnIncident["status"], 
    fine?: number, 
    logMessage?: string
  ) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const updatedLogs = logMessage ? [
          ...inc.actionLog,
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actor: "Municipal Command",
            action: logMessage
          }
        ] : inc.actionLog;

        return {
          ...inc,
          status: newStatus,
          fineAmountUSD: fine !== undefined ? fine : inc.fineAmountUSD,
          actionLog: updatedLogs
        };
      }
      return inc;
    }));

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? {
        ...prev,
        status: newStatus,
        fineAmountUSD: fine !== undefined ? fine : prev.fineAmountUSD
      } : null);
    }
  };

  // Handler: Assign Patrol Squad
  const handleAssignUnit = (incidentId: string, unitId: string) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, assignedUnit: unitId } : inc));
    setPatrols(prev => prev.map(p => {
      if (p.id === unitId) {
        return { ...p, status: "DISPATCHED", assignedIncidentId: incidentId };
      }
      return p;
    }));

    handleUpdateStatus(incidentId, "SQUAD_DISPATCHED", undefined, `Patrol unit ${unitId} dispatched to location.`);
  };

  // Handler: Upvote Community Report
  const handleUpvoteReport = (reportId: string) => {
    setCommunityReports(prev => prev.map(r => {
      if (r.id === reportId) {
        const wasUpvoted = r.hasUserUpvoted;
        return {
          ...r,
          upvotes: wasUpvoted ? r.upvotes - 1 : r.upvotes + 1,
          hasUserUpvoted: !wasUpvoted
        };
      }
      return r;
    }));
  };

  // Handler: Submit new Citizen Report
  const handleSubmitReport = (newRep: Partial<CommunityReport>) => {
    const reportId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullReport: CommunityReport = {
      id: reportId,
      title: newRep.title || "Open burning sighting",
      description: newRep.description || "",
      locationName: newRep.locationName || "Municipal Sector",
      coordinates: newRep.coordinates || { x: 50, y: 50, lat: 37.78, lng: -122.41 },
      materialReported: newRep.materialReported || "PLASTIC_PACKAGING",
      reportedBy: newRep.reportedBy || "Citizen Reporter",
      isAnonymous: !!newRep.isAnonymous,
      userReputation: newRep.userReputation || 85,
      timestamp: "Just now",
      status: "PENDING_VERIFICATION",
      photoUrl: newRep.photoUrl || "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
      upvotes: 1,
      hasUserUpvoted: true,
      smellDescription: newRep.smellDescription,
      aiVerification: newRep.aiVerification,
      rewardPointsAwarded: 100,
    };

    setCommunityReports(prev => [fullReport, ...prev]);

    // Also auto-create a linked active incident in the municipal queue
    const newIncident: BurnIncident = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: fullReport.title,
      locationName: fullReport.locationName,
      coordinates: fullReport.coordinates,
      zone: "zone-central-metro",
      detectedVia: "COMMUNITY_REPORT",
      materialType: fullReport.materialReported,
      severity: fullReport.aiVerification?.severity || "HIGH",
      status: "PENDING_VERIFICATION",
      reportedAt: "Just now",
      estimatedAreaM2: 40,
      temperatureCelsius: 480,
      plumeLengthM: 350,
      pm25Spike: 165,
      primaryToxins: ["Dioxins", "Particulate Soot", "Carbon Monoxide"],
      imageUrl: fullReport.photoUrl,
      communityConfirmations: 1,
      aiConfidence: fullReport.aiVerification?.authenticityScore || 92,
      description: fullReport.description,
      actionLog: [
        { timestamp: "Just now", actor: "Citizen Mobile Ingestion", action: `Report ${reportId} submitted by ${fullReport.reportedBy}.` }
      ]
    };

    setIncidents(prev => [newIncident, ...prev]);
  };

  // Handler: Simulate Live Thermal Flare Anomaly
  const handleTriggerSimulation = () => {
    const flareId = `INC-2026-${Math.floor(900 + Math.random() * 99)}`;
    const randomX = Math.floor(20 + Math.random() * 60);
    const randomY = Math.floor(20 + Math.random() * 55);

    const simulatedIncident: BurnIncident = {
      id: flareId,
      title: "Sudden High-Thermal Combustion Flare Detected",
      locationName: "Perimeter Industrial Buffer, Yard 4",
      coordinates: { x: randomX, y: randomY, lat: 37.785, lng: -122.405 },
      zone: "zone-east-industrial",
      detectedVia: "SATELLITE_VIIRS",
      materialType: "TIRES_RUBBER",
      severity: "CRITICAL",
      status: "PENDING_VERIFICATION",
      reportedAt: "Just now",
      estimatedAreaM2: 180,
      temperatureCelsius: 720,
      plumeLengthM: 780,
      pm25Spike: 410,
      primaryToxins: ["Dioxins", "Sulfur Dioxide", "Dense Soot Black Carbon"],
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
      thermalImageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1000&q=80",
      fineAmountUSD: 5000,
      violatorName: "Unregistered Industrial Occupant",
      communityConfirmations: 5,
      aiConfidence: 98,
      description: "Automated VIIRS infrared satellite scan detected high-intensity 42MW thermal anomaly matching open scrap tire incineration.",
      actionLog: [
        { timestamp: "Just now", actor: "VIIRS Satellite Feed", action: "Thermal anomaly detected (720°C core)." }
      ]
    };

    setIncidents(prev => [simulatedIncident, ...prev]);
    setSelectedIncident(simulatedIncident);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.2 },
      colors: ['#ef4444', '#ea580c']
    });
  };

  const filteredIncidents = incidents.filter(i => {
    if (incidentFilter === "ACTIVE") return i.status !== "RESOLVED_FINED" && i.status !== "FALSE_ALARM";
    if (incidentFilter === "CRITICAL") return i.severity === "CRITICAL";
    if (incidentFilter === "RESOLVED") return i.status === "RESOLVED_FINED";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        incidents={incidents}
        communityReports={communityReports}
        sensors={sensors}
        patrols={patrols}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onTriggerSimulation={handleTriggerSimulation}
      />

      {/* Main App Canvas / Dashboard Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "COMMAND" && (
          <div className="space-y-6">
            {/* Top Interactive Tactical Map Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>MUNICIPAL JURISDICTION TACTICAL SURVEILLANCE MAP</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Live Wind: {windAngle}° ({windSpeedKmh} km/h) • Plumes Auto-Calculated
                </div>
              </div>

              <TacticalMap
                incidents={incidents}
                sensors={sensors}
                patrols={patrols}
                communityReports={communityReports}
                zones={zones}
                selectedIncidentId={selectedIncident?.id}
                onSelectIncident={(inc) => setSelectedIncident(inc)}
                onSelectSensor={(sens) => setActiveTab("SATELLITE_GRID")}
                onSelectUnit={(unit) => {
                  const linkedInc = incidents.find(i => i.id === unit.assignedIncidentId);
                  if (linkedInc) setSelectedIncident(linkedInc);
                }}
                onSelectReport={(rep) => {
                  setActiveTab("COMMUNITY");
                }}
                windAngle={windAngle}
                windSpeedKmh={windSpeedKmh}
                onUpdateWind={(angle, speed) => {
                  setWindAngle(angle);
                  setWindSpeedKmh(speed);
                }}
              />
            </div>

            {/* Bottom Real-Time Incident Stream & Dispatch Queue */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-orange-500" />
                    Active Waste Burning Incidents & Rapid Response Queue
                  </h2>
                  <p className="text-xs text-slate-400">
                    Click any incident to open the command dossier, deploy drones, run AI plume spectrometry, or issue citations
                  </p>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-1 text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setIncidentFilter("ALL")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      incidentFilter === "ALL" 
                        ? "bg-orange-600 text-white font-bold" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All ({incidents.length})
                  </button>
                  <button
                    onClick={() => setIncidentFilter("ACTIVE")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      incidentFilter === "ACTIVE" 
                        ? "bg-orange-600 text-white font-bold" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Active ({incidents.filter(i => i.status !== "RESOLVED_FINED").length})
                  </button>
                  <button
                    onClick={() => setIncidentFilter("CRITICAL")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      incidentFilter === "CRITICAL" 
                        ? "bg-red-600 text-white font-bold" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Critical ({incidents.filter(i => i.severity === "CRITICAL").length})
                  </button>
                  <button
                    onClick={() => setIncidentFilter("RESOLVED")}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      incidentFilter === "RESOLVED" 
                        ? "bg-emerald-600 text-white font-bold" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Resolved ({incidents.filter(i => i.status === "RESOLVED_FINED").length})
                  </button>
                </div>
              </div>

              {/* Incidents Table / Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIncidents.map((incident) => {
                  const isCritical = incident.severity === "CRITICAL";
                  const isResolved = incident.status === "RESOLVED_FINED";

                  return (
                    <div
                      key={incident.id}
                      onClick={() => setSelectedIncident(incident)}
                      className={`bg-slate-950/80 border rounded-2xl p-4 shadow-xl hover:border-orange-500 cursor-pointer transition flex flex-col justify-between space-y-3 group ${
                        isCritical ? "border-red-900/60" : "border-slate-800"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {incident.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isResolved 
                              ? "bg-emerald-500/20 text-emerald-300" 
                              : isCritical 
                              ? "bg-red-500/20 text-red-300 animate-pulse" 
                              : "bg-orange-500/20 text-orange-300"
                          }`}>
                            {incident.severity}
                          </span>
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition line-clamp-1">
                          {incident.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2">
                          {incident.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span>Material: <strong className="text-amber-300">{incident.materialType.replace("_", " ")}</strong></span>
                          <span>Core: <strong className="text-red-400 font-mono">{incident.temperatureCelsius}°C</strong></span>
                        </div>
                      </div>

                      {/* Card Bottom Bar */}
                      <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                        <span className={`text-xs font-bold ${isResolved ? "text-emerald-400" : "text-orange-400"}`}>
                          {incident.status.replace("_", " ")}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDroneIncident(incident);
                            }}
                            title="Open Drone Recon Feed"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 transition"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIncident(incident);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow transition"
                          >
                            Dossier
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Public Community Reports Portal */}
        {activeTab === "COMMUNITY" && (
          <CommunityPortal
            reports={communityReports}
            onOpenSubmitModal={() => setIsReportModalOpen(true)}
            onUpvoteReport={handleUpvoteReport}
            onSelectReport={(rep) => {
              const matchingInc = incidents.find(i => i.title === rep.title || i.locationName === rep.locationName);
              if (matchingInc) {
                setSelectedIncident(matchingInc);
              }
            }}
          />
        )}

        {/* Satellite & Thermal Sensor Telemetry Grid */}
        {activeTab === "SATELLITE_GRID" && (
          <TelemetryView
            sensors={sensors}
            incidents={incidents}
            onSelectSensor={(sens) => {
              setActiveTab("COMMAND");
            }}
          />
        )}

        {/* Statutory Enforcement & Fines Ledger */}
        {activeTab === "ENFORCEMENT" && (
          <EnforcementLedger incidents={incidents} />
        )}

        {/* Gemini AI Plume & Forensic Lab */}
        {activeTab === "AI_LAB" && (
          <AiPlumeLab />
        )}
      </main>

      {/* Incident Detail Command Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          patrols={patrols}
          onClose={() => setSelectedIncident(null)}
          onUpdateStatus={handleUpdateStatus}
          onAssignUnit={handleAssignUnit}
          onOpenDroneFeed={(inc) => setSelectedDroneIncident(inc)}
        />
      )}

      {/* Live Drone Reconnaissance Cockpit Modal */}
      {selectedDroneIncident && (
        <DroneReconModal
          incident={selectedDroneIncident}
          onClose={() => setSelectedDroneIncident(null)}
        />
      )}

      {/* Public Report Submission Modal */}
      {isReportModalOpen && (
        <ReportSubmitModal
          onClose={() => setIsReportModalOpen(false)}
          onSubmitReport={handleSubmitReport}
        />
      )}
    </div>
  );
}
