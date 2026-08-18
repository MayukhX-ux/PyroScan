import { BurnIncident, CommunityReport, AirSensorStation, PatrolUnit, MunicipalZone } from "../types";

export const INITIAL_ZONES: MunicipalZone[] = [
  {
    id: "zone-north-agro",
    name: "Sector 1: North Agricultural Greenbelt",
    type: "AGRICULTURAL",
    activeIncidents: 2,
    riskScore: 78,
    wardenContact: "Capt. M. Vance (+1-555-0142)",
    boundaryPoints: [
      { x: 10, y: 5 },
      { x: 50, y: 5 },
      { x: 45, y: 35 },
      { x: 12, y: 32 }
    ]
  },
  {
    id: "zone-east-industrial",
    name: "Sector 2: East Metallurgical & Scrap Hub",
    type: "INDUSTRIAL",
    activeIncidents: 3,
    riskScore: 92,
    wardenContact: "Inspector D. Rao (+1-555-0199)",
    boundaryPoints: [
      { x: 55, y: 15 },
      { x: 92, y: 10 },
      { x: 90, y: 50 },
      { x: 52, y: 45 }
    ]
  },
  {
    id: "zone-south-landfill",
    name: "Sector 3: South Valley Landfill & Canal",
    type: "LANDFILL_BUFFER",
    activeIncidents: 1,
    riskScore: 84,
    wardenContact: "Sgt. K. Briggs (+1-555-0211)",
    boundaryPoints: [
      { x: 40, y: 55 },
      { x: 88, y: 58 },
      { x: 80, y: 92 },
      { x: 35, y: 88 }
    ]
  },
  {
    id: "zone-central-metro",
    name: "Sector 4: Central Urban & Commercial Core",
    type: "RESIDENTIAL",
    activeIncidents: 1,
    riskScore: 41,
    wardenContact: "Officer L. Zhang (+1-555-0374)",
    boundaryPoints: [
      { x: 15, y: 40 },
      { x: 48, y: 40 },
      { x: 42, y: 82 },
      { x: 12, y: 78 }
    ]
  }
];

