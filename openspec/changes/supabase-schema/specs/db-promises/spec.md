## ADDED Requirements

### Requirement: promises table enforces source URL as mandatory proof
La table `promises` SHALL stocker les promesses de campagne avec `source_url` NOT NULL — toute promesse sans preuve documentée est rejetée au niveau base de données.

#### Scenario: Promise without source_url is rejected
- **WHEN** on tente d'insérer une promesse avec `source_url = NULL`
- **THEN** la contrainte NOT NULL sur `source_url` rejette l'insertion

#### Scenario: Promise links to politician
- **WHEN** une promesse est insérée
- **THEN** `politician_id` référence une ligne existante dans `politicians` (FK avec ON DELETE CASCADE)

#### Scenario: Promise has category for thematic grouping
- **WHEN** une promesse est créée
- **THEN** le champ `category` (TEXT) permet le regroupement thématique (économie, immigration, écologie, etc.)
