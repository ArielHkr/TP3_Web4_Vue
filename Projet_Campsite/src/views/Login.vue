<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="text-center mb-4">Connexion</h1>

        <form @submit.prevent="login" novalidate>
          <div class="mb-3">
            <label for="email" class="form-label">Courriel</label>
            <input
              id="email"
              name="email"
              type="email"
              class="form-control"
              autocomplete="email"
              v-model="email"
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              class="form-control"
              autocomplete="current-password"
              v-model="password"
            />
          </div>

          <p class="text-danger mb-3">{{ errorMessage }}</p>
          <button type="submit" class="btn btn-primary w-100">Se Connecter</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY

async function login() {
  try {
    const resp = await fetch(apiUrl + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const data = await resp.json()
    console.log(data)
    if (!resp.ok) {
      errorMessage.value = "Nom d'utilisateur ou mot de passe invalide"
    } else {
      localStorage.setItem('token', data.data.token)
      const redirectTo = route.query.redirect || '/'
      router.push(redirectTo)
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Erreur de connexion'
  }
}
</script>