export const INITIAL_INCIDENTS: BurnIncident[] = [
  {
    id: "INC-2026-881",
    title: "Illegal E-Waste & Rubber Scrap Burn Behind Depot 9",
    locationName: "East Metal Yard, Lot 14-B (Industrial Sector)",
    coordinates: { x: 74, y: 28, lat: 37.7842, lng: -122.3921 },
    zone: "zone-east-industrial",
    detectedVia: "OPTICAL_CCTV",
    materialType: "TIRES_RUBBER",
    severity: "CRITICAL",
    status: "UNDER_SUPPRESSION",
    reportedAt: "14 mins ago",
    estimatedAreaM2: 120,
    temperatureCelsius: 640,
    plumeLengthM: 620,
    pm25Spike: 345,
    primaryToxins: ["Dioxins", "Hydrogen Chloride", "Polycyclic Hydrocarbons", "Soot Black Carbon"],
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
    thermalImageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1000&q=80",
    assignedUnit: "UNIT-ALPHA-1",
    fineAmountUSD: 4500,
    violatorName: "Apex Recyclers Corp (Repeat Offender)",
    communityConfirmations: 14,
    aiConfidence: 96,
    description: "Automated optical tower #04 triggered high-opacity black plume warning. Heavy tire and copper cable burning emitting toxic aromatic hydrocarbons.",
    actionLog: [
      { timestamp: "07:15 AM", actor: "AI Vision Optical Tower #04", action: "Thermal plume flare signature detected (640°C core)." },
      { timestamp: "07:18 AM", actor: "Municipal Dispatcher J. Miller", action: "Confirmed severity CRITICAL. Dispatched Rapid Fire Squad Unit Alpha-1." },
      { timestamp: "07:22 AM", actor: "Unit Alpha-1", action: "Arrived on scene, deploying aqueous foam blanket." },
      { timestamp: "07:25 AM", actor: "Environmental Inspector", action: "Issued Emergency Cease Order and preliminary $4,500 citation." }
    ]
  },
  {
    id: "INC-2026-882",
    title: "Large-Scale Agricultural Crop Residue Open Combustion",
    locationName: "North Farm Ring, Parcel 88, Old River Rd",
    coordinates: { x: 28, y: 18, lat: 37.7991, lng: -122.4281 },
    zone: "zone-north-agro",
    detectedVia: "SATELLITE_VIIRS",
    materialType: "AGRICULTURAL_STUBBLE",
    severity: "HIGH",
    status: "DRONE_RECON",
    reportedAt: "28 mins ago",
    estimatedAreaM2: 850,
    temperatureCelsius: 410,
    plumeLengthM: 1400,
    pm25Spike: 185,
    primaryToxins: ["PM2.5 / PM10 (Severe)", "Carbon Monoxide (CO)", "Nitrogen Oxides (NOx)"],
    imageUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
    assignedUnit: "DRONE-UNIT-2",
    fineAmountUSD: 2000,
    violatorName: "Farm Holding #88 (Under Investigation)",
    communityConfirmations: 22,
    aiConfidence: 94,
    description: "MODIS/VIIRS thermal satellite anomaly detected 35MW fire radiative power over paddy stubble field contrary to seasonal burning ban.",
    actionLog: [
      { timestamp: "06:45 AM", actor: "VIIRS Satellite Ingestion", action: "Thermal anomaly detected with 35MW Fire Radiative Power." },
      { timestamp: "06:50 AM", actor: "Municipal Command", action: "Dispatched Drone Recon Unit 2 for GPS geotagged evidence capture." }
    ]
  },
  {
    id: "INC-2026-883",
    title: "Plastic Trash Pile Burning Adjacent to Drainage Canal",
    locationName: "South Valley Canal Path & 5th Crossing",
    coordinates: { x: 62, y: 72, lat: 37.7612, lng: -122.4045 },
    zone: "zone-south-landfill",
    detectedVia: "COMMUNITY_REPORT",
    materialType: "PLASTIC_PACKAGING",
    severity: "HIGH",
    status: "SQUAD_DISPATCHED",
    reportedAt: "42 mins ago",
    estimatedAreaM2: 35,
    temperatureCelsius: 510,
    plumeLengthM: 320,
    pm25Spike: 210,
    primaryToxins: ["Chlorinated Dioxins", "Phthalates", "Sulfur Dioxide (SO2)"],
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
    assignedUnit: "PATROL-BRAVO-3",
    fineAmountUSD: 1500,
    communityConfirmations: 31,
    aiConfidence: 91,
    description: "Multiple citizen reports submitted with verified photos showing commercial packaging and plastic bottles set ablaze behind municipal transfer perimeter.",
    actionLog: [
      { timestamp: "06:30 AM", actor: "Citizen App (Reporter: Sarah K.)", action: "Photo submission received with pungent smell alert." },
      { timestamp: "06:35 AM", actor: "PyroScan AI Verifier", action: "Verified plastic combustion indicators (91% confidence)." },
      { timestamp: "06:40 AM", actor: "Command Dispatch", action: "Patrol Bravo 3 routed to site. ETA 6 minutes." }
    ]
  },
  {
    id: "INC-2026-884",
    title: "Construction Foam & Treated Wood Debris Incineration",
    locationName: "West Elm Construction Site #102",
    coordinates: { x: 22, y: 64, lat: 37.7698, lng: -122.4352 },
    zone: "zone-central-metro",
    detectedVia: "AQI_SPIKE_DETECTOR",
    materialType: "CONSTRUCTION_DEBRIS",
    severity: "MODERATE",
    status: "VERIFIED_ACTIVE",
    reportedAt: "58 mins ago",
    estimatedAreaM2: 25,
    temperatureCelsius: 380,
    plumeLengthM: 180,
    pm25Spike: 140,
    primaryToxins: ["Formaldehyde", "Styrene Oligomers", "Volatile Organic Compounds"],
    imageUrl: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1000&q=80",
    assignedUnit: "COMMUNITY-WARDEN-4",
    fineAmountUSD: 1000,
    violatorName: "Kona Contracting LLC",
    communityConfirmations: 8,
    aiConfidence: 89,
    description: "Air Sensor Station #08 recorded sharp VOC and PM2.5 spike. Contractor burning insulation packaging and treated timber scraps.",
    actionLog: [
      { timestamp: "06:12 AM", actor: "Station #08 Sensor", action: "Spike detected: PM2.5 jumped from 18 to 140 ug/m3 in 4 minutes." },
      { timestamp: "06:20 AM", actor: "Warden L. Zhang", action: "En-route to site for site inspection." }
    ]
  },
  {
    id: "INC-2026-880",
    title: "Commercial Packaging Waste Burn Resolved & Fined",
    locationName: "Old Depot Alleyway & 12th St",
    coordinates: { x: 80, y: 44, lat: 37.7788, lng: -122.3871 },
    zone: "zone-east-industrial",
    detectedVia: "COMMUNITY_REPORT",
    materialType: "MUNICIPAL_SOLID_WASTE",
    severity: "MODERATE",
    status: "RESOLVED_FINED",
    reportedAt: "2 hrs ago",
    estimatedAreaM2: 15,
    temperatureCelsius: 42,
    plumeLengthM: 0,
    pm25Spike: 85,
    primaryToxins: ["Particulates", "Carbon Monoxide"],
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80",
    assignedUnit: "UNIT-ALPHA-1",
    fineAmountUSD: 1200,
    violatorName: "QuickLogistics Transfer Hub",
    communityConfirmations: 19,
    aiConfidence: 95,
    description: "Extinguished completely by Squad Alpha-1. Commercial violator served with citation ticket #CT-9921 for $1,200.",
    actionLog: [
      { timestamp: "05:00 AM", actor: "Citizen Alert", action: "Report received via mobile app." },
      { timestamp: "05:15 AM", actor: "Squad Alpha-1", action: "Fire suppressed with 400L water spray." },
      { timestamp: "05:40 AM", actor: "Municipal Inspector", action: "Citation ticket issued. Site cleared of ashes." }
    ]
  }
];

