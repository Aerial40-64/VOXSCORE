## ADDED Requirements

### Requirement: Sentry is initialized at app startup with RGPD compliance
Sentry SHALL être initialisé dans `app/_layout.tsx` avec suppression de `event.user.email` dans `beforeSend` et désactivation en mode développement.

#### Scenario: Sentry is disabled in development
- **WHEN** l'app tourne en mode développement (`__DEV__ === true`)
- **THEN** Sentry n'envoie aucun événement (`enabled: false`)

#### Scenario: User email is stripped before sending to Sentry
- **WHEN** une erreur est capturée et que l'événement contient `event.user.email`
- **THEN** `beforeSend` supprime le champ `email` avant envoi — conformité RGPD Art. 9

#### Scenario: DSN is loaded from environment variable
- **WHEN** Sentry est initialisé
- **THEN** le DSN est lu depuis `process.env.EXPO_PUBLIC_SENTRY_DSN` et non hardcodé

### Requirement: Sentry wraps the root navigation component
L'app SHALL utiliser `Sentry.wrap()` sur le composant racine pour capturer les erreurs de navigation et les breadcrumbs de route automatiquement.

#### Scenario: Navigation errors are captured
- **WHEN** une erreur non gérée survient pendant la navigation
- **THEN** Sentry capture l'erreur avec le contexte de la route courante
