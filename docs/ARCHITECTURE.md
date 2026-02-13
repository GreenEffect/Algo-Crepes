# 🧱 Architecture du projet

## Vue d’ensemble

Le projet suit une séparation simple :

- `src` → logique métier
- `demo` → interface utilisateur
- `assets` → styles et scripts UI
- `data` → configuration et traductions

## Objectif

Permettre de comprendre :

- la séparation des responsabilités
- la modularité
- la réutilisation du code métier sans UI

## Diagramme simplifié

Interface → appelle → CrepesRecipe
CrepesRecipe → charge → traductions
CrepesRecipe → produit → logs / statut

## Pourquoi sans build ?

Pour réduire la friction d’apprentissage et permettre
un déploiement immédiat sur n’importe quel hébergement.
