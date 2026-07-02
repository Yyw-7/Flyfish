import { ref, watch } from 'vue'

// 天气选项配置
export const WEATHER_OPTIONS = [
  { value: 'sunny', label: '☀️' },
  { value: 'cloudy', label: '☁️' },
  { value: 'rainy', label: '🌧️' },
  { value: 'snowy', label: '❄️' },
  { value: 'windy', label: '💨' }
]

// 粒子数量常量
export const RAIN_COUNT = 120
export const RIPPLE_COUNT = 6
export const SNOW_COUNT = 100
export const WIND_COUNT = 25
export const LEAF_COUNT = 12
export const STAR_COUNT = 20
export const MOON_STAR_COUNT = 8
export const SUN_RAY_COUNT = 12

// ===== 模块级共享天气状态（全局唯一，跨路由持久化） =====
const WEATHER_STORAGE_KEY = 'flyfish_weather'

function loadWeather() {
  try {
    const saved = localStorage.getItem(WEATHER_STORAGE_KEY)
    if (saved && ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'].includes(saved)) {
      return saved
    }
  } catch { /* localStorage 不可用时忽略 */ }
  return 'sunny'
}

const weather = ref(loadWeather())

// 监听天气变化 — 全局仅此一份 watcher，确保任何路由下 body 类名始终正确
watch(
  weather,
  (newVal, oldVal) => {
    if (oldVal) document.body.classList.remove('bg-' + oldVal)
    document.body.classList.add('bg-' + newVal)
    try { localStorage.setItem(WEATHER_STORAGE_KEY, newVal) } catch { /* noop */ }
  },
  { immediate: true }
)

export function useWeather() {

  // ===== 天气特效样式生成器（确定性生成，不依赖 Math.random() 在函数内） =====
  // 使用 seed-based pseudo-random 确保每次渲染一致

  const getRainStyle = (i) => {
    const seed = i * 7 + 13
    return {
      left: ((seed * 37) % 100) + '%',
      animationDelay: ((seed * 13) % 20) / 10 + 's',
      animationDuration: 0.5 + ((seed * 23) % 5) / 10 + 's',
      opacity: 0.3 + ((seed * 17) % 4) / 10,
      height: 10 + ((seed * 11) % 20) + 'px'
    }
  }

  const getRippleStyle = (i) => {
    const seed = i * 19 + 7
    return {
      left: 10 + ((seed * 29) % 80) + '%',
      top: 20 + ((seed * 41) % 60) + '%',
      animationDelay: ((seed * 31) % 30) / 10 + 's',
      width: 10 + ((seed * 43) % 20) + 'px',
      height: 10 + ((seed * 47) % 20) + 'px'
    }
  }

  const getSnowStyle = (i) => {
    const seed = i * 31 + 11
    return {
      left: ((seed * 37) % 100) + '%',
      animationDelay: ((seed * 41) % 50) / 10 + 's',
      animationDuration: 5 + ((seed * 13) % 8) + 's',
      fontSize: 10 + ((seed * 17) % 14) + 'px',
      opacity: 0.3 + ((seed * 19) % 5) / 10
    }
  }

  const getWindStyle = (i) => {
    const seed = i * 43 + 3
    return {
      top: 10 + ((seed * 23) % 80) + '%',
      animationDelay: ((seed * 29) % 30) / 10 + 's',
      animationDuration: 2 + ((seed * 31) % 3) + 's',
      width: 50 + ((seed * 37) % 150) + 'px',
      opacity: 0.1 + ((seed * 41) % 3) / 10
    }
  }

  const getLeafStyle = (i) => {
    const seed = i * 53 + 5
    return {
      top: 10 + ((seed * 17) % 80) + '%',
      animationDelay: ((seed * 29) % 40) / 10 + 's',
      animationDuration: 4 + ((seed * 37) % 6) + 's',
      fontSize: 16 + ((seed * 47) % 14) + 'px'
    }
  }

  const getNightStarStyle = (i) => {
    const seed = i * 61 + 2
    return {
      top: 5 + ((seed * 13) % 90) + '%',
      left: 5 + ((seed * 17) % 90) + '%',
      fontSize: 6 + ((seed * 23) % 14) + 'px',
      animationDelay: ((seed * 29) % 30) / 10 + 's',
      animationDuration: 2 + ((seed * 31) % 3) + 's'
    }
  }

  const getStarStyle = (i) => {
    const seed = i * 71 + 1
    const angle = (i / MOON_STAR_COUNT) * Math.PI * 2 + ((seed * 43) % 5) / 10
    const radius = 50 + ((seed * 47) % 40)
    return {
      top: `calc(50% + ${Math.sin(angle) * radius}px)`,
      left: `calc(50% + ${Math.cos(angle) * radius}px)`,
      animationDelay: ((seed * 59) % 20) / 10 + 's'
    }
  }

  return {
    weather,
    getRainStyle,
    getRippleStyle,
    getSnowStyle,
    getWindStyle,
    getLeafStyle,
    getNightStarStyle,
    getStarStyle
  }
}
