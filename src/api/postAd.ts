import { type AdMetadata } from "../types/AdMetaData";

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
