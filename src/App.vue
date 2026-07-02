<script setup>
import { RouterView } from 'vue-router'
import ToastBubble from '@/components/ToastBubble.vue'
</script>

<template>
  <div>
    <RouterView />
    <ToastBubble />
  </div>
</template>

<style scoped></style>
