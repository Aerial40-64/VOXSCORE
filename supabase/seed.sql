-- =============================================================
-- VoxScore — Données de seed MVP
-- Exécuter APRÈS schema.sql dans SQL Editor Supabase
-- Données fictives pour tests et développement uniquement
-- =============================================================


-- =============================================================
-- Partis politiques (couleurs du design system colors.ts)
-- =============================================================

INSERT INTO parties (id, name, acronym, color) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Renaissance', 'RE', '#FF8C00'),
  ('11111111-0000-0000-0000-000000000002', 'Rassemblement National', 'RN', '#3B82F6'),
  ('11111111-0000-0000-0000-000000000003', 'La France Insoumise', 'LFI', '#FF3355'),
  ('11111111-0000-0000-0000-000000000004', 'Les Républicains', 'LR', '#3B82F6'),
  ('11111111-0000-0000-0000-000000000005', 'Parti Socialiste', 'PS', '#E91E8C'),
  ('11111111-0000-0000-0000-000000000006', 'Europe Écologie Les Verts', 'EELV', '#00C87A'),
  ('11111111-0000-0000-0000-000000000007', 'Indépendants', 'IND', '#A0AEC0')
ON CONFLICT (acronym) DO NOTHING;


-- =============================================================
-- Députés fictifs (MVP — 5 profils)
-- =============================================================

INSERT INTO politicians (id, first_name, last_name, party_id, department, constituency, api_source) VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    'Marie', 'Laurent',
    '11111111-0000-0000-0000-000000000001',  -- RE
    'Paris', '1ère circonscription de Paris',
    'nosdeputes'
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'Thomas', 'Dubois',
    '11111111-0000-0000-0000-000000000002',  -- RN
    'Var', '1ère circonscription du Var',
    'nosdeputes'
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'Isabelle', 'Moreau',
    '11111111-0000-0000-0000-000000000003',  -- LFI
    'Seine-Saint-Denis', '2ème circonscription de Seine-Saint-Denis',
    'nosdeputes'
  ),
  (
    '22222222-0000-0000-0000-000000000004',
    'Pierre', 'Fontaine',
    '11111111-0000-0000-0000-000000000005',  -- PS
    'Gironde', '3ème circonscription de Gironde',
    'nosdeputes'
  ),
  (
    '22222222-0000-0000-0000-000000000005',
    'Sophie', 'Bernard',
    '11111111-0000-0000-0000-000000000006',  -- EELV
    'Loire-Atlantique', '1ère circonscription de Loire-Atlantique',
    'nosdeputes'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- Lois fictives (3 lois avec résumés placeholder)
-- =============================================================

INSERT INTO bills (id, title, title_vulgarized, summary_pros, summary_cons, daily_life_impact, status, theme, vote_date) VALUES
  (
    '33333333-0000-0000-0000-000000000001',
    'Projet de loi de finances rectificative 2026',
    'Le budget 2026 revu et corrigé',
    'Augmentation des aides aux ménages modestes, soutien aux PME, investissement dans la transition écologique.',
    'Creusement du déficit public, hausse des taxes sur certains produits, réduction des niches fiscales.',
    'Vos aides logement pourraient augmenter de 3%. Les carburants pourraient coûter 2 centimes de plus au litre.',
    'in_progress',
    'économie',
    NULL
  ),
  (
    '33333333-0000-0000-0000-000000000002',
    'Proposition de loi visant à renforcer la protection de l''environnement',
    'La loi qui veut sauver nos rivières',
    'Réduction de la pollution des cours d''eau, sanctions plus sévères pour les industriels pollueurs, création de zones naturelles protégées.',
    'Contraintes supplémentaires pour l''agriculture et l''industrie, coûts de mise en conformité élevés.',
    'L''eau du robinet de votre commune pourrait être mieux surveillée. Les balades en rivière plus sûres.',
    'voted',
    'écologie',
    '2026-02-15'
  ),
  (
    '33333333-0000-0000-0000-000000000003',
    'Projet de loi sur le plein emploi et l''insertion professionnelle',
    'Trouver un emploi plus facilement ?',
    'Renforcement de France Travail, nouvelles obligations d''accompagnement, incitations fiscales pour les entreprises qui recrutent des jeunes.',
    'Conditionnalités plus strictes pour le RSA, questions sur l''efficacité des dispositifs existants.',
    'Si vous êtes au chômage, votre conseiller France Travail devra vous contacter toutes les 2 semaines.',
    'in_progress',
    'emploi',
    NULL
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- Promesses fictives (avec source_url obligatoire)
-- =============================================================

INSERT INTO promises (id, politician_id, text, category, source_url, date_made) VALUES
  (
    '44444444-0000-0000-0000-000000000001',
    '22222222-0000-0000-0000-000000000001',  -- Marie Laurent (RE)
    'Je m''engage à voter en faveur de toute mesure de réduction du déficit public dans les 2 prochaines années.',
    'économie',
    'https://example.com/programme-marie-laurent-2024',
    '2024-06-01'
  ),
  (
    '44444444-0000-0000-0000-000000000002',
    '22222222-0000-0000-0000-000000000001',  -- Marie Laurent (RE)
    'Je soutiens l''augmentation des aides au logement pour les familles modestes.',
    'social',
    'https://example.com/interview-marie-laurent-logement',
    '2024-05-15'
  ),
  (
    '44444444-0000-0000-0000-000000000003',
    '22222222-0000-0000-0000-000000000003',  -- Isabelle Moreau (LFI)
    'Je voterai systématiquement contre tout projet de loi qui réduit les droits des travailleurs.',
    'emploi',
    'https://example.com/programme-isabelle-moreau',
    '2024-06-01'
  )
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- Votes fictifs (déclenche le trigger de calcul du score)
-- =============================================================

-- Marie Laurent : vote FOR le budget (promesse tenue → respected)
INSERT INTO votes (politician_id, bill_id, promise_id, decision, authenticity_state) VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000001',
    '44444444-0000-0000-0000-000000000001',
    'for',
    'respected'
  )
ON CONFLICT (politician_id, bill_id) DO NOTHING;

-- Marie Laurent : vote FOR la loi environnement (pas de promesse associée)
INSERT INTO votes (politician_id, bill_id, promise_id, decision, authenticity_state) VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    '33333333-0000-0000-0000-000000000002',
    NULL,
    'for',
    'absent'
  )
