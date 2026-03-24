# VoxScore — PRD v2.0
**Product Requirements Document · Game Changer Builds · Mars 2026**

---

## Table des matières
1. [Vision & Objectifs](#1-vision--objectifs)
2. [Contexte Stratégique](#2-contexte-stratégique)
3. [Périmètre & Roadmap](#3-périmètre--roadmap)
4. [Fonctionnalités Produit](#4-fonctionnalités-produit)
5. [Architecture des Écrans (UX)](#5-architecture-des-écrans-ux)
6. [Algorithme de Score d'Authenticité](#6-algorithme-de-score-dauthenticité)
7. [Schéma de Base de Données](#7-schéma-de-base-de-données)
8. [Pipeline de Données & IA](#8-pipeline-de-données--ia)
9. [Stratégie Éditoriale](#9-stratégie-éditoriale)
10. [Cadre Légal & Éthique](#10-cadre-légal--éthique)
11. [Stack Technique](#11-stack-technique)
12. [Acquisition & Croissance](#12-acquisition--croissance)
13. [Identité Visuelle & Design System](#13-identité-visuelle--design-system)
14. [Récapitulatif des Décisions](#14-récapitulatif-des-décisions)

---

## 1. Vision & Objectifs

**VoxScore** est une application mobile civic-tech qui rend la politique lisible, mesurable et partageable. Elle s'inscrit dans le portfolio de **Game Changer Builds** en tant que vitrine technique et levier d'acquisition de clients freelance B2B.

**Objectif central :** Offrir à chaque citoyen français une traçabilité complète des actions politiques en comparant la *parole donnée* (promesses de campagne, déclarations publiques) à l'*action réalisée* (votes officiels à l'Assemblée Nationale).

### 1.1 Proposition de valeur

| Cible | Ce que VoxScore lui apporte |
|-------|----------------------------|
| Citoyen déçu | Comprendre en 30 secondes si son député tient ses engagements |
| Citoyen engagé | Participer au débat via le Baromètre Citoyen et les pétitions natives |
| Média / Journaliste | Accéder à des données d'opinion vérifiées, en temps réel, avec historique |
| Client B2B (GCB) | Découvrir le savoir-faire de Game Changer Builds via une app à impact réel |

### 1.2 Les 3 piliers fonctionnels

| Pilier | Nom | Description |
|--------|-----|-------------|
| 1 | **Le Radar** | Savoir ce qui se débat en ce moment de façon ludique (l'anti-LCP) |
| 2 | **L'Impact** | Savoir si une loi me touche vraiment dans ma vie quotidienne |
| 3 | **L'Authenticité** | Savoir si mon élu fait ce qu'il m'a dit lors de la campagne |

> **Concept différenciateur clé :** Le Baromètre VoxScore n'est pas un sondage. C'est un panel citoyen en temps réel, avec des votes authentifiés par OTP. Aucun institut (IFOP, BVA, OpinionWay) ne peut proposer une courbe d'évolution de l'opinion pendant les débats parlementaires. C'est la donnée que les médias n'ont jamais eue.

---

## 2. Contexte Stratégique

### 2.1 Positionnement Game Changer Builds

VoxScore est le projet phare du portfolio **Game Changer Builds** (auto-entrepreneur). Elle sert un double objectif :

- **Objectif primaire :** levier d'acquisition B2B. Chaque Story virale sur TikTok ou Instagram ramène du trafic qualifié vers la landing page GCB, exposant le reste du portfolio (notamment FTG) à des clients potentiels.
- **Objectif secondaire :** preuve de compétence technique. Le projet démontre la maîtrise du pipeline de données, de l'IA sémantique, du schéma relationnel complexe, du design mobile viral et de la product strategy.

### 2.2 Entonnoir de conversion

```
1. VoxScore (B2C de masse)
   → Viralité via Stories TikTok/Instagram sur les lois en débat et les scores des élus

2. Landing page Game Changer Builds
   → Le trafic découvre le portfolio complet

3. Conversion client B2B
   → "Je veux une app comme ça pour mon projet"
```

### 2.3 Modèle économique

**Gratuit au lancement.** Monétisation future non figée, explorée en fonction de la traction :

- Dons participatifs / Ulule / Kickstarter
- SaaS B2B : API et widgets de données pour les médias
- Freemium B2C : fonctionnalités avancées (archives longues, tracking lobbies, alertes mots-clés)
- Sponsoring éthique : partenaires alignés (ONG, médias indépendants, ESS)

> **Règles non négociables :** Aucune vente de données personnelles. Aucune publicité programmatique. Aucune rémunération des élus pour leur visibilité.

---

## 3. Périmètre & Roadmap

### 3.1 Périmètre MVP

Le MVP couvre un sous-ensemble de l'**Assemblée nationale française** pour valider le concept.

- ~50 députés sélectionnés, données saisies manuellement
- Lois majeures récentes uniquement
- Promesses : base propriétaire saisie éditorialement

### 3.2 Roadmap

| Version | Périmètre | Ce qui s'ajoute |
|---------|-----------|-----------------|
| **MVP** | Assemblée nationale (partiel) | Annuaire + recherche code postal, Score d'Authenticité, Comparateur Promesse vs Vote, Partage Story, Baromètre mode démo, Résumé IA des positions |
| **V1** | Assemblée nationale (577 députés) | Auth + Trust Ladder, Baromètre réel (votes authentifiés), pipeline automatisé NosDéputés.fr, Traducteur de loi swipe, Détecteur catimini, alertes push, Bouton "Suivre" |
| **V2** | Sénat + Pétitions | 348 sénateurs (NosSénateurs.fr), Pétitions natives, Widget embarquable B2B, API partenaires |
| **V3** | Gouvernement | Président, Premier ministre, ministres |
| **V4** | Maires | Communes sélectionnées — pipeline spécifique à construire |

### 3.3 Hors-périmètre (explicitement exclus)

- Consignes de vote (l'app informe, elle ne recommande pas)
- Forums de discussion non modérés / commentaires publics libres
- Vente de données personnelles ou politiques nominatives
- Publicité programmatique (Google Ads, Meta Ads)
- Rémunération des élus pour leur visibilité

---

## 4. Fonctionnalités Produit

### 4.1 Profils & Annuaire des Députés

- Recherche par code postal ou nom
- Fiche profil : photo officielle, parti, département/circonscription
- **Score d'Authenticité** (0-100%) calculé automatiquement
- Historique chronologique votes vs promesses
- Résumé IA des positions clés du député
- Scoring étendu aux groupes politiques (score moyen du parti)
- Bouton "Suivre" → alertes push personnalisées

### 4.2 Comparateur Promesse vs Vote

- Interface **split-screen** : promesse (gauche) vs vote réel (droite)
- Source de la promesse toujours affichée (lien vidéo, tweet, programme)
- Indicateur visuel : vert (cohérent) / rouge (incohérent) / orange (abstention)
- Bouton de partage "Choc" : génération automatique d'une image Story pour Instagram, TikTok, X

### 4.3 Traducteur de Loi (Format Swipe)

- Interface **flashcards** type Tinder — une grande carte centrale par loi
- **Face A :** titre vulgarisé, ce que ça va changer dans le quotidien, qui paie
- **Face B :** arguments de la majorité (Pour) vs arguments de l'opposition (Contre)
- Swiper pour la loi suivante. Sauvegarder (bookmark). Voter dans le Baromètre depuis la carte
- Contenu généré par IA (LLM) avec validation éditoriale

### 4.4 Baromètre Citoyen

Le Baromètre est la fonctionnalité différenciante de VoxScore. C'est un **panel d'opinion en temps réel, vérifiable et authentifié**.

- Pour chaque loi en débat : vote **Pour / Contre / Neutre**
- Choix d'une `reason_category` (liste fermée : Coût, Liberté individuelle, Impact social, Écologie, Économie, Autre)
- Commentaire libre optionnel (280 caractères max) — modéré par IA avant affichage
- Résultats agrégés en temps réel — **jamais de vote nominatif public**
- Après le vote officiel : affichage "Le Peuple (X% Contre) vs L'Assemblée (Y% Pour)"

**Mode démo (MVP uniquement) :**
- Le vote est fonctionnel et l'expérience complète est accessible sans authentification
- Les votes ne sont pas persistés (`is_demo: true`) — ils ne alimentent pas le panel officiel
- Bandeau discret : *"Mode aperçu — vos votes seront comptabilisés après vérification de votre identité en V1"*
- Objectif : valider le côté ludique et viral sans compromettre l'intégrité du panel réel

> **Différence vs sondages :** IFOP/BVA : téléphone, ~1000 personnes, 72h, anonyme, photo fixe. VoxScore : app, illimité, temps réel, OTP vérifié, courbe d'évolution, reason_category explicite.
>
> *Limite à documenter publiquement : panel auto-sélectionné (biais des utilisateurs d'apps civic-tech).*

### 4.5 Détecteur de Lois "En Catimini"

Inspirée directement de la **loi Duplomb**. Une loi peut avoir un fort impact sociétal ET une très faible visibilité médiatique.

- Calcul automatique d'un `societal_impact_score` (IA) et d'un `media_coverage_score`
- Si impact élevé ET couverture faible → `is_radar_alert = true`
- Notification push immédiate à TOUS les utilisateurs actifs
- Taux d'ouverture estimé : 40-60% (vs 5% pour une notif classique)

### 4.6 Pétitions Natives (Scénario B)

Les pétitions sont générées **automatiquement** par le Baromètre quand un signal citoyen fort et structuré est détecté.

**Double condition de déclenchement :**
1. **Quantitatif :** minimum 15 000 votes "Contre" de comptes niveau 2+ (OTP validé)
2. **Qualitatif :** au moins 3 `reason_categories` distinctes représentées

- Texte généré automatiquement par IA depuis le contenu de la loi et les motivations
- **Validation éditoriale finale obligatoire** avant publication (`petition_status = pending_review`)
- Signature requiert Niveau 3 (identité civile)

> **Pourquoi supérieur à Change.org :** L'API Change.org est fermée aux tiers. Sur VoxScore, chaque pétition est ancrée dans une loi vérifiable, un vote réel, et des promesses documentées. C'est une pétition avec les preuves en pièce jointe.

### 4.7 Système d'Alertes & Notifications Push

- Alerte quand un député suivi vote une loi — deep-link direct vers le split-screen
- Alerte quand le score d'authenticité d'un élu suivi est mis à jour
- Alerte quand une loi sur un thème suivi passe en débat ou est votée
- Alerte `is_radar_alert` : loi à fort impact, sous les radars

### 4.8 Widget Embarquable (B2B Médias)

Un journaliste intègre une seule ligne dans son article et le Baromètre VoxScore s'affiche en temps réel :

```html
<iframe src="voxscore.app/widget/loi-duplomb" />
```

- Attribution source automatique : "Source : VoxScore by Game Changer Builds"
- Version gratuite : résultats agrégés publics
- Version API partenaire (B2B futur) : données JSON horodatées + courbe temporelle

### 4.9 Compte Utilisateur & Trust Ladder

| Niveau | Nom | Comment | Ce que ça débloque |
|--------|-----|---------|-------------------|
| 0 | Guest | Aucune inscription | Lecture seule — lois, scores, profils |
| 1 | Email vérifié | Inscription + clic lien email | Suivre un député, alertes push |
| 2 | OTP téléphone | SMS (1 numéro = 1 compte max) | Voter au Baromètre (1 vote/loi, irrévocable) |
| 3 | Identité civile | Prénom + Nom + Code postal | Signer une pétition native |

**Dispositifs anti-manipulation :**
- 1 numéro de téléphone = 1 compte maximum (bloqué silencieusement)
- Rate limiting : max 5 votes baromètre par session de 24h
- Quarantaine nouveaux comptes : trust_score faible pendant 24h
- Détection de coordination suspecte : pic anormal → alerte admin + gel temporaire

### 4.10 Gamification

- Badges de citoyenneté pour les utilisateurs réguliers
- Tableau de bord personnel : vos votes vs moyenne nationale
- Trust Score visible (badge vert = compte OTP/identité vérifié)

---

## 5. Architecture des Écrans (UX)

### 5.1 Navigation principale

Barre de navigation en bas (Bottom Tab Bar) — 4 onglets :

| # | Onglet | Contenu principal |
|---|--------|-------------------|
| 1 | **Accueil** | Flux législatif, Baromètre (carrousel), Derniers Verdicts, Alertes catimini |
| 2 | **VoxScope** | Annuaire députés, recherche par nom/code postal, carte de France |
| 3 | **Engagements** | Pétitions natives actives, progression des signatures |
| 4 | **Mon Profil** | Compte, Trust Score, badges, historique votes, paramètres |

### 5.2 Écran Accueil — Le Flux

**Ambiance :** fond dégradé pêche/rose chaud en haut, cartes blanches translucides glassmorphism.

- En-tête personnalisé : "Bonjour [Prénom], 3 lois majeures sont en débat aujourd'hui"
- Alerte catimini (si `is_radar_alert` actif) : bandeau rouge en haut
- Section Baromètre Citoyen (carrousel horizontal) : une carte par loi, boutons Pour/Neutre/Contre
- Section Derniers Verdicts (scroll vertical) : split-screen Promesse vs Vote + jauge circulaire

### 5.3 Écran Hémicycle — Annuaire & Recherche

- Barre de recherche (Nom ou Code Postal)
- Filtres pilules : par Parti, par Thème (Écologie, Économie, Santé, Sécurité, Social...)
- Carte de France interactive (optionnel V1)
- Mini-cards : photo, parti, mini-jauge Score d'Authenticité

### 5.4 Fiche Profil Député — L'Écran Star

**Ambiance :** Story Instagram — très visuel, optimisé pour la viralité.

- Header : photo sur fond dégradé dynamique (couleur selon groupe politique)
- **Score d'Authenticité :** grand chiffre central entouré d'un anneau style Apple Watch
- Stats clés : lois votées, taux de présence, parti, mandat
- Onglet *Votes Récents* : liste chronologique votes vs promesses
- Onglet *Positions Clés* : résumé IA de ses grands combats
- FAB "Partager ce profil" : génération de l'image Choc

### 5.5 Traducteur de Loi — Mode Swipe

- Grande carte centrale occupant 85% de l'écran
- Face A : titre simple + "Ce que ça change" + "Qui paie ?"
- Face B : arguments Pour (majorité) vs Contre (opposition)
- Swipe gauche/droite pour naviguer. Bookmark. Vote Baromètre intégré

### 5.6 Écran Engagements — Pétitions

- Pétitions actives : grandes images de couverture, jauges de progression
- Affichage de la loi d'origine + lien vers le vote de l'Assemblée
- Bouton "Soutenir" : accès après vérification Niveau 3

### 5.7 Profil Citoyen

- Tableau de bord : vos votes Baromètre comparés à la moyenne nationale
- Trust Score : badge visuel du niveau de vérification
- Badges de citoyenneté obtenus
- Gestion des favoris (députés, thèmes) et préférences de notifications
- Paramètres : consentement RGPD, suppression de compte (droit à l'effacement)

---

## 6. Algorithme de Score d'Authenticité

### 6.1 Formule pondérée par impact

```
Score = [ Σ (is_coherent × impact_weight) / Σ (impact_weight) ] × 100
```

**Exemple :** Vote Retraites (w=1.0, cohérent) + Vote Mariage p/tous (w=1.0, cohérent) + Vote Loi agri (w=0.5, incohérent) + Vote Dénomination (w=0.2, cohérent) = **(1.0+1.0+0+0.2) / (1.0+1.0+0.5+0.2) × 100 = 82.8%**

### 6.2 Niveaux d'impact

| Niveau | Poids | Exemples |
|--------|-------|----------|
| **Majeur** | 1.0 | Réforme des retraites, Mariage pour tous, PLF, Loi sécurité nationale |
| **Significatif** | 0.5 | Réforme sectorielle notable, amendement majeur, texte de société |
| **Mineur** | 0.2 | Texte administratif, dénomination, ajustement technique |

**Attribution du niveau :**
1. **IA propose** → champ `ai_impact_suggestion` (analyse : durée débats, nb amendements, couverture médiatique)
2. **Éditorial valide** → champ `impact_level`

### 6.3 États d'authenticité

Le champ `is_authentic` (boolean) est remplacé par `authenticity_state` (enum) :

- **Authentique** : vote aligné avec la promesse → comptabilisé positivement
- **Inauthentique** : vote opposé à la promesse → comptabilisé négativement
- **Abstentionniste** : abstention sur un vote lié à une promesse → impact neutre, signalé séparément
- **Non lié** : vote sans promesse correspondante → exclu du calcul

### 6.4 Recalcul automatique

Chaque nuit après le pipeline, un trigger PostgreSQL recalcule :
- `politicians.authenticity_score` — score individuel
- `parties.global_score` — score moyen du groupe politique

---

## 7. Schéma de Base de Données

### Table `politicians`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `first_name` | String | Prénom |
| `last_name` | String | Nom de famille |
| `chamber` | Enum | `Assemblée` / `Sénat` / `Mairie` |
| `role` | Enum | `Député` / `Ministre` / `Président` |
| `department` | String | Département d'élection |
| `district` | Int, nullable | Numéro de circonscription (députés uniquement) |
| `party_id` | UUID, FK | → `parties` |
| `authenticity_score` | Float | Note globale (0-100) — recalculée automatiquement |
| `absence_rate` | Float | Taux d'absence aux votes |
| `abstention_rate` | Float | Taux d'abstention |
| `photo_url` | String | Lien portrait officiel |
| `api_external_id` | String | ID sur NosDéputés.fr |
| `api_source` | Enum | `nosdeputes` / `nossenateurs` |
| `mandate_start` | Date | Début du mandat |
| `mandate_end` | Date, nullable | Fin du mandat |
| `municipality` | String, nullable | Commune (V4 maires) |

### Table `parties`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `name` | String | Nom du parti (ex: Renaissance, LFI) |
| `acronym` | String | Acronyme court |
| `color_hex` | String | Code couleur UI (ex: #FF0000) |
| `global_score` | Float | Score d'authenticité moyen du groupe |

### Table `politician_party_history`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `politician_id` | UUID, FK | → `politicians` |
| `party_id` | UUID, FK | → `parties` |
| `start_date` | Date | Date d'entrée dans le parti |
| `end_date` | Date, nullable | Date de départ (null si actuel) |

### Table `bills`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `official_title` | String | Titre légal long |
| `short_title` | String | Titre vulgarisé pour l'UI |
| `summary_pros` | Text | Arguments Pour (généré par IA, validé éditorial) |
| `summary_cons` | Text | Arguments Contre |
| `daily_life_impact` | Text | "Ce que ça change pour vous" |
| `affected_populations` | Array | Agriculteurs / Familles / PME... |
| `status` | Enum | `En débat` / `Voté` / `Rejeté` / `Promulgué` |
| `vote_date` | Date | Date prévue ou passée |
| `theme` | String | Écologie, Économie, Santé... |
| `chamber` | Enum | `Assemblée` / `Sénat` / `Les deux` |
| `reading_stage` | Enum | `1ère lecture` / `2ème lecture` / `CMP` / `Vote final` |
| `parent_bill_id` | UUID, FK nullable | Lien vers le texte initial (navette parlementaire) |
| `impact_weight` | Float | `0.2` / `0.5` / `1.0` |
| `impact_level` | Enum | `Mineur` / `Significatif` / `Majeur` (validé éditorial) |
| `ai_impact_suggestion` | Enum | Suggestion de l'IA (avant validation) |
| `societal_impact_score` | Float 0-1 | Score d'impact sociétal calculé par IA |
| `media_coverage_score` | Float 0-1 | Score de couverture médiatique |
| `is_radar_alert` | Boolean | Impact élevé + médias silencieux → alerte push |
| `is_validated` | Boolean | Validé éditorialement |
| `validated_by` | UUID, FK | → `users` (éditeur) |
| `raw_ai_summary` | Text | Brouillon IA avant validation |
| `petition_url` | String, nullable | Lien externe V1 |
| `petition_id` | UUID, FK nullable | → `petitions` (V2 — pétition native) |

### Table `promises`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `politician_id` | UUID, FK | → `politicians` |
| `bill_id` | UUID, FK nullable | → `bills` (NULL si promesse générique) |
| `content` | Text | "Je m'engage à ne pas augmenter les impôts" |
| `source_url` | String, **NOT NULL** | Preuve obligatoire (vidéo, tweet, programme) |
| `date_made` | Date | Date de la déclaration |
| `promise_type` | Enum | `Programme` / `TV` / `Tweet` / `Réunion publique` |
| `scope` | Enum | `National` / `Circonscription` |

### Table `promise_embeddings`

| Champ | Type | Description |
|-------|------|-------------|
| `promise_id` | UUID, FK | → `promises` |
| `vector` | vector(1536) | Embedding OpenAI/Anthropic (pgvector) |
| `model_version` | String | Version du modèle utilisé |

### Table `votes`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `politician_id` | UUID, FK | → `politicians` |
| `bill_id` | UUID, FK | → `bills` |
| `chamber` | Enum | `Assemblée` / `Sénat` |
| `decision` | Enum | `Pour` / `Contre` / `Abstention` / `Absent` |
| `promise_id` | UUID, FK nullable | → `promises` (promesse matchée par l'IA) |
| `authenticity_state` | Enum | `Authentique` / `Inauthentique` / `Abstentionniste` / `Non lié` |
| `vote_date` | Date | Date du vote |

### Table `users`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `email` | String, unique | Optionnel si login OAuth |
| `auth_provider` | String | `supabase_auth` / `apple` / `google` |
| `phone_hash` | String, unique | Hash du numéro tél (jamais en clair) |
| `is_verified` | Boolean | OTP téléphone validé |
| `identity_verified` | Boolean | Identité civile vérifiée (Niveau 3) |
| `trust_score` | Int | Fiabilité du compte |
| `postal_code` | String | Détection du député local |
| `account_created_at` | Timestamp | Pour calcul trust_score (quarantaine 24h) |
| `barometer_consent_at` | Timestamp nullable | Date du consentement RGPD explicite |
| `deleted_at` | Timestamp nullable | Soft delete — droit à l'effacement RGPD |

### Table `user_follows`

| Champ | Type | Description |
|-------|------|-------------|
| `user_id` | UUID, FK | → `users` |
| `politician_id` | UUID, FK | → `politicians` |
| `followed_at` | Timestamp | — |
| UNIQUE | `(user_id, politician_id)` | Contrainte d'unicité |

### Table `citizen_barometer`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `user_id` | UUID, FK | → `users` |
| `bill_id` | UUID, FK | → `bills` |
| `citizen_vote` | Enum | `Pour` / `Contre` / `Neutre` |
| `reason_category` | Enum | `Coût` / `Liberté` / `Impact social` / `Écologie` / `Économie` / `Autre` |
| `comment` | Text nullable | Motivation libre (280 chars max — modéré par IA) |
| `created_at` | Timestamp | — |
| `trust_score_at_vote` | Int | Snapshot du trust_score au moment du vote |
| UNIQUE | `(user_id, bill_id)` | Un seul vote par utilisateur par loi |

### Table `barometer_snapshots`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `bill_id` | UUID, FK | → `bills` |
| `snapshot_at` | Timestamp | Heure du calcul |
| `votes_pour` | Int | Compteur votes Pour (comptes Niveau 2+ uniquement) |
| `votes_contre` | Int | Compteur votes Contre |
| `votes_neutre` | Int | Compteur votes Neutres |
| `total_verified` | Int | Total votes de comptes OTP-validés |
| `reason_breakdown` | JSONB | Répartition % des reason_categories |
| `trend_delta` | Float | Variation vs snapshot précédent |

### Table `petitions`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `bill_id` | UUID, FK | → `bills` (loi à l'origine de la pétition) |
| `title` | String | Titre de la pétition |
| `description` | Text | Texte généré par IA + validé éditorial |
| `target_signatures` | Int | Objectif de signatures |
| `petition_status` | Enum | `pending_review` / `active` / `closed` |
| `created_at` | Timestamp | — |

> `current_signatures` est calculé dynamiquement par `COUNT(*)` depuis `signatures` — jamais stocké en dur (race condition).

### Table `signatures`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `user_id` | UUID, FK | → `users` (Niveau 3 requis) |
| `petition_id` | UUID, FK | → `petitions` |
| `created_at` | Timestamp | — |
| UNIQUE | `(user_id, petition_id)` | Une seule signature par utilisateur |

### Table `score_disputes`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `politician_id` | UUID, FK | L'élu qui conteste |
| `vote_id` | UUID, FK nullable | Vote contesté |
| `promise_id` | UUID, FK nullable | Promesse contestée |
| `reason` | Text | Explication de la contestation |
| `status` | Enum | `pending` / `reviewed` / `accepted` / `rejected` |
| `created_at` | Timestamp | — |

### Table `push_tokens`

| Champ | Type | Description |
|-------|------|-------------|
| `id` | UUID, PK | — |
| `user_id` | UUID, FK | → `users` |
| `token` | String | Token de notification push |
| `platform` | Enum | `iOS` / `Android` |
| `created_at` | Timestamp | — |
| `is_active` | Boolean | Token toujours valide |

---

## 8. Pipeline de Données & IA

### 8.1 Sources de données

| Source | Chambre | Ce qu'elle apporte |
|--------|---------|-------------------|
| `nosdeputes.fr` (API) | Assemblée | Votes, présences, amendements — données nettoyées |
| `nossenateurs.fr` (API) | Sénat | Même schéma — V2 (remplacer le domaine dans les URLs) |
| `lafabriquedelaloi.fr` (API) | Les deux | Navette parlementaire complète, lecture par lecture |
| Base propriétaire | Toutes | Promesses éditorialement saisies — `source_url` obligatoire |

### 8.2 Étape 1 — Extraction (chaque nuit à 2h00)

- Cron Job automatique (Supabase Edge Functions)
- Récupération : présences/absences, nouveaux scrutins, vote exact de chaque député
- LaFabriqueDeLaLoi : suivi navette + mise à jour `reading_stage`
- Destination : table `votes` + mise à jour `bills.status`

### 8.3 Étape 2 — Traitement IA

**Module A — Vulgarisation des lois (LLM)**

Prompt système : *"Tu es un expert neutre en droit constitutionnel. Résume ce texte en 3 phrases maximum niveau collège. Liste 2 arguments Pour (majorité) et 2 Contre (opposition). Indique ce que ça change dans la vie quotidienne et qui paie."*

Sortie → `bills.summary_pros`, `bills.summary_cons`, `bills.daily_life_impact`

**Module B — Matching sémantique (Embeddings)**

- Similarité vectorielle entre le texte d'un vote et les promesses du député
- pgvector sur Supabase — vecteurs stockés dans `promise_embeddings`
- Sortie : `votes.promise_id` + `votes.authenticity_state` (Authentique / Inauthentique)

**Module C — Détection catimini**

- Analyse de la couverture médiatique (flux RSS, mentions)
- `societal_impact_score` vs `media_coverage_score`
- Si impact élevé + couverture faible → `is_radar_alert = true` → push immédiat

**Module D — Modération des commentaires**

- Prompt : *"Ce commentaire contient-il : insulte / appel à la violence / hors-sujet / désinformation ?"*
- Si OUI → commentaire refusé avec message pédagogique. Vote reste valide.
- Si faux positif → contestation possible (1 seule par commentaire)

### 8.4 Étape 3 — Calcul des scores

- Trigger PostgreSQL → recalcule `politicians.authenticity_score` et `parties.global_score`
- `barometer_snapshots` calculés toutes les heures
- Vérification seuils pétition : ≥15 000 votes Contre niveau 2+ ET ≥3 catégories → création `pending_review`

### 8.5 Étape 4 — Distribution

- Notifications push aux abonnés d'un député dont le score a changé
- Deep-link direct vers le split-screen Promesse vs Action
- Mise à jour temps réel des `barometer_snapshots` → widget embarquable

---

## 9. Stratégie Éditoriale

### 9.1 Sélection des lois

Approche **hybride IA + Humain** :

1. **Filtre IA :** shortlist des 50 textes les plus importants (médiatisation, durée débats, nb amendements, impact sociétal)
2. **Filtre humain :** sélection finale des 20 lois les plus impactantes par l'équipe GCB
3. **Critères :** impact vie quotidienne, potentiel viral, existence de promesses documentées

### 9.2 Règles de sourcing des promesses

- Toute promesse **DOIT** avoir un `source_url` non nul (champ obligatoire en BDD)
- Types acceptés : programme officiel PDF, interview TV, tweet/post officiel, réunion publique enregistrée
- Scope indiqué : nationale ou circonscription

### 9.3 Méthodologie publique

Publiée sur `voxscore.app/methodologie` — obligation légale (licence ODbL) et bouclier juridique.

- Formule de score explicite et illustrée
- Règles d'attribution des niveaux d'impact
- Processus de validation éditorial
- Limites et biais connus (panel auto-sélectionné du Baromètre)

---

## 10. Cadre Légal & Éthique

### 10.1 RGPD — Données politiques (Art. 9)

- **Consentement explicite** au 1er vote baromètre : checkbox + phrase claire
- Champ `barometer_consent_at` dans `users` — preuve du consentement
- Résultats uniquement agrégés — aucun vote politique individuel public
- Soft delete (`deleted_at`) + purge automatique après 3 ans d'inactivité
- Registre des traitements à constituer avant le lancement

### 10.2 Risque de diffamation

Trois boucliers en place :

1. **Source obligatoire :** `source_url` NOT NULL dans `promises`
2. **Méthodologie publique :** `voxscore.app/methodologie`
3. **Mécanisme de contestation :** table `score_disputes`

### 10.3 Période électorale

> Dans les 6 semaines précédant un scrutin, VoxScore bascule en mode "données brutes uniquement" : les classements de scores sont gelés, seules les données factuelles (votes, présences) restent affichées. Configurer un flag `is_election_period` dans la table de configuration.

### 10.4 Licence des données

- Données NosDéputés.fr : licence **ODbL + CC-BY-SA**
- Mention obligatoire dans l'app : *"Données : NosDéputés.fr par Regards Citoyens"*
- Si les données sont modifiées (scoring), publier les modifications sous la même licence ODbL

### 10.5 Neutralité éditoriale

- Aucune consigne de vote, aucune recommandation partisane
- Arguments Pour ET Contre toujours présentés en paires
- Score basé sur les promesses documentées — non sur des appréciations subjectives

---

## 11. Stack Technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| App mobile | React Native 0.83 + Expo SDK 55 + expo-router | Cross-platform iOS/Android, OTA updates, stores Apple + Google |
| Backend & BDD | Supabase (PostgreSQL) | Relations complexes + pgvector + API auto-générée + RLS |
| Auth + OTP | Supabase Auth (Twilio intégré) | Trust Ladder N0→N3, 1 numéro = 1 compte |
| Automation | Supabase Edge Functions + pg_cron | Pipeline nuitier sync NosDéputés.fr + recalcul scores |
| IA génération | Anthropic Claude Sonnet | Vulgarisation lois, résumé positions député, génération pétitions |
| IA modération | Anthropic Claude Haiku | Modération commentaires Baromètre (rapide, < $0.10/1M tokens) |
| Embeddings | Mistral embed + pgvector (Supabase) | Matching sémantique promesse↔vote — entreprise française, excellent français |
| Notifications push | Expo Push Notifications (MVP) → OneSignal (V1) | Segmentation avancée en V1 (par député suivi, par thème) |
| Génération image "Choc" | react-native-view-shot | Capture client-side du composant natif — pas de serveur requis |
| Web / Widget embarquable | Next.js sur Vercel | Landing page, /methodologie, widget iframe Baromètre (V2) |

> **Avantage stack "Turbo-MVP" :** Aucun serveur brut à gérer. Paiement à l'usage — coût du MVP proche de 0€.

---

## 12. Acquisition & Croissance

### 12.1 Stratégie 100% Organique

Zéro budget publicitaire. L'acquisition repose entièrement sur la viralité native.

### 12.2 Le Sharebait — Moteur principal

- Chaque écran est designé comme une Story prête à capturer
- Bouton "Partager ce profil" → génération auto d'une image Choc
- Carte "Le Peuple vs L'Assemblée" après le vote officiel → format viral naturel
- Toutes les images exportées portent le logo VoxScore + lien `voxscore.app`

### 12.3 Production de Contenu

- **X (Twitter) :** analyses politiques factuelles, interpellations directes d'élus avec données sources
- **TikTok / Reels :** vidéos courtes vulgarisant une promesse confrontée à un vote réel

### 12.4 RP & Partenariats Médias

- Widget embarquable gratuit pour les journalistes
- Attribution source automatique = exposition passive de la marque VoxScore
- Données fournies en exclusivité à des influenceurs/médias politiques

### 12.5 Lien avec Game Changer Builds

- Chaque Story virale intègre le logo GCB + lien vers la landing page
- La landing page GCB présente VoxScore + FTG + autres apps
- Ce que le visiteur B2B voit : *"cette personne construit des apps à impact, solides techniquement et virales"*

---

## 13. Identité Visuelle & Design System

### 13.1 Stack design

```
React Native + Expo + expo-linear-gradient + react-native-svg
lucide-react-native + Context API (useTheme)
```

### 13.2 Palette de couleurs

**Gradient principal (light) :**
```
['#FF3870', '#FF7A5A', '#FFB89A', '#FFF0E8']
direction : (0,0) → (0.4,1)
```

**Sémantique :**
| Usage | Couleur | Light | Dark |
|-------|---------|-------|------|
| Authentique (kept) | Vert | `#00C87A` | `#00C87A` |
| Inauthentique (broken) | Rouge | `#FF3355` | `#FF3355` |
| Partiel | Orange | `#FF8C00` | `#FF8C00` |
| Absent | Gris | `#A0AEC0` | `#A0AEC0` |
| Primary | Rose | `#FF3870` | `#FF3870` |
| Accent | Orange | `#FF9A00` | `#FF9A00` |

**Surfaces glassmorphism :**
```
Light : rgba(255,255,255,0.75) — blur 12px
Dark  : rgba(30,10,20,0.70)   — blur 12px
```

**Ombres (signature visuelle) :**
```
shadowColor: '#FF3870' — sur tous les composants
```

### 13.3 Composants clés

| Composant | Fichier source | Description |
|-----------|---------------|-------------|
| `CoherenceRing` | `components/common/CoherenceRing.tsx` | Anneau SVG style Apple Watch — score central |
| `VoteBadge` | `components/common/VoteBadge.tsx` | Pastille Pour/Contre/Abstention/Absent |
| `CoherenceBadge` | `components/common/CoherenceBadge.tsx` | Badge texte avec icône Lucide |
| `CategoryBadge` | `components/common/CategoryBadge.tsx` | Badge thématique couleur par catégorie |
| `GradientBackground` | `components/common/GradientBackground.tsx` | Fond dégradé 4 stops — wrapping global |
| `DeputyCard` | `components/DeputyCard.tsx` | Carte député complète avec stats |
| `LawCard` | `components/LawCard.tsx` | Carte loi expandable avec impacts |
| `CommunePicker` | `components/CommunePicker.tsx` | Modal sélection commune par code postal |

**Nouveaux composants à créer pour VoxScore V2 :**
- `BarometerDonut` — graphique anneau Pour/Neutre/Contre
- `RadarAlertBanner` — bandeau alerte loi catimini
- `PetitionCard` — carte pétition native avec jauge
- `SplitScreen` — Promesse vs Vote (l'écran viral)

### 13.4 Principes design

- **Lisibilité maximale :** chiffres clés en avant, textes aérés, compréhensible en un coup d'œil
- **Social-First :** chaque écran ressemble à une Story Instagram/TikTok prête à être capturée
- **Glassmorphism :** cartes blanches translucides sur fond dégradé
- **Anti-institutionnel :** rupture totale avec l'esthétique gris/bleu marine des sites officiels
- **Font weights :** 700 pour badges, 800 pour titres et scores (fontWeight: '800')

---

## 14. Récapitulatif des Décisions

| Sujet | Statut | Décision actée |
|-------|--------|----------------|
| Nom de l'application | ✅ | VoxScore (à vérifier INPI + domaine) |
| Structure juridique | ✅ | Auto-entrepreneur Game Changer Builds |
| Périmètre V1 | ✅ | Assemblée nationale uniquement |
| Roadmap V2/V3/V4 | ✅ | Sénat / Gouvernement / Maires |
| Business model | ✅ | Gratuit + leads B2B GCB. Monétisation future ouverte |
| Score pondéré | ✅ | `impact_weight` 0.2/0.5/1.0 + validation éditoriale |
| Détecteur catimini | ✅ | `is_radar_alert` (impact élevé + silence médias) |
| Pétitions | ✅ | Scénario B : native auto-générée (seuil double condition) |
| Seuil pétition | ✅ | 15 000 votes Contre niveau 2+ ET ≥3 catégories |
| Authentification | ✅ | Trust Ladder 4 niveaux (0 Guest → 3 Identité civile) |
| Anti-manipulation | ✅ | 1 tél = 1 compte, rate limiting, quarantaine 24h |
| Modération commentaires | ✅ | IA temps réel, commentaires jamais nominatifs publics |
| Baromètre — données | ✅ | `barometer_snapshots` horaires + `reason_category` + widget médias |
| RGPD Art. 9 | ✅ | Consentement checkbox 1er vote + agrégation stricte |
| Diffamation | ✅ | `source_url` obligatoire + méthodologie publique + `score_disputes` |
| Période électorale | ✅ | Mode gel des classements (`is_election_period`) |
| Licence ODbL | ✅ | Mention source obligatoire + méthodologie publique |
| Stack design | ✅ | React Native + Expo — composants réutilisés depuis Hemicycle V1 |
| Vérification INPI | ⏳ | Recherche sur data.inpi.fr + domaine voxscore.fr/.app |
| FranceConnect | 🔄 | Reporté V2 — OTP téléphone suffisant au lancement |

---

*VoxScore — PRD v2.0 — Game Changer Builds — Mars 2026*
*Document consolidé — Confidentiel*
