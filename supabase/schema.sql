-- =============================================================
-- VoxScore — Schéma Supabase PostgreSQL
-- Projet : VoxScore - DEV  |  Région : EU Frankfurt (eu-central-1)
-- Exécuter dans SQL Editor dans l'ordre des sections
-- =============================================================


-- =============================================================
-- PARTIE 1 — Extensions + Enums
-- =============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;         -- pgvector — DOIT précéder promise_embeddings
CREATE EXTENSION IF NOT EXISTS pg_cron;        -- jobs nocturnes

-- Enum : état d'authenticité d'un vote par rapport aux promesses
CREATE TYPE authenticity_state AS ENUM (
  'respected',
  'broken',
  'partial',
  'absent'
);

-- Enum : décision de vote d'un député sur un texte de loi
CREATE TYPE vote_decision AS ENUM (
  'for',
  'against',
  'abstention',
  'absent',
  'non_voting'
);

-- Enum : statut parlementaire d'une loi
CREATE TYPE bill_status AS ENUM (
  'in_progress',
  'voted',
  'rejected',
  'withdrawn'
);

-- Enum : source de données externe
CREATE TYPE api_source AS ENUM (
  'nosdeputes',
  'nossenateurs'
);

-- Enum : position citoyen dans le Baromètre
CREATE TYPE barometer_position AS ENUM (
  'for',
  'against',
  'neutral'
);

-- Enum : catégorie de raison dans le Baromètre
CREATE TYPE reason_category AS ENUM (
  'cost',
  'freedom',
  'social',
  'ecology',
  'economy',
  'other'
);

-- Enum : statut d'une contestation de score
CREATE TYPE dispute_status AS ENUM (
  'pending',
  'under_review',
  'accepted',
  'rejected'
);


-- =============================================================
-- PARTIE 2 — Tables (ordre des dépendances FK)
-- =============================================================

