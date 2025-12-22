import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface GenericMessage {
  success: boolean;
  message: string;
}

export async function sendOTP(phone: string): Promise<GenericMessage> {
  try {
    const response = await apiClient.get<any>(
      endpoints.verifyOTP.send(phone),
    );

    if (!response || typeof response.message !== "string") {
      throw new Error("Unexpected response format");
    }

    // If backend returned a token (e.g., { token } or { reset_token } or inside data),
    // persist it so subsequent password reset requests can include it.
    try {
      const token =
        response.token ?? response.reset_token ?? response.data?.token ?? response.data?.reset_token ?? null;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("oysloe_reset_token", String(token));
      }
    } catch (e) {
      // ignore localStorage errors
      void e;
    }

    return response as GenericMessage;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const responseText = (err as { responseText?: string }).responseText;
      if (responseText?.startsWith("<!doctype")) {
        throw new Error("Server returned HTML instead of JSON");
      }

      throw err;
    }

    throw new Error("Unknown error occurred");
  }
}

export async function verifyOTP(
  payload: VerifyOTPRequest,
): Promise<{ phone: string }> {
  const response = await apiClient.post<any>(endpoints.verifyOTP.verify(), payload);
  try {
    const token = response?.token ?? response?.reset_token ?? response?.data?.token ?? response?.data?.reset_token ?? null;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("oysloe_reset_token", String(token));
    }
  } catch (e) {
    void e;
  }
  return response as { phone: string };
}
