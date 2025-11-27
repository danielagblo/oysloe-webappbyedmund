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
    const response = await apiClient.get<GenericMessage>(
      endpoints.verifyOTP.send(phone),
    );

    if (!response || typeof response.message !== "string") {
      throw new Error("Unexpected response format");
    }

    return response;
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
  return apiClient.post<{ phone: string }>(
    endpoints.verifyOTP.verify(),
    payload,
  );
}
