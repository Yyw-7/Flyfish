<script setup>
import { RouterView } from 'vue-router'
import ToastBubble from '@/components/ToastBubble.vue'

// 全局初始化：确保天气背景与暗色模式在任何路由下均生效
// （composables 内部使用模块级状态 + localStorage 持久化，仅需导入一次）
import { useWeather } from '@/composables/useWeather'
import { useDarkMode } from '@/composables/useDarkMode'

const { weather, ...weatherEffects } = useWeather()
const { isNightMode, toggleNightMode } = useDarkMode()
</script>

<template>
  <div>
    <RouterView />
    <ToastBubble />
  </div>
</template>

<style scoped></style>
