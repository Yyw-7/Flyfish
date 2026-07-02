<template>
  <div class="card" :style="cardStyle">
    <div class="card-title-tag" v-if="props.title">
      {{ props.title }}
    </div>
    <slot />
  </div>
</template>

<script setup>
import '@/assets/main.scss'

const props = defineProps({
  width: { type: String, default: 'auto' },
  height: { type: String, default: 'auto' },
  title: { type: String, default: '' }
})

const cardStyle = {
  width: props.width,
  height: props.height
}
</script>

<style scoped>
.card {
  background-color: var(--bg-canvas);
  border: 3px solid var(--border-dark);
  border-radius: 20px;
  box-shadow: var(--shadow-flat);
  padding: 1.5rem;
  position: relative;
  max-width: 100%;  /* 防止在小屏幕上溢出容器 */
  box-sizing: border-box;
}
.card:hover {
  box-shadow: var(--shadow-flat-hover);
  transition: transform 0.2s ease-in-out;
  transform: translateY(-4px) translateX(-4px); /* 向上向左移动 6px */
}
.card-title-tag {
  background: var(--border-dark);
  color: white;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 900;
  position: absolute;
  top: -14px;
  left: 20px;
}
</style>
