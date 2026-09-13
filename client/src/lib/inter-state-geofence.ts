/**
 * INTER-STATE GEOFENCE & DYNAMIC TERRITORY ROUTER
 * Detects Indian State / UT boundaries from GPS latitude & longitude coordinates.
 * Automatically synchronizes the entire platform context upon entering a new territory.
 */

import { allIndianStates, getStateById, type IndianStateData } from "./india-safety-data";

export interface StateBoundingBox {
  stateId: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Approximate Geographic Bounding Boxes for all 36 Indian States & UTs.
 * Used for fast first-pass spatial indexing.
 */
export const STATE_BOUNDING_BOXES: StateBoundingBox[] = [
  // South
  { stateId: "KA", minLat: 11.5, maxLat: 18.5, minLng: 74.0, maxLng: 78.6 }, // Karnataka
  { stateId: "TN", minLat: 8.0, maxLat: 13.6, minLng: 76.2, maxLng: 80.4 },  // Tamil Nadu
  { stateId: "KL", minLat: 8.2, maxLat: 12.8, minLng: 74.8, maxLng: 77.5 },  // Kerala
  { stateId: "AP", minLat: 12.6, maxLat: 19.1, minLng: 76.7, maxLng: 84.8 }, // Andhra Pradesh
  { stateId: "TG", minLat: 15.8, maxLat: 19.9, minLng: 77.2, maxLng: 81.8 }, // Telangana
  { stateId: "GA", minLat: 14.8, maxLat: 15.8, minLng: 73.6, maxLng: 74.4 }, // Goa
  { stateId: "PY", minLat: 11.8, maxLat: 12.1, minLng: 79.6, maxLng: 79.9 }, // Puducherry

  // West
  { stateId: "MH", minLat: 15.6, maxLat: 22.1, minLng: 72.6, maxLng: 80.9 }, // Maharashtra
  { stateId: "GJ", minLat: 20.1, maxLat: 24.7, minLng: 68.1, maxLng: 74.5 }, // Gujarat
  { stateId: "DD", minLat: 20.3, maxLat: 20.9, minLng: 72.8, maxLng: 73.3 }, // Daman & Diu

  // North
  { stateId: "DL", minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.4 }, // Delhi
  { stateId: "RJ", minLat: 23.3, maxLat: 30.2, minLng: 69.5, maxLng: 78.3 }, // Rajasthan
  { stateId: "HR", minLat: 27.6, maxLat: 30.9, minLng: 74.4, maxLng: 77.6 }, // Haryana
  { stateId: "PB", minLat: 29.5, maxLat: 32.5, minLng: 73.8, maxLng: 76.9 }, // Punjab
  { stateId: "HP", minLat: 30.3, maxLat: 33.3, minLng: 75.7, maxLng: 79.1 }, // Himachal Pradesh
  { stateId: "UK", minLat: 28.7, maxLat: 31.5, minLng: 77.5, maxLng: 81.1 }, // Uttarakhand
  { stateId: "JK", minLat: 32.2, maxLat: 37.1, minLng: 73.4, maxLng: 76.5 }, // Jammu & Kashmir
  { stateId: "LA", minLat: 32.5, maxLat: 36.5, minLng: 75.5, maxLng: 80.5 }, // Ladakh
  { stateId: "CH", minLat: 30.6, maxLat: 30.8, minLng: 76.7, maxLng: 76.9 }, // Chandigarh

  // Central
  { stateId: "MP", minLat: 21.1, maxLat: 26.9, minLng: 74.0, maxLng: 82.8 }, // Madhya Pradesh
  { stateId: "CG", minLat: 17.8, maxLat: 24.1, minLng: 80.2, maxLng: 84.4 }, // Chhattisgarh
  { stateId: "UP", minLat: 23.8, maxLat: 30.4, minLng: 77.0, maxLng: 84.7 }, // Uttar Pradesh

  // East
  { stateId: "WB", minLat: 21.5, maxLat: 27.2, minLng: 85.8, maxLng: 89.9 }, // West Bengal
  { stateId: "BR", minLat: 24.3, maxLat: 27.5, minLng: 83.3, maxLng: 88.3 }, // Bihar
  { stateId: "OD", minLat: 17.8, maxLat: 22.6, minLng: 81.3, maxLng: 87.5 }, // Odisha
  { stateId: "JH", minLat: 21.9, maxLat: 25.3, minLng: 83.3, maxLng: 87.9 }, // Jharkhand

  // North-East
  { stateId: "AS", minLat: 24.1, maxLat: 28.0, minLng: 89.7, maxLng: 96.0 }, // Assam
  { stateId: "SK", minLat: 27.1, maxLat: 28.1, minLng: 88.0, maxLng: 88.9 }, // Sikkim
  { stateId: "AR", minLat: 26.5, maxLat: 29.5, minLng: 91.5, maxLng: 97.5 }, // Arunachal Pradesh
  { stateId: "ML", minLat: 25.0, maxLat: 26.1, minLng: 89.8, maxLng: 92.8 }, // Meghalaya
  { stateId: "MN", minLat: 23.8, maxLat: 25.7, minLng: 93.0, maxLng: 94.8 }, // Manipur
  { stateId: "MZ", minLat: 21.9, maxLat: 24.5, minLng: 92.2, maxLng: 93.4 }, // Mizoram
  { stateId: "NL", minLat: 25.1, maxLat: 27.0, minLng: 93.3, maxLng: 95.3 }, // Nagaland
  { stateId: "TR", minLat: 22.9, maxLat: 24.5, minLng: 91.1, maxLng: 92.3 }, // Tripura

  // Islands
  { stateId: "AN", minLat: 6.7, maxLat: 13.7, minLng: 92.2, maxLng: 94.0 },  // Andaman & Nicobar
  { stateId: "LD", minLat: 8.2, maxLat: 12.4, minLng: 71.7, maxLng: 74.0 },  // Lakshadweep
];

/**
 * Calculates Great-Circle Haversine Distance in Kilometers between two coordinates.
 */
export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Detects which Indian State or UT a GPS coordinate belongs to.
 * Combines bounding box intersection with centroid distance minimization.
 */
export function detectStateFromCoordinates(
  lat: number,
  lng: number
): IndianStateData {
  // Step 1: Find candidate states whose bounding box encloses the point
  const matchingBoxes = STATE_BOUNDING_BOXES.filter(
    (b) => lat >= b.minLat && lat <= b.maxLat && lng >= b.minLng && lng <= b.maxLng
  );

  if (matchingBoxes.length === 1) {
    const found = getStateById(matchingBoxes[0].stateId);
    if (found) return found;
  }

  // Step 2: If multiple boxes match (e.g. border regions) or none (slight edge variance),
  // pick candidate state whose default location or closest safe point is nearest.
  const candidateList =
    matchingBoxes.length > 0
      ? matchingBoxes.map((b) => getStateById(b.stateId)).filter(Boolean) as IndianStateData[]
      : allIndianStates;

  let bestState = candidateList[0] || allIndianStates[0];
  let minDistance = Infinity;

  for (const st of candidateList) {
    const distToCenter = haversineDistanceKm(
      lat,
      lng,
      st.defaultLocation.lat,
      st.defaultLocation.lng
    );

    // Also compare against risk zones center points
    let minZoneDist = distToCenter;
    if (st.riskZones && st.riskZones.length > 0) {
      for (const z of st.riskZones) {
        const zd = haversineDistanceKm(lat, lng, z.center.lat, z.center.lng);
        if (zd < minZoneDist) minZoneDist = zd;
      }
    }

    const effectiveDist = Math.min(distToCenter, minZoneDist);
    if (effectiveDist < minDistance) {
      minDistance = effectiveDist;
      bestState = st;
    }
  }

  return bestState;
}

/**
 * Pre-configured Inter-State Transit Scenarios for live simulation and demonstration.
 */
export interface InterStateTransitRoute {
  id: string;
  title: string;
  fromState: string;
  toState: string;
  description: string;
  destination: {
    lat: number;
    lng: number;
    locationName: string;
  };
}

export const INTER_STATE_TRANSIT_ROUTES: InterStateTransitRoute[] = [
  {
    id: "route-ka-tn",
    title: "Bengaluru (KA) ➔ Hosur / Chennai (TN)",
    fromState: "KA",
    toState: "TN",
    description: "Crosses southern border into Tamil Nadu along the NH44 transit highway corridor.",
    destination: {
      lat: 13.0827,
      lng: 80.2707,
      locationName: "Marina Beach Promenade, Chennai",
    },
  },
  {
    id: "route-ka-ga",
    title: "Bengaluru (KA) ➔ Panaji & Calangute (GA)",
    fromState: "KA",
    toState: "GA",
    description: "Travels westward through the Western Ghats into coastal Goa.",
    destination: {
      lat: 15.4989,
      lng: 73.8278,
      locationName: "Panaji Capital & Calangute Coastal Corridor, Goa",
    },
  },
  {
    id: "route-ka-mh",
    title: "Belagavi (KA) ➔ Mumbai & Gateway (MH)",
    fromState: "KA",
    toState: "MH",
    description: "Crosses northern Karnataka border into Maharashtra via the Kolhapur-Pune express corridor.",
    destination: {
      lat: 18.922,
      lng: 72.8347,
      locationName: "Colaba & Gateway of India, Mumbai",
    },
  },
  {
    id: "route-dl-rj",
    title: "New Delhi (DL) ➔ Jaipur Pink City (RJ)",
    fromState: "DL",
    toState: "RJ",
    description: "Traverses Delhi NCR south-west through Gurugram border into Rajasthan.",
    destination: {
      lat: 26.9124,
      lng: 75.7873,
      locationName: "Hawa Mahal & Johari Bazaar, Jaipur",
    },
  },
  {
    id: "route-dl-hp",
    title: "New Delhi (DL) ➔ Shimla & Mall Road (HP)",
    fromState: "DL",
    toState: "HP",
    description: "Heads north towards the Himalayan foothills entering Himachal Pradesh.",
    destination: {
      lat: 31.1048,
      lng: 77.1734,
      locationName: "The Ridge & Mall Road, Shimla",
    },
  },
  {
    id: "route-ka-kl",
    title: "Mysuru (KA) ➔ Wayanad / Kochi (KL)",
    fromState: "KA",
    toState: "KL",
    description: "Travels south across Bandipur border into the lush backwater hills of Kerala.",
    destination: {
      lat: 9.9312,
      lng: 76.2673,
      locationName: "Fort Kochi Coastal Promenade, Kerala",
    },
  },
];
