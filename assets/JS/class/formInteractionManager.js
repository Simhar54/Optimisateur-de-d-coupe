export class FormInteractionManager {
  constructor(validator, cutLengthManager, barLengthManager) {
    this.validator = validator;
    this.cutLengthManager = cutLengthManager;
    this.barLengthManager = barLengthManager; // Nouvelle dépendance ajoutée
    this._setupEventListeners();
  }

  _setupEventListeners() {
    // Ajoutez ici les écouteurs d'événements pour les boutons "Ajouter"
    document
      .getElementById("addCutLength")
      .addEventListener("click", (event) => {
        event.preventDefault();
        this._handleAddCutLength();
      });

    ["cutLength", "of"].forEach((id) => {
      document.getElementById(id).addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this._handleAddCutLength();
          document.getElementById("cutLength").focus(); // Remet le focus sur cutLength
        }
      });
    });

    document.addEventListener("click", (event) => {
      // Vérifiez si le clic était sur un élément de la liste
      const isCutLengthEntryClicked = event.target.closest(".cut-length-entry");

      if (!isCutLengthEntryClicked) {
        // Désélectionnez tout élément de liste sélectionné
        document
          .querySelectorAll(".cut-length-entry.selected")
          .forEach((selected) => {
            selected.classList.remove("selected");
          });
      }
    });

    document
      .getElementById("addBarLength")
      .addEventListener("click", (event) => {
        event.preventDefault();
        this._handleAddBarLength();
      });

    ["barLength", "qte"].forEach((id) => {
      document.getElementById(id).addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this._handleAddBarLength();
          document.getElementById("barLength").focus(); // Remet le focus sur barLength
        }
      });
    });

    document.addEventListener("click", (event) => {
      // Vérifiez si le clic était sur un élément de la liste
      const isBarLengthEntryClicked = event.target.closest(".bar-length-entry");

      if (!isBarLengthEntryClicked) {
        // Désélectionnez tout élément de liste sélectionné
        document
          .querySelectorAll(".bar-length-entry.selected")
          .forEach((selected) => {
            selected.classList.remove("selected");
          });
      }
    });

    // Validation lors de l'optimisation
    document
      .getElementById("optimizeButton")
      .addEventListener("click", (event) => {
        event.preventDefault();
        this._handleOptimize();
      });
  }

  _deselectAllCutLengthEntries() {
    document.querySelectorAll(".cut-length-entry.selected").forEach((entry) => {
      entry.classList.remove("selected");
    });
  }

  _deselectAllBarLengthEntries() {
    document.querySelectorAll(".bar-length-entry.selected").forEach((entry) => {
      entry.classList.remove("selected");
    });
  }

  _handleAddCutLength() {
    const cutLengthInput = document.getElementById("cutLength");
    const ofInput = document.getElementById("of");

    if (
      this.validator.validateAddAction(cutLengthInput) &&
      this.validator.validateAddAction(ofInput)
    ) {
      this.cutLengthManager.addCutLength(cutLengthInput.value, ofInput.value);
      cutLengthInput.value = "";
      ofInput.value = "";
      console.log("Ajout réussi.");
    }
  }

  _handleAddBarLength() {
    const barLengthInput = document.getElementById("barLength");
    const quantityInput = document.getElementById("qte");
    const barLength = barLengthInput.value;
    const quantity = parseInt(quantityInput.value, 10) || 1;

    // Assurez-vous que les méthodes de validation appropriées sont implémentées dans votre validator
    if (
      this.validator.validateAddAction(barLengthInput) && // Validez la longueur de la barre
      this.validator.validateAddAction(quantityInput) // Validez la quantité
    ) {
      this.barLengthManager.addBarLength(barLength, quantity);
      barLengthInput.value = "";
      quantityInput.value = "";
      console.log("Bar length added successfully.");
    }
  }

  _handleOptimize() {
    const barDropInput = document.getElementById("barDrop");
    const sawBladeSizeInput = document.getElementById("sawBladeSize");

    if (this.validator.validateOptimizeAction([barDropInput, sawBladeSizeInput])
    && this.barLengthManager.barLengths.length > 0 
    && this.cutLengthManager.cutLengths.length > 0) {
      // Tous les champs sont valides
      console.log("Optimisation réussie.");
      // Soumettez ici ou effectuez la logique d'optimisation
    } else {
      console.log("Optimisation échouée.");
    }
  }

  // Vous pouvez ajouter ici des méthodes supplémentaires pour gérer d'autres interactions
}
