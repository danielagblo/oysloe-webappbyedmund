export interface AdMetadata {
  title: string;
  category: string;
  purpose: string;
  pricing: {
    daily: { value: number | null; duration: string };
    weekly: { value: number | null; duration: string };
    monthly: { value: number | null; duration: string };
  };
  location: {
    type: "map" | "region";
    placeName?: string;
    coords?: { lat: number; lng: number };
    value?: string | null;
  };
  images: { id: number; url: string; hasFile: boolean }[];
  createdAt: string;
}
