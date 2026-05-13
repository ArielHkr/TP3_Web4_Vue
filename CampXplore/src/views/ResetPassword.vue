<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <h1 class="h4 mb-4 text-center">
              Changer le mot de passe
            </h1>

            <form @submit.prevent="changerMotDePasse" novalidate>
              <div class="mb-3">
                <label for="currentPassword" class="form-label">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  v-model="currentPassword"
                  class="form-control"
                  placeholder="Entrez votre mot de passe actuel"
                >
              </div>

              <div class="mb-3">
                <label for="newPassword" class="form-label">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="newPassword"
                  v-model="newPassword"
                  class="form-control"
                  placeholder="Entrez votre nouveau mot de passe"
                >
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  class="form-control"
                  placeholder="Confirmez votre nouveau mot de passe"
                >
              </div>

              <div v-if="messageErreur" class="alert alert-danger">
                {{ messageErreur }}
              </div>

              <div v-if="authStore.error" class="alert alert-danger">
                {{ authStore.error }}
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

                {{ authStore.isLoading ? 'Modification...' : 'Changer le mot de passe' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>

import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const messageErreur = ref('')
const champModifie = ref(false)

watch([currentPassword, newPassword, confirmPassword], () => {
  champModifie.value = true
})

const changerMotDePasse = async () => {
  messageErreur.value = ''

  if (
    !currentPassword.value.trim() ||
    !newPassword.value.trim() ||
    !confirmPassword.value.trim()
  ) {
    messageErreur.value = 'Tous les champs sont obligatoires.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    messageErreur.value = 'Le nouveau mot de passe et sa confirmation ne correspondent pas.'
    return
  }

  const ok = await authStore.changePassword(
    currentPassword.value,
    newPassword.value
  )

  if (ok) {
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    champModifie.value = false
  }
}
</script>