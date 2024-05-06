<!DOCTYPE html>
<html lang="fr" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Optimisateur de découpe</title>
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
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Nouveau</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <main>
        <h1 class="text-center">Optimisateur de découpe</h1>

        <form action="">
            <section class="d-flex justify-content-center">
                <div class="row col-md-6 m-3 d-flex justify-content-center">
                    <h2 class="text-center mt-3">Information général</h2>
                    <div class="col-md-4 mt-2">
                        <label for="barDrop">Chute de barre (minimum) </label>
                        <input type="text" class="form-control mt-1 bg-light text-dark" id="barDrop" name="barDrop" autocomplete="off" value="100">
                        <div class="valid-feedback">
                            Validé!
                        </div>
                    </div>
                    <div class="col-md-4 mt-2">
                        <label for="sawBladeSize">Trait de scie</label>
                        <input type="text" class="form-control mt-1 bg-light text-dark" id="sawBladeSize" name="sawBladeSize" autocomplete="off" value="2">
                        <div class="valid-feedback">
                            Validé!
                        </div>
                    </div>

                    <!-- Inputs Row -->
                    <div class="row">
                        <h2 class="text-center my-3">Information de découpe</h2>
                        <div class="col-md-6 my-3">
                            <div class="input-group has-validation mb-3 row">
                                <div class="col col-10 col-md-6">
                                    <label for="cutLength" class="form-label">Coupe (à réaliser)</label>
                                    <input type="text" class="form-control bg-light text-dark" name="cutLength" id="cutLength" autocomplete="off">
                                    <div class="valid-feedback">
                                        Validé!
                                    </div>
                                </div>
                                <div class="col col-10 col-md-6">
                                    <label for="of" class="form-label">OF</label>
                                    <input type="text" class="form-control bg-light text-dark" name="of" id="of" autocomplete="off">
                                    <div class="valid-feedback">
                                        Validé!
                                    </div>
                                </div>
                                <div>
                                    <button class="btn btn-primary mt-2" id="addCutLength" type="button">Ajouter</button>
                                </div>
                            </div>
                            <!-- Placeholder for Liste de découpe avec l'OF -->
                            <div class="info-display">
                                <div class="info-display-inner" id="cutLengthDisplay">
                                    <!-- Les éléments ajoutés seront insérés ici -->

                                </div>

                            </div>
                            <div>Longueur total des coupes : <p id="totalCutLength">0</p>
                            </div>
                        </div>

                        <div class="col-md-6 my-3">
                            <div class="input-group has-validation mb-3 row">
                                <div class="col col-10 col-md-7">
                                    <label for="barLength" class="form-label">Barre (BRUT)</label>
                                    <input type="text" class="form-control bg-light text-dark" name="barLength" id="barLength" autocomplete="off">
                                    <div class="valid-feedback">
                                        Looks good!
                                    </div>
                                </div>
                                <div class="col col-3">
                                    <label for="qte" class="form-label">Qté</label>
                                    <input type="text" class="form-control bg-light text-dark" name="qte" id="qte" autocomplete="off" value="1">
                                    <div class="valid-feedback">
                                        Looks good!
                                    </div>
                                </div>
                                <div>
                                    <button class="btn btn-primary mt-2" id="addBarLength" 0 type="button">Ajouter</button>
                                </div>
                            </div>
                            <!-- Placeholder for Liste de barre à couper -->
                            <div class="info-display">
                                <div class="info-display-inner" id="barrLenghtDisplay">
                                    <!-- Les éléments ajoutés seront insérés ici -->

                                </div>

                            </div>
                            <div>Longueur total des barres : <p id="totalBarLength">0</p>
                            </div>
                        </div>

                    </div>

                    <!-- Optimize Button Row -->
                    <div class="row">
                        <div class="col text-center">
                            <button class="btn btn-success btn-lg" id="optimizeButton" type="button">Optimiser</button>
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
        <div id="resultOptimize" class="d-none text-center">
            <h2>Résultats de l'Optimisation</h2>
            <div id="optimizationDetails"></div>
        </div>




        <!-- Menu contextuel -->
        <div id="contextMenuCut" class="context-menu" style="display: none;">
            <div class="context-menu-item" id="editItemCut">Modifier</div>
            <div class="context-menu-item" id="deleteItemCut">Supprimer</div>
        </div>
        <div id="contextMenuBar" class="context-menu" style="display: none;">
            <div class="context-menu-item" id="editItemBar">Modifier</div>
            <div class="context-menu-item" id="deleteItemBar">Supprimer</div>
        </div>

    </main>





    <script type="module" src="assets/JS/mainscript.js"></script>
    <script src="assets/JS/bootstrap.bundle.min.js"></script>
</body>

</html>