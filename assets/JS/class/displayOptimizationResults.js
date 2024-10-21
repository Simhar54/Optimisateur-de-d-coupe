// OptimizationResultsDisplay.js
// Classe pour gérer l'affichage des résultats d'optimisation de découpe de barres

export class OptimizationResultsDisplay {
  constructor(containerId, resultOptimizeId) {
    this.containerId = containerId; // L'identifiant du conteneur HTML où les résultats seront affichés
    this.resultOptimizeId = resultOptimizeId; // L'identifiant du conteneur qui doit être rendu visible après l'affichage des résultats
  }

  /**
   * Affiche les résultats d'optimisation dans un tableau HTML.
   * @param {Array} results Les résultats à afficher, chaque élément doit être un objet avec initialLength, cuts, et remainder.
   */
  display(results) {
    const resultsContainer = document.getElementById(this.containerId);
    resultsContainer.innerHTML = ""; // Effacer les résultats précédents

    // Création du tableau pour afficher les résultats
    const table = document.createElement("table");
    table.className = "table table-striped"; // Ajout de classes Bootstrap pour le style

    // Création de l'en-tête du tableau
    const header = table.createTHead();
    const headerRow = header.insertRow(0);
    const headers = [
      "Barre (Longueur initiale)",
      "Coupes (Longueur - OF)",
      "Quantité",
      "Longueur restante",
    ];
    headers.forEach((text) => {
      let headerCell = document.createElement("th");
      headerCell.innerHTML = text;
      headerRow.appendChild(headerCell);
    });

    // Création du corps du tableau
    const body = table.createTBody();

    // Séparer les résultats en deux groupes : utilisées et non utilisées
    let usedBars = [];
    let unusedBars = [];

    results.forEach((result) => {
      if (result.cuts.length > 0) {
        usedBars.push(result);
      } else {
        unusedBars.push(result);
      }
    });

    // Trier les barres utilisées par longueur initiale en ordre croissant
    usedBars.sort((a, b) => a.initialLength - b.initialLength);

    // Combinez les listes pour l'affichage : d'abord les barres utilisées, puis les non utilisées
    const sortedResults = usedBars.concat(unusedBars);

    // Remplissage du tableau avec les résultats de l'optimisation
    sortedResults.forEach((result) => {
      const row = body.insertRow(); // Insérer une nouvelle ligne à la fin du tableau

      // Colonne Barre (Longueur initiale)
      const barCell = row.insertCell(0);
      barCell.textContent = `Barre ${result.initialLength}`;
      barCell.className = "align-top border"; // Texte en haut, bordure solide

      // Colonne Coupes (Longueur - OF) et Quantité
      const cutsInfo = {};
      result.cuts.forEach((cut) => {
        const key = `${cut.length} - OF ${cut.of}`;
        if (cutsInfo[key]) {
          cutsInfo[key] += 1;
        } else {
          cutsInfo[key] = 1;
        }
      });

      const cutsCell = row.insertCell(1);
      const quantityCell = row.insertCell(2);
      cutsCell.innerHTML = Object.keys(cutsInfo)
        .map((key) => key)
        .join("<br>");
      quantityCell.innerHTML = Object.values(cutsInfo)
        .map((quantity) => quantity)
        .join("<br>");
      cutsCell.className = "text-center border"; // Texte centré, bordure solide
      quantityCell.className = "text-center border"; // Texte centré, bordure solide

      // Colonne Longueur restante
      const remainderCell = row.insertCell(3);
      remainderCell.textContent = result.remainder;
      remainderCell.className = "align-bottom border"; // Texte en bas, bordure solide
    });

    resultsContainer.appendChild(table); // Ajouter le tableau au conteneur spécifié

    // Rendre visible le conteneur de résultats si nécessaire
    document.getElementById(this.resultOptimizeId).classList.remove("d-none");
  }
}
