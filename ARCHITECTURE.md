# VoxScore — Architecture Technique

> Document de référence des choix techniques arrêtés. À consulter avant tout démarrage de développement.
> Dernière mise à jour : mars 2026

---

## 1. Vue d'ensemble

VoxScore est une application **mobile-first** (iOS + Android) civic-tech ciblant la Gen Z française. Elle sert de vitrine technique et de levier d'acquisition B2C pour le portfolio Game Changer Builds.

**Contraintes structurelles qui guident les choix :**
- Solo développeur → complexité opérationnelle minimale, pas de serveur à gérer
- Coût quasi-zéro au MVP → pay-as-you-go, pas de licence fixe
- Viralité comme moteur de croissance → performance UI et partage natif critiques
- Showcase B2B → stack moderne et défendable techniquement
- Cible de scale : **1M → 10M MAU** — architecture évolutive en 3 phases

---

## 2. Résumé exécutif du stack

| Couche | Choix retenu | Verdict à l'échelle | Action |
|--------|-------------|---------------------|--------|
| Mobile | React Native + Expo | ✅ Tient toutes phases | — |
| Backend/BaaS | Supabase EU Frankfurt | ⚠️ Plafond ~500K MAU | Migrer Phase 2 |
| Auth OTP | Supabase Auth (Twilio) | ❌ $32K/mois à 10M MAU | Remplacer Phase 2 |
| Realtime Baromètre | Supabase Realtime | ⚠️ Limite connexions concurrentes | Ably Phase 2 |
| Push notifications | OneSignal | ✅ Millions/sec | Dès V1 |
| AI génération | Claude Sonnet | ✅ ~$37/mois à 10M MAU | — |
| AI modération | Claude Haiku | ✅ ~$250/mois à 10M MAU | — |
| Embeddings | Mistral embed + pgvector HNSW | ✅ Index HNSW requis | Créer HNSW dès Phase 1 |
| Web/Widget | Next.js + Vercel | ⚠️ CDN requis à grande échelle | Cloudflare Phase 2 |
| State | Zustand + TanStack Query | ✅ Tient | — |
| Cache | Upstash Redis | Critique dès V1 | **Dès V1** |
| Analytics | PostHog EU Frankfurt | RGPD-compliant | **Dès MVP** |
| Error monitoring | Sentry @sentry/react-native | — | **Dès MVP** |

---

## 3. Architecture évolutive en 3 phases

```
Phase 1 : MVP → 500K MAU       Phase 2 : 500K → 2M MAU        Phase 3 : 2M → 10M+ MAU
────────────────────────────   ─────────────────────────────   ──────────────────────────────
Supabase (tout-en-un)           Supabase Enterprise             PostgreSQL self-managed (RDS)
Supabase Auth + Twilio          ou Supabase self-hosted         API custom (Bun/Fastify)
Supabase Realtime               + Ably (Realtime)               Auth.js + Vonage SMS direct
OneSignal                       Upstash Redis cluster           Ably multi-région
Upstash Redis                   Cloudflare CDN widget           Redis cluster self-hosted
Next.js + Vercel                                                Kubernetes (GKE / EKS)
```

**Déclencheur Phase 2 :** 500K MAU actifs ou levée de fonds.
**Déclencheur Phase 3 :** Series A ou rentabilité avec MRR couvrant infra custom.

---

## 4. Frontend Mobile

### Versions

| Composant | Version |
|---|---|
| Expo SDK | **55.0.0** |
| React Native | **0.83** |
| React | **19.2.0** |
| Node.js minimum | 20.19.x |
| expo-router | inclus SDK 55 (file-based routing) |

### Architecture React Native

- **New Architecture activée par défaut** depuis Expo SDK 53 — obligatoire depuis RN 0.82, non désactivable
- **Legacy Architecture définitivement supprimée** depuis RN 0.82 — ne jamais tenter de la réactiver
- Rendu Fabric (New Architecture) + JSI pour les modules natifs

### Animations — react-native-reanimated

**Version obligatoire : 4.1.5**

