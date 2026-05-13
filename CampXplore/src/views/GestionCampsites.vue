<template>
  <main class="container py-5">
    <h1 class="mb-4">Liste des emplacements</h1>
    <router-link class="btn btn-success mb-3" :to="{ name: 'CreerCampsite' }">
  + Nouvel emplacement
</router-link>
<p v-if="messageErreur" class="alert alert-danger">
  {{ messageErreur }}
</p>
<p v-if="messageSuccess" class="alert alert-success mt-3">
  {{ messageSuccess }}
</p>
    <div v-if="campsiteStore.isLoading" class="text-center py-5">
      Chargement...
    </div>

    <div v-else-if="campsiteStore.campsites.length === 0" class="alert alert-warning">
      Aucun emplacement trouvé.
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>Nom</th>
            <th>Lieu</th>
            <th>Type</th>
            <th>Capacité</th>
            <th>Prix/nuit</th>
            <th>Commodités</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="campsite in campsiteStore.campsites" :key="campsite._id">
            <td>{{ campsite.name }}</td>
            <td>{{ campsite.location }}</td>
            <td>{{ campsite.type }}</td>
            <td>{{ campsite.capacity }}</td>
            <td>{{ campsite.pricePerNight }} $</td>
            <td>{{ campsite.amenities?.join(', ') }}</td>
            <td class="d-flex gap-2">
           <button class="btn btn-sm btn-warning" @click="ArchiverCampsite(campsite._id)">
               Archiver
           </button>
           <router-link class="btn btn-sm btn-secondary" :to="{ name: 'CampsiteDetailsView', params: { id: campsite._id } }">
               Détails
           </router-link>
           <router-link class="btn btn-sm btn-primary" :to="{ name: 'UpdateCampsite', params: { id: campsite._id } }">
               Modifier
           </router-link>
          </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCampsiteStore } from '@/stores/campsite'

const campsiteStore = useCampsiteStore()
const messageErreur = ref('')
const messageSuccess = ref('')
const ArchiverCampsite = async (id) => {
  messageErreur.value = ''

  try {
    await campsiteStore.archiverCampsite(id)
  } catch (err) {
    messageErreur.value = err.message;
  }finally{
   messageSuccess.value = "L'emplacement a été archivé avec succès!!";
  }
}
onMounted(() => {
  campsiteStore.getCampsites()
})
</script>