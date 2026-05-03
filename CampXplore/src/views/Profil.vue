<template>
  <div>
    <form @submit.prevent="enregistrer" novalidate>
      <div>
        <label for="firstName">Prénom:</label>
        <input type="text" v-model="prenom" id="firstName">
      </div>

      <div>
        <label for="lastName">Nom:</label>
        <input type="text" v-model="nom" id="lastName">
      </div>

      <div>
        <label for="phoneNumber">Téléphone:</label>
        <input
          type="text"
          v-model="phoneNumber"
          id="phoneNumber"
          maxlength="10"
        >
      </div>

      <div v-if="messageErreur">
        {{ messageErreur }}
      </div>

      <button type="submit" :disabled="authStore.isLoading || !champModifie">
        {{ authStore.isLoading ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
      <div>
        <router-link to="/resetPassword">
                Changer le mot de passe
      </router-link>
      </div>
      <div>{{ authStore.success }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const nom = ref('')
const prenom = ref('')
const phoneNumber = ref('')
const champModifie = ref(false)
const messageErreur = ref('')

const remplirChamps = () => {
  const user = authStore.user
  if (!user) return

  nom.value = user.lastName || 'N/A'
  prenom.value = user.firstName || 'N/A'
  phoneNumber.value = user.phone || 'N/A'
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