<script setup lang="ts">
import { computed } from 'vue'
import { clientIcons, type ClientIconName } from '@/components/converter/clientIcons'

const props = withDefaults(defineProps<{
  name?: ClientIconName | null
  size?: 'small' | 'medium'
}>(), {
  name: null,
  size: 'medium',
})

const iconSource = computed(() => props.name ? clientIcons[props.name] : null)
</script>

<template>
  <span v-if="iconSource" class="client-icon" :class="`client-icon--${size}`" aria-hidden="true">
    <img :src="iconSource" alt="" draggable="false" />
  </span>
</template>

<style scoped>
.client-icon {
  position: relative;
  display: block;
  flex: none;
  width: 24px;
  height: 24px;
  overflow: hidden;
  border-radius: 7px;
  background: #d6dcda;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.46),
    0 3px 10px rgba(0,0,0,.18);
}
.client-icon--small { width: 18px; height: 18px; border-radius: 5px; }
.client-icon img { display: block; width: 100%; height: 100%; object-fit: contain; }
</style>
