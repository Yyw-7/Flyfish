import { ref, computed } from 'vue'

export function useEyeTracking() {
  const leftEyeAngle = ref(0)
  const rightEyeAngle = ref(0)
  const eyeDistance = ref(0)

  const updateEyeAngle = (event) => {
    const avatarCard = document.querySelector('.interactive-avatar-wrap')
    if (!avatarCard) return
    const rect = avatarCard.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    const angle = Math.atan2(dy, dx)
    leftEyeAngle.value = angle
    rightEyeAngle.value = angle
    eyeDistance.value = Math.min(4, Math.hypot(dx, dy) / 35)
  }

  const leftEyeStyle = computed(() => ({
    transform: `translate(${Math.cos(leftEyeAngle.value) * eyeDistance.value}px, ${Math.sin(leftEyeAngle.value) * eyeDistance.value}px)`
  }))

  const rightEyeStyle = computed(() => ({
    transform: `translate(${Math.cos(rightEyeAngle.value) * eyeDistance.value}px, ${Math.sin(rightEyeAngle.value) * eyeDistance.value}px)`
  }))

  return { updateEyeAngle, leftEyeStyle, rightEyeStyle }
}
