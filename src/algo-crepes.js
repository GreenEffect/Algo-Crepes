/**
 * Algo-Crêpes - Version Browser
 * Version améliorée du code original, compatible navigateur
 */

class CrepesRecipe {
    constructor(lang = 'fr') {
        this.lang = lang;
        this.translations = null;
        this.logs = [];

        // Ordre de traitement des ingrédients
        this.order = ['farine', 'sel', 'sucre', 'oeuf', 'beurre', 'lait'];

        // Configuration de la recette
        this.recipe = {
            'farine': { required: true, amount: 375, unit: 'gramme' },
            'sucre': { required: false, amount: 75, unit: 'gramme' },
            'beurre': { required: false, amount: 90, unit: 'gramme' },
            'lait': { required: true, amount: 1, unit: 'litre' },
            'sel': { required: false, amount: 2, unit: 'pincee' },
            'oeuf': { required: true, amount: 6, unit: 'unite' }
        };

        // Ingrédients disponibles (initialisés aux valeurs parfaites)
        this.availableIngredients = {
            'farine': 375,
            'sucre': 75,
            'beurre': 90,
            'lait': 1,
            'sel': 2,
            'oeuf': 6
        };
    }

    /**
     * Charge les traductions depuis un fichier JSON
     */
    async loadTranslations(lang) {
        try {
            const response = await fetch(`data/translations/${lang}.json`);
            this.translations = await response.json();
            this.lang = lang;
        } catch (error) {
            console.error(`Erreur lors du chargement de la langue ${lang}:`, error);
            this.translations = this.getDefaultTranslations();
        }
    }

    /**
     * Traductions par défaut (français)
     */
    getDefaultTranslations() {
        return {
            "messages": {
                "miam": "À table !",
                "depart": "C'est parti pour les crêpes !",
                "cuisson": "On fait cuire les crêpes.",
                "trop": "(Vous en avez mis ## en trop)",
                "pas_assez": "(Il vous en manque ##)",
                "pbs_oeuf": "Problème de quantité d’œufs, pas de crêpes !",
                "pbs_lait": "Problème de quantité de lait, pas de crêpes !",
                "pbs_farine": "Problème de quantité de farine, pas de crêpes !",
                "pbs_sel": "Problème de quantité de sel ! On croise les doigts pour que ce ne soit pas trop beurk !",
                "pbs_sucre": "Problème de quantité de sucre, ce sera moins bon...",
                "pbs_beurre": "Problème de quantité de beurre, ce sera moins bon...",
                "ajout_farine": "On ajoute la farine.",
                "ajout_sel": "On ajoute le sel.",
                "ajout_sucre": "On ajoute le sucre.",
                "ajout_oeuf": "On ajoute les œufs.",
                "ajout_beurre": "On fait fondre le beurre et on ajoute ça à la préparation.",
                "ajout_lait": "On ajoute le lait."
            },
            "units": {
                "gramme": "gramme",
                "grammes": "grammes",
                "litre": "litre",
                "litres": "litres",
                "pincee": "pincée",
                "pincees": "pincées",
                "unite": "unité",
                "unites": "unités"
            }
        };
    }

    /**
     * Obtient un message traduit
     */
    t(key) {
        if (!this.translations || !this.translations.messages) {
            return key;
        }
        return this.translations.messages[key] || key;
    }

    /**
     * Obtient l'unité traduite avec pluralisation
     */
    getUnit(unit, amount) {
        if (!this.translations || !this.translations.units) {
            return unit;
        }

        const singular = this.translations.units[unit] || unit;
        const plural = this.translations.units[unit + 's'] || singular + 's';

        return amount > 1 ? plural : singular;
    }

    /**
     * Définit la quantité d'un ingrédient disponible
     */
    setIngredient(ingredient, amount) {
        if (this.recipe.hasOwnProperty(ingredient)) {
            this.availableIngredients[ingredient] = amount;
            return true;
        }
        return false;
    }

    /**
     * Vérifie si un ingrédient correspond aux besoins
     */
    checkIngredient(ingredient) {
        if (!this.recipe.hasOwnProperty(ingredient)) {
            return 'unknown';
        }

        const needed = this.recipe[ingredient].amount;
        const available = this.availableIngredients[ingredient];

        if (available === needed) {
            return 'perfect';
        } else if (available < needed) {
            return 'insufficient';
        } else {
            return 'excess';
        }
    }

    /**
     * Génère le message d'erreur pour un ingrédient
     */
    getIngredientProblemMessage(ingredient) {
        const status = this.checkIngredient(ingredient);
        if (status === 'perfect') {
            return null;
        }

        const needed = this.recipe[ingredient].amount;
        const available = this.availableIngredients[ingredient];
        const diff = Math.abs(available - needed);
        const unit = this.getUnit(this.recipe[ingredient].unit, diff);

        let problemMsg = this.t(`pbs_${ingredient}`);
        let diffMsg;

        if (status === 'excess') {
            diffMsg = this.t('trop');
        } else {
            diffMsg = this.t('pas_assez');
        }

        diffMsg = diffMsg.replace('##', `${diff} ${unit}`);

        return `${problemMsg} ${diffMsg}`;
    }

    /**
     * Ajoute un message au log
     */
    log(message) {
        this.logs.push(message);
    }

    /**
     * Réinitialise les logs
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * Obtient tous les logs
     */
    getLogs() {
        return this.logs;
    }

    /**
     * Prépare les crêpes selon la recette
     */
    makeCrepes() {
        this.clearLogs();
        this.log(this.t('depart'));

        let success = true;

        // Vérification de tous les ingrédients dans l'ordre
        for (const ingredient of this.order) {
            const status = this.checkIngredient(ingredient);

            if (status === 'perfect') {
                // Quantité parfaite
                this.log(this.t(`ajout_${ingredient}`));
            } else {
                // Problème de quantité
                const problemMsg = this.getIngredientProblemMessage(ingredient);
                this.log(problemMsg);

                // Si l'ingrédient est requis, on arrête
                if (this.recipe[ingredient].required) {
                    success = false;
                    break;
                }
            }
        }

        // Résultat final
        if (success) {
            this.log(this.t('cuisson'));
            this.log(this.t('miam'));
        }

        return success;
    }

    /**
     * Réinitialise tous les ingrédients aux valeurs parfaites
     */
    reset() {
        this.availableIngredients = {
            'farine': 375,
            'sucre': 75,
            'beurre': 90,
            'lait': 1,
            'sel': 2,
            'oeuf': 6
        };
        this.clearLogs();
    }

    /**
     * Obtient un résumé de l'état actuel
     */
    getStatus() {
        const status = {};

        for (const ingredient of this.order) {
            status[ingredient] = {
                name: ingredient,
                required: this.recipe[ingredient].required,
                needed: this.recipe[ingredient].amount,
                available: this.availableIngredients[ingredient],
                unit: this.recipe[ingredient].unit,
                status: this.checkIngredient(ingredient)
            };
        }

        return status;
    }
}

// Export pour utilisation globale
window.CrepesRecipe = CrepesRecipe;
