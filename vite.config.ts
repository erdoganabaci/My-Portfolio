import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true
  },
  test: {
    css: true,
    environment: "jsdom",
    setupFiles: "./src/testing/setup.ts"
  }
});
