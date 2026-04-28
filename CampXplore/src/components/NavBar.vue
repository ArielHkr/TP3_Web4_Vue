<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold text-success" to="/">
        CampXplore
      </RouterLink>

      <ul class="navbar-nav ms-auto align-items-center gap-2">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">Accueil</RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link" to="/campsites">Emplacements</RouterLink>
        </li>

        <li class="nav-item" v-if="isLogged">
          <RouterLink class="nav-link" to="/reservations">
            Mes réservations
          </RouterLink>
        </li>

        <li class="nav-item" v-if="!isLogged">
          <RouterLink class="btn btn-success btn-sm px-3" :to="{ name: 'Login' }">
            Connexion
          </RouterLink>
        </li>

        <li class="nav-item me-3" v-else>
          <a href="#" @click="logout" class="nav-link">Déconnexion</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { handleError, onBeforeMount, onMounted, ref, computed, watch } from 'vue'

const tokenRef = ref(getToken())
const isLogged = computed(() => tokenRef.value)
const route = useRoute()

watch(route, () => {
  tokenRef.value = getToken()
})
function getToken() {
  return localStorage.getItem('token')
}

function logout() {
  localStorage.removeItem('token')
}

onMounted(() => {
  window.addEventListener('storage', handlerStorage)
})
onBeforeMount(() => {
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
