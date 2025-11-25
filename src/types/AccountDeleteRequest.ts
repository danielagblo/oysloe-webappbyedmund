export interface AccountDeleteRequest {
  id: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  admin_comment?: string;
  created_at: string;
  processed_at?: string;
}

export type AccountDeleteRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
