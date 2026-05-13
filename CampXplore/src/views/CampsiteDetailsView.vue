<template>
  <div class="container my-4">
    <div v-if="campsiteStore.campsite">
      <h1 class="mb-4">Réserver un emplacement</h1>
      <p>{{ campsiteStore.error }}</p>
      <section class="mb-4 p-3 border rounded">
        <h2>{{ campsiteStore.campsite.name }}</h2>

        <p class="mb-1">
          <strong>Lieu :</strong> {{ campsiteStore.campsite.location }}
        </p>

        <p class="mb-1">
          <strong>Description :</strong>
          {{ campsiteStore.campsite.description || 'Aucune description disponible' }}
        </p>

        <p class="mb-1">
          <strong>Type :</strong> {{ campsiteStore.campsite.type }}
        </p>

        <p class="mb-1">
          <strong>Prix :</strong>
          {{ campsiteStore.campsite.pricePerNight }} $ / nuit
        </p>

        <p class="mb-1">
          <strong>Capacité :</strong>
          {{ campsiteStore.campsite.capacity }} personne(s)
        </p>

        <p v-if="campsiteStore.campsite.maxVehicleLength" class="mb-1">
          <strong>Longueur max véhicule :</strong>
          {{ campsiteStore.campsite.maxVehicleLength }} m
        </p>

        <p v-if="campsiteStore.campsite.amenities?.length" class="mb-1">
          <strong>Commodités :</strong>
          {{ campsiteStore.campsite.amenities.join(', ') }}
        </p>
      </section>
       <div v-if="isLogged">
        <form @submit.prevent="submitReservation" class="p-3 border rounded" novalidate>
        <h2 class="mb-3">Informations de réservation</h2>

        <div class="mb-3">
          <label for="startDate" class="form-label">Date d'arrivée</label>
          <input
            id="startDate"
            v-model="form.startDate"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.startDate }"
          />
          <div v-if="errors.startDate" class="invalid-feedback">
            {{ errors.startDate }}
          </div>
        </div>

        <div class="mb-3">
          <label for="endDate" class="form-label">Date de départ</label>
          <input
            id="endDate"
            v-model="form.endDate"
            type="date"
            class="form-control"
            :class="{ 'is-invalid': errors.endDate }"
          />
          <div v-if="errors.endDate" class="invalid-feedback">
            {{ errors.endDate }}
          </div>
        </div>

        <div class="mb-3">
          <label for="guests" class="form-label">Nombre de personnes</label>
          <input
            id="guests"
            v-model.number="form.guests"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.guests }"
            min="1"
            :max="campsiteStore.campsite.capacity"
          />
          <div v-if="errors.guests" class="invalid-feedback">
            {{ errors.guests }}
          </div>
        </div>

        <div class="mb-3">
          <label for="vehicleLength" class="form-label">Longueur du véhicule</label>
          <input
            id="vehicleLength"
            v-model.number="form.vehicleLength"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.vehicleLength }"
            min="1"
            :max="campsiteStore.campsite.maxVehicleLength"
          />

          <small v-if="campsiteStore.campsite.type !== 'vr'" class="text-muted">
            Optionnel pour ce type d'emplacement.
          </small>

          <small v-else class="text-muted">
            Obligatoire pour les emplacements VR.
          </small>

          <div v-if="errors.vehicleLength" class="invalid-feedback d-block">
            {{ errors.vehicleLength }}
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="reservationStore.isLoading"
        >
          {{ reservationStore.isLoading ? 'Réservation en cours...' : 'Réserver' }}
        </button>

        <p v-if="successMessage" class="text-success mt-3">
          {{ successMessage }}
        </p>

        <p v-if="reservationStore.error" class="text-danger mt-3">
          {{ reservationStore.error }}
        </p>
      </form>
       </div>
      <div v-else class="p-3 border rounded text-center">
      <p class="mb-3">Vous devez être connecté pour effectuer une réservation.</p>
      <router-link to="/login" class="btn btn-primary">Se connecter</router-link>
</div>
    </div>

    <p v-else>Chargement de l'emplacement...</p>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useCampsiteStore } from '@/stores/campsite'
import { useReservationStore } from '@/stores/reservation'
import { computed } from 'vue'
const tokenRef = ref(localStorage.getItem('token'))

const isLogged = computed(() => !!tokenRef.value)
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const campsiteStore = useCampsiteStore()
const reservationStore = useReservationStore()

const successMessage = ref('')

const form = reactive({
  startDate: '',
  endDate: '',
  guests: 1,
  vehicleLength: null,
})

const errors = reactive({
  startDate: '',
  endDate: '',
  guests: '',
  vehicleLength: '',
})

onMounted(() => {
  campsiteStore.getCampsite(props.id)
})

const validateForm = () => {
  errors.startDate = ''
  errors.endDate = ''
  errors.guests = ''
  errors.vehicleLength = ''

  let isValid = true

  if (!form.startDate) {
    errors.startDate = "La date d'arrivée est obligatoire."
    isValid = false
  }

  if (!form.endDate) {
    errors.endDate = 'La date de départ est obligatoire.'
    isValid = false
  }

  if (form.startDate && form.endDate && form.endDate <= form.startDate) {
    errors.endDate = "La date de départ doit être après la date d'arrivée."
    isValid = false
  }

  if (!form.guests || form.guests < 1) {
    errors.guests = 'Le nombre de personnes doit être au minimum 1.'
    isValid = false
  }

  if (form.guests > campsiteStore.campsite.capacity) {
    errors.guests = `Le nombre de personnes ne peut pas dépasser ${campsiteStore.campsite.capacity}.`
    isValid = false
  }

  if (campsiteStore.campsite.type === 'vr' && !form.vehicleLength) {
    errors.vehicleLength = 'La longueur du véhicule est obligatoire pour un emplacement VR.'
    isValid = false
  }

  if (form.vehicleLength && form.vehicleLength < 1) {
    errors.vehicleLength = 'La longueur du véhicule doit être supérieure à 0.'
    isValid = false
  }

  if (
    form.vehicleLength &&
    campsiteStore.campsite.maxVehicleLength &&
    form.vehicleLength > campsiteStore.campsite.maxVehicleLength
  ) {
    errors.vehicleLength = `La longueur du véhicule ne peut pas dépasser ${campsiteStore.campsite.maxVehicleLength} m.`
    isValid = false
  }

  return isValid
}

const submitReservation = async () => {
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  const reservationData = {
    campsite: campsiteStore.campsite._id,
    startDate: form.startDate,
    endDate: form.endDate,
    guests: form.guests,
  }

  if (form.vehicleLength) {
    reservationData.vehicleLength = form.vehicleLength
  }

  try {
    await reservationStore.createReservation(reservationData)
    successMessage.value = 'Réservation créée avec succès.'
  } catch (err) {
    console.log(err)
  }
}
</script>