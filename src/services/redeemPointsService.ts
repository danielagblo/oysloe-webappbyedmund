import type {
  RedeemPointsRequest,
  RedeemPointsResponse,
} from "../types/RedeemPoints";
import { apiClient } from "./apiClient";

export const redeemPoints = async (
  body: RedeemPointsRequest,
): Promise<RedeemPointsResponse> => {
  return apiClient.post<RedeemPointsResponse>(`/redeem-points/`, body);
};

export default {
  redeemPoints,
};
