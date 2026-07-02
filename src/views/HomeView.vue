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
  gap: 1.5rem; /* 子元素间距1.5rem */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  min-height: 100vh; /* 确保容器至少占满整个视口高度 */
}

.main-grid {
  display: flex;
  flex-direction: row; /* 水平排列 */
  justify-content: space-between;
  width: 100%;
}

.main-grid .left {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.main-grid .right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-grid center {
  display: flex;
  gap: 1.5rem;
}
</style>
