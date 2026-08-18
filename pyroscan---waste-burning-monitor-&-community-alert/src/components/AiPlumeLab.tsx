import React, { useState } from "react";
import { 
  Cpu, 
  Sparkles, 
  Upload, 
  Flame, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Wind,
  Activity
} from "lucide-react";
import { SAMPLE_BURN_IMAGES } from "../data/mockData";
import { requestBurnAnalysis } from "../utils/aiService";
import { AIAnalysisResult } from "../types";

export const AiPlumeLab: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_BURN_IMAGES[0].url);
  const [materialType, setMaterialType] = useState("TIRES_RUBBER");
  const [locationName, setLocationName] = useState("Industrial Sector Perimeter");
  const [description, setDescription] = useState("Dense thick black smoke rising from open burning pile of rubber scrap and insulated cables.");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const result = await requestBurnAnalysis({
        description,
        materialHint: materialType,
        locationName,
        imageBase64: selectedImage,
      });
      setAnalysisResult(result);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold w-fit">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>GEMINI 3.7 FLASH MULTIMODAL FORENSICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Smoke Plume & Toxic Emission Spectrometry Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Upload aerial drone photos, CCTV smoke stills, or citizen camera uploads. The multimodal AI model analyzes plume opacity, combustion thermodynamics, toxic chemical signature, and calculates statutory municipal fines.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-950 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
        >
          {analyzing ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Analyzing Spectral Data...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Run Multimodal Forensic Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Input Studio & Output Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Image Selector & Parameters */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-purple-400" />
            Input Evidence & Combustion Context
          </h2>

          {/* Photo Preview & Upload */}
          <div className="space-y-3">
            <div className="h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 relative">
              <img
                src={selectedImage}
                alt="Selected burn evidence"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-white">
                Multimodal Input Feed
              </div>
            </div>

            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Upload Custom Image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Presets */}
            <div>
              <span className="text-xs text-slate-400 font-semibold">Or analyze sample cases:</span>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {SAMPLE_BURN_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img.url);
                      setMaterialType(img.material);
                      setDescription(img.hint);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      selectedImage === img.url
                        ? "bg-purple-950/40 border-purple-500 text-purple-200"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold truncate">{img.name}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{img.material}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Context Inputs */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Reported Material Clue:
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="TIRES_RUBBER">Automotive Scrap Tires & Rubber</option>
                <option value="PLASTIC_PACKAGING">Polyethylene & PVC Plastic Packaging</option>
                <option value="AGRICULTURAL_STUBBLE">Paddy Straw & Crop Biomass</option>
                <option value="CONSTRUCTION_DEBRIS">Treated Wood & Synthetic Adhesives</option>
                <option value="MUNICIPAL_SOLID_WASTE">Mixed Municipal Landfill Waste</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Visual Smoke Characteristics & Odor Note:
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: AI Forensic Output Dossier */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Forensic Spectrometry Assessment
              </h2>
              {analysisResult && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                  {analysisResult.confidenceScore}% Confidence
                </span>
              )}
            </div>

            {analyzing ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4 text-purple-300">
                <Sparkles className="w-10 h-10 animate-spin text-purple-400" />
                <div className="text-center">
                  <div className="text-sm font-bold text-white">Gemini 3.7 Flash Model Running...</div>
                  <div className="text-xs text-slate-400 mt-1">Analyzing soot black carbon fraction & dioxin release risk</div>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400">Combustion Category:</span>
                    <div className="text-sm font-bold text-purple-200 mt-0.5">
                      {analysisResult.plumeClassification}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400">Hazard Level:</span>
                    <div className="text-sm font-bold text-red-400 mt-0.5">
                      {analysisResult.hazardLevel} RISK
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400">Plume Hazard Radius:</span>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {analysisResult.plumeDispersionRadiusM} meters
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-slate-400">Statutory Fine Rec.:</span>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      ${analysisResult.estimatedFineUSD.toLocaleString()} USD
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="font-semibold text-slate-300">Toxic Chemical Compounds Identified:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.primaryToxins.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/50 text-red-300 text-[11px]">
                        ⚠ {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-300">Tactical Squad Action Plan:</div>
                  <p className="text-slate-200 leading-relaxed">{analysisResult.recommendedAction}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-slate-300">Community Safety Advisory:</div>
                  <p className="text-amber-300 leading-relaxed">{analysisResult.publicSafetyAdvisory}</p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs space-y-3">
                <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
                <p>Click "Run Multimodal Forensic Scan" to analyze the current evidence image with Gemini 3.7 Flash.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