- Reanimated 4.0.x est **incompatible** avec RN 0.83 → crash garanti
- Reanimated 4 exige la New Architecture (aligné avec notre setup)
- Des régressions de performance sont documentées sur New Architecture depuis SDK 53

**Configuration obligatoire dans `app.json` :**

```json
{
  "expo": {
    "plugins": [
      ["expo-build-properties", {
        "android": { "reactNativeReleaseLevel": "experimental" },
        "ios": { "reactNativeReleaseLevel": "experimental" }
      }]
    ]
  }
}
```

**Protection contre les conflits de version dans `package.json` :**

```json
"overrides": {
  "react-native-reanimated": "4.1.5"
}
```

### Navigation

- **expo-router** — file-based routing, deep links natifs
- Routes définies : `/depute/[id]`, `/loi/[id]`
- Bottom Tab Bar — 4 onglets : Accueil / VoxScope / Engagements / Mon Profil

### UI & Design System

| Lib | Usage |
|---|---|
| `react-native-svg` | CoherenceRing (anneau Score d'Authenticité), graphiques |
| `expo-linear-gradient` | GradientBackground — dégradé 4 stops |
| `lucide-react-native` | Icônes système |
| `react-native-reanimated` 4.1.5 | Animations fluides UI thread |
| `react-native-gesture-handler` | Gestures (swipe lois, swipe baromètre) |

**Règles de code :**
- Tous les composants sont fonctionnels avec `useTheme()` — jamais de couleurs hardcodées
- Styles exclusivement via `StyleSheet.create()`
- Props typées via interfaces TypeScript — types centralisés dans `@/types/database`
- `colors.ts` est la source de vérité unique du design system

### Génération image "Choc" (Stories virales)

- **react-native-view-shot** — capture client-side du composant natif affiché
- Aucun serveur requis — génère exactement ce que l'utilisateur voit (dégradé, score, glassmorphism)
- Formats cibles : Story Instagram (9:16), post X/TikTok

---

## 5. Backend — Supabase

### Pourquoi Supabase

- PostgreSQL natif → jointures complexes (`politicians → parties → votes → promises`)
- **pgvector** intégré → stockage des embeddings sans service externe
- Triggers PostgreSQL → recalcul automatique de `authenticity_score` chaque nuit
- Realtime subscriptions → Baromètre live sans polling
- Auth OTP téléphone (Twilio intégré) → Trust Ladder N0→N3
- Row Level Security → sécurité des données sans middleware
- Open source + exportable → zéro vendor lock-in
- **Région : EU Frankfurt** — non modifiable après création, obligatoire dès Phase 1

### Plan par phase

| Phase | Plan | Coût/mois |
|-------|------|-----------|
| MVP | Free tier (500MB DB, 2GB stockage, 250GB bandwidth) | ~0€ |
| V1 — 50K DAU | Pro | ~$25 |
| 500K MAU | Enterprise (négociation auth) | ~$1,300 |
| 2M MAU | Supabase self-hosted (~même API) | ~$500 fixe |
| 10M MAU | AWS RDS PostgreSQL + API custom | ~$5–8K |

> Coût auth Supabase = **$0.00325/MAU** au-delà du quota inclus — linéaire, sans volume discount. Intenable au-delà de 2M MAU.

### Tables principales

```
politicians        — 577 députés (puis sénateurs V2)
parties            — groupes politiques + score global
bills              — lois (titre, résumé IA, statut, thème)
promises           — promesses de campagne (source_url obligatoire)
votes              — votes des députés (decision + authenticity_state)
promise_embeddings — vecteurs Mistral embed (pgvector)
citizen_barometer  — votes citoyens Pour/Contre/Neutre
barometer_snapshots — historique horodaté (snapshots toutes les heures)
users              — compte + trust_level + consentement RGPD
push_tokens        — tokens OneSignal par utilisateur
score_disputes     — contestations du score par les élus
```

### Automatisation

- **Supabase Edge Functions** (runtime Deno) — pipeline nuitier
- **pg_cron** — recalcul `authenticity_score` et `global_score` chaque nuit
- **Supabase Realtime** — subscriptions Baromètre, mise à jour widget (Phase 1)

### Repository pattern — non-négociable dès Phase 1

```typescript
// ❌ Jamais dans un composant
const { data } = await supabase.from('bills').select('*')

// ✅ Toujours via un service abstrait
import { billsService } from '@/services/billsService'
const bills = await billsService.getActiveBills()
```

Migration Phase 3 = remplacement de l'implémentation du service, pas réécriture des écrans.

---

## 6. Intelligence Artificielle

### Architecture hybride — 3 modèles, 3 rôles distincts

| Rôle | Modèle | Justification |
|---|---|---|
| **Génération** (vulgarisation lois, résumés député, pétitions) | Anthropic Claude Sonnet | Contexte 200k tokens, nuance politique française, rédaction longue forme |
| **Modération** (commentaires Baromètre) | Anthropic Claude Haiku | $0.25/$1.25 per MTok, <500ms, classification binaire |
| **Embeddings** (matching sémantique promesse↔vote) | Mistral embed | Entreprise française, corpus FR dense, $0.10/1M tokens, pgvector natif, dim. 1024 |

### Pourquoi ne pas mixer les modèles d'embeddings

Tous les vecteurs (promesses ET votes) doivent provenir du **même modèle** — Mistral embed exclusivement. Mélanger deux modèles d'embeddings produit des espaces vectoriels incomparables → matching impossible.

> Si RGPD data residency EU devient critère dur (partenariats médias institutionnels) : basculer sur **Mistral Large** (génération) + **Mistral Small** (modération). Qualité comparable, hébergement France.

### Pipeline IA (Supabase Edge Functions)

```
Module A — Vulgarisation loi
  Input : texte brut loi (API NosDéputés.fr)
  Output : bills.summary_pros / bills.summary_cons / bills.daily_life_impact
  Modèle : Claude Sonnet
  Validation : éditoriale obligatoire avant publication

Module B — Matching sémantique
  Input : texte vote + promesses du député
  Process : Mistral embed → vecteurs → similarité cosinus (pgvector)
  Output : votes.promise_id + votes.authenticity_state
  Modèle : Mistral embed

Module C — Détection catimini
  Input : flux RSS + nb amendements + durée débats
  Output : bills.is_radar_alert = true → push immédiat
  Modèle : Claude Sonnet

Module D — Modération commentaires
  Input : commentaire Baromètre (280 chars max)
  Output : approved | rejected + message pédagogique
  Modèle : Claude Haiku
  Latence cible : <500ms
```

### Coûts IA à l'échelle

| Usage | Coût mensuel à 10M MAU |
|-------|------------------------|
| Vulgarisation lois (~20 lois/mois, Claude Sonnet) | ~$7 |
| Résumés positions (577 députés, mensuel) | ~$30 |
| Modération commentaires (Claude Haiku, 10M/mois) | ~$250 |
| Embeddings Mistral (nouvelles promesses) | ~$10 |
| **Total IA à 10M MAU** | **~$300/mois** |

**L'IA scale avec le contenu traité, pas avec les MAU. Coût négligeable à toute échelle.**

---

## 7. Embeddings & pgvector

### Index HNSW — obligatoire dès la création du schéma

Créer l'index après coup sur 100K+ lignes = opération longue et bloquante.

```sql
CREATE INDEX ON promise_embeddings
USING hnsw (vector vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

| Index | Latence | vs référence |
|-------|---------|-------------|
| HNSW | ~1.5ms | Référence |
| IVFFlat | ~2.4ms | 1.6× plus lent |
| Scan séquentiel | ~650ms | **5250× plus lent** |

VoxScore ne dépassera pas ~100K vecteurs sur 5 ans. HNSW est suffisant sur toute la roadmap.

---

## 8. Cache — Upstash Redis (dès V1)

**Upstash Redis** : serverless, pay-per-request, compatible Supabase Edge Functions.

| Usage | Mécanisme Redis | Pourquoi pas PostgreSQL |
|-------|----------------|------------------------|
| Buffer votes Baromètre | `INCR` atomique → flush PG toutes 5s | PG ne tient pas 1M INSERTs/min |
| Rate limiting (5 votes/24h) | `EXPIRE 86400` natif | Plus rapide qu'un `SELECT COUNT` |
| Cache scores d'authenticité | Clé `score:deputy:{id}` TTL 24h | Recalcul nocturne, lu des milliers de fois/jour |

### Design write-buffer Baromètre

```
Vote user → Redis INCR (atomique, <1ms)
          → batch flush → PostgreSQL toutes 5s
          → barometer_snapshots (lecture widget)
```

La contrainte UNIQUE `(user_id, bill_id)` reste en PostgreSQL pour l'idempotence.

---

## 9. Push Notifications — OneSignal (dès V1)

**Expo Push Notifications = 600 notifs/sec (hard limit).**
Broadcast `is_radar_alert` à 5M users = **2h20 pour envoyer toutes les notifs.** Inacceptable.

**→ OneSignal dès V1. Expo Push uniquement pour les tests MVP locaux.**

| Option | Débit max | Segmentation | Coût 10M devices |
|--------|-----------|-------------|-----------------|
| Expo Push | **600/sec ❌** | Aucune | Inutilisable |
| **OneSignal** | Millions/sec | ✅ Tags avancés | ~$1–5K/mois Enterprise |
| FCM direct | Illimité | Manuel (custom) | Gratuit |

OneSignal couvre tous les besoins VoxScore : segments "par député suivi", "par thème", broadcast catimini, analytics, A/B testing titres.

**Tokens stockés dans la table `push_tokens`.**

**Types d'alertes (V1) :**
- Vote d'un député suivi → deep link `/depute/[id]`
- Score d'Authenticité mis à jour → deep link fiche député
- Loi sur un thème suivi en débat
- Alerte catimini (`is_radar_alert = true`) → push à tous les utilisateurs actifs

---

## 10. Realtime — Baromètre Citoyen

Lors d'un vote polémique, 500K+ utilisateurs regardent le Baromètre simultanément. Les limites de connexions Supabase Realtime ne sont pas publiées — négociation manuelle au-delà de ~200K concurrent.

| Option | Connexions | Garantie livraison | Coût ~1M conn | Latence |
|--------|-----------|-------------------|--------------|---------|
| Supabase Realtime (Phase 1) | Limité, deal custom | At-most-once | Négocié | ~50ms |
| **Ably (Phase 2)** | Illimitées (edge global) | **Exactly-once ✅** | ~$1,500/mois | ~20ms |

**Ably est le seul candidat avec exactly-once delivery** — un vote comptabilisé deux fois compromet l'intégrité du Baromètre citoyen.

---

## 11. Authentification — Trust Ladder

| Niveau | Nom | Débloque | Comment |
|---|---|---|---|
| 0 | Guest | Lecture seule | Aucune inscription |
| 1 | Email vérifié | Suivre un député, alertes push | Clic lien email |
| 2 | OTP téléphone | Voter au Baromètre | SMS — 1 numéro = 1 compte max |
| 3 | Identité civile | Signer une pétition | Prénom + Nom + Code postal |

**Fournisseur :** Supabase Auth avec Twilio pour les SMS OTP (Phase 1).

**Anti-manipulation :**
- 1 numéro de téléphone = 1 compte (bloqué silencieusement)
- Rate limiting : 5 votes Baromètre / 24h
- Quarantaine 24h pour les nouveaux comptes (trust_score faible)
- Détection pic anormal → alerte admin + gel temporaire

**MVP :** Baromètre en **mode démo** — votes non persistés (`is_demo: true`), bandeau "Mode aperçu". Auth complète en V1.

### Évolution auth par phase

- **Phase 1 :** Supabase Auth — zéro config, Trust Ladder N0→N3 natif
- **Phase 2 :** Supabase self-hosted — **même API TypeScript, zéro réécriture**, coût fixe ~$500/mois
- **Phase 3 :** Auth.js + Vonage direct — contrôle total, coût SMS à la pièce

---

## 12. State Management & Data Fetching

### Principe de séparation

| Responsabilité | Solution | Exemples VoxScore |
|---|---|---|
| État local app | **Zustand 5.x** | Session utilisateur, trust level, députés favoris, préférences notifications, état UI |
| Données serveur | **TanStack Query 5.x** | Fiches députés, lois, résultats Baromètre, Score d'Authenticité |
| Thème light/dark | Context API (existant) | `useTheme()` — déjà en place |

### Zustand — état local

- Middleware `persist` activé pour : session utilisateur, favoris, préférences → survie à la fermeture de l'app
- Un store par domaine : `useAuthStore`, `useFavoritesStore`, `usePrefsStore`
- Chaque composant s'abonne uniquement à la tranche dont il a besoin → pas de re-renders inutiles

```typescript
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      trustLevel: 0,
      setUser: (user) => set({ user, trustLevel: user.trust_level }),
      logout: () => set({ user: null, trustLevel: 0 }),
    }),
    { name: 'auth-storage' }
  )
)
```

### TanStack Query — stratégie "Stale-While-Revalidate"

**Version :** 5.x + `@tanstack/react-query-persist-client` (cache persistant entre sessions)

**Mode Cache (données lentes) :**

```typescript
const { data: deputy } = useQuery({
  queryKey: ['depute', id],
  queryFn: () => supabase.from('politicians').select('*').eq('id', id).single(),
  staleTime: 30 * 60 * 1000,  // données fraîches 30 min
  gcTime: 24 * 60 * 60 * 1000, // gardées en cache 24h
})
```

**Mode Full Online (Supabase Realtime) :**

```typescript
const channel = supabase
  .channel('barometer')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'citizen_barometer' },
    (payload) => queryClient.invalidateQueries({ queryKey: ['barometer', billId] })
  )
  .subscribe()
