import { FormValidator } from "./class/validationform.js";
import { CutLengthManager } from "./class/cutLengthManager.js";
import { BarLengthManager } from "./class/barLengthManager.js";
import { FormInteractionManager } from "./class/formInteractionManager.js";

const validator = new FormValidator();
const cutLengthManager = new CutLengthManager();
const barLengthManager = new BarLengthManager();

const formInteractionManager = new FormInteractionManager(
  validator,
  cutLengthManager,
  barLengthManager
);

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
