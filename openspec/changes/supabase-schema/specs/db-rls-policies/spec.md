## ADDED Requirements

### Requirement: Public data tables allow anonymous read access
Les tables `politicians`, `parties`, `bills`, `promises`, `votes`, `barometer_snapshots` SHALL autoriser SELECT pour tous (y compris les utilisateurs non authentifiés — trust_level 0).

#### Scenario: Anonymous user can read deputy list
- **WHEN** un utilisateur non authentifié interroge `politicians`
- **THEN** la politique RLS autorise SELECT sans condition (`USING (true)`)

### Requirement: User-owned data is restricted to the owning user
Les tables `users`, `citizen_barometer`, `push_tokens` SHALL restreindre SELECT, INSERT, UPDATE aux lignes appartenant à l'utilisateur authentifié (`auth.uid() = user_id`).

#### Scenario: User cannot read another user's barometer vote
- **WHEN** un utilisateur authentifié interroge `citizen_barometer`
- **THEN** seules ses propres lignes (`user_id = auth.uid()`) sont retournées

#### Scenario: Unauthenticated user cannot insert a barometer vote
- **WHEN** un utilisateur non authentifié tente d'insérer dans `citizen_barometer`
- **THEN** la politique RLS rejette l'opération

### Requirement: Write operations on reference data require service role
Les tables `politicians`, `parties`, `bills`, `promises`, `votes` SHALL restreindre INSERT, UPDATE, DELETE au service role (Edge Functions uniquement).

#### Scenario: App client cannot insert a politician directly
- **WHEN** le client mobile tente d'insérer dans `politicians` avec la clé anon
- **THEN** la politique RLS rejette l'opération (seul le service role peut écrire)
