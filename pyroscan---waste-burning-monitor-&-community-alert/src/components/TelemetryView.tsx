import React, { useState } from "react";
import { 
  Radio, 
  Wind, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Thermometer, 
  Layers,
  ArrowUpRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { AirSensorStation, BurnIncident } from "../types";

interface TelemetryViewProps {
  sensors: AirSensorStation[];
  incidents: BurnIncident[];
  onSelectSensor: (sensor: AirSensorStation) => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  sensors,
  incidents,
  onSelectSensor,
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(sensors[0]?.id || "AQI-01");
  const selectedSensor = sensors.find(s => s.id === selectedStationId) || sensors[0];

  const activeHazardSensors = sensors.filter(s => s.status === "HAZARDOUS" || s.status === "ELEVATED");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>MUNICIPAL SENSOR TELEMETRY GRID (4G / LoRaWAN UPLINK)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Real-Time Air Quality & Illegal Burn Plume Spikes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Micro-sensor network correlating sudden PM2.5 and VOC anomalies directly to unauthorized refuse fires
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-slate-300">Network Synced (100% Operational)</span>
          </div>
        </div>
      </div>

      {/* Sensor Station Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor) => {
          const isSelected = selectedStationId === sensor.id;
          const isHazard = sensor.status === "HAZARDOUS";
          const isElevated = sensor.status === "ELEVATED";

          return (
            <div
              key={sensor.id}
              onClick={() => setSelectedStationId(sensor.id)}
              className={`bg-slate-900/90 border rounded-2xl p-4 shadow-xl cursor-pointer transition duration-200 ${
                isSelected
                  ? "border-orange-500 bg-slate-850 shadow-orange-950/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">{sensor.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isHazard 
                    ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                    : isElevated 
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}>
                  {sensor.status}
                </span>
              </div>

              <div className="text-sm font-bold text-white mt-2 truncate">
                {sensor.name}
              </div>

              <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400">AQI Index</div>
                  <div className={`text-2xl font-extrabold font-mono ${
                    isHazard ? "text-red-400" : isElevated ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {sensor.aqi}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">PM2.5</div>
                  <div className="text-base font-bold font-mono text-slate-200">
                    {sensor.pm25} <span className="text-[10px] text-slate-400">µg/m³</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Sensor Deep Dive Chart */}
      {selectedSensor && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{selectedSensor.name}</h2>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs">
                  {selectedSensor.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                24-Hour Particulate Matter (PM2.5) & AQI Trend Analysis
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400">CO:</span> <strong className="text-white font-mono">{selectedSensor.co} ppm</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400">NO2:</span> <strong className="text-white font-mono">{selectedSensor.no2} ppb</strong>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400">VOC:</span> <strong className="text-amber-400 font-mono">{selectedSensor.voc} idx</strong>
              </div>
            </div>
          </div>

          {/* Interactive Recharts Graph */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedSensor.history24h}>
                <defs>
                  <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    color: "#ffffff"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="pm25" 
                  name="PM2.5 (µg/m³)" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPm25)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="aqi" 
                  name="AQI Score" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAqi)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Spike Alert:</strong> Severe PM2.5 jump recorded between 06:30 AM and 07:00 AM matches thermal anomaly INC-2026-881 in East Industrial hub.
              </span>
            </div>
            <button
              onClick={() => onSelectSensor(selectedSensor)}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 transition"
            >
              Pinpoint on Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
