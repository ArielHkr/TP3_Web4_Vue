<template>
  <div>
    <form @submit.prevent="changerMotDePasse" novalidate>
      <div>
        <label for="currentPassword">Mot de passe actuel:</label>
        <input type="password" id="currentPassword" v-model="currentPassword">
      </div>

      <div>
        <label for="newPassword">Nouveau mot de passe:</label>
        <input type="password" id="newPassword" v-model="newPassword">
      </div>

      <div v-if="messageErreur">{{ messageErreur }}</div>
      <div v-if="authStore.error">{{ authStore.error }}</div>
      <div v-if="authStore.success">{{ authStore.success }}</div>

      <button type="submit" :disabled="authStore.isLoading || !champModifie">
        {{ authStore.isLoading ? 'Modification...' : 'Changer le mot de passe' }}
      </button>

      
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const messageErreur = ref('')
const champModifie = ref(false)

watch([currentPassword, newPassword], () => {
  champModifie.value = true
})

const changerMotDePasse = async () => {
  messageErreur.value = ''

  if (!currentPassword.value.trim() || !newPassword.value.trim()) {
    messageErreur.value = 'Tous les champs sont obligatoires.'
    return
  }

  const ok = await authStore.changePassword(
    currentPassword.value,
    newPassword.value
  )

  if (ok) {
    currentPassword.value = ''
    newPassword.value = ''
    champModifie.value = false
  }
}
</script>