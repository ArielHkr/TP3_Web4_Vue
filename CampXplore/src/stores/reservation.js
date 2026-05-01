import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReservationStore = defineStore('reservation', () => {
  const reservation = ref(null)
  const isLoading = ref(false)

  const getReservation = async (id) => {
    isLoading.value = true

    const apiUrl = import.meta.env.VITE_API_URL
    const apiKey = import.meta.env.VITE_API_KEY
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${apiUrl}/api/reservations/${id}`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      reservation.value = data.data
    } catch (err) {
      console.log(err)
    } finally {
      isLoading.value = false
    }
  }
const reservations = ref([])

const getReservations = async () => {
  isLoading.value = true

  const apiUrl = import.meta.env.VITE_API_URL
  const apiKey = import.meta.env.VITE_API_KEY
  const token = localStorage.getItem('token')

  try {
    const res = await fetch(`${apiUrl}/api/reservations`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    reservations.value = data.data || []
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}
  return {
    reservation,
    isLoading,
    getReservation,
    getReservations,
    reservations
  }
})