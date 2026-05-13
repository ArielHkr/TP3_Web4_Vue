<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <h1 class="h4 mb-4 text-center">
              Mon profil
            </h1>

            <form @submit.prevent="enregistrer" novalidate>
              <div class="mb-3">
                <label for="firstName" class="form-label">Prénom</label>
                <input
                  type="text"
                  v-model="prenom"
                  id="firstName"
                  class="form-control"
                  placeholder="Entrez votre prénom"
                >
              </div>

              <div class="mb-3">
                <label for="lastName" class="form-label">Nom</label>
                <input
                  type="text"
                  v-model="nom"
                  id="lastName"
                  class="form-control"
                  placeholder="Entrez votre nom"
                >
              </div>

              <div class="mb-3">
                <label for="role" class="form-label">Rôle</label>
                <input
                  type="text"
                  v-model="role"
                  id="role"
                  class="form-control bg-light"
                  disabled
                >
              </div>

              <div class="mb-3">
                <label for="phoneNumber" class="form-label">Téléphone</label>
                <input
                  type="text"
                  v-model="phoneNumber"
                  id="phoneNumber"
                  maxlength="10"
                  class="form-control"
                  placeholder="Ex: 5141234567"
                >
                <div class="form-text">
                  Le numéro doit contenir exactement 10 chiffres.
                </div>
              </div>

              <div v-if="messageErreur" class="alert alert-danger">
                {{ messageErreur }}
              </div>

              <div v-if="authStore.success" class="alert alert-success">
                {{ authStore.success }}
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="authStore.isLoading || !champModifie"
              >
                <span
                  v-if="authStore.isLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>

                {{ authStore.isLoading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>

              <div class="text-center mt-3">
                <router-link to="/resetPassword" class="link-primary text-decoration-none">
                  Changer le mot de passe
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const nom = ref('')
const prenom = ref('')
const phoneNumber = ref('')
const role = ref('')
const champModifie = ref(false)
const messageErreur = ref('')

const remplirChamps = () => {
  const user = authStore.user
  if (!user) return

  nom.value = user.lastName || 'N/A'
  prenom.value = user.firstName || 'N/A'
  phoneNumber.value = user.phone || 'N/A'
  role.value = user.role || 'N/A'
}

const enregistrer = async () => {
  messageErreur.value = ''

  if (!prenom.value.trim() ||
   !nom.value.trim() ||
    !phoneNumber.value.trim()) {
    messageErreur.value = 'Tous les champs sont obligatoires.'
    return
  }

  if (!/^\d{10}$/.test(phoneNumber.value)) {
    messageErreur.value = 'Le numéro doit contenir exactement 10 chiffres.'
    return
  }

  const ok = await authStore.userUpdate(
    prenom.value.trim(),
    nom.value.trim(),
    phoneNumber.value.trim(),
    authStore.user.role
  )

  if (ok) {
    champModifie.value = false
  }
}

onMounted(async () => {
  await authStore.getUser()

  if (authStore.user) {
    remplirChamps()
    champModifie.value = false
  }

  watch([nom, prenom, phoneNumber], () => {
    champModifie.value = true
  })
})
</script>