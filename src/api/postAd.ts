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
    value?: string;
  };
  images: { id: number; url: string; hasFile: boolean }[];
  createdAt: string;
}

export const postAd = {
  // async uploadAd(metadata: Record<string, unknown>) {
  async uploadAd(metadata: AdMetadata) {
    const response = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return (await response.json()) as {
      success: boolean;
      message: string;
      // [key: string]: unknown;
      adId?: number;
    };
  },
};