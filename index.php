<!DOCTYPE html>
<html lang="fr" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="title">Optimisateur de découpe</title>
    <link rel="stylesheet" href="assets/CSS/bootstrap.min.css">
    <link rel="stylesheet" href="assets/CSS/style.css">
    <!-- favicon -->
    <link rel="icon" href="assets/Image/logo-optimisateur-de-decoupe.svg" type="image/x-icon">
</head>

<body>
    <header>
        <nav class="navbar navbar-expand-lg" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#"><img src="assets/Image/logo-optimisateur-de-decoupe.svg" alt="logo" srcset="" id="logo"></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#" onclick="location.reload(); return false; " data-i18n="recommencer">Recommencer</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <select id="languageSelector" class="form-select">
                                <option value="fr" data-i18n="fr">Français</option>
                                <option value="en" data-i18n="en">English</option>
                            </select>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <main>
        <h1 class="text-center" data-i18n="title">Optimisateur de découpe</h1>

        <form action="">
            <section class="d-flex justify-content-center">
                <div class="row col-md-6 m-3 d-flex justify-content-center">
                    <h2 class="text-center mt-3" data-i18n="informationGeneral">Information général</h2>
                    <div class="col-md-4 mt-2">
                        <label for="barDrop" data-i18n="barDrop">Chute de barre (minimum) </label>
                        <input type="text" class="form-control mt-1 bg-light text-dark" id="barDrop" name="barDrop" autocomplete="off" value="100">
                        <div class="valid-feedback" data-i18n="valid">
                            Validé!
                        </div>
                    </div>
                    <div class="col-md-4 mt-2">
                        <label for="sawBladeSize" data-i18n="sawBladeSize">Trait de scie</label>
                        <input type="text" class="form-control mt-1 bg-light text-dark" id="sawBladeSize" name="sawBladeSize" autocomplete="off" value="2">
                        <div class="valid-feedback" data-i18n="valid">
                            Validé!
                        </div>
                    </div>

                    <!-- Inputs Row -->
                    <div class="row">
                        <h2 class="text-center my-3" data-i18n="cutInformation">Information de découpe</h2>
                        <div class="col-md-6 my-3">
                            <div class="input-group has-validation mb-3 row">
                                <div class="col col-10 col-md-6">
                                    <label for="cutLength" class="form-label" data-i18n="cutToDo">Coupe (à réaliser)</label>
                                    <input type="text" class="form-control bg-light text-dark" name="cutLength" id="cutLength" autocomplete="off">
                                    <div class="valid-feedback" data-i18n="valid">
                                        Validé!
                                    </div>
                                </div>
                                <div class="col col-10 col-md-6">
                                    <label for="of" class="form-label" data-i18n="work_order">OF</label>
                                    <input type="text" class="form-control bg-light text-dark" name="of" id="of" autocomplete="off">
                                    <div class="valid-feedback" data-i18n="valid">
                                        Validé!
                                    </div>
                                </div>
                                <div class="col col-10 col-md-6">
                                    <label for="cutQt" class="form-label mt-1" data-i18n="qt">Qté</label>
                                    <input type="text" class="form-control bg-light text-dark" name="cutQt" id="cutQt" autocomplete="off" value="1">
                                    <div class="valid-feedback" data-i18n="valid">
                                        Validé!
                                    </div>
                                </div>
                                <div>
                                    <button class="btn btn-primary mt-2" id="addCutLength" type="button" data-i18n="add">Ajouter</button>
                                </div>
                            </div>
                            <!-- Placeholder for Liste de découpe avec l'OF -->
                            <div class="info-display">
                                <div class="info-display-inner" id="cutLengthDisplay">
                                    <!-- Les éléments ajoutés seront insérés ici -->

                                </div>

                            </div>
                            <div>
                                <span data-i18n="totalCutLength">Longueur total des coupes</span> 
                                <p id="totalCutLength">0</p> 
                                <span data-i18n="totalCutQt">Nombre de coupe</span> 
                                <p id="totalCutQt">0</p>
                            </div>
                        </div>

                        <div class="col-md-6 my-3">
                            <div class="input-group has-validation mb-3 row">
                                <div class="col col-10 col-md-7">
                                    <label for="barLength" class="form-label" data-i18n="bar">Barre (BRUT)</label>
                                    <input type="text" class="form-control bg-light text-dark" name="barLength" id="barLength" autocomplete="off">
                                    <div class="valid-feedback" data-i18n="valid">
                                        Validé!
                                    </div>
                                </div>
                                <div class="col col-6 mt-1">
                                    <label for="qte" class="form-label" data-i18n="qt">Qté</label>
                                    <input type="text" class="form-control bg-light text-dark" name="qte" id="qte" autocomplete="off" value="1">
                                    <div class="valid-feedback" data-i18n="valid">
                                        Validé!
                                    </div>
                                </div>
                                <div>
                                    <button class="btn btn-primary mt-2" id="addBarLength" type="button" data-i18n="add">Ajouter</button>
                                </div>
                            </div>
                            <!-- Placeholder for Liste de barre à couper -->
                            <div class="info-display">
                                <div class="info-display-inner" id="barrLenghtDisplay">
                                    <!-- Les éléments ajoutés seront insérés ici -->

                                </div>

                            </div>
                            <div>
                                <span data-i18n="totalBarLength">Longueur total des barres</span> : <p id="totalBarLength">0</p> 
                                <span data-i18n="totalBarQt">Nombre de barre</span> : <p id="totalBarQt">0</p>
                            </div>
                        </div>

                    </div>

                    <!-- Optimize Button Row -->
                    <div class="row">
                        <div class="col text-center">
                            <button class="btn btn-success btn-lg" id="optimizeButton" type="button" data-i18n="optimize">Optimiser</button>
                        </div>
                    </div>
                </div>
            </section>
        </form>
        <div class="container text-center">
            <div id="alertDiv" class="alert alert-danger d-none col col-6 mx-auto" role="alert">
                <!-- Le message d'erreur sera inséré ici -->
            </div>
        </div>
        <section class="col col-md-8 col-12 text-center mx-auto mb-3">
            <div id="resultOptimize" class="d-none text-center">
                <h2 data-i18n="resultOptimize">Résultats de l'Optimisation</h2>
                <div id="optimizationDetails"></div>
                <form id="pdfForm" method="post" action="API/generate_pdf.api.php">
                    <input type="hidden" name="tableHtml" id="tableHtml">
                    <button type="submit" class="btn btn-primary" id="generatePDFButton" data-i18n="printPDF">Imprimer en PDF</button>
                </form>
            </div>
        </section>





        <!-- Menu contextuel -->
        <div id="contextMenuCut" class="context-menu" style="display: none;">
            <div class="context-menu-item" id="editItemCut" data-i18n="modify">Modifier</div>
            <div class="context-menu-item" id="deleteItemCut" data-i18n="delete">Supprimer</div>
        </div>
        <div id="contextMenuBar" class="context-menu" style="display: none;">
            <div class="context-menu-item" id="editItemBar" data-i18n="modify">Modifier</div>
            <div class="context-menu-item" id="deleteItemBar" data-i18n="delete">Supprimer</div>
        </div>

    </main>





    <script type="module" src="assets/JS/mainscript.js"></script>
    <script src="assets/JS/bootstrap.bundle.min.js"></script>
</body>

</html>