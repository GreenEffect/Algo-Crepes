// Ordre dans lequel les ingrédients seront traités
const _ordre = [
    'farine', 'sel', 'sucre', 'oeuf', 'beurre', 'lait'
];

// Ingrédients et leur quantité nécessaires à la recette
const _ingredients_recette = {
    'farine': {
        'stop': true,          // si pas la valeur, on arrête ou pas la recette ?
        'valeur': 375,         // valeur requise
        'unite': 'gramme',     // unité de valeur
    },
    'sucre': {
        'stop': false,
        'valeur': 75,
        'unite': 'gramme',
    },
    'beurre': {
        'stop': false,
        'valeur': 90,
        'unite': 'gramme',
    },
    'lait': {
        'stop': true,
        'valeur': 1,
        'unite': 'litre',
    },
    'sel': {
        'stop': false,
        'valeur': 2,
        'unite': 'pincée',
    },
    'oeuf': {
        'stop': true,
        'valeur': 6,
        'unite': 'unité',
    },
};

// Quantité sous la main des ingrédients nécessaires à la réalisation de la recette
const _ingredients_sous_la_main = {
    'farine': 375,
    'sucre': 75,
    'beurre': 90,
    'lait': 1,
    'sel': 2,
    'oeuf': 6,
};

// Si, à terme, on veut gérer du multilingue, Cf lang
const _labels = {
    'FR': {
        'miam': 'À table !',
        'depart': 'C\'est parti pour les crêpes !',
        'cuisson': 'On fait cuire les crêpes.',
        'trop': '(Vous en avez mis ## en trop)',
        'pas_assez': '(Il vous en manque ##)',
        'pbs_oeuf': 'Problème de quantité d\'œufs, pas de crêpes !',
        'pbs_lait': 'Problème de quantité de lait, pas de crêpes !',
        'pbs_farine': 'Problème de quantité de farine, pas de crêpes !',
        'pbs_sel': 'Problème de quantité de sel ! On croise les doigts pour que ce ne soit pas trop beurk !',
        'pbs_sucre': 'Problème de quantité de sucre, ce sera moins bon...',
        'pbs_beurre': 'Problème de quantité de beurre, ce sera moins bon...',
        'ajout_farine': 'On ajoute la farine.',
        'ajout_sel': 'On ajoute le sel.',
        'ajout_sucre': 'On ajoute le sucre.',
        'ajout_oeuf': 'On ajoute les œufs.',
        'ajout_beurre': 'On fait fondre le beurre et on ajoute ça à la préparation.',
        'ajout_lait': 'On ajoute le lait.',
    },
};

// Si, à terme, on veut gérer du multilingue, Cf _labels
const lang = 'FR';

/**
 * La quantité disponible de l'ingrédient correspond-il aux besoins de la recette ?
 * @param {string} ingredient Ingrédient concerné
 * @return {boolean} true: la quantité correspond || false: la quantité ne correspond pas
 */
function verifier_ingredient(ingredient) {
    if (_ingredients_sous_la_main.hasOwnProperty(ingredient) && _ingredients_recette.hasOwnProperty(ingredient)) {
        if (_ingredients_sous_la_main[ingredient] === _ingredients_recette[ingredient].valeur) {
            return true;
        }
    }
    return false;
}

/**
 * Un problème de quantité ? On définit le bon texte à retourner (si trop ou pas assez) !
 * @param {string} ingredient Ingrédient concerné
 * @return {string} label à retourner
 */
function retourne_chaine_probleme(ingredient) {
    let diff = 0;
    let chaine = '';

    var str = _labels[lang]['pbs_' + ingredient];
    if (_ingredients_sous_la_main[ingredient] > _ingredients_recette[ingredient].valeur) {
        diff = _ingredients_sous_la_main[ingredient] - _ingredients_recette[ingredient].valeur;
        chaine = _labels[lang]['trop'];
    } else {
        diff = _ingredients_recette[ingredient].valeur - _ingredients_sous_la_main[ingredient];
        chaine = _labels[lang]['pas_assez'];
    }

    return str
        + " "
        + chaine.replace(
            '##',
            diff
            + ' '
            + _ingredients_recette[ingredient].unite
            + (diff > 1 ? 's' : '')
        );
}

/**
 * Le manque d'ingrédient implique-t-il la fin de la recette ?
 * @param {string} ingredient Ingrédient concerné
 * @return {boolean} true: fin de recette || false: on continue la recette
 */
function verifier_fin_recette(ingredient) {
    return _ingredients_recette[ingredient].stop;
}

/**
 * Permet de faire des crêpes, ou pas...
 * @return {boolean} Définit la réussite de la recette
 */
function faire_des_crepes() {
    // Let's go !
    console.log(_labels[lang].depart);

    // On vérifie tous les ingrédients
    let tout_est_ok = _ordre.every(function(ingredient) {
        // La quantité d'un ingrédient ne convient pas
        if (!verifier_ingredient(ingredient)) {
            console.log(
                retourne_chaine_probleme(ingredient)
            );

            // Si l'ingrédient est essentiel, on indique l'arrêt du traitement
            return !(verifier_fin_recette(ingredient));
        } else {
            // La quantité correspond à la recette
            console.log(_labels[lang]['ajout_' + ingredient]);
            return true;
        }
    });

    // Si aucun problème d'ingrédient n'a été détecté, on passe à la cuisson et miam !
    if (tout_est_ok) {
        console.log(_labels[lang].cuisson);
        console.log(_labels[lang].miam);
        return true;
    }

    return false;
}

// Let's go !
faire_des_crepes();
