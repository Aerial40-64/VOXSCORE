## ADDED Requirements

### Requirement: push_tokens table stores OneSignal tokens per user per device
La table `push_tokens` SHALL stocker les tokens de notification push OneSignal, un par appareil, avec un flag d'activité pour invalider les tokens révoqués.

#### Scenario: Token is unique per device
- **WHEN** un token est enregistré
- **THEN** la contrainte UNIQUE sur `token` empêche les doublons entre utilisateurs

#### Scenario: Inactive tokens are flagged not deleted
- **WHEN** OneSignal signale qu'un token est invalide
- **THEN** `is_active = FALSE` est mis à jour (soft delete — conservation pour audit)

#### Scenario: Platform is recorded
- **WHEN** un token est enregistré
- **THEN** `platform` contient `ios` ou `android`
