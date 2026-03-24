## ADDED Requirements

### Requirement: ThemeProvider detects and exposes system color scheme
Le `ThemeProvider` SHALL détecter le schéma de couleurs système (light/dark) via `useColorScheme()` et exposer les couleurs correspondantes via un Context React.

#### Scenario: Dark mode colors are applied
- **WHEN** le système est en mode sombre
- **THEN** `useTheme()` retourne les couleurs dark de `colors.ts` (backgrounds sombres, textes clairs)

#### Scenario: Light mode colors are applied
- **WHEN** le système est en mode clair
- **THEN** `useTheme()` retourne les couleurs light de `colors.ts` (backgrounds clairs, textes sombres)

### Requirement: useTheme hook is accessible from any component
Le hook `useTheme()` SHALL être importable depuis `@/hooks/useTheme` et retourner les couleurs actives du thème.

#### Scenario: Component uses theme colors without hardcoding
- **WHEN** un composant appelle `const { colors } = useTheme()`
- **THEN** il reçoit un objet de couleurs typé correspondant au thème actif, sans jamais avoir à hardcoder une valeur hexadécimale

#### Scenario: Hook throws outside provider
- **WHEN** `useTheme()` est appelé en dehors d'un `ThemeProvider`
- **THEN** une erreur explicite est levée : "useTheme must be used within a ThemeProvider"

### Requirement: colors.ts is the single source of truth
Le fichier `constants/colors.ts` SHALL être la seule source de vérité pour toutes les couleurs. Le ThemeProvider MUST importer ses valeurs depuis ce fichier uniquement.

#### Scenario: colors.ts exports both light and dark palettes
- **WHEN** `constants/colors.ts` est importé
- **THEN** il exporte `lightColors` et `darkColors` couvrant : `background`, `surface`, `text`, `textMuted`, `primary`, `accent`, `kept`, `broken`, `partial`, `absent`, et les couleurs par parti politique
