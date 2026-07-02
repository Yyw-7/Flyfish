<!--
  HomeHeader.vue — 星辉主页顶部横幅
  职责：组合子组件 + 编排 composables，仅做胶水层
  子组件：WeatherOverlay / WizardAvatar / WeatherPanel / VinylPlayer
-->
<template>
  <BaseCard width="1320px" style="padding: 0rem">
    <div
      class="cozy-hero-banner"
      :class="'bg-' + weather"
      @mousemove="updateEyeAngle($event)"
    >
      <!-- 全屏天气特效 -->
      <WeatherOverlay
        :weather="weather"
        :is-night-mode="isNightMode"
        :get-rain-style="getRainStyle"
        :get-ripple-style="getRippleStyle"
        :get-snow-style="getSnowStyle"
        :get-wind-style="getWindStyle"
        :get-leaf-style="getLeafStyle"
        :get-night-star-style="getNightStarStyle"
        :get-star-style="getStarStyle"
      />

      <!-- 核心交互区：三栏布局 -->
      <div class="hero-content-wrapper">
        <!-- 左侧：头像 + 天气选择 -->
        <div class="hero-left-section">
          <WizardAvatar
            :left-eye-style="leftEyeStyle"
            :right-eye-style="rightEyeStyle"
            :on-speak="onAvatarSpeak"
          />
          <WeatherPanel v-model="weather" />
        </div>

        <!-- 中间：唱片机（占据最多空间） -->
        <VinylPlayer
          :is-music-playing="isMusicPlaying"
          :current-track-idx="currentTrackIdx"
          :current-time="currentTime"
          :duration="duration"
          :volume="volume"
          :is-muted="isMuted"
          :show-playlist="showPlaylist"
          :show-music-settings="showMusicSettings"
          :is-connected-to-cloud="isConnectedToCloud"
          :netease-playlist-id="neteasePlaylistId"
          :current-lyric="currentLyric"
          :track-list="trackList"
          :current-track="currentTrack"
          :format-time="formatTime"
          :is-loading="isLoading"
          :connection-error="connectionError"
          @toggle-play="togglePlay"
          @prev-track="prevTrack"
          @next-track="nextTrack"
          @play-selected-track="playSelectedTrack"
          @seek-audio="seekAudio"
          @change-volume="changeVolume"
          @toggle-mute="toggleMute"
          @toggle-playlist="togglePlaylist"
          @toggle-music-settings="toggleMusicSettings"
          @connect-netease="connectToNetease"
          @restore-defaults="restoreDefaultTracks"
          @update:netease-playlist-id="neteasePlaylistId = $event"
        />

        <!-- 右侧：拉线开关 -->
        <div class="hero-right-section">
          <div
            class="pull-switch-chain-wrap"
            @click="handleToggleNight"
            title="拉动开关灯，切换昼夜模式"
          >
            <div class="pull-bead-line"></div>
            <div class="pull-bead-handle"></div>
          </div>
        </div>
      </div>
    </div>

  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/BaseCard.vue'
import WeatherOverlay from '@/components/HomeHeader/WeatherOverlay.vue'
import WizardAvatar from '@/components/HomeHeader/WizardAvatar.vue'
import WeatherPanel from '@/components/HomeHeader/WeatherPanel.vue'
import VinylPlayer from '@/components/HomeHeader/VinylPlayer.vue'

import { useWeather } from '@/composables/useWeather'
import { useDarkMode } from '@/composables/useDarkMode'
import { useToast } from '@/composables/useToast'
import { useEyeTracking } from '@/composables/useEyeTracking'
import { useAudioPlayer } from '@/composables/useAudioPlayer'

// ===== Composables =====
const {
  weather,
  getRainStyle,
  getRippleStyle,
  getSnowStyle,
  getWindStyle,
  getLeafStyle,
  getNightStarStyle,
  getStarStyle
} = useWeather()

const { isNightMode, toggleNightMode } = useDarkMode()
const { triggerToast } = useToast()
const { updateEyeAngle, leftEyeStyle, rightEyeStyle } = useEyeTracking()

const {
  isMusicPlaying,
  currentTrackIdx,
  currentTime,
  duration,
  volume,
  isMuted,
  showPlaylist,
  showMusicSettings,
  isConnectedToCloud,
  neteasePlaylistId,
  currentLyric,
  trackList,
  currentTrack,
  formatTime,
  isLoading,
  connectionError,
  togglePlay,
  prevTrack,
  nextTrack,
  playSelectedTrack,
  seekAudio,
  changeVolume,
  toggleMute,
  togglePlaylist,
  toggleMusicSettings,
  connectToNetease,
  restoreDefaultTracks,
  playSynthNote
} = useAudioPlayer(triggerToast)

// ===== 昼夜切换 =====
const handleToggleNight = () => {
  const isNight = toggleNightMode()
  playSynthNote(isNight ? 440 : 220, 0.1)
  setTimeout(() => playSynthNote(isNight ? 880 : 330, 0.15), 50)
  triggerToast(
    isNight
      ? '晚安！星空暖光模式已开启 🌌'
      : '早安！暖阳回归，又是可爱的一天 ☀️'
  )
}

// ===== 头像点击音效 =====
const onAvatarSpeak = () => {
  playSynthNote(587.33, 0.2)
}
</script>

