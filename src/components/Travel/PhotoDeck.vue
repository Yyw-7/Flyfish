<!-- src/components/travel/PhotoDeck.vue -->
<template>
  <div class="album-center-stage" v-if="station">
    <!-- 左上气泡 -->
    <div class="floating-bubble bubble-top-left">
      <span class="variety-badge">FLIGHT PASS</span>
      <div class="bubble-border">
        <h4 class="bubble-label">下一站探险坐标</h4>
        <h4 class="bubble-city">{{ station?.name || '未知' }}</h4>
      </div>
      <div class="bubble-meta">
        <span>🎫 登机牌专属: {{ station?.flightCode || '---' }}</span>
        <span>📆 照片浏览: Photo {{ activePhotoIdx + 1 }} / {{ station?.images?.length || 0 }}</span>
      </div>
    </div>

    <!-- 右上气泡 -->
    <div class="floating-bubble bubble-top-right">
      <span class="variety-badge mint">MEMORIES</span>
      <h3 class="bubble-caption">
        <span>{{ station?.emoji || '📍' }}</span> 本页高光速记
      </h3>
      <p class="bubble-quote">“{{ currentPhoto?.caption || '暂无记录' }}”</p>
    </div>

    <!-- 3D 相册 -->
    <div class="deck-wrapper">
      <div
        class="polaroid-deck-container"
        @mousedown="handleStartDrag"
        @touchstart="handleStartDrag"
        @mousemove="handleDrag"
        @touchmove="handleDrag"
        @mouseup="handleEndDrag"
        @touchend="handleEndDrag"
        @mouseleave="handleCancelDrag"
      >
        <!-- 竖图模式（3:4）：单张显示 -->
        <template v-if="currentPhotoAspect === 'portrait'">
          <div
            v-for="(photo, idx) in station.images"
            :key="idx"
            class="polaroid-slide polaroid-slide--portrait"
            :style="getPhotoCardStyle(idx)"
          >
            <div
              class="polaroid-photo-frame"
              :style="{ backgroundImage: 'url(' + photo.url + ')' }"
            >
              <div
              v-for="(sticker, sIdx) in (photo.stickers || [])"
              :key="sIdx"
              class="diy-stamped-sticker"
              :style="{ left: (sticker.x || 50) + '%', top: (sticker.y || 50) + '%' }"
            >
              {{ sticker.emoji || '⭐' }}
            </div>
            </div>
            <div class="polaroid-slide-title">
              <span>{{ photo.location || '瞬间' }}</span>
            </div>
          </div>
        </template>

        <!-- 横图模式（4:3）：两张上下排列 -->
        <template v-else>
          <div
            v-for="(photo, idx) in station.images"
            :key="idx"
            class="polaroid-slide polaroid-slide--dual"
            :style="getPhotoCardStyle(idx)"
          >
            <div class="polaroid-dual-container">
              <!-- 上图：当前图片 -->
              <div class="polaroid-dual-item">
                <div
                  class="polaroid-photo-frame polaroid-photo-frame--half"
                  :style="{ backgroundImage: 'url(' + photo.url + ')' }"
                >
                  <div
                    v-for="(sticker, sIdx) in (photo.stickers || [])"
                    :key="sIdx"
                    class="diy-stamped-sticker"
                    :style="{ left: (sticker.x || 50) + '%', top: (sticker.y || 50) + '%' }"
                  >
                    {{ sticker.emoji || '⭐' }}
                  </div>
                </div>
                <div class="polaroid-dual-location">{{ photo.location || station.name }}</div>
              </div>

              <!-- 下图：下一张图片（或占位） -->
              <div class="polaroid-dual-item">
                <div
                  v-if="getNextPhoto(idx)"
                  class="polaroid-photo-frame polaroid-photo-frame--half"
                  :style="{ backgroundImage: 'url(' + getNextPhoto(idx).url + ')' }"
                >
                  <div
                    v-for="(sticker, sIdx) in (getNextPhoto(idx)?.stickers || [])"
                    :key="sIdx"
                    class="diy-stamped-sticker"
                    :style="{ left: (sticker.x || 50) + '%', top: (sticker.y || 50) + '%' }"
                  >
                    {{ sticker.emoji || '⭐' }}
                  </div>
                </div>
                <div v-else class="polaroid-photo-frame polaroid-photo-frame--half polaroid-placeholder">
                  <span>📷</span>
                  <span>下一张</span>
                </div>
                <div class="polaroid-dual-location">
                  {{ getNextPhoto(idx) ? getNextPhoto(idx).location || station.name : '即将解锁' }}
                </div>
              </div>
            </div>

            <!-- 底部注释 -->
            <!-- <div class="polaroid-dual-footer">
              <span>{{ station.emoji }}</span>
              <span>{{ station.name }} · {{ photo.location || station.name }}</span>
              <span v-if="getNextPhoto(idx)">· {{ getNextPhoto(idx).location || station.name }}</span>
            </div> -->
          </div>
        </template>
      </div>
    </div>

    <!-- 左下气泡 -->
    <div class="floating-bubble bubble-bottom-left">
      <span class="variety-badge orange">DIRECTOR'S CUT</span>
      <span class="director-label">[节目现场吐槽]：</span>
      <p class="director-quote">“{{ currentPhoto?.varietyQuote || '暂无记录' }}”</p>
    </div>

    <!-- 右下角：登机牌气泡 -->
    <div class="boarding-pass-bubble">
      <BoardingPass
        :station="station"
        :formatted-date="formattedDate"
        :photo="currentPhoto"
        @collect-stamp="$emit('collectStamp')"
      />
    </div>
  </div>
  <!-- 空状态 -->
  <div class="album-center-stage" v-else>
    <div class="empty-state">
      <div class="empty-icon">📷</div>
      <h3>暂无旅行数据</h3>
      <p>请添加新的旅行地点</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BoardingPass from './BoardingPass.vue'

