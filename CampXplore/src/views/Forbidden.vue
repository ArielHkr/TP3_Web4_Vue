<template>
  <main class="container py-5 text-center">
    <div class="card shadow-sm border-0 mx-auto">
      <div class="card-body p-5">
        <h1 class="display-4 text-danger mb-3">403</h1>

        <h2 class="h4 mb-3">Accès interdit</h2>

        <p class="text-muted mb-4">
          Tu n’as pas les permissions nécessaires pour accéder à cette page.
        </p>

        <router-link to="/" class="btn btn-primary">
          Retour à l’accueil
        </router-link>
      </div>
    </div>
  </main>
</template>