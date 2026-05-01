<template>
  <main class="container py-5">
    <h1 class="mb-4">Réservations</h1>

    <div v-if="reservationStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3 text-muted">Chargement des réservations...</p>
    </div>

    <div
      v-else-if="!reservationStore.reservations || reservationStore.reservations.length === 0"
      class="alert alert-warning"
    >
      Aucune réservation faite
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
            <th>Détails</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="reservation in reservationStore.reservations" :key="reservation._id">
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
            <td>
              <router-link
                class="btn btn-sm btn-outline-primary"
                :to="{ name: 'ReservationDetails', params: { id: reservation._id } }"
                title="Voir les détails"
              >
                👁️
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservation'

const reservationStore = useReservationStore()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-CA')
}

onMounted(() => {
  reservationStore.getReservations()
})
</script>