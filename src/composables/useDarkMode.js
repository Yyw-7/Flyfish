import { ref } from 'vue'

export function useDarkMode() {
  const isNightMode = ref(false)

  const toggleNightMode = () => {
    isNightMode.value = !isNightMode.value
    if (isNightMode.value) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
    return isNightMode.value
  }

  return { isNightMode, toggleNightMode }
}
