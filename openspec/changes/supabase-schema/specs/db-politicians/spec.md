## ADDED Requirements

### Requirement: politicians table stores deputy profiles with authenticity score
La table `politicians` SHALL stocker les profils des députés avec leur score d'authenticité calculé, leur parti, et leur identifiant externe NosDéputés.fr.

#### Scenario: Politician record links to party
- **WHEN** un député est inséré
- **THEN** `party_id` référence une ligne existante dans `parties` (FK avec ON DELETE SET NULL)

#### Scenario: Authenticity score is within valid range
- **WHEN** `authenticity_score` est mis à jour
- **THEN** la contrainte CHECK garantit que la valeur est entre 0 et 100 ou NULL

#### Scenario: External API ID is stored for sync
- **WHEN** un député est synchronisé depuis NosDéputés.fr
- **THEN** `api_external_id` et `api_source` (enum: `nosdeputes` | `nossenateurs`) sont renseignés

#### Scenario: Score freeze flag prevents recalculation
- **WHEN** `scores_frozen = TRUE` sur un député
- **THEN** le trigger de recalcul de `authenticity_score` ne modifie pas la valeur
