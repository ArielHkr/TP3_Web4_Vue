<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="text-center mb-4">Connexion</h1>

        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Courriel</label>
            <input id="email" type="email" class="form-control" v-model="email" required />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe</label>
            <input id="password" type="password" class="form-control" v-model="password" required />
          </div>

          <p v-if="authStore.error" class="text-danger mb-3">
            {{ authStore.error }}
          </p>

          <button type="submit" class="btn btn-primary w-100" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
          <router-link class="nav-link" :to="{ name: 'Register' }">Créer un compte</router-link>
        </form>
      </div>
    </div>
  </div>
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