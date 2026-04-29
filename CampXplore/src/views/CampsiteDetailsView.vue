<template>
   <CampsiteCard 
   :key="campsite._id"
   :campsite="campsite"/>
</template>

<script setup>
import CampsiteCard from '@/components/CampsiteCard.vue'
import { ref, onMounted } from 'vue'
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})
const campsite = ref({})
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const getCampsite = async (id)=>{
   try{
    const res = await fetch(`${apiUrl}/api/campsites/${id}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });
    const data = res.json().data;
    if(!res.ok){
      throw new Error(
        `Erreur (${res.status})`
      );
    }

   campsite.value = data;
   }catch(err){
   console.log(err);
   }

};
onMounted(()=>{
    getCampsite(props.id);
})
</script>