import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * macOS recreates .DS_Store inside public/ whenever the folder is opened in
 * Finder, and Vite copies public/ verbatim — so .gitignore cannot keep these
 * out of the shipped artifact. Strip them from the output after the bundle is
 * written, so a release never carries them regardless of local Finder state.
 */
function stripJunkFiles(): Plugin {
  const JUNK = new Set([".DS_Store", "Thumbs.db"]);
  return {
    name: "strip-junk-files",
    apply: "build",
    closeBundle() {
      const outDir = path.resolve(__dirname, "dist");
      if (!fs.existsSync(outDir)) return;
      let removed = 0;
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (JUNK.has(entry.name)) {
            fs.unlinkSync(full);
            removed++;
          }
        }
      };
      walk(outDir);
      if (removed) this.warn(`stripped ${removed} junk file(s) from dist/`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the externalized public/ frame sequences (referenced via
  // BASE_URL) resolve next to index.html wherever it is served — root,
  // sub-path, or file://. The inlined JS/CSS/images carry no URL, so they are
  // unaffected.
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile(), stripJunkFiles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
