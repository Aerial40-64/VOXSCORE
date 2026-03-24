## ADDED Requirements

### Requirement: score_disputes table allows elected officials to contest their score
La table `score_disputes` SHALL permettre aux députés (ou leurs équipes) de contester formellement un score d'authenticité, avec statut de traitement éditorial.

#### Scenario: Dispute links to politician and optionally to a specific vote
- **WHEN** une contestation est soumise
- **THEN** `politician_id` est NOT NULL et `vote_id` est nullable (contestation d'un vote spécifique ou du score global)

#### Scenario: Dispute status tracks editorial workflow
- **WHEN** une contestation est soumise puis traitée
- **THEN** `status` passe de `pending` → `under_review` → `accepted` | `rejected`

#### Scenario: Dispute requires a justification text
- **WHEN** une contestation est soumise sans justification
- **THEN** la contrainte NOT NULL sur `justification` (TEXT) rejette l'insertion
