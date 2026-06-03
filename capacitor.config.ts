import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.choyis.news",
  appName: "Choyis News",
  webDir: "out",
  server: {
    androidScheme: "https"
  }
};

export default config;
