## ADDED Requirements

### Requirement: votes table records deputy votes with authenticity state
La table `votes` SHALL enregistrer chaque vote d'un député sur une loi, avec le résultat (`decision`) et l'état d'authenticité calculé par rapport à ses promesses (`authenticity_state`).

#### Scenario: Vote decision uses enum
- **WHEN** un vote est inséré
- **THEN** `decision` accepte uniquement : `for` | `against` | `abstention` | `absent` | `non_voting`

#### Scenario: Authenticity state uses enum
- **WHEN** `authenticity_state` est mis à jour par le pipeline IA
- **THEN** seules les valeurs suivantes sont acceptées : `respected` | `broken` | `partial` | `absent`

#### Scenario: Vote is unique per politician per bill
- **WHEN** on tente d'insérer un second vote pour le même couple (politician_id, bill_id)
- **THEN** la contrainte UNIQUE rejette le doublon

#### Scenario: Vote optionally links to a matched promise
- **WHEN** le pipeline de matching sémantique identifie une promesse correspondante
- **THEN** `promise_id` est renseigné (nullable — un vote sans promesse associée est valide)
