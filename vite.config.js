import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(), tailwindcss(),],
  server: {
    // This allows the tunnel URL to access your local server
    allowedHosts: true,
  }
});