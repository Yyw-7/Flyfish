import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getQuests, addQuest, updateQuest, deleteQuest } from '@/api/quest'

export const useQuestStore = defineStore('quest', () => {
  // 状态
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const completedCount = computed(() => {
    return tasks.value.filter(task => task.isDone).length
  })

  const progress = computed(() => {
    if (!tasks.value.length) return 0
    return Math.round((completedCount.value / tasks.value.length) * 100)
  })

  // 动作
  async function fetchQuests() {
    loading.value = true
    error.value = null
    try {
      const result = await getQuests()
      if (result.success) {
        tasks.value = result.data
      }
    } catch (err) {
      error.value = err.message
      console.error('获取任务列表失败:', err)
    } finally {
      loading.value = false
    }
  }

  async function addNewQuest(questData) {
    loading.value = true
    try {
      const result = await addQuest(questData)
      if (result.success) {
        tasks.value.unshift(result.data)
      }
    } catch (err) {
      error.value = err.message
      console.error('添加任务失败:', err)
    } finally {
      loading.value = false
    }
  }

  async function toggleTaskDone(task) {
    try {
      await updateQuest(task.id, { isDone: !task.isDone })
      task.isDone = !task.isDone
    } catch (err) {
      error.value = err.message
      console.error('更新任务失败:', err)
    }
  }

  async function removeQuest(id) {
    try {
      await deleteQuest(id)
      tasks.value = tasks.value.filter(task => task.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('删除任务失败:', err)
    }
  }

  return {
    // 状态
    tasks,
    loading,
    error,
    // 计算属性
    completedCount,
    progress,
    // 动作
    fetchQuests,
    addNewQuest,
    toggleTaskDone,
    removeQuest
  }
})
