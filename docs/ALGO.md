# 🥞 Algo-Crêpes — Pseudo-code

> Document pédagogique · Situation intermédiaire entre le contexte et le code  
> [github.com/GreenEffect/Algo-Crepes](https://github.com/GreenEffect/Algo-Crepes)

---

## 1. Les données (variables & constantes)

Avant de faire quoi que ce soit, on définit les ingrédients et leurs quantités. En programmation, on appelle cela des **variables** — des cases mémoire avec un nom et une valeur.

```
CONSTANTE ingredients = {
    farine  : { quantite: 375, unite: 'grammes', obligatoire: VRAI }
    sucre   : { quantite:  75, unite: 'grammes', obligatoire: FAUX }
    beurre  : { quantite:  90, unite: 'grammes', obligatoire: FAUX }
    lait    : { quantite:   1, unite: 'litre',   obligatoire: VRAI }
    sel     : { quantite:   2, unite: 'pincées', obligatoire: VRAI }
    oeuf    : { quantite:   6, unite: 'unités',  obligatoire: VRAI }
}
```

→ Chaque ingrédient a trois propriétés : sa quantité, son unité de mesure, et s'il est obligatoire (`VRAI`) ou facultatif (`FAUX`). Ce booléen guidera la logique de validation.

---

## 2. Vérification des ingrédients (conditions)

Avant de cuisiner, on vérifie si on a tout ce qu'il faut. La structure **SI / SINON SI / SINON** représente des embranchements : selon la situation, le programme prend un chemin différent.

```
FONCTION verifierIngredient(nom, quantiteDisponible) :

    ingredientRef = ingredients[nom]

    SI quantiteDisponible == ingredientRef.quantite ALORS
        RETOURNER 'parfait'

    SINON SI quantiteDisponible < ingredientRef.quantite ALORS
        RETOURNER 'insuffisant'

    SINON
        RETOURNER 'excès'

FIN FONCTION
```

→ Une **fonction** est un bloc de code réutilisable. On lui donne des informations en entrée (ici : le nom et la quantité), et elle produit un résultat en sortie (ici : un statut).

---

## 3. Algorithme principal : faire les crêpes

La fonction principale orchestre tout : elle parcourt les ingrédients un par un, vérifie chacun, et décide si les crêpes peuvent être faites — et comment elles seront.

```
FONCTION faireCrepes(stockDisponible) :

    logs = []               // liste vide pour stocker les messages
    crepesPossibles = VRAI  // on suppose que c'est possible
    crepesDelicieuses = VRAI

    // ── ÉTAPE 1 : parcourir chaque ingrédient ──────────────
    POUR CHAQUE (nom, stock) DANS stockDisponible :

        statut = verifierIngredient(nom, stock)
        ref = ingredients[nom]

        SI statut == 'parfait' ALORS
            ajouter 'OK : ' + nom + ' → parfait !' dans logs

        SINON SI statut == 'insuffisant' ET ref.obligatoire == VRAI ALORS
            ajouter 'ERREUR : ' + nom + ' manquant !' dans logs
            crepesPossibles = FAUX
            crepesDelicieuses = FAUX

        SINON SI statut == 'insuffisant' ET ref.obligatoire == FAUX ALORS
            ajouter 'ATTENTION : ' + nom + ' insuffisant' dans logs
            crepesDelicieuses = FAUX

        SINON SI statut == 'excès' ALORS
            ajouter 'INFO : ' + nom + ' en excès' dans logs

    FIN POUR

    // ── ÉTAPE 2 : évaluation du résultat ──────────────────
    SI crepesPossibles == FAUX ALORS
        ajouter 'Sans ingrédient obligatoire → pas de crêpes !' dans logs
        RETOURNER FAUX

    SINON SI crepesDelicieuses == VRAI ALORS
        ajouter '🥞 Parfait ! Vos crêpes seront délicieuses !' dans logs
        RETOURNER VRAI

    SINON
        ajouter '🥞 Crêpes possibles mais moins savoureuses.' dans logs
        RETOURNER VRAI

FIN FONCTION
```

---

## 4. Utilisation du programme (appel)

Pour lancer le programme, on lui fournit le stock disponible et on observe le résultat. C'est ce qu'on appelle **"appeler"** une fonction.

```
// Exemple d'appel avec un stock complet et correct
monStock = {
    farine: 375,  sucre: 75,  beurre: 90,
    lait: 1,      sel: 2,     oeuf: 6
}

resultat = faireCrepes(monStock)

// Afficher chaque message produit par l'algorithme
POUR CHAQUE message DANS logs :
    AFFICHER message
FIN POUR

AFFICHER 'Succès : ' + resultat   // → Succès : VRAI
```

---

## 5. Règles métier (logique issue du contexte)

Ces règles traduisent directement le document de contexte (la recette PDF) en conditions algorithmiques :

| | Situation | Conséquence algorithmique |
|---|---|---|
| ❌ | Sans farine | `crepesPossibles = FAUX` → la fonction retourne `FAUX` |
| ❌ | Sans lait | `crepesPossibles = FAUX` → la fonction retourne `FAUX` |
| ❌ | Sans œufs | `crepesPossibles = FAUX` → la fonction retourne `FAUX` |
| ⚠️ | Sans sucre | crêpes possibles mais `crepesDelicieuses = FAUX` |
| ⚠️ | Sans beurre | crêpes possibles mais `crepesDelicieuses = FAUX` |
| ✅ | Tout parfait | `crepesDelicieuses = VRAI` → résultat optimal |

---

## 6. Concepts algorithmiques illustrés

| Concept | Application dans le projet Algo-Crêpes |
|---|---|
| **Variable** | `ingredients` stocke tous les paramètres de la recette |
| **Booléen** | `obligatoire = VRAI / FAUX` ; `crepesPossibles` ; `crepesDelicieuses` |
| **Condition (SI)** | Distinguer les ingrédients manquants, insuffisants, ou en excès |
| **Boucle (POUR CHAQUE)** | Parcourir automatiquement tous les ingrédients du stock |
| **Fonction** | `verifierIngredient` et `faireCrepes` → blocs réutilisables |
| **Valeur de retour** | La fonction renvoie `VRAI` ou `FAUX` pour indiquer le succès |
| **Log / trace** | Chaque étape produit un message lisible par l'utilisateur |