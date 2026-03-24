## 1. Création du projet Supabase DEV

- [ ] 1.1 Créer un compte sur supabase.com si pas encore fait
- [ ] 1.2 Créer le projet `VoxScore - DEV` — **région obligatoire : EU Frankfurt (eu-central-1)** — non modifiable après création
- [ ] 1.3 Copier l'URL du projet et la clé `anon` dans `.env.local` (`EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] 1.4 Copier la clé `service_role` dans `.env.local` (`SUPABASE_SERVICE_ROLE_KEY`) — ne jamais commiter

## 2. Extensions et Enums (SQL Editor — Partie 1)

- [x] 2.1 Activer l'extension pgvector : `CREATE EXTENSION IF NOT EXISTS vector;`
- [x] 2.2 Activer pg_cron : `CREATE EXTENSION IF NOT EXISTS pg_cron;`
- [x] 2.3 Créer l'enum `authenticity_state` : `respected | broken | partial | absent`
- [x] 2.4 Créer l'enum `vote_decision` : `for | against | abstention | absent | non_voting`
- [x] 2.5 Créer l'enum `bill_status` : `in_progress | voted | rejected | withdrawn`
- [x] 2.6 Créer l'enum `api_source` : `nosdeputes | nossenateurs`
- [x] 2.7 Créer l'enum `barometer_position` : `for | against | neutral`
- [x] 2.8 Créer l'enum `reason_category` : `cost | freedom | social | ecology | economy | other`
- [x] 2.9 Créer l'enum `dispute_status` : `pending | under_review | accepted | rejected`

## 3. Tables principales (SQL Editor — Partie 2)

- [x] 3.1 Créer la table `parties` (id UUID PK, name TEXT, acronym TEXT UNIQUE, color TEXT, global_score INT CHECK 0-100, created_at TIMESTAMPTZ)
- [x] 3.2 Créer la table `politicians` (id UUID PK, first_name, last_name, party_id FK→parties, department, constituency, photo_url, api_external_id, api_source enum, authenticity_score INT CHECK 0-100, scores_frozen BOOL DEFAULT FALSE, created_at, updated_at)
- [x] 3.3 Créer la table `bills` (id UUID PK, title TEXT, title_vulgarized TEXT, summary_pros TEXT, summary_cons TEXT, daily_life_impact TEXT, status bill_status, theme TEXT, is_radar_alert BOOL DEFAULT FALSE, vote_date DATE, created_at, updated_at)
- [x] 3.4 Créer la table `promises` (id UUID PK, politician_id FK→politicians CASCADE, text TEXT NOT NULL, category TEXT, source_url TEXT NOT NULL, date_made DATE, created_at)
- [x] 3.5 Créer la table `votes` (id UUID PK, politician_id FK→politicians, bill_id FK→bills, promise_id FK→promises nullable, decision vote_decision, authenticity_state authenticity_state, UNIQUE(politician_id, bill_id), created_at, updated_at)
- [x] 3.6 Créer la table `promise_embeddings` (id UUID PK, promise_id FK→promises CASCADE UNIQUE, vector vector(1024) NOT NULL, model TEXT DEFAULT 'mistral-embed', created_at)
- [x] 3.7 Créer la table `users` (id UUID PK = auth.users.id, trust_level INT CHECK 0-3 DEFAULT 0, phone_hash TEXT UNIQUE nullable, rgpd_consent BOOL DEFAULT FALSE, rgpd_consent_at TIMESTAMPTZ, created_at, updated_at)
- [x] 3.8 Créer la table `citizen_barometer` (id UUID PK, user_id FK→users, bill_id FK→bills, position barometer_position, reason_category reason_category, comment TEXT CHECK length≤280, comment_approved BOOL DEFAULT FALSE, is_demo BOOL DEFAULT FALSE, UNIQUE(user_id, bill_id), created_at)
- [x] 3.9 Créer la table `barometer_snapshots` (id UUID PK, bill_id FK→bills, votes_for INT DEFAULT 0, votes_against INT DEFAULT 0, votes_neutral INT DEFAULT 0, total_votes INT DEFAULT 0, snapshot_at TIMESTAMPTZ DEFAULT NOW())
- [x] 3.10 Créer la table `push_tokens` (id UUID PK, user_id FK→users, token TEXT UNIQUE NOT NULL, platform TEXT CHECK 'ios'|'android', is_active BOOL DEFAULT TRUE, created_at, updated_at)
- [x] 3.11 Créer la table `score_disputes` (id UUID PK, politician_id FK→politicians NOT NULL, vote_id FK→votes nullable, user_id FK→users, justification TEXT NOT NULL, status dispute_status DEFAULT 'pending', created_at, updated_at)