const props = defineProps({
  station: { type: Object, required: true },
  activePhotoIdx: { type: Number, required: true },
  activeSticker: { type: String, required: true },
  availableStickers: { type: Array, required: true },
  formattedDate: { type: String, default: '' }
})

const emit = defineEmits(['update:activePhotoIdx', 'addSticker', 'selectSticker', 'collectStamp'])

const currentPhoto = computed(() => {
  if (!props.station || !props.station.images || props.station.images.length === 0) {
    return {
      url: '',
      caption: '暂无图片',
      varietyQuote: '',
      hp: 1000,
      stickers: [],
      aspect: 'portrait',
      location: props.station?.name || '未知'
    }
  }
  const photo = props.station.images[props.activePhotoIdx]
  return photo || {
    url: '',
    caption: '暂无图片',
    varietyQuote: '',
    hp: 1000,
    stickers: [],
    aspect: 'portrait',
    location: props.station.name
  }
})

// ============ 判断图片比例 ============
const currentPhotoAspect = computed(() => {
  const photo = currentPhoto.value
  if (!photo) return 'portrait'
  if (photo.aspect === 'landscape') return 'landscape'
  if (photo.aspect === 'portrait') return 'portrait'
  return 'portrait'
})

// ============ 获取下一张图片 ============
const getNextPhoto = (currentIdx) => {
  if (!props.station.images || props.station.images.length === 0) return null
  const nextIdx = (currentIdx + 1) % props.station.images.length
  const photo = props.station.images[nextIdx]
  return photo || {
    url: '',
    caption: '暂无图片',
    varietyQuote: '',
    hp: 1000,
    stickers: [],
    aspect: 'portrait',
    location: props.station.name
  }
}

// ============ 拖拽逻辑 ============
const isDragging = ref(false)
const isFlinging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

