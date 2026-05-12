// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  // Library build mode
  if (mode === "library") {
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, "src/theme/index.ts"),
          name: "UIThemeLibrary",
          formats: ["es", "cjs"],
          fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
        },
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react-router-dom",
            "react/jsx-runtime",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
            "class-variance-authority",
            "clsx",
            "cmdk",
            "framer-motion",
            "input-otp",
            "lucide-react",
            "react-day-picker",
            "tailwind-merge",
            "tailwindcss-animate",
          ],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react-router-dom": "ReactRouterDOM",
            },
          },
        },
        outDir: "dist",
        emptyOutDir: true,
        cssCodeSplit: false,
        copyPublicDir: false,
      },
      css: {
        // Bundle CSS into a single file
        postcss: "./postcss.config.cjs",
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },
    };
  }

  // Demo/development mode
  return {
    plugins: [react()],
    build: {
      outDir: "dist-demo",
      emptyOutDir: true,
    },
    server: {
      proxy: {
        "/api": {
          target: "http://sso.localtest.me:8000",
          changeOrigin: true,
          secure: false,
        },
      },

      host: '0.0.0.0',
      allowedHosts: ['frontend.localtest.me']

    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
