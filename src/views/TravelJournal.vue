<!-- src/views/TravelJournal.vue -->
<template>
  <div class="variety-container">
    <EChartsMap
      :cities="cities"
      :active-city-idx="activeCityIdx"
      :current-station="currentStation"
      @city-click="flyToCity"
      @open-add-modal="showAddModal = true"
    />

    <PhotoDeck
      :station="currentStation"
      :active-photo-idx="activePhotoIdx"
      :active-sticker="activeSticker"
      :available-stickers="availableStickers"
      :formatted-date="formattedDate"
      @update:active-photo-idx="activePhotoIdx = $event"
      @add-sticker="addSticker"
      @select-sticker="activeSticker = $event"
      @collect-stamp="collectStamp"
    />

    <AddLocationModal
      v-model:visible="showAddModal"
      @submit="handleAddLocation"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EChartsMap from '@/components/Travel/EChartsMap.vue'
import AddLocationModal from '@/components/Travel/AddLocationModal.vue'
import PhotoDeck from '@/components/Travel/PhotoDeck.vue'
import { getTravelLocations, addTravelLocation, updateTravelLocation } from '@/api/travel'
import { useToast } from '@/composables/useToast'

const { triggerToast } = useToast()

// ============ 数据 ============
const cities = ref([])
const activeCityIdx = ref(0)
const activePhotoIdx = ref(0)

// ============ 贴纸 ============
const availableStickers = ['💯', '✨', '🤣', '😭', '💮', '🎒', '🔥', '🌸', '🍕', '💖']
const activeSticker = ref('💮')

// ============ 弹窗控制 ============
const showAddModal = ref(false)

// ============ 计算属性 ============
const currentStation = computed(() => cities.value[activeCityIdx.value])

const currentPhoto = computed(
  () => currentStation.value?.images?.[activePhotoIdx.value] || { hp: 0, stickers: [] }
)

const formattedDate = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

// ============ 方法 ============
const flyToCity = (idx) => {
  if (idx === activeCityIdx.value) return
  activeCityIdx.value = idx
  activePhotoIdx.value = 0
  triggerToast(`✈️ 切换至：[${cities.value[idx].name}]`)
}

const collectStamp = async () => {
  if (currentStation.value.stamped) return
  try {
    currentStation.value.stamped = true
    await updateTravelLocation(currentStation.value.id, { stamped: true })
    triggerToast('💮 纪念邮戳成功印下！恭喜解锁本站印花！')
  } catch {
    currentStation.value.stamped = false
    triggerToast('❌ 盖章失败，请重试')
  }
}

const addSticker = async (stickerData) => {
  if (!currentPhoto.value.stickers) {
    currentPhoto.value.stickers = []
  }
  currentPhoto.value.stickers.push(stickerData)
  try {
    await updateTravelLocation(currentStation.value.id, {
      images: [...currentStation.value.images]
    })
    triggerToast(`🎨 成功在照片盖上 [${stickerData.emoji}] 手账贴纸！`)
  } catch {
    currentPhoto.value.stickers.pop()
    triggerToast('❌ 贴纸添加失败，请重试')
  }
}

const handleAddLocation = async (locationData) => {
  try {
    const result = await addTravelLocation(locationData)
    if (result.success) {
      const reload = await getTravelLocations()
      if (reload.success) {
        cities.value = reload.data
        activeCityIdx.value = cities.value.length - 1
        activePhotoIdx.value = 0
        triggerToast(`🎉 成功添加旅行地：[${locationData.name}]！`)
      }
    }
  } catch {
    triggerToast('❌ 添加地点失败，请重试')
  }
}

const handleModalClose = () => {}

// ============ 初始化 ============
onMounted(async () => {
  try {
    const result = await getTravelLocations()
    if (result.success && result.data.length > 0) {
      cities.value = result.data
      const defaultIdx = cities.value.findIndex((c) => c.id === 4)
      activeCityIdx.value = defaultIdx !== -1 ? defaultIdx : 0
    }
  } catch {
    triggerToast('❌ 加载旅行数据失败')
  }
})
</script>

<style scoped>
.variety-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
}
</style>
