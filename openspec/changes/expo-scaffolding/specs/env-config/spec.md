## ADDED Requirements

### Requirement: Environment variables are typed via TypeScript
Un fichier de types SHALL déclarer toutes les variables `EXPO_PUBLIC_*` pour que TypeScript les reconnaisse sans erreur dans `process.env`.

#### Scenario: Accessing a public env var is type-safe
- **WHEN** le code accède à `process.env.EXPO_PUBLIC_SUPABASE_URL`
- **THEN** TypeScript ne lève pas d'erreur de type et l'autocomplétion propose la variable

### Requirement: .env.local is loaded automatically by Expo
Expo SHALL charger automatiquement `.env.local` en développement et les variables `EXPO_PUBLIC_*` SHALL être accessibles dans le bundle JS client.

#### Scenario: Public env var is available in client code
- **WHEN** l'app tourne en développement (`npx expo start`)
- **THEN** `process.env.EXPO_PUBLIC_SUPABASE_URL` retourne la valeur définie dans `.env.local`

#### Scenario: Non-public env var is not exposed to client
- **WHEN** `SUPABASE_SERVICE_ROLE_KEY` (sans préfixe `EXPO_PUBLIC_`) est défini dans `.env.local`
- **THEN** `process.env.SUPABASE_SERVICE_ROLE_KEY` est `undefined` dans le bundle JS client
