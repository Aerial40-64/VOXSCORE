## Why

Le projet VoxScore existe uniquement en tant que composants isolés et documentation — il n'y a pas encore de projet Expo initialisé. Sans scaffolding, aucun développement fonctionnel (navigation, tests sur device, builds EAS) n'est possible. C'est le prérequis absolu à toute implémentation produit.

## What Changes

- Initialisation du projet Expo SDK 55 avec `expo-router` (file-based routing)
- Installation et configuration de toutes les dépendances du stack validé
- Configuration `app.json` avec New Architecture + expo-build-properties (régressions Reanimated)
- Configuration `package.json` avec overrides Reanimated 4.1.5
- Structure de dossiers `app/`, `components/`, `services/`, `stores/`, `types/`, `constants/`
- ThemeProvider + `useTheme()` hook — socle du design system
- Variables d'environnement Expo (`EXPO_PUBLIC_*`) reliées à `.env.local`
- Intégration Sentry (`@sentry/react-native`) dès le scaffolding
- Configuration EAS Build (`eas.json`) pour les profils dev / preview / production

## Capabilities

### New Capabilities

- `expo-project-config`: Configuration racine du projet Expo (app.json, package.json, eas.json, tsconfig)
- `app-navigation`: Structure de navigation expo-router — layout racine, bottom tabs (4 onglets), deep links
- `theme-system`: ThemeProvider, useTheme hook, intégration colors.ts existant, support light/dark
- `env-config`: Chargement des variables d'environnement Expo via babel-plugin-module-resolver + types TypeScript
- `error-tracking`: Initialisation Sentry avec RGPD beforeSend (suppression email utilisateur)

### Modified Capabilities

## Impact

- Création du projet Expo à la racine `E:/CLAUDE PROJET/VOXSCORE`
- Les composants existants (`DeputyCard.tsx`, `CoherenceRing.tsx`, etc.) seront déplacés dans `components/`
- Nouvelles dépendances : `expo-router`, `react-native-reanimated@4.1.5`, `zustand`, `@tanstack/react-query`, `react-native-svg`, `expo-linear-gradient`, `lucide-react-native`, `@sentry/react-native`, `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens`
- `package.json` créé avec `overrides: { "react-native-reanimated": "4.1.5" }`
- `tsconfig.json` avec path alias `@/` → racine projet
