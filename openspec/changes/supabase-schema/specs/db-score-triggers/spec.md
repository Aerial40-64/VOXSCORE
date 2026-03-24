## ADDED Requirements

### Requirement: authenticity_score recalculates automatically on vote update
Un trigger PostgreSQL SHALL recalculer `politicians.authenticity_score` à chaque INSERT ou UPDATE sur `votes.authenticity_state`, sauf si `scores_frozen = TRUE`.

#### Scenario: Score updates when a vote authenticity state changes
- **WHEN** `votes.authenticity_state` est mis à jour pour un député
- **THEN** `politicians.authenticity_score` est recalculé comme : `COUNT(respected) * 100 / COUNT(respected + broken + partial)` (les `absent` sont exclus du dénominateur)

#### Scenario: Frozen score is not recalculated
- **WHEN** `politicians.scores_frozen = TRUE` et un vote est mis à jour
- **THEN** le trigger ne modifie pas `authenticity_score`

### Requirement: party global_score recalculates nightly via pg_cron
Un job pg_cron SHALL recalculer `parties.global_score` chaque nuit à 02:00 UTC comme moyenne des scores de ses députés actifs.

#### Scenario: Party score reflects average of member deputies
- **WHEN** le job pg_cron s'exécute
- **THEN** `parties.global_score` est mis à jour avec la moyenne de `authenticity_score` des `politicians` actifs du parti (NULL exclus)

#### Scenario: Cron job runs at 02:00 UTC daily
- **WHEN** le schéma est créé
- **THEN** un job pg_cron est enregistré avec le schedule `'0 2 * * *'`
