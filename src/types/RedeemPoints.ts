export interface RedeemPointsRequest {
  redeemed_points: number;
  cash_amount: string | number;
  remaining_points: number;
  wallet_balance: string | number;
}

export interface RedeemPointsResponse {
  redeemed_points: number;
  cash_amount: string | number;
  remaining_points: number;
  wallet_balance: string | number;
}
