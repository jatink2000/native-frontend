// import Constants from 'expo-constants';
// import { Platform } from 'react-native';

// /**
//  * Metro / Expo often exposes the dev machine as hostUri or debuggerHost (e.g. 192.168.1.5:8081).
//  * Using that IP for API :8080 works from:
//  * - Physical phone (Expo Go) on same Wi‑Fi
//  * - Many Android emulator setups (when the backend listens on 0.0.0.0)
//  *
//  * Override anytime with EXPO_PUBLIC_API_URL or expo.extra.apiUrl in app config.
//  */
// function getDevMachineHost() {
//   try {
//     // Expo Go (SDK 49+): same machine that runs Metro, e.g. "10.17.22.55:8081"
//     const expoGo = Constants.expoGoConfig?.debuggerHost;
//     if (expoGo) {
//       return String(expoGo).split(':')[0];
//     }

//     const hostUri = Constants.expoConfig?.hostUri;
//     if (hostUri) {
//       // May be "10.17.22.55:8081" or "192.168.x.x:8081"
//       const host = hostUri.includes('://')
//         ? hostUri.split('//')[1]?.split(':')[0]
//         : hostUri.split(':')[0];
//       if (host) return host;
//     }

//     const dbg =
//       Constants.manifest?.debuggerHost ||
//       Constants.manifest2?.extra?.expoClient?.debuggerHost;
//     if (dbg) {
//       return String(dbg).split(':')[0];
//     }
//   } catch (_) {
//     /* ignore */
//   }
//   return null;
// }

// /**
//  * Single source of truth for the backend base URL.
//  * - Web: localhost reaches your PC.
//  * - Android emulator only (no LAN host from Expo): 10.0.2.2 maps to the host machine.
//  * - Physical device: prefers LAN IP from Expo; or set EXPO_PUBLIC_API_URL.
//  */
// export const API_BASE_URL = (() => {
//   const fromEnv =
//     process.env.EXPO_PUBLIC_API_URL ||
//     Constants.expoConfig?.extra?.apiUrl;
//   if (fromEnv) {
//     return String(fromEnv).replace(/\/$/, '');
//   }

//   if (__DEV__) {
//     if (Platform.OS === 'web') {
//       return 'http://localhost:8080';
//     }

//     const lanHost = getDevMachineHost();
//     if (lanHost && lanHost !== 'localhost' && lanHost !== '127.0.0.1') {
//       return `http://${lanHost}:8080`;
//     }

//     if (Platform.OS === 'android') {
//       return 'http://10.0.2.2:8080';
//     }
//     return 'http://localhost:8080';
//   }

//   return 'https://your-production-api.com';
// })();

// export const API_ENDPOINTS = {
//   PRODUCTS: '/products',
//   CATEGORIES: '/categories',
// };













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