ON CONFLICT (politician_id, bill_id) DO NOTHING;

-- Thomas Dubois : absent sur le vote budget
INSERT INTO votes (politician_id, bill_id, promise_id, decision, authenticity_state) VALUES
  (
    '22222222-0000-0000-0000-000000000002',
    '33333333-0000-0000-0000-000000000001',
    NULL,
    'absent',
    'absent'
  )
ON CONFLICT (politician_id, bill_id) DO NOTHING;

-- Isabelle Moreau : vote AGAINST plein emploi (promesse tenue → respected)
INSERT INTO votes (politician_id, bill_id, promise_id, decision, authenticity_state) VALUES
  (
    '22222222-0000-0000-0000-000000000003',
    '33333333-0000-0000-0000-000000000003',
    '44444444-0000-0000-0000-000000000003',
    'against',
    'respected'
  )
ON CONFLICT (politician_id, bill_id) DO NOTHING;

-- Isabelle Moreau : vote FOR le budget (promesse brisée → broken)
INSERT INTO votes (politician_id, bill_id, promise_id, decision, authenticity_state) VALUES
  (
    '22222222-0000-0000-0000-000000000003',
    '33333333-0000-0000-0000-000000000001',
    '44444444-0000-0000-0000-000000000001',
    'for',
    'broken'
  )
ON CONFLICT (politician_id, bill_id) DO NOTHING;


-- =============================================================
-- Vérification — après exécution, ces requêtes doivent retourner
-- des scores calculés automatiquement par le trigger :
--
-- SELECT id, first_name, last_name, authenticity_score
-- FROM politicians ORDER BY last_name;
--
-- Résultats attendus :
-- Marie Laurent  → 100 (1 respected / 1 non-absent)
-- Isabelle Moreau → 50 (1 respected / 2 non-absent)
-- Thomas Dubois  → NULL (aucun vote non-absent)
-- =============================================================
