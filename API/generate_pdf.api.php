<?php
require_once '../vendor/autoload.php';

if (isset($_POST['tableHtml'])) {
    $tableHtml = $_POST['tableHtml'];
} else {
    die("Aucun contenu HTML fourni.");
}

// Filtrer les lignes sans coupes
libxml_use_internal_errors(true);
$dom = new DOMDocument();
$dom->loadHTML($tableHtml);
$xpath = new DOMXPath($dom);
$rows = $xpath->query("//tr[td[2][not(contains(., 'OF'))]]");
foreach ($rows as $row) {
    $row->parentNode->removeChild($row);
}
$filteredHtml = $dom->saveHTML();

// Ajouter une bordure solide aux cellules
$filteredHtml = str_replace("<td", "<td style='border: 1px solid black;'", $filteredHtml);
$filteredHtml = str_replace("<th", "<th style='border: 1px solid black;'", $filteredHtml);

// Ajouter la date et l'heure au titre du PDF
$date = date("d-m-Y H:i:s");
$title = "Résultats de l'Optimisation - $date";

$mpdf = new \Mpdf\Mpdf();

$html = '<html><body>';
$html .= "<h2>$title</h2>";
$html .= $filteredHtml;
$html .= '</body></html>';

$mpdf->WriteHTML($html);

// Générer le nom du fichier avec la date et l'heure
$filename = 'opti_' . date("Ymd_His") . '.pdf';

$mpdf->Output($filename, 'D');
