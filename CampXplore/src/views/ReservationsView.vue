<template>
  <main class="container py-5">
    <h1 class="mb-4">Réservations</h1>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3 text-muted">Chargement des réservations...</p>
    </div>

    <div v-else-if="reservations.length === 0" class="alert alert-warning">
      Aucune réservation trouvée.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>Utilisateur</th>
            <th>Campsite</th>
            <th>Date début</th>
            <th>Date fin</th>
            <th>Invités</th>
            <th>Prix total</th>
            <th>Statut</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="reservation in reservations" :key="reservation._id">
            <td>{{ reservation.user.lastName }} {{ reservation.user.firstName }}</td>
            <td>{{ reservation.campsite.name }}</td>
            <td>{{ formatDate(reservation.startDate) }}</td>
            <td>{{ formatDate(reservation.endDate) }}</td>
            <td>{{ reservation.guests }}</td>
            <td>{{ reservation.totalPrice }} $</td>
            <td>
              <span class="badge bg-warning text-dark" v-if="reservation.status === 'pending'">
                En attente
              </span>
              <span class="badge bg-success" v-else-if="reservation.status === 'confirmed'">
                Confirmée
              </span>
              <span class="badge bg-danger" v-else-if="reservation.status === 'cancelled'">
                Annulée
              </span>
              <span class="badge bg-secondary" v-else>
                {{ reservation.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const reservations = ref([])
const isLoading = ref(false)

const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY

const getReservations = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiUrl}/api/reservations`, {
    method: 'GET',
    headers: {
    'x-api-key': apiKey,
    Authorization: `Bearer ${token}`,
  },
  })
  
    const data = await res.json()
    console.log(data);
    reservations.value = data.data
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-CA')
}

onMounted(() => {
  getReservations()
})
</script>