const getPhotoCardStyle = (pIdx) => {
  // 安全检查
  if (!props.station || !props.station.images) {
    return {
      transform: 'translate3d(0px, 0px, 0px) rotate(0deg) scale(1)',
      zIndex: 1,
      opacity: 0
    }
  }
  const total = props.station.images.length
  const activeIdx = props.activePhotoIdx
  let offset = pIdx - activeIdx
  if (offset < -total / 2) offset += total
  if (offset > total / 2) offset -= total
  const absOffset = Math.abs(offset)

  if (offset === 0) {
    if (isFlinging.value) {
      return {
        transform: `translate3d(${dragOffsetX.value}px, ${dragOffsetY.value}px, 0) rotate(${dragOffsetX.value * 0.15}deg) scale(0.95)`,
        opacity: 1 - Math.min(Math.abs(dragOffsetX.value) / 300, 1),
        transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s',
        zIndex: 10,
        cursor: 'grabbing'
      }
    }
    if (isDragging.value) {
      return {
        transform: `translate3d(${dragOffsetX.value}px, ${dragOffsetY.value}px, 0) rotate(${dragOffsetX.value * 0.1}deg) scale(1.02)`,
        zIndex: 10,
        opacity: 1,
        transition: 'none',
        cursor: 'grabbing'
      }
    }
    return {
      transform: 'translate3d(0px, 0px, 0px) rotate(0deg) scale(1)',
      zIndex: 10,
      opacity: 1,
      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2), opacity 0.4s',
      cursor: 'grab'
    }
  } else {
    const xTranslate = offset * 35
    const zTranslate = -absOffset * 50
    const rotateDeg = offset * 8
    return {
      transform: `translateX(${xTranslate}px) translateZ(${zTranslate}px) rotate(${rotateDeg}deg) scale(${1 - absOffset * 0.1})`,
      zIndex: 10 - absOffset,
      opacity: 0.85 - absOffset * 0.25,
      pointerEvents: 'none',
      transition: 'transform 0.4s ease, opacity 0.4s'
    }
  }
}

const handleStartDrag = (event) => {
  if (isFlinging.value) return
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  isDragging.value = true
  dragStartX.value = clientX
  dragStartY.value = clientY
  dragOffsetX.value = 0
  dragOffsetY.value = 0
}

const handleDrag = (event) => {
  if (!isDragging.value || isFlinging.value) return
  if (event.cancelable) event.preventDefault()
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  dragOffsetX.value = clientX - dragStartX.value
  dragOffsetY.value = clientY - dragStartY.value
}

const handleEndDrag = (event) => {
  if (!isDragging.value || isFlinging.value) return
  isDragging.value = false
  const dragX = dragOffsetX.value
  const dragY = dragOffsetY.value
  const distance = Math.sqrt(dragX * dragX + dragY * dragY)

  const swipeThreshold = 100
  const tapThreshold = 8

  if (distance < tapThreshold) {
    const rect = event.currentTarget.getBoundingClientRect()
    const touchX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX
    const touchY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY
    const clickX = ((touchX - rect.left) / rect.width) * 100
    const clickY = ((touchY - rect.top) / rect.height) * 100
    emit('addSticker', {
      emoji: props.activeSticker,
      x: Math.round(clickX),
      y: Math.round(clickY)
    })
  } else if (Math.abs(dragX) > swipeThreshold) {
    isFlinging.value = true
    const swipeDirection = dragX > 0 ? 1 : -1
    dragOffsetX.value = swipeDirection * 500
    dragOffsetY.value = dragY * 1.5
    setTimeout(() => {
      if (swipeDirection === 1) {
        prevPhoto()
      } else {
        nextPhoto()
      }
      dragOffsetX.value = 0
      dragOffsetY.value = 0
      isFlinging.value = false
    }, 250)
  } else {
    dragOffsetX.value = 0
    dragOffsetY.value = 0
  }
}

const handleCancelDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    dragOffsetX.value = 0
    dragOffsetY.value = 0
  }
}

const prevPhoto = () => {
  if (!props.station || !props.station.images || props.station.images.length === 0) return
  let prevIdx = props.activePhotoIdx - 1
  if (prevIdx < 0) prevIdx = props.station.images.length - 1
  emit('update:activePhotoIdx', prevIdx)
}

const nextPhoto = () => {
  if (!props.station || !props.station.images || props.station.images.length === 0) return
  const nextIdx = (props.activePhotoIdx + 1) % props.station.images.length
  emit('update:activePhotoIdx', nextIdx)
}
</script>

<style scoped>
/* ===== 整体容器 ===== */
.album-center-stage {
  position: relative;
  width: 100%;
  min-height: 580px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
}

@media (max-width: 1024px) {
  .album-center-stage {
    flex-direction: column;
    min-height: auto;
    gap: 2rem;
  }
  .floating-bubble {
    position: static !important;
    max-width: 100% !important;
    width: 100%;
    transform: none !important;
    animation: none !important;
  }
  .boarding-pass-bubble {
    position: static !important;
    max-width: 100% !important;
    width: 100%;
    transform: none !important;
    animation: none !important;
  }
}

