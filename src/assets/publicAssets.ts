type AssetMap = Record<string, string>;

type RasterAsset = {
  src: string;
  srcSet?: string;
};

const modules = import.meta.glob("./public/**/*", {
  eager: true,
  import: "default",
}) as AssetMap;

const byName: AssetMap = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => {
    const name = path.split("/").pop() || path;
    return [name, url as string];
  }),
);

const rasterSrcModules = import.meta.glob("./public/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: { w: 512 },
}) as AssetMap;

const rasterSrcSetModules = import.meta.glob("./public/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: { w: "128;256;512", as: "srcset" },
}) as AssetMap;

const byFileName = (assets: AssetMap) =>
  Object.fromEntries(
    Object.entries(assets).map(([path, url]) => {
      const name = path.split("/").pop() || path;
      return [name, url as string];
    }),
  ) as AssetMap;

const rasterSrcByName = byFileName(rasterSrcModules);
const rasterSrcSetByName = byFileName(rasterSrcSetModules);

export const assetUrl = (name: string) => {
  return byName[name] || `/${name}`;
};

export const assetImage = (name: string): RasterAsset => {
  const src = rasterSrcByName[name];
  if (!src) {
    return { src: assetUrl(name) };
  }
  const srcSet = rasterSrcSetByName[name];
  return { src, srcSet };
};
