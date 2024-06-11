/**
 * Classe pour gérer les longueurs de barres.
 * Permet d'ajouter, afficher, modifier et supprimer des longueurs de barres.
 */
export class BarLengthManager {
  constructor() {
    this.barLengths = []; // Stocke les longueurs des barres avec un identifiant unique
    this.entryId = 0; // Un simple compteur pour générer des identifiants uniques
    this._setupEventListeners();
  }

  /**
   * Ajoute une longueur de barre à la liste.
   * @param {number} barLength - La longueur de la barre à ajouter.
   * @param {number} quantity - La quantité de barres à ajouter.
   */
  addBarLength(barLength, quantity) {
    for (let i = 0; i < quantity; i++) {
      // Incrémente entryId pour s'assurer que chaque entrée a un identifiant unique
      this.barLengths.push({ id: ++this.entryId, length: barLength });
    }
    this._updateDisplay();
    console.log(this.barLengths);
  }

  /**
   * Calcule et affiche la longueur totale des barres et la quantité totale de barres.
   */
  totalBarLength() {
    let totalBarLength = document.getElementById("totalBarLength");
    let totalBarQt = document.getElementById("totalBarQt");
    let total = 0;
    this.barLengths.forEach((entry) => {
      total += parseInt(entry.length);
    });
    totalBarLength.textContent = total;
    totalBarQt.textContent = this.barLengths.length;
  }

  /**
   * Met à jour l'affichage des longueurs de barres.
   * Ajoute des écouteurs d'événements pour la sélection et le menu contextuel.
   * @private
   */
  _updateDisplay() {
    const displayElement = document.getElementById("barrLenghtDisplay");
    displayElement.innerHTML = "";

    this.barLengths.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("bar-length-entry");
      entryDiv.textContent = `Longueur de barre: ${entry.length}`;
      entryDiv.dataset.entryId = entry.id; // Stocke l'identifiant unique comme attribut de données
      displayElement.appendChild(entryDiv);
      this.totalBarLength();

      entryDiv.addEventListener("click", (event) => {
        // Désélectionnez d'abord tout élément sélectionné
        document.querySelectorAll(".bar-length-entry").forEach((selected) => {
          if (selected !== event.currentTarget) {
            selected.classList.remove("selected");
          }
        });
        document
        .querySelectorAll(".cut-length-entry.selected")
        .forEach((selected) => {
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
    // Défilement automatique vers le bas
    displayElement.scrollTop = displayElement.scrollHeight;

    // Ajout des écouteurs d'événements pour les flèches du clavier
    document.addEventListener("keydown", (event) => {
      const selectedElement = document.querySelector(
        ".bar-length-entry.selected"
      );
      if (!selectedElement) return;

      let newSelectedElement;
      if (event.key === "ArrowDown") {
        newSelectedElement = selectedElement.nextElementSibling;
      } else if (event.key === "ArrowUp") {
        newSelectedElement = selectedElement.previousElementSibling;
      }
      // Met à jour la sélection et fait défiler si nécessaire
      if (newSelectedElement) {
        selectedElement.classList.remove("selected");
        newSelectedElement.classList.add("selected");
        const elementRect = newSelectedElement.getBoundingClientRect();
        const containerRect = displayElement.getBoundingClientRect();
        // Fait défiler si l'élément sélectionné est hors de la vue
        if (elementRect.bottom > containerRect.bottom) {
          displayElement.scrollTop += elementRect.bottom - containerRect.bottom;
        } else if (elementRect.top < containerRect.top) {
          displayElement.scrollTop -= containerRect.top - elementRect.top;
        }
      }
    });
  }

  

  /**
   * Initialise les écouteurs d'événements pour le menu contextuel.
   * @private
   */
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

  /**
   * Affiche le menu contextuel à une position donnée et stocke l'identifiant de l'entrée sélectionnée.
   * @param {number} x - La position en x où afficher le menu.
   * @param {number} y - La position en y où afficher le menu.
   * @param {number} entryId - L'identifiant de l'entrée actuellement sélectionnée.
   * @private
   */
  _showContextMenu(x, y, entryId) {
    const contextMenu = document.getElementById("contextMenuBar");
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.display = "block";

    // Stocke l'identifiant de l'entrée actuellement sélectionnée pour l'utiliser dans les actions de modification/suppression
    this.currentlySelectedEntryId = entryId;
  }

  /**
   * Sauvegarde les modifications de la longueur de la barre.
   * @param {number} index - L'index de l'entrée à modifier.
   * @param {number} newLength - La nouvelle longueur de la barre.
   * @private
   */
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

 
}
