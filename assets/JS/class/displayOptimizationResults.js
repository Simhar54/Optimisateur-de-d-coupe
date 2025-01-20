// OptimizationResultsDisplay.js
// Classe pour gérer l'affichage des résultats d'optimisation de découpe de barres

/**
 * Classe gérant l'affichage des résultats d'optimisation de découpe
 * @class OptimizationResultsDisplay
 */
export class OptimizationResultsDisplay {
  /**
   * @param {string} containerId - ID du conteneur HTML où le tableau sera généré
   * @param {string} resultOptimizeId - ID du conteneur parent à afficher après génération
   */
  constructor(containerId, resultOptimizeId) {
    this.containerId = containerId; // L'identifiant du conteneur HTML où les résultats seront affichés
    this.resultOptimizeId = resultOptimizeId; // L'identifiant du conteneur qui doit être rendu visible après l'affichage des résultats
    // Configuration des en-têtes du tableau avec support multilingue
    this.tableHeaders = [
      { key: "bar_initial_length", defaultText: "Barre (Longueur initiale)" },
      { key: "cuts_length_of", defaultText: "Coupes (Longueur - OF)" },
      { key: "quantity", defaultText: "Quantité" },
      { key: "remaining_length", defaultText: "Longueur restante" }
    ];
  }

  /**
   * Affiche les résultats d'optimisation dans un tableau HTML
   * @param {Array<Object>} results - Tableau des résultats d'optimisation
   * @param {number} results[].initialLength - Longueur initiale de la barre
   * @param {Array<Object>} results[].cuts - Liste des coupes pour cette barre
   * @param {number} results[].cuts[].length - Longueur de la coupe
   * @param {string} results[].cuts[].of - Numéro d'OF associé à la coupe
   * @param {number} results[].remainder - Longueur restante après découpe
   */
  display(results) {
    const resultsContainer = document.getElementById(this.containerId);
    resultsContainer.innerHTML = ""; // Reset du conteneur

    // Création structure de base du tableau
    const table = document.createElement("table");
    table.className = "table table-striped";

    // Génération de l'en-tête avec support multilingue
    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    this.tableHeaders.forEach(headerInfo => {
      let headerCell = document.createElement("th");
      headerCell.setAttribute('data-i18n', headerInfo.key);
      headerCell.textContent = headerInfo.defaultText;
      headerRow.appendChild(headerCell);
    });

    // Tri des résultats : barres utilisées d'abord, puis non utilisées
    let usedBars = results.filter(result => result.cuts.length > 0);
    let unusedBars = results.filter(result => result.cuts.length === 0);
    usedBars.sort((a, b) => a.initialLength - b.initialLength);
    const sortedResults = usedBars.concat(unusedBars);

    // Génération du corps du tableau
    const body = table.createTBody();
    sortedResults.forEach((result) => {
      const row = body.insertRow();

      // Colonne 1: Barre et longueur initiale
      const barCell = row.insertCell(0);
      const barSpan = document.createElement('span');
      barSpan.setAttribute('data-i18n', 'bar_word');
      barSpan.textContent = 'Barre';
      barCell.appendChild(barSpan);
      barCell.appendChild(document.createTextNode(` ${result.initialLength}`));
      barCell.className = "align-top border";

      // Agrégation des coupes par OF et longueur
      const cutsInfo = {};
      result.cuts.forEach((cut) => {
        const key = `OF ${cut.of} - ${cut.length}`;
        cutsInfo[key] = (cutsInfo[key] || 0) + 1;
      });

      // Colonnes 2 & 3: Coupes et quantités
      const cutsCell = row.insertCell(1);
      const quantityCell = row.insertCell(2);
      
      // Génération des lignes de coupe avec leurs quantités
      Object.entries(cutsInfo).forEach(([key, quantity], index) => {
        const [ofPart, length] = key.split(' - ');
        
        // Création de la ligne de coupe
        const cutDiv = document.createElement('div');
        const ofSpan = document.createElement('span');
        ofSpan.setAttribute('data-i18n', 'work_order');
        ofSpan.textContent = 'OF';
        cutDiv.appendChild(ofSpan);
        cutDiv.appendChild(document.createTextNode(` ${ofPart.replace('OF ', '')} - ${length}`));
        
        // Gestion de l'espacement vertical
        if (index > 0) cutDiv.style.marginTop = '0.5rem';
        cutsCell.appendChild(cutDiv);
        
        // Affichage de la quantité
        const quantityDiv = document.createElement('div');
        quantityDiv.textContent = `${quantity}x`;
        if (index > 0) quantityDiv.style.marginTop = '0.5rem';
        quantityCell.appendChild(quantityDiv);
      });

      // Styles des cellules
      cutsCell.className = "text-center border align-middle";
      quantityCell.className = "text-center border align-middle";

      // Colonne 4: Longueur restante
      const remainderCell = row.insertCell(3);
      remainderCell.textContent = result.remainder;
      remainderCell.className = "align-bottom border";
    });

    // Finalisation et affichage
    resultsContainer.appendChild(table);
    document.getElementById(this.resultOptimizeId).classList.remove("d-none");

    // Déclenchement de l'événement pour la mise à jour des traductions
    document.dispatchEvent(new CustomEvent('tableGenerated'));
  }
}
