<!--
  WeatherOverlay.vue
  全屏天气特效层（通过 Teleport 渲染到 body）
  职责：纯视觉特效，无业务逻辑
-->
<template>
  <Teleport to="body">
    <div class="global-weather-overlay">
      <!-- 晴天：太阳 / 月亮 -->
      <div v-if="weather === 'sunny'" class="weather-effect sun-effect">
        <div v-if="!isNightMode" class="sun">
          <div class="sun-body">
            <div class="sun-core"></div>
            <div class="sun-inner-glow"></div>
          </div>
          <div class="sun-rays">
            <div
              class="ray"
              v-for="i in SUN_RAY_COUNT"
              :key="i"
              :style="{ transform: `rotate(${i * 30}deg)` }"
            ></div>
          </div>
          <div class="sun-orbital">
            <div class="orbital-ring"></div>
          </div>
        </div>
        <div v-else class="moon">
          <div class="moon-body">
            <div class="moon-crater crater-1"></div>
            <div class="moon-crater crater-2"></div>
            <div class="moon-crater crater-3"></div>
            <div class="moon-crater crater-4"></div>
            <div class="moon-glow"></div>
          </div>
          <div class="moon-stars">
            <span
              class="star"
              v-for="i in MOON_STAR_COUNT"
              :key="i"
              :style="getStarStyle(i)"
              >✦</span
            >
          </div>
        </div>
      </div>

      <!-- 雨天 -->
      <div v-if="weather === 'rainy'" class="weather-effect rain-effect">
        <div
          class="raindrop"
          v-for="i in RAIN_COUNT"
          :key="i"
          :style="getRainStyle(i)"
        ></div>
        <div
          class="rain-ripple"
          v-for="i in RIPPLE_COUNT"
          :key="'ripple-' + i"
          :style="getRippleStyle(i)"
        ></div>
      </div>

      <!-- 下雪 -->
      <div v-if="weather === 'snowy'" class="weather-effect snow-effect">
        <div
          class="snowflake"
          v-for="i in SNOW_COUNT"
          :key="i"
          :style="getSnowStyle(i)"
        >
          ❄
        </div>
      </div>

      <!-- 大风 -->
      <div v-if="weather === 'windy'" class="weather-effect wind-effect">
        <div
          class="wind-line"
          v-for="i in WIND_COUNT"
          :key="i"
          :style="getWindStyle(i)"
        ></div>
        <div
          class="wind-leaf"
          v-for="i in LEAF_COUNT"
          :key="'leaf-' + i"
          :style="getLeafStyle(i)"
        >
          🍃
        </div>
      </div>

      <!-- 装饰云朵 -->
      <div class="sky-deco-cloud cloud-1"></div>
      <div class="sky-deco-cloud cloud-2"></div>
      <div class="sky-deco-cloud cloud-3"></div>

      <!-- 夜间星星 -->
      <div v-if="isNightMode && weather === 'sunny'" class="night-stars">
        <span
          class="star-blink"
          v-for="i in STAR_COUNT"
          :key="i"
          :style="getNightStarStyle(i)"
          >✦</span
        >
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {
  RAIN_COUNT,
  RIPPLE_COUNT,
  SNOW_COUNT,
  WIND_COUNT,
  LEAF_COUNT,
  STAR_COUNT,
  MOON_STAR_COUNT,
  SUN_RAY_COUNT
} from '@/composables/useWeather'

defineProps({
  weather: { type: String, required: true },
  isNightMode: { type: Boolean, default: false },
  getRainStyle: { type: Function, required: true },
  getRippleStyle: { type: Function, required: true },
  getSnowStyle: { type: Function, required: true },
  getWindStyle: { type: Function, required: true },
  getLeafStyle: { type: Function, required: true },
  getNightStarStyle: { type: Function, required: true },
  getStarStyle: { type: Function, required: true }
})
</script>

<style>
/* ===== 非 scoped：全屏天气特效容器 + 所有 @keyframes 动画 ===== */
.global-weather-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none !important;
  z-index: 0;
  overflow: hidden;
  user-select: none;
}

.weather-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
  z-index: 2;
  overflow: hidden;
}
.sun-effect {
  z-index: 1;
}

