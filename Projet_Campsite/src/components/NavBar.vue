<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
    <div class="container">
      <ul class="navbar-nav ms-auto">
        <!-- <li class="nav-item">
          <a class="nav-link" href="">À propos</a>
        </li> -->
        <li class="nav-item">
          <router-link class="nav-link" to="/campsites">Campsites</router-link>
        </li>
        <li class="nav-item" v-if="!isLogged">
          <router-link class="nav-link" :to="{ name: 'Login' }">Connexion</router-link>
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
