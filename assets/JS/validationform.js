class FormValidator {
  constructor() {
    this.errors = [];
  }

  // Vérifie si le champ contient uniquement des chiffres
  validateNumeric(input) {
    if (/^\d+$/.test(input.value)) {
      this._setValid(input);
      return true;
    } else {
      this._setInvalid(input, "Veuillez entrer uniquement des chiffres.");
      return false;
    }
  }

  // Vérifie si le champ OF contient des chiffres et des lettres
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

  // Applique le style et le message pour un champ valide
  _setValid(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (input.nextElementSibling.classList.contains("invalid-feedback")) {
      input.nextElementSibling.textContent = "";
    }
  }

  // Applique le style et le message pour un champ invalide
  _setInvalid(input, message) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    if (input.nextElementSibling.classList.contains("invalid-feedback")) {
      input.nextElementSibling.textContent = message;
    } else {
      const feedback = document.createElement("div");
      feedback.classList.add("invalid-feedback");
      feedback.textContent = message;
      input.parentNode.insertBefore(feedback, input.nextSibling);
    }
  }

  // Valide tout le formulaire
  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll("input");

    inputs.forEach((input) => {
      switch (input.name) {
        case "barDrop":
        case "sawBladeSize":
        case "cutLength":
        case "barLength":
          if (!this.validateNumeric(input)) isValid = false;
          break;
        case "of":
          if (!this.validateAlphanumeric(input)) isValid = false;
          break;
        default:
          console.error("Validation non définie pour le champ:", input.name);
      }
    });

    return isValid;
  }
}


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const validator = new FormValidator();
  
    form.addEventListener("submit", event => {
      event.preventDefault(); // Empêche la soumission du formulaire
  
      // Valide le formulaire
      if (validator.validateForm(form)) {
        console.log("Formulaire valide, prêt à être soumis.");
        // Soumettez le formulaire ici ou effectuez une action suivante
      } else {
        console.log("Le formulaire contient des erreurs.");
      }
    });
  });
  