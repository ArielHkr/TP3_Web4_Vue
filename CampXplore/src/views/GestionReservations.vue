<template>
  <main class="container py-5">
    <h1 class="mb-4">Réservations</h1>
     <p v-if="reservationStore.error" class="text-danger mt-3">
        {{ reservationStore.error }}
      </p>
          <p v-if="successMessage" class="text-success mt-3">
        {{ successMessage }}
      </p>

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
            <th>Actions</th>
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
              <span v-if="reservation.status === 'pending'" class="badge bg-warning text-dark">
                En attente
              </span>

              <span v-else-if="reservation.status === 'confirmed'" class="badge bg-success">
                Confirmée
              </span>

              <span v-else-if="reservation.status === 'cancelled'" class="badge bg-danger">
                Annulée
              </span>

              <span v-else class="badge bg-secondary">
                {{ reservation.status }}
              </span>
            </td>

            <td>
              <router-link
                class="btn btn-sm btn-outline-primary"
                :to="{ name: 'ReservationDetails', params: { id: reservation._id } }"
                title="Voir les détails"
              >
                <i class="bi bi-eye"></i>
              </router-link>
            </td>

            <td>
                
                <button
                v-if="reservation.status !== 'cancelled'"
                class="btn btn-sm btn-outline-danger"
                :disabled="reservationStore.isLoading"
                @click="OuvrirModalAnnuler(reservation)"
              >
                Annuler
              </button>
              <button
                v-if="reservation.status === 'pending'"
                class="btn btn-sm btn-outline-warning"
                :disabled="reservationStore.isLoading"
                @click="ConfirmerReservation(reservation._id)"
              >
                Confirmer la réservation
              </button>
                
                
              <button
                v-else-if="reservation.status === 'confirmed'"
                class="btn btn-sm btn-outline-warning"
                :disabled="reservationStore.isLoading"
                @click="RemettreEnAttente(reservation._id)"
              >
                Remettre En Attente
              </button>
<span v-else
  class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2"
>
  N/A
</span>                
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="AfficherModalAnnuler"
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
              class="btn btn-secondary"
              @click="closeCancelModal"
            >
              Non, garder
            </button>

            <button
              type="button"
              class="btn btn-danger"
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