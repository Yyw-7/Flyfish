<!-- DiaryCreator.vue -->
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import NoteBook from '@/components/NoteBook/index.vue'
import DiaryCard from './DiaryCard.vue'
import { getDiaries, addDiary, deleteDiary } from '@/api/diary'
import { useToast } from '@/composables/useToast'

const { triggerToast } = useToast()

// ============ 接收父组件传递的筛选日期 ============
const props = defineProps({
  filterDate: {
    type: Object,
    default: null // { date, dateStr, diaries, hasDiary }
  }
})

// ============ Emits ============
const emit = defineEmits(['clear-filter'])

// ============ 日记数据（从 localStorage 加载） ============
const diaryEntries = ref([])
const selectedDiary = ref(null)

// ============ 表单配置 ============
const fields = [
  {
    name: 'title',
    label: '标题',
    type: 'text',
    placeholder: '写下标题',
    required: true,
    minLength: 2,
    maxLength: 30
  },
  {
    name: 'content',
    label: '内容',
    type: 'textarea',
    placeholder: '今天的美好...',
    required: true,
    minLength: 5,
    maxLength: 500
  },
  {
    name: 'image',
    label: '图片',
    type: 'file',
    required: false
  }
]

// ============ 计算属性：根据筛选条件显示日记 ============
const displayDiaries = computed(() => {
  if (props.filterDate && props.filterDate.date) {
    const dateStr = props.filterDate.dateStr
    const filtered = diaryEntries.value.filter((d) => d.date === dateStr)
    return filtered.map((entry, index) => ({
      ...entry,
      rotation: getRotation(index)
    }))
  }
  return diaryEntries.value.map((entry, index) => ({
    ...entry,
    rotation: getRotation(index)
  }))
})

// ============ 当前显示的日期标题 ============
const currentDateTitle = computed(() => {
  if (!props.filterDate || !props.filterDate.date) return '📖 全部日记'
  const { year, month, day } = props.filterDate.date
  return `📅 ${year} 年 ${month + 1} 月 ${day} 日`
})

// ============ 日记数量 ============
const displayCount = computed(() => displayDiaries.value.length)

// ============ 是否有筛选 ============
const hasFilter = computed(() => props.filterDate && props.filterDate.date)

// ============ 方法 ============
const getRotation = (index) => {
  return index % 2 === 0 ? -1.5 : 1.5
}

// ============ 添加日记 ============
const handleSubmit = async (payload) => {
  if (!payload) return

  try {
    const imageUrl = payload.image ? URL.createObjectURL(payload.image) : ''
    const result = await addDiary({ title: payload.title, content: payload.content, imageUrl })
    if (result.success) {
      diaryEntries.value.unshift(result.data)
      triggerToast('📝 日记已保存！')
    }
  } catch {
    triggerToast('❌ 日记保存失败，请重试')
  }
}

const handleReset = () => {}

const handleClose = () => {}

const handleSelectDiary = (entry) => {
  selectedDiary.value = entry
}

const handleCloseDetail = () => {
  selectedDiary.value = null
}

// 删除日记
const handleDeleteDiary = async (entry) => {
  try {
    const result = await deleteDiary(entry.id)
    if (result.success) {
      diaryEntries.value = diaryEntries.value.filter((d) => d.id !== entry.id)
      if (selectedDiary.value?.id === entry.id) {
        selectedDiary.value = null
      }
      triggerToast('🗑️ 日记已删除')
    }
  } catch {
    triggerToast('❌ 删除失败，请重试')
  }
}

// 清除筛选（通知父组件）
const clearFilter = () => {
  emit('clear-filter')
}

// ============ 监听 filterDate 变化 ============
watch(() => props.filterDate, (newVal) => {
  if (newVal) {
    // 筛选日期回调
  }
})

// ============ 生命周期：通过 API 加载日记 ============
onMounted(async () => {
  try {
    const result = await getDiaries()
    if (result.success && result.data) {
      diaryEntries.value = result.data
    }
  } catch {
    triggerToast('❌ 加载日记失败')
  }
})
</script>

