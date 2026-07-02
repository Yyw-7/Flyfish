<!--
  WeatherPanel.vue
  今日天空布景选择面板
-->
<template>
  <div class="weather-options-panel">
    <div class="panel-title">更换今日天空布景：</div>
    <div class="weather-btn-group">
      <button
        v-for="w in WEATHER_OPTIONS"
        :key="w.value"
        :class="['weather-btn', { active: modelValue === w.value }]"
        @click="$emit('update:modelValue', w.value)"
      >
        {{ w.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { WEATHER_OPTIONS } from '@/composables/useWeather'

defineProps({
  modelValue: { type: String, required: true }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.weather-options-panel {
  background: rgba(255, 255, 255, 0.5);
  border: 2px dashed rgba(30, 41, 59, 0.3);
  border-radius: 16px;
  padding: 16px;
  width: 100%;
}
:global(.dark-mode) .weather-options-panel {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}
.panel-title {
  font-size: 0.8rem;
  font-weight: 900;
  color: #64748b;
  margin-bottom: 10px;
}
:global(.dark-mode) .panel-title {
  color: #94a3b8;
}
.weather-btn-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.weather-btn {
  width: 60px;
  height: auto;
  background: white;
  border: 2px solid var(--border-dark);
  padding: 6px 14px;
  border-radius: 15px;
  /* font-weight: 800; */
  text-align: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 2px 2px 0px var(--border-dark);
  transition: all 0.2s ease;
  color: var(--border-dark);
}
:global(.dark-mode) .weather-btn {
  background: #334155;
  color: white;
  border-color: #f8fafc;
  box-shadow: 2px 2px 0px #f8fafc;
}
.weather-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px var(--border-dark);
}
:global(.dark-mode) .weather-btn:hover {
  box-shadow: 3px 3px 0px #f8fafc;
}
.weather-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px var(--border-dark);
}
:global(.dark-mode) .weather-btn:active {
  box-shadow: 1px 1px 0px #f8fafc;
}
.weather-btn.active {
  background: var(--color-yellow);
}
:global(.dark-mode) .weather-btn.active {
  background: var(--color-yellow);
  color: #1e293b;
}

@media (max-width: 768px) {
  .weather-options-panel {
    width: 100%;
  }
  .weather-btn-group {
    justify-content: center;
  }
}
</style>
