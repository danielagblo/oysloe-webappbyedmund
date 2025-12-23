// Placeholder service worker.
// The real Firebase messaging SW is generated at build time via:
//   npm run generate-sw
// That script injects env-based config and should NOT be committed with secrets.
// If you see this file in production, it means generate-sw did not run.
// In that case, push notifications will not work until the SW is regenerated.

self.addEventListener("install", () => {
  console.error(
    "[firebase-messaging-sw.js] Placeholder loaded. Run `npm run generate-sw` to generate the real service worker with env config."
  );
});

self.addEventListener("fetch", () => {
  // no-op placeholder
});
