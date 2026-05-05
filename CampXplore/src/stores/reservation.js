import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReservationStore = defineStore('reservation', () => {
  const reservation = ref(null)
  const reservations = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const apiUrl = import.meta.env.VITE_API_URL

  const getHeaders = () => {
  const apiKey = import.meta.env.VITE_API_KEY
  const token = localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    Authorization: `Bearer ${token}`,
  }
}
  const getReservation = async (id) => {
    isLoading.value = true
    error.value = null

    try {
      const res = await fetch(`${apiUrl}/api/reservations/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors du chargement de la réservation')
      }

      reservation.value = data.data
    } catch (err) {
      error.value = err.message
      console.log(err)
    } finally {
      isLoading.value = false
    }
  }

  const getReservations = async () => {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch(`${apiUrl}/api/reservations`, {
        method: 'GET',
        headers: getHeaders(),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors du chargement des réservations')
      }
      reservations.value = data.data || []
    } catch (err) {
      error.value = err.message
      console.log(err)
    } finally {
      isLoading.value = false
    }
  }

  const createReservation = async (reservationData) => {
  isLoading.value = true
  error.value = null
  try {
    const res = await fetch(`${apiUrl}/api/reservations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reservationData),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Erreur lors de la création de la réservation')
    }

    reservation.value = data.data
    reservations.value.push(data.data)

    return data.data
  } catch (err) {
    console.log(err)
    error.value = err.message
    throw err
  } finally {
    isLoading.value = false
  }
}
const updateReservation = async (id, reservationData) => {
  isLoading.value = true
    error.value = null

  try {
    const res = await fetch(`${apiUrl}/api/reservations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(reservationData),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Erreur lors de la modification de la réservation')
    }

    reservation.value = data.data

    reservations.value = reservations.value.map((item) =>
      item._id === id ? data.data : item
    )

    return data.data
  } catch (err) {
    console.log(err)
    error.value = err.message
    throw err
  } finally {
    isLoading.value = false
  }
}
const updateReservationStatus = async (id, status) => {
  isLoading.value = true
  error.value = null
  const apiUrl = import.meta.env.VITE_API_URL
  try {
    const res = await fetch(`${apiUrl}/api/reservations/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Erreur lors de la modification du statut')
    }

    reservation.value = data.data

    reservations.value = reservations.value.map((item) =>
      item._id === id ? data.data : item
    )

    return data.data
  } catch (err) {
    console.log(err)
    error.value = err.message

    throw err
  } finally {
    isLoading.value = false
  }
}
  return {
  reservation,
  reservations,
  isLoading,
  getReservation,
  getReservations,
  createReservation,
  updateReservation,
  updateReservationStatus,
  error
}
})