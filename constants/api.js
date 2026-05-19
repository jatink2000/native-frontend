
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Metro / Expo often exposes the dev machine as hostUri or debuggerHost.
 * But now we are using LIVE API directly.
 */

function getDevMachineHost() {
  try {
    const expoGo = Constants.expoGoConfig?.debuggerHost;

    if (expoGo) {
      return String(expoGo).split(':')[0];
    }

    const hostUri = Constants.expoConfig?.hostUri;

    if (hostUri) {
      const host = hostUri.includes('://')
        ? hostUri.split('//')[1]?.split(':')[0]
        : hostUri.split(':')[0];

      if (host) return host;
    }

    const dbg =
      Constants.manifest?.debuggerHost ||
      Constants.manifest2?.extra?.expoClient?.debuggerHost;

    if (dbg) {
      return String(dbg).split(':')[0];
    }
  } catch (_) {
    /* ignore */
  }

  return null;
}

/**
 * API BASE URL
 * Live Backend URL Added
 */

export const API_BASE_URL = (() => {
  // ENV variable support
  const fromEnv =
    process.env.EXPO_PUBLIC_API_URL ||
    Constants.expoConfig?.extra?.apiUrl;

  if (fromEnv) {
    return String(fromEnv).replace(/\/$/, '');
  }

  // LIVE API
  return 'https://native-backend-pi.vercel.app';
})();

/**
 * API ENDPOINTS
 */

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
};