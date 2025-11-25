import type { Location, LocationPayload, Region } from "../types/Location";
import { apiClient } from "./apiClient";

export const getLocations = async (params?: {
  name?: string;
  ordering?: string;
  region?: Region;
  search?: string;
}): Promise<Location[]> => {
  const qs = new URLSearchParams();
  if (params?.name) qs.append("name", params.name);
  if (params?.ordering) qs.append("ordering", params.ordering);
  if (params?.region) qs.append("region", params.region);
  if (params?.search) qs.append("search", params.search);

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return apiClient.get<Location[]>(`/locations/${query}`);
};

export const getLocation = async (id: number): Promise<Location> => {
  return apiClient.get<Location>(`/locations/${id}/`);
};

export const createLocation = async (
  body: LocationPayload,
): Promise<Location> => {
  return apiClient.post<Location>(`/locations/`, body);
};

export const updateLocation = async (
  id: number,
  body: LocationPayload,
): Promise<Location> => {
  return apiClient.put<Location>(`/locations/${id}/`, body);
};

export const patchLocation = async (
  id: number,
  body: Partial<LocationPayload>,
): Promise<Location> => {
  return apiClient.patch<Location>(`/locations/${id}/`, body);
};

export const deleteLocation = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/locations/${id}/`);
};

export default {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  patchLocation,
  deleteLocation,
};
