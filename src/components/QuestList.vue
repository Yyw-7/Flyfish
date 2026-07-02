<template>
  <BaseCard width="320px" title="ACTIVE QUESTS">
    <!-- 清单头部 -->
    <div class="quests-header">
      <h3 class="card-title">任务列表</h3>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
        <div class="progress-bar-text">
          {{ completedCount }}/{{ tasks.length }}
        </div>
      </div>
    </div>

    <!-- 任务清单 -->
    <div class="quest-list">
      <ul>
        <li
          v-for="task in tasks"
          :key="task.id"
          :class="{ completed: task.isDone }"
        >
          <div
            class="quest-checkbox"
            :class="{ checked: task.isDone }"
            @click="toggleDone(task)"
          >
            <span v-if="task.isDone" style="font-weight: bolder; color: white">
              ✔
            </span>
          </div>
          <div class="quest-text">{{ task.text }}</div>
        </li>
      </ul>
    </div>

    <!-- 底部按钮 -->
    <div class="quest-footer">
      <button @click="showModal = true">添加任务</button>
    </div>
  </BaseCard>

  <!-- 笔记本弹窗 -->
  <NoteBook
    v-model:visible="showModal"
    :fields="questFields"
    title="📝 添加新任务"
    primary-text="添加"
    secondary-text="关闭"
    :show-secondary="true"
    secondary-action="close"
    width="400px"
    @submit="handleAddQuest"
    @reset="handleReset"
    @close="handleClose"
  />
</template>

<script setup>
import BaseCard from '@/components/BaseCard.vue'
import NoteBook from '@/components/NoteBook/index.vue'
import { ref, onMounted } from 'vue'
import { useQuestStore } from '@/stores/quest'
import { useToast } from '@/composables/useToast'
import { storeToRefs } from 'pinia'

// ============ Pinia Store ============
const questStore = useQuestStore()
const { tasks, completedCount, progress } = storeToRefs(questStore)
const { triggerToast } = useToast()

// ============ 弹窗控制 ============
const showModal = ref(false)

// ============ 表单配置 ============
const questFields = [
  {
    name: 'text',
    label: '任务描述',
    type: 'textarea',
    placeholder: '例如: 运动 15 分钟 / 优雅重构一段代码...',
    required: true,
    minLength: 2,
    maxLength: 100,
    validate: (value) => {
      if (
        value &&
        value.trim().length > 0 &&
        !/[一-龥a-zA-Z0-9]/.test(value)
      ) {
        return '请包含有效的文字内容'
      }
      return true
    }
  }
]

// ============ 方法 ============
const toggleDone = (task) => {
  questStore.toggleTaskDone(task)
}

const handleAddQuest = async (questData) => {
  if (!questData) {
    alert('任务内容不能为空 📝')
    return
  }

  await questStore.addNewQuest({ text: questData.text.trim() })
  triggerToast('✅ 新任务已添加！')
}

const handleReset = () => {}

const handleClose = () => {}

// ============ 初始化 ============
onMounted(() => {
  questStore.fetchQuests()
})
</script>

<style scoped>
.card-title {
  margin-bottom: 1rem;
  font-weight: 900;
  font-size: 1.2rem;
}

.quests-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

/* 进度条 */
.progress-bar {
  position: relative;
  width: 60%;
  height: 20px;
  background: white;
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-mint-deep, #2ec4b6);
  border-radius: 10px;
  transition: width 0.2s ease;
}

.progress-bar-text {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 900;
  pointer-events: none;
}

/* 任务列表 */
.quest-list {
  height: 215px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 4px;
}

.quest-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.quest-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.quest-list ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  background: var(--bg-canvas, #faf6f0);
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
}

li:hover {
  transform: translateX(4px);
  background: white;
}

.quest-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-dark, #1e293b);
  border-radius: 6px;
  background: white;
  margin-right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.quest-checkbox.checked {
  background: var(--color-mint-deep, #2ec4b6);
}

.quest-text {
  word-break: break-word;
}

li.completed {
  background-color: var(--color-mint, #cbf3f0);
}

li.completed .quest-text {
  text-decoration: line-through;
  opacity: 0.7;
}

.quest-footer {
  display: flex;
  justify-content: flex-end;
}

button {
background: var(--color-yellow, #fef08a);
  color: var(--border-dark, #1e293b);
  border: 2.5px solid var(--border-dark, #1e293b);
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px var(--border-dark, #1e293b);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  width: 100%;
}

button:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark, #1e293b);
}
</style>
