import React, { useState } from "react";
import { 
  FileText, 
  DollarSign, 
  Download, 
  Printer, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter,
  Building,
  UserCheck
} from "lucide-react";
import { BurnIncident } from "../types";

interface EnforcementLedgerProps {
  incidents: BurnIncident[];
}

export const EnforcementLedger: React.FC<EnforcementLedgerProps> = ({ incidents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedCitation, setSelectedCitation] = useState<BurnIncident | null>(incidents[0] || null);

  const citations = incidents.filter(i => (i.fineAmountUSD || 0) > 0);

  const filteredCitations = citations.filter(c => {
    if (searchTerm) {
      const matchLoc = c.locationName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchViolator = c.violatorName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchId = c.id.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchLoc && !matchViolator && !matchId) return false;
    }
    return true;
  });

  const totalFinesIssued = citations.reduce((sum, c) => sum + (c.fineAmountUSD || 0), 0);
  const resolvedCount = citations.filter(c => c.status === "RESOLVED_FINED").length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Ledger Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">
              ${totalFinesIssued.toLocaleString()} USD
            </div>
            <div className="text-xs text-slate-400 font-medium">Total Statutory Fines Assessed</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {citations.length} Citations
            </div>
            <div className="text-xs text-slate-400 font-medium">Clean Air Violation Notices Logged</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="p-3.5 rounded-2xl bg-orange-500/20 text-orange-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-orange-400 font-mono">
              {resolvedCount} / {citations.length}
            </div>
            <div className="text-xs text-slate-400 font-medium">Cases Resolved & Cleaned Up</div>
          </div>
        </div>
      </div>

      {/* Main Ledger Table & Citation Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                Statutory Environmental Violations Register
              </h2>
              <p className="text-xs text-slate-400">
                Official municipal enforcement records under Clean Air Code § 14-B
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search violator or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Docket #</th>
                  <th className="py-3 px-3">Violator / Titleholder</th>
                  <th className="py-3 px-3">Material Burned</th>
                  <th className="py-3 px-3">Fine USD</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCitations.map((item) => {
                  const isSelected = selectedCitation?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedCitation(item)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition ${
                        isSelected ? "bg-emerald-950/20 border-l-2 border-emerald-500" : ""
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {item.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">
                          {item.violatorName || "Occupant / Contractor"}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {item.locationName}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px]">
                          {item.materialType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        ${item.fineAmountUSD?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "RESOLVED_FINED" 
                            ? "bg-emerald-500/20 text-emerald-300" 
                            : "bg-orange-500/20 text-orange-300"
                        }`}>
                          {item.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCitation(item);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                        >
                          View Notice
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable Official Notice View */}
        <div className="lg:col-span-1 bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          {selectedCitation ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-sm">Official Violation Notice</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              {/* Printable Format */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono">
                <div className="text-center border-b border-slate-800 pb-2">
                  <div className="font-bold text-white text-xs">CITY ENVIRONMENTAL PROTECTION DEPT</div>
                  <div className="text-[10px] text-slate-400">STATUTORY SUMMONS & CEASE ORDER</div>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div><strong>NOTICE ID:</strong> {selectedCitation.id}-FINE</div>
                  <div><strong>DATE ISSUED:</strong> {new Date().toLocaleDateString()}</div>
                  <div><strong>VIOLATOR:</strong> {selectedCitation.violatorName}</div>
                  <div><strong>LOCATION:</strong> {selectedCitation.locationName}</div>
                  <div><strong>MATERIAL:</strong> {selectedCitation.materialType}</div>
                  <div><strong>AIR QUALITY SURGE:</strong> +{selectedCitation.pm25Spike} µg/m³ PM2.5</div>
                  <div className="pt-2 text-emerald-400 font-bold text-sm">
                    STATUTORY FINE: ${selectedCitation.fineAmountUSD?.toLocaleString()} USD
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 leading-relaxed">
                  Notice is hereby given that the open combustion of waste products within municipal boundaries violates Clean Air Code § 14-B. Remediation and payment must be remitted within 14 business days.
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-slate-400 font-semibold">Evidence Photo Attached:</div>
                <div className="h-32 rounded-xl overflow-hidden border border-slate-800 bg-black">
                  <img
                    src={selectedCitation.imageUrl}
                    alt="Citation evidence"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              Select any violation docket to view official notice format.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
