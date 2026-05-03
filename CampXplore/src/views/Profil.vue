<template>
     <div>
        <form novalidate>
         <div>
            <label for="firstName">Prénom:</label>
            <input type="text" v-model="prenom" id="firstName" name="firstName">
         </div>
         <div>
            <label for="lastName">Nom:</label>
            <input type="text" v-model="nom" id="lastName" name="lastName">
         </div>
         <div>
            <label for="phoneNumber">Téléphone:</label>
            <input type="number" v-model="phoneNumber" id="phoneNumber" name="phoneNumber">
         </div>
         <div>
            <button>Enregistrer</button>
         </div>
        </form>
     </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
const authStore = useAuthStore()
const nom = ref('');
const prenom = ref('');
const phoneNumber = ref(0);

const remplirChamps = ()=>{
    const user = authStore.user;
    console.log(user);
    if (!user) return
     nom.value = user.lastName;
     prenom.value = user.firstName;
     phoneNumber.value = user.phone; 
}



onMounted(async()=>{
    await authStore.getUser()
    if (authStore.user){
    remplirChamps();
    }
});
</script>