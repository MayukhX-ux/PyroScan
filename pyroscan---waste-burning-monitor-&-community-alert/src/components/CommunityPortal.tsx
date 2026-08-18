import React, { useState } from "react";
import { 
  Users, 
  PlusCircle, 
  ThumbsUp, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  HelpCircle, 
  Filter, 
  CheckCircle2,
  ChevronRight,
  Flame,
  Wind
} from "lucide-react";
import confetti from "canvas-confetti";
import { CommunityReport, WasteMaterialType } from "../types";

interface CommunityPortalProps {
  reports: CommunityReport[];
  onOpenSubmitModal: () => void;
  onUpvoteReport: (reportId: string) => void;
  onSelectReport: (report: CommunityReport) => void;
}

export const CommunityPortal: React.FC<CommunityPortalProps> = ({
  reports,
  onOpenSubmitModal,
  onUpvoteReport,
  onSelectReport,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [userPoints, setUserPoints] = useState<number>(350);

  const filteredReports = reports.filter((r) => {
    if (filterCategory !== "ALL" && r.materialReported !== filterCategory) return false;
    if (statusFilter === "PENDING" && r.status !== "PENDING_VERIFICATION") return false;
    if (statusFilter === "ACTIVE" && (r.status === "PENDING_VERIFICATION" || r.status === "RESOLVED_FINED")) return false;
    if (statusFilter === "RESOLVED" && r.status !== "RESOLVED_FINED") return false;
    return true;
  });

  const handleUpvoteWithSpark = (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvoteReport(reportId);
    setUserPoints(prev => prev + 10);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#ea580c', '#f59e0b', '#10b981']
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Community Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950/60 border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Public Civic Watch & Clean Air Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Report Illegal Waste Burning. Protect Your Community's Air.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Open burning of plastics, rubber tires, municipal trash, and dry debris releases dangerous toxic dioxins and hazardous particulates. Submit instant photo reports with live municipal tracking, AI verification, and community rewards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
            {/* Citizen Karma Points Pill */}
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Your Green Karma</div>
                <div className="text-lg font-extrabold text-amber-300 font-mono">{userPoints} pts</div>
                <div className="text-[10px] text-emerald-400 font-medium">Eco Guardian Level 3</div>
              </div>
            </div>

            <button
              onClick={onOpenSubmitModal}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-orange-950 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Submit Sighting Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community Clean Air Advisory Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-white font-mono">{reports.length}</div>
            <div className="text-xs text-slate-400">Citizen Reports Logged</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {reports.filter(r => r.status === "RESOLVED_FINED").length}
            </div>
            <div className="text-xs text-slate-400">Extinguished & Fined</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-purple-300 font-mono">94%</div>
            <div className="text-xs text-slate-400">AI Verification Accuracy</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-300 font-mono">18 mins</div>
            <div className="text-xs text-slate-400">Avg. Squad Response Time</div>
          </div>
        </div>
      </div>

      {/* Main Reports Feed Header & Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Public Verified Smoke & Waste Burning Feed
            </h2>
            <p className="text-xs text-slate-400">
              Corroborate community sightings to elevate priority for municipal field wardens
            </p>
          </div>

          <button
            onClick={onOpenSubmitModal}
            className="sm:hidden w-full py-2.5 px-4 bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Illegal Burn</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                statusFilter === "ALL" 
                  ? "bg-orange-600 text-white font-bold" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                statusFilter === "ACTIVE" 
                  ? "bg-orange-600 text-white font-bold" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Active / Dispatched
            </button>
            <button
              onClick={() => setStatusFilter("RESOLVED")}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                statusFilter === "RESOLVED" 
                  ? "bg-emerald-600 text-white font-bold" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Resolved & Fined
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Material:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Materials</option>
              <option value="PLASTIC_PACKAGING">Plastics & Packaging</option>
              <option value="TIRES_RUBBER">Tires & Rubber</option>
              <option value="AGRICULTURAL_STUBBLE">Crop Stubble / Biomass</option>
              <option value="CONSTRUCTION_DEBRIS">Construction Debris</option>
              <option value="MUNICIPAL_SOLID_WASTE">Mixed Trash Dump</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => {
          const isResolved = report.status === "RESOLVED_FINED";
          const isDispatched = report.status === "SQUAD_DISPATCHED" || report.status === "UNDER_SUPPRESSION";
          const isPending = report.status === "PENDING_VERIFICATION";

          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-200 flex flex-col group cursor-pointer"
            >
              {/* Card Photo & Top Overlay */}
              <div className="relative h-48 sm:h-52 bg-slate-950 overflow-hidden">
                <img
                  src={report.photoUrl}
                  alt={report.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/20">
                    {report.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold text-[10px] uppercase">
                    {report.materialReported.replace("_", " ")}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-lg ${
                    isResolved 
                      ? "bg-emerald-600 text-white" 
                      : isDispatched 
                      ? "bg-orange-600 text-white animate-pulse" 
                      : isPending 
                      ? "bg-yellow-600 text-white" 
                      : "bg-blue-600 text-white"
                  }`}>
                    {report.status.replace("_", " ")}
                  </span>
                </div>

                {/* Bottom title in photo */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-white leading-snug drop-shadow-md">
                    {report.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate">{report.locationName}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{report.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Smell & Symptoms alert if present */}
                  {report.smellDescription && (
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 text-xs text-amber-300 flex items-start gap-2">
                      <Wind className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <strong>Odor Profile:</strong> {report.smellDescription}
                      </div>
                    </div>
                  )}

                  {/* AI Verification Badge */}
                  {report.aiVerification && (
                    <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-purple-300">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold">AI Authenticity: {report.aiVerification.authenticityScore}%</span>
                      </div>
                      <span className="text-[10px] text-purple-400 font-mono">
                        {report.aiVerification.detectedCategory}
                      </span>
                    </div>
                  )}

                  {/* Municipal Response Progress Indicator */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-400">Municipal Enforcement Track:</span>
                      <span className={isResolved ? "text-emerald-400" : "text-orange-400"}>
                        {isResolved ? "Case Closed & Fined" : "Active Field Unit En-route"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                      <div className="bg-orange-500 h-full w-1/4" />
                      <div className={`h-full w-1/4 ${!isPending ? "bg-orange-500" : "bg-slate-700"}`} />
                      <div className={`h-full w-1/4 ${isDispatched || isResolved ? "bg-orange-500" : "bg-slate-700"}`} />
                      <div className={`h-full w-1/4 ${isResolved ? "bg-emerald-500" : "bg-slate-700"}`} />
                    </div>
                    {report.municipalResponseNote && (
                      <div className="text-[11px] text-slate-300 italic pt-1">
                        🏛️ "{report.municipalResponseNote}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Upvote & Reporter attribution */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Reported by <strong className="text-slate-200">{report.reportedBy}</strong>
                  </div>

                  <button
                    onClick={(e) => handleUpvoteWithSpark(report.id, e)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      report.hasUserUpvoted 
                        ? "bg-orange-600/30 text-orange-300 border border-orange-500/40" 
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${report.hasUserUpvoted ? "text-orange-400 fill-orange-400" : ""}`} />
                    <span>I smell/see this ({report.upvotes})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community FAQ & Clean Air Guide */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Why Open Waste Burning Is Illegal & Dangerous
            </h3>
            <p className="text-xs text-slate-400">
              Key health impacts and municipal environmental code guidelines
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-red-400">1. Toxic Dioxins & Furans</h4>
            <p className="leading-relaxed text-slate-400">
              Burning plastic bottles, styrofoam, and synthetic cables releases chlorinated dioxins that settle in soil and lungs, known to cause severe long-term respiratory and cellular damage.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-amber-400">2. Severe PM2.5 Particulate Spikes</h4>
            <p className="leading-relaxed text-slate-400">
              Low-temperature open burning produces dense microscopic soot (PM2.5) that bypasses natural airway filters and causes asthma flare-ups in children and elderly neighbors downwind.
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-emerald-400">3. Statutory Penalties</h4>
            <p className="leading-relaxed text-slate-400">
              Municipal Clean Air by-laws mandate citations ranging from $1,000 to $10,000 USD plus mandatory restitution and cleanup costs for repeat commercial offenders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
