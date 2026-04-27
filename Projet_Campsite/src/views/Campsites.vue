<template>
  <p v-if="isLoading">Chargement en cours...</p>

  <p v-else-if="campsites.length === 0" class="col-12">
    Aucun Campsite
  </p>

  <Campsite
    v-else
    v-for="campsite in campsites"
    :key="campsite._id"
    :campsite="campsite"
  />
</template>

<script setup>
import Campsite from '@/components/Campsite.vue'
import { onMounted, ref } from 'vue'


const campsites = ref([])
const isLoading = ref(false)

const apiUrl = import.meta.env.VITE_x_api_url
const apiKey = import.meta.env.VITE_x_api_key
const getCampsites = async () => {
  isLoading.value = true
console.log(apiUrl)
console.log(apiKey)
  try {
    const res = await fetch(apiUrl + 'api/campsites',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const data = await res.json()
    campsites.value = data
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