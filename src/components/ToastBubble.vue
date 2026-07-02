<!--
  ToastBubble.vue — 全局操作提示
  位置：页面顶部正中间
  样式：与网易云连接提示一致
-->
<template>
  <Teleport to="body">
    <transition name="toast-fade">
      <div v-if="toast" class="toast-bubble">
        <span class="toast-icon">✨</span> {{ toastMessage }}
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toast, toastMessage } = useToast()
</script>

<style scoped>
.toast-bubble {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 3px solid var(--border-dark, #1e293b);
  border-radius: 14px;
  padding: 10px 24px;
  box-shadow: var(--shadow-flat, 6px 6px 0px #1e293b);
  font-weight: 900;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 9999;
  white-space: nowrap;
  max-width: 90vw;
}

.toast-icon {
  font-size: 1.1rem;
}

:global(.dark-mode) .toast-bubble {
  background: #1e293b;
  color: white;
}

.toast-fade-enter-active {
  animation: toastSlideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
}
.toast-fade-leave-active {
  animation: toastSlideUp 0.2s ease-in forwards;
}

@keyframes toastSlideDown {
  from {
    transform: translateX(-50%) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
@keyframes toastSlideUp {
  from {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50%) translateY(-20px);
    opacity: 0;
  }
}
</style>
