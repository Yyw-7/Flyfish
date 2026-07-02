<template>
  <BaseCard width="320px" title="TRAVLE MAP">
    <h3 class="card-title">足迹</h3>
    <p class="travel-desc">收集地图上的每一次微风与日落，把风景折进手帐里。</p>

    <!-- 插画区域：起点 - 虚线弧线与小飞机 - 终点 -->
    <div class="travel-illustration">
      <!-- 装饰性小云朵 -->
      <span class="mini-cloud cloud-1">☁️</span>
      <span class="mini-cloud cloud-2">☁️</span>

      <div class="travel-node">📍</div>

      <div class="travel-path-wrapper">
        <div class="travel-path-arc"></div>
        <div class="travel-plane">✈️</div>
      </div>

      <div class="travel-node">🌍</div>
    </div>

    <button
      class="btn-game-style"
      style="background: var(--color-mint)"
      @click="goToTravel"
    >
      点击查看我的足迹 👣
    </button>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/BaseCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToTravel = () => {
  router.push('/travel-spots')
}
</script>

<style scoped>
.card-title {
  margin-bottom: 1rem;
  font-weight: 900;
  font-size: 1.2rem;
}

.travel-footprint-entry .w-full {
  width: 100%;
  margin-top: 0.5rem;
}

.travel-desc {
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* 核心插画区 */
.travel-illustration {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 2rem;
  position: relative;
  height: 60px;
}

/* 起点与终点的 Emoji */
.travel-node {
  font-size: 1.8rem;
  z-index: 2;
  background: white;
  border-radius: 50%;
  filter: drop-shadow(2px 2px 0px rgba(30, 41, 59, 0.2));
  line-height: 1;
}

/* 中间的航线容器 */
.travel-path-wrapper {
  flex-grow: 1;
  position: relative;
  height: 100%;
  margin: 0 10px;
}

/* 纯 CSS 绘制的虚线拱门（抛物线） */
.travel-path-arc {
  position: absolute;
  bottom: 12px; /* 与两侧 Emoji 底部对齐 */
  left: 0;
  width: 100%;
  height: 50px;
  border: 3px dashed var(--border-dark);
  border-bottom: none; /* 只要上、左、右边框形成拱形 */
  border-radius: 50% 50% 0 0;
  z-index: 1;
}

/* 在弧线顶端飞行的小飞机 */
.travel-plane {
  position: absolute;
  top: -14px; /* 定位到弧线最高点 */
  left: 50%;
  transform: translateX(-50%) rotate(15deg);
  font-size: 1.5rem;
  z-index: 3;
  background: white; /* 遮挡住穿过机身的虚线 */
  padding: 0 4px;
  border-radius: 50%;
  animation: planeArcFly 3s ease-in-out infinite;
}

/* 按钮样式 */
.btn-game-style {
  background: var(--color-yellow, #fef08a);
  width: 100%;
  color: var(--border-dark, #1e293b);
  border: 2.5px solid var(--border-dark, #1e293b);
  padding: 8px 18px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px var(--border-dark, #1e293b);
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.btn-game-style:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--border-dark, #1e293b);
}

/* 悬浮小云朵 */
.mini-cloud {
  position: absolute;
  font-size: 1rem;
  opacity: 0.6;
  z-index: 0;
  animation: cloudFloat 4s ease-in-out infinite;
}
.cloud-1 {
  top: -10px;
  left: 15%;
  animation-delay: 0s;
}
.cloud-2 {
  top: 5px;
  right: 20%;
  animation-delay: 1.5s;
  font-size: 0.8rem;
}

/* 动画：飞机机头上扬与微小浮动 */
@keyframes planeArcFly {
  0%,
  100% {
    transform: translateX(-50%) translateY(0) rotate(15deg);
  }
  50% {
    transform: translateX(-50%) translateY(-6px) rotate(25deg);
  }
}

/* 动画：云朵漂浮 */
@keyframes cloudFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
