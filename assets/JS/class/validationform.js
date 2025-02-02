/**
 * Classe pour valider les formulaires.
 * Fournit des méthodes pour valider les entrées numériques et alphanumériques.
 */
import { TranslationManager } from '../translations.js';

export class FormValidator {
  constructor() {
    this.errors = [];
    this.translationManager = new TranslationManager();
    // Messages d'erreur avec clés de traduction
    this.errorMessages = {
      numeric: 'error_numeric_only',      // "Veuillez entrer uniquement des chiffres"
      alphanumeric: 'error_alphanumeric'  // "Veuillez entrer uniquement des chiffres et des lettres"
    };
  }

  /**
   * Valide si l'entrée est uniquement numérique.
   * @param {HTMLInputElement} input - L'élément de formulaire à valider.
   * @returns {boolean} - Renvoie true si l'entrée est valide, sinon false.
   */
  validateNumeric(input) {
    if (/^\d+$/.test(input.value)) {
      this._setValid(input);
      return true;
    } else {
      this._setInvalid(input, this.errorMessages.numeric);
      return false;
    }
  }

  /**
   * Valide si l'entrée est alphanumérique.
   * @param {HTMLInputElement} input - L'élément de formulaire à valider.
   * @returns {boolean} - Renvoie true si l'entrée est valide, sinon false.
   */
  validateAlphanumeric(input) {
    if (/^[a-zA-Z0-9]+$/.test(input.value)) {
      this._setValid(input);
      return true;
    } else {
      this._setInvalid(input, this.errorMessages.alphanumeric);
      return false;
    }
  }

  /**
   * Marque l'entrée comme valide en ajoutant des classes CSS appropriées.
   * @param {HTMLInputElement} input - L'élément de formulaire à marquer comme valide.
   * @private
   */
  _setValid(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    const feedbackElement = input.nextElementSibling;
    if (feedbackElement && feedbackElement.classList.contains("invalid-feedback")) {
      feedbackElement.textContent = "";
    }
  }

  /**
   * Marque l'entrée comme invalide et affiche un message d'erreur.
   * @param {HTMLInputElement} input - L'élément de formulaire à marquer comme invalide.
   * @param {string} messageKey - La clé du message d'erreur à afficher.
   * @private
   */
  _setInvalid(input, messageKey) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    let feedbackElement = input.nextElementSibling;

    // Si l'élément suivant n'est pas un message d'erreur, on le crée
    if (!feedbackElement || !feedbackElement.classList.contains("invalid-feedback")) {
      feedbackElement = document.createElement("div");
      feedbackElement.classList.add("invalid-feedback");
      input.parentNode.insertBefore(feedbackElement, input.nextSibling);
    }

    // Ajouter l'attribut data-i18n pour la traduction
    feedbackElement.setAttribute('data-i18n', messageKey);
    feedbackElement.textContent = this.translationManager.getTranslation(messageKey);
  }

  /**
   * Valide les champs pour l'action d'ajout.
   * @param {HTMLInputElement} input - L'élément de formulaire à valider.
   * @returns {boolean} - Renvoie true si l'entrée est valide, sinon false.
   */
  validateAddAction(input) {
    let isValid = false;
    switch (input.name) {
      case "cutLength":
      case "barLength":
      case "qte":
      case "cutQt":  
        isValid = this.validateNumeric(input);
        break;
      case "of":
        isValid = this.validateAlphanumeric(input);
        break;
      default:
        console.error("Validation non définie pour le champ:", input.name);
    }
    return isValid;
  }

  /**
   * Valide les champs pour l'action d'optimisation.
   * @param {HTMLInputElement[]} inputs - Les éléments de formulaire à valider.
   * @returns {boolean} - Renvoie true si toutes les entrées sont valides, sinon false.
   */
  validateOptimizeAction(inputs) {
    let isValid = true;
    inputs.forEach((input) => {
      switch (input.name) {
        case "barDrop":
        case "sawBladeSize":
          if (!this.validateNumeric(input)) isValid = false;
          break;
        // Pas besoin de valider 'of' ici si cela n'est fait que lors de l'ajout
        default:
          console.error("Validation non définie pour le champ:", input.name);
      }
    });
    return isValid;
  }
}
