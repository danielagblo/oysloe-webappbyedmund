const mockDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

export const mockPostAd = {
  async uploadAd(metadata: AdMetadata) {
    console.log("Mock upload:", metadata);
    await mockDelay(1000);
    return {
      success: true,
      message: "Ad successfully saved (from: mock).",
      adId: Math.floor(Math.random() * 100000),
    };
  },
};
