import React, { useState, useRef } from "react";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Wind, 
  Flame, 
  Radio, 
  Navigation, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Sliders, 
  AlertOctagon, 
  MapPin, 
  Cpu, 
  Crosshair,
  Shield,
  Activity
} from "lucide-react";
import { 
  BurnIncident, 
  AirSensorStation, 
  PatrolUnit, 
  CommunityReport, 
  MunicipalZone 
} from "../types";

interface TacticalMapProps {
  incidents: BurnIncident[];
  sensors: AirSensorStation[];
  patrols: PatrolUnit[];
  communityReports: CommunityReport[];
  zones: MunicipalZone[];
  selectedIncidentId?: string | null;
  onSelectIncident: (incident: BurnIncident) => void;
  onSelectSensor: (sensor: AirSensorStation) => void;
  onSelectUnit: (unit: PatrolUnit) => void;
  onSelectReport: (report: CommunityReport) => void;
  windAngle: number; // in degrees (0 = North, 90 = East, 180 = South, 270 = West)
  windSpeedKmh: number;
  onUpdateWind: (angle: number, speed: number) => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  incidents,
  sensors,
  patrols,
  communityReports,
  zones,
  selectedIncidentId,
  onSelectIncident,
  onSelectSensor,
  onSelectUnit,
  onSelectReport,
  windAngle,
  windSpeedKmh,
  onUpdateWind,
}) => {
  const [layers, setLayers] = useState({
    activeFires: true,
    plumeDispersion: true,
    satelliteThermal: true,
    cctvTowers: true,
    sensors: true,
    patrolUnits: true,
    communityPins: true,
    zoneBoundaries: true,
    sensitiveFacilities: true,
  });

  const [mapMode, setMapMode] = useState<"TACTICAL_DARK" | "SATELLITE" | "THERMAL_FLIR">("TACTICAL_DARK");
  const [showWindControl, setShowWindControl] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Pre-calculated sensitive facilities (Schools, Hospitals, Eldercare)
  const SENSITIVE_FACILITIES = [
    { name: "St. Jude Metro Children's Hospital", x: 38, y: 58, type: "HOSPITAL" },
    { name: "North Valley Elementary School", x: 25, y: 30, type: "SCHOOL" },
    { name: "Eastgate Senior Living Village", x: 68, y: 46, type: "ELDERCARE" },
    { name: "Riverbend Community Sports Park", x: 50, y: 65, type: "PARK" }
  ];

  // Optical CCTV smoke detection camera towers
  const CCTV_TOWERS = [
    { id: "TOWER-01", name: "Tower 01 - North Agro Pylon", x: 22, y: 15, status: "SCANNING", rotation: 45 },
    { id: "TOWER-02", name: "Tower 02 - East Industrial Silo", x: 76, y: 22, status: "ALERT_LOCKED", rotation: 130 },
    { id: "TOWER-03", name: "Tower 03 - Canal Buffer Mast", x: 58, y: 78, status: "SCANNING", rotation: 270 },
    { id: "TOWER-04", name: "Tower 04 - Civic Center Roof", x: 32, y: 48, status: "SCANNING", rotation: 90 },
  ];

  // Helper to toggle layers
  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Convert wind degrees to radians
  const windRad = ((windAngle - 90) * Math.PI) / 180;
  // Calculate downwind offset for smoke plumes
  const plumeLengthFactor = Math.min(Math.max(windSpeedKmh * 1.8, 25), 80);

  return (
    <div 
      ref={mapContainerRef}
      className={`relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[620px] lg:h-[680px]"
      }`}
    >
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Map Mode Selector & Zone badge */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-lg">
          <button
            onClick={() => setMapMode("TACTICAL_DARK")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapMode === "TACTICAL_DARK"
                ? "bg-orange-600 text-white shadow-md shadow-orange-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tactical Grid
          </button>
          <button
            onClick={() => setMapMode("SATELLITE")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapMode === "SATELLITE"
                ? "bg-orange-600 text-white shadow-md shadow-orange-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Satellite View
          </button>
          <button
            onClick={() => setMapMode("THERMAL_FLIR")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapMode === "THERMAL_FLIR"
                ? "bg-red-700 text-white shadow-md shadow-red-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            FLIR Heatmap
          </button>
        </div>

        {/* Right: Wind Status Pill & Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Wind controller badge */}
          <button
            onClick={() => setShowWindControl(!showWindControl)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs text-slate-200 shadow-lg hover:border-slate-600 transition"
          >
            <div 
              className="w-4 h-4 flex items-center justify-center text-amber-400 transition-transform duration-300"
              style={{ transform: `rotate(${windAngle}deg)` }}
            >
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono font-medium text-amber-300">{windSpeedKmh} km/h</span>
            <span className="text-slate-400">
              {windAngle >= 337.5 || windAngle < 22.5 ? "N" :
               windAngle < 67.5 ? "NE" :
               windAngle < 112.5 ? "E" :
               windAngle < 157.5 ? "SE" :
               windAngle < 202.5 ? "S" :
               windAngle < 247.5 ? "SW" :
               windAngle < 292.5 ? "W" : "NW"}
            </span>
          </button>

          {/* Layer toggles dropdown trigger */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs text-slate-200 shadow-lg hover:bg-slate-800 transition"
            >
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>Layers</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-2.5 space-y-1.5 hidden group-hover:block z-30">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Display Overlays
              </div>
              <label className="flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/60 px-2 py-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-red-500" /> Active Burn Hotspots
                </span>
                <input 
                  type="checkbox" 
                  checked={layers.activeFires} 
                  onChange={() => toggleLayer("activeFires")}
                  className="rounded text-orange-600 bg-slate-800 border-slate-700 focus:ring-0" 
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/60 px-2 py-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-amber-400" /> Wind Plume Envelopes
                </span>
                <input 
                  type="checkbox" 
                  checked={layers.plumeDispersion} 
                  onChange={() => toggleLayer("plumeDispersion")}
                  className="rounded text-orange-600 bg-slate-800 border-slate-700 focus:ring-0" 
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/60 px-2 py-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" /> Air Sensor Telemetry
                </span>
                <input 
                  type="checkbox" 
                  checked={layers.sensors} 
                  onChange={() => toggleLayer("sensors")}
                  className="rounded text-orange-600 bg-slate-800 border-slate-700 focus:ring-0" 
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/60 px-2 py-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Patrols & Drone Recon
                </span>
                <input 
                  type="checkbox" 
                  checked={layers.patrolUnits} 
                  onChange={() => toggleLayer("patrolUnits")}
                  className="rounded text-orange-600 bg-slate-800 border-slate-700 focus:ring-0" 
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/60 px-2 py-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" /> Citizen Reports
                </span>
                <input 
                  type="checkbox" 
                  checked={layers.communityPins} 
                  onChange={() => toggleLayer("communityPins")}
                  className="rounded text-orange-600 bg-slate-800 border-slate-700 focus:ring-0" 
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/60 px-2 py-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> CCTV Smoke Towers
                </span>
                <input 
                  type="checkbox" 
                  checked={layers.cctvTowers} 
                  onChange={() => toggleLayer("cctvTowers")}
                  className="rounded text-orange-600 bg-slate-800 border-slate-700 focus:ring-0" 
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/60 px-2 py-1 rounded cursor-pointer">
                <span className="flex items-center gap-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-yellow-400" /> Sensitive Facilities
                </span>
                <input 
                  type="checkbox" 
                  checked={layers.sensitiveFacilities} 
                  onChange={() => toggleLayer("sensitiveFacilities")}
                  className="rounded text-orange-600 bg-slate-800 border-slate-700 focus:ring-0" 
                />
              </label>
            </div>
          </div>

          {/* Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white shadow-lg hover:bg-slate-800 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Wind & Atmospheric Simulator Panel */}
      {showWindControl && (
        <div className="absolute top-16 right-3 z-30 w-72 bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-xl p-4 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Wind className="w-4 h-4 text-amber-400" /> Wind & Plume Vector Control
            </span>
            <button 
              onClick={() => setShowWindControl(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Wind Direction</span>
              <span className="font-mono font-bold text-amber-400">{windAngle}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="359" 
              value={windAngle} 
              onChange={(e) => onUpdateWind(Number(e.target.value), windSpeedKmh)}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" 
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>N (0°)</span>
              <span>E (90°)</span>
              <span>S (180°)</span>
              <span>W (270°)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Wind Velocity</span>
              <span className="font-mono font-bold text-amber-400">{windSpeedKmh} km/h</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="45" 
              value={windSpeedKmh} 
              onChange={(e) => onUpdateWind(windAngle, Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" 
            />
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-800/80 p-2 rounded-lg border border-slate-700">
            Plumes calculate downwind toxic particle drift radius & alert sensitive facilities automatically.
          </div>
        </div>
      )}

      {/* Main Interactive SVG Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden select-none">
        <svg 
          viewBox="0 0 1000 650" 
          className={`w-full h-full object-cover transition-colors duration-500 ${
            mapMode === "THERMAL_FLIR" 
              ? "bg-[#0b0314]" 
              : mapMode === "SATELLITE" 
              ? "bg-[#11191f]" 
              : "bg-[#090d16]"
          }`}
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1" fill="rgba(148, 163, 184, 0.3)" />
            </pattern>

            {/* Plume gradients */}
            <linearGradient id="criticalPlumeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#ea580c" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#78350f" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="highPlumeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#eab308" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.6" />
            </linearGradient>

            {/* Radar Sweep Effect */}
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(249, 115, 22, 0.25)" />
              <stop offset="100%" stopColor="rgba(249, 115, 22, 0)" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="650" fill="url(#tacticalGrid)" />

          {/* Geographical features: River Channel */}
          <path
            d="M 0,220 C 250,260 380,180 520,310 C 650,420 800,380 1000,520 L 1000,560 C 800,420 650,460 520,350 C 380,220 250,300 0,260 Z"
            fill="url(#riverGrad)"
            stroke="#0284c7"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <text x="320" y="240" fill="#0284c7" fontSize="10" opacity="0.6" fontStyle="italic" letterSpacing="2">
            RIVER DELTA BASIN
          </text>

          {/* Highway Artery routes */}
          <path
            d="M 120,0 L 280,650"
            stroke="#334155"
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.7"
          />
          <path
            d="M 0,460 L 1000,280"
            stroke="#334155"
            strokeWidth="3"
            strokeDasharray="8,4"
            opacity="0.7"
          />
          <text x="190" y="320" fill="#64748b" fontSize="9" opacity="0.7" letterSpacing="1">
            HWY 101 ARTERIAL
          </text>

          {/* Municipal Zones Overlay */}
          {layers.zoneBoundaries && zones.map((zone) => {
            const pointsStr = zone.boundaryPoints
              .map(p => `${p.x * 10},${p.y * 6.5}`)
              .join(" ");

            const isHighRisk = zone.riskScore > 75;

            return (
              <g key={zone.id}>
                <polygon
                  points={pointsStr}
                  fill={
                    zone.type === "INDUSTRIAL" 
                      ? "rgba(220, 38, 38, 0.06)" 
                      : zone.type === "AGRICULTURAL"
                      ? "rgba(34, 197, 94, 0.05)"
                      : zone.type === "LANDFILL_BUFFER"
                      ? "rgba(234, 179, 8, 0.06)"
                      : "rgba(59, 130, 246, 0.04)"
                  }
                  stroke={
                    zone.type === "INDUSTRIAL" 
                      ? "rgba(239, 68, 68, 0.4)" 
                      : zone.type === "AGRICULTURAL"
                      ? "rgba(34, 197, 94, 0.4)"
                      : zone.type === "LANDFILL_BUFFER"
                      ? "rgba(234, 179, 8, 0.4)"
                      : "rgba(59, 130, 246, 0.3)"
                  }
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                {/* Zone Label */}
                <text
                  x={zone.boundaryPoints[0].x * 10 + 20}
                  y={zone.boundaryPoints[0].y * 6.5 + 25}
                  fill={isHighRisk ? "#fca5a5" : "#94a3b8"}
                  fontSize="11"
                  fontWeight="bold"
                  letterSpacing="0.5"
                  opacity="0.85"
                >
                  {zone.name}
                </text>
                <text
                  x={zone.boundaryPoints[0].x * 10 + 20}
                  y={zone.boundaryPoints[0].y * 6.5 + 40}
                  fill={isHighRisk ? "#ef4444" : "#64748b"}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  Risk: {zone.riskScore}/100 • {zone.activeIncidents} Active Fires
                </text>
              </g>
            );
          })}

          {/* Sensitive Facilities Markers */}
          {layers.sensitiveFacilities && SENSITIVE_FACILITIES.map((facility, idx) => (
            <g key={idx} transform={`translate(${facility.x * 10}, ${facility.y * 6.5})`}>
              <circle r="12" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
              <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#d97706" />
              <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                {facility.type === "HOSPITAL" ? "H" : facility.type === "SCHOOL" ? "S" : "!"}
              </text>
              <text x="14" y="4" fill="#fcd34d" fontSize="9" fontWeight="500">
                {facility.name}
              </text>
            </g>
          ))}

          {/* CCTV Smoke Detection Optical Towers */}
          {layers.cctvTowers && CCTV_TOWERS.map((tower) => (
            <g key={tower.id} transform={`translate(${tower.x * 10}, ${tower.y * 6.5})`}>
              {/* Camera vision cone */}
              <path
                d="M 0,0 L 60,-25 A 65 65 0 0 1 60,25 Z"
                fill="rgba(6, 182, 212, 0.08)"
                stroke="rgba(6, 182, 212, 0.3)"
                strokeWidth="0.8"
                transform={`rotate(${tower.rotation})`}
              />
              <polygon points="0,-8 7,7 -7,7" fill="#0891b2" stroke="#22d3ee" strokeWidth="1" />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
              <text x="12" y="3" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                {tower.id}
              </text>
            </g>
          ))}

          {/* Plume Dispersion Envelopes for Active Fires */}
          {layers.plumeDispersion && incidents.map((inc) => {
            if (inc.status === "RESOLVED_FINED" || inc.status === "FALSE_ALARM") return null;

            const cx = inc.coordinates.x * 10;
            const cy = inc.coordinates.y * 6.5;
            const isCritical = inc.severity === "CRITICAL";

            // Length and width of smoke cone based on wind and plume length
            const length = Math.max(inc.plumeLengthM / 5, 80);
            const spreadWidth = length * 0.45;

            return (
              <g key={`plume-${inc.id}`} transform={`translate(${cx}, ${cy}) rotate(${windAngle})`}>
                {/* 3-stage dispersion cone */}
                <path
                  d={`M 0,0 L ${length},-${spreadWidth} Q ${length * 1.2},0 ${length},${spreadWidth} Z`}
                  fill={isCritical ? "url(#criticalPlumeGrad)" : "url(#highPlumeGrad)"}
                />
                {/* Animated drift particles */}
                <circle cx={length * 0.3} cy={0} r="6" fill="#f97316" opacity="0.3">
                  <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${length * 0.1};${length * 0.8}`} dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={length * 0.5} cy="-10" r="10" fill="#ea580c" opacity="0.2">
                  <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${length * 0.2};${length * 0.9}`} dur="4s" repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          {/* Active Waste Fire Hotspots */}
          {layers.activeFires && incidents.map((inc) => {
            const cx = inc.coordinates.x * 10;
            const cy = inc.coordinates.y * 6.5;
            const isSelected = selectedIncidentId === inc.id;
            const isResolved = inc.status === "RESOLVED_FINED";
            const isCritical = inc.severity === "CRITICAL";

            return (
              <g 
                key={inc.id} 
                transform={`translate(${cx}, ${cy})`}
                onClick={() => onSelectIncident(inc)}
                className="cursor-pointer group"
              >
                {/* Pulsing Thermal Radar Waves for active fires */}
                {!isResolved && (
                  <>
                    <circle r={isCritical ? "32" : "24"} fill="none" stroke={isCritical ? "#ef4444" : "#f97316"} strokeWidth="1.5" opacity="0.4">
                      <animate attributeName="r" values="10;38" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle r="16" fill={isCritical ? "rgba(239, 68, 68, 0.35)" : "rgba(249, 115, 22, 0.3)"} />
                  </>
                )}

                {/* Selection Reticle */}
                {isSelected && (
                  <circle r="22" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
                )}

                {/* Fire Pin Core Icon */}
                <circle 
                  r="12" 
                  fill={
                    isResolved 
                      ? "#10b981" 
                      : isCritical 
                      ? "#dc2626" 
                      : inc.severity === "HIGH" 
                      ? "#ea580c" 
                      : "#d97706"
                  } 
                  stroke="#ffffff" 
                  strokeWidth="2"
                  className="transition-transform duration-200 group-hover:scale-125"
                />

                {/* Fire icon symbol */}
                <path
                  d="M 0,-6 C 2,-4 5,-1 3,3 C 2,5 -2,5 -3,3 C -5,-1 -2,-4 0,-6 Z"
                  fill="#ffffff"
                />

                {/* Incident Label Box */}
                <g transform="translate(16, -14)">
                  <rect
                    x="0"
                    y="0"
                    width="140"
                    height="32"
                    rx="6"
                    fill="rgba(15, 23, 42, 0.92)"
                    stroke={isCritical ? "#ef4444" : "#f97316"}
                    strokeWidth="1"
                    className="shadow-xl"
                  />
                  <text x="8" y="14" fill="#ffffff" fontSize="10" fontWeight="bold">
                    {inc.id}
                  </text>
                  <text x="80" y="14" fill={isCritical ? "#f87171" : "#fb923c"} fontSize="9" fontWeight="bold">
                    {inc.severity}
                  </text>
                  <text x="8" y="26" fill="#cbd5e1" fontSize="8" className="truncate">
                    {inc.materialType.replace("_", " ")} ({inc.temperatureCelsius}°C)
                  </text>
                </g>
              </g>
            );
          })}

          {/* Air Sensor Stations */}
          {layers.sensors && sensors.map((sensor) => {
            const sx = sensor.coordinates.x * 10;
            const sy = sensor.coordinates.y * 6.5;
            const isHazardous = sensor.aqi > 200;
            const isElevated = sensor.aqi > 100;

            return (
              <g
                key={sensor.id}
                transform={`translate(${sx}, ${sy})`}
                onClick={() => onSelectSensor(sensor)}
                className="cursor-pointer group"
              >
                <circle 
                  r="8" 
                  fill={isHazardous ? "#dc2626" : isElevated ? "#d97706" : "#059669"} 
                  stroke="#ffffff" 
                  strokeWidth="1.5"
                />
                <circle r="3" fill="#ffffff" />
                <g transform="translate(-30, 14)">
                  <rect x="0" y="0" width="60" height="18" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#475569" strokeWidth="0.8" />
                  <text x="30" y="12" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    AQI {sensor.aqi}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Municipal Patrol Units & Drone Recon */}
          {layers.patrolUnits && patrols.map((unit) => {
            const ux = unit.currentCoordinates.x * 10;
            const uy = unit.currentCoordinates.y * 6.5;
            const isDrone = unit.type === "DRONE_RECON_VAN";

            return (
              <g
                key={unit.id}
                transform={`translate(${ux}, ${uy})`}
                onClick={() => onSelectUnit(unit)}
                className="cursor-pointer group"
              >
                {/* Ping wave for dispatched unit */}
                {unit.status === "DISPATCHED" && (
                  <circle r="18" fill="none" stroke="#3b82f6" strokeWidth="1">
                    <animate attributeName="r" values="8;24" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}

                <rect
                  x="-8"
                  y="-8"
                  width="16"
                  height="16"
                  rx="4"
                  fill="#1d4ed8"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                />
                <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                  {isDrone ? "🚁" : "🚒"}
                </text>
                <text x="12" y="3" fill="#93c5fd" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  {unit.callsign.split(" ")[0]}
                </text>
              </g>
            );
          })}

          {/* Citizen Community Reports Pins */}
          {layers.communityPins && communityReports.map((report) => {
            const rx = report.coordinates.x * 10;
            const ry = report.coordinates.y * 6.5;

            return (
              <g
                key={report.id}
                transform={`translate(${rx}, ${ry})`}
                onClick={() => onSelectReport(report)}
                className="cursor-pointer group"
              >
                <path
                  d="M 0,0 L -5,-12 A 6 6 0 1 1 5,-12 Z"
                  fill="#9333ea"
                  stroke="#c084fc"
                  strokeWidth="1.2"
                />
                <circle cx="0" cy="-12" r="2.5" fill="#ffffff" />
                <g transform="translate(8, -16)" className="hidden group-hover:block">
                  <rect x="0" y="0" width="100" height="20" rx="4" fill="rgba(15, 23, 42, 0.95)" stroke="#c084fc" strokeWidth="0.8" />
                  <text x="6" y="13" fill="#e9d5ff" fontSize="8" fontWeight="bold">
                    Citizen: {report.id}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Bottom Left Legend Bar */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center flex-wrap gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 shadow-xl">
          <span className="font-semibold text-slate-400">Map Legend:</span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600"></span> Critical Burn
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span> High Severity
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Contained / Fined
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span> Patrol Unit
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-600"></span> Public Report
          </span>
        </div>
      </div>
    </div>
  );
};
