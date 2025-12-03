import { useEffect, useMemo, useState } from "react";

export type SavedLocation = { label: string; region: string; place: string };
export type LocationDetails = { region: string; place: string } | null;

const STORAGE_KEY = "oysloe.savedLocations";

/**
 * groupedLocations: Record<region, string[]>
 */
export default function useLocationSelection(groupedLocations: Record<string, string[]> = {}) {
  // UI label for dropdown (place name) or null before selection
  const [regionLabel, setRegionLabel] = useState<string | null>(null);

  // canonical backend payload (region+place) — SINGLE source-of-truth for submission
  const [locationDetails, setLocationDetails] = useState<LocationDetails>(null);

  // modal / temp fields used when saving a location
  const [showSaveLocationModal, setShowSaveLocationModal] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");

  // saved locations persisted to localStorage
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (!Array.isArray(parsed)) return [];

      // support legacy string list
      if (parsed.length > 0 && typeof parsed[0] === "string") {
        return parsed.map((s: string) => ({ label: s, region: "", place: s }));
      }

      return parsed.map((p: any) => ({
        label: typeof p.label === "string" ? p.label : String(p),
        region: typeof p.region === "string" ? p.region : "",
        place: typeof p.place === "string" ? p.place : (p.label ?? ""),
      }));
    } catch {
      return [];
    }
  });

  // persist saved locations
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations));
    } catch {
      // ignore
    }
  }, [savedLocations]);

  // helper: resolve region for a place (returns { region, place })
  const resolveRegionAndPlace = (place: string) => {
    const target = (place || "").trim().toLowerCase();
    for (const region of Object.keys(groupedLocations || {})) {
      const places = groupedLocations[region] ?? [];
      if (!Array.isArray(places)) continue;
      for (const p of places) {
        if (String(p || "").trim().toLowerCase() === target) {
          return { region, place: String(p) };
        }
      }
    }
    // fallback: unknown region
    return { region: "", place };
  };

  // helper: parse an option string that may contain both region and place
  const parseOptionString = (opt: string) => {
    const raw = (opt || "").trim();
    if (!raw) return { region: "", place: "" };

    const tryMatch = (a: string, b: string) => {
      // check if b is a known region and contains a as a place
      const regionKey = Object.keys(groupedLocations).find(r => String(r || "").trim().toLowerCase() === b.trim().toLowerCase());
      if (regionKey) {
        const places = groupedLocations[regionKey] ?? [];
        if (Array.isArray(places) && places.find(p => String(p || "").trim().toLowerCase() === a.trim().toLowerCase())) {
          // return canonical forms
          const matchedPlace = places.find(p => String(p || "").trim().toLowerCase() === a.trim().toLowerCase()) as string;
          return { region: regionKey, place: String(matchedPlace) };
        }
      }
      return null;
    };

    // common separators: " - ", ","
    if (raw.includes(" - ")) {
      const parts = raw.split(" - ").map(s => s.trim());
      if (parts.length >= 2) {
        // try both orders
        const a = tryMatch(parts[0], parts[1]) || tryMatch(parts[1], parts[0]);
        if (a) return a;
        // fallback: assume format "Region - Place"
        return { region: parts[0], place: parts.slice(1).join(" - ") };
      }
    }

    if (raw.includes(",")) {
      const parts = raw.split(",").map(s => s.trim());
      if (parts.length >= 2) {
        const a = tryMatch(parts[0], parts[1]) || tryMatch(parts[1], parts[0]);
        if (a) return a;
        // fallback: assume "Place, Region"
        return { region: parts.slice(1).join(", "), place: parts[0] };
      }
    }

    // final fallback: try to resolve by place name only (case-insensitive)
    return resolveRegionAndPlace(raw);
  };

  // user clicked a place from dropdown or typed a place we resolved:
  const selectPlace = (opt: string) => {
    const parsed = parseOptionString(opt);
    // UI label shows place (and region for clarity)
    const label = parsed.region ? `${parsed.place}, ${parsed.region}` : parsed.place;
    setRegionLabel(label || null);
    setLocationDetails({ region: parsed.region, place: parsed.place });
    setShowSaveLocationModal(true);
  };

  // apply a saved location to the form (user clicked a saved shortcut)
  const applySavedLocation = (loc: SavedLocation) => {
    const label = loc.region ? `${loc.place}, ${loc.region}` : loc.place;
    setRegionLabel(label || null);
    setLocationDetails({ region: loc.region, place: loc.place });
  };

  // Save current selected place into savedLocations (called when user confirms the modal)
  const saveCurrentLocation = () => {
    if (!locationDetails) return false;

    const label = newLocationName.trim() !== "" ? newLocationName.trim() : locationDetails.place;
    setSavedLocations((prev) => {
      if (prev.some((p) => p.place === locationDetails.place && p.region === locationDetails.region)) return prev;
      return [...prev, { label, region: locationDetails.region, place: locationDetails.place }];
    });

    // cleanup modal
    setNewLocationName("");
    setShowSaveLocationModal(false);
    return true;
  };

  const removeSavedLocation = (index: number) => {
    setSavedLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setRegionLabel(null);
    setLocationDetails(null);
    setShowSaveLocationModal(false);
    setNewLocationName("");
  };

  // expose groupedLocations as memo so callers can show options easily
  const grouped = useMemo(() => groupedLocations || {}, [groupedLocations]);

  return {
    // data
    regionLabel,
    locationDetails,
    savedLocations,
    showSaveLocationModal,
    newLocationName,
    grouped,

    // setters / actions
    setNewLocationName,
    selectPlace,
    applySavedLocation,
    saveCurrentLocation,
    removeSavedLocation,
    setShowSaveLocationModal,
    reset,
  } as const;
}
