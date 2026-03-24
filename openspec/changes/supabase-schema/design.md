## Context

Le projet VoxScore dispose d'un stack Expo fonctionnel mais n'a pas encore de base de données. Le PRD v2 définit précisément le schéma relationnel (11 tables), les règles métier (source_url NOT NULL, gel des scores 6 semaines avant élections, anti-manipulation), et les contraintes de performance (index HNSW pgvector, write-buffer Redis pour le baromètre).

Le schéma est créé via le SQL Editor du dashboard Supabase — pas de CLI locale, pas de Docker. Méthode "2 projets cloud" : tout le développement se fait contre `VoxScore - DEV`.

## Goals / Non-Goals

**Goals:**
- Schéma SQL complet et opérationnel dans Supabase DEV
- pgvector activé + index HNSW créé dès la création (pas après)
- RLS activé sur toutes les tables avec politiques sécurisées
- Enums PostgreSQL pour les états métier
- Triggers de recalcul du score d'authenticité
- Données de seed MVP (partis + 5 députés fictifs)
- Script SQL exportable et versionné dans le repo

**Non-Goals:**
- Projet Supabase PROD (créé au lancement App Store uniquement)
- Supabase Edge Functions (change séparé — pipeline IA)
- Connexion depuis l'app mobile (change séparé — supabase-client)
- Données réelles des 577 députés (ingestion automatique via NosDéputés.fr — V1)

## Decisions

### D1 — Ordre de création des tables

Les tables doivent être créées dans l'ordre des dépendances FK :
1. `parties` (pas de FK)
2. `politicians` (FK → parties)
3. `bills` (pas de FK)
4. `promises` (FK → politicians)
5. `votes` (FK → politicians, bills, promises)
6. `promise_embeddings` (FK → promises)
7. `users` (pas de FK)
8. `citizen_barometer` (FK → users, bills)
9. `barometer_snapshots` (FK → bills)
10. `push_tokens` (FK → users)
11. `score_disputes` (FK → politicians, users)

### D2 — Enums PostgreSQL vs colonnes TEXT avec CHECK

**Choix : Enums PostgreSQL** pour `authenticity_state`, `trust_level`, `vote_decision`, `bill_status`, `api_source`.

Avantages : validation au niveau BDD, lisibilité, performance (stocké en int4).
Inconvénient : migration coûteuse si on ajoute une valeur → acceptable car les états métier sont stables.

### D3 — pgvector : dimension 1024 (Mistral embed)

Tous les vecteurs utilisent `vector(1024)` — dimension native de `mistral-embed`. Si on changeait de modèle, tous les vecteurs deviendraient inutilisables → contrainte de cohérence documentée dans ARCHITECTURE.md.

### D4 — Index HNSW : paramètres

```sql
CREATE INDEX ON promise_embeddings
USING hnsw (vector vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

`m=16, ef_construction=64` : paramètres recommandés pour <1M vecteurs. Latence ~1.5ms vs ~650ms sans index (5250× plus lent). À créer AVANT les insertions de données.

### D5 — RLS : politique lecture publique, écriture restreinte

- `politicians`, `parties`, `bills`, `promises`, `votes` : lecture publique (SELECT pour tous), écriture réservée au service role (Edge Functions)
- `users`, `citizen_barometer`, `push_tokens` : lecture restreinte à l'utilisateur propriétaire (`auth.uid() = user_id`)
- `barometer_snapshots` : lecture publique (données agrégées anonymisées)
- `score_disputes` : lecture publique, insertion restreinte aux utilisateurs authentifiés

### D6 — Score d'authenticité : calcul par trigger

```sql
-- Recalcul déclenché à chaque UPDATE sur votes.authenticity_state
CREATE OR REPLACE FUNCTION recalculate_authenticity_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE politicians SET authenticity_score = (
    SELECT ROUND(
      COUNT(*) FILTER (WHERE v.authenticity_state = 'respected') * 100.0 /
      NULLIF(COUNT(*) FILTER (WHERE v.authenticity_state != 'absent'), 0)
    )
    FROM votes v WHERE v.politician_id = NEW.politician_id
  ) WHERE id = NEW.politician_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### D7 — Gel des scores 6 semaines avant élections

Implémenté via un flag `scores_frozen BOOLEAN DEFAULT FALSE` sur la table `politicians` (ou une table de configuration globale). Le trigger vérifie ce flag avant de recalculer. La date de gel est gérée applicativement (Edge Function dédiée).

## Risks / Trade-offs

- **[Risque] Région Supabase non EU Frankfurt** → Non récupérable après création. La task de création du projet Supabase doit mentionner explicitement la région.
- **[Risque] Extension pgvector non activée avant création de la table** → Créer `CREATE EXTENSION IF NOT EXISTS vector;` en tout premier dans le script SQL.
- **[Risque] Index HNSW créé après insertions massives** → Opération bloquante sur grande table. L'index DOIT être créé avant les insertions de données.
- **[Trade-off] Enums difficiles à étendre** → Accepté. Les états métier (`respected`, `broken`, `partial`, `absent`) sont stables sur la roadmap complète.
- **[Risque] Seed data avec IDs hardcodés** → Utiliser des UUIDs générés (pas de séquences auto) pour permettre des références croisées dans les scripts de seed.

## Migration Plan

1. Créer le projet `VoxScore - DEV` sur supabase.com (région EU Frankfurt)
2. Copier l'URL et la clé anon dans `.env.local`
3. Ouvrir SQL Editor → coller et exécuter le script en 4 parties :
   - Partie 1 : Extensions + Enums
   - Partie 2 : Tables (dans l'ordre D1)
   - Partie 3 : Index + Triggers + RLS
   - Partie 4 : Seed data
4. Vérifier dans Table Editor que les 11 tables sont présentes
5. Commiter le script SQL dans `supabase/schema.sql`

Rollback : supprimer et recréer le projet DEV (données de dev, zéro risque).

## Open Questions

- Aucune — schéma entièrement défini dans le PRD v2.