/* ===== 太阳 ===== */
.sun {
  position: absolute;
  top: 25px;
  right: 60px;
  width: 100px;
  height: 100px;
  z-index: 3;
  animation: sunFloat 6s ease-in-out infinite;
}
@keyframes sunFloat {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.02);
  }
}
.sun-body {
  position: relative;
  width: 100%;
  height: 100%;
}
.sun-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    #fef08a 0%,
    #f59e0b 55%,
    #d97706 100%
  );
  box-shadow:
    0 0 40px rgba(245, 158, 11, 0.5),
    0 0 80px rgba(245, 158, 11, 0.3),
    0 0 120px rgba(245, 158, 11, 0.15);
  z-index: 2;
  animation: sunPulse 3s ease-in-out infinite;
}
@keyframes sunPulse {
  0%,
  100% {
    box-shadow:
      0 0 40px rgba(245, 158, 11, 0.5),
      0 0 80px rgba(245, 158, 11, 0.3),
      0 0 120px rgba(245, 158, 11, 0.15);
  }
  50% {
    box-shadow:
      0 0 60px rgba(245, 158, 11, 0.6),
      0 0 120px rgba(245, 158, 11, 0.4),
      0 0 180px rgba(245, 158, 11, 0.2);
  }
}
.sun-inner-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(254, 240, 138, 0.3) 0%,
    transparent 70%
  );
  z-index: 1;
  animation: glowPulse 2s ease-in-out infinite alternate;
}
@keyframes glowPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
}
.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  z-index: 0;
  animation: raysRotate 20s linear infinite;
}
@keyframes raysRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  width: 4px;
  height: 60px;
  margin-left: -2px;
  margin-top: -30px;
  background: linear-gradient(
    to top,
    rgba(245, 158, 11, 0.6),
    rgba(245, 158, 11, 0.1)
  );
  border-radius: 2px;
  animation: rayFlicker 2s ease-in-out infinite alternate;
}
.ray:nth-child(odd) {
  animation-delay: 0.3s;
}
.ray:nth-child(3n) {
  animation-delay: 0.6s;
}
@keyframes rayFlicker {
  0% {
    opacity: 0.3;
    transform: scaleY(0.6);
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
}
.sun-orbital {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  z-index: -1;
  animation: orbitalSpin 30s linear infinite;
}
@keyframes orbitalSpin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
.orbital-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1.5px dashed rgba(245, 158, 11, 0.15);
}
.orbital-ring::before {
  content: '☀️';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  opacity: 0.3;
}

/* ===== 月亮 ===== */
.moon {
  position: absolute;
  top: 30px;
  right: 70px;
  z-index: 3;
  animation: moonFloat 8s ease-in-out infinite;
}
@keyframes moonFloat {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.02);
  }
}
.moon-body {
  position: relative;
  width: 80px;
  height: 80px;
}
.moon-body::before {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    #f0f0f0,
    #d4d4d8 40%,
    #a1a1aa 70%,
    #71717a 100%
  );
  box-shadow:
    0 0 30px rgba(255, 255, 255, 0.2),
    0 0 60px rgba(255, 255, 255, 0.1),
    0 0 100px rgba(255, 255, 255, 0.05),
    inset -10px -10px 30px rgba(0, 0, 0, 0.15);
}
.moon-glow {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 70%
  );
  animation: moonGlow 4s ease-in-out infinite alternate;
}
@keyframes moonGlow {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.2);
    opacity: 1;
  }
}
.moon-crater {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 60% 40%,
    rgba(160, 160, 170, 0.3),
    rgba(80, 80, 90, 0.4)
  );
  border: 1px solid rgba(120, 120, 130, 0.2);
}
.crater-1 {
  width: 18px;
  height: 18px;
  top: 15px;
  left: 12px;
}
.crater-2 {
  width: 12px;
  height: 12px;
  top: 40px;
  right: 15px;
}
.crater-3 {
  width: 22px;
  height: 22px;
  bottom: 15px;
  left: 20px;
}
.crater-4 {
  width: 10px;
  height: 10px;
  bottom: 30px;
  right: 25px;
}
.moon-stars {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  pointer-events: none;
  z-index: -1;
}
.moon-stars .star {
  position: absolute;
  color: rgba(255, 255, 255, 0.6);
  font-size: 8px;
  animation: starTwinkle 2s ease-in-out infinite alternate;
}
@keyframes starTwinkle {
  0% {
    opacity: 0.2;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== 雨滴 ===== */
.raindrop {
  position: absolute;
  top: -20px;
  width: 3px;
  background: linear-gradient(
    to bottom,
    rgba(147, 197, 253, 0.95),
    rgba(180, 210, 255, 0.35)
  );
  border-radius: 2px;
  box-shadow: 0 0 5px rgba(147, 197, 253, 0.5);
  animation: rainFall linear infinite;
}
@keyframes rainFall {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh + 50px)) translateX(-20px);
    opacity: 0;
  }
}
.rain-ripple {
  position: absolute;
  border: 2px solid rgba(147, 197, 253, 0.3);
  border-radius: 50%;
  animation: rippleExpand 2s ease-out infinite;
}
@keyframes rippleExpand {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* ===== 雪花 ===== */
.snowflake {
  position: absolute;
  top: -20px;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: snowFall linear infinite;
  user-select: none;
}
@keyframes snowFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(0.8);
    opacity: 0.5;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh + 50px)) translateX(30px) rotate(720deg)
      scale(1.2);
    opacity: 0.3;
  }
}

