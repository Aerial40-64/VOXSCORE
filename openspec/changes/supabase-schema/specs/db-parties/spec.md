## ADDED Requirements

### Requirement: parties table stores political groups with aggregate score
La table `parties` SHALL stocker les groupes politiques de l'Assemblée nationale avec leur acronyme, couleur et score d'authenticité agrégé.

#### Scenario: Party record has all required fields
- **WHEN** un parti est inséré dans la table `parties`
- **THEN** les champs `id` (UUID), `name`, `acronym`, `color` (hex), `global_score` (integer 0-100, nullable) sont présents

#### Scenario: Party acronym is unique
- **WHEN** on tente d'insérer deux partis avec le même acronyme
- **THEN** la contrainte UNIQUE sur `acronym` rejette le doublon
