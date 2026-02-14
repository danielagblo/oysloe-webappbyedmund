type AssetMap = Record<string, string>;

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

export const assetUrl = (name: string) => {
  return byName[name] || `/${name}`;
};
