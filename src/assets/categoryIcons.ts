import { assetUrl } from "./publicAssets";

export type CategoryIcon = {
  src: string;
  srcSet?: string;
};

type GlobMap = Record<string, string>;

const iconSrcModules = import.meta.glob("./public/*.png", {
  eager: true,
  import: "default",
  query: { w: 128, format: "png" },
}) as GlobMap;

const iconSrcSetModules = import.meta.glob("./public/*.png", {
  eager: true,
  import: "default",
  query: { w: "64;128", format: "png", as: "srcset" },
}) as GlobMap;

const mapByFileName = (mods: GlobMap) =>
  Object.fromEntries(
    Object.entries(mods).map(([path, url]) => {
      const name = path.split("/").pop() || path;
      return [name, url];
    }),
  ) as Record<string, string>;

const iconSrcByName = mapByFileName(iconSrcModules);
const iconSrcSetByName = mapByFileName(iconSrcSetModules);

const normalizeCategoryKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const getCategoryIcon = (name: string): CategoryIcon => {
  const key = normalizeCategoryKey(name);
  const fileName = `${key}.png`;
  const src = iconSrcByName[fileName];
  if (!src) {
    return { src: assetUrl(fileName) };
  }
  const srcSet = iconSrcSetByName[fileName];
  return { src, srcSet };
};
