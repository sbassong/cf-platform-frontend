import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    // setupNodeEvents(on, config) {

    // },
    defaultCommandTimeout: 10000,
    // Disable video recording for local runs to save space
    video: false,
  },
});