<style scoped>
/* ===== 核心容器 ===== */
.cozy-hero-banner {
  background: transparent;
  border-radius: 28px;
  position: relative;
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  padding: 2rem 3rem;
  transition: background 0.8s ease;
}

/* ===== 穿透 BaseCard ===== */
:deep(.base-card-content) {
  padding: 0 !important;
}
:deep(.card-body) {
  padding: 0 !important;
}

/* ===== 天气背景（HomeHeader 专属变量） ===== */
:global(body) {
  --sky-bg: linear-gradient(135deg, #fff5f5 0%, #fffbeb 100%);
  --cloud-color: rgba(255, 255, 255, 0.9);
}

:global(body) {
  background: var(--sky-bg, var(--bg-canvas)) !important;
  background-attachment: fixed !important;
  transition:
    background 0.8s ease,
    background-color 0.8s ease;
}
:global(body.bg-sunny),
.bg-sunny {
  --sky-bg: linear-gradient(135deg, #fef9e7 0%, #fdebd0 50%, #fadbd8 100%);
  --cloud-color: rgba(255, 255, 255, 0.85);
}
:global(body.bg-cloudy),
.bg-cloudy {
  --sky-bg: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --cloud-color: rgba(255, 255, 255, 0.8);
}
:global(body.bg-rainy),
.bg-rainy {
  --sky-bg: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%);
  --cloud-color: rgba(255, 255, 255, 0.6);
}
:global(body.bg-snowy),
.bg-snowy {
  --sky-bg: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #cbd5e1 100%);
  --cloud-color: rgba(255, 255, 255, 0.9);
}
:global(body.bg-windy),
.bg-windy {
  --sky-bg: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 50%, #94a3b8 100%);
  --cloud-color: rgba(255, 255, 255, 0.7);
}

.dark-mode {
  --bg-canvas: #111827;
  --border-dark: #f8fafc;
  --color-pink: #4c1d24;
  --color-pink-deep: #991b1b;
  --color-mint: #064e3b;
  --color-yellow: #451a03;
}

/* 夜间模式 — 每种天气独立的暗色背景（不用 !important 统一覆盖） */
:global(html.dark-mode body.bg-sunny),
.dark-mode .bg-sunny {
  --sky-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  --cloud-color: rgba(255, 255, 255, 0.12);
}
:global(html.dark-mode body.bg-cloudy),
.dark-mode .bg-cloudy {
  --sky-bg: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
  --cloud-color: rgba(255, 255, 255, 0.1);
}
:global(html.dark-mode body.bg-rainy),
.dark-mode .bg-rainy {
  --sky-bg: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
  --cloud-color: rgba(255, 255, 255, 0.08);
}
:global(html.dark-mode body.bg-snowy),
.dark-mode .bg-snowy {
  --sky-bg: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  --cloud-color: rgba(255, 255, 255, 0.18);
}
:global(html.dark-mode body.bg-windy),
.dark-mode .bg-windy {
  --sky-bg: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 50%, #3d3d5c 100%);
  --cloud-color: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  transition:
    background-color 0.4s ease,
    border-color 0.4s ease;
}

/* ===== 布局 ===== */
.hero-content-wrapper {
  display: flex;
  justify-content: center;
  /* align-items: flex-end; */
  flex-grow: 1;
  position: relative;
  z-index: 10;
  gap: 2rem;
}

.hero-left-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  max-width: 420px;
  flex-shrink: 0;
}

/* 中间：唱片机（占据最多空间） */
.hero-content-wrapper > :nth-child(2) {
  flex: 1;
  max-width: 600px;
}

/* ===== 右侧拉线开关 ===== */
.hero-right-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: flex-end; */
  flex-shrink: 0;
  min-height: 200px;
  width: 70px;
}

.pull-switch-chain-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
}
.pull-switch-chain-wrap:hover .pull-bead-line {
  transform: scaleY(1.08);
}
.pull-bead-line {
  width: 3px;
  height: 100px;
  background: repeating-linear-gradient(
    to bottom,
    var(--border-dark),
    var(--border-dark) 4px,
    transparent 4px,
    transparent 8px
  );
  transform-origin: top center;
  transition: transform 0.15s ease;
}
.pull-bead-handle {
  width: 16px;
  height: 16px;
  background: var(--color-yellow);
  border: 2px solid var(--border-dark);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* 音符特效 */
:global(.music-note-flow) {
  position: fixed;
  pointer-events: none;
  font-size: 1rem;
  animation: noteFly 1.5s ease-out forwards;
  z-index: 99999;
}
@keyframes noteFly {
  0% {
    transform: translate(0, 0) scale(0.6) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(calc(var(--ndx) * 1px), calc(var(--ndy) * 1px))
      scale(1.1) rotate(var(--nrot));
    opacity: 0;
  }
}

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .hero-content-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  .cozy-hero-banner {
    padding: 1.5rem;
  }
  .hero-left-section {
    align-items: center;
    text-align: center;
  }
  .hero-content-wrapper > :nth-child(2) {
    max-width: 100%;
  }
  .hero-right-section {
    min-height: auto;
    width: auto;
  }
  .pull-bead-line {
    height: 50px;
  }
}
</style>
