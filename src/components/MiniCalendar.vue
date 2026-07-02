<template>
  <div>
    <BaseCard width="320px"  title="CALENDAR">
      <div class="travel-calendar">
        <p style="font-size: 0.8rem; font-weight: 700; color: #6b7280; margin-bottom: 0.8rem;">点击日期查看当天的日记</p>

        <div class="calendar-header">
          <button class="calendar-nav-btn" @click="prevMonth">◀</button>
          <span class="month-year">{{ currentYear }} 年 {{ currentMonth + 1 }} 月</span>
          <button class="calendar-nav-btn" @click="nextMonth">▶</button>
        </div>
        
        <div class="calendar-weekdays">
          <span v-for="d in weekDays" :key="d">{{ d }}</span>
        </div>
        
        <div class="calendar-days-grid">
          <div v-for="day in calendarDays" :key="day.key" 
               :class="['calendar-day-cell', 
                  { 'other-month': !day.isCurrentMonth },
                  { 'today': day.isToday },
                  { 'has-diary': day.hasDiary },
                  { 'selected-date': isDateSelected(day) }]"
               @click="onDateClick(day)">
            <span class="day-number">{{ day.day }}</span>
            <span class="diary-dot" v-if="day.hasDiary">📖</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from './BaseCard.vue';
import { computed, ref, onMounted } from 'vue';
import { getDiaries } from '@/api/diary';

// ================= 日记缓存（响应式） =================
const cachedDiaries = ref([])

const loadDiaries = async () => {
  const result = await getDiaries()
  if (result.success && result.data) {
    cachedDiaries.value = result.data
  }
}

const getDiariesByDate = (dateStr) => {
  return cachedDiaries.value.filter(d => d.date === dateStr)
}

// ================= 日历状态 =================
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

// 选中的日期
const selectedDate = ref(null);
const selectedDiariesCount = ref(0);

// ================= 日历计算属性 =================
const calendarDays = computed(() => {
  const days = [];
  const today = new Date();
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // 从 API 缓存构建日记映射
  const allDiaries = cachedDiaries.value
  const diaryMap = {};
  allDiaries.forEach(diary => {
    const parts = diary.date.split('-');
    const y = parseInt(parts[0]), m = parseInt(parts[1]) - 1, d = parseInt(parts[2]);
    if (y === year && m === month) {
      diaryMap[d] = true;
    }
  });

  // 1. 填充上个月
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    days.push({ 
      key: `prev-${day}`, 
      day, 
      isCurrentMonth: false, 
      isToday: false, 
      hasDiary: false
    });
  }

  // 2. 填充当月
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d);
    const hasDiary = !!diaryMap[d];
    days.push({ 
      key: `current-${d}`, 
      day: d, 
      isCurrentMonth: true, 
      isToday, 
      hasDiary
    });
  }

  // 3. 填充下个月
  const totalDays = days.length;
  const remaining = (7 - (totalDays % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    days.push({ 
      key: `next-${d}`, 
      day: d, 
      isCurrentMonth: false, 
      isToday: false, 
      hasDiary: false
    });
  }
  return days;
});

// ================= 日历方法 =================
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  // 切换月份时清空选中状态
  selectedDate.value = null;
  selectedDiariesCount.value = 0;
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  selectedDate.value = null;
  selectedDiariesCount.value = 0;
};

// 判断某天是否被选中
const isDateSelected = (day) => {
  if (!selectedDate.value || !day.isCurrentMonth) return false;
  return day.day === selectedDate.value.day && 
         currentYear.value === selectedDate.value.year && 
         currentMonth.value === selectedDate.value.month;
};

// 点击日期事件
const onDateClick = (day) => {
  if (!day.isCurrentMonth) return;
  
  // 更新选中日期
  selectedDate.value = {
    year: currentYear.value,
    month: currentMonth.value,
    day: day.day
  };
  
  // 获取该日期的日记
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
  const diaries = getDiariesByDate(dateStr);
  selectedDiariesCount.value = diaries.length;
  
  // 触发事件，传递选中的日期和日记给父组件
  emit('date-selected', {
    date: selectedDate.value,
    dateStr: dateStr,
    diaries: diaries,
    hasDiary: diaries.length > 0
  });
};

// ================= Emits =================
const emit = defineEmits(['date-selected']);

// ================= 暴露方法给父组件 =================
defineExpose({
  selectedDate,
  selectedDiariesCount,
  getDiariesByDate
});

// ================= 生命周期 =================
onMounted(async () => {
  // 先通过 API 加载日记缓存
  try { await loadDiaries() } catch { /* 静默 */ }

  // 默认选中今天
  const now = new Date();
  const today = {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate()
  };
  selectedDate.value = today;

  // 获取今天的日记
  const dateStr = `${today.year}-${String(today.month + 1).padStart(2, '0')}-${String(today.day).padStart(2, '0')}`;
  const diaries = getDiariesByDate(dateStr);
  selectedDiariesCount.value = diaries.length;

  // 触发事件
  emit('date-selected', {
    date: today,
    dateStr: dateStr,
    diaries: diaries,
    hasDiary: diaries.length > 0
  });
});
</script>

<style scoped>
/* ================= 日历专属样式 ================= */
.travel-calendar {
    margin-top: 0.5rem;
}

/* 选中日期显示 */
.selected-date-display {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  padding: 0.4rem 0.8rem;
  background: var(--bg-canvas);
  border-radius: 10px;
  border: 2px solid var(--border-dark);
  text-align: center;
}

/* 日历头部 */
.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
    background: var(--bg-canvas);
    border: 2px solid var(--border-dark);
    border-radius: 12px;
    padding: 0.4rem 0.8rem;
    font-weight: 900;
}
.calendar-header .month-year {
    font-size: 0.95rem;
}
.calendar-nav-btn {
    background: white;
    border: 2px solid var(--border-dark);
    border-radius: 8px;
    padding: 0 8px;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: var(--shadow-flat-sm);
    transition: 0.1s ease;
    line-height: 1.8;
}
.calendar-nav-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px var(--border-dark);
}

/* 星期行 */
.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 0.7rem;
    font-weight: 900;
    background: var(--color-lavender);
    border: 2px solid var(--border-dark);
    border-radius: 8px;
    padding: 4px 0;
    margin-bottom: 4px;
}

/* 日期网格 */
.calendar-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}

/* 每个日期单元格 */
.calendar-day-cell {
    background: white;
    border: 2px solid var(--border-dark);
    border-radius: 8px;
    aspect-ratio: 1 / 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.75rem;
    transition: 0.1s ease;
    box-shadow: var(--shadow-flat-sm);
    cursor: default;
    position: relative;
    padding: 2px;
}
.calendar-day-cell.other-month {
    opacity: 0.4;
}
.calendar-day-cell.today {
    background: var(--color-yellow);
    border-color: var(--border-dark);
    box-shadow: 0 0 0 3px var(--color-yellow-deep), var(--shadow-flat-sm);
}
.calendar-day-cell.has-diary {
    background: var(--color-mint);
    border-color: var(--border-dark);
    cursor: pointer;
}
.calendar-day-cell.has-diary:hover {
    transform: scale(1.05);
}
.calendar-day-cell.selected-date {
    background: var(--color-peach);
    border-color: var(--color-peach-deep);
    box-shadow: 0 0 0 3px var(--color-peach-deep), var(--shadow-flat-sm);
}
.calendar-day-cell .diary-dot {
    font-size: 0.65rem;
    line-height: 1;
    margin-top: 1px;
}
.calendar-day-cell .day-number {
    font-size: 0.7rem;
    font-weight: 900;
}
</style>
