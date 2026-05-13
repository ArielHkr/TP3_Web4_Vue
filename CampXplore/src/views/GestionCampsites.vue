<template>
  <main class="container py-5">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <span class="badge text-bg-success rounded-pill mb-2">
          Administration
        </span>

        <h1 class="fw-bold text-success mb-1">
          Liste des emplacements
        </h1>

        <p class="text-muted mb-0">
          Gérez les emplacements disponibles pour les campeurs.
        </p>
      </div>

      <router-link
        class="btn btn-success btn-lg rounded-pill px-4"
        :to="{ name: 'CreerCampsite' }"
      >
        + Nouvel emplacement
      </router-link>
    </div>

    <div v-if="messageErreur" class="alert alert-danger rounded-4">
      {{ messageErreur }}
    </div>

    <div v-if="campsiteStore.error" class="alert alert-danger rounded-4">
      {{ campsiteStore.error }}
    </div>

    <div v-if="messageSuccess" class="alert alert-success rounded-4">
      {{ messageSuccess }}
    </div>

    <div v-if="campsiteStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-success mb-3" role="status"></div>
      <p class="text-muted">Chargement des emplacements...</p>
    </div>

    <div
      v-else-if="campsiteStore.campsites.length === 0"
      class="alert alert-warning rounded-4"
    >
      Aucun emplacement trouvé.
    </div>

    <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-success text-white py-3">
        <h2 class="h5 mb-0">
          Emplacements enregistrés
        </h2>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-4">Nom</th>
              <th>Lieu</th>
              <th>Type</th>
              <th>Capacité</th>
              <th>Prix/nuit</th>
              <th>Commodités</th>
              <th class="text-end pe-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="campsite in campsiteStore.campsites" :key="campsite._id">
              <td class="ps-4 fw-semibold">
                {{ campsite.name }}
              </td>

              <td class="text-muted">
                {{ campsite.location }}
              </td>

              <td>
                <span class="badge rounded-pill text-bg-success text-capitalize">
                  {{ campsite.type }}
                </span>
              </td>

              <td>
                {{ campsite.capacity }} personne(s)
              </td>

              <td class="fw-semibold text-success">
                {{ campsite.pricePerNight }} $
              </td>

              <td>
                <div v-if="campsite.amenities?.length" class="d-flex flex-wrap gap-1">
                  <span
                    v-for="amenity in campsite.amenities.slice(0, 3)"
                    :key="amenity"
                    class="badge rounded-pill bg-success-subtle text-success border border-success-subtle"
                  >
                    {{ amenity }}
                  </span>

                  <span
                    v-if="campsite.amenities.length > 3"
                    class="badge rounded-pill text-bg-light border"
                  >
                    +{{ campsite.amenities.length - 3 }}
                  </span>
                </div>

                <span v-else class="text-muted">
                  Aucune
                </span>
              </td>

              <td class="pe-4">
  <div class="d-flex justify-content-end flex-wrap gap-2">
    <router-link
      class="btn btn-sm btn-dark rounded-circle action-btn"
      :to="{ name: 'CampsiteDetailsView', params: { id: campsite._id } }"
      title="Voir les détails"
    >
      <i class="bi bi-eye"></i>
    </router-link>

    <router-link
      class="btn btn-sm btn-success rounded-circle action-btn"
      :to="{ name: 'UpdateCampsite', params: { id: campsite._id } }"
      title="Modifier"
    >
      <i class="bi bi-pencil-square"></i>
    </router-link>

    <button
      class="btn btn-sm btn-outline-dark rounded-circle action-btn"
      @click="ArchiverCampsite(campsite._id)"
      :disabled="campsiteStore.isLoading"
      title="Archiver"
    >
      <i class="bi bi-archive"></i>
    </button>
  </div>
</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCampsiteStore } from '@/stores/campsite'

const campsiteStore = useCampsiteStore()
const messageErreur = ref('')
const messageSuccess = ref('')
const ArchiverCampsite = async (id) => {
  messageErreur.value = ''
  messageSuccess.value = ''

  try {
    await campsiteStore.archiverCampsite(id)
    messageSuccess.value = "L'emplacement a été archivé avec succès."
  } catch (err) {
    messageErreur.value = err.message
  }
}
onMounted(() => {
  campsiteStore.getCampsites()
})
</script>
<style scoped>
.action-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-2px);
  transition: 0.2s ease;
}
</style>