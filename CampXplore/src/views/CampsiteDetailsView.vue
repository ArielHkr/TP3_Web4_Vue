<template>
  <main class="container py-5">
    <div v-if="campsiteStore.campsite">
      <div class="text-center mb-5">
        <span class="badge rounded-pill text-bg-success px-3 py-2 mb-3">
          Camping
        </span>

        <h1 class="fw-bold text-success mb-2">
          Réserver un emplacement
        </h1>

        <p class="text-muted mb-0">
          Préparez votre séjour en pleine nature
        </p>
      </div>

      <div v-if="campsiteStore.error" class="alert alert-danger">
        {{ campsiteStore.error }}
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-5">
          <section class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <div class="card-header bg-success text-white py-3">
              <h2 class="h4 mb-0">
                {{ campsiteStore.campsite.name }}
              </h2>
            </div>

            <div class="card-body p-4">
              <p class="text-muted mb-4">
                {{ campsiteStore.campsite.description || 'Aucune description disponible' }}
              </p>

              <div class="mb-3 d-flex justify-content-between border-bottom pb-2">
                <span class="text-muted">Lieu</span>
                <strong>{{ campsiteStore.campsite.location }}</strong>
              </div>

              <div class="mb-3 d-flex justify-content-between border-bottom pb-2">
                <span class="text-muted">Type</span>
                <span class="badge text-bg-success text-capitalize">
                  {{ campsiteStore.campsite.type }}
                </span>
              </div>

              <div class="mb-3 d-flex justify-content-between border-bottom pb-2">
                <span class="text-muted">Prix</span>
                <strong>{{ campsiteStore.campsite.pricePerNight }} $ / nuit</strong>
              </div>

              <div class="mb-3 d-flex justify-content-between border-bottom pb-2">
                <span class="text-muted">Capacité</span>
                <strong>{{ campsiteStore.campsite.capacity }} personne(s)</strong>
              </div>

              <div
                v-if="campsiteStore.campsite.maxVehicleLength"
                class="mb-3 d-flex justify-content-between border-bottom pb-2"
              >
                <span class="text-muted">Véhicule max</span>
                <strong>{{ campsiteStore.campsite.maxVehicleLength }} m</strong>
              </div>

              <div v-if="campsiteStore.campsite.amenities?.length" class="mt-4">
                <h3 class="h6 fw-bold mb-3">
                  Commodités
                </h3>

                <div class="d-flex flex-wrap gap-2">
                  <span
                    v-for="amenity in campsiteStore.campsite.amenities"
                    :key="amenity"
                    class="badge rounded-pill text-bg-light border"
                  >
                    {{ amenity }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="col-12 col-lg-7">
          <div v-if="isLogged">
            <form
              @submit.prevent="submitReservation"
              class="card border-0 shadow-sm rounded-4"
              novalidate
            >
              <div class="card-body p-4">
                <h2 class="h4 fw-bold text-success mb-1">
                  Informations de réservation
                </h2>

                <p class="text-muted mb-4">
                  Choisissez vos dates et le nombre de campeurs.
                </p>

                <div class="row g-3">
                  <div class="col-12 col-md-6">
                    <label for="startDate" class="form-label fw-semibold">
                      Date d'arrivée
                    </label>
                    <input
                      id="startDate"
                      v-model="form.startDate"
                      type="date"
                      class="form-control form-control-lg"
                      :class="{ 'is-invalid': errors.startDate }"
                    />
                    <div v-if="errors.startDate" class="invalid-feedback">
                      {{ errors.startDate }}
                    </div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label for="endDate" class="form-label fw-semibold">
                      Date de départ
                    </label>
                    <input
                      id="endDate"
                      v-model="form.endDate"
                      type="date"
                      class="form-control form-control-lg"
                      :class="{ 'is-invalid': errors.endDate }"
                    />
                    <div v-if="errors.endDate" class="invalid-feedback">
                      {{ errors.endDate }}
                    </div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label for="guests" class="form-label fw-semibold">
                      Nombre de personnes
                    </label>
                    <input
                      id="guests"
                      v-model.number="form.guests"
                      type="number"
                      class="form-control form-control-lg"
                      :class="{ 'is-invalid': errors.guests }"
                      min="1"
                      :max="campsiteStore.campsite.capacity"
                    />
                    <div v-if="errors.guests" class="invalid-feedback">
                      {{ errors.guests }}
                    </div>
                  </div>

                  <div class="col-12 col-md-6">
                    <label for="vehicleLength" class="form-label fw-semibold">
                      Longueur du véhicule
                    </label>
                    <input
                      id="vehicleLength"
                      v-model.number="form.vehicleLength"
                      type="number"
                      class="form-control form-control-lg"
                      :class="{ 'is-invalid': errors.vehicleLength }"
                      min="1"
                      :max="campsiteStore.campsite.maxVehicleLength"
                    />

                    <small
                      v-if="campsiteStore.campsite.type !== 'vr'"
                      class="text-muted"
                    >
                      Optionnel pour ce type d'emplacement.
                    </small>

                    <small v-else class="text-muted">
                      Obligatoire pour les emplacements VR.
                    </small>

                    <div v-if="errors.vehicleLength" class="invalid-feedback d-block">
                      {{ errors.vehicleLength }}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-success btn-lg w-100 mt-4 rounded-pill"
                  :disabled="reservationStore.isLoading"
                >
                  <span
                    v-if="reservationStore.isLoading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>

                  {{ reservationStore.isLoading ? 'Réservation en cours...' : 'Réserver maintenant' }}
                </button>

                <div v-if="successMessage" class="alert alert-success mt-4 mb-0">
                  {{ successMessage }}
                </div>

                <div v-if="reservationStore.error" class="alert alert-danger mt-4 mb-0">
                  {{ reservationStore.error }}
                </div>
              </div>
            </form>
          </div>

          <div v-else class="card border-0 shadow-sm rounded-4 text-center">
            <div class="card-body p-5">
              <h2 class="h4 text-success fw-bold mb-3">
                Connectez-vous pour réserver
              </h2>

              <p class="text-muted mb-4">
                Vous devez être connecté pour effectuer une réservation.
              </p>

              <router-link to="/login" class="btn btn-success btn-lg rounded-pill px-5">
                Se connecter
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="spinner-border text-success mb-3" role="status"></div>

      <p class="text-muted">
        Chargement de l'emplacement...
      </p>
    </div>
  </main>
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