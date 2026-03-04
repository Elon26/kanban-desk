import type { ConfigContext, ExpoConfig } from '@expo/config';
import { Env } from '@kirz/expo-env';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: Env.APP_NAME,
    description: `${Env.APP_NAME} Mobile App`,
    platforms: ['ios', 'android'],
    slug: Env.APP_BUNDLE_ID.toLowerCase().replaceAll('.', '-'),
    version: Env.APP_VERSION.toString(),
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'dark',
    backgroundColor: '#000000',
    scheme: Env.APP_BUNDLE_ID.toLowerCase().replaceAll('.', '-'),
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: Env.APP_BUNDLE_ID,
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
        CFBundleLocalizations: ['en', 'ko', 'ja'],
        CFBundleDevelopmentRegion: 'en',
      },
      entitlements: {
        'com.apple.security.application-groups': [
          'group.shoestore.todobooster.widget',
        ],
        'com.apple.developer.authentication-services.autofill-credential-provider':
          true,
      },
    },
    locales: {
      en: './i18n/infoPlist/en.json',
      ko: './i18n/infoPlist/ko.json',
      ja: './i18n/infoPlist/ja.json',
    },
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/splash-icon.png',
        backgroundColor: '#000000',
      },
      package: Env.APP_BUNDLE_ID.replaceAll('-', '_'),
    },
    splash: {
      image: './assets/images/empty.png',
      resizeMode: 'cover',
      backgroundColor: '#161c30',
    },
    plugins: [
      'expo-font',
      'expo-router',
      'expo-sqlite',
      'expo-web-browser',
      'expo-secure-store',
      [
        'react-native-permissions',
        {
          // Add setup_permissions to your Podfile (see iOS setup - steps 1, 2 and 3)
          iosPermissions: ['Camera', 'PhotoLibrary', 'Contacts'],
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission:
            'Allow $(PRODUCT_NAME) to use Face ID to protect your secret pictures and contacts.',
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            deploymentTarget: '15.1',
          },
          android: {},
        },
      ],
      [
        'app-icon-badge',
        {
          enabled: Env.NODE_ENV !== 'production',
          badges: [
            {
              text: Env.NODE_ENV,
              type: 'banner',
              color: 'black',
            },
          ],
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#000000',
          image: './assets/images/icon.png',
          imageWidth: 125,
        },
      ],
      [
        'expo-tracking-transparency',
        { userTrackingPermission: Env.IDFA_PERMISSION_TEXT },
      ],
      [
        'expo-user-identity',
        { iCloudContainerEnvironment: Env.IDENTITY_ICLOUD_CONTAINER_ENV },
      ],
      [
        './credential-provider.plugin',
        {
          devTeam: 'L427NWAC76',
          targetNameMainProject: 'zmidea',
        },
      ],
      [
        './widgets.plugin',
        {
          devTeam: 'L427NWAC76',
        },
      ],
      '@react-native-firebase/app',
      [
        'react-native-fbsdk-next',
        {
          appID: Env.FACEBOOK_APP_ID,
          displayName: Env.FACEBOOK_DISPLAY_NAME,
          clientToken: Env.FACEBOOK_CLIENT_TOKEN,
          scheme: Env.FACEBOOK_SCHEME,
          advertiserIDCollectionEnabled:
            Env.FACEBOOK_ADVERTISER_ID_COLLECTION_ENABLED,
          autoLogAppEventsEnabled: Env.FACEBOOK_AUTO_LOG_APP_EVENTS_ENABLED,
        },
      ],
      'expo-localization',
      [
        'expo-sensors',
        {
          motionPermission:
            'Allow $(PRODUCT_NAME) to access your device motion',
        },
      ],
      [
        'react-native-appsflyer',
        { shouldUseStrictMode: Env.APPSFLYER_USE_STRICT_MODE },
      ],
    ],
  };
};
