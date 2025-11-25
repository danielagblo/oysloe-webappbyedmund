import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";
import mockOTPsRaw from "../assets/mocks/otpPosts.json";

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface GenericMessage {
  success: boolean;
  message: string;
}

const mockOTPs: Record<string, string> = (
  mockOTPsRaw as { phone: string; otp: string }[]
).reduce(
  (acc, curr) => {
    acc[curr.phone] = curr.otp;
    return acc;
  },
  {} as Record<string, string>,
);

const useMocks = import.meta.env.VITE_USE_MOCKS === "true";

export async function sendOTP(phone: string): Promise<GenericMessage> {
  if (useMocks) {
    if (!mockOTPs[phone]) {
      return {
        success: false,
        message: `No mock OTP configured for phone ${phone}`,
      };
    }
    return {
      success: true,
      message: `Mock OTP sent to ${phone}`,
    };
  }

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
): Promise<GenericMessage> {
  if (useMocks) {
    const correctOTP = mockOTPs[payload.phone];
    if (!correctOTP) {
      throw new Error(`No mock OTP configured for phone ${payload.phone}`);
    }
    if (correctOTP === payload.otp) {
      return {
        success: true,
        message: "OTP verified successfully (mock)",
      };
    } else {
      throw new Error("Invalid OTP (mock)");
    }
  }

  return apiClient.post<GenericMessage>(endpoints.verifyOTP.verify(), payload);
}
