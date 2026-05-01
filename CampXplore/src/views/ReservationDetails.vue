<template>
  <main class="container py-5">
    <button class="btn btn-outline-secondary mb-4" @click="router.back()">
      Retour
    </button>

    <div v-if="reservationStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3 text-muted">Chargement de la réservation...</p>
    </div>

    <div v-else-if="!reservationStore.reservation" class="alert alert-warning">
      Réservation introuvable.
    </div>

    <div v-else class="card shadow-sm border-0">
      <div class="card-body">
        <h1 class="h3 mb-4">Détails de la réservation</h1>

        <p>
          <strong>Utilisateur :</strong>
          {{ reservationStore.reservation.user.lastName }}
          {{ reservationStore.reservation.user.firstName }}
        </p>

        <p><strong>Email :</strong> {{ reservationStore.reservation.user.email }}</p>
        <p><strong>Campsite :</strong> {{ reservationStore.reservation.campsite.name }}</p>
        <p><strong>Date début :</strong> {{ formatDate(reservationStore.reservation.startDate) }}</p>
        <p><strong>Date fin :</strong> {{ formatDate(reservationStore.reservation.endDate) }}</p>
        <p><strong>Invités :</strong> {{ reservationStore.reservation.guests }}</p>
        <p><strong>Prix total :</strong> {{ reservationStore.reservation.totalPrice }} $</p>

        <p>
          <strong>Statut :</strong>

          <span
            class="badge bg-warning text-dark"
            v-if="reservationStore.reservation.status === 'pending'"
          >
            En attente
          </span>

          <span
            class="badge bg-success"
            v-else-if="reservationStore.reservation.status === 'confirmed'"
          >
            Confirmée
          </span>

          <span
            class="badge bg-danger"
            v-else-if="reservationStore.reservation.status === 'cancelled'"
          >
            Annulée
          </span>

          <span class="badge bg-secondary" v-else>
            {{ reservationStore.reservation.status }}
          </span>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationStore } from '@/stores/reservation'

const route = useRoute()
const router = useRouter()
const reservationStore = useReservationStore()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-CA')
}

onMounted(() => {
  reservationStore.getReservation(route.params.id)
})
</script>