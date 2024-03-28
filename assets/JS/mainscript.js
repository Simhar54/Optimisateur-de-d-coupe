import { FormValidator } from './class/validationform.js';
import { CutLengthManager } from './class/cutLengthManager.js';
import { FormInteractionManager } from './class/formInteractionManager.js';

const validator = new FormValidator();
const cutLengthManager = new CutLengthManager();

const formInteractionManager = new FormInteractionManager(validator, cutLengthManager);

// Gestion de l'ajout pour barLength
document
  .getElementById("addBarLength")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const barLengthInput = document.getElementById("barLength");
    const qte = document.getElementById("qte");

    if (
      validator.validateAddAction(barLengthInput) &&
      validator.validateNumeric(qte)
    ) {
      // Logique d'ajout à la liste
      console.log("Ajout réussi.");
    }
  });

// Validation lors de l'optimisation
document
  .getElementById("optimizeButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const barDropInput = document.getElementById("barDrop");
    const sawBladeSizeInput = document.getElementById("sawBladeSize");

    if (validator.validateOptimizeAction([barDropInput, sawBladeSizeInput])) {
      // Tous les champs sont valides
      console.log("Optimisation réussie.");
      // Soumettez ici ou effectuez la logique d'optimisation
    }
  });
