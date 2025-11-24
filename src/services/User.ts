const API_URL = import.meta.env.VITE_API_URL;
import type { RegisterUser } from "../types/User";

export async function registerUser(userData: RegisterUser) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

export async function getUserProfile() {
  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}