@media (max-width: 640px) {
  .album-center-stage {
    gap: 1rem;
  }
  .deck-wrapper {
    gap: 0.5rem;
    padding: 0.5rem;
  }
}

.deck-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  gap: 1rem;
  z-index: 20;
}

.polaroid-deck-container {
  position: relative;
  width: 450px;
  height: 750px;
  perspective: 1000px;
  z-index: 20;
  touch-action: none;
  user-select: none;
}

/* ===== 竖图模式（3:4） ===== */
.polaroid-slide--portrait {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border: 4px solid #1e293b;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 8px 8px 0px #1e293b;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  user-select: none;
  cursor: grab;
  will-change: transform, opacity;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.polaroid-slide--portrait:active {
  cursor: grabbing;
}

.polaroid-photo-frame {
  width: 100%;
  aspect-ratio: 3 / 4;
  border: 3px solid #1e293b;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  pointer-events: none;
  flex-shrink: 0;
}

/* ===== 横图模式（4:3）：上下排列 ===== */
.polaroid-slide--dual {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border: 4px solid #1e293b;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 8px 8px 0px #1e293b;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  user-select: none;
  cursor: grab;
  will-change: transform, opacity;
  display: flex;
  flex-direction: column;
}

.polaroid-slide--dual:active {
  cursor: grabbing;
}

/* 图片容器：占据主要空间，垂直居中 */
.polaroid-dual-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  min-height: 0;
  padding: 4px 0;
}

.polaroid-dual-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
}

/* 每张图片保持 4:3 比例 */
.polaroid-photo-frame--half {
  width: 100%;
  aspect-ratio: 4 / 3;
  border: 3px solid #1e293b;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  pointer-events: none;
  flex-shrink: 0;
}