```

**Cache persistant entre sessions** via `MMKV` (stockage natif ultra-rapide) :

```typescript
import { MMKV } from 'react-native-mmkv'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
```

| Donnée | Stratégie | staleTime | Persistance |
|---|---|---|---|
| Profil député | Stale-While-Revalidate | 30 min | ✅ MMKV |
| Score d'Authenticité | Stale-While-Revalidate | 30 min | ✅ MMKV |
| Liste lois | Stale-While-Revalidate | 15 min | ✅ MMKV |
| Baromètre | Full Online + Realtime | 0 | ❌ toujours frais |
| Pétitions | Full Online + Realtime | 0 | ❌ toujours frais |

---

## 13. Web & Widget

| Composant | Solution |
|---|---|
| Landing page GCB + `/methodologie` | Next.js sur Vercel (plan hobby gratuit) |
| Widget Baromètre embarquable (V2) | `<iframe>` servi depuis Vercel, Supabase Realtime |
| Metadata Open Graph (partages X/LinkedIn) | Vercel OG (satori) — génération PNG server-side |
| CDN snapshots (Phase 2) | Cloudflare pour `barometer_snapshots` widget |

---

## 14. Analytics — PostHog EU Frankfurt (dès MVP)

RGPD-compliant natif (hébergement EU), gratuit < 1M events.

Métriques prioritaires :
- Funnel Trust Ladder N0→N2 (taux de conversion au vote Baromètre)
- Rétention J7 / J30
- Heatmap écrans swipe Traducteur de loi
- Taux d'ouverture push catimini

---

## 15. Error Tracking — Sentry

- **Package :** `@sentry/react-native` — ⚠️ ne pas utiliser `sentry-expo` (déprécié depuis Sentry SDK 5.16.0)
- **Plan :** Gratuit — 5 000 erreurs/mois (suffisant pour le MVP et la V1)
- **Setup :** `npx @sentry/wizard -s -i reactNative` (15 min de configuration)

```typescript
import * as Sentry from "@sentry/react-native"

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",
  // RGPD — ne jamais envoyer l'email utilisateur
  beforeSend: (event) => {
    if (event.user) delete event.user.email
    return event
  },
  enabled: !__DEV__,
})
```

---

## 16. Environnements — Méthode "2 Projets Cloud"

Aucun outil local (pas de Supabase CLI, pas de Docker). Tout se gère via l'interface web Supabase.

| Environnement | Projet Supabase | Usage |
|---|---|---|
| **Dev** | `VoxScore - DEV` (Supabase cloud) | Développement, tests, faux députés, expérimentations schéma |
| **Prod** | `VoxScore - PROD` (Supabase cloud) | Application live — créé uniquement au moment du lancement App Store |

### Workflow au quotidien

1. Tout le développement se fait contre `VoxScore - DEV` via l'interface web Supabase
2. Le code Expo sur la machine pointe vers les clés du projet DEV
3. Liberté totale : supprimer des colonnes, tester des requêtes IA, ajouter de faux députés — sans risque

### Migration DEV → PROD au lancement

1. Ouvrir `VoxScore - DEV` → **SQL Editor** → exporter la structure des tables (schéma SQL)
2. Créer `VoxScore - PROD` sur Supabase.com (**région EU Frankfurt obligatoire**)
3. Coller le SQL dans le SQL Editor de PROD → base propre et vide
4. Mettre à jour les variables d'environnement Expo pour pointer vers PROD

### Variables d'environnement

```bash
# .env.local (dev — jamais commité)
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Prod — injectées via EAS Secrets (jamais dans le code)
EXPO_PUBLIC_SUPABASE_URL=https://yyy.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJyyy...
```

---

## 17. Stores & Distribution

- **iOS App Store** : $99/an — soumettre en **premier** (délai review 1–7j, contenu politique scruté)
- **Google Play** : $25 one-time — 24h après validation Apple
- **OTA updates** : Expo Updates — corrections JS sans repasser en review (critique pour erreurs factuelles)
- **CI/CD builds** : EAS Build + EAS Submit

**Vigilance Apple :** Insister dans la description store sur la neutralité éditoriale, la méthodologie publique et le mécanisme de contestation des scores pour éviter un refus lié au contenu politique.

---

## 18. Décisions non-négociables dès Phase 1

Ces choix coûtent zéro maintenant — ils évitent une réécriture en Phase 2.

1. **Repository pattern** — jamais d'appel Supabase direct dans les composants
2. **Index HNSW pgvector** — créer à la création du schéma, pas après
3. **Supabase région EU Frankfurt** — non modifiable après création
4. **OneSignal dès V1** — ne jamais déployer Expo Push en production
5. **Design write-buffer Baromètre** — Redis INCR → flush PostgreSQL toutes les 5 secondes, contrainte UNIQUE en PG

---

## 19. Décisions en attente

| # | Sujet | Options | Impact |
|---|---|---|---|
| ~~1~~ | ~~**State management**~~ | ✅ **Zustand 5.x + TanStack Query 5.x** | Décidé |
| ~~2~~ | ~~**Data fetching & cache**~~ | ✅ **TanStack Query 5.x — SWR + Supabase Realtime** | Décidé |
| ~~3~~ | ~~**Environnements**~~ | ✅ **2 projets Supabase cloud** | Décidé |
| ~~4~~ | ~~**Error tracking**~~ | ✅ **Sentry — `@sentry/react-native`** | Décidé |
| ~~5~~ | ~~**CI/CD**~~ | ✅ **EAS Build + EAS Submit** | Décidé |
| ~~6~~ | ~~**Typographie**~~ | ✅ **DM Sans** | Décidé |
| 7 | **Analytics** | ✅ PostHog EU Frankfurt (à configurer) | Faible (MVP) |
| 8 | **Tests** | Jest (unit) + Detox (E2E) / rien au MVP | Faible (MVP) |

---

## 20. Coûts d'infrastructure à l'échelle

| Phase | Infra (hors IA) | IA | Total |
|-------|----------------|-----|-------|
| MVP | ~0€ (free tiers) | <$5 | **~0€** |
| V1 — 50K DAU | ~$80/mois | ~$15 | **~$95/mois** |
| 500K MAU | ~$1,500/mois | ~$100 | **~$1,600/mois** |
| 2M MAU (Phase 2) | ~$3,000/mois | ~$200 | **~$3,200/mois** |
| 10M MAU (Phase 3) | ~$8,000/mois | ~$300 | **~$8,300/mois** |

L'IA représente moins de 4% du coût total à toutes les phases.

---

*VoxScore — Architecture Technique — Game Changer Builds — Mars 2026*
