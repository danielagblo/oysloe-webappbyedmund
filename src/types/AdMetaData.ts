export interface AdMetadata {
  title: string;
  category: string;
  purpose: string;
  location: string;
  duration: string;
  images: { id: number; url: string; hasFile: boolean }[];
  createdAt: string;
}
