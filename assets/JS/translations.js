export class TranslationManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'fr';
        this.translations = {};
        this.updateLanguageSelector();
        
        // Ajouter un écouteur pour la génération du tableau
        document.addEventListener('tableGenerated', () => {
            this.updatePageContent();
        });
    }

    async init() {
        // Charger les traductions
        try {
            const response = await fetch(`assets/lang/${this.currentLang}.json`);
            this.translations = await response.json();
            this.updatePageContent();
            this.updateLanguageSelector();
        } catch (error) {
            console.error('Erreur lors du chargement des traductions:', error);
        }
    }

    async changeLang(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        await this.init();
    }

    updatePageContent() {
        // Mettre à jour tous les éléments avec l'attribut data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[key]) {
                element.textContent = this.translations[key];
            }
        });
    }

    updateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.value = this.currentLang;
        }
    }
} 