const API_URL = import.meta.env.VITE_API_URL;
import type {
  ChangePasswordRequest,
  GenericMessage,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RegisterUserRequest,
  RegisterUserResponse,
  ResetPasswordRequest,
  SimpleStatusGenericMessage,
  SimpleStatusResponse,
  User,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "../types/AuthTypeApi";

/* -- Registration -- */
export async function registerUser(
  data: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // 401 or validation error
    return { message: result.message || "Registration failed" };
  }

  // 200 Success
  return result;
}
/* -- Logout -- */
export async function logoutUser(
  data: LogoutRequest,
): Promise<SimpleStatusResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Check if a token exists in the data and add it to the Authorization header
  // if (data.token) { // Assuming 'data' contains a 'token' field
  //   headers["Authorization"] = `Token ${data.token}`;
  // }

  const response = await fetch(`${API_URL}/logout/`, {
    method: "POST",
    headers: headers, // Use the updated headers
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // When the response is a 400 error, return both status and message to satisfy SimpleStatusResponse
    return {
      status: result.status || "error",
      message: result.message || "Logout failed",
    };
  }

  return result; // Has both status and message
}
/* -- Login -- */
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    return { message: result.message || "Invalid login credentials" };
  }

  return result;
}
/* -- OTP Login -- */
export async function otpLogin(
  data: VerifyOTPRequest,
): Promise<VerifyOTPResponse> {
  const response = await fetch(`${API_URL}/otplogin/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // 401 or other failure
    return { message: result.message || "Invalid OTP or phone number" };
  }

  return result;
}
export async function verifyOTP(
  data: VerifyOTPRequest,
): Promise<GenericMessage> {
  const response = await fetch(`${API_URL}/verifyotp/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // Handle 400 or 404
    return { message: result.message || "OTP verification failed" };
  }

  return result;
}
export async function sendOTP(phone: string): Promise<GenericMessage> {
  const response = await fetch(
    `${API_URL}/verifyotp/?phone=${encodeURIComponent(phone)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    // 400 or 404 response
    return { message: result.message || result.error || "Failed to send OTP" };
  }

  return result;
}

/* -- Reset Password -- */
export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<SimpleStatusGenericMessage> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Check if a token exists in the data and add it to the Authorization header
  if (data.token) {
    // Assuming 'data' contains a 'token' field
    headers["Authorization"] = `Token ${data.token}`;
  }

  const response = await fetch(`${API_URL}/resetpassword/`, {
    method: "POST",
    headers: headers, // Use the updated headers
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // When the response is a 400 error, we’ll return that message shape
    return { message: result.message || "Password reset failed" };
  }

  return result; // Has both status and message
}

/* -- Change Password -- */
export async function changePassword(
  data: ChangePasswordRequest,
): Promise<SimpleStatusGenericMessage> {
  const response = await fetch(`${API_URL}/changepassword/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // When the response is a 400 error, we’ll return that message shape
    return { message: result.message || "Password reset failed" };
  }

  return result; // Has both status and message
}

/* -- Profile data -- */
export async function getUserProfile(token: string): Promise<User | null> {
  const response = await fetch(`${API_URL}/userprofile/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch profile:", response.status);
    return null;
  }

  return await response.json();
}
