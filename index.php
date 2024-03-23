<!DOCTYPE html>
<html lang="fr" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Optimisateur de découpe</title>
    <link rel="stylesheet" href="assets/CSS/style.css">
    <link rel="stylesheet" href="assets/CSS/bootstrap.min.css">
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
                        <label for="nom">Chute de barre</label>
                        <input type="text" class="form-control mt-1" id="barDrop" name="barDrop" required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                    </div>
                    <div class="col-md-4 mt-2">
                        <label for="nom">Taille de la lame de scie</label>
                        <input type="text" class="form-control mt-1" id="sawBladeSize" name="sawBladeSize" required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                    </div>


                    <!-- Inputs Row -->

                    <div class="row">
                        <h2 class="text-center mt-3">Information de découpe</h2>
                        <div class="col-md-6 mb-3">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Longueur à couper">
                                <input type="text" class="form-control" placeholder="OF">
                                <button class="btn btn-primary">Ajouter</button>
                            </div>
                            <!-- Placeholder for Liste de découpe avec l'OF -->
                            <div class="p-3 border bg-light">Liste de découpe avec l'OF</div>


                        </div>



                        <div class="col-md-6 mb-3">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Barre a couper">
                                <button class="btn btn-primary">Ajouter</button>
                            </div>
                            <!-- Placeholder for Liste de barre à couper -->
                            <div class="p-3 border bg-light">Liste de barre à couper</div>
                        </div>

                    </div>



                    <!-- Optimize Button Row -->
                    <div class="row">
                        <div class="col text-center">
                            <button class="btn btn-success btn-lg">Optimiser</button>
                        </div>
                    </div>
                </div>





            </section>




        </form>



    </main>





    <script src="assets/JS/mainscript.js"></script>
    <script src="assets/JS/bootstrap.bundle.min.js"></script>
</body>

</html>