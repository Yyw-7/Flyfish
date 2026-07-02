<!-- src/components/Travel/EChartsMap.vue -->
<template>
  <section class="brital-card p-4">
    <span class="card-tag" style="background: #ff7096">INTERACTIVE ECHARTS MAP</span>
    <div class="map-header">
      <h2 class="map-title">
        🗺️ 中国大冒险足迹图
        <span class="map-badge">鼠标悬浮可查看注释</span>
      </h2>
      <div class="map-actions">
        <button @click="$emit('openAddModal')" class="neobrutal-btn bg-emerald-400">
          ➕ 添加我的冒险地
        </button>
        <div class="map-status">
          📍 打卡锁定：<span class="highlight">{{ currentStation?.name || '未选择' }}</span>
        </div>
      </div>
    </div>

    <!-- ECharts 挂载点 -->
    <div class="flight-map-container">
      <div class="flight-map-bg"></div>
      <div id="echarts-map" class="echarts-container"></div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  cities: { type: Array, required: true },
  activeCityIdx: { type: Number, required: true },
  currentStation: { type: Object, required: true }
})

const emit = defineEmits(['cityClick', 'openAddModal'])

let mapInstance = null

// 省份简称 → GeoJSON 全称映射
const provinceFullNameMap = {
  '新疆': '新疆维吾尔自治区',
  '西藏': '西藏自治区',
  '内蒙古': '内蒙古自治区',
  '青海': '青海省',
  '宁夏': '宁夏回族自治区',
  '四川': '四川省',
  '黑龙江': '黑龙江省',
  '甘肃': '甘肃省',
  '云南': '云南省',
  '广西': '广西壮族自治区',
  '湖南': '湖南省',
  '陕西': '陕西省',
  '广东': '广东省',
  '吉林': '吉林省',
  '河北': '河北省',
  '湖北': '湖北省',
  '贵州': '贵州省',
  '山东': '山东省',
  '江西': '江西省',
  '河南': '河南省',
  '辽宁': '辽宁省',
  '山西': '山西省',
  '安徽': '安徽省',
  '福建': '福建省',
  '浙江': '浙江省',
  '江苏': '江苏省',
  '海南': '海南省',
  '台湾': '台湾省'
}