<template>
  <div class="diary-page">
    <!-- 统计信息 -->
    <div class="diary-stats">
      <div class="stats-header">
        <span class="stats-title">{{ currentDateTitle }}</span>
        <span class="stats-count">📖 共 {{ displayCount }} 篇日记</span>
      </div>
      <div>
        <button v-if="hasFilter" class="btn-clear-filter" @click="clearFilter">✕ 显示全部</button>
      </div>
    </div>

    <!-- 笔记本表单 -->
    <NoteBook
      mode="inline"
      :fields="fields"
      title="记录美好生活"
      primary-text="添加"
      secondary-text="重置"
      :show-secondary="true"
      secondary-action="reset"
      width="612px"
      :hole-spacing="32"
      :min-coils="5"
      :max-coils="16"
      @submit="handleSubmit"
      @reset="handleReset"
      @close="handleClose"
    />

    <!-- 日记列表 -->
    <div v-if="displayDiaries.length" class="diary-list">
      <div class="diary-grid">
        <DiaryCard
          v-for="entry in displayDiaries"
          :key="entry.id"
          :title="entry.title"
          :content="entry.content"
          :date="entry.date || entry.createdAt"
          :image-url="entry.imageUrl || entry.coverImg"
          :rotation="entry.rotation"
          @click="handleSelectDiary(entry)"
          @delete="handleDeleteDiary(entry)"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <h3 v-if="hasFilter">
        {{ filterDate.date.year }} 年 {{ filterDate.date.month + 1 }} 月
        {{ filterDate.date.day }} 日 并没有记录
      </h3>
      <h3 v-else>还没有日记</h3>
      <p v-if="hasFilter">写点什么吧，让回忆发光 ✨</p>
      <p v-else>点击上方的笔记本，记录你的第一篇日记吧 ✨</p>
    </div>

    <!-- 日记详情模态框 -->
    <div v-if="selectedDiary" class="diary-detail-overlay" @click.self="handleCloseDetail">
      <div
        class="diary-detail-modal"
        :style="{ transform: `rotate(${selectedDiary.rotation || 0}deg)` }"
        @click.stop
      >
        <div class="diary-detail-close" @click="handleCloseDetail">×</div>
        <div class="diary-detail-img" v-if="selectedDiary.imageUrl || selectedDiary.coverImg">
          <img :src="selectedDiary.imageUrl || selectedDiary.coverImg" alt="日记图片" />
        </div>
        <div class="diary-detail-img diary-detail-img--empty" v-else>
          <span>📝</span>
        </div>
        <div class="diary-detail-content">
          <h2>
            {{ selectedDiary.emoji || '📝' }}
            {{ selectedDiary.title || '无标题' }}
          </h2>
          <p class="diary-detail-tag" v-if="selectedDiary.tag">🏷️ {{ selectedDiary.tag }}</p>
          <p class="diary-detail-text">
            {{ selectedDiary.content || '暂无记录内容' }}
          </p>
        </div>
        <div class="diary-detail-footer">
          <span>📅 {{ selectedDiary.date || selectedDiary.createdAt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 统计信息 */
.diary-stats {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
  background: var(--bg-canvas, #fffdf5);
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 12px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.stats-title {
  font-weight: 900;
  font-size: 1rem;
}

.stats-count {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 700;
  padding-left: 1rem;
}

.stats-hint {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 0.2rem;
}

.btn-clear-filter {
  background: var(--color-pink, #ffccd5);
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: 2px 2px 0px var(--border-dark, #1e293b);
  transition: all 0.1s ease;
}

.btn-clear-filter:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark, #1e293b);
}

/* 日记列表 */
.diary-list {
  margin-top: 2rem;
  padding-top: 2rem;

  border-top: 3px dashed var(--border-dark, #1e293b);
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.diary-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.diary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 290px);
  gap: 1.25rem;
  padding-left: 6px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: #9ca3af;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 0.9rem;
}

/* 日记详情模态框 */
.diary-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.diary-detail-modal {
  background-color: white;
  border: 4px solid var(--border-dark, #1e293b);
  border-radius: 8px;
  box-shadow: 10px 10px 0px var(--border-dark, #1e293b);
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transition: transform 0.3s ease;
}

.diary-detail-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  color: var(--border-dark, #1e293b);
  z-index: 10;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--border-dark, #1e293b);
  transition: all 0.2s ease;
}

.diary-detail-close:hover {
  background: var(--color-pink-deep, #ff8fa3);
  color: white;
  transform: scale(1.1);
}

.diary-detail-img {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: var(--color-mint-deep, #2ec4b6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 3rem;
  border: 2px solid var(--border-dark, #1e293b);
}

.diary-detail-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.diary-detail-img--empty {
  border: 3px solid var(--border-dark, #1e293b);
  background: var(--bg-canvas, #faf6f0);
}

.diary-detail-content {
  width: 100%;
  margin-bottom: 1rem;
}

.diary-detail-content h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.diary-detail-tag {
  display: inline-block;
  background: var(--color-yellow, #fef08a);
  border: 2px solid var(--border-dark, #1e293b);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.diary-detail-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #4b5563;
  white-space: pre-wrap;
}

.diary-detail-footer {
  width: 100%;
  padding: 1rem 0 0;
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-dark, #1e293b);
  border-top: 2px dashed var(--border-dark, #1e293b);
}

@media (max-width: 768px) {
  .diary-page {
    padding: 0 1rem;
  }

  .diary-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .diary-detail-modal {
    padding: 1rem;
  }

  .diary-detail-content h2 {
    font-size: 1.3rem;
  }
}
</style>
