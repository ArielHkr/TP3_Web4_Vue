import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCampsiteStore = defineStore('campsite', () => {
  const campsites = ref([]);
  const isLoading = ref(false);
  const error = ref(null)
  const types = ref([
  'tente',
  'vr',
  'chalet',
  'glamping',
  'arrière-pays',
  'autre',
  ])
  const AuthHeaders = () => {
  const apiKey = import.meta.env.VITE_API_KEY
  const token = localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    Authorization: `Bearer ${token}`,
  }
}
  const verifierAuthentification = () => {
  const token = localStorage.getItem('token')
 
  if (!token) {
    throw new Error('Authentification requise.')
  }

  return token;
}
  const getCampsites = async (type = '') => {
    isLoading.value = true;
    error.value='';
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
     error.value = err.message;
      console.log(err);
    } finally {
      isLoading.value = false;
    }
  }
const campsite = ref(null)

const getCampsite = async (id) => {
  const apiUrl = import.meta.env.VITE_API_URL
  const apiKey = import.meta.env.VITE_API_KEY
  error.value=null;

  try {
    const res = await fetch(`${apiUrl}/api/campsites/${id}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    })

    const data = await res.json()

    if (!res.ok) {
    error.value = res.status;
    throw new Error(`Erreur (${res.status})`)
    }

    campsite.value = data.data
  } catch (err) {
    error.value = err.message;
    console.log(err)
  }
}

const creerCampsite = async (nouveauCampsite) => {
  isLoading.value = true
  const token = verifierAuthentification();
  error.value=null;
  const apiUrl = import.meta.env.VITE_API_URL

  try {
    const res = await fetch(`${apiUrl}/api/campsites`, {
      method: 'POST',
      headers: AuthHeaders(),
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
    error.value = err.message;
    console.log(err)
    throw err
  }
}
const ModifierCampsite = async (id, donnees) => {
  isLoading.value = true
  const token = verifierAuthentification();
  error.value=null;
  const apiUrl = import.meta.env.VITE_API_URL
  const apiKey = import.meta.env.VITE_API_KEY

  try {
    const res = await fetch(`${apiUrl}/api/campsites/${id}`, {
      method: 'PUT',
      headers: AuthHeaders(),
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
    error.value = err.message;
    console.error(err)
    throw err
  } finally {
    isLoading.value = false
  }
}
const archiverCampsite = async (id) =>{
   error.value=null;
   isLoading.value = true
   const token = verifierAuthentification();
   const apiUrl = import.meta.env.VITE_API_URL
   const apiKey = import.meta.env.VITE_API_KEY

   try{
    const res = await fetch(`${apiUrl}/api/campsites/${id}`, {
      method: 'DELETE',
      headers: AuthHeaders(),
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || `Erreur (${res.status})`)
    }
    await getCampsites();
   }catch(err){
    console.log(err)
    error.value = err.message;
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
     creerCampsite,
     error,
  }
})