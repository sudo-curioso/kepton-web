import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dopamind.app',
  appName: 'Dopamind',
  webDir: 'out',
  server: {
    url: 'https://dopamind-w3fp.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
};

export default config;