## 4. Index et performance (SQL Editor — Partie 3a)

- [x] 4.1 Créer l'index HNSW sur `promise_embeddings.vector` : `USING hnsw (vector vector_cosine_ops) WITH (m = 16, ef_construction = 64)` — **avant toute insertion de données**
- [x] 4.2 Créer un index sur `politicians.party_id` (jointures fréquentes)
- [x] 4.3 Créer un index sur `votes.politician_id` et `votes.bill_id`
- [x] 4.4 Créer un index sur `citizen_barometer.bill_id` (agrégation baromètre)
- [x] 4.5 Créer un index sur `push_tokens.user_id`

## 5. Triggers et pg_cron (SQL Editor — Partie 3b)

- [x] 5.1 Créer la fonction `recalculate_authenticity_score()` qui recalcule `politicians.authenticity_score` excluant les votes `absent` du dénominateur, avec vérification `scores_frozen`
- [x] 5.2 Créer le trigger `after_vote_upsert` sur `votes` (AFTER INSERT OR UPDATE OF authenticity_state) appelant `recalculate_authenticity_score()`
- [x] 5.3 Créer la fonction `recalculate_party_scores()` qui met à jour `parties.global_score` = moyenne des `authenticity_score` des députés actifs du parti
- [x] 5.4 Enregistrer le job pg_cron : `SELECT cron.schedule('recalculate-party-scores', '0 2 * * *', 'SELECT recalculate_party_scores()')`

## 6. Row Level Security (SQL Editor — Partie 3c)

- [x] 6.1 Activer RLS sur toutes les tables : `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY`
- [x] 6.2 Politiques lecture publique (SELECT USING true) : `politicians`, `parties`, `bills`, `promises`, `votes`, `barometer_snapshots`
- [x] 6.3 Politiques écriture service role uniquement (INSERT/UPDATE/DELETE) : `politicians`, `parties`, `bills`, `promises`, `votes`, `promise_embeddings`
- [x] 6.4 Politiques utilisateur propriétaire : `users`, `citizen_barometer`, `push_tokens` — SELECT/INSERT/UPDATE WHERE `auth.uid() = user_id`
- [x] 6.5 Politique `score_disputes` : SELECT public, INSERT pour utilisateurs authentifiés, UPDATE service role

## 7. Seed data MVP (SQL Editor — Partie 4)

- [x] 7.1 Insérer les 7 partis principaux (RE, RN, LFI, LR, PS, EELV, Indépendants) avec leurs couleurs hex du design system
- [x] 7.2 Insérer 5 députés fictifs (noms fictifs, différents partis, différents départements)
- [x] 7.3 Insérer 3 lois fictives avec résumés placeholder
- [x] 7.4 Insérer 2-3 promesses fictives (avec source_url factice mais valide)
- [x] 7.5 Insérer des votes fictifs pour déclencher le trigger et vérifier le calcul du score

## 8. Script SQL versionné

- [x] 8.1 Créer le dossier `supabase/` à la racine du projet
- [x] 8.2 Exporter le script SQL complet (Parts 1-4) dans `supabase/schema.sql`
- [x] 8.3 Créer `supabase/seed.sql` avec les données de seed séparément
- [ ] 8.4 Vérifier dans le Table Editor Supabase que les 11 tables sont présentes avec les bonnes colonnes
- [ ] 8.5 Vérifier que le trigger se déclenche correctement en mettant à jour un `authenticity_state` manuellement
