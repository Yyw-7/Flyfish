<template>
  <div class="home-wrapper">
    <!-- 顶部介绍栏 -->
    <HomeHeader :char="char" />
    <div class="main-grid">
      <div class="left">
        <!-- 左侧任务清单 -->
        <QuestList />
        <!-- 左侧留言本 -->
        <Guestbook />
      </div>
      <div class="center">
        <!-- 中间日记区域 -->
        <DiaryCreator
          ref="diaryRef"
          :filter-date="filterDate"
          @clear-filter="clearFilter"
        />
      </div>
      <div class="right">
        <!-- 右侧日历 -->
        <MiniCalendar @date-selected="handleDateSelected" ref="calendarRef" />
        <!-- 右侧旅行地图 -->
        <TravelMap />
      </div>
    </div>
  </div>
</template>

<script setup>
import DiaryCreator from '@/components/DiaryCreator.vue'
import HomeHeader from '@/components/HomeHeader.vue'
import QuestList from '@/components/QuestList.vue'
import TravelMap from '@/components/TravelMap.vue'
import MiniCalendar from '@/components/MiniCalendar.vue'
import Guestbook from '@/components/Guestbook.vue'
import { ref } from 'vue'

// 在父组件中定义数据
// const char = ref({})

// ============ 筛选日期状态 ============
const filterDate = ref(null)

// ============ 引用 ============
const calendarRef = ref(null)
const diaryRef = ref(null)

// ============ 处理日期选择事件 ============
const handleDateSelected = (payload) => {
  filterDate.value = payload
}

const clearFilter = () => {
  filterDate.value = null
}
</script>

<style scoped>
.home-wrapper {
  gap: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

/* ===== 三栏 Grid 布局 — 左右对称，间距天然一致 ===== */
.main-grid {
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  gap: 1.5rem;
  width: 100%;
  align-items: start;
}

.main-grid .left {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;  /* 防止子元素撑破容器 */
}

.main-grid .center {
  min-width: 0;
}

.main-grid .right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

/* 侧栏卡片：限制最大宽度，防止过宽时拉伸 */
.main-grid .left > *,
.main-grid .right > * {
  max-width: 100%;
}

/* ===== 响应式：侧栏收窄 ===== */
@media (max-width: 1260px) {
  .main-grid {
    grid-template-columns: 280px 1fr 280px;
    gap: 1rem;
  }
}

/* ===== 响应式：左右两栏 + 日记换行到底部 ===== */
@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr 1fr;
  }
  .main-grid .center {
    grid-column: 1 / -1;        /* 日记独占整行 */
    order: 3;
  }
  .main-grid .right {
    order: 2;
  }
}

/* ===== 响应式：单栏堆叠 ===== */
@media (max-width: 680px) {
  .home-wrapper {
    gap: 0.75rem;
  }
  .main-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
