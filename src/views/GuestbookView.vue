<!-- src/views/GuestbookView.vue -->
<template>
  <div class="guestbook-page">
    <div class="guestbook-container">
      <!-- 头部 -->
      <div class="guestbook-header">
        <div>
          <h2>💌 时光留言板</h2>
          <p>来自平行宇宙的旅人碎碎念</p>
        </div>
        <button class="btn-game-style" @click="goBack">✖ 返回基地</button>
      </div>

      <!-- 留言瀑布流 -->
      <div class="guestbook-board" ref="boardRef">
        <div v-if="guestMessages.length === 0" class="empty-state">
          <span class="empty-icon">🍃</span>
          <p>还没有人留言哦，快来抢沙发！</p>
        </div>

        <div
          v-for="msg in guestMessages"
          :key="msg.id"
          :class="['guest-msg-card', msg.colorClass || 'bg-pink']"
          :style="{ transform: `rotate(${msg.rotate || 0}deg)` }"
        >
          <div class="msg-tape"></div>
          <div class="msg-header">
            <span class="msg-avatar">{{ msg.emoji || '👻' }}</span>
            <div class="msg-meta">
              <span class="msg-author">{{ msg.author || '匿名旅人' }}</span>
              <span class="msg-time">{{ msg.time || '刚刚' }}</span>
            </div>
          </div>
          <p class="msg-content">{{ msg.content }}</p>
        </div>
      </div>

      <!-- 留言输入区 -->
      <div class="guestbook-input-box">
        <div class="diary-input-row">
          <input
            type="text"
            class="diary-input-title"
            v-model="newGuestMsg.author"
            placeholder="你的访客昵称..."
            maxlength="20"
          />
          <input
            type="text"
            class="diary-input-emoji"
            v-model="newGuestMsg.emoji"
            placeholder="👋"
            maxlength="2"
          />
        </div>
        <textarea
          class="diary-textarea"
          v-model="newGuestMsg.content"
          placeholder="想要对博主或这个世界说点什么..."
          rows="3"
          maxlength="500"
        ></textarea>
        <div class="diary-footer">
          <span class="char-count">{{ newGuestMsg.content.length }}/500</span>
          <button class="btn-game-style submit-btn" @click="submitGuestMsg">
            发送留言 📮
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMessages, addMessage } from '@/api/guestbook'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { triggerToast } = useToast()

// ============ 留言数据 ============
const guestMessages = ref([])

// ============ 新留言表单 ============
const newGuestMsg = ref({
  author: '',
  emoji: '👋',
  content: ''
})

const boardRef = ref(null)

// ============ 提交留言 ============
const submitGuestMsg = async () => {
  const author = newGuestMsg.value.author.trim()
  const content = newGuestMsg.value.content.trim()

  if (!content) return triggerToast('请输入留言内容 📝')

  try {
    const result = await addMessage({
      author: author || '匿名旅人',
      emoji: newGuestMsg.value.emoji || '👻',
      content
    })
    if (result.success) {
      guestMessages.value.unshift(result.data)
      newGuestMsg.value.author = ''
      newGuestMsg.value.content = ''
      newGuestMsg.value.emoji = '👋'
      triggerToast('📮 留言发送成功！')
    }
  } catch {
    triggerToast('❌ 留言发送失败，请重试')
  }
}

// ============ 返回主页 ============
const goBack = () => {
  router.push('/')
}

// ============ 生命周期 ============
onMounted(async () => {
  try {
    const result = await getMessages()
    if (result.success && result.data) {
      guestMessages.value = result.data
    }
  } catch {
    triggerToast('❌ 加载留言失败')
  }
})
</script>

<style scoped>
/* ===== 留言本页面 ===== */
.guestbook-page {
  min-height: 100vh;
  /* background-color: var(--bg-canvas, #faf6f0); */
  /* background-image: radial-gradient(rgba(30, 41, 59, 0.08) 2px, transparent 2px); */
  background-size: 30px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
}

