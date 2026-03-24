# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VoxScore** is a civic-tech React Native (Expo) mobile app tracking French deputies' voting records against their campaign promises, generating authenticity scores (0-100%), and enabling citizen participation via a real-time barometer and native petitions. V1 covers the 577 National Assembly deputies.

Full product requirements are in `VoxScore_PRD_v2.md` — consult it before adding features.

## Tech Stack

- **Frontend:** React Native 0.83 + Expo SDK 55, expo-router — iOS + Android (both stores)
- **Animations:** react-native-reanimated **4.1.5** (minimum requis pour RN 0.83 — ne pas utiliser 4.0.x)
- **Architecture:** New Architecture activée par défaut (Expo SDK 53+) — Legacy Architecture supprimée depuis RN 0.82
- **Backend:** Supabase (PostgreSQL + pgvector + Realtime + Auth OTP)
- **AI generation:** Anthropic Claude Sonnet — law summarization, résumé positions, petition generation
- **AI moderation:** Anthropic Claude Haiku — barometer comment moderation
- **Embeddings:** Mistral embed + pgvector — semantic promise↔vote matching (French-first model)
- **Push notifications:** Expo Push Notifications (MVP) → OneSignal (V1)
- **Story images:** react-native-view-shot — client-side "Choc" image generation
- **Web / Widget:** Next.js on Vercel — landing page, /methodologie, embeddable widget (V2)
- **State management:** Zustand 5.x (session, favoris, prefs) + TanStack Query 5.x (données Supabase)
- **Graphics:** react-native-svg, expo-linear-gradient
- **Icons:** lucide-react-native

## Animations — Points de vigilance

- Toujours utiliser `react-native-reanimated` **4.1.5** — incompatible avec RN 0.83 en dessous de 4.1.0
- Des régressions de performance sont connues sur la New Architecture (Expo SDK 53+). Activer obligatoirement dans `app.json` :

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

- Ne jamais désactiver la New Architecture (`newArchEnabled=false`) — elle est obligatoire depuis RN 0.82
- En cas de conflit de version Reanimated dans les dépendances, forcer via `overrides` dans `package.json` :

```json
"overrides": {
  "react-native-reanimated": "4.1.5"
}
```

## Commands

No package.json at the root yet — components are being built ahead of Expo project scaffolding. Expected once bootstrapped:

```bash
npx expo start          # Dev server
npx expo run:ios        # iOS build
npx expo run:android    # Android build
npx tsc --noEmit        # Type check
```

## Architecture

### Component Patterns

- All components are functional with `useTheme()` for light/dark colors — never hardcode colors
- Navigation via `useRouter()` from expo-router; deep links: `/depute/${id}`, `/loi/${id}`
- All styles via `StyleSheet.create()`; theme colors injected at render time
- Props typed via TypeScript interfaces; centralized types in `@/types/database`

### Design System

`colors.ts` is the single source of truth:
- **Semantic states:** `kept` (#00C87A), `broken` (#FF3355), `partial` (#FF8C00), `absent` (#A0AEC0)
- **Brand:** primary #FF3870, accent #FF9A00
- **Party colors** keyed by acronym (RE, RN, LFI, LR, PS, EELV)
- `design-tokens.json` mirrors these for external tooling

### Database (Supabase)

Core tables: `politicians`, `parties`, `bills`, `promises`, `votes`, `promise_embeddings` (pgvector), `citizen_barometer`, `barometer_snapshots`, `petitions`, `users`, `push_tokens`, `score_disputes`.

Vote authenticity states: `respected` | `broken` | `partial` | `absent`.

### Key Business Rules

- Authenticity scores are **frozen 6 weeks before elections**
- Anti-manipulation: 1 phone = 1 account, 5 votes/24h, 24h quarantine for new accounts
- All promises require a source URL
- RGPD Art. 9 compliance for personal data; data under ODbL license with NosDéputés.fr attribution


Utilise toujours context7 lorsque j'ai besoin de génération de code, d'étapes de configuration ou d'installation, ou de documentation de bibliothèque/API. Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation de bibliothèque sans que j'aie à le demander explicitement.