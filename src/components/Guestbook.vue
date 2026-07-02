<!-- src/components/Guestbook.vue -->
<template>
  <BaseCard width="320px" title="GUESTBOOK">
    <h3 class="card-title">岛屿留言本</h3>
    <p class="guestbook-desc">
      看看路过的旅人们留下了什么，或者写下你的足迹...
    </p>

    <div class="guestbook-visitors">
      <div
        v-for="(msg, index) in recentGuests"
        :key="index"
        class="visitor-avatar"
      >
        {{ msg.emoji }}
      </div>
      <div v-if="guestMessages.length > 4" class="visitor-avatar more-avatar">
        +{{ guestMessages.length - 4 }}
      </div>
    </div>

    <button class="btn-game-style" @click="goToGuestbook">翻开留言本</button>
  </BaseCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMessages } from '@/api/guestbook'
import BaseCard from './BaseCard.vue'

const router = useRouter()

// ============ 留言数据（通过 API 加载） ============
const guestMessages = ref([])

// ============ 计算属性 ============
const recentGuests = computed(() => guestMessages.value.slice(0, 4))

// ============ 方法 ============
const goToGuestbook = () => {
  router.push('/guestbook')
}

// ============ 生命周期 ============
onMounted(async () => {
  try {
    const result = await getMessages()
    if (result.success && result.data) {
      guestMessages.value = result.data
    }
  } catch { /* 静默失败 — 卡片组件 */ }
})
</script>

<style scoped>
.card-title {
  margin-bottom: 1rem;
  font-weight: 900;
  font-size: 1.2rem;
}

.guestbook-entry {
  cursor: pointer;
  transition: all 0.2s ease;
}

.guestbook-entry:hover {
  transform: translate(-4px, -4px);
  box-shadow: var(--shadow-flat-hover, 10px 10px 0px #1e293b);
}

.guestbook-entry .w-full {
  width: 100%;
  margin-top: 1rem;
}

.guestbook-desc {
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 1rem;
}

.guestbook-visitors {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
}

.visitor-avatar {
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-left: -10px;
  box-shadow: 2px 2px 0px rgba(30, 41, 59, 0.2);
  position: relative;
  z-index: 1;
}

.visitor-avatar:first-child {
  margin-left: 0;
}

.visitor-avatar.more-avatar {
  background: var(--color-yellow, #fef08a);
  font-size: 0.7rem;
  font-weight: 900;
  color: var(--border-dark, #1e293b);
}

/* 按钮样式 */
.btn-game-style {
  background: var(--color-yellow, #fef08a);
  width: 100%;
  color: var(--border-dark, #1e293b);
  border: 2.5px solid var(--border-dark, #1e293b);
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px var(--border-dark, #1e293b);
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.btn-game-style:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark, #1e293b);
}
</style>
