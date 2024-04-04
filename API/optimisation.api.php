<?php

header("Content-Type: application/json");

// Récupère le corps de la requête POST qui est au format JSON
$json = file_get_contents('php://input');

// Convertit le JSON reçu en objet PHP
$data = json_decode($json);

// Votre logique pour traiter $data...
// Par exemple, vérifier que les données sont valides, effectuer des calculs, etc.

// Pour finir, vous pouvez renvoyer une réponse au client
$response = [
    'status' => 'success',
    'message' => 'Optimisation traitée avec succès.',
    // Vous pouvez ajouter d'autres clés selon les besoins de votre application
];

// Envoie la réponse en JSON
echo json_encode($response);
?>