## ADDED Requirements

### Requirement: promise_embeddings table stores Mistral vectors with HNSW index
La table `promise_embeddings` SHALL stocker les vecteurs Mistral embed (dimension 1024) avec un index HNSW créé à la création du schéma — avant toute insertion de données.

#### Scenario: Extension pgvector is enabled before table creation
- **WHEN** le script SQL est exécuté
- **THEN** `CREATE EXTENSION IF NOT EXISTS vector` précède la création de la table

#### Scenario: Vector dimension is fixed at 1024
- **WHEN** un embedding est inséré
- **THEN** la colonne `vector(1024)` rejette tout vecteur d'une dimension différente

#### Scenario: HNSW index exists before data insertion
- **WHEN** le schéma est créé
- **THEN** l'index HNSW avec `vector_cosine_ops`, `m=16`, `ef_construction=64` est présent sur la colonne `vector`

#### Scenario: Cosine similarity search returns nearest promises
- **WHEN** une requête de matching sémantique est exécutée avec `<=>` (cosine distance)
- **THEN** l'index HNSW est utilisé et la latence est inférieure à 5ms pour <100K vecteurs
