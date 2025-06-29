
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";
    import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
    import path from "path";
    import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

    // Dummy cartographer function
    function cartographer() {
      return {
        name: 'cartographer-dummy',
        apply: () => {},
        enforce: 'pre',
      };
    }

    export default defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        themePlugin(),
        ...(process.env.NODE_ENV !== "production" &&
        process.env.REPL_ID !== undefined
          ? [cartographer()]
          : []),
      ],
      resolve: {
        alias: {
          "@": path.resolve("./client/src"),
          "@shared": path.resolve("./shared"),
          "@assets": path.resolve("./attached_assets"),
        },
      },
      root: path.resolve("./client"),
      build: {
        outDir: path.resolve("./dist/public"),
        emptyOutDir: true,
      },
    });
  