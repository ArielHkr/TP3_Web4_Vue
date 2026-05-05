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
            v-if="reservationStore.reservation.status === 'pending'"
            class="badge bg-warning text-dark"
          >
            En attente
          </span>

          <span
            v-else-if="reservationStore.reservation.status === 'confirmed'"
            class="badge bg-success"
          >
            Confirmée
          </span>

          <span
            v-else-if="reservationStore.reservation.status === 'cancelled'"
            class="badge bg-danger"
          >
            Annulée
          </span>

          <span v-else class="badge bg-secondary">
            {{ reservationStore.reservation.status }}
          </span>
        </p>

        <div class="mt-4">
          <button
            v-if="reservationStore.reservation.status === 'pending'"
            class="btn btn-outline-danger"
            :disabled="reservationStore.isLoading"
            @click="showCancelModal = true"
          >
            Annuler la réservation
          </button>

          <p v-else class="text-muted mb-0">
            N/A
          </p>
        </div>

        <p v-if="successMessage" class="text-success mt-3">
          {{ successMessage }}
        </p>

        <p v-if="reservationStore.error" class="text-danger mt-3">
          {{ reservationStore.error }}
        </p>
      </div>
    </div>

    <div
      v-if="showCancelModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmer l’annulation</h5>
            <button
              type="button"
              class="btn-close"
              @click="showCancelModal = false"
            ></button>
          </div>

          <div class="modal-body">
            <p class="mb-0">
              Voulez-vous vraiment annuler cette réservation ?
            </p>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showCancelModal = false"
            >
              Non, garder
            </button>

            <button
              type="button"
              class="btn btn-danger"
              :disabled="reservationStore.isLoading"
              @click="confirmCancelReservation"
            >
              Confirmer l’annulation
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCancelModal" class="modal-backdrop fade show"></div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationStore } from '@/stores/reservation'

const route = useRoute()
const router = useRouter()
const reservationStore = useReservationStore()

const successMessage = ref('')
const showCancelModal = ref(false)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-CA')
}

const confirmCancelReservation = async () => {
  successMessage.value = ''

  try {
    await reservationStore.updateReservationStatus(route.params.id, 'cancelled')
    successMessage.value = 'Réservation annulée avec succès.'
    showCancelModal.value = false
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  reservationStore.getReservation(route.params.id)
})
</script>