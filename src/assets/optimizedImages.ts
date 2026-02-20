type ImageMap = Record<string, string>;

export type OptimizedImage = {
  src: string;
  srcSet?: string;
};

const optimizedSrcModules = import.meta.glob("./*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: { w: 512 },
}) as ImageMap;

const optimizedSrcSetModules = import.meta.glob("./*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: { w: "128;256;512", as: "srcset" },
}) as ImageMap;

const mapByFileName = (mods: ImageMap) =>
  Object.fromEntries(
    Object.entries(mods).map(([path, url]) => {
      const name = path.split("/").pop() || path;
      return [name, url];
    }),
  ) as ImageMap;

const optimizedSrcByName = mapByFileName(optimizedSrcModules);
const optimizedSrcSetByName = mapByFileName(optimizedSrcSetModules);

export const getOptimizedAsset = (name: string): OptimizedImage => {
  const src = optimizedSrcByName[name];
  if (!src) {
    return { src: new URL(`./${name}`, import.meta.url).href };
  }
  const srcSet = optimizedSrcSetByName[name];
  return { src, srcSet };
};
