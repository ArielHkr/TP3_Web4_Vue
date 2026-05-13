<template>
  <main class="bg-light min-vh-100">
    <section class="bg-success text-white py-5">
      <div class="container">
        <h1 class="display-5 fw-bold">Nos emplacements</h1>
        <p class="lead mb-0">
          Choisissez l’emplacement parfait pour votre séjour en nature.
        </p>
      </div>
    </section>

    <section class="container py-5">
      <div class="mb-4">
        <label for="type" class="form-label">Filtrer par type</label>

        <select
          id="type"
          v-model="selectedType"
          class="form-select"
          @change="filterCampsites"
        >
          <option value="">Tous les types</option>

          <option
            v-for="type in campsiteStore.types"
            :key="type"
            :value="type"
          >
            {{ type }}
          </option>
        </select>
      </div>

      <div v-if="campsiteStore.isLoading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
        <p class="mt-3 text-muted">Chargement en cours...</p>
      </div>

      <div v-else-if="campsiteStore.campsites.length === 0" class="alert alert-warning">
        Aucun emplacement disponible.
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
<p v-if="campsiteStore.error">{{ campsiteStore.error }}</p>

        <CampsiteCard
          v-for="campsite in campsiteStore.campsites"
          :key="campsite.id"
          :campsite="campsite"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import CampsiteCard from '@/components/CampsiteCard.vue'
import { onMounted, ref } from 'vue'
import { useCampsiteStore } from '@/stores/campsite'

const campsiteStore = useCampsiteStore()
const selectedType = ref('')

const filterCampsites = () => {
  campsiteStore.getCampsites(selectedType.value)
}

onMounted(() => {
  campsiteStore.getCampsites()
})
</script>