export const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: "REP-9041",
    title: "Pungent black smoke from auto body garage backyard",
    description: "Continuous toxic burning since 6:30 AM behind the auto repair shop. Smells heavily of burning rubber tires and synthetic paint thinner. Several children waiting for school bus coughing.",
    locationName: "244 Industrial Way, behind TurboAuto Repair",
    coordinates: { x: 70, y: 32, lat: 37.7821, lng: -122.3945 },
    materialReported: "TIRES_RUBBER",
    reportedBy: "Marcus Thorne (Neighborhood Watch)",
    isAnonymous: false,
    userReputation: 96,
    timestamp: "22 mins ago",
    status: "SQUAD_DISPATCHED",
    photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    upvotes: 42,
    hasUserUpvoted: true,
    smellDescription: "Choking acrid smell, burning rubber & chemicals",
    healthSymptoms: ["Eye burning", "Throat irritation", "Chest tightness"],
    aiVerification: {
      authenticityScore: 97,
      isLikelyIllegalBurn: true,
      detectedCategory: "Hazardous Rubber & Automotive Scrap Combustion",
      severity: "CRITICAL",
      autoTags: ["Dense Black Plume", "Tire Burning", "School Route Proximity"],
      actionableSummary: "High-probability toxic industrial violation. Rapid inspection and fire suppression requested.",
      investigationChecklist: [
        "Inspect auto repair disposal manifests",
        "Sample soot for heavy metals & dioxins",
        "Issue municipal stop-work injunction"
      ]
    },
    municipalResponseNote: "Squad Alpha-1 dispatched with priority air monitors. Investigation underway.",
    rewardPointsAwarded: 150
  },
  {
    id: "REP-9042",
    title: "Large open garbage pile on vacant lot near residential apartments",
    description: "Someone dumped several bags of household waste, foam packaging, and plastic containers, then set it on fire at dawn. Thick white-gray smoke drifting into 3rd floor apartment windows.",
    locationName: "Corner of Oak St & 4th Avenue, Vacant Lot #4",
    coordinates: { x: 44, y: 52, lat: 37.7712, lng: -122.4182 },
    materialReported: "PLASTIC_PACKAGING",
    reportedBy: "Elena Rostova",
    isAnonymous: false,
    userReputation: 88,
    timestamp: "38 mins ago",
    status: "VERIFIED_ACTIVE",
    photoUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    upvotes: 27,
    hasUserUpvoted: false,
    smellDescription: "Melting sweet plastic odor, chemical fumes",
    healthSymptoms: ["Headache", "Nausea"],
    aiVerification: {
      authenticityScore: 92,
      isLikelyIllegalBurn: true,
      detectedCategory: "Domestic & Commercial Plastic Waste",
      severity: "HIGH",
      autoTags: ["Residential Zone", "Plastic Packaging", "Immediate Drift"],
      actionableSummary: "Confirmed open refuse burn within 50m of high-density housing.",
      investigationChecklist: [
        "Locate vacant lot deed owner",
        "Issue illegal dumping & burning summons",
        "Request sanitation clean-up crew"
      ]
    },
    municipalResponseNote: "Assigned to Community Warden Unit 4 for immediate site visit.",
    rewardPointsAwarded: 100
  },
  {
    id: "REP-9043",
    title: "Field crop stubble burning despite dry wind advisory",
    description: "Farmer on North perimeter ignited approximately 2 acres of harvested straw residue. Wind blowing smoke straight towards the highway causing poor driving visibility.",
    locationName: "Greenbelt Highway Mile Marker 14",
    coordinates: { x: 30, y: 12, lat: 37.8021, lng: -122.4241 },
    materialReported: "AGRICULTURAL_STUBBLE",
    reportedBy: "Citizen Report #1088",
    isAnonymous: true,
    userReputation: 75,
    timestamp: "1 hr ago",
    status: "DRONE_RECON",
    photoUrl: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    upvotes: 19,
    hasUserUpvoted: false,
    smellDescription: "Intense woodsmoke and charred grass",
    healthSymptoms: ["Reduced visibility", "Eye watering"],
    aiVerification: {
      authenticityScore: 89,
      isLikelyIllegalBurn: true,
      detectedCategory: "Agricultural Biomass Residue",
      severity: "HIGH",
      autoTags: ["Highway Hazard", "High Acreage", "Stubble Ban"],
      actionableSummary: "Violates city ordinance 44-A regarding agricultural burn permits during high-wind advisories.",
      investigationChecklist: [
        "Verify permit registry",
        "Coordinate with Highway Traffic Police",
        "Deploy drone for boundary survey"
      ]
    },
    municipalResponseNote: "Drone Unit 2 performing aerial video inspection.",
    rewardPointsAwarded: 50
  },
  {
    id: "REP-9044",
    title: "Old construction timber and laminate pallets ignited",
    description: "Demolition crew setting pile of treated plywood and painted wood frames on fire at the back of the demolition compound.",
    locationName: "88 West Industrial Boulevard",
    coordinates: { x: 60, y: 40, lat: 37.7765, lng: -122.3998 },
    materialReported: "CONSTRUCTION_DEBRIS",
    reportedBy: "Devon Chen",
    isAnonymous: false,
    userReputation: 92,
    timestamp: "2 hrs ago",
    status: "RESOLVED_FINED",
    photoUrl: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80",
    upvotes: 35,
    hasUserUpvoted: true,
    smellDescription: "Burning glue, varnish and treated timber",
    healthSymptoms: ["Throat scratchiness"],
    aiVerification: {
      authenticityScore: 95,
      isLikelyIllegalBurn: true,
      detectedCategory: "Treated Demolition Wood & Adhesives",
      severity: "MODERATE",
      autoTags: ["Commercial Site", "Treated Lumber", "Resolved"],
      actionableSummary: "Enforcement squad issued $1,200 citation and ordered instant dousing.",
      investigationChecklist: [
        "Collect evidence photos",
        "Verify contractor license",
        "Confirm total ember extinction"
      ]
    },
    municipalResponseNote: "Enforcement squad extinguished fire and issued $1,200 penalty notice.",
    rewardPointsAwarded: 150
  }
];

