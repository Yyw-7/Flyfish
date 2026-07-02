import { ref } from 'vue'

// 模块级单例状态 — 所有组件共享同一个 toast
const toast = ref(false)
const toastMessage = ref('')
let toastTimer = null

export function useToast() {
  const triggerToast = (msg) => {
    toastMessage.value = msg
    toast.value = true
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toast.value = false
    }, 3000)
  }

  return { toast, toastMessage, triggerToast }
}
