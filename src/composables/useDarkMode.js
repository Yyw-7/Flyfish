import { ref, watch } from 'vue'

// ===== 模块级共享暗色模式状态（全局唯一，跨路由持久化） =====
const DARK_MODE_STORAGE_KEY = 'flyfish_dark_mode'

function loadDarkMode() {
  try {
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY)
    return saved === 'true'
  } catch { /* localStorage 不可用时忽略 */ }
  return false
}

const isNightMode = ref(loadDarkMode())

// 初始化：应用已保存的暗色模式（处理页面刷新在子路由的情况）
if (isNightMode.value) {
  document.documentElement.classList.add('dark-mode')
}

// 监听暗色模式变化，同步 DOM 与 localStorage
watch(isNightMode, (val) => {
  if (val) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
  try { localStorage.setItem(DARK_MODE_STORAGE_KEY, String(val)) } catch { /* noop */ }
})

export function useDarkMode() {
  const toggleNightMode = () => {
    isNightMode.value = !isNightMode.value
    return isNightMode.value
  }

  return { isNightMode, toggleNightMode }
}
