<!--
  VinylPlayer.vue
  右侧唱片机区域：拉线开关 + 黑胶唱片 + 播放控件 + 歌单 + 网易云配置
  所有音频逻辑通过 props 从父组件传入（由 useAudioPlayer composable 驱动）
-->
<template>
  <div class="vinyl-player-wrapper">
    <div class="xinghui-player-container">

      <!-- 1. 顶部：黑胶唱片与歌曲信息 -->
      <div class="player-top-section">
        <!-- 黑胶唱片 -->
        <div class="vinyl-deck">
          <div class="tonearm" :class="{ playing: isMusicPlaying }">
            <svg viewBox="0 0 30 100" class="w-full h-full" style="overflow: visible">
              <circle cx="15" cy="15" r="7" fill="#475569" stroke="#1e293b" stroke-width="2.5" />
              <circle cx="15" cy="15" r="3" fill="#1e293b" />
              <path d="M15 20 L15 55 L23 80 L23 95" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
              <rect x="20" y="92" width="6" height="8" rx="1" fill="#facc15" stroke="#1e293b" stroke-width="1.5" />
            </svg>
          </div>
          <div
            class="vinyl-record"
            :class="{ spinning: isMusicPlaying }"
            @click="$emit('togglePlay')"
            title="点击播放/暂停"
          >
            <div class="vinyl-groove"></div>
            <div
              class="vinyl-cover"
              :style="{ backgroundImage: 'url(' + currentTrack.cover + ')' }"
            >
              <div class="center-spindle"></div>
            </div>
          </div>
        </div>
        <!-- 歌曲信息 -->
        <div class="song-info">
          <span class="song-title" :title="currentTrack.title">{{ currentTrack.title }}</span>
          <span class="song-artist">{{ currentTrack.artist }}</span>
        </div>
      </div>

      <!-- 2. 中间：歌词区域 -->
      <div class="lyric-area">
        <span class="lyric-text" :key="currentLyric">{{ currentLyric }}</span>
      </div>

      <!-- 3. 底部：进度条与播放控制 -->
      <div class="player-controls-panel">
        <!-- 进度条 -->
        <div class="progress-area">
          <span class="time-text">{{ formatTime(currentTime) }}</span>
          <input
            type="range"
            class="progress-bar-slider"
            min="0"
            :max="duration || 100"
            :value="currentTime"
            @input="$emit('seekAudio', $event)"
          />
          <span class="time-text">{{ formatTime(duration) }}</span>
        </div>
        <!-- 控制按钮行 -->
        <div class="control-buttons-row">
          <div class="left-actions">
            <button
              class="player-btn"
              @click="$emit('togglePlaylist')"
              :class="{ active: showPlaylist }"
              title="唱片库"
            >
              🎶
            </button>
            <button
              class="player-btn"
              @click="$emit('toggleMusicSettings')"
              :class="{ active: showMusicSettings }"
              title="网易云歌单配置"
            >
              ⚙️
            </button>
          </div>

          <div class="main-actions">
            <button class="player-btn" @click="$emit('prevTrack')" title="上一首">⏮️</button>
            <button
              class="player-btn play-pause-main"
              @click="$emit('togglePlay')"
              :title="isMusicPlaying ? '暂停' : '播放'"
            >
              {{ isMusicPlaying ? '⏸️' : '▶️' }}
            </button>
            <button class="player-btn" @click="$emit('nextTrack')" title="下一首">⏭️</button>
          </div>

          <div class="right-actions">
            <div class="volume-container">
              <button
                class="player-btn"
                @click="$emit('toggleMute')"
                style="width: 22px; height: 22px; font-size: 0.6rem"
              >
                {{ isMuted || volume === 0 ? '🔇' : '🔊' }}
              </button>
              <input
                type="range"
                class="volume-slider"
                min="0"
                max="1"
                step="0.05"
                :value="volume"
                @input="$emit('changeVolume', $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 4. 唱片库覆盖层 -->
      <transition name="slide-up">
        <div class="playlist-overlay" v-if="showPlaylist">
          <div class="playlist-header">
            <span>📂 宝藏唱片盒 ({{ trackList.length }})</span>
            <button class="close-playlist-btn" @click="$emit('togglePlaylist')">✖</button>
          </div>
          <div class="playlist-songs">
            <div
              v-for="(track, idx) in trackList"
              :key="idx"
              :class="['playlist-song-item', { active: currentTrackIdx === idx }]"
              @click="$emit('playSelectedTrack', idx)"
            >
              <div class="song-item-left">
                <span v-if="currentTrackIdx === idx && isMusicPlaying">▶️</span>
                <span v-else>{{ idx + 1 }}</span>
                <span class="song-name-text">{{ track.title }}</span>
              </div>
              <span class="song-item-artist">{{ track.artist }}</span>
            </div>
          </div>
        </div>
      </transition>

      <!-- 5. 网易云歌单配置覆盖层 -->
      <transition name="slide-up">
        <div class="playlist-overlay" v-if="showMusicSettings">
          <div class="playlist-header">
            <span>📡 网易云公开歌单配置</span>
            <button class="close-playlist-btn" @click="$emit('toggleMusicSettings')">✖</button>
          </div>
          <div class="flex flex-col gap-2 flex-grow justify-start">
            <p class="text-[10px] text-slate-500 font-bold leading-tight">
              输入网易云公开歌单ID，实时同步云端歌单并拉取滚动歌词！
            </p>
            <input
              type="text"
              :value="neteasePlaylistId"
              @input="$emit('update:neteasePlaylistId', $event.target.value)"
              placeholder="输入歌单ID (例: 24381616)"
              class="text-xs border-2 border-slate-800 p-1.5 rounded-lg outline-none font-bold bg-transparent"
            />

            <div class="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded" v-if="isConnectedToCloud">
              ⚡ 已连通并解析成功！
            </div>
            <div class="text-[10px] text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded" v-if="connectionError">
              ❌ {{ connectionError }}
            </div>

            <div class="flex gap-2 justify-end mt-auto pb-4">
              <button
                @click="$emit('restoreDefaults')"
                class="text-[10px] font-extrabold opacity-70 hover:underline mr-auto text-slate-600"
              >
                恢复默认
              </button>
              <button
                @click="$emit('connectNetease')"
                :disabled="isLoading"
                class="text-xs bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-black border-2 border-slate-800 px-3 py-1.5 rounded-lg active:translate-y-0.5 transition-all"
              >
                {{ isLoading ? '正在同步...' : '同步 ⚡' }}
              </button>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