-- 1. parties — groupes politiques
CREATE TABLE IF NOT EXISTS parties (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  acronym       TEXT NOT NULL UNIQUE,
  color         TEXT NOT NULL,                   -- couleur hex #RRGGBB
  global_score  INTEGER CHECK (global_score >= 0 AND global_score <= 100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. politicians — 577 députés (puis sénateurs V2)
CREATE TABLE IF NOT EXISTS politicians (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name          TEXT NOT NULL,
  last_name           TEXT NOT NULL,
  party_id            UUID REFERENCES parties(id) ON DELETE SET NULL,
  department          TEXT,
  constituency        TEXT,
  photo_url           TEXT,
  api_external_id     TEXT,
  api_source          api_source,
  authenticity_score  INTEGER CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
  scores_frozen       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. bills — lois et textes législatifs
CREATE TABLE IF NOT EXISTS bills (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  title_vulgarized  TEXT,
  summary_pros      TEXT,
  summary_cons      TEXT,
  daily_life_impact TEXT,
  status            bill_status NOT NULL DEFAULT 'in_progress',
  theme             TEXT,
  is_radar_alert    BOOLEAN NOT NULL DEFAULT FALSE,
  vote_date         DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. promises — promesses de campagne (source_url obligatoire)
CREATE TABLE IF NOT EXISTS promises (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  politician_id  UUID NOT NULL REFERENCES politicians(id) ON DELETE CASCADE,
  text           TEXT NOT NULL,
  category       TEXT,
  source_url     TEXT NOT NULL,                  -- preuve obligatoire — NOT NULL non négociable
  date_made      DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. votes — votes des députés avec état d'authenticité
CREATE TABLE IF NOT EXISTS votes (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  politician_id       UUID NOT NULL REFERENCES politicians(id) ON DELETE CASCADE,
  bill_id             UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  promise_id          UUID REFERENCES promises(id) ON DELETE SET NULL,  -- nullable
  decision            vote_decision NOT NULL,
  authenticity_state  authenticity_state,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(politician_id, bill_id)
);

-- 6. promise_embeddings — vecteurs Mistral embed (pgvector 1024 dims)
-- NOTE: l'index HNSW est créé en Partie 3 AVANT toute insertion
CREATE TABLE IF NOT EXISTS promise_embeddings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promise_id  UUID NOT NULL REFERENCES promises(id) ON DELETE CASCADE UNIQUE,
  vector      vector(1024) NOT NULL,             -- Mistral embed — dimension fixe 1024
  model       TEXT NOT NULL DEFAULT 'mistral-embed',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. users — comptes citoyens (liés à auth.users)
CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY,             -- = auth.users.id
  trust_level      INTEGER NOT NULL DEFAULT 0 CHECK (trust_level >= 0 AND trust_level <= 3),
  phone_hash       TEXT UNIQUE,                  -- hash SHA-256 du numéro de téléphone
  rgpd_consent     BOOLEAN NOT NULL DEFAULT FALSE,
  rgpd_consent_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. citizen_barometer — votes citoyens (1 par user par loi)
CREATE TABLE IF NOT EXISTS citizen_barometer (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bill_id          UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  position         barometer_position NOT NULL,
  reason_category  reason_category,
  comment          TEXT CHECK (char_length(comment) <= 280),
  comment_approved BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, bill_id)
);

-- 9. barometer_snapshots — snapshots horodatés agrégés (lecture widget)
CREATE TABLE IF NOT EXISTS barometer_snapshots (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bill_id        UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  votes_for      INTEGER NOT NULL DEFAULT 0,
  votes_against  INTEGER NOT NULL DEFAULT 0,
  votes_neutral  INTEGER NOT NULL DEFAULT 0,
  total_votes    INTEGER NOT NULL DEFAULT 0,
  snapshot_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. push_tokens — tokens OneSignal par appareil
CREATE TABLE IF NOT EXISTS push_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  platform    TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. score_disputes — contestations de score par les élus
CREATE TABLE IF NOT EXISTS score_disputes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  politician_id  UUID NOT NULL REFERENCES politicians(id) ON DELETE CASCADE,
  vote_id        UUID REFERENCES votes(id) ON DELETE SET NULL,
  user_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  justification  TEXT NOT NULL,
  status         dispute_status NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =============================================================
-- PARTIE 3a — Index de performance
-- =============================================================

-- Index HNSW pgvector — OBLIGATOIRE avant toute insertion de données
CREATE INDEX IF NOT EXISTS idx_promise_embeddings_vector
  ON promise_embeddings
  USING hnsw (vector vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Index sur les jointures fréquentes
CREATE INDEX IF NOT EXISTS idx_politicians_party_id ON politicians(party_id);
CREATE INDEX IF NOT EXISTS idx_votes_politician_id  ON votes(politician_id);
CREATE INDEX IF NOT EXISTS idx_votes_bill_id        ON votes(bill_id);
CREATE INDEX IF NOT EXISTS idx_barometer_bill_id    ON citizen_barometer(bill_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id  ON push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_disputes_politician  ON score_disputes(politician_id);


-- =============================================================
-- PARTIE 3b — Triggers de recalcul du score d'authenticité
-- =============================================================

-- Fonction : recalcule authenticity_score pour un député
-- Formule : COUNT(respected) * 100 / COUNT(respected + broken + partial)
-- Les votes 'absent' sont exclus du dénominateur
CREATE OR REPLACE FUNCTION recalculate_authenticity_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE politicians
  SET
    authenticity_score = (
      SELECT ROUND(
        COUNT(*) FILTER (WHERE v.authenticity_state = 'respected') * 100.0
        /
        NULLIF(COUNT(*) FILTER (WHERE v.authenticity_state IN ('respected', 'broken', 'partial')), 0)
      )::INTEGER
      FROM votes v
      WHERE v.politician_id = NEW.politician_id
    ),
    updated_at = NOW()
  WHERE id = NEW.politician_id
    AND scores_frozen = FALSE;    -- gel des scores respecté
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger : déclenché après chaque vote inséré ou mis à jour
CREATE OR REPLACE TRIGGER after_vote_upsert
  AFTER INSERT OR UPDATE OF authenticity_state
  ON votes
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_authenticity_score();

-- Fonction : recalcule global_score pour tous les partis
CREATE OR REPLACE FUNCTION recalculate_party_scores()
RETURNS VOID AS $$
BEGIN
  UPDATE parties p
  SET
    global_score = (
      SELECT ROUND(AVG(po.authenticity_score))::INTEGER
      FROM politicians po
      WHERE po.party_id = p.id
        AND po.authenticity_score IS NOT NULL
    ),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Job pg_cron : recalcul des scores de parti chaque nuit à 02:00 UTC
SELECT cron.schedule(
  'recalculate-party-scores',
  '0 2 * * *',
  'SELECT recalculate_party_scores()'
);


-- =============================================================
-- PARTIE 3c — Row Level Security (RLS)
-- =============================================================

-- Activer RLS sur toutes les tables
ALTER TABLE parties             ENABLE ROW LEVEL SECURITY;
ALTER TABLE politicians         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills               ENABLE ROW LEVEL SECURITY;
ALTER TABLE promises            ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE promise_embeddings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_barometer   ENABLE ROW LEVEL SECURITY;
ALTER TABLE barometer_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens         ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_disputes      ENABLE ROW LEVEL SECURITY;

-- ── Données publiques en lecture (anonyme autorisé) ──────────
CREATE POLICY "Public read parties"
  ON parties FOR SELECT USING (true);

CREATE POLICY "Public read politicians"
  ON politicians FOR SELECT USING (true);

CREATE POLICY "Public read bills"
  ON bills FOR SELECT USING (true);

CREATE POLICY "Public read promises"
  ON promises FOR SELECT USING (true);

CREATE POLICY "Public read votes"
  ON votes FOR SELECT USING (true);

CREATE POLICY "Public read barometer_snapshots"
  ON barometer_snapshots FOR SELECT USING (true);

CREATE POLICY "Public read score_disputes"
  ON score_disputes FOR SELECT USING (true);

-- ── Écriture réservée au service role (Edge Functions) ───────
CREATE POLICY "Service role write parties"
  ON parties FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role write politicians"
  ON politicians FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role write bills"
  ON bills FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role write promises"
  ON promises FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role write votes"
  ON votes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role write promise_embeddings"
  ON promise_embeddings FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role write barometer_snapshots"
  ON barometer_snapshots FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ── Données utilisateur — accès restreint au propriétaire ────
CREATE POLICY "User reads own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "User inserts own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "User updates own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "User reads own barometer votes"
  ON citizen_barometer FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated user inserts barometer vote"
  ON citizen_barometer FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');

CREATE POLICY "User updates own barometer vote"
  ON citizen_barometer FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User reads own push tokens"
  ON push_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User manages own push tokens"
  ON push_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User updates own push tokens"
  ON push_tokens FOR UPDATE
  USING (auth.uid() = user_id);

-- ── score_disputes — lecture publique, insertion authentifiée ─
CREATE POLICY "Authenticated user inserts dispute"
  ON score_disputes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role updates dispute"
  ON score_disputes FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
