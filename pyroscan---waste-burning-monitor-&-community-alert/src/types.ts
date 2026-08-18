export type HazardSeverity = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type IncidentStatus = 
  | "PENDING_VERIFICATION" 
  | "VERIFIED_ACTIVE" 
  | "DRONE_RECON" 
  | "SQUAD_DISPATCHED" 
  | "UNDER_SUPPRESSION" 
  | "RESOLVED_FINED" 
  | "FALSE_ALARM";

export type WasteMaterialType =
  | "PLASTIC_PACKAGING"
  | "TIRES_RUBBER"
  | "MUNICIPAL_SOLID_WASTE"
  | "CONSTRUCTION_DEBRIS"
  | "AGRICULTURAL_STUBBLE"
  | "E_WASTE_CABLES"
  | "CHEMICAL_HAZARD"
  | "ORGANIC_LEAVES";

export interface Coordinates {
  x: number; // percentage 0-100 on map
  y: number; // percentage 0-100 on map
  lat: number;
  lng: number;
}

export interface BurnIncident {
  id: string;
  title: string;
  locationName: string;
  coordinates: Coordinates;
  zone: string;
  detectedVia: "SATELLITE_VIIRS" | "OPTICAL_CCTV" | "COMMUNITY_REPORT" | "DRONE_PATROL" | "AQI_SPIKE_DETECTOR";
  materialType: WasteMaterialType;
  severity: HazardSeverity;
  status: IncidentStatus;
  reportedAt: string;
  estimatedAreaM2: number;
  temperatureCelsius: number;
  plumeLengthM: number;
  pm25Spike: number; // ug/m3
  primaryToxins: string[];
  imageUrl: string;
  thermalImageUrl?: string;
  assignedUnit?: string;
  fineAmountUSD?: number;
  violatorName?: string;
  communityConfirmations: number;
  aiConfidence: number;
  description: string;
  actionLog: {
    timestamp: string;
    actor: string;
    action: string;
  }[];
}

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  materialReported: WasteMaterialType;
  reportedBy: string;
  isAnonymous: boolean;
  userReputation: number;
  timestamp: string;
  status: IncidentStatus;
  photoUrl: string;
  upvotes: number;
  hasUserUpvoted?: boolean;
  smellDescription?: string;
  healthSymptoms?: string[];
  aiVerification?: {
    authenticityScore: number;
    isLikelyIllegalBurn: boolean;
    detectedCategory: string;
    severity: HazardSeverity;
    autoTags: string[];
    actionableSummary: string;
    investigationChecklist: string[];
  };
  municipalResponseNote?: string;
  rewardPointsAwarded?: number;
}

export interface AirSensorStation {
  id: string;
  name: string;
  zone: string;
  coordinates: Coordinates;
  aqi: number;
  pm25: number;
  pm10: number;
  co: number; // ppm
  no2: number; // ppb
  voc: number; // index
  status: "NORMAL" | "ELEVATED" | "HAZARDOUS";
  lastUpdated: string;
  history24h: { time: string; pm25: number; aqi: number }[];
}

export interface PatrolUnit {
  id: string;
  callsign: string;
  type: "RAPID_FIRE_SQUAD" | "DRONE_RECON_VAN" | "ENVIRONMENTAL_POLICE" | "COMMUNITY_WARDEN";
  currentCoordinates: Coordinates;
  status: "ON_PATROL" | "DISPATCHED" | "ON_SCENE" | "RETURNING" | "STANDBY";
  assignedIncidentId?: string;
  officers: string[];
  equipment: string[];
  batteryOrFuelPercent: number;
}

export interface MunicipalZone {
  id: string;
  name: string;
  type: "INDUSTRIAL" | "RESIDENTIAL" | "AGRICULTURAL" | "LANDFILL_BUFFER" | "COMMERCIAL";
  activeIncidents: number;
  riskScore: number; // 0 - 100
  wardenContact: string;
  boundaryPoints: { x: number; y: number }[];
}

export interface AIAnalysisResult {
  hazardLevel: HazardSeverity;
  plumeClassification: string;
  estimatedBurnAreaM2: number;
  plumeDispersionRadiusM: number;
  primaryToxins: string[];
  estimatedFineUSD: number;
  confidenceScore: number;
  municipalUrgency: string;
  recommendedAction: string;
  publicSafetyAdvisory: string;
  rationale: string;
}
