import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Inline the app's generated JS and CSS into index.html while leaving public/
 * media external. The previous third-party plugin pulled a glob matcher into
 * the build solely for an optional include pattern this project never used;
 * that matcher has no patched release for its stack-exhaustion advisory. This
 * bounded plugin implements only the invariant this repository needs: one JS
 * chunk, one CSS asset, one HTML artifact.
 */
function singleFileBundle(): Plugin {
  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    name: "yaslogist-single-file",
    enforce: "post",
    config(config) {
      config.base = "./";
      config.build ??= {};
      config.build.assetsInlineLimit = () => true;
      config.build.chunkSizeWarningLimit = 100_000_000;
      config.build.cssCodeSplit = false;
      config.build.assetsDir = "";
      config.build.rollupOptions ??= {};
      config.build.rollupOptions.output ??= {};
      const outputs = Array.isArray(config.build.rollupOptions.output)
        ? config.build.rollupOptions.output
        : [config.build.rollupOptions.output];
      outputs.forEach((output) => { output.inlineDynamicImports = true; });
    },
    generateBundle(_options, bundle) {
      const htmlNames = Object.keys(bundle).filter((name) => /\.html?$/.test(name));
      const jsNames = Object.keys(bundle).filter((name) => /\.[mc]?js$/.test(name));
      const cssNames = Object.keys(bundle).filter((name) => /\.css$/.test(name));
      const inlined = new Set<string>();

      for (const htmlName of htmlNames) {
        const htmlAsset = bundle[htmlName];
        if (htmlAsset.type !== "asset") continue;
        let html = typeof htmlAsset.source === "string"
          ? htmlAsset.source
          : new TextDecoder().decode(htmlAsset.source);

        for (const jsName of jsNames) {
          const chunk = bundle[jsName];
          if (chunk.type !== "chunk") continue;
          const filename = escapeRegex(chunk.fileName);
          const tag = new RegExp(`<script([^>]*?) src="(?:[^"]*?/)?${filename}"([^>]*)></script>`);
          const code = chunk.code
            .replace(/"?__VITE_PRELOAD__"?/g, "void 0")
            .replace(/<(\/script>|!--)/g, "\\x3C$1")
            .trim();
          html = html.replace(tag, (_match, beforeSrc: string, afterSrc: string) =>
            `<script${beforeSrc}${afterSrc}>${code}</script>`);
          inlined.add(jsName);
          this.info(`Inlining: ${jsName}`);
        }

        for (const cssName of cssNames) {
          const asset = bundle[cssName];
          if (asset.type !== "asset") continue;
          const filename = escapeRegex(asset.fileName);
          const tag = new RegExp(`<link([^>]*?) href="(?:[^"]*?/)?${filename}"([^>]*)>`);
          const css = (typeof asset.source === "string"
            ? asset.source
            : new TextDecoder().decode(asset.source))
            .replace('@charset "UTF-8";', "")
            .trim();
          html = html.replace(tag, (_match, beforeHref: string, afterHref: string) =>
            `<style${beforeHref}${afterHref}>${css}</style>`);
          inlined.add(cssName);
          this.info(`Inlining: ${cssName}`);
        }

        htmlAsset.source = html;
      }

      inlined.forEach((name) => { delete bundle[name]; });
    },
  };
}

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
  /* Agent/CI previews are reverse-proxied through an ephemeral hostname. The
     development server binds beyond localhost and accepts that proxy host;
     production remains governed by Vercel's host and security headers. */
  server: {
    host: true,
    allowedHosts: true,
  },
  plugins: [react(), tailwindcss(), singleFileBundle(), stripJunkFiles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
