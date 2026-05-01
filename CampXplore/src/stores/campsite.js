import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCampsiteStore = defineStore('campsite', () => {
  const campsites = ref([]);
  const isLoading = ref(false);
const types = ref([
  'tente',
  'vr',
  'chalet',
  'glamping',
  'arrière-pays',
  'autre',
])
  const getCampsites = async (type = '') => {
    isLoading.value = true;
    const filtre= type? `?type=${type}`:'';
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;

    try {
      const res = await fetch(`${apiUrl}/api/campsites${filtre}`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      })

      const data = await res.json();
      campsites.value = data.data;
    } catch (err) {
      console.log(err);
    } finally {
      isLoading.value = false;
    }
  }
const campsite = ref(null)

const getCampsite = async (id) => {
  const apiUrl = import.meta.env.VITE_API_URL
  const apiKey = import.meta.env.VITE_API_KEY

  try {
    const res = await fetch(`${apiUrl}/api/campsites/${id}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(`Erreur (${res.status})`)
    }

    campsite.value = data.data
  } catch (err) {
    console.log(err)
  }
}
  return {
    types,
    campsites,
    isLoading,
    getCampsites,
    getCampsite,
     campsite
  }
})