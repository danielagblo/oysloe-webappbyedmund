import { apiClient } from "../services/apiClient";
import { endpoints } from "../services/endpoints";
import { type AdMetadata } from "../types/AdMetaData";

export const postAd = {
  async uploadAd(metadata: AdMetadata) {
    // Send AdMetadata to the products create endpoint. The backend
    // should accept the payload or map it server-side. If your API
    // expects a different shape, update the mapping here.
    try {
      const res = await apiClient.post<{
        success: boolean;
        message: string;
        adId?: number;
      }>(endpoints.products.create, metadata);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Upload failed: ${msg}`);
    }
  },
};
