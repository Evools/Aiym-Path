import { ROUTES_DATA } from "@/data/routes.data";

export interface WaypointItem {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface MultiPointRouteResult {
  coordinates: [number, number][];
  distanceKm: number;
  durationHours: number;
}

// Helper: distance between two lat/lng in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find closest point in existing OSM mountain trails to snap cleanly
function findClosestTrailSegment(
  p1: [number, number],
  p2: [number, number]
): [number, number][] {
  let allTrailPoints: [number, number][] = [];
  ROUTES_DATA.forEach((r) => {
    allTrailPoints = allTrailPoints.concat(r.coordinates);
  });

  // Find index of closest trail point to p1 and p2
  let idx1 = 0;
  let minDist1 = Infinity;
  let idx2 = 0;
  let minDist2 = Infinity;

  allTrailPoints.forEach((pt, i) => {
    const d1 = getDistanceKm(p1[0], p1[1], pt[0], pt[1]);
    const d2 = getDistanceKm(p2[0], p2[1], pt[0], pt[1]);
    if (d1 < minDist1) {
      minDist1 = d1;
      idx1 = i;
    }
    if (d2 < minDist2) {
      minDist2 = d2;
      idx2 = i;
    }
  });

  if (minDist1 < 5 && minDist2 < 5 && Math.abs(idx1 - idx2) > 1) {
    const startIdx = Math.min(idx1, idx2);
    const endIdx = Math.max(idx1, idx2);
    const sub = allTrailPoints.slice(startIdx, endIdx + 1);
    return idx1 > idx2 ? sub.reverse() : sub;
  }

  // Linear interpolation with slight smooth curve
  const steps = 15;
  const line: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    line.push([
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ]);
  }
  return line;
}

export async function calculateMultiPointFootRoute(
  waypoints: [number, number][]
): Promise<MultiPointRouteResult> {
  if (waypoints.length < 2) {
    return { coordinates: waypoints, distanceKm: 0, durationHours: 0 };
  }

  // 1. Try OSRM Foot API first
  try {
    const coordsString = waypoints.map((p) => `${p[1]},${p[0]}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/foot/${coordsString}?overview=full&geometries=geojson`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const primary = data.routes[0];
        const geoCoords: [number, number][] = primary.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] as [number, number]
        );
        const distKm = Number((primary.distance / 1000).toFixed(1));
        const durHours = Number((primary.duration / 3600).toFixed(1));
        return {
          coordinates: geoCoords,
          distanceKm: distKm,
          durationHours: durHours > 0 ? durHours : 0.5,
        };
      }
    }
  } catch {
    // Fallback below
  }

  // 2. High-mountain fallback: Chain segments using authentic OSM trail geometry
  let fullPath: [number, number][] = [];
  let totalDistKm = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const pA = waypoints[i];
    const pB = waypoints[i + 1];
    const segment = findClosestTrailSegment(pA, pB);
    fullPath = fullPath.concat(segment);
    totalDistKm += getDistanceKm(pA[0], pA[1], pB[0], pB[1]);
  }

  // Average mountain walking speed ~ 3 km/h
  const durHours = Number((totalDistKm / 3).toFixed(1));

  return {
    coordinates: fullPath,
    distanceKm: Number(totalDistKm.toFixed(1)),
    durationHours: durHours > 0 ? durHours : 0.5,
  };
}
