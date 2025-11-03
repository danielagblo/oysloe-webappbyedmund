import { type AdMetadata } from "../types/AdMetaData";

const mockDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
