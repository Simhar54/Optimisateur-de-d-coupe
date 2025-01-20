/**
 * Classe CutVerifier
 * Vérifie que les longueurs de coupe peuvent être réalisées avec les barres disponibles
 * en tenant compte de la largeur de la lame de scie et de la longueur minimale de chute.
 */
import { TranslationManager } from '../translations.js';

export class CutVerifier {
  /**
   * Constructeur de la classe CutVerifier
   * @param {BarLengthManager} barLengthManager - Instance de BarLengthManager pour gérer les longueurs de barres
   * @param {CutLengthManager} cutLengthManager - Instance de CutLengthManager pour gérer les longueurs de coupe
   */
  constructor(barLengthManager, cutLengthManager) {
    this.barLengthManager = barLengthManager;
    this.cutLengthManager = cutLengthManager;
    // Récupère la longueur minimale de chute depuis l'élément HTML avec l'ID "barDrop"
    this.minDropLength = parseInt(document.getElementById("barDrop").value);
    // Récupère la largeur de la lame de scie depuis l'élément HTML avec l'ID "sawBladeSize"
    this.sawBladeSize = parseInt(document.getElementById("sawBladeSize").value);
    this.translationManager = new TranslationManager();
  }

  /**
   * Valide si les coupes peuvent être réalisées avec les barres disponibles
   * @returns {Object} - Objet contenant le statut de validation et un message
   */
  validateCuts() {
    // Convertit les longueurs de barres en nombres entiers
    const barLengths = this.barLengthManager.barLengths.map(bar => parseInt(bar.length));
    // Convertit les longueurs de coupe en nombres entiers
    const cutLengths = this.cutLengthManager.cutLengths.map(cut => parseInt(cut.cutLength));

    // Vérifie si chaque coupe peut être réalisée avec au moins une des barres disponibles
    for (let cut of cutLengths) {
      let canAccommodateCut = false;
      for (let bar of barLengths) {
        // Vérifie si la barre peut accueillir la coupe, la lame de scie et la chute minimale
        if (bar >= cut + this.sawBladeSize + this.minDropLength) {
          canAccommodateCut = true;
          break;
        }
      }
      // Si une coupe ne peut pas être réalisée, retourne une validation échouée avec un message
      if (!canAccommodateCut) {
        return {
          valid: false,
          message: this.translationManager.getTranslation('no_bar_available_error').replace('{length}', cut)
        };
      }
    }

    // Vérifie si la somme des longueurs des barres est suffisante pour accueillir toutes les coupes
    const totalBarLength = barLengths.reduce((acc, length) => acc + length, 0);
    const totalCutLength = cutLengths.reduce((acc, length) => acc + length + this.sawBladeSize, 0) + this.minDropLength * cutLengths.length;

    // Si la somme des longueurs des barres est insuffisante, retourne une validation échouée avec un message
    if (totalBarLength < totalCutLength) {
      return {
        valid: false,
        message: this.translationManager.getTranslation('insufficient_total_length_error')
          .replace('{barLength}', totalBarLength)
          .replace('{cutLength}', totalCutLength)
      };
    }

    // Si toutes les vérifications passent, retourne une validation réussie
    return { valid: true };
  }
}
