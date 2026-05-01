import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoading = ref(false)
  const error = ref('')
  const success = ref('')

  const register = async (form) => {
    isLoading.value = true
    error.value = ''
    success.value = ''

    const apiUrl = import.meta.env.VITE_API_URL
    const apiKey = import.meta.env.VITE_API_KEY

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

    const apiUrl = import.meta.env.VITE_API_URL
    const apiKey = import.meta.env.VITE_API_KEY

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

  return {
    isLoading,
    error,
    success,
    register,
    login,
  }
})