import React, { useState } from "react";
import { 
  X, 
  Camera, 
  MapPin, 
  Flame, 
  Wind, 
  Sparkles, 
  Upload, 
  Shield, 
  AlertCircle, 
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import confetti from "canvas-confetti";
import { CommunityReport, WasteMaterialType, Coordinates } from "../types";
import { SAMPLE_BURN_IMAGES } from "../data/mockData";
import { requestReportVerification } from "../utils/aiService";

interface ReportSubmitModalProps {
  onClose: () => void;
  onSubmitReport: (report: Partial<CommunityReport>) => void;
}

export const ReportSubmitModal: React.FC<ReportSubmitModalProps> = ({
  onClose,
  onSubmitReport,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [material, setMaterial] = useState<WasteMaterialType>("PLASTIC_PACKAGING");
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_BURN_IMAGES[1].url);
  const [smell, setSmell] = useState("Pungent melting plastic chemical odor");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState("Alex Rivers");
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates>({
    x: 52,
    y: 48,
    lat: 37.7782,
    lng: -122.4085,
  });

  const [aiVerifying, setAiVerifying] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Run instant AI verification preview
  const handleVerifyWithAi = async () => {
    if (!description.trim() && !title.trim()) {
      alert("Please provide a title or description first.");
      return;
    }
    setAiVerifying(true);
    try {
      const result = await requestReportVerification({
        title: title || "Open waste combustion sighting",
        description: description || "Burning observed with dense toxic plume.",
        locationName: locationName || "Central Municipal Sector",
        category: material,
      });
      setAiResult(result);
    } finally {
      setAiVerifying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) {
      alert("Please provide both a title and location for the report.");
      return;
    }

    const newReport: Partial<CommunityReport> = {
      title: title.trim(),
      description: description.trim() || "Unregulated open waste burning reported by citizen.",
      locationName: locationName.trim(),
      coordinates: selectedCoordinates,
      materialReported: material,
      reportedBy: isAnonymous ? "Anonymous Citizen" : reporterName.trim() || "Civic Watch Member",
      isAnonymous,
      userReputation: isAnonymous ? 70 : 92,
      timestamp: "Just now",
      status: "PENDING_VERIFICATION",
      photoUrl,
      upvotes: 1,
      hasUserUpvoted: true,
      smellDescription: smell,
      aiVerification: aiResult || {
        authenticityScore: 94,
        isLikelyIllegalBurn: true,
        detectedCategory: material.replace("_", " "),
        severity: "HIGH",
        autoTags: ["Fresh Submission", "Geotagged", "High Urgency"],
        actionableSummary: "Citizen report verified by municipal automated ingestion pipeline.",
        investigationChecklist: ["Verify landowner identity", "Deploy nearest warden unit"]
      },
      rewardPointsAwarded: 100
    };

    onSubmitReport(newReport);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Submit Illegal Waste Burning Report
              </h2>
              <p className="text-xs text-slate-400">
                Help city environmental enforcement locate & extinguish hazardous fires
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Title & Material Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Incident Title / Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Heavy toxic smoke from plastic burning behind warehouse"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Material Combustion Type *
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as WasteMaterialType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="PLASTIC_PACKAGING">Plastics & Synthetic Packaging</option>
                  <option value="TIRES_RUBBER">Tires & Automotive Scrap Rubber</option>
                  <option value="AGRICULTURAL_STUBBLE">Agricultural Crop Stubble / Straw</option>
                  <option value="CONSTRUCTION_DEBRIS">Construction Timber & Foam Debris</option>
                  <option value="MUNICIPAL_SOLID_WASTE">Mixed Household Waste Dump</option>
                  <option value="E_WASTE_CABLES">Electronic Scrap & Wire Burning</option>
                  <option value="CHEMICAL_HAZARD">Chemical Residue / Solvent Barrels</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Location / Address / Landmark *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g., Lot 88, Old River Rd near Bridge"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <MapPin className="w-4 h-4 text-orange-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Detailed Observation & Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe plume color, whether flame is active or smoldering, nearby people affected, or vehicle license plates seen..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </div>

          {/* Photo Evidence Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300">
              Visual Evidence (Photo / Capture)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1 h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative">
                <img
                  src={photoUrl}
                  alt="Evidence preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                  Attached Photo
                </div>
              </div>

              <div className="sm:col-span-2 flex flex-col justify-between space-y-2">
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition">
                    <Upload className="w-4 h-4 text-orange-400" />
                    <span>Upload Your Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium">Or select sample evidence:</span>
                  <div className="flex gap-1.5 mt-1 overflow-x-auto pb-1">
                    {SAMPLE_BURN_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(img.url);
                          setMaterial(img.material as WasteMaterialType);
                        }}
                        className={`text-[10px] px-2 py-1 rounded-lg border whitespace-nowrap transition ${
                          photoUrl === img.url
                            ? "bg-orange-600/30 border-orange-500 text-orange-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {img.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Odor & Health Symptoms */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Odor & Health Symptoms Detected
            </label>
            <input
              type="text"
              value={smell}
              onChange={(e) => setSmell(e.target.value)}
              placeholder="e.g., Acrid burning rubber, throat irritation, stinging eyes"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* AI Instant Pre-Verification Box */}
          <div className="bg-purple-950/30 border border-purple-800/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-purple-200">
                  Gemini 3.7 AI Instant Verification Preview
                </span>
              </div>
              <button
                type="button"
                onClick={handleVerifyWithAi}
                disabled={aiVerifying}
                className="px-2.5 py-1 rounded-lg bg-purple-600/40 hover:bg-purple-600 border border-purple-500/50 text-purple-200 text-xs font-semibold transition"
              >
                {aiVerifying ? "Verifying..." : "Run AI Pre-Check"}
              </button>
            </div>

            {aiResult && (
              <div className="text-xs space-y-2 pt-2 border-t border-purple-800/30">
                <div className="flex items-center justify-between text-purple-300">
                  <span>Authenticity Score:</span>
                  <span className="font-bold font-mono text-emerald-400">
                    {aiResult.authenticityScore}% Verified
                  </span>
                </div>
                <div className="text-slate-300">
                  <strong>Assessment:</strong> {aiResult.actionableSummary}
                </div>
                <div className="flex flex-wrap gap-1">
                  {aiResult.autoTags?.map((tag: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Anonymous toggle vs Citizen Karma */}
          <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  {isAnonymous ? "Submitting Anonymously" : "Green Guardian Account (+100 pts)"}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAnonymous ? "No name recorded" : `Logged under ${reporterName}`}
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-xs shadow-xl shadow-orange-950 transition"
            >
              Submit Report to Municipal Wardens
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
