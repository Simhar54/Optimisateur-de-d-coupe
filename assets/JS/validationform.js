class FormValidator {
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

const validator = new FormValidator();

// Gestion de l'ajout pour cutLength et of
document
  .getElementById("addCutLength")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const cutLengthInput = document.getElementById("cutLength");
    const ofInput = document.getElementById("of");

    if (
      validator.validateAddAction(cutLengthInput) &&
      validator.validateAddAction(ofInput)
    ) {
      // Logique d'ajout à la liste
      console.log("Ajout réussi.");
    }
  });

// Gestion de l'ajout pour barLength
document.getElementById("addBarLength").addEventListener("click", function () {
  const barLengthInput = document.getElementById("barLength");

  if (validator.validateAddAction(barLengthInput)) {
    // Logique d'ajout à la liste
    console.log("Ajout réussi.");
  }
});

// Validation lors de l'optimisation
document
  .getElementById("optimizeButton")
  .addEventListener("click", function () {
    const barDropInput = document.getElementById("barDrop");
    const sawBladeSizeInput = document.getElementById("sawBladeSize");

    if (validator.validateOptimizeAction([barDropInput, sawBladeSizeInput])) {
      // Tous les champs sont valides
      console.log("Optimisation réussie.");
      // Soumettez ici ou effectuez la logique d'optimisation
    }
  });