/* 每张图片下方的小地点备注 */
.polaroid-dual-location {
  font-weight: 900;
  font-size: 0.85rem;
  color: #1e293b;
  text-align: center;
  margin-top: 4px;
  padding: 2px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 占位符 */
.polaroid-placeholder {
  width: 100%;
  aspect-ratio: 4 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: 3px solid #1e293b;
  border-radius: 6px;
  color: #94a3b8;
  font-weight: 700;
  font-size: 0.85rem;
  gap: 0.25rem;
}

.polaroid-placeholder span:first-child {
  font-size: 2.5rem;
}

/* ===== 底部注释（整张卡片底部） ===== */
.polaroid-dual-footer {
  font-weight: 900;
  font-size: 0.85rem;
  color: #1e293b;
  text-align: center;
  padding-top: 8px;
  border-top: 2px dashed #cbd5e1;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

/* ===== 标题样式 ===== */
.polaroid-slide-title {
  font-weight: 900;
  font-size: 1.05rem;
  text-align: center;
  /* margin-top: 1.2rem; */
  color: #1e293b;
  /* border-top: 2px dashed #cbd5e1; */
  padding-top: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  pointer-events: none;
  flex-shrink: 0;
}

/* ===== 贴纸 ===== */
.diy-stamped-sticker {
  position: absolute;
  font-size: 2rem;
  pointer-events: none;
  user-select: none;
  transform: translate(-50%, -50%) rotate(-10deg);
  filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.25));
  animation: stickerPop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes stickerPop {
  0% {
    transform: translate(-50%, -50%) scale(3) rotate(-30deg);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(-10deg);
    opacity: 1;
  }
}

/* ===== 气泡样式 ===== */
.floating-bubble {
  position: absolute;
  background: white;
  border: 4px solid #1e293b;
  border-radius: 20px;
  padding: 1.2rem;
  box-shadow: 4px 4px 0px #1e293b;
  z-index: 30;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  max-width: 290px;
  animation: bubbleFloat 4s ease-in-out infinite alternate;
}

.bubble-top-left {
  top: 20px;
  left: calc(50% - 500px);
  background: #e8dbfc;
}

.bubble-top-right {
  top: 20px;
  right: calc(50% - 600px);
  background: white;
  max-width: 310px;
}

.bubble-bottom-left {
  bottom: 20px;
  left: calc(50% - 600px);
  background: #fbcfe8;
}

@keyframes bubbleFloat {
  0% {
    transform: translateY(0px) rotate(var(--rot-deg, 0deg));
  }
  100% {
    transform: translateY(-8px) rotate(calc(var(--rot-deg, 0deg) + 1.5deg));
  }
}

.bubble-top-left {
  --rot-deg: -2deg;
}
.bubble-top-right {
  --rot-deg: 2deg;
}
.bubble-bottom-left {
  --rot-deg: 1.5deg;
}

/* ===== 右下角：登机牌气泡 ===== */
.boarding-pass-bubble {
  position: absolute;
  bottom: 20px;
  right: calc(50% - 700px);
  z-index: 30;
  animation: bubbleFloat 4s ease-in-out infinite alternate;
  --rot-deg: -1.5deg;
  max-width: 420px;
  min-width: 280px;
  background: white;
  border: 4px solid #1e293b;
  border-radius: 20px;
  padding: 0.5rem;
  box-shadow: 4px 4px 0px #1e293b;
}

.boarding-pass-bubble :deep(.boarding-pass) {
  transform-origin: top left;
  width: 100%;
  border-radius: 16px;
  box-shadow: none !important;
  border: none !important;
}

.boarding-pass-bubble :deep(.boarding-main) {
  padding: 0.5rem 0.75rem;
}

.boarding-pass-bubble :deep(.boarding-stub) {
  padding: 0.5rem 0.75rem;
}

.boarding-pass-bubble :deep(.boarding-header) {
  margin-bottom: 0.25rem;
}

.boarding-pass-bubble :deep(.flight-route) {
  margin-bottom: 0.25rem;
  gap: 0.25rem;
}

.boarding-pass-bubble :deep(.passenger-info) {
  gap: 0.25rem;
}

.boarding-pass-bubble :deep(.route-code) {
  font-size: 0.9rem;
}

.boarding-pass-bubble :deep(.route-label) {
  font-size: 0.45rem;
}

.boarding-pass-bubble :deep(.info-label) {
  font-size: 0.45rem;
}

.boarding-pass-bubble :deep(.info-value) {
  font-size: 0.6rem;
}

.boarding-pass-bubble :deep(.boarding-badge) {
  padding: 0.125rem 0.4rem;
  box-shadow: 2px 2px 0px #1e293b;
}

.boarding-pass-bubble :deep(.boarding-class) {
  font-size: 0.55rem;
}

.boarding-pass-bubble :deep(.stamp-btn) {
  font-size: 0.55rem;
  padding: 0.25rem 0.5rem;
  box-shadow: 2px 2px 0px #1e293b;
}

.boarding-pass-bubble :deep(.gate-label) {
  font-size: 0.45rem;
}

.boarding-pass-bubble :deep(.gate-number) {
  font-size: 0.9rem;
}

.boarding-pass-bubble :deep(.barcode) {
  width: 5rem;
  height: 1.8rem;
}

.boarding-pass-bubble :deep(.stamp) {
  font-size: 0.7rem;
  padding: 2px 6px;
}

.boarding-pass-bubble :deep(.plane-icon) {
  width: 1.8rem;
  height: 1.8rem;
  font-size: 0.9rem;
  box-shadow: 2px 2px 0px #1e293b;
}

.boarding-pass-bubble :deep(.flight-code) {
  font-size: 0.5rem;
  padding: 0.125rem 0.4rem;
}

.boarding-pass-bubble :deep(.divider) {
  margin: 0.25rem 0;
}

.boarding-pass-bubble :deep(.divider-line) {
  margin: 0.25rem 0;
}

/* ===== 辅助样式 ===== */
.variety-badge {
  background: #ff7096;
  color: white;
  border: 2px solid #1e293b;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 900;
  display: inline-block;
}

.variety-badge.mint {
  background: #2ec4b6;
}
.variety-badge.orange {
  background: #ff9f1c;
}
.variety-badge.pink {
  background: #ff7096;
}

.bubble-border {
  border-bottom: 2px dashed #1e293b;
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
}

.bubble-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: #1e293b;
}

.bubble-city {
  font-size: 1.125rem;
  font-weight: 900;
  color: #db2777;
}

.bubble-meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
}

.bubble-caption {
  font-size: 0.875rem;
  font-weight: 900;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.bubble-quote {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  font-style: italic;
  border-left: 3px solid #34d399;
  padding-left: 0.5rem;
}

.director-label {
  font-weight: 900;
  font-size: 0.75rem;
  color: #e11d48;
}

.director-quote {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e293b;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-weight: 900;
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-weight: 700;
  color: #64748b;
}
</style>