import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 默认曲库
const DEFAULT_TRACK_LIST = [
  {
    title: '林间风起 (Forest Glade)',
    artist: 'Acoustic Serenade',
    cover:
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=150&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    lyrics: [
      '🐿️ 听，落叶沙沙跑过松鼠的身影',
      '🌿 清新原声吉他，敲击内心的宁静',
      '🏕️ 冒险的步伐慢下来，看看风景'
    ]
  },
  {
    title: '纯手工代码八音盒 (Code Synth)',
    artist: 'Web Audio',
    cover:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=150&q=80',
    url: 'synth-live',
    lyrics: [
      '🧪 纯代码渲染，完全不消耗宽带资源',
      '🎼 温润纯净的正弦和弦在跳跃',
      '💮 永不断线的手写晶莹八音盒'
    ]
  }
]

export function useAudioPlayer(onToast) {
  // ===== 音频引擎 =====
  let audioCtx = null
  let audioObj = null
  let noteInterval = null
  let fakeProgressInterval = null
  let lyricCycleInterval = null

  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  const playSynthNote = (freq, duration) => {
    initAudio()
    if (!audioCtx) return
    try {
      const osc = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + duration
      )
      osc.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + duration)
    } catch (e) {
      /* ignore audio errors */
    }
  }

  // ===== 播放器状态 =====
  const isMusicPlaying = ref(false)
  const currentTrackIdx = ref(0)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.5)
  const isMuted = ref(false)
  const showPlaylist = ref(false)
  const showMusicSettings = ref(false)
  const isConnectedToCloud = ref(false)
  const neteasePlaylistId = ref('')
  const currentLyric = ref('欢迎来到星辉式复古音乐馆 💿')
  const isLoading = ref(false)
  const connectionError = ref('')

  const trackList = ref([...DEFAULT_TRACK_LIST])

  // ===== 计算属性 =====
  const currentTrack = computed(() => trackList.value[currentTrackIdx.value])

  const formatTime = (s) => {
    if (isNaN(s) || !s) return '00:00'
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  // ===== 合成器音乐 =====
  const playSynthLofiMusic = () => {
    const progression = [
      [261.63, 329.63, 392.0],
      [220.0, 261.63, 329.63],
      [146.83, 349.23, 440.0]
    ]
    let m = 0
    if (noteInterval) clearInterval(noteInterval)
    noteInterval = setInterval(() => {
      playSynthNote(progression[m][Math.floor(Math.random() * 3)], 2.0)
      createMusicNoteEffect()
      m = (m + 1) % 3
    }, 1200)
  }

  // ===== 音符特效 =====
  const createMusicNoteEffect = () => {
    const vinyl = document.querySelector('.vinyl-record')
    if (!vinyl) return
    const r = vinyl.getBoundingClientRect()
    const n = document.createElement('div')
    n.className = 'music-note-flow'
    n.innerText = ['🎵', '🎶', '🎼', '✨'][Math.floor(Math.random() * 4)]
    n.style.left = r.left + window.scrollX + r.width / 2 + 'px'
    n.style.top = r.top + window.scrollY - 10 + 'px'
    n.style.setProperty('--ndx', (Math.random() - 0.5) * 150)
    n.style.setProperty('--ndy', -(Math.random() * 80 + 60))
    n.style.setProperty('--nrot', (Math.random() - 0.5) * 180 + 'deg')
    document.body.appendChild(n)
    n.addEventListener('animationend', () => n.remove())
  }

  // ===== 歌词轮播 =====
  const startLyricRotation = () => {
    if (lyricCycleInterval) clearInterval(lyricCycleInterval)
    let idx = 0
    currentLyric.value = currentTrack.value.lyrics?.[idx] || ''
    lyricCycleInterval = setInterval(() => {
      idx = (idx + 1) % (currentTrack.value.lyrics?.length || 1)
      currentLyric.value = currentTrack.value.lyrics?.[idx] || ''
      createMusicNoteEffect()
    }, 4500)
  }

  // ===== 播放控制 =====
  const playMusic = () => {
    isMusicPlaying.value = true
    startLyricRotation()
    if (currentTrack.value.url === 'synth-live') {
      if (audioObj) audioObj.pause()
      playSynthLofiMusic()
      duration.value = 180
      if (fakeProgressInterval) clearInterval(fakeProgressInterval)
      fakeProgressInterval = setInterval(() => {
        if (currentTime.value < duration.value) currentTime.value += 1
        else nextTrack()
      }, 1000)
    } else {
      if (noteInterval) clearInterval(noteInterval)
      if (fakeProgressInterval) clearInterval(fakeProgressInterval)
      if (audioObj) {
        audioObj.src = currentTrack.value.url
        audioObj.currentTime = currentTime.value
        audioObj.volume = isMuted.value ? 0 : volume.value
        audioObj.play().catch(() => {
          onToast?.('浏览器拦截了自动播放，请再点击一下播放键')
          isMusicPlaying.value = false
        })
      }
    }
  }

  const pauseMusic = () => {
    isMusicPlaying.value = false
    if (lyricCycleInterval) clearInterval(lyricCycleInterval)
    if (currentTrack.value.url === 'synth-live') {
      clearInterval(noteInterval)
      clearInterval(fakeProgressInterval)
    } else if (audioObj) {
      audioObj.pause()
    }
  }

  const togglePlay = () => {
    initAudio()
    if (isMusicPlaying.value) pauseMusic()
    else playMusic()
  }

  // ===== 切歌 =====
  const prevTrack = () => {
    pauseMusic()
    currentTime.value = 0
    currentTrackIdx.value =
      (currentTrackIdx.value - 1 + trackList.value.length) %
      trackList.value.length
    setTimeout(() => playMusic(), 100)
  }

  const nextTrack = () => {
    pauseMusic()
    currentTime.value = 0
    currentTrackIdx.value = (currentTrackIdx.value + 1) % trackList.value.length
    setTimeout(() => playMusic(), 100)
  }

  const playSelectedTrack = (idx) => {
    pauseMusic()
    currentTime.value = 0
    currentTrackIdx.value = idx
    setTimeout(() => playMusic(), 100)
  }

  // ===== 进度/音量 =====
  const seekAudio = (e) => {
    currentTime.value = parseFloat(e.target.value)
    if (currentTrack.value.url !== 'synth-live' && audioObj) {
      audioObj.currentTime = currentTime.value
    }
  }

  const changeVolume = (e) => {
    volume.value = parseFloat(e.target.value)
    isMuted.value = volume.value === 0
    if (audioObj) audioObj.volume = isMuted.value ? 0 : volume.value
  }

  const toggleMute = () => {
    isMuted.value = !isMuted.value
    if (audioObj) audioObj.volume = isMuted.value ? 0 : volume.value
  }

  // ===== 面板切换 =====
  const togglePlaylist = () => {
    showPlaylist.value = !showPlaylist.value
    showMusicSettings.value = false
  }

  const toggleMusicSettings = () => {
    showMusicSettings.value = !showMusicSettings.value
    showPlaylist.value = false
  }

  // ===== 网易云 =====
  const connectToNetease = async () => {
    let pid = neteasePlaylistId.value.trim()
    if (!pid) {
      connectionError.value = "请输入有效的歌单ID"
      return
    }
    if (pid.match(/id=(\d+)/)) pid = pid.match(/id=(\d+)/)[1]

    isLoading.value = true
    connectionError.value = ""
    playSynthNote(440, 0.2)
    try {
      const res = await fetch(
        `https://netease-cloud-music-api-demo.vercel.app/playlist/track/all?id=${pid}&limit=12`
      )
      const data = await res.json()
      if (!data.songs || !data.songs.length) throw new Error('Empty')

      trackList.value = data.songs.map((s, i) => ({
        title: s.name,
        artist: s.ar ? s.ar.map((a) => a.name).join(' / ') : '未知',
        cover:
          s.al && s.al.picUrl
            ? `${s.al.picUrl}?param=150y150`
            : 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=150&q=80',
        url: `https://music.163.com/song/media/outer/url?id=${s.id}.mp3`,
        lyrics: [
          `🎵 网易云同步: 《${s.name}》`,
          `💿 音轨 (${i + 1}/${data.songs.length})`,
          '✨ 云端信号握手中！'
        ]
      }))
      pauseMusic()
      currentTrackIdx.value = 0
      currentTime.value = 0
      isConnectedToCloud.value = true
      connectionError.value = ""
      showMusicSettings.value = false
      onToast?.(`🟢 连通成功！载入 [${trackList.value.length}] 首金曲！`)
      setTimeout(() => playMusic(), 300)
    } catch (err) {
      console.error("同步网易云歌单发生错误:", err)
      connectionError.value = "连接失败，请确认网络并重试"
      onToast?.('❌ 获取失败，请检查ID或该歌单是否设为公开！')
      playSynthNote(180, 0.4)
    } finally {
      isLoading.value = false
    }
  }

  const restoreDefaultTracks = () => {
    pauseMusic()
    trackList.value = [...DEFAULT_TRACK_LIST]
    currentTrackIdx.value = 0
    currentTime.value = 0
    isConnectedToCloud.value = false
    onToast?.('↩️ 退回默认本地曲库！')
    setTimeout(() => playMusic(), 100)
  }

  // ===== 生命周期 =====
  onMounted(() => {
    audioObj = new Audio()
    audioObj.volume = volume.value
    audioObj.addEventListener('timeupdate', () => {
      if (currentTrack.value.url !== 'synth-live') {
        currentTime.value = audioObj.currentTime
      }
    })
    audioObj.addEventListener('durationchange', () => {
      if (currentTrack.value.url !== 'synth-live') {
        duration.value = audioObj.duration
      }
    })
    audioObj.addEventListener('ended', () => nextTrack())
  })

  onBeforeUnmount(() => {
    if (audioObj) {
      audioObj.pause()
      audioObj.removeEventListener('timeupdate', () => {})
      audioObj.removeEventListener('durationchange', () => {})
      audioObj.removeEventListener('ended', () => {})
    }
    clearInterval(noteInterval)
    clearInterval(fakeProgressInterval)
    clearInterval(lyricCycleInterval)
  })

  return {
    // 状态
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
    isLoading,
    connectionError,
    // 方法
    formatTime,
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
  }
}
