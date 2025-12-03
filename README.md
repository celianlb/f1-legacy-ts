# Backend F1 – Code Legacy à Auditer & Refactorer

## 🏎 Contexte

Un client vous confie un **backend F1** qui "fonctionne", mais dont le code est devenu
très difficile à maintenir.

- Tout est dans un seul gros fichier.
- Les responsabilités sont mélangées.
- Il y a des `if` / `switch` partout.
- Aucun pattern n'est appliqué.
- Les principes SOLID ne sont pas respectés.

Votre mission : intervenir **comme des consultants**.

---

## 🎯 Objectifs

1. **Analyser** le code existant
2. **Identifier** les problèmes (code smells, violations SOLID, anti-patterns)
3. **Proposer** un plan de refactor (avec patterns)
4. **Refactorer** le code (au moins une partie significative)
5. **Documenter** vos choix (avant / après)

---

## 📝 Livrables attendus

### 1. Rapport d'audit (format libre, Markdown recommandé)

- Liste des **code smells** repérés (avec exemples)
- Violations **SOLID** (expliquez lesquelles et pourquoi)
- Risques si on laisse le code en l'état
- Idées d'amélioration globales (architecture, patterns, etc.)

### 2. Plan de refactor

- Quelles parties du code vous modifiez en priorité (Quick Wins)
- Quels **design patterns** vous comptez appliquer et où :
  - Strategy
  - Observer
  - Adapter
  - Factory Method
  - Decorator (bonus)
- Comment vous allez structurer le projet (dossiers, classes, etc.)

### 3. Code refactoré

- Nouveau code plus propre, typé, organisé
- Patterns réellement implémentés
- Pas nécessaire de tout refaire : concentrez-vous sur ce qui est le plus critique / le plus sale

### 4. Petit README final

- Comment est structuré le projet après refactor
- Quels patterns sont utilisés et pourquoi
- Ce que vous feriez en plus si vous aviez plus de temps

---

## 🔍 Ce que fait le code actuel (en gros)

- Déclare quelques équipes et pilotes
- Simule un mini Grand Prix (quelques tours)
- Gère des événements :
  - `lapCompleted`
  - `pitStop`
  - `overtake`
  - `penalty`
  - `dnf` (abandon)
- Loggue et "notifie" différemment selon l'équipe

Tout est géré dans un seul fichier : `src/legacyRaceSystem.ts`.

---

## 🧨 Votre mission

1. **Lisez et exécutez** `legacyRaceSystem.ts` (il doit s'exécuter avec `ts-node` ou `tsx` après installation de TypeScript).
2. Notez **tout ce qui vous choque** dans le code.
3. Écrivez un **rapport d'audit**.
4. Créez une nouvelle structure de projet (par exemple) :

```text
src/
  domain/
  events/
  listeners/
  notifications/
  external/
  ...
```

5. Refactorez progressivement en appliquant des patterns et SOLID.

---

## 💡 Pistes de patterns (non exhaustif)

- Remplacer les gros `if` / `switch` sur les types d'événements → **Observer / Strategy**
- Isoler le style de message selon l’équipe → **Strategy**
- Encapsuler le faux service externe de "highlights" → **Adapter**
- Créer des objets `RaceEvent` selon le type → **Factory Method**
- Ajouter des décorateurs sur les logs → **Decorator**

À vous de jouer. Le but n’est pas d’avoir LA solution parfaite,
mais d’apprendre à **penser comme un consultant** face à un vrai projet legacy.
