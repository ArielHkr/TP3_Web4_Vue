<template>
  <div class="bg-light min-vh-100">
    <div class="container py-5">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h1 class="fw-bold mb-3">Camping Nature</h1>

          <p class="text-muted fs-5">
            Réservez un emplacement confortable pour votre prochaine aventure
            en plein air.
          </p>

          <RouterLink :to="{ name: 'campsites' }" class="btn btn-success mt-3">
            Voir les emplacements
          </RouterLink>
        </div>

        <div class="col-md-6 mt-4 mt-md-0">
          <div class="bg-success text-white rounded-4 p-5 text-center shadow-sm">
            <h2 class="h4">Bienvenue au camping</h2>
            <p class="mb-0">
              Tentes, VR, chalets et glamping disponibles.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container pb-5">
      <h2 class="h4 fw-bold mb-4">Nos services</h2>

      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5">Emplacements tente</h3>
              <p class="text-muted mb-0">
                Parfaits pour dormir près de la nature.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5">VR et roulottes</h3>
              <p class="text-muted mb-0">
                Des terrains adaptés aux véhicules récréatifs.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body">
              <h3 class="h5">Chalets et glamping</h3>
              <p class="text-muted mb-0">
                Plus de confort pour un séjour relaxant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>