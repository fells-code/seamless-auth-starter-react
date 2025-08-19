import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [react()],
    ...(isDev && {
      server: {
        https: {
          key: fs.readFileSync(".cert/key.pem"),
          cert: fs.readFileSync(".cert/cert.pem"),
        },
        host: "localhost",
        port: 5001,
      },
    }),
  };
});
