import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Coords {
  lat: number;
  lng: number;
}

function LocationPicker({
  onSelect,
}: {
  onSelect: (coords: Coords, placeName: string) => void;
}) {
  const [position, setPosition] = useState<Coords | null>(null);

  useMapEvents({
    async click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );
        const data: { display_name?: string } = await res.json();
        const placeName =
          data.display_name?.split(",")[0] || "Unknown location";
        onSelect({ lat, lng }, placeName);
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
        onSelect({ lat, lng }, "Unknown location");
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

interface LocationSelectorProps {
  onConfirm?: (
    selection: {
      coords: { lat: number; lng: number };
      placeName: string;
    } | null,
  ) => void;
  selectedLocation?: {
    coords: { lat: number; lng: number };
    placeName: string;
  } | null;
}

export default function LocationSelector({
  onConfirm,
  selectedLocation,
}: LocationSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<{
    coords: Coords;
    placeName: string;
  } | null>(null);
  const [finalSelection, setFinalSelection] = useState(
    selectedLocation || null,
  );

  useEffect(() => {
    setFinalSelection(selectedLocation || null);
  }, [selectedLocation]);

  const handleConfirm = () => {
    if (tempSelection) {
      setFinalSelection(tempSelection);
      setIsModalOpen(false);
      if (onConfirm) onConfirm(tempSelection);
    }
  };

  return (
    <div className="relative">
      <div
        className="w-full p-3 border rounded-xl border-[var(--div-border)] text-gray-600 cursor-pointer bg-white"
        onClick={() => setIsModalOpen(true)}
      >
        {finalSelection
          ? `${finalSelection.placeName}`
          : "Select location on map"}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-3xl h-[85vh] p-4 relative flex flex-col">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-6 text-gray-600 font-bold text-2xl hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Select Location
            </h2>

            <div className="flex-1 mb-4 rounded-xl overflow-hidden">
              <MapContainer
                center={[7.9465, -1.0232]}
                zoom={7}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1rem",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker
                  onSelect={(coords, placeName) =>
                    setTempSelection({ coords, placeName })
                  }
                />
              </MapContainer>
            </div>

            {tempSelection && (
              <div className="text-sm text-gray-700 mb-4">
                <p>
                  <strong>Selected:</strong> {tempSelection.placeName}
                </p>
                <p className="text-xs text-gray-500">
                  Lat: {tempSelection.coords.lat.toFixed(4)}, Lng:{" "}
                  {tempSelection.coords.lng.toFixed(4)}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!tempSelection}
                className={`px-4 py-2 rounded-lg ${
                  tempSelection
                    ? "bg-[var(--dark-def)] text-white hover:bg-[var(--div-active)] hover:text-[var(--dark-def)] border hover:border-[var(--dark-def)] active:scale-98"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
