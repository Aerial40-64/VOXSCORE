## ADDED Requirements

### Requirement: Package.json with correct dependencies and Reanimated override
Le projet SHALL disposer d'un `package.json` avec toutes les dépendances du stack validé et un override forçant `react-native-reanimated@4.1.5`.

#### Scenario: Reanimated version is pinned
- **WHEN** une dépendance transitive tente de résoudre `react-native-reanimated` à une version inférieure à 4.1.5
- **THEN** npm utilise la version `4.1.5` définie dans `overrides` et ignore la résolution transitive

#### Scenario: All stack dependencies are present
- **WHEN** le développeur exécute `npm install`
- **THEN** toutes les dépendances suivantes sont installées : `expo@~55.0.0`, `react-native@0.83`, `expo-router`, `react-native-reanimated@4.1.5`, `zustand`, `@tanstack/react-query`, `react-native-svg`, `expo-linear-gradient`, `lucide-react-native`, `@sentry/react-native`, `react-native-gesture-handler`, `react-native-safe-area-context`, `react-native-screens`, `react-native-mmkv`

### Requirement: app.json enables New Architecture with Reanimated performance fix
Le fichier `app.json` SHALL activer la New Architecture et inclure le plugin `expo-build-properties` avec `reactNativeReleaseLevel: "experimental"` pour iOS et Android.

#### Scenario: New Architecture is active
- **WHEN** l'app est buildée via EAS
- **THEN** la New Architecture (Fabric + JSI) est activée et `newArchEnabled` n'est jamais à `false`

#### Scenario: expo-build-properties plugin is configured
- **WHEN** le fichier `app.json` est lu
- **THEN** le plugin `expo-build-properties` est présent avec `android.reactNativeReleaseLevel: "experimental"` et `ios.reactNativeReleaseLevel: "experimental"`

### Requirement: TypeScript path alias @/ is configured
Le projet SHALL configurer le path alias `@/` pointant vers la racine du projet dans `tsconfig.json` et `babel.config.js`.

#### Scenario: Import using @/ alias resolves correctly
- **WHEN** un fichier importe `@/constants/colors`
- **THEN** TypeScript et le bundler Metro résolvent vers `<root>/constants/colors`

### Requirement: EAS Build is configured with three profiles
Le fichier `eas.json` SHALL définir trois profils : `development` (dev client), `preview` (internal distribution), `production` (store).

#### Scenario: Development profile uses dev client
- **WHEN** le profil `development` est utilisé
- **THEN** `developmentClient: true` est activé et `distribution: "internal"`

#### Scenario: Production profile targets both stores
- **WHEN** le profil `production` est utilisé
- **THEN** `distribution: "store"` et `autoIncrement: true` sont configurés
