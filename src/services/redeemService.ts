import type {
    RedeemPointsRequest,
    RedeemPointsResponse,
} from "../types/RedeemPoints";
import { apiClient } from "./apiClient";
import endpoints from "./endpoints";

export const redeemPoints = async (
  body?: RedeemPointsRequest,
): Promise<RedeemPointsResponse> => {
  const payload = body ?? {};
  const res = await apiClient.post<RedeemPointsResponse>(
    endpoints.redeem.redeemPoints(),
    payload,
  );
  return res;
};

export default { redeemPoints };
