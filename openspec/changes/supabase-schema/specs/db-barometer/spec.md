## ADDED Requirements

### Requirement: citizen_barometer table stores authenticated citizen votes
La table `citizen_barometer` SHALL stocker un vote par citoyen par loi (contrainte UNIQUE), avec modération IA des commentaires avant affichage public.

#### Scenario: One vote per user per bill is enforced
- **WHEN** un utilisateur tente de voter deux fois sur la même loi
- **THEN** la contrainte UNIQUE `(user_id, bill_id)` rejette le second vote

#### Scenario: Vote position uses enum
- **WHEN** un vote citoyen est inséré
- **THEN** `position` accepte uniquement : `for` | `against` | `neutral`

#### Scenario: Comment requires moderation before display
- **WHEN** un commentaire est soumis
- **THEN** `comment_approved = FALSE` par défaut jusqu'à validation par le pipeline de modération IA

#### Scenario: Reason category is from a closed list
- **WHEN** un vote est soumis avec une raison
- **THEN** `reason_category` accepte uniquement : `cost` | `freedom` | `social` | `ecology` | `economy` | `other`

### Requirement: barometer_snapshots table stores hourly aggregates for widget
La table `barometer_snapshots` SHALL stocker des snapshots horodatés des résultats agrégés du baromètre pour alimenter le widget embarquable sans requêtes temps réel.

#### Scenario: Snapshot captures aggregated counts
- **WHEN** un snapshot est créé
- **THEN** les champs `votes_for`, `votes_against`, `votes_neutral`, `total_votes` sont des entiers non négatifs

#### Scenario: Snapshots are read-only for public
- **WHEN** un utilisateur non authentifié lit les snapshots
- **THEN** la politique RLS autorise SELECT sans restriction (données anonymisées)