defineProps({
  // 播放状态
  isMusicPlaying: Boolean,
  currentTrackIdx: Number,
  currentTime: Number,
  duration: Number,
  volume: Number,
  isMuted: Boolean,
  showPlaylist: Boolean,
  showMusicSettings: Boolean,
  isConnectedToCloud: Boolean,
  neteasePlaylistId: String,
  currentLyric: String,
  trackList: Array,
  currentTrack: Object,
  formatTime: Function,
  // 网易云配置状态
  isLoading: Boolean,
  connectionError: String
})

defineEmits([
  'togglePlay',
  'prevTrack',
  'nextTrack',
  'playSelectedTrack',
  'seekAudio',
  'changeVolume',
  'toggleMute',
  'togglePlaylist',
  'toggleMusicSettings',
  'connectNetease',
  'restoreDefaults',
  'update:neteasePlaylistId'
])
</script>

<style scoped>
/* ===== 唱片机容器 ===== */
.vinyl-player-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}
.xinghui-player-container {
  background: white;
  border: 3px solid var(--border-dark);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 4px 4px 0px var(--border-dark);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

/* ===== 顶部：唱片与信息 ===== */
.player-top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* 黑胶唱片 */
.vinyl-deck {
  width: 120px;
  height: 120px;
  position: relative;
  flex-shrink: 0;
}
.vinyl-record {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #0f172a;
  border: 3px solid var(--border-dark);
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 4px 6px rgba(0,0,0,0.15);
}
.vinyl-groove {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.05);
  background: repeating-radial-gradient(
    circle,
    transparent,
    transparent 3px,
    rgba(255, 255, 255, 0.02) 4px,
    rgba(0, 0, 0, 0.2) 5px
  );
}
.vinyl-cover {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid var(--border-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}
.center-spindle {
  width: 6px;
  height: 6px;
  background: white;
  border: 2px solid var(--border-dark);
  border-radius: 50%;
}

/* 旋转动画 */
.vinyl-record.spinning {
  animation: spinVinyl 12s linear infinite;
}
@keyframes spinVinyl {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 唱针 */
.tonearm {
  position: absolute;
  width: 25px;
  height: 75px;
  top: -15px;
  right: -10px;
  transform-origin: 15px 15px;
  transform: rotate(-28deg);
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 5;
  pointer-events: none;
}
.tonearm.playing {
  transform: rotate(5deg);
}

/* 歌曲信息 */
.song-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.song-title {
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--border-dark);
  white-space: nowrap;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-artist {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  background: rgba(100, 116, 139, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
}

/* ===== 中间：歌词区域 ===== */
.lyric-area {
  width: 100%;
  margin: 6px 0;
  background: rgba(100, 116, 139, 0.04);
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  min-height: 44px;
}
.lyric-text {
  font-size: 0.78rem;
  font-weight: 800;
  color: #475569;
  text-align: center;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all 0.2s ease;
}

/* ===== 底部：进度条与播放控制 ===== */
.player-controls-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 进度条 */
.progress-area {
  display: flex;
  align-items: center;
  gap: 8px;
}
.time-text {
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 600;
  opacity: 0.7;
  color: var(--border-dark);
}
.progress-bar-slider {
  flex-grow: 1;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(100, 116, 139, 0.2);
  border: 1.5px solid var(--border-dark);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}
.progress-bar-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-pink-deep);
  border: 1.5px solid var(--border-dark);
  cursor: pointer;
}

/* 按钮控制行 */
.control-buttons-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-actions, .right-actions {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
}
.right-actions {
  justify-content: flex-end;
}
.main-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}
.player-btn {
  background: white;
  border: 2px solid var(--border-dark);
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  cursor: pointer;
  box-shadow: 1.5px 1.5px 0px var(--border-dark);
  transition: all 0.1s ease;
}
.player-btn:hover {
  transform: translate(-0.5px, -0.5px);
  box-shadow: 2px 2px 0px var(--border-dark);
}
.player-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0px var(--border-dark);
}
.player-btn.active {
  background: var(--color-pink);
}
.play-pause-main {
  background: var(--color-yellow);
  font-size: 0.85rem;
  width: 32px;
  height: 32px;
  border-radius: 10px;
}
.volume-container {
  display: flex;
  align-items: center;
  gap: 3px;
}
.volume-slider {
  width: 30px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(100, 116, 139, 0.2);
  border: 1px solid var(--border-dark);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-dark);
  cursor: pointer;
}

