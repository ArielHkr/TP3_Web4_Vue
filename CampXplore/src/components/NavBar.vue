<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
    <div class="container">
      <h1>
        <router-link to="/" class="text-white text-decoration-none">
          CampXplore
        </router-link>
      </h1>

      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Accueil</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/campsites">Emplacements</router-link>
        </li>

        <li class="nav-item" v-if="isLogged">
          <router-link class="nav-link" to="/reservations">Mes réservations</router-link>
        </li>

        <li class="nav-item" v-if="!isLogged">
          <router-link class="nav-link" :to="{ name: 'Login' }">Connexion</router-link>
        </li>

        <li class="nav-item" v-if="!isLogged">
          <router-link class="nav-link" :to="{ name: 'Register' }">Inscription</router-link>
        </li>
       <li class="nav-item dropdown" v-if="isLogged">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Zone Admin
          </a>
          <ul class="dropdown-menu">
            <li>
              <router-link class="dropdown-item" :to="{ name: 'AdminCampsites' }">Gestion des campsites</router-link>
            </li>
            <li v-if="isAdmin">
              <router-link class="dropdown-item" :to="{ name: 'AdminReservations' }">Gestion des réservations</router-link>
            </li>
          </ul>
        </li>
       <li class="nav-item dropdown" v-if="isLogged">
         <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           Salut {{ authStore.user?.firstName }} !
         </a>
         <ul class="dropdown-menu dropdown-menu-end">
           <li>
             <router-link class="dropdown-item" to="/profil">Mon profil</router-link>
           </li>
           <li><hr class="dropdown-divider"></li>
           <li>
             <a href="#" @click.prevent="logout" class="dropdown-item text-danger">Déconnexion</a>
           </li>
         </ul>
       </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const tokenRef = ref(localStorage.getItem('token'))

const isLogged = computed(() => !!tokenRef.value)

const decodedToken = computed(() => {
  if (!tokenRef.value) return null

  try {
    return jwtDecode(tokenRef.value)
  } catch (err) {
    console.log(err)
    return null
  }
})

const isAdmin = computed(() => decodedToken.value?.role === 'admin')

async function chargerUser() {
  if (isLogged.value) {
    await authStore.getUser()
  }
}

watch(route, async () => {
  tokenRef.value = localStorage.getItem('token')
  await chargerUser()
})

function logout() {
  localStorage.removeItem('token')
  tokenRef.value = null
  authStore.user = null
  router.replace('/')
}

onMounted(async () => {
  await chargerUser()
  window.addEventListener('storage', handlerStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handlerStorage)
})

function handlerStorage(e) {
  if (e.key === 'token') {
    tokenRef.value = localStorage.getItem('token')
  }
}
</script>
