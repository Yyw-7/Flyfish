<template>
  <div class="diary-card" :style="cardStyle" @click="$emit('click')">
    <div class="diary-img" v-if="imageUrl">
      <img :src="imageUrl" alt="日记图片" />
    </div>
    <div class="diary-img diary-img--empty" v-else>
      <span>还没有精彩瞬间哦</span>
    </div>
    <div class="diary-content">
      <h3>{{ props.title || '无标题' }}</h3>
      <p class="diary-text">
        {{ props.content || '暂无记录内容' }}
      </p>
    </div>
    <div class="diary-footer">
      <span>{{ date || '2026-06-25' }}</span>

      <el-icon @click.stop="$emit('delete')"><Delete /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  date: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  rotation: { type: Number, default: 0 }
})

defineEmits(['click', 'delete'])

// 子组件根据传入的 rotation 计算样式
const cardStyle = computed(() => ({
  transform: `rotate(${props.rotation}deg)`
}))
</script>

<style scoped>
.diary-card {
  width: 290px;
  height: 400px;
  background-color: white;
  border: 3px solid var(--border-dark);
  border-radius: 5px;
  box-shadow: var(--shadow-flat);
  padding: 1rem;
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.diary-card:hover {
  transform: scale(1.03) rotate(0deg) !important;
}

.diary-img {
  width: 100%;
  height: 180px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  background: var(--color-mint-deep, #2ec4b6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 0.95rem;
}

.diary-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.diary-img--empty {
  border: 2px solid var(--border-dark);
}

.diary-content {
  width: 100%;
  flex: 1; /* ✅ 占据剩余空间 */
  display: flex;
  flex-direction: column;
  padding-bottom: 0.5rem;
  min-height: 0; /* ✅ 防止 flex 溢出 */
}

.diary-content h3 {
  font-weight: 900;
  flex-shrink: 0; /* ✅ 标题不收缩 */
}

.diary-text {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #4b5563;
  flex: 1; /* ✅ 文字区域自动撑满 */
}
.diary-footer {
  width: 90%;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  padding: 0.5rem 0 0;
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text-dark);
  border-top: 2px dashed var(--border-dark);
  justify-content: space-between;
  display: flex;
}

.diary-footer .el-icon {
  margin-left: 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: #000000;
}

.diary-footer .el-icon:hover {
  cursor: pointer;
  color: var(--color-pink-deep);
}
</style>
