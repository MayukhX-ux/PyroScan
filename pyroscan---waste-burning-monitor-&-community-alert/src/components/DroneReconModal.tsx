import React, { useState, useEffect } from "react";
import { 
  X, 
  Camera, 
  Crosshair, 
  Battery, 
  Radio, 
  Eye, 
  Compass, 
  Maximize2, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders
} from "lucide-react";
import { BurnIncident } from "../types";

interface DroneReconModalProps {
  incident: BurnIncident;
  onClose: () => void;
}

export const DroneReconModal: React.FC<DroneReconModalProps> = ({
  incident,
  onClose,
}) => {
  const [thermalMode, setThermalMode] = useState(false);
  const [zoom, setZoom] = useState(2);
  const [altitude, setAltitude] = useState(88);
  const [battery, setBattery] = useState(76);
  const [targetLocked, setTargetLocked] = useState(true);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [dropletDeployed, setDropletDeployed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude(prev => Math.min(Math.max(prev + (Math.random() * 2 - 1), 75), 110));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 3000);
  };

  const handleDeployDroplet = () => {
    setDropletDeployed(true);
    setTimeout(() => setDropletDeployed(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
      <div className="bg-slate-950 border border-cyan-500/50 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden text-slate-100 flex flex-col h-[85vh] animate-in zoom-in-95 duration-200 relative">
        {/* Cockpit Top Bar */}
        <div className="bg-slate-900/90 border-b border-cyan-500/30 px-6 py-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>LIVE UPLINK: AEROSCAN-DRONE-02</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              TARGET: {incident.id} ({incident.locationName})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Battery className="w-4 h-4 text-emerald-400" />
              <span>{battery}% BAT</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Screen with Drone HUD Overlay */}
        <div className="relative flex-1 bg-black overflow-hidden select-none flex items-center justify-center">
          {/* Base Video / Image */}
          <img
            src={thermalMode ? (incident.thermalImageUrl || incident.imageUrl) : incident.imageUrl}
            alt="Drone camera feed"
            className={`w-full h-full object-cover transition duration-300 ${
              thermalMode ? "filter hue-rotate-90 contrast-150 brightness-110" : ""
            }`}
            style={{ transform: `scale(${zoom})` }}
            referrerPolicy="no-referrer"
          />

          {/* FLIR Color filter overlay if active */}
          {thermalMode && (
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-red-600/20 to-yellow-400/20 mix-blend-color pointer-events-none" />
          )}

          {/* HUD Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Center Target Box */}
            <div className="relative w-48 h-48 border-2 border-cyan-400/60 rounded-xl flex items-center justify-center">
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

              <Crosshair className="w-12 h-12 text-cyan-400/80 animate-spin-slow" />

              {/* Thermal Core Readout */}
              <div className="absolute bottom-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-red-400 font-bold border border-red-500/40">
                CORE: {incident.temperatureCelsius}°C
              </div>
            </div>

            {/* Artificial Horizon Lines */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 text-[10px] font-mono text-cyan-400/70">
              <span>+30°</span>
              <span>+15°</span>
              <span className="text-cyan-300 font-bold">--- 0° HORIZON ---</span>
              <span>-15°</span>
              <span>-30°</span>
            </div>

            {/* Altitude & Speed on Right */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-cyan-500/30 text-xs font-mono space-y-1 text-cyan-300">
              <div>ALT: <strong className="text-white">{altitude.toFixed(1)}m</strong></div>
              <div>SPD: <strong className="text-white">34.2 km/h</strong></div>
              <div>WIND: <strong className="text-amber-400">14 km/h NE</strong></div>
              <div>AREA: <strong className="text-white">{incident.estimatedAreaM2}m²</strong></div>
            </div>

            {/* Top Compass Heading */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/75 px-4 py-1 rounded-full border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>HDG: 042° NNE • GPS: 37.7842° N, 122.3921° W</span>
            </div>
          </div>

          {/* Flash Snapshot Notification */}
          {snapshotTaken && (
            <div className="absolute top-6 left-6 z-30 bg-emerald-600/90 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xl animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4" />
              <span>Geotagged High-Res Evidence Snapshot Saved to Ledger!</span>
            </div>
          )}

          {/* Droplet Deployed Notification */}
          {dropletDeployed && (
            <div className="absolute top-6 right-6 z-30 bg-cyan-600/90 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xl animate-in fade-in duration-150">
              <Zap className="w-4 h-4" />
              <span>Eco-Foam Retardant Droplet Released onto Core!</span>
            </div>
          )}
        </div>

        {/* Bottom Cockpit Controller Dock */}
        <div className="bg-slate-900 border-t border-cyan-500/30 p-4 flex flex-wrap items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setThermalMode(!thermalMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                thermalMode
                  ? "bg-red-600 text-white shadow-lg shadow-red-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{thermalMode ? "FLIR Thermal: ON" : "FLIR Thermal: OFF"}</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs text-slate-300">
              <span className="px-2 text-slate-400">Zoom:</span>
              <button
                onClick={() => setZoom(1)}
                className={`px-2 py-1 rounded-lg ${zoom === 1 ? "bg-cyan-600 text-white font-bold" : "hover:bg-slate-700"}`}
              >
                1x
              </button>
              <button
                onClick={() => setZoom(2)}
                className={`px-2 py-1 rounded-lg ${zoom === 2 ? "bg-cyan-600 text-white font-bold" : "hover:bg-slate-700"}`}
              >
                2x
              </button>
              <button
                onClick={() => setZoom(4)}
                className={`px-2 py-1 rounded-lg ${zoom === 4 ? "bg-cyan-600 text-white font-bold" : "hover:bg-slate-700"}`}
              >
                4x
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTakeSnapshot}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Snap Legal Photo</span>
            </button>

            <button
              onClick={handleDeployDroplet}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950 flex items-center gap-1.5 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Deploy Foam Suppressant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
