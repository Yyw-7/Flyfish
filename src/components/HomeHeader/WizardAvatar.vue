<!--
  WizardAvatar.vue
  星辉魔法少女头像：SVG 绘制 + 眼动追踪 + 点击互动
-->
<template>
  <div class="user-profile-card">
    <div class="interactive-avatar-wrap" @click="handlePet">
      <div class="drawing-wizard-face">
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          style="overflow: visible"
        >
          <path d="M 15 65 Q 10 30 50 15 Q 90 30 85 65 Z" fill="#2d3748" />
          <path
            d="M 25 22 L 10 5 L 35 15 Z"
            fill="#a78bfa"
            stroke="#1e293b"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <path
            d="M 75 22 L 90 5 L 65 15 Z"
            fill="#a78bfa"
            stroke="#1e293b"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          <circle
            cx="50"
            cy="15"
            r="7"
            fill="#facc15"
            stroke="#1e293b"
            stroke-width="2"
          />
          <circle
            cx="50"
            cy="55"
            r="32"
            fill="#fff1f2"
            stroke="#1e293b"
            stroke-width="3"
          />
          <path
            d="M 18 50 Q 35 30 50 40 Q 65 30 82 50"
            fill="none"
            stroke="#1e293b"
            stroke-width="3.5"
          />
          <path
            d="M 46 68 Q 50 72 54 68"
            fill="none"
            stroke="#1e293b"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
        <div class="wizard-eye left-eye">
          <div class="wizard-pupil" :style="leftEyeStyle"></div>
        </div>
        <div class="wizard-eye right-eye">
          <div class="wizard-pupil" :style="rightEyeStyle"></div>
        </div>
        <div class="wizard-blush blush-left"></div>
        <div class="wizard-blush blush-right"></div>
      </div>
    </div>

    <div class="user-text-info">
      <div class="avatar-speech-bubble">💬 "{{ speakText }}"</div>
      <h2 class="nickname">小飞鱼</h2>
      <p class="slogan">记录代码、生活与那些闪闪发光的日常 ✨</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  leftEyeStyle: { type: Object, default: () => ({}) },
  rightEyeStyle: { type: Object, default: () => ({}) },
  onSpeak: { type: Function, default: null }
})

const AVATAR_QUOTES = [
  '嗷呜！摸我头可以一键洗掉坏情绪 🪄',
  '其实我脑袋上的猫耳睡帽才是本体喵~ 🐱',
  '嘘... 听，旁边的黑胶唱片在转动 💿',
  '好舒服呀~ 正在用唱片旋律构思新代码呢'
]

const speakText = ref('摸摸我的头，会有意想不到的治愈力量哦 🫧')

const handlePet = () => {
  speakText.value =
    AVATAR_QUOTES[Math.floor(Math.random() * AVATAR_QUOTES.length)]
  props.onSpeak?.()
}
</script>

<style scoped>
.user-profile-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.interactive-avatar-wrap {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.4);
  padding: 12px;
  border-radius: 24px;
  border: 2px dashed rgba(30, 41, 59, 0.3);
  backdrop-filter: blur(4px);
}
:global(.dark-mode) .interactive-avatar-wrap {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}
.drawing-wizard-face {
  width: 85px;
  height: 85px;
  position: relative;
}
.wizard-eye {
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border: 2px solid var(--border-dark);
  border-radius: 50%;
  top: 40px;
}
.wizard-eye.left-eye {
  left: 22px;
}
.wizard-eye.right-eye {
  right: 22px;
}
.wizard-pupil {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--border-dark);
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform 0.05s linear;
}
.wizard-blush {
  position: absolute;
  width: 12px;
  height: 6px;
  background: rgba(239, 68, 68, 0.4);
  border-radius: 50%;
  top: 50px;
}
.blush-left {
  left: 16px;
}
.blush-right {
  right: 16px;
}
.user-text-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
.avatar-speech-bubble {
  background: white;
  border: 2px solid var(--border-dark);
  padding: 6px 14px;
  border-radius: 12px 12px 12px 0;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--border-dark);
  width: fit-content;
  box-shadow: var(--shadow-flat-sm);
  position: relative;
  margin-bottom: 4px;
}
:global(.dark-mode) .avatar-speech-bubble {
  background: #1e293b;
  color: white;
}
.nickname {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--border-dark);
  letter-spacing: 1px;
}
.slogan {
  font-size: 0.95rem;
  font-weight: 700;
  color: #475569;
  opacity: 0.9;
}
:global(.dark-mode) .slogan {
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .user-profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .avatar-speech-bubble {
    border-radius: 12px;
  }
}
</style>
