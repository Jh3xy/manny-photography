
import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Safely defines __dirname to ensure absolute compatibility on cloud platforms
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        gallery: path.resolve(__dirname, "src/gallery/index.html"),
      },
    },
  },
});
