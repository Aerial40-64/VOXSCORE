## Why

Sans schéma de base de données, aucune donnée réelle ne peut être stockée ni interrogée. Le schéma Supabase est le socle de toutes les fonctionnalités produit (députés, lois, promesses, votes, baromètre) — il doit être créé correctement dès la Phase 1 car certains choix (région EU Frankfurt, index HNSW, RLS) sont non modifiables ou coûteux à changer après coup.

## What Changes

- Création des 11 tables principales dans Supabase (projet DEV, région EU Frankfurt)
- Activation de pgvector et création de l'index HNSW sur `promise_embeddings`
- Configuration Row Level Security (RLS) sur toutes les tables
- Triggers PostgreSQL pour le recalcul automatique de `authenticity_score`
- Configuration pg_cron pour les recalculs nocturnes
- Enums PostgreSQL pour les états de vote et de confiance
- Contraintes d'intégrité (UNIQUE, NOT NULL, CHECK) selon les règles métier du PRD
- Données de seed : quelques partis et ~5 députés fictifs pour le MVP

## Capabilities

### New Capabilities

- `db-politicians`: Table `politicians` — 577 députés, relation vers `parties`, champs score
- `db-parties`: Table `parties` — groupes politiques, score global moyen
- `db-bills`: Table `bills` — lois avec résumé IA, statut, thème, flag catimini
- `db-promises`: Table `promises` — promesses de campagne avec `source_url` NOT NULL
- `db-votes`: Table `votes` — votes des députés avec `authenticity_state` enum
- `db-embeddings`: Table `promise_embeddings` — vecteurs pgvector + index HNSW
- `db-barometer`: Tables `citizen_barometer` + `barometer_snapshots` — votes citoyens
- `db-users`: Table `users` — compte citoyen avec `trust_level` et consentement RGPD
- `db-push-tokens`: Table `push_tokens` — tokens OneSignal par utilisateur
- `db-disputes`: Table `score_disputes` — contestations de score par les élus
- `db-rls-policies`: Politiques RLS sur toutes les tables
- `db-score-triggers`: Triggers + pg_cron pour recalcul `authenticity_score`

### Modified Capabilities

## Impact

- Aucun code applicatif modifié — schéma créé via SQL Editor Supabase dashboard
- Dépendance : projet Supabase DEV doit être créé manuellement (région EU Frankfurt)
- Les variables `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY` doivent être renseignées dans `.env.local` après création
- Prépare le terrain pour le change suivant : connexion Supabase + repository pattern
