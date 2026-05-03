import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false);
  const error = ref('');
  const success = ref('');
  const user = ref(null);

  const apiUrl = import.meta.env.VITE_API_URL
  const apiKey = import.meta.env.VITE_API_KEY

  const register = async (form) => {
    isLoading.value = true
    error.value = ''
    success.value = ''
    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de l’inscription')
      }

      success.value = 'Compte créé avec succès.'
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  const login = async (email, password) => {
    isLoading.value = true
    error.value = ''

    try {
      const resp = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await resp.json()

      if (!resp.ok) {
        error.value = "Nom d'utilisateur ou mot de passe invalide"
        return false
      }

      localStorage.setItem('token', data.data.token)
      return true
    } catch (err) {
      console.error(err)
      error.value = 'Erreur de connexion'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getUser = async () => {
    isLoading.value=false;
   try{
    const token = localStorage.getItem('token');
    const res = await fetch(`${apiUrl}/api/auth/profile`, {
      method : 'GET',
      headers: {
        'Content-Type': 'application/json',
      'x-api-key': apiKey,
      Authorization: `Bearer ${token}`,
      },
    })
    const result = await res.json();
    if(!res.ok){
        throw new Error(result.message || 'Erreur lors de la récupération.')
    }
    user.value = result.data;
   }
   catch(err){
      error.value = err.message;
      return false;
   }
  }
 const userUpdate = async (firstName, lastName, phone, role) => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  const token = localStorage.getItem('token')

  try {
    const res = await fetch(`${apiUrl}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, phone, role }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || `Erreur lors de la mise à jour de l'utilisateur.`)
    }

    user.value = result.data
    success.value = 'Mise à jour réussie.'
    return true
  } catch (err) {
    error.value = err.message
    return false
  } finally {
    isLoading.value = false
  }
}

  const changerMotDePasse = async (currentPassword, newPassword) => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  const token = localStorage.getItem('token')

  try {
    const res = await fetch(`${apiUrl}/api/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || 'Erreur lors du changement de mot de passe.')
    }

    success.value = 'Mot de passe modifié avec succès.'
    return true
  } catch (err) {
    error.value = err.message
    return false
  } finally {
    isLoading.value = false
  }
}
  return {
    isLoading,
    error,
    success,
    register,
    login,
    getUser,
    user,
    changerMotDePasse,
    userUpdate
  }
})