/* ===== 风 ===== */
.wind-line {
  position: absolute;
  right: -100px;
  height: 3px;
  background: linear-gradient(to left, rgba(148, 163, 184, 0.6), transparent);
  border-radius: 2px;
  animation: windBlow linear infinite;
}
@keyframes windBlow {
  0% {
    transform: translateX(0) scaleX(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(calc(-100vw - 200px)) scaleX(0.5);
    opacity: 0;
  }
}
.wind-leaf {
  position: absolute;
  right: -30px;
  animation: leafFly linear infinite;
  user-select: none;
}
@keyframes leafFly {
  0% {
    transform: translateX(0) translateY(0) rotate(0deg) scale(0.8);
    opacity: 0.5;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(calc(-100vw - 200px)) translateY(-50px) rotate(720deg)
      scale(1.2);
    opacity: 0.2;
  }
}

/* ===== 云朵 ===== */
.sky-deco-cloud {
  position: absolute;
  background: var(--cloud-color);
  border: 3px solid var(--border-dark);
  border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
  pointer-events: none !important;
  animation: cloudFloat 20s linear infinite alternate;
  z-index: 1;
  transition: background 0.5s ease;
}
.cloud-1 {
  width: 140px;
  height: 60px;
  top: 120px;
  left: 8%;
  opacity: 0.85;
}
.cloud-2 {
  width: 200px;
  height: 75px;
  bottom: 40px;
  left: 35%;
  opacity: 0.5;
  animation-duration: 35s;
}
.cloud-3 {
  width: 100px;
  height: 45px;
  top: 90px;
  right: 20%;
  opacity: 0.9;
  animation-duration: 18s;
}
@keyframes cloudFloat {
  0% {
    transform: translateX(-15px) translateY(0px);
  }
  100% {
    transform: translateX(35px) translateY(-8px);
  }
}

/* ===== 夜间星星 ===== */
.night-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
  z-index: 1;
}
.night-stars .star-blink {
  position: absolute;
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  animation: starTwinkle 2s ease-in-out infinite alternate;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}
.star-blink {
  position: absolute;
  font-size: 1.5rem;
  color: var(--color-yellow);
  animation: blink 2.5s infinite alternate;
  pointer-events: none;
  z-index: 1;
}
@keyframes blink {
  0% {
    opacity: 0.1;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .sun {
    top: 15px;
    right: 20px;
    width: 60px;
    height: 60px;
  }
  .sun-core {
    width: 36px;
    height: 36px;
  }
  .sun-inner-glow {
    width: 50px;
    height: 50px;
  }
  .sun-rays {
    width: 80px;
    height: 80px;
  }
  .ray {
    height: 40px;
    margin-top: -20px;
  }
  .sun-orbital {
    width: 90px;
    height: 90px;
  }
  .orbital-ring {
    width: 80px;
    height: 80px;
  }
  .moon {
    top: 20px;
    right: 30px;
  }
  .moon-body {
    width: 50px;
    height: 50px;
  }
  .moon-body::before {
    width: 50px;
    height: 50px;
  }
  .moon-glow {
    width: 70px;
    height: 70px;
    top: -10px;
    left: -10px;
  }
  .crater-1 {
    width: 10px;
    height: 10px;
    top: 10px;
    left: 8px;
  }
  .crater-2 {
    width: 8px;
    height: 8px;
    top: 25px;
    right: 10px;
  }
  .crater-3 {
    width: 14px;
    height: 14px;
    bottom: 10px;
    left: 12px;
  }
  .crater-4 {
    width: 6px;
    height: 6px;
    bottom: 20px;
    right: 15px;
  }
  .moon-stars {
    width: 120px;
    height: 120px;
  }
}
</style>
