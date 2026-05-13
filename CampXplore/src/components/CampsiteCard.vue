<template>
  <div class="col">
    <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden campsite-card">
      <div class="card-body p-4 d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 class="h5 fw-bold text-success mb-1">
              {{ campsite.name }}
            </h2>

            <p class="text-muted mb-0">
              <i class="bi bi-geo-alt-fill text-success me-1"></i>
              {{ campsite.location }}
            </p>
          </div>

          <span class="badge text-bg-success rounded-pill text-capitalize px-3 py-2">
            {{ campsite.type }}
          </span>
        </div>

        <p class="text-muted mb-3">
          {{ campsite.description?.substring(0, 75) || "Aucune description disponible" }}...
        </p>

        <div class="border-top border-success-subtle pt-3 mb-3">
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Prix</span>
            <strong class="text-success">
              {{ campsite.pricePerNight }} $ / nuit
            </strong>
          </div>

          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Capacité</span>
            <strong>{{ campsite.capacity }} personne(s)</strong>
          </div>

          <div
            v-if="campsite.maxVehicleLength"
            class="d-flex justify-content-between mb-2"
          >
            <span class="text-muted">Véhicule max</span>
            <strong>{{ campsite.maxVehicleLength }} m</strong>
          </div>
        </div>

        <div v-if="campsite.amenities?.length" class="mb-4">
          <p class="fw-semibold text-success mb-2">
            Commodités
          </p>

          <div class="d-flex flex-wrap gap-2">
            <span
              v-for="amenity in campsite.amenities"
              :key="amenity"
              class="badge rounded-pill bg-success-subtle text-success border border-success-subtle"
            >
              {{ amenity }}
            </span>
          </div>
        </div>

        <RouterLink
          :to="{ name: 'CampsiteDetailsView', params: { id: campsite._id } }"
          class="btn btn-success w-100 mt-auto rounded-pill fw-semibold"
        >
          Réserver
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  campsite: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.campsite-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-top: 4px solid #198754 !important;
}

.campsite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(25, 135, 84, 0.18) !important;
}
</style>