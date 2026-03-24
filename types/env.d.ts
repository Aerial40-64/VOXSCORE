declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase — public (client-side)
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;

    // Sentry — public (client-side)
    EXPO_PUBLIC_SENTRY_DSN: string;

    // PostHog Analytics — public (client-side)
    EXPO_PUBLIC_POSTHOG_API_KEY: string;
    EXPO_PUBLIC_POSTHOG_HOST: string;

    // OneSignal Push Notifications — public (client-side)
    EXPO_PUBLIC_ONESIGNAL_APP_ID: string;
  }
}
