<template>
  <main class="container py-5">
    <h1 class="mb-4">Créer un emplacement</h1>

    <form @submit.prevent="soumettreFormulaire" class="p-4 border rounded" novalidate>

      <div v-if="messageSucces" class="alert alert-success">{{ messageSucces }}</div>
      <div v-if="messageErreur" class="alert alert-danger">{{ messageErreur }}</div>

      <div class="mb-3">
        <label for="name" class="form-label">Nom de l'emplacement</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': erreurs.name }"
        />
        <div v-if="erreurs.name" class="invalid-feedback">{{ erreurs.name }}</div>
      </div>

      <div class="mb-3">
        <label for="location" class="form-label">Lieu</label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': erreurs.location }"
        />
        <div v-if="erreurs.location" class="invalid-feedback">{{ erreurs.location }}</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-control"
          rows="3"
        />
      </div>

      <!-- Type -->
      <div class="mb-3">
        <label for="type" class="form-label">Type</label>
        <select
          id="type"
          v-model="form.type"
          class="form-select"
          :class="{ 'is-invalid': erreurs.type }"
        >
          <option value="">-- Choisir un type --</option>
          <option value="tente">Tente</option>
          <option value="vr">VR</option>
          <option value="chalet">Chalet</option>
        </select>
        <div v-if="erreurs.type" class="invalid-feedback">{{ erreurs.type }}</div>
      </div>

      <!-- Prix par nuit -->
      <div class="mb-3">
        <label for="pricePerNight" class="form-label">Prix par nuit ($)</label>
        <input
          id="pricePerNight"
          v-model.number="form.pricePerNight"
          type="number"
          class="form-control"
          :class="{ 'is-invalid': erreurs.pricePerNight }"
          min="0"
        />
        <div v-if="erreurs.pricePerNight" class="invalid-feedback">{{ erreurs.pricePerNight }}</div>
      </div>

      <!-- Capacité -->
      <div class="mb-3">
        <label for="capacity" class="form-label">Capacité (personnes)</label>
        <input
          id="capacity"
          v-model.number="form.capacity"
          type="number"
          class="form-control"
          :class="{ 'is-invalid': erreurs.capacity }"
          min="1"
        />
        <div v-if="erreurs.capacity" class="invalid-feedback">{{ erreurs.capacity }}</div>
      </div>

      <div class="mb-3">
        <label for="maxVehicleLength" class="form-label">Longueur max véhicule (m)</label>
        <input
          id="maxVehicleLength"
          v-model.number="form.maxVehicleLength"
          type="number"
          class="form-control"
          :class="{ 'is-invalid': erreurs.maxVehicleLength }"
          min="0"
        />
        <small class="text-muted">
          {{ form.type === 'vr' ? 'Obligatoire pour les emplacements VR.' : "Optionnel pour ce type d'emplacement." }}
        </small>
        <div v-if="erreurs.maxVehicleLength" class="invalid-feedback d-block">{{ erreurs.maxVehicleLength }}</div>
      </div>

      <div class="mb-4">
        <label class="form-label">Commodités</label>
        <div class="d-flex flex-wrap gap-2">
          <div
            v-for="amenity in amenitiesDisponibles"
            :key="amenity"
            class="form-check"
          >
            <input
              :id="'amenity-' + amenity"
              v-model="form.amenities"
              :value="amenity"
              type="checkbox"
              class="form-check-input"
            />
            <label :for="'amenity-' + amenity" class="form-check-label text-capitalize">
              {{ amenity }}
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="btn btn-success"
        :disabled="campsiteStore.isLoading"
      >
        {{ campsiteStore.isLoading ? 'Création en cours...' : 'Créer' }}
      </button>
    </form>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCampsiteStore } from '@/stores/campsite'

const campsiteStore = useCampsiteStore()
const router = useRouter()

const messageErreur = ref('')
const messageSucces = ref('')
const erreurs = ref({})

const amenitiesDisponibles = [
  'électricité',
  'eau',
  'feu de camp',
  'table de pique-nique',
  'toilettes',
  'douche',
  'wifi',
  'stationnement',
]

const form = reactive({
  name: '',
  location: '',
  description: '',
  type: '',
  pricePerNight: 0,
  capacity: 1,
  maxVehicleLength: null,
  amenities: [],
})

const validerFormulaire = () => {
  const e = {}
  let valide = true

  if (!form.name?.trim()) {
    e.name = "Le nom de l'emplacement est obligatoire."
    valide = false
  }

  if (!form.location?.trim()) {
    e.location = 'Le lieu est obligatoire.'
    valide = false
  }

  if (!form.type) {
    e.type = "Le type d'emplacement est obligatoire."
    valide = false
  }

  if (!form.pricePerNight && form.pricePerNight <= 0) {
    e.pricePerNight = 'Le prix par nuit est obligatoire.'
    valide = false
  } else if (form.pricePerNight < 0) {
    e.pricePerNight = 'Le prix par nuit ne peut pas être négatif.'
    valide = false
  }

  if (!form.capacity || form.capacity < 1) {
    e.capacity = "La capacité doit être d'au moins 1 personne."
    valide = false
  }

  if (form.type === 'vr' && !form.maxVehicleLength) {
    e.maxVehicleLength = 'La longueur max du véhicule est obligatoire pour un emplacement VR.'
    valide = false
  }

  if (form.maxVehicleLength && form.maxVehicleLength < 0) {
    e.maxVehicleLength = 'La longueur max du véhicule doit être supérieure à 0.'
    valide = false
  }

  erreurs.value = e
  return valide
}

const soumettreFormulaire = async () => {
  messageSucces.value = '';
  messageErreur.value = '';

  if (!validerFormulaire()) return;

  const donnees = {
    name: form.name,
    location: form.location,
    description: form.description,
    type: form.type,
    pricePerNight: form.pricePerNight,
    capacity: form.capacity,
    amenities: form.amenities,
  };

  if (form.maxVehicleLength) {
    donnees.maxVehicleLength = form.maxVehicleLength;
  }

  try {
    await campsiteStore.creerCampsite(donnees);
    messageSucces.value = 'Emplacement créé avec succès.';
    setTimeout(() => router.push({ name: 'AdminCampsites' }), 1500);
 } catch (err) {
    messageErreur.value = campsiteStore.error || 'Une erreur est survenue lors de la création.';
    console.error(err);
  }
}
</script>