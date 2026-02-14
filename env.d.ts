declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_URL?: string;
    REACT_APP_USE_MOCKS?: string;
  }
}

/// <reference types="vite-imagetools" />

declare module "*?url" {
  const src: string;
  export default src;
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

declare module "*?w=*&format=*&as=srcset" {
  const srcset: string;
  export default srcset;
}
