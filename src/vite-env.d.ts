/// <reference types="vite/client" />
/// <reference types="vite-imagetools" />

declare module "*?w=*&format=*&as=srcset" {
  const srcset: string;
  export default srcset;
}

declare module "*.jpeg?*" {
  const src: string;
  export default src;
}

declare module "*.jpg?*" {
  const src: string;
  export default src;
}

declare module "*.png?*" {
  const src: string;
  export default src;
}

declare module "*?*" {
  const src: string;
  export default src;
}

declare module "*?url" {
  const src: string;
  export default src;
}
