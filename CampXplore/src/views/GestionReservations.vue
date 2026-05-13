<template>
  <main class="container py-5">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <span class="badge bg-dark rounded-pill mb-2">
          Administration
        </span>

        <h1 class="fw-bold mb-1">
          Réservations
        </h1>

        <p class="text-muted mb-0">
          Gérez les réservations des campeurs.
        </p>
      </div>

      <span class="badge bg-success rounded-pill px-3 py-2">
        {{ reservationStore.reservations?.length || 0 }} réservation(s)
      </span>
    </div>

    <div v-if="reservationStore.error" class="alert alert-danger rounded-4">
      {{ reservationStore.error }}
    </div>

    <div v-if="successMessage" class="alert alert-success rounded-4">
      {{ successMessage }}
    </div>

    <div v-if="reservationStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-success"></div>
      <p class="mt-3 text-muted">Chargement des réservations...</p>
    </div>

    <div
      v-else-if="!reservationStore.reservations || reservationStore.reservations.length === 0"
      class="alert alert-warning rounded-4"
    >
      Aucune réservation faite.
    </div>

    <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-header bg-dark text-white py-3">
        <h2 class="h5 mb-0">
          Liste des réservations
        </h2>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-4">Utilisateur</th>
              <th>Campsite</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Invités</th>
              <th>Prix total</th>
              <th>Statut</th>
              <th class="text-center">Détails</th>
              <th class="text-end pe-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="reservation in reservationStore.reservations" :key="reservation._id">
              <td class="ps-4 fw-semibold">
                {{ reservation.user.lastName }} {{ reservation.user.firstName }}
              </td>

              <td class="text-muted">
                {{ reservation.campsite.name }}
              </td>

              <td>{{ formatDate(reservation.startDate) }}</td>
              <td>{{ formatDate(reservation.endDate) }}</td>
              <td>{{ reservation.guests }}</td>

              <td class="fw-bold text-success">
                {{ reservation.totalPrice }} $
              </td>

              <td>
                <span v-if="reservation.status === 'pending'" class="badge bg-warning text-dark rounded-pill">
                  En attente
                </span>

                <span v-else-if="reservation.status === 'confirmed'" class="badge bg-success rounded-pill">
                  Confirmée
                </span>

                <span v-else-if="reservation.status === 'cancelled'" class="badge bg-danger rounded-pill">
                  Annulée
                </span>

                <span v-else class="badge bg-secondary rounded-pill">
                  {{ reservation.status }}
                </span>
              </td>

              <td class="text-center">
                <router-link
                  class="btn btn-sm btn-dark rounded-circle action-btn"
                  :to="{ name: 'ReservationDetails', params: { id: reservation._id } }"
                  title="Voir les détails"
                >
                  <i class="bi bi-eye"></i>
                </router-link>
              </td>

              <td class="pe-4">
                <div class="d-flex justify-content-end flex-wrap gap-2">
                  <button
                    v-if="reservation.status !== 'cancelled'"
                    class="btn btn-sm btn-outline-danger rounded-circle action-btn"
                    :disabled="reservationStore.isLoading"
                    @click="OuvrirModalAnnuler(reservation)"
                    title="Annuler"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>

                  <button
                    v-if="reservation.status === 'pending'"
                    class="btn btn-sm btn-success rounded-circle action-btn"
                    :disabled="reservationStore.isLoading"
                    @click="ConfirmerReservation(reservation._id)"
                    title="Confirmer"
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>

                  <button
                    v-else-if="reservation.status === 'confirmed'"
                    class="btn btn-sm btn-outline-dark rounded-circle action-btn"
                    :disabled="reservationStore.isLoading"
                    @click="RemettreEnAttente(reservation._id)"
                    title="Remettre en attente"
                  >
                    <i class="bi bi-arrow-counterclockwise"></i>
                  </button>

                  <span
                    v-else
                    class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2"
                  >
                    N/A
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="AfficherModalAnnuler"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Confirmer l’annulation</h5>

            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeCancelModal"
            ></button>
          </div>

          <div class="modal-body">
            <p class="mb-2">
              Voulez-vous vraiment annuler cette réservation ?
            </p>

            <p v-if="ReservationSelectionnee" class="mb-0 text-muted">
              <strong>Campsite :</strong> {{ ReservationSelectionnee.campsite.name }}<br />
              <strong>Date début :</strong> {{ formatDate(ReservationSelectionnee.startDate) }}<br />
              <strong>Date fin :</strong> {{ formatDate(ReservationSelectionnee.endDate) }}
            </p>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-dark rounded-pill"
              @click="closeCancelModal"
            >
              Non, garder
            </button>

            <button
              type="button"
              class="btn btn-danger rounded-pill"
              :disabled="reservationStore.isLoading"
              @click="ConfirmerAnnulation"
            >
              Confirmer l’annulation
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="AfficherModalAnnuler" class="modal-backdrop fade show"></div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useReservationStore } from '@/stores/reservation'

const reservationStore = useReservationStore()
const successMessage = ref('')
const AfficherModalAnnuler = ref(false)
const ReservationSelectionnee = ref(null)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-CA')
}

const OuvrirModalAnnuler = (reservation) => {
  successMessage.value = ''
  ReservationSelectionnee.value = reservation
  AfficherModalAnnuler.value = true
}

const closeCancelModal = () => {
  AfficherModalAnnuler.value = false
  ReservationSelectionnee.value = null
}

const ConfirmerAnnulation = async () => {
  if (!ReservationSelectionnee.value) {
    return
  }

  successMessage.value = ''

  try {
    await reservationStore.updateReservationStatus(ReservationSelectionnee.value._id, 'cancelled')
    successMessage.value = 'Réservation annulée avec succès.'
    closeCancelModal()
    reservationStore.getReservations()

  } catch (err) {
    console.log(err)
  }
}
const ConfirmerReservation = async(id)=>{
    successMessage.value = '';
    reservationStore.isLoading= true;
    
    try{
        await reservationStore.updateReservationStatus(id,'confirmed');
        successMessage.value = 'Réservation confirmée avec succès.'

    }catch (err) {
    console.log(err)
  }finally{
        reservationStore.isLoading= false;
  }
       reservationStore.getReservations()

}
const RemettreEnAttente = async (id) =>{
     successMessage.value = '';
    reservationStore.isLoading= true;
    try{
        await reservationStore.updateReservationStatus(id,'pending');
        successMessage.value = 'Réservation remise en attente.'

    }catch (err) {
    console.log(err)
  }finally{
        reservationStore.isLoading= false;
  }
      reservationStore.getReservations()

}
onMounted(() => {
  reservationStore.getReservations()
})
</script>
<style scoped>
.action-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>