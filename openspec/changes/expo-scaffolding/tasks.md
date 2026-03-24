## 1. Configuration racine du projet

- [x] 1.1 Créer `package.json` avec toutes les dépendances du stack et `overrides: { "react-native-reanimated": "4.1.5" }`
- [x] 1.2 Créer `app.json` avec slug `voxscore`, New Architecture activée, et plugin `expo-build-properties` (`reactNativeReleaseLevel: "experimental"` iOS + Android)
- [x] 1.3 Créer `tsconfig.json` avec `strict: true` et path alias `@/` → `./`
- [x] 1.4 Créer `babel.config.js` avec `babel-preset-expo` et `module-resolver` pour l'alias `@/`
- [x] 1.5 Créer `eas.json` avec 3 profils : `development` (devClient + internal), `preview` (internal), `production` (store + autoIncrement)

## 2. Structure de dossiers

- [x] 2.1 Créer les dossiers vides avec `.gitkeep` : `app/`, `app/(tabs)/`, `app/depute/`, `app/loi/`, `components/`, `services/`, `stores/`, `types/`, `constants/`, `hooks/`
- [x] 2.2 Déplacer `colors.ts` et `design-tokens.json` vers `constants/`
- [x] 2.3 Déplacer les composants existants (`DeputyCard.tsx`, `CoherenceRing.tsx`, `CoherenceBadge.tsx`, `CategoryBadge.tsx`, `VoteBadge.tsx`, `LawCard.tsx`, `GradientBackground.tsx`, `CommunePicker.tsx`) vers `components/`

## 3. Design System — ThemeProvider + useTheme

- [x] 3.1 Mettre à jour `constants/colors.ts` pour exporter `lightColors` et `darkColors` avec toutes les couleurs sémantiques (background, surface, text, textMuted, primary, accent, kept, broken, partial, absent) et les couleurs de parti
- [x] 3.2 Créer `hooks/useTheme.ts` — hook React Context qui retourne les couleurs actives selon le schéma système, avec erreur explicite si utilisé hors provider
- [x] 3.3 Créer `components/ThemeProvider.tsx` — Context Provider qui détecte `useColorScheme()` et expose les couleurs correspondantes

## 4. Variables d'environnement

- [x] 4.1 Créer `types/env.d.ts` déclarant toutes les variables `EXPO_PUBLIC_*` pour TypeScript (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_POSTHOG_API_KEY`, `EXPO_PUBLIC_POSTHOG_HOST`, `EXPO_PUBLIC_ONESIGNAL_APP_ID`)

## 5. Navigation — expo-router

- [x] 5.1 Créer `app/_layout.tsx` — Root layout avec ThemeProvider, QueryClientProvider (TanStack Query), initialisation Sentry, et `Sentry.wrap()` sur le composant Stack
- [x] 5.2 Créer `app/(tabs)/_layout.tsx` — Bottom tab navigator avec 4 onglets (Accueil, VoxScope, Engagements, Mon Profil), icônes lucide-react-native, couleurs `colors.primary` (actif) / `colors.textMuted` (inactif)
- [x] 5.3 Créer `app/(tabs)/index.tsx` — écran placeholder Accueil
- [x] 5.4 Créer `app/(tabs)/radar.tsx` — écran placeholder VoxScope
- [x] 5.5 Créer `app/(tabs)/engagements.tsx` — écran placeholder Engagements
- [x] 5.6 Créer `app/(tabs)/profil.tsx` — écran placeholder Mon Profil
- [x] 5.7 Créer `app/depute/[id].tsx` — écran placeholder deep link, affiche `id` via `useLocalSearchParams()`
- [x] 5.8 Créer `app/loi/[id].tsx` — écran placeholder deep link, affiche `id` via `useLocalSearchParams()`

## 6. Error Tracking — Sentry

- [x] 6.1 Configurer Sentry dans `app/_layout.tsx` : DSN depuis `EXPO_PUBLIC_SENTRY_DSN`, `enabled: !__DEV__`, `beforeSend` supprimant `event.user.email`, `environment` basé sur `__DEV__`

## 7. Vérification finale

- [x] 7.1 Vérifier que `npx expo start` démarre sans erreur
- [x] 7.2 Vérifier que `npx tsc --noEmit` passe sans erreur de type
- [x] 7.3 Vérifier que tous les composants migrés dans `components/` importent `useTheme` depuis `@/hooks/useTheme` (corriger les imports relatifs cassés si nécessaire)
