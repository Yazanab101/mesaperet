import { copyFileSync } from "fs";
import { resolve } from "path";

// GitHub Pages SPA fallback: unknown routes serve the app shell
const dist = resolve("dist");
copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
console.log("Wrote dist/404.html for SPA routing");
