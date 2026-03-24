## ADDED Requirements

### Requirement: bills table stores laws with AI-generated summaries and radar flag
La table `bills` SHALL stocker les lois avec leurs résumés IA (pour/contre, impact quotidien), leur statut parlementaire, et un flag `is_radar_alert` pour la détection catimini.

#### Scenario: Bill has AI summary fields
- **WHEN** une loi est insérée après traitement IA
- **THEN** les champs `summary_pros`, `summary_cons`, `daily_life_impact` (tous TEXT nullable) sont disponibles

#### Scenario: Radar alert flag triggers push notification
- **WHEN** `is_radar_alert` est mis à `TRUE` sur une loi
- **THEN** le champ est persisté et consultable pour déclencher les notifications push (logique dans Edge Function)

#### Scenario: Bill status uses enum
- **WHEN** le statut d'une loi est mis à jour
- **THEN** seules les valeurs de l'enum `bill_status` sont acceptées : `in_progress` | `voted` | `rejected` | `withdrawn`

#### Scenario: Bill theme categorizes the law
- **WHEN** une loi est créée
- **THEN** le champ `theme` (TEXT) permet le filtrage par thématique (économie, écologie, social, etc.)
