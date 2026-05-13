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

const creerCampsite = async (nouveauCampsite) => {
  isLoading.value = true
  const token = localStorage.getItem('token')

  const apiUrl = import.meta.env.VITE_API_URL
  const apiKey = import.meta.env.VITE_API_KEY

  try {
    const res = await fetch(`${apiUrl}/api/campsites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(nouveauCampsite),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || `Erreur (${res.status})`)
    }

    campsites.value.push(data.data)

    campsite.value = data.data;
  } catch (err) {
      isLoading.value = false;

    console.log(err)
    throw err
  }
}
const ModifierCampsite = async (id, donnees) => {
  isLoading.value = true
  const token = localStorage.getItem('token')

  const apiUrl = import.meta.env.VITE_API_URL
  const apiKey = import.meta.env.VITE_API_KEY

  try {
    const res = await fetch(`${apiUrl}/api/campsites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': `Bearer ${token}`,

      },
      body: JSON.stringify(donnees),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || `Erreur (${res.status})`)
    }

    campsite.value = data.data

    const index = campsites.value.findIndex((c) => c._id === id)
    if (index !== -1) campsites.value[index] = data.data

    campsite.value = data.data;
  } catch (err) {
   isLoading.value = false;

    console.error(err)
    throw err
  } finally {
    isLoading.value = false
  }
}
const archiverCampsite = async (id) =>{
   isLoading.value = true
const token = localStorage.getItem('token')
   const apiUrl = import.meta.env.VITE_API_URL
   const apiKey = import.meta.env.VITE_API_KEY

   try{
    const res = await fetch(`${apiUrl}/api/campsites/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || `Erreur (${res.status})`)
    }
    await getCampsites();
   }catch(err){
    console.log(err)
    throw err;
   } finally {
    isLoading.value = false;
  }
}


  return {
    types,
    ModifierCampsite,
    campsites,
    isLoading,
    getCampsites,
    getCampsite,
     campsite,
     archiverCampsite,
     creerCampsite
  }
})