export class CutLengthManager {
  constructor() {
    this.cutLengths = []; // Stocke les longueurs et les OF ajoutés
    this._setupContextMenuEventListeners(); // Appel de la méthode privée pour configurer les écouteurs d'événements du menu contextuel
  }

  // Méthode pour ajouter une longueur et un OF
  addCutLength(cutLength, of) {
    // Ici, vous pouvez ajouter une validation supplémentaire si nécessaire
    const entry = { cutLength, of };
    this.cutLengths.push(entry);

    // Mettre à jour l'affichage ou autre logique
    this._updateDisplay();
    console.log(this.cutLengths);
  }

  // Méthode privée pour mettre à jour l'affichage des longueurs et OFs ajoutés
  _updateDisplay() {
    const displayElement = document.querySelector(".info-display"); // Assurez-vous que cet élément existe
    displayElement.innerHTML = ""; // Réinitialiser l'affichage

    this.cutLengths.forEach((entry, index) => {
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("cut-length-entry"); // Classe pour le styling de base

      const lengthDiv = document.createElement("div");
      lengthDiv.textContent = `Longueur: ${entry.cutLength}`;
      lengthDiv.classList.add("cut-length"); // Classe pour styling spécifique

      const ofDiv = document.createElement("div");
      ofDiv.textContent = `OF: ${entry.of}`;
      ofDiv.classList.add("cut-of"); // Classe pour styling spécifique

      // Structure pour aligner le contenu
      entryDiv.appendChild(lengthDiv);
      entryDiv.appendChild(ofDiv);

      entryDiv.addEventListener("click", (event) => {
        // Désélectionnez d'abord tout élément sélectionné
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

      entryDiv.addEventListener("contextmenu", (event) => {
        event.preventDefault(); // Empêche le menu contextuel du navigateur
        this._showContextMenu(event.pageX, event.pageY, index);
      });

      displayElement.appendChild(entryDiv);
    });
  }

  _showContextMenu(x, y, index) {
    const contextMenu = document.getElementById("contextMenu");
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.display = "block";

    // Stocker l'index de l'élément actuellement sélectionné pour l'utiliser dans les actions de modification/suppression
    this.currentlySelectedIndex = index;
  }

  _setupContextMenuEventListeners() {
    const editItem = document.getElementById("editItem");
    const deleteItem = document.getElementById("deleteItem");

    editItem.addEventListener("click", () => {
      // Récupère l'entrée sélectionnée et ses détails
      const entryDiv =
        document.querySelectorAll(".cut-length-entry")[
          this.currentlySelectedIndex
        ];
      const entry = this.cutLengths[this.currentlySelectedIndex];

      // Crée des champs d'entrée pour la modification
      const lengthInput = document.createElement("input");
      lengthInput.type = "text";
      lengthInput.value = entry.cutLength;
      lengthInput.classList.add("edit-length"); // Ajoutez des classes CSS si nécessaire

      const ofInput = document.createElement("input");
      ofInput.type = "text";
      ofInput.value = entry.of;
      ofInput.classList.add("edit-of"); // Ajoutez des classes CSS si nécessaire

      // Vide le contenu de l'entrée et y ajoute les champs d'entrée
      entryDiv.innerHTML = "";
      entryDiv.appendChild(lengthInput);
      entryDiv.appendChild(ofInput);

      lengthInput.focus(); // Met le focus sur le champ de longueur pour la modification immédiate

      // Optionnel: Ajoutez un bouton de sauvegarde ou utilisez un événement pour enregistrer la modification
      const saveButton = document.createElement("button");
      saveButton.textContent = "Sauvegarder";
      saveButton.addEventListener("click", () => {
        this._saveEdit(
          this.currentlySelectedIndex,
          lengthInput.value,
          ofInput.value
        );
      });
      entryDiv.appendChild(saveButton);

      // Cacher le menu
      document.getElementById("contextMenu").style.display = "none";
    });

    deleteItem.addEventListener("click", () => {
      // Supprimer l'élément du tableau
      this.cutLengths.splice(this.currentlySelectedIndex, 1);
      this._updateDisplay();
      document.getElementById("contextMenu").style.display = "none";
      console.log(this.cutLengths);
    });

    // Cacher le menu contextuel lors d'un clic en dehors de celui-ci
    document.addEventListener("click", (event) => {
      if (!event.target.matches(".context-menu, .context-menu *")) {
        document.getElementById("contextMenu").style.display = "none";
      }
    });
  }

  _saveEdit(index, newLength, newOf) {
    // Met à jour l'entrée dans le tableau
    this.cutLengths[index] = { cutLength: newLength, of: newOf };

    // Met à jour l'affichage pour refléter les changements
    this._updateDisplay();
    console.log(this.cutLengths);
  }
}
