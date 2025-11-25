export type Region =
  | "Ahafo"
  | "Ashanti"
  | "Bono East"
  | "Brong Ahafo"
  | "Central"
  | "Eastern"
  | "Greater Accra"
  | "North East"
  | "Northern"
  | "Oti"
  | "Savannah"
  | "Upper East"
  | "Upper West"
  | "Volta"
  | "Western"
  | "Western North";

export interface Location {
  id: number;
  region: Region;
  name: string;
  created_at: string;
  updated_at: string;
}

export type LocationPayload = {
  region: Region;
  name: string;
};
