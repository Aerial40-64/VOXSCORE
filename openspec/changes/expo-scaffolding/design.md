## Context

Le dépôt contient des composants React Native isolés, un design system (`colors.ts`, `design-tokens.json`), et une documentation complète (PRD, ARCHITECTURE.md) — mais aucun projet Expo initialisé. Le stack est entièrement décidé (voir ARCHITECTURE.md) : Expo SDK 55, RN 0.83, New Architecture, expo-router, Reanimated 4.1.5, Zustand 5.x, TanStack Query 5.x.

Contrainte solo-dev : la configuration doit être minimale en surface mais correcte dès le départ — chaque mauvais choix de scaffolding coûte cher à défaire (structure de dossiers, aliases, New Architecture).

## Goals / Non-Goals

**Goals:**
- Projet Expo fonctionnel (`npx expo start` qui tourne)
- New Architecture activée avec config expo-build-properties anti-régression Reanimated
- Structure de dossiers pérenne (app/, components/, services/, stores/, types/, constants/)
- ThemeProvider + useTheme opérationnels, colors.ts intégré
- Path alias `@/` configuré (tsconfig + babel)
- Sentry initialisé avec conformité RGPD
- EAS Build configuré (3 profils : development, preview, production)
- Composants existants migrés dans `components/`

**Non-Goals:**
- Connexion Supabase (change séparé)
- Stores Zustand (change séparé)
- Écrans produit (change séparé)
- Tests (hors MVP)

## Decisions

### D1 — `npx create-expo-app` vs scaffolding manuel

**Choix : scaffolding manuel** (Write des fichiers clés, pas de template CLI).

`create-expo-app` génère du boilerplate (tabs template, assets inutiles, exemples) qui devra être supprimé. Scaffolding manuel = structure exactement voulue, zéro nettoyage.

Alternatives : template `blank-typescript` — trop minimal, n'inclut pas expo-router configuré.

### D2 — Structure de dossiers

```
/
├── app/                    # expo-router — routes file-based
│   ├── _layout.tsx         # Root layout (ThemeProvider, Sentry, QueryClient)
│   ├── (tabs)/             # Bottom tab navigator
│   │   ├── _layout.tsx
│   │   ├── index.tsx       # Onglet Accueil
│   │   ├── radar.tsx       # Onglet VoxScope (Radar)
│   │   ├── engagements.tsx # Onglet Engagements
│   │   └── profil.tsx      # Onglet Mon Profil
│   ├── depute/
│   │   └── [id].tsx        # Deep link /depute/:id
│   └── loi/
│       └── [id].tsx        # Deep link /loi/:id
├── components/             # Composants réutilisables (existants migrés ici)
├── services/               # Repository pattern — jamais d'appel Supabase direct
├── stores/                 # Zustand stores
├── types/                  # TypeScript interfaces (database, navigation)
├── constants/              # colors.ts, design-tokens, config
└── hooks/                  # useTheme, hooks custom
```

### D3 — ThemeProvider : Context API vs Zustand

**Choix : Context API** pour le thème (comme spécifié dans ARCHITECTURE.md).

Le thème est lu à chaque render de chaque composant → React Context est le bon outil (subscription automatique). Zustand est réservé à l'état métier (session, favoris, prefs).

### D4 — Sentry : initialisation dans `_layout.tsx`

Sentry s'initialise une seule fois au démarrage de l'app, dans le root layout. Le `beforeSend` supprime `event.user.email` (RGPD Art. 9). `enabled: !__DEV__` évite les faux positifs en développement.

### D5 — Reanimated 4.1.5 : protection via `overrides`

Certaines dépendances transitives peuvent tirer Reanimated 4.0.x. Le champ `overrides` dans `package.json` force la version 4.1.5 quelle que soit la résolution npm. Sans ça, crash garanti sur RN 0.83.

## Risks / Trade-offs

- **[Risque] Composants existants cassés après migration dans `components/`** → Vérifier les imports relatifs après déplacement. Les composants utilisent `useTheme()` qui n'existera qu'après le scaffolding — ils pourront compiler correctement.

- **[Risque] expo-router version bundlée dans SDK 55 pas documentée explicitement** → Utiliser `expo install expo-router` pour garantir la version compatible SDK 55, pas `npm install`.

- **[Risque] New Architecture + Reanimated : régressions de performance** → Config `reactNativeReleaseLevel: "experimental"` dans expo-build-properties obligatoire. Documenté dans ARCHITECTURE.md et CLAUDE.md.

- **[Trade-off] Scaffolding manuel = plus long mais plus propre** → Accepté. Zéro boilerplate à nettoyer, structure exacte dès le départ.

## Migration Plan

1. Créer `package.json` (avec overrides Reanimated)
2. Créer `app.json` (New Architecture + expo-build-properties)
3. Créer `tsconfig.json` (path alias `@/`)
4. Créer `babel.config.js` (module-resolver pour `@/`)
5. Créer `eas.json` (3 profils)
6. Créer structure de dossiers (`app/`, `components/`, etc.)
7. Implémenter ThemeProvider + useTheme dans `hooks/`
8. Créer root layout `app/_layout.tsx` (Sentry + QueryClient + ThemeProvider)
9. Créer tab layout `app/(tabs)/_layout.tsx`
10. Créer écrans placeholder (4 onglets + 2 deep links)
11. Migrer composants existants dans `components/`
12. Vérifier `npx expo start` fonctionnel

Rollback : le projet n'existant pas encore, pas de rollback nécessaire — tout est additionnel.

## Open Questions

- Aucune — stack entièrement décidé dans ARCHITECTURE.md.