/* ===== 唱片库与设置覆盖层 ===== */
.playlist-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 100;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 900;
  border-bottom: 2px dashed #cbd5e1;
  padding-bottom: 8px;
  margin-bottom: 8px;
  color: var(--border-dark);
}
.close-playlist-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #64748b;
  cursor: pointer;
}
.close-playlist-btn:hover {
  color: var(--color-pink-deep);
}
.playlist-songs {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.playlist-songs::-webkit-scrollbar {
  width: 3px;
}
.playlist-songs::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
.playlist-song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
  border: 1.5px solid transparent;
}
.playlist-song-item:hover {
  background: rgba(100, 116, 139, 0.05);
}
.playlist-song-item.active {
  background: var(--color-pink);
  border-color: var(--border-dark);
  color: #1e293b;
  font-weight: bold;
}
.song-item-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 800;
}
.song-name-text {
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.song-item-artist {
  font-size: 0.65rem;
  color: #64748b;
  max-width: 70px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Vue Transition */
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .vinyl-player-wrapper {
    align-items: center;
  }
  .xinghui-player-container {
    padding: 12px;
  }
  .vinyl-deck {
    width: 80px;
    height: 80px;
  }
  .vinyl-record {
    width: 80px;
    height: 80px;
  }
  .vinyl-cover {
    width: 24px;
    height: 24px;
  }
  .tonearm {
    display: none;
  }
  .song-title {
    max-width: 160px;
  }
}
</style>
