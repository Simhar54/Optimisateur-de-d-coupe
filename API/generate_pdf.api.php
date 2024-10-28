<?php
// Inclusion de l'autoloader de Composer pour charger les dépendances
require_once '../vendor/autoload.php';

/**
 * Vérifie si le contenu HTML de la table est envoyé via POST.
 * Si oui, l'assigne à la variable $tableHtml, sinon termine le script avec un message d'erreur.
 */
if (isset($_POST['tableHtml'])) {
    $tableHtml = $_POST['tableHtml'];
} else {
    die("Aucun contenu HTML fourni.");
}

// Activer les erreurs internes de libxml pour éviter les warnings inutiles
libxml_use_internal_errors(true);

// Chargement du contenu HTML dans un objet DOMDocument
$dom = new DOMDocument('1.0', 'UTF-8'); // Spécifie l'encodage en UTF-8
$dom->loadHTML(mb_convert_encoding($tableHtml, 'HTML-ENTITIES', 'UTF-8'));

// Utilisation de DOMXPath pour sélectionner les lignes sans "OF" dans la deuxième cellule
$xpath = new DOMXPath($dom);
$rows = $xpath->query("//tr[td[2][not(contains(., 'OF'))]]");

// Suppression des lignes sélectionnées
foreach ($rows as $row) {
    $row->parentNode->removeChild($row);
}

// Sauvegarde du HTML filtré
$filteredHtml = $dom->saveHTML();

// Ajout de bordures solides aux cellules de la table
$filteredHtml = str_replace("<td", "<td style='border: 1px solid black;'", $filteredHtml);
$filteredHtml = str_replace("<th", "<th style='border: 1px solid black;'", $filteredHtml);

// Ajout de la date et l'heure au titre du PDF
$date = date("d-m-Y H:i:s");
$title = "Résultats de l'Optimisation - $date";

// Création d'une instance de Mpdf
$mpdf = new \Mpdf\Mpdf(['tempDir' => __DIR__ . '/tmp', 'mode' => 'UTF-8']);

// Création du contenu HTML pour le PDF
$html = '<html><head><meta charset="UTF-8"></head><body>';
$html .= "<h2>$title</h2>";
$html .= $filteredHtml;
$html .= '</body></html>';

// Écriture du contenu HTML dans le PDF
$mpdf->WriteHTML($html);

// Génération du nom de fichier avec la date et l'heure actuelles
$filename = 'opti_' . date("Ymd_His") . '.pdf';

// Envoi du PDF au navigateur pour téléchargement
$mpdf->Output($filename, 'D');