// 加载中国地图 GeoJSON
const loadChinaMap = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}china.json`
    )
    const geoJson = await response.json()
    echarts.registerMap('china', geoJson)
    return true
  } catch (error) {
    console.error('加载中国地图失败:', error)
    return false
  }
}

// 渲染地图
const renderMap = async () => {
  const dom = document.getElementById('echarts-map')
  if (!dom) return

  const loaded = await loadChinaMap()
  if (!loaded) return

  if (!mapInstance) {
    mapInstance = echarts.init(dom)
  }

  const scatterData = props.cities.map((c, idx) => {
    const isActive = idx === props.activeCityIdx
    return {
      name: c.name,
      value: [c.lng, c.lat, idx],
      flightCode: c.flightCode,
      airportCode: c.airportCode,
      emoji: c.emoji || '📍',
      itemStyle: {
        color: isActive ? '#ff7096' : '#facc15',
        borderColor: '#1e293b',
        borderWidth: 2,
        shadowBlur: isActive ? 12 : 0,
        shadowColor: 'rgba(255, 112, 150, 0.5)'
      }
    }
  })

  // 动态高亮包含探险地的省份（使用全称匹配）
  const activeProvinces = Array.from(
    new Set(props.cities.map((c) => c.province))
  )
  const baseColors = [
    '#fed7aa',
    '#bbf7d0',
    '#fef08a',
    '#bfdbfe',
    '#ffccd5',
    '#cbf3f0',
    '#fbcfe8',
    '#e8dbfc'
  ]
  const regionsData = activeProvinces.map((prov, i) => ({
    name: provinceFullNameMap[prov] || prov,
    itemStyle: { areaColor: baseColors[i % baseColors.length] }
  }))





  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#1e293b',
      borderWidth: 3,
      borderRadius: 12,
      padding: [10, 14],
      textStyle: { color: '#1e293b', fontFamily: 'Noto Sans SC', fontWeight: 900 },
      extraCssText: 'box-shadow: 6px 6px 0px #1e293b;',
      formatter: function (params) {
        if (params.componentType === 'series') {
          const data = params.data
          return `
            <div style="font-size:16px; margin-bottom: 4px;">${data.emoji} ${data.name}</div>
            <div style="font-size:11px; color:#666; font-weight:700;">航班代码: <span style="color:#ff7096">${data.flightCode}</span></div>
            <div style="font-size:11px; color:#666; font-weight:700;">机场代码: ${data.airportCode}</div>
            <div style="font-size:10px; color:#999; margin-top:6px; border-top:1px dashed #ccc; padding-top:4px;">✨ 点击可换发当前登机牌</div>
          `
        }
        return null
      }
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.15,
      center: [105, 36],
      label: { show: false },
      itemStyle: {
        areaColor: 'rgba(255, 255, 255, 0.75)',
        borderColor: '#1e293b',
        borderWidth: 2,
        borderType: 'dashed'
      },
      emphasis: {
        label: {
          show: true,
          color: '#1e293b',
          fontWeight: '900',
          fontSize: 14,
          backgroundColor: '#ffffff',
          borderColor: '#1e293b',
          borderWidth: 2,
          borderRadius: 6,
          padding: [4, 8]
        },

          itemStyle: {
            areaColor: '#ffccd5',
            borderWidth: 3,
            borderType: 'solid'
          }
        },
        regions: regionsData
      },
      series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbol:
          'path://M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        symbolSize: [22, 28],
        symbolOffset: [0, '-50%'],
        zlevel: 2,
        emphasis: { scale: 1.35 }
      }
    ]
  }

  mapInstance.setOption(option, true)
  mapInstance.off('click')

  mapInstance.on('click', (params) => {
    if (params.componentType === 'series') {
      const targetIdx = params.data.value[2]
      emit('cityClick', targetIdx)
    }
  })

  const resizeHandler = () => mapInstance?.resize()
  window.addEventListener('resize', resizeHandler)
  mapInstance._resizeHandler = resizeHandler
}

// 监听数据变化
watch(
  () => [props.cities, props.activeCityIdx],
  () => {
    if (mapInstance) {
      renderMap()
    }
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    renderMap()
  })
})

onBeforeUnmount(() => {
  if (mapInstance) {
    if (mapInstance._resizeHandler) {
      window.removeEventListener('resize', mapInstance._resizeHandler)
    }
    mapInstance.dispose()
    mapInstance = null
  }
})

defineExpose({ renderMap })
</script>

<style scoped>
.brital-card {
  background: var(--color-pink, #ffd8be);
  border: 4px solid var(--border-dark, #1e293b);
  border-radius: 24px;
  padding: 1.8rem;
  box-shadow: 8px 8px 0px var(--border-dark, #1e293b);
  position: relative;
}

.card-tag {
  background: #ff9f1c;
  color: white;
  padding: 6px 16px;
  border: 3px solid var(--border-dark, #1e293b);
  border-radius: 12px;
  font-weight: 900;
  font-size: 0.8rem;
  position: absolute;
  top: -18px;
  left: 24px;
  box-shadow: 4px 4px 0px var(--border-dark, #1e293b);
  z-index: 10;
}

.map-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .map-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.map-title {
  font-size: 1.5rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.map-badge {
  font-size: 0.75rem;
  background: #1e293b;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.map-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.map-status {
  font-size: 0.875rem;
  font-weight: 700;
  color: #475569;
  background: #fef08a;
  border: 2px solid #1e293b;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  white-space: nowrap;
}

.highlight {
  color: #db2777;
}

.neobrutal-btn {
  background: #fff;
  border: 3px solid var(--border-dark, #1e293b);
  font-weight: 900;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 0px var(--border-dark, #1e293b);
  cursor: pointer;
  font-size: 0.875rem;
}

.neobrutal-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--border-dark, #1e293b);
}
.neobrutal-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--border-dark, #1e293b);
}

.bg-emerald-400 {
  background: #34d399;
}
.bg-emerald-400:hover {
  background: #10b981;
}

.flight-map-container {
  position: relative;



  background-color: var(--bg-canvas, #faf6f0);
  border: 4px solid var(--border-dark, #1e293b);
  border-radius: 24px;
  height: 500px;
  overflow: hidden;
  box-shadow: 8px 8px 0px var(--border-dark, #1e293b);
}

.flight-map-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(30, 41, 59, 0.1) 1.5px, transparent 1.5px);
  background-size: 20px 20px;
}

.echarts-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .flight-map-container {
    height: 350px;
    border-radius: 16px;
    box-shadow: 4px 4px 0px var(--border-dark, #1e293b);
  }
  .brital-card {
    padding: 1rem;
  }
  .map-title {
    font-size: 1.15rem;
  }
}

@media (max-width: 480px) {
  .flight-map-container {
    height: 280px;
  }
}
</style>
