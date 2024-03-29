export class BarLengthManager {
  constructor() {
    this.barLengths = []; // Stocke les longueurs des barres avec un identifiant unique
    this.entryId = 0; // Un simple compteur pour générer des identifiants uniques
    this._setupEventListeners();
  }

  addBarLength(barLength, quantity) {
    for (let i = 0; i < quantity; i++) {
      // Incrémente entryId pour s'assurer que chaque entrée a un identifiant unique
      this.barLengths.push({ id: ++this.entryId, length: barLength });
    }
    this._updateDisplay();
    console.log(this.barLengths);
  }

  _updateDisplay() {
    const displayElement = document.getElementById("barrLenghtDisplay");
    displayElement.innerHTML = "";

    this.barLengths.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("bar-length-entry");
      entryDiv.textContent = `Longueur de barre: ${entry.length}`;
      entryDiv.dataset.entryId = entry.id; // Stocke l'identifiant unique comme attribut de données
      displayElement.appendChild(entryDiv);

      entryDiv.addEventListener("click", (event) => {
        // Désélectionnez d'abord tout élément sélectionné
        document.querySelectorAll(".bar-length-entry").forEach((selected) => {
          if (selected !== event.currentTarget) {
            selected.classList.remove("selected");
          }
        });
        // Ensuite, basculez la classe 'selected' pour l'élément actuel
        event.currentTarget.classList.toggle("selected");
      });

      // Ajout d'un écouteur d'événements pour le clic droit qui affiche le menu contextuel
      entryDiv.addEventListener("contextmenu", (event) => {
        event.preventDefault(); // Empêche le menu contextuel par défaut du navigateur

        // Met en évidence l'entrée sélectionnée
        document
          .querySelectorAll(".bar-length-entry.selected")
          .forEach((selected) => {
            selected.classList.remove("selected");
          });
        entryDiv.classList.add("selected");
        // Sélectionne cette entrée et affiche le menu contextuel à la position de la souris
        this._showContextMenu(event.pageX, event.pageY, entry.id);
      });
    });
  }

  _setupEventListeners() {
    // Assurez-vous d'avoir initialisé votre menu contextuel dans le HTML.
    const contextMenu = document.getElementById("contextMenuBar");
    const editItem = document.getElementById("editItemBar");
    const deleteItem = document.getElementById("deleteItemBar");

    // Cacher le menu contextuel si l'utilisateur clique ailleurs
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".bar-length-entry")) {
        contextMenu.style.display = "none";
      }
    });

    // Gestionnaire pour "Modifier"
    editItem.addEventListener("click", () => {
      // Trouve l'index de l'entrée sélectionnée basé sur l'ID stocké
      const selectedIndex = this.barLengths.findIndex(
        (entry) => entry.id === this.currentlySelectedEntryId
      );
      const selectedEntry = this.barLengths[selectedIndex];

      if (!selectedEntry) return;

      const entryDiv = document.querySelector(
        `[data-entry-id="${this.currentlySelectedEntryId}"]`
      );

      // Crée un champ d'entrée pour modifier la longueur de la barre
      const barLengthInput = document.createElement("input");
      barLengthInput.type = "text";
      barLengthInput.value = selectedEntry.length;
      barLengthInput.classList.add("edit-bar-length");

      entryDiv.innerHTML = "";
      entryDiv.appendChild(barLengthInput);
      barLengthInput.focus(); // Met le focus sur le champ pour la modification immédiate

      const saveButton = document.createElement("button");
      saveButton.textContent = "Sauvegarder";
      saveButton.addEventListener("click", () => {
        const newLength = barLengthInput.value;
        const alertDiv = document.getElementById("alertDiv");

        // Validation de la nouvelle longueur
        if (!newLength.match(/^\d+$/) || newLength === "") {
          alertDiv.textContent =
            "La longueur doit être un nombre et ne peut pas être vide.";
          alertDiv.classList.remove("d-none");
          return; // Arrête l'exécution si la validation échoue
        }

        // Cache la div d'alerte si elle était affichée suite à une erreur précédente
        alertDiv.classList.add("d-none");

        // Logique de sauvegarde des modifications
        this._saveBarLengthEdit(selectedIndex, newLength);
        document.getElementById("contextMenuBar").style.display = "none";
      });

      entryDiv.appendChild(saveButton);

      // Gestionnaire pour "Supprimer" reste inchangé

      // Cache le menu contextuel
      document.getElementById("contextMenuBar").style.display = "none";
      console.log(this.barLengths);
    });

    // Gestionnaire pour "Supprimer"
    deleteItem.addEventListener("click", () => {
      // Supprime l'entrée du tableau
      this.barLengths = this.barLengths.filter(
        (entry) => entry.id !== this.currentlySelectedEntryId
      );
      this._updateDisplay(); // Met à jour l'affichage pour refléter la suppression

      contextMenu.style.display = "none";
    });
  }

  _showContextMenu(x, y, entryId) {
    const contextMenu = document.getElementById("contextMenuBar");
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.display = "block";

    // Stocke l'identifiant de l'entrée actuellement sélectionnée pour l'utiliser dans les actions de modification/suppression
    this.currentlySelectedEntryId = entryId;
  }

  _saveBarLengthEdit(index, newLength) {
    if (newLength && !isNaN(newLength) && index !== -1) {
      // Met à jour l'entrée avec la nouvelle longueur
      this.barLengths[index].length = newLength;
      // Rafraîchit l'affichage
      this._updateDisplay();
    } else {
      console.log("Erreur: La nouvelle longueur est invalide.");
    }
  }

  // Méthodes pour le menu contextuel, la modification et la suppression d'entrées...
}
