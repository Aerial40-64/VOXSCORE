## ADDED Requirements

### Requirement: users table stores citizen profiles with trust ladder level
La table `users` SHALL stocker les profils citoyens avec leur niveau de confiance (Trust Ladder N0→N3) et leurs consentements RGPD — liée à `auth.users` de Supabase Auth.

#### Scenario: User links to Supabase Auth
- **WHEN** un utilisateur est créé
- **THEN** `id` correspond à `auth.users.id` (UUID, FK implicite via RLS)

#### Scenario: Trust level uses enum
- **WHEN** `trust_level` est mis à jour
- **THEN** seules les valeurs `0` | `1` | `2` | `3` sont acceptées (CHECK constraint)

#### Scenario: Phone number is unique per account
- **WHEN** un numéro de téléphone est vérifié (trust_level ≥ 2)
- **THEN** la contrainte UNIQUE sur `phone_hash` (hash du numéro) empêche les comptes multiples

#### Scenario: RGPD consent is recorded with timestamp
- **WHEN** un utilisateur accepte les CGU
- **THEN** `rgpd_consent = TRUE` et `rgpd_consent_at` (TIMESTAMPTZ) sont enregistrés
