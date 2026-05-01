<template>
     <CampsiteCard
    v-if="campsiteStore.campsite"
    :key="campsiteStore.campsite._id"
    :campsite="campsiteStore.campsite"
  />
</template>
<script setup>
import CampsiteCard from '@/components/CampsiteCard.vue'
import { onMounted } from 'vue'
import { useCampsiteStore } from '@/stores/campsite'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const campsiteStore = useCampsiteStore()

onMounted(() => {
  campsiteStore.getCampsite(props.id)
})
</script>