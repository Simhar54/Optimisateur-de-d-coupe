export class FormValidator {
  constructor() {
    this.errors = [];
  }

  validateNumeric(input) {
    if (/^\d+$/.test(input.value)) {
      this._setValid(input);
      return true;
    } else {
      this._setInvalid(input, "Veuillez entrer uniquement des chiffres.");
      return false;
    }
  }

  validateAlphanumeric(input) {
    if (/^[a-zA-Z0-9]+$/.test(input.value)) {
      this._setValid(input);
      return true;
    } else {
      this._setInvalid(
        input,
        "Veuillez entrer uniquement des chiffres et des lettres."
      );
      return false;
    }
  }

  _setValid(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    const feedbackElement = input.nextElementSibling;
    if (
      feedbackElement &&
      feedbackElement.classList.contains("invalid-feedback")
    ) {
      feedbackElement.textContent = ""; // Efface le message d'erreur précédent
    }
  }

  _setInvalid(input, message) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    let feedbackElement = input.nextElementSibling;

    // Si l'élément suivant n'est pas un message d'erreur, on le crée
    if (
      !feedbackElement ||
      !feedbackElement.classList.contains("invalid-feedback")
    ) {
      feedbackElement = document.createElement("div");
      feedbackElement.classList.add("invalid-feedback");
      input.parentNode.insertBefore(feedbackElement, input.nextSibling);
    }

    // Met à jour ou ajoute le message d'erreur
    feedbackElement.textContent = message;
  }

  // Valide les champs pour l'action d'ajout
  validateAddAction(input) {
    let isValid = false;
    switch (input.name) {
      case "cutLength":
      case "barLength":
      case "qte":
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

  // Valide les champs pour l'action d'optimisation
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

