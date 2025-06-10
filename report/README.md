# Plate Palace Portal - Rapport de Stage

Ce dossier contient le rapport de stage pour le projet "Plate Palace Portal", une application web de gestion de menu pour restaurants.

## Structure du Rapport

Le rapport est structuré en quatre chapitres principaux:

1. **L'Entreprise d'Accueil**
   - Présentation de l'entreprise
   - Secteur d'activité
   - Organisation et structure
   - Culture d'entreprise

2. **Cahier des Charges**
   - Contexte du projet
   - Besoins fonctionnels
   - Besoins non fonctionnels
   - Contraintes techniques

3. **Conception et Modélisation**
   - Architecture globale
   - Diagrammes UML
   - Modélisation de la base de données
   - Maquettes d'interface

4. **Développement et Réalisation**
   - Environnement de développement
   - Technologies utilisées
   - Architecture du code
   - Fonctionnalités implémentées
   - Tests et qualité du code
   - Captures d'écran de l'application

## Compilation du Rapport

Le rapport est écrit en LaTeX. Pour le compiler:

```bash
cd report
pdflatex -shell-escape report_outline.tex
```

Note: L'option `-shell-escape` est nécessaire pour le package `minted` qui est utilisé pour la coloration syntaxique du code.

## Technologies Utilisées dans le Projet

- **Frontend**:
  - React 18
  - TypeScript
  - React Router
  - React Query
  - Tailwind CSS
  - shadcn/ui

- **Backend**:
  - Supabase
  - PostgreSQL

- **Outils de Développement**:
  - Vite
  - Vitest
  - Git
  - Visual Studio Code

## Tests

Des tests unitaires ont été implémentés pour assurer la fiabilité du code:
- Tests des composants UI avec React Testing Library
- Tests des hooks personnalisés
- Tests d'intégration pour les fonctionnalités principales 