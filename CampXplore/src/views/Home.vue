<template>
  <div class="home-page min-vh-100">
    <section class="hero-section text-white">
      <div class="container">
        <div class="hero-content col-lg-7">
          <span class="badge bg-light text-success mb-3">Camping Nature</span>

          <h1 class="display-3 fw-bold mb-4">
            Dormez sous les étoiles
          </h1>

          <p class="fs-4 mb-4">
            Réservez facilement un emplacement pour tente, VR, chalet ou glamping.
          </p>

          <RouterLink :to="{ name: 'campsites' }" class="btn btn-light btn-lg">
            Voir les emplacements
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="container search-wrapper">
      <div class="search-box shadow-lg">
        <h2 class="h4 fw-bold mb-4">Trouver un séjour</h2>

        <form @submit.prevent="lancerRecherche" class="row g-3 align-items-end" novalidate>
          <div class="col-lg-3">
            <label class="form-label">Date de début</label>
            <input type="date" class="form-control" v-model="dateDebut" :min="today" />
          </div>

          <div class="col-lg-3">
            <label class="form-label">Date de fin</label>
            <input type="date" class="form-control" v-model="dateFin" :min="minDateFin" />
          </div>

          <div class="col-lg-3">
            <label class="form-label">Nb de personnes</label>
            <input type="number" class="form-control" v-model.number="nbPersonnes" min="1" />
          </div>

          <div class="col-lg-3">
            <label class="form-label">Type</label>
            <select class="form-select" v-model="type">
             <option value="">Tous les types</option>
            <option value="tente">Tente</option>
            <option value="rv">RV</option>
             <option value="chalet">Chalet</option>
            <option value="glamping">Glamping</option>
           <option value="arriere-pays">Arrière-pays</option>
            <option value="autre">Autre</option>
</select>
          </div>

          <div class="col-lg-3">
            <button type="submit" class="btn btn-success w-100">
              Rechercher
            </button>
          </div>
        </form>

        <div v-if="erreur" class="alert alert-danger mt-4 mb-0">
          {{ erreur }}
        </div>
      </div>
    </section>

    <section class="container py-5">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
        <p class="mt-3 text-muted">Chargement en cours...</p>
      </div>

      <div
        v-else-if="rechercheEffectuee && campsites.length === 0"
        class="alert alert-warning rounded-4"
      >
        Aucun emplacement trouvé pour cette recherche.
      </div>

      <div
        v-else-if="campsites.length > 0"
        class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
      >
        <CampsiteCard
          v-for="campsite in campsites"
          :key="campsite._id"
          :campsite="campsite"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CampsiteCard from "@/components/CampsiteCard.vue";

const isLoading = ref(false);
const campsites = ref([]);
const rechercheEffectuee = ref(false);

const dateDebut = ref("");
const dateFin = ref("");
const nbPersonnes = ref(1);
const type = ref("");
const erreur = ref("");

const today = new Date().toISOString().split("T")[0];

const minDateFin = computed(() => {
  return dateDebut.value || today;
});

const lancerRecherche = async () => {
  erreur.value = "";
  rechercheEffectuee.value = false;

  if (!dateDebut.value || !dateFin.value || nbPersonnes.value < 1) {
    erreur.value = "Veuillez remplir tous les champs correctement.";
    return;
  }

  if (dateDebut.value < today) {
    erreur.value = "La date de début ne peut pas être dans le passé.";
    return;
  }

  if (dateFin.value < dateDebut.value) {
    erreur.value = "La date de fin doit être après la date de début.";
    return;
  }

  isLoading.value = true;

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  try {
       const typeQuery = type.value ? `&type=${type.value}` : "";

      const url = `${apiUrl}/api/campsites/available?startDate=${dateDebut.value}&endDate=${dateFin.value}&capacity=${nbPersonnes.value}${typeQuery}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    });

    rechercheEffectuee.value = true;

    if (!res.ok) {
      campsites.value = [];
      erreur.value = "";
      return;
    }

    const data = await res.json();
    campsites.value = data.data || [];
  } catch (err) {
    campsites.value = [];
    erreur.value = "Une erreur est survenue pendant la recherche.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.home-page {
  background: #f3f4ef;
}

.hero-section {
  min-height: 520px;
  background:
    linear-gradient(rgba(10, 35, 20, 0.65), rgba(10, 35, 20, 0.65)),
    url("@/assets/IMG_Camp.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}

.hero-content {
  padding-bottom: 80px;
}

.search-wrapper {
  margin-top: -80px;
  position: relative;
  z-index: 2;
}

.search-box {
  background: white;
  border-radius: 24px;
  padding: 32px;
}
</style>