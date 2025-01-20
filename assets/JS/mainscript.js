import { FormValidator } from './class/validationform.js';
import { CutLengthManager } from './class/cutLengthManager.js';
import { BarLengthManager } from './class/barLengthManager.js';
import { OptimizationResultsDisplay } from './class/displayOptimizationResults.js';
import { CutVerifier } from './class/cutVerifier.js';
import { FormInteractionManager } from './class/formInteractionManager.js';
import { TranslationManager } from './translations.js';

/**
 * Initialisation des instances des classes nécessaires pour l'application.
 */
const validator = new FormValidator();
const cutLengthManager = new CutLengthManager();
const barLengthManager = new BarLengthManager();
const cutVerifier = new CutVerifier(barLengthManager, cutLengthManager);
const optimizationResultsDisplay = new OptimizationResultsDisplay('optimizationDetails', 'resultOptimize');

/**
 * Initialisation de la gestion des interactions du formulaire.
 * 
 * @param {FormValidator} validator - Instance de la classe FormValidator pour valider les formulaires.
 * @param {CutLengthManager} cutLengthManager - Instance de la classe CutLengthManager pour gérer les longueurs de coupe.
 * @param {BarLengthManager} barLengthManager - Instance de la classe BarLengthManager pour gérer les longueurs de barre.
 * @param {CutVerifier} cutVerifier - Instance de la classe CutVerifier pour vérifier les coupes.
 * @param {OptimizationResultsDisplay} optimizationResultsDisplay - Instance de la classe OptimizationResultsDisplay pour afficher les résultats de l'optimisation.
 */
const formInteractionManager = new FormInteractionManager(
  validator,
  cutLengthManager,
  barLengthManager,
  cutVerifier,
  optimizationResultsDisplay
);

const translationManager = new TranslationManager();
translationManager.init();

// Écouteur pour le changement de langue
document.getElementById('languageSelector').addEventListener('change', (e) => {
    translationManager.changeLang(e.target.value);
});
