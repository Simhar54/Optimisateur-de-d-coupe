// Importation des classes nécessaires (assurez-vous que ces importations sont correctes et complètes)
export class FormInteractionManager {
  /**
   * Constructeur de la classe FormInteractionManager.
   * Initialise les managers pour les validations, coupes, longueurs de barres et l'affichage des résultats.
   * @param {FormValidator} validator - Un objet pour valider les entrées du formulaire.
   * @param {CutLengthManager} cutLengthManager - Gère les actions liées aux longueurs de coupe.
   * @param {BarLengthManager} barLengthManager - Gère les actions liées aux longueurs de barres.
   * @param {CutVerifier} cutVerifier - Vérifie si les coupes sont réalisables avec les barres disponibles.
   * @param {OptimizationResultsDisplay} optimizationResultsDisplay - Gère l'affichage des résultats d'optimisation.
   */
  constructor(
    validator,
    cutLengthManager,
    barLengthManager,
    cutVerifier,
    optimizationResultsDisplay
  ) {
    this.validator = validator;
    this.cutLengthManager = cutLengthManager;
    this.barLengthManager = barLengthManager;
    this.cutVerifier = cutVerifier;
    this.optimizationResultsDisplay = optimizationResultsDisplay;
    this._setupEventListeners(); // Configuration initiale des écouteurs d'événements.
  }

  /**
   * Configure les écouteurs d'événements pour divers éléments de l'interface utilisateur.
   */
  _setupEventListeners() {
    // Ajoute un écouteur pour le bouton d'ajout de longueurs de coupe.
    document
      .getElementById("addCutLength")
      .addEventListener("click", (event) => {
        event.preventDefault();
        this._handleAddCutLength();
      });

    // Ajoute des écouteurs pour soumettre avec la touche 'Entrée'.
    ["cutLength", "of", "cutQt"].forEach((id) => {
      document.getElementById(id).addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this._handleAddCutLength();
          document.getElementById("cutLength").focus(); // Garde le focus sur le champ de saisie.
        }
      });
    });

    // Écouteur pour gérer la désélection des entrées lors du clic à l'extérieur.
    document.addEventListener("click", (event) => {
      const isCutLengthEntryClicked = event.target.closest(".cut-length-entry");
      if (!isCutLengthEntryClicked) {
        document
          .querySelectorAll(".cut-length-entry.selected")
          .forEach((selected) => {
            selected.classList.remove("selected");
          });
      }
    });

    // Écouteurs similaires pour les longueurs de barres.
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
          document.getElementById("barLength").focus();
        }
      });
    });

    // Gestion de l'optimisation lors du clic sur le bouton optimiser.
    document
      .getElementById("optimizeButton")
      .addEventListener("click", (event) => {
        event.preventDefault();
        const optimizeButton = document.getElementById("optimizeButton");
        optimizeButton.disabled = true; // Désactive le bouton pendant l'envoi.
        this._handleOptimize();
      });

    // Ecouteur pour le bouton d'impression en PDF.
    document
      .getElementById("generatePDFButton")
      .addEventListener("click", (event) => {
        event.preventDefault();
        this._handlePrintInPdf();
      });
  }

  /**
   * Désélectionne toutes les entrées sélectionnées pour les coupes.
   */
  _deselectAllCutLengthEntries() {
    document.querySelectorAll(".cut-length-entry.selected").forEach((entry) => {
      entry.classList.remove("selected");
    });
  }

  /**
   * Désélectionne toutes les entrées sélectionnées pour les longueurs de barre.
   */
  _deselectAllBarLengthEntries() {
    document.querySelectorAll(".bar-length-entry.selected").forEach((entry) => {
      entry.classList.remove("selected");
    });
  }

  /**
   * Gère l'ajout d'une longueur de coupe.
   */
  _handleAddCutLength() {
    const cutLengthInput = document.getElementById("cutLength");
    const ofInput = document.getElementById("of");
    const cutQtInput = document.getElementById("cutQt");
    if (
      this.validator.validateAddAction(cutLengthInput) &&
      this.validator.validateAddAction(ofInput) &&
      this.validator.validateAddAction(cutQtInput)
    ) {
      this.cutLengthManager.addCutLength(cutLengthInput.value, ofInput.value, cutQtInput.value);
      cutLengthInput.value = ""; // Réinitialise les champs après l'ajout.
      cutQtInput.value = "1"; // Réinitialise la valeur après l'ajout.
    }
  }

  /**
   * Gère l'ajout de longueurs de barres.
   */
  _handleAddBarLength() {
    const barLengthInput = document.getElementById("barLength");
    const quantityInput = document.getElementById("qte");
    const barLength = barLengthInput.value;
    const quantity = parseInt(quantityInput.value, 10) || 1; // Utilise 1 comme quantité par défaut.
    if (
      this.validator.validateAddAction(barLengthInput) &&
      this.validator.validateAddAction(quantityInput)
    ) {
      this.barLengthManager.addBarLength(barLength, quantity);
      barLengthInput.value = ""; // Réinitialise les champs après l'ajout.
      quantityInput.value = "1";
    }
  }

  /**
   * Gère l'optimisation des coupes.
   */
  _handleOptimize() {
    const barDropInput = document.getElementById("barDrop");
    const sawBladeSizeInput = document.getElementById("sawBladeSize");
    const verification = this.cutVerifier.validateCuts();
    if (!verification.valid) {
      this._alertDiv(verification.message);
      document.getElementById("optimizeButton").disabled = false;
      return;
    }

    if (
      this.validator.validateOptimizeAction([
        barDropInput,
        sawBladeSizeInput,
      ]) &&
      this.barLengthManager.barLengths.length > 0 &&
      this.cutLengthManager.cutLengths.length > 0
    ) {
      // Préparation des données pour la requête d'optimisation.
      let data = {
        barLengths: this.barLengthManager.barLengths,
        cutLengths: this.cutLengthManager.cutLengths,
        barDrop: barDropInput.value,
        sawBladeSize: sawBladeSizeInput.value,
      };
      let jsonData = JSON.stringify(data);
      // Envoi de la requête d'optimisation.
      fetch("API/optimisation.api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            this.optimizationResultsDisplay.display(data.results);
          } else {
            throw new Error(
              data.message ||
                "Une erreur inattendue est survenue lors de l'optimisation."
            );
          }
        })
        .catch((error) => {
          this._alertDiv(
            error.message || "Une erreur s'est produite. Veuillez réessayer."
          );
        })
        .finally(() => {
          document.getElementById("optimizeButton").disabled = false; // Réactive le bouton après traitement.
        });
    } else {
      // Gestion des erreurs d'entrée avant l'optimisation.
      this._alertDiv("Veuillez vérifier les entrées et essayer à nouveau.");
    }
  }

  /**
   * Affiche une alerte d'erreur.
   * @param {string} errorMsg - Message d'erreur à afficher.
   */
  _alertDiv(errorMsg) {
    const alertDiv = document.getElementById("alertDiv"); // Assurez-vous que cet élément existe dans le HTML.
    alertDiv.textContent = errorMsg;
    alertDiv.classList.remove("d-none"); // Montre le message d'erreur.
  }

  /**
   * Gère l'impression en PDF des résultats d'optimisation.
   */

  _handlePrintInPdf() {
    const tableHtml = document.getElementById("optimizationDetails").innerHTML;
    document.getElementById("tableHtml").value = tableHtml;
    document.getElementById("pdfForm").submit();
    console.log(tableHtml);
  }
  // Vous pouvez ajouter ici des méthodes supplémentaires pour gérer d'autres interactions
}
