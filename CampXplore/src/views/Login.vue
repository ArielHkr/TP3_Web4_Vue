<template>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-5">
        <div class="card shadow-sm border-0 rounded-4">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <h1 class="h3 fw-bold mb-2">Connexion</h1>
              <p class="text-muted mb-0">
                Connectez-vous à votre compte
              </p>
            </div>

            <form @submit.prevent="login" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label fw-semibold">
                  Courriel
                </label>
                <input
                  id="email"
                  type="email"
                  class="form-control form-control-lg"
                  v-model="email"
                  placeholder="exemple@email.com"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label fw-semibold">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  class="form-control form-control-lg"
                  v-model="password"
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </div>

              <div v-if="authStore.error" class="alert alert-danger">
                {{ authStore.error }}
              </div>

              <button
                type="submit"
                class="btn btn-success btn-lg w-100 mt-2"
                :disabled="authStore.isLoading"
              >
                <span
                  v-if="authStore.isLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>

                {{ authStore.isLoading ? 'Connexion...' : 'Se connecter' }}
              </button>

              <div class="text-center mt-4">
                <span class="text-muted">Vous n’avez pas de compte ?</span>

                <router-link
                  class="fw-semibold text-decoration-none ms-1"
                  :to="{ name: 'Register' }"
                >
                  Créer un compte
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
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function login() {
  const success = await authStore.login(email.value, password.value)

  if (success) {
    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  }
}
</script>