export const INITIAL_SENSORS: AirSensorStation[] = [
  {
    id: "AQI-01",
    name: "Station 01: East Industrial Perimeter",
    zone: "zone-east-industrial",
    coordinates: { x: 78, y: 30, lat: 37.7812, lng: -122.3892 },
    aqi: 248,
    pm25: 198,
    pm10: 290,
    co: 9.4,
    no2: 48,
    voc: 380,
    status: "HAZARDOUS",
    lastUpdated: "Just now",
    history24h: [
      { time: "02:00", pm25: 22, aqi: 45 },
      { time: "04:00", pm25: 28, aqi: 52 },
      { time: "06:00", pm25: 45, aqi: 85 },
      { time: "06:30", pm25: 110, aqi: 155 },
      { time: "07:00", pm25: 198, aqi: 248 }
    ]
  },
  {
    id: "AQI-02",
    name: "Station 02: North Greenbelt & Valley",
    zone: "zone-north-agro",
    coordinates: { x: 32, y: 15, lat: 37.8015, lng: -122.4262 },
    aqi: 168,
    pm25: 92,
    pm10: 160,
    co: 4.8,
    no2: 24,
    voc: 180,
    status: "ELEVATED",
    lastUpdated: "1 min ago",
    history24h: [
      { time: "02:00", pm25: 14, aqi: 30 },
      { time: "04:00", pm25: 18, aqi: 35 },
      { time: "06:00", pm25: 35, aqi: 70 },
      { time: "06:30", pm25: 75, aqi: 140 },
      { time: "07:00", pm25: 92, aqi: 168 }
    ]
  },
  {
    id: "AQI-03",
    name: "Station 03: South Landfill Buffer Zone",
    zone: "zone-south-landfill",
    coordinates: { x: 65, y: 76, lat: 37.7591, lng: -122.4021 },
    aqi: 182,
    pm25: 115,
    pm10: 195,
    co: 6.2,
    no2: 32,
    voc: 290,
    status: "ELEVATED",
    lastUpdated: "3 mins ago",
    history24h: [
      { time: "02:00", pm25: 30, aqi: 60 },
      { time: "04:00", pm25: 34, aqi: 65 },
      { time: "06:00", pm25: 60, aqi: 110 },
      { time: "06:30", pm25: 98, aqi: 160 },
      { time: "07:00", pm25: 115, aqi: 182 }
    ]
  },
  {
    id: "AQI-04",
    name: "Station 04: Central City Civic Center",
    zone: "zone-central-metro",
    coordinates: { x: 30, y: 60, lat: 37.7725, lng: -122.4215 },
    aqi: 48,
    pm25: 11,
    pm10: 25,
    co: 1.2,
    no2: 12,
    voc: 45,
    status: "NORMAL",
    lastUpdated: "Just now",
    history24h: [
      { time: "02:00", pm25: 9, aqi: 28 },
      { time: "04:00", pm25: 10, aqi: 32 },
      { time: "06:00", pm25: 12, aqi: 40 },
      { time: "06:30", pm25: 11, aqi: 45 },
      { time: "07:00", pm25: 11, aqi: 48 }
    ]
  }
];

