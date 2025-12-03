import type { LocationPayload } from "./Location";

export interface AdMetadata {
  title: string;
  category: string;
  purpose: string;
  location: LocationPayload;
  duration: string;
  pricing: {
    monthly: {
      duration: string;
      value: number;
    };
  };
  images: { id: number; url: string; hasFile: boolean }[];
  createdAt: string;
}
