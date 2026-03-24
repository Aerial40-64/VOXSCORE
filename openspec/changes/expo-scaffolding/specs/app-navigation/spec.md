## ADDED Requirements

### Requirement: Root layout initializes global providers
Le fichier `app/_layout.tsx` SHALL envelopper toute l'application dans les providers globaux : ThemeProvider, QueryClientProvider, et initialisation Sentry.

#### Scenario: App starts with all providers active
- **WHEN** l'application démarre
- **THEN** ThemeProvider, QueryClientProvider (TanStack Query) et Sentry sont initialisés avant tout rendu d'écran

### Requirement: Bottom tab navigator has four tabs
Le layout `app/(tabs)/_layout.tsx` SHALL définir exactement 4 onglets : Accueil, VoxScope, Engagements, Mon Profil — avec icônes lucide-react-native et couleurs du design system.

#### Scenario: All four tabs are visible
- **WHEN** l'utilisateur ouvre l'application
- **THEN** la barre de navigation inférieure affiche 4 onglets : Accueil, VoxScope, Engagements, Mon Profil

#### Scenario: Active tab uses brand color
- **WHEN** un onglet est actif
- **THEN** son icône et son label utilisent `colors.primary` (#FF3870) et les autres onglets utilisent `colors.textMuted`

### Requirement: Deputy deep link is navigable
La route `app/depute/[id].tsx` SHALL exister et être navigable via le deep link `/depute/:id`.

#### Scenario: Deep link navigates to deputy screen
- **WHEN** l'application reçoit le deep link `/depute/123`
- **THEN** l'écran `depute/[id]` est affiché avec `id = "123"` accessible via `useLocalSearchParams()`

### Requirement: Law deep link is navigable
La route `app/loi/[id].tsx` SHALL exister et être navigable via le deep link `/loi/:id`.

#### Scenario: Deep link navigates to law screen
- **WHEN** l'application reçoit le deep link `/loi/456`
- **THEN** l'écran `loi/[id]` est affiché avec `id = "456"` accessible via `useLocalSearchParams()`
