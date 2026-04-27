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
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
        <p class="mt-3 text-muted">Chargement en cours...</p>
      </div>

      <div v-else-if="campsites.length === 0" class="alert alert-warning">
        Aucun emplacement disponible.
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <Campsite
          v-for="campsite in campsites"
          :key="campsite._id"
          :campsite="campsite"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import Campsite from '@/components/Campsite.vue'
import { onMounted, ref } from 'vue'

const campsites = ref([])
const isLoading = ref(false)

const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY

const getCampsites = async () => {
  isLoading.value = true

  try {
    const res = await fetch(`${apiUrl}/api/campsites`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    })

    const data = await res.json()
    campsites.value = data.data
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getCampsites()
})
</script>