.guestbook-container {
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ===== 头部 ===== */
.guestbook-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 3px solid var(--border-dark, #1e293b);
  border-radius: 20px;
  padding: 1.2rem 1.8rem;
  box-shadow: var(--shadow-flat, 6px 6px 0px #1e293b);
  flex-shrink: 0;
}

.guestbook-header h2 {
  font-size: 1.6rem;
  font-weight: 900;
  margin: 0;
}

.guestbook-header p {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 700;
  margin: 0;
}

/* ===== 留言展示板 ===== */
.guestbook-board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  align-content: start;
  min-height: 300px;
  padding: 0.5rem 0 1rem;
}

/* ===== 留言卡片 ===== */
.guest-msg-card {
  border: 3px solid var(--border-dark, #1e293b);
  border-radius: 12px;
  padding: 1.2rem 1.2rem 1rem;
  box-shadow: var(--shadow-flat-sm, 3px 3px 0px #1e293b);
  position: relative;
  transition: transform 0.2s ease;
}

.guest-msg-card:hover {
  transform: scale(1.03) rotate(0deg) !important;
  z-index: 10;
}

/* 胶带装饰 */
.msg-tape {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  width: 50px;
  height: 16px;
  background: rgba(255, 255, 255, 0.75);
  border: 2px dashed rgba(30, 41, 59, 0.25);
  border-radius: 2px;
}

.msg-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  border-bottom: 2px dashed var(--border-dark, #1e293b);
  padding-bottom: 0.6rem;
}

.msg-avatar {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 50%;
  margin-right: 0.5rem;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.msg-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.msg-author {
  font-weight: 900;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-time {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
}

.msg-content {
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.6;
  color: var(--border-dark, #1e293b);
  word-break: break-word;
}

/* ===== 颜色变体 ===== */
.bg-pink {
  background: var(--color-pink, #ffccd5);
}
.bg-mint {
  background: var(--color-mint, #cbf3f0);
}
.bg-yellow {
  background: var(--color-yellow, #fef08a);
}
.bg-lavender {
  background: var(--color-lavender, #e8dbfc);
}
.bg-peach {
  background: var(--color-peach, #ffd8be);
}

/* ===== 空状态 ===== */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
  background: white;
  border: 3px dashed var(--border-dark, #1e293b);
  border-radius: 16px;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
}

/* ===== 留言输入区 ===== */
.guestbook-input-box {
  background: white;
  border: 3px solid var(--border-dark, #1e293b);
  border-radius: 20px;
  padding: 1.2rem 1.5rem;
  box-shadow: var(--shadow-flat, 6px 6px 0px #1e293b);
  flex-shrink: 0;
}

.diary-input-row {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.diary-input-title {
  flex: 1;
  padding: 0.5rem 0.8rem;
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 10px;
  outline: none;
  font-weight: 700;
  font-size: 0.85rem;
  background: white;
  font-family: var(--font-main, 'Noto Sans SC', sans-serif);
}

.diary-input-title:focus {
  box-shadow: 0 0 0 3px var(--color-yellow, #fef08a);
}

.diary-input-emoji {
  width: 50px;
  padding: 0.5rem 0.2rem;
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
  outline: none;
  background: white;
}

.diary-input-emoji:focus {
  box-shadow: 0 0 0 3px var(--color-yellow, #fef08a);
}

.diary-textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 10px;
  outline: none;
  resize: vertical;
  font-family: var(--font-main, 'Noto Sans SC', sans-serif);
  font-weight: 700;
  font-size: 0.85rem;
  background: white;
  min-height: 60px;
}

.diary-textarea:focus {
  box-shadow: 0 0 0 3px var(--color-yellow, #fef08a);
}

.diary-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  gap: 1rem;
}

.char-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: #9ca3af;
}

/* ===== 按钮 ===== */
.btn-game-style {
  background: var(--color-yellow, #fef08a);
  color: var(--border-dark, #1e293b);
  border: 2.5px solid var(--border-dark, #1e293b);
  padding: 6px 18px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px var(--border-dark, #1e293b);
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
  font-family: var(--font-main, 'Noto Sans SC', sans-serif);
}

.btn-game-style:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark, #1e293b);
}

.submit-btn {
  background: var(--color-mint, #cbf3f0);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .guestbook-page {
    padding: 1rem;
  }

  .guestbook-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 1rem 1.2rem;
  }

  .guestbook-header h2 {
    font-size: 1.3rem;
  }

  .guestbook-board {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .guestbook-input-box {
    padding: 1rem;
  }

  .diary-input-row {
    flex-wrap: wrap;
  }

  .diary-input-emoji {
    width: 44px;
  }
}
</style>