export const INITIAL_PATROL_UNITS: PatrolUnit[] = [
  {
    id: "UNIT-ALPHA-1",
    callsign: "Rapid Fire Squad Alpha-1",
    type: "RAPID_FIRE_SQUAD",
    currentCoordinates: { x: 72, y: 30, lat: 37.7838, lng: -122.3928 },
    status: "ON_SCENE",
    assignedIncidentId: "INC-2026-881",
    officers: ["Lt. Jack Mercer", "Tech S. Alvarez", "Firefighter R. Gomez"],
    equipment: ["3000L Compressed Foam Tanker", "FLIR Thermal Imager", "Vapor Respirators Level B", "High-Volume Drone Jammer"],
    batteryOrFuelPercent: 88
  },
  {
    id: "DRONE-UNIT-2",
    callsign: "AeroScan Recon Drone 2",
    type: "DRONE_RECON_VAN",
    currentCoordinates: { x: 31, y: 20, lat: 37.7985, lng: -122.4275 },
    status: "ON_SCENE",
    assignedIncidentId: "INC-2026-882",
    officers: ["Drone Pilot K. Tanaka", "Analyst P. Scott"],
    equipment: ["Matrice 350 RTK Drone", "Zenmuse H20N Multispectral Cam", "Laser Rangefinder", "Direct 4G Telemetry Uplink"],
    batteryOrFuelPercent: 74
  },
  {
    id: "PATROL-BRAVO-3",
    callsign: "Pollution Patrol Interceptor Bravo",
    type: "ENVIRONMENTAL_POLICE",
    currentCoordinates: { x: 55, y: 68, lat: 37.7645, lng: -122.4112 },
    status: "DISPATCHED",
    assignedIncidentId: "INC-2026-883",
    officers: ["Inspector Diane Briggs", "Officer T. Vance"],
    equipment: ["Portable Photoionization Gas Detector", "Digital Summons Terminal", "Evidence Bagging Kit"],
    batteryOrFuelPercent: 92
  },
  {
    id: "COMMUNITY-WARDEN-4",
    callsign: "EcoWarden Civic Unit 4",
    type: "COMMUNITY_WARDEN",
    currentCoordinates: { x: 26, y: 62, lat: 37.7708, lng: -122.4335 },
    status: "ON_PATROL",
    assignedIncidentId: "INC-2026-884",
    officers: ["Warden Lin Zhang"],
    equipment: ["First Responder Fire Blanket", "Civic Education Notice Pack", "Mobile Tablet Scanner"],
    batteryOrFuelPercent: 81
  }
];

export const SAMPLE_BURN_IMAGES = [
  {
    name: "Tire & Cable Scrap Fire (Dense Black)",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
    material: "TIRES_RUBBER",
    hint: "Heavy black smoke with dark soot plume indicating rubber and hydrocarbons"
  },
  {
    name: "Plastic Dump Open Flame (Acrid)",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
    material: "PLASTIC_PACKAGING",
    hint: "Mixed plastic containers and synthetic packaging burning with toxic dioxin emission"
  },
  {
    name: "Crop Straw Field Burning (Broad)",
    url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
    material: "AGRICULTURAL_STUBBLE",
    hint: "Expansive field stubble line burn creating wide haze and high particulate matter"
  },
  {
    name: "Construction Timber & Paint Residue",
    url: "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1000&q=80",
    material: "CONSTRUCTION_DEBRIS",
    hint: "Lumber offcuts, plywood adhesives and packaging pallets burning on construction site"
  }
];
