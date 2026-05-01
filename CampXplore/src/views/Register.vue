<template>
  <main class="bg-light min-vh-100">
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <h1 class="h3 mb-4 text-success">Inscription</h1>

             <form @submit.prevent="register" novalidate>
  <div class="mb-3">
    <label class="form-label">Prénom</label>
    <input v-model="form.firstName" type="text" class="form-control" />
    <small v-if="errors.firstName" class="text-danger">{{ errors.firstName }}</small>
  </div>

  <div class="mb-3">
    <label class="form-label">Nom</label>
    <input v-model="form.lastName" type="text" class="form-control" />
    <small v-if="errors.lastName" class="text-danger">{{ errors.lastName }}</small>
  </div>

  <div class="mb-3">
    <label class="form-label">Email</label>
    <input v-model="form.email" type="email" class="form-control" />
    <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
  </div>

  <div class="mb-3">
    <label class="form-label">Mot de passe</label>
    <input v-model="form.password" type="password" class="form-control" />
    <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
  </div>

  <div class="mb-3">
    <label class="form-label">Téléphone</label>
    <input v-model="form.phone" type="tel" class="form-control" />
    <small v-if="errors.phone" class="text-danger">{{ errors.phone }}</small>
  </div>

  <button type="submit" class="btn btn-success w-100" :disabled="auth.isLoading">
    {{ auth.isLoading ? 'Inscription...' : 'Créer mon compte' }}
  </button>
</form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const errors = ref({})

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  role: 'user',
})

const register = async () => {
  errors.value = {}

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/

  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'Le prénom est obligatoire'
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'Le nom est obligatoire'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'L’email est obligatoire'
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'L’email est invalide'
  }

  if (!form.value.password) {
    errors.value.password = 'Le mot de passe est obligatoire'
  } else if (!passwordRegex.test(form.value.password)) {
    errors.value.password =
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial au moins'
  }

  if (!form.value.phone.trim()) {
    errors.value.phone = 'Le téléphone est obligatoire'
  } else if (form.value.phone.length !== 10) {
    errors.value.phone = 'Le téléphone doit contenir 10 chiffres'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }
  
  const success = await auth.register(form.value)

if (!success) {
  errors.value.email = auth.error || 'Cet email existe déjà'
  return
}
router.replace('/login');
}
</script>