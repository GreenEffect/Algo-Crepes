/**
 * Interface de démo pour Algo-Crêpes
 * Gère l'interface utilisateur - PUR JAVASCRIPT
 */

class CrepesDemo {
    constructor() {
        this.recipe = null;
        this.currentLang = 'fr';
        this.ingredients = ['farine', 'sel', 'sucre', 'oeuf', 'beurre', 'lait'];
        this.init();
    }
    
    async init() {
        // Créer l'instance de la recette
        this.recipe = new CrepesRecipe(this.currentLang);
        
        // Charger les traductions
        await this.recipe.loadTranslations(this.currentLang);
        
        // Initialiser les événements
        this.initEventListeners();
        
        // Mettre à jour l'interface
        this.updateUI();
    }
    
    initEventListeners() {
        // Boutons de langue
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLanguage(e.target.dataset.lang);
            });
        });
        
        // Contrôles des ingrédients
        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ingredient = e.target.dataset.ingredient;
                this.decreaseIngredient(ingredient);
            });
        });
        
        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ingredient = e.target.dataset.ingredient;
                this.increaseIngredient(ingredient);
            });
        });
        
        document.querySelectorAll('.ingredient-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const ingredient = e.target.dataset.ingredient;
                const value = parseFloat(e.target.value) || 0;
                this.setIngredient(ingredient, value);
            });
        });
        
        // Bouton "Faire les crêpes"
        document.getElementById('makeCrepes').addEventListener('click', () => {
            this.makeCrepes();
        });
        
        // Bouton "Réinitialiser"
        document.getElementById('resetRecipe').addEventListener('click', () => {
            this.reset();
        });
    }
    
    async switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        await this.recipe.loadTranslations(lang);
        
        // Mettre à jour les boutons de langue
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Mettre à jour l'interface
        this.updateUI();
        this.updateTexts();
    }
    
    updateTexts() {
        // Mettre à jour les textes en fonction de la langue
        const texts = {
            'fr': {
                'title': 'Ingrédients disponibles',
                'instructions': 'Ajustez les quantités pour voir ce qui se passe !',
                'makeBtn': '🍳 Faire les crêpes !',
                'resetBtn': '🔄 Réinitialiser',
                'logsTitle': 'Journal de préparation',
                'logPlaceholder': 'Ajustez les ingrédients et cliquez sur "Faire les crêpes !" pour voir le processus.',
                'eduTitle': 'Concepts illustrés',
                'ready': 'Prêt à commencer !',
                'required': 'Requis',
                'optional': 'Optionnel',
                'need': 'Besoin',
                'ingredients': {
                    'farine': 'Farine',
                    'sel': 'Sel',
                    'sucre': 'Sucre',
                    'oeuf': 'Œufs',
                    'beurre': 'Beurre',
                    'lait': 'Lait'
                },
                'units': {
                    'farine': '375g',
                    'sel': '2 pincées',
                    'sucre': '75g',
                    'oeuf': '6 unités',
                    'beurre': '90g',
                    'lait': '1L'
                }
            },
            'en': {
                'title': 'Available Ingredients',
                'instructions': 'Adjust the quantities to see what happens!',
                'makeBtn': '🍳 Make crepes!',
                'resetBtn': '🔄 Reset',
                'logsTitle': 'Preparation Log',
                'logPlaceholder': 'Adjust the ingredients and click "Make crepes!" to see the process.',
                'eduTitle': 'Illustrated Concepts',
                'ready': 'Ready to start!',
                'required': 'Required',
                'optional': 'Optional',
                'need': 'Need',
                'ingredients': {
                    'farine': 'Flour',
                    'sel': 'Salt',
                    'sucre': 'Sugar',
                    'oeuf': 'Eggs',
                    'beurre': 'Butter',
                    'lait': 'Milk'
                },
                'units': {
                    'farine': '375g',
                    'sel': '2 pinches',
                    'sucre': '75g',
                    'oeuf': '6 units',
                    'beurre': '90g',
                    'lait': '1L'
                }
            }
        };
        
        const t = texts[this.currentLang];
        
        // Mettre à jour les textes de l'interface
        document.querySelector('.ingredients-panel h2').textContent = '📦 ' + t.title;
        document.querySelector('.instructions').textContent = t.instructions;
        document.getElementById('makeCrepes').textContent = t.makeBtn;
        document.getElementById('resetRecipe').textContent = t.resetBtn;
        document.querySelector('.results-panel h2').textContent = '📝 ' + t.logsTitle;
        document.querySelector('.educational-box h3').textContent = '💡 ' + t.eduTitle;
        
        // Mettre à jour les noms des ingrédients
        this.ingredients.forEach(ing => {
            const card = document.querySelector(`.ingredient-card[data-ingredient="${ing}"]`);
            if (card) {
                card.querySelector('.ingredient-name').textContent = t.ingredients[ing];
                const badge = card.querySelector('.required-badge, .optional-badge');
                if (badge) {
                    badge.textContent = badge.classList.contains('required-badge') ? t.required : t.optional;
                }
                card.querySelector('.needed').textContent = t.need + ': ' + t.units[ing];
            }
        });
        
        // Mettre à jour le placeholder si visible
        const placeholder = document.querySelector('.log-placeholder');
        if (placeholder) {
            placeholder.textContent = t.logPlaceholder;
        }
        
        // Mettre à jour le status si en attente
        const statusDiv = document.getElementById('resultStatus');
        if (!statusDiv.classList.contains('success') && !statusDiv.classList.contains('failure')) {
            statusDiv.querySelector('p').textContent = t.ready;
        }
    }
    
    decreaseIngredient(ingredient) {
        const input = document.querySelector(`.ingredient-input[data-ingredient="${ingredient}"]`);
        const step = parseFloat(input.step);
        const newValue = Math.max(0, parseFloat(input.value) - step);
        input.value = newValue;
        this.setIngredient(ingredient, newValue);
    }
    
    increaseIngredient(ingredient) {
        const input = document.querySelector(`.ingredient-input[data-ingredient="${ingredient}"]`);
        const step = parseFloat(input.step);
        const newValue = parseFloat(input.value) + step;
        input.value = newValue;
        this.setIngredient(ingredient, newValue);
    }
    
    setIngredient(ingredient, amount) {
        this.recipe.setIngredient(ingredient, amount);
        this.updateIngredientStatus(ingredient);
    }
    
    updateIngredientStatus(ingredient) {
        const status = this.recipe.checkIngredient(ingredient);
        const card = document.querySelector(`.ingredient-card[data-ingredient="${ingredient}"]`);
        const indicator = card.querySelector('.status-indicator');
        
        // Mettre à jour l'icône de statut
        switch (status) {
            case 'perfect':
                indicator.textContent = '✓';
                indicator.dataset.status = 'perfect';
                break;
            case 'insufficient':
                indicator.textContent = '⚠';
                indicator.dataset.status = 'insufficient';
                break;
            case 'excess':
                indicator.textContent = '⚠';
                indicator.dataset.status = 'excess';
                break;
        }
    }
    
    updateUI() {
        // Mettre à jour tous les indicateurs de statut
        this.ingredients.forEach(ingredient => {
            this.updateIngredientStatus(ingredient);
        });
    }
    
    makeCrepes() {
        // Réinitialiser les logs
        const logsContainer = document.getElementById('logsContainer');
        logsContainer.innerHTML = '';
        
        // Lancer la recette
        const success = this.recipe.makeCrepes();
        
        // Afficher les logs
        const logs = this.recipe.getLogs();
        logs.forEach((log, index) => {
            this.addLogEntry(log, success, index === logs.length - 1);
        });
        
        // Mettre à jour le statut
        this.updateResultStatus(success);
        
        // Scroll vers les résultats
        document.querySelector('.results-panel').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    addLogEntry(message, isSuccess, isLastEntry) {
        const logsContainer = document.getElementById('logsContainer');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        // Déterminer le type de log
        if (message.includes('Problème') || message.includes('problem') || 
            message.includes('manque') || message.includes('need')) {
            if (message.includes('pas de crêpes') || message.includes('no crepes')) {
                entry.classList.add('error');
            } else {
                entry.classList.add('warning');
            }
        } else if (isLastEntry && isSuccess) {
            entry.classList.add('success');
        }
        
        entry.textContent = message;
        logsContainer.appendChild(entry);
    }
    
    updateResultStatus(success) {
        const statusDiv = document.getElementById('resultStatus');
        const icon = statusDiv.querySelector('.status-icon');
        const text = statusDiv.querySelector('p');
        
        // Réinitialiser les classes
        statusDiv.className = 'result-status';
        
        if (success) {
            statusDiv.classList.add('success');
            icon.textContent = '🎉';
            text.textContent = this.recipe.t('miam');
        } else {
            statusDiv.classList.add('failure');
            icon.textContent = '😢';
            text.textContent = this.currentLang === 'fr' 
                ? 'Impossible de faire les crêpes...' 
                : 'Cannot make crepes...';
        }
    }
    
    reset() {
        // Réinitialiser la recette
        this.recipe.reset();
        
        // Réinitialiser les inputs
        const defaults = {
            'farine': 375,
            'sel': 2,
            'sucre': 75,
            'oeuf': 6,
            'beurre': 90,
            'lait': 1
        };
        
        this.ingredients.forEach(ingredient => {
            const input = document.querySelector(`.ingredient-input[data-ingredient="${ingredient}"]`);
            input.value = defaults[ingredient];
        });
        
        // Réinitialiser les logs
        const logsContainer = document.getElementById('logsContainer');
        logsContainer.innerHTML = '<div class="log-placeholder">' + 
            (this.currentLang === 'fr' 
                ? 'Ajustez les ingrédients et cliquez sur "Faire les crêpes !" pour voir le processus.'
                : 'Adjust the ingredients and click "Make crepes!" to see the process.') +
            '</div>';
        
        // Réinitialiser le statut
        const statusDiv = document.getElementById('resultStatus');
        statusDiv.className = 'result-status';
        statusDiv.querySelector('.status-icon').textContent = '⏳';
        statusDiv.querySelector('p').textContent = this.currentLang === 'fr' 
            ? 'Prêt à commencer !' 
            : 'Ready to start!';
        
        // Mettre à jour l'interface
        this.updateUI();
    }
}

// Initialiser l'application au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.demo = new CrepesDemo();
});
