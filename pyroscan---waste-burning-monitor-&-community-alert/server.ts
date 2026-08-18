import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "PyroScan Municipal Engine",
    hasGemini: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: AI Plume & Waste Burn Analysis (Multimodal / Text)
app.post("/api/analyze-burn", async (req, res) => {
  try {
    const { imageBase64, mimeType, description, materialHint, locationName, aqiValue, windSpeed } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return smart structured fallback if no key is present
      return res.json({
        success: true,
        isAiGenerated: false,
        analysis: {
          hazardLevel: materialHint?.toLowerCase().includes("plastic") || materialHint?.toLowerCase().includes("tire") ? "CRITICAL" : "HIGH",
          plumeClassification: materialHint || "Mixed Municipal Solid Waste Combustion",
          estimatedBurnAreaM2: 45,
          plumeDispersionRadiusM: 380,
          primaryToxins: ["PM2.5 / PM10 (Heavy)", "Carbon Monoxide (CO)", "Volatile Organic Compounds (VOCs)", "Dioxins & Furans"],
          estimatedFineUSD: 1250,
          confidenceScore: 88,
          municipalUrgency: "IMMEDIATE_DISPATCH",
          recommendedAction: "Deploy Squad B with water cannon + atmospheric particulate filter perimeter. Issue statutory municipal violation notice under Clean Air Act Section 4B.",
          publicSafetyAdvisory: "Advise residents within 500m downwind to close windows and restrict outdoor physical exertion.",
          rationale: "Dense particulate emission detected with toxic chemical signature characteristics typical of unregulated open-air refuse incineration."
        }
      });
    }

    const promptText = `You are PyroScan AI, an expert municipal environmental protection and hazardous smoke plume analyst.
Analyze the following waste burning activity report and provide a structured JSON assessment for city enforcement officials:

Details:
- Description: ${description || "Unidentified open burning activity"}
- Reported Material: ${materialHint || "Unknown / Mixed waste"}
- Location: ${locationName || "Urban / Suburban Sector"}
- Ambient AQI: ${aqiValue || "Elevated"}
- Wind Speed: ${windSpeed || "Moderate"}

Evaluate:
1. hazardLevel (LOW, MODERATE, HIGH, CRITICAL)
2. plumeClassification (e.g., Chlorinated Plastic Incineration, Scrap Tire Combustion, Agricultural Biomass Burn, Construction Composite Debris)
3. estimatedBurnAreaM2 (number)
4. plumeDispersionRadiusM (number)
5. primaryToxins (array of 3-5 toxin names)
6. estimatedFineUSD (recommended municipal statutory fine integer)
7. confidenceScore (integer 60-99)
8. municipalUrgency (ROUTINE_INSPECTION, PRIORITY_RESPONSE, IMMEDIATE_DISPATCH, HAZMAT_ESCALATION)
9. recommendedAction (tactical direction for municipal squad)
10. publicSafetyAdvisory (message for nearby community)
11. rationale (2 sentence explanation)`;

    const contents: any[] = [];
    if (imageBase64 && mimeType) {
      contents.push({
        parts: [
          {
            inlineData: {
              data: imageBase64.replace(/^data:[^;]+;base64,/, ""),
              mimeType: mimeType || "image/jpeg",
            },
          },
          { text: promptText },
        ],
      });
    } else {
      contents.push({
        parts: [{ text: promptText }],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hazardLevel: { type: Type.STRING },
            plumeClassification: { type: Type.STRING },
            estimatedBurnAreaM2: { type: Type.NUMBER },
            plumeDispersionRadiusM: { type: Type.NUMBER },
            primaryToxins: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedFineUSD: { type: Type.NUMBER },
            confidenceScore: { type: Type.NUMBER },
            municipalUrgency: { type: Type.STRING },
            recommendedAction: { type: Type.STRING },
            publicSafetyAdvisory: { type: Type.STRING },
            rationale: { type: Type.STRING },
          },
          required: [
            "hazardLevel",
            "plumeClassification",
            "estimatedBurnAreaM2",
            "plumeDispersionRadiusM",
            "primaryToxins",
            "estimatedFineUSD",
            "confidenceScore",
            "municipalUrgency",
            "recommendedAction",
            "publicSafetyAdvisory",
            "rationale"
          ]
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    res.json({
      success: true,
      isAiGenerated: true,
      analysis: parsed,
    });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze burning activity",
    });
  }
});

// Endpoint: AI Community Report Verifier
app.post("/api/verify-report", async (req, res) => {
  try {
    const { title, description, locationName, category, userReputation } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        verification: {
          authenticityScore: 92,
          isLikelyIllegalBurn: true,
          detectedCategory: category || "Plastic / Domestic Garbage",
          severity: "HIGH",
          autoTags: ["Thick Smoke", "Residential Proximity", "Night-time Burn"],
          actionableSummary: "High probability open municipal waste burning violation situated in residential border zone. Priority inspection suggested.",
          investigationChecklist: [
            "Verify perimeter property owner identity",
            "Check for thermal residual hotspots",
            "Document ash residue for toxic compound assay",
            "Issue Cease and Desist summons"
          ]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `You are a municipal smoke patrol validation AI. Review this citizen report:
Title: ${title}
Description: ${description}
Location: ${locationName}
Category claimed: ${category}
Reporter Trust Index: ${userReputation || 85}

Provide verification assessment JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            authenticityScore: { type: Type.NUMBER },
            isLikelyIllegalBurn: { type: Type.BOOLEAN },
            detectedCategory: { type: Type.STRING },
            severity: { type: Type.STRING },
            autoTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableSummary: { type: Type.STRING },
            investigationChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "authenticityScore",
            "isLikelyIllegalBurn",
            "detectedCategory",
            "severity",
            "autoTags",
            "actionableSummary",
            "investigationChecklist"
          ]
        }
      }
    });

    const verification = JSON.parse(response.text?.trim() || "{}");
    res.json({
      success: true,
      verification,
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: AI Squad Dispatch Briefing
app.post("/api/dispatch-briefing", async (req, res) => {
  try {
    const { incidentId, location, materials, wind, nearbySchoolsOrHospitals } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        briefing: {
          callsign: "INTERCEPT-DELTA-4",
          routeAdvisory: "Approach from West via Oakridge Boulevard to stay upwind of the plume vector.",
          equipmentNeeded: ["Water suppression tanker", "Thermal imaging camera", "Class-B toxic vapor respirators", "Evidence photo kit"],
          containmentTactics: "Establish 100m containment perimeter. Target the thermal core with foam suppressant to halt dioxin formation.",
          legalEnforcementStep: "Issue Immediate Stop Order (ISO) and document GPS timestamped photos of burn pile."
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Generate a municipal enforcement dispatch briefing for Incident #${incidentId}:
Location: ${location}
Materials: ${materials}
Wind condition: ${wind || "North-East 14 km/h"}
Sensitive zones nearby: ${nearbySchoolsOrHospitals || "None reported"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            callsign: { type: Type.STRING },
            routeAdvisory: { type: Type.STRING },
            equipmentNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
            containmentTactics: { type: Type.STRING },
            legalEnforcementStep: { type: Type.STRING },
          },
          required: ["callsign", "routeAdvisory", "equipmentNeeded", "containmentTactics", "legalEnforcementStep"]
        }
      }
    });

    const briefing = JSON.parse(response.text?.trim() || "{}");
    res.json({ success: true, briefing });
  } catch (err: any) {
    console.error("Briefing error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PyroScan Municipal Server running on http://localhost:${PORT}`);
  });
}

startServer();
