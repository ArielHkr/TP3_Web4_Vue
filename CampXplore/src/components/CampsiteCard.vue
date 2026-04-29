<template>
  <div class="col">
    <div class="card shadow-sm h-100">
      <div class="card-body">
        <h2>{{ campsite.name }}</h2>

        <p class="mb-1">
          <strong>Lieu :</strong> {{ campsite.location }}
        </p>

        <p>
          {{ campsite.description?.substring(0, 75) || "Aucune description disponible" }}...
        </p>

        <p class="mb-1">
          <strong>Type :</strong> {{ campsite.type }}
        </p>

        <p class="mb-1">
          <strong>Prix :</strong> {{ campsite.pricePerNight }} $ / nuit
        </p>

        <p class="mb-1">
          <strong>Capacité :</strong> {{ campsite.capacity }} personne(s)
        </p>

        <p v-if="campsite.maxVehicleLength" class="mb-1">
          <strong>Longueur max véhicule :</strong>
          {{ campsite.maxVehicleLength }} m
        </p>

        <p v-if="campsite.amenities?.length">
          <strong>Commodités :</strong>
          {{ campsite.amenities.join(", ") }}
        </p>
          <RouterLink :to="{ name: 'CampsiteDetailsView', params: { id: campsite._id } }"
          >Détails</RouterLink
        >
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
