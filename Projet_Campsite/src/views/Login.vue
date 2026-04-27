<template>
  <div class="container">
    <h1 class="text-center">Connexion</h1>

    <form @submit.prevent="login" class="mx-auto w-25" novalidate>
      <div class="mb3">
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
      <div class="mb3">
        <label for="password" class="form-label">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          class="form-control"
          autocomplete="password"
          v-model="password"
        />
      </div>

      <p class="text-danger mb-3">{{ errorMessage }}</p>
      <button type="submit" class="btn btn-primary">Se Connecter</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dotenv from "dotenv"

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function login() {
  console.log('Login')

  dotenv.config()

  const apiUrl = process.env.x_api_url;
  const apiKey = process.env.x_api_key;
  try {
    const resp = await fetch( apiUrl + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const data = await resp.json()
    console.log('data  : ', data)

    if (!resp.ok) {
      errorMessage.value = "Nom d'utilisateur ou mot de passe invalide"
    } else {
      localStorage.setItem('token', data.token)
      const redirectTo = route.query.redirect || '/'
      router.push(redirectTo)
    }
  } catch (err) {
    console.log(err)
    errorMessage.value = 'Erreur de connexion'
  }
}
</script>
