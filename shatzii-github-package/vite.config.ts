import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react({
      // Enable React optimization for production
      babel: {
        plugins: process.env.NODE_ENV === "production" ? [] : [],
      },
    }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false, // Disable sourcemaps for production
    minify: "esbuild", // Use esbuild for faster minification
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for stable libraries
          vendor: ["react", "react-dom"],
          // UI library chunk
          ui: [
            "lucide-react",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          // Routing and state management
          router: ["wouter", "@tanstack/react-query"],
          // Charts and data visualization
          charts: ["recharts"],
          // Utilities
          utils: ["clsx", "tailwind-merge", "date-fns", "zod"],
        },
        // Optimize chunk naming
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Compression optimizations
    chunkSizeWarningLimit: 1000,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  // Production optimizations
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  // CSS optimization
  css: {
    devSourcemap: process.env.NODE_ENV !== "production",
  },
});
