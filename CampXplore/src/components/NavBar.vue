<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
    <div class="container">
            <h1><router-link to="/" class="text-white text-decoration-none">CampXplore</router-link></h1>

      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Accueil</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/campsites">Emplacements</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/reservations" v-if="isLogged">Mes réservations</router-link>
        </li>
        <li class="nav-item" v-if="!isLogged">
          <router-link class="nav-link" :to="{ name: 'Login' }">Connexion</router-link>
        </li>
        <li class="nav-item" v-if="!isLogged">
         <router-link class="nav-link" :to="{ name: 'Register' }">Inscription</router-link>
        </li>
        <li class="nav-item me-3" v-else>
          <a href="#" @click="logout" class="nav-link">Déconnexion</a>
          <router-link to="/profil">profil</router-link>  </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'

const router = useRouter()
const route = useRoute()

const tokenRef = ref(getToken())
const isLogged = computed(() => tokenRef.value)

watch(route, () => {
  tokenRef.value = getToken()
})

function getToken() {
  return localStorage.getItem('token')
}

function logout() {
  localStorage.removeItem('token')
  tokenRef.value = null
  router.replace('/')
}

onMounted(() => {
  window.addEventListener('storage', handlerStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handlerStorage)
})

function handlerStorage(e) {
  if (e.key === 'token') {
    tokenRef.value = getToken()
  }
}
</script>

<style scoped>
a.router-link-active,
a.router-link-exact-active {
  color: #f8c102 !important;
}
</style>
