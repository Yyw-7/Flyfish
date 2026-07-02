<!-- src/components/Travel/AddLocationModal.vue -->
<template>
  <div v-if="visible" class="modal-backdrop" @click.self="handleClose">
    <div class="modal-content">
      <!-- 头部 -->
      <div class="modal-header">
        <span>🧭 载入全新探险档案</span>
        <button class="modal-close-btn" @click="handleClose">✕</button>
      </div>

      <!-- 主体 -->
      <div class="modal-body">
        <!-- 地点信息 -->
        <div class="form-group">
          <label>地点名称 <span class="required">*</span></label>
          <div class="input-with-status">
            <input
              type="text"
              v-model="form.name"
              @input="handleAddressInput"
              placeholder="请输入具体地名（如：厦门鼓浪屿、常州）"
              :class="{ 'is-resolving': isResolving }"
            />
            <span v-if="isResolving" class="status-indicator resolving">🔍 检索中...</span>
            <span v-else-if="resolvedSuccess" class="status-indicator success">✅ 已定位</span>
          </div>
          <span class="hint">💡 输入地名后自动联网补全省份与经纬度</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>所属省份 <span class="required">*</span></label>
            <input type="text" v-model="form.province" placeholder="自动补全或手动输入" />
          </div>
          <div class="form-group">
            <label>机场三字码</label>
            <input type="text" v-model="form.airportCode" placeholder="例如：XMN" class="uppercase" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>经度 <span class="required">*</span></label>
            <input type="number" step="0.0001" v-model.number="form.lng" placeholder="例: 118.08" />
          </div>
          <div class="form-group">
            <label>纬度 <span class="required">*</span></label>
            <input type="number" step="0.0001" v-model.number="form.lat" placeholder="例: 24.47" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>航班代码</label>
            <input type="text" v-model="form.flightCode" placeholder="例如：CQ8050" class="uppercase" />
          </div>
          <div class="form-group">
            <label>签到章英文刻印</label>
            <input type="text" v-model="form.stampText" placeholder="例如：Xiamen" />
          </div>
        </div>

        <!-- 照片 -->
        <div class="form-section">
          <div class="section-header">
            <span>📸 3D拍立得相册与故事</span>
            <button class="add-btn" @click="addImageRow">➕ 增添一张照片</button>
          </div>

          <div v-for="(img, idx) in form.images" :key="idx" class="image-row">
            <div class="image-number">{{ idx + 1 }}</div>
            <button v-if="form.images.length > 1" class="remove-btn" @click="removeImageRow(idx)">🗑️</button>

            <div class="image-upload-row">
              <input
                type="text"
                v-model="img.url"
                placeholder="可粘贴URL，或点击右侧选择本电脑文件"
                class="image-url-input"
              />
              <button class="local-file-btn" @click="triggerLocalFileSelect(idx)">
                📁 选择本地图片
              </button>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                :id="'local-file-' + idx"
                @change="handleLocalFileChange($event, idx)"
              />
            </div>

            <div class="image-texts">
              <textarea v-model="img.caption" rows="2" placeholder="✨ 高光速记..."></textarea>
              <textarea v-model="img.varietyQuote" rows="2" placeholder="🎬 导演吐槽..."></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部 -->
      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="submit-btn" @click="handleSubmit">🛫 载入大地图</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['update:visible', 'submit', 'close'])

// ============ 状态 ============
const isResolving = ref(false)
const resolvedSuccess = ref(false)
let debounceTimer = null

// ============ 表单数据 ============
const form = reactive({
  name: '',
  province: '',
  airportCode: '',
  flightCode: '',
  stampText: '',
  lng: '',
  lat: '',
  images: [{ url: '', caption: '', varietyQuote: '' }]
})

// ============ 本地地理数据库 ============
const geoDb = {
  '北京': [116.40, 39.90], '上海': [121.47, 31.23], '广州': [113.26, 23.13],
  '深圳': [114.05, 22.54], '杭州': [120.15, 30.28], '成都': [104.06, 30.67],
  '西安': [108.94, 34.26], '拉萨': [91.11, 29.65], '喀纳斯': [87.01, 48.71],
  '桂林': [110.29, 25.27], '哈尔滨': [126.63, 45.75], '南京': [118.79, 32.06],
  '武汉': [114.30, 30.58], '重庆': [106.55, 29.56], '昆明': [102.71, 25.04],
  '大理': [100.22, 25.59], '丽江': [100.22, 26.85], '三亚': [109.51, 18.25],
  '厦门': [118.08, 24.47], '福州': [119.30, 26.08], '长沙': [112.93, 28.23],
  '贵阳': [106.71, 26.57], '黄山': [118.33, 29.71], '合肥': [117.27, 31.86],
  '敦煌': [94.66, 40.14], '香格里拉': [99.70, 27.82], '常州': [119.97, 31.81],
  '苏州': [120.61, 31.30], '无锡': [120.31, 31.57], '宁波': [121.56, 29.86],
  '温州': [120.69, 27.99], '九寨沟': [103.92, 33.26], '峨眉山': [103.48, 29.52],
  '乌鲁木齐': [87.61, 43.82], '青岛': [120.38, 36.06], '济南': [117.00, 36.65],
  '南昌': [115.89, 28.68], '太原': [112.54, 37.85], '沈阳': [123.42, 41.79],
  '长春': [125.34, 43.88], '兰州': [103.82, 36.05], '西宁': [101.77, 36.62],
  '银川': [106.27, 38.46], '呼和浩特': [111.67, 40.81], '石家庄': [114.48, 38.03],
  '郑州': [113.65, 34.76], '天津': [117.20, 39.13]
}

const cityToProvince = {
  '北京': '北京', '上海': '上海', '广州': '广东', '深圳': '广东',
  '杭州': '浙江', '成都': '四川', '西安': '陕西', '拉萨': '西藏',
  '喀纳斯': '新疆', '桂林': '广西', '哈尔滨': '黑龙江', '南京': '江苏',
  '武汉': '湖北', '重庆': '重庆', '昆明': '云南', '大理': '云南',
  '丽江': '云南', '三亚': '海南', '厦门': '福建', '福州': '福建',
  '长沙': '湖南', '贵阳': '贵州', '黄山': '安徽', '合肥': '安徽',
  '敦煌': '甘肃', '香格里拉': '云南', '常州': '江苏', '苏州': '江苏',
  '无锡': '江苏', '宁波': '浙江', '温州': '浙江', '九寨沟': '四川',
  '峨眉山': '四川', '乌鲁木齐': '新疆', '青岛': '山东', '济南': '山东',
  '南昌': '江西', '太原': '山西', '沈阳': '辽宁', '长春': '吉林',
  '兰州': '甘肃', '西宁': '青海', '银川': '宁夏', '呼和浩特': '内蒙古',
  '石家庄': '河北', '郑州': '河南', '天津': '天津'
}

// ============ 表单操作 ============
const resetForm = () => {
  form.name = ''
  form.province = ''
  form.airportCode = ''
  form.flightCode = ''
  form.stampText = ''
  form.lng = ''
  form.lat = ''
  form.images = [{ url: '', caption: '', varietyQuote: '' }]
  isResolving.value = false
  resolvedSuccess.value = false
  if (debounceTimer) clearTimeout(debounceTimer)
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
  resetForm()
}

const addImageRow = () => form.images.push({ url: '', caption: '', varietyQuote: '' })
const removeImageRow = (idx) => form.images.splice(idx, 1)

// ============ 本地图片上传 ============
const triggerLocalFileSelect = (idx) => {
  const el = document.getElementById('local-file-' + idx)
  if (el) el.click()
}

const handleLocalFileChange = (event, idx) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB，请压缩后再上传')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.images[idx].url = e.target.result
    alert(`📸 已加载本地图片：${file.name}`)
  }
  reader.onerror = () => {
    alert('图片读取失败，请重试')
  }
  reader.readAsDataURL(file)
}

// ============ 地址检索 ============
const extractCityName = (input) => {
  const suffixes = ['市', '县', '区', '自治州', '地区', '盟', '旗']
  let result = input.trim()
  suffixes.forEach(s => {
    if (result.endsWith(s)) {
      result = result.slice(0, -s.length)
    }
  })
  return result
}

const handleAddressInput = () => {
  const name = form.name.trim()
  if (!name) {
    isResolving.value = false
    resolvedSuccess.value = false
    return
  }

  if (debounceTimer) clearTimeout(debounceTimer)

  // 1️⃣ 先尝试本地匹配
  const cityKey = extractCityName(name)
  let matched = false

  for (const city in geoDb) {
    if (name.includes(city) || city.includes(name) || city === cityKey) {
      form.lng = geoDb[city][0]
      form.lat = geoDb[city][1]
      if (cityToProvince[city]) {
        form.province = cityToProvince[city]
      }
      matched = true
      resolvedSuccess.value = true
      break
    }
  }

  if (matched) {
    isResolving.value = false
    return
  }

  // 2️⃣ 本地匹配失败 → 联网检索
  isResolving.value = true
  resolvedSuccess.value = false

  debounceTimer = setTimeout(async () => {
    try {
      const query = name.includes('中国') ? name : name + ' 中国'
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`

      const response = await fetch(url, {
        headers: { 'Accept-Language': 'zh-CN,zh;q=0.9' }
      })

      if (!response.ok) throw new Error('Network response was not ok')

      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]

        if (result.lon && result.lat) {
          form.lng = parseFloat(result.lon).toFixed(4)
          form.lat = parseFloat(result.lat).toFixed(4)
        }

        const address = result.address || {}
        let province = address.state || address.province || address.region || ''

        if (!province && result.display_name) {
          const parts = result.display_name.split(',')
          for (let i = parts.length - 1; i >= 0; i--) {
            const part = parts[i].trim()
            for (const p in cityToProvince) {
              if (part.includes(p) || p.includes(part)) {
                province = cityToProvince[p]
                break
              }
            }
            if (province) break
          }
        }

        if (province) {
          for (const [key, val] of Object.entries(cityToProvince)) {
            if (province.includes(key) || key.includes(province)) {
              form.province = val
              break
            }
          }
          if (!form.province) {
            form.province = province
          }
        }

        resolvedSuccess.value = true
      } else {
        // 重试：不带 "中国" 后缀
        const retryUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1&addressdetails=1`
        const retryResponse = await fetch(retryUrl, {
          headers: { 'Accept-Language': 'zh-CN,zh;q=0.9' }
        })
        const retryData = await retryResponse.json()
        if (retryData && retryData.length > 0) {
          const r = retryData[0]
          if (r.lon && r.lat) {
            form.lng = parseFloat(r.lon).toFixed(4)
            form.lat = parseFloat(r.lat).toFixed(4)
          }
          const addr = r.address || {}
          if (addr.state || addr.province) {
            form.province = addr.state || addr.province
          }
          resolvedSuccess.value = true
        }
      }
    } catch (error) {
      console.warn('联网地理编码失败:', error)
      // 联网失败，用本地数据库模糊匹配
      for (const city in geoDb) {
        if (name.includes(city) || city.includes(name)) {
          form.lng = geoDb[city][0]
          form.lat = geoDb[city][1]
          if (cityToProvince[city]) {
            form.province = cityToProvince[city]
          }
          resolvedSuccess.value = true
          break
        }
      }
    } finally {
      isResolving.value = false
    }
  }, 600)
}

// ============ 提交 ============
const handleSubmit = () => {
  if (!form.name.trim()) {
    alert('请输入目的地地名！')
    return
  }
  if (!form.province.trim()) {
    alert('请输入或选择所属省份！')
    return
  }
  if (form.lng === '' || form.lat === '' || isNaN(parseFloat(form.lng)) || isNaN(parseFloat(form.lat))) {
    alert('请输入有效的经纬度数值！')
    return
  }

  const defaultImages = [
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
  ]

  const defaultCaptions = ['神秘精彩的探险旅途日常！', '沿途的风景永远超出期待！', '每一次出发都是治愈的开始！']
  const defaultQuotes = ['导演现场记录：玩得很开心！', '节目组全体惊叹！', '现场一度笑到失控！']

  const processedImages = form.images.map((img, i) => ({
    url: img.url.trim() || defaultImages[i % defaultImages.length],
    caption: img.caption.trim() || defaultCaptions[i % defaultCaptions.length],
    varietyQuote: img.varietyQuote.trim() || defaultQuotes[i % defaultQuotes.length],
    hp: Math.floor(Math.random() * 600) + 900,
    stickers: []
  }))

  emit('submit', {
    name: form.name.trim(),
    province: form.province.trim(),
    airportCode: (form.airportCode || 'PEK').toUpperCase(),
    flightCode: (form.flightCode || 'CQ' + Math.floor(1000 + Math.random() * 9000)).toUpperCase(),
    emoji: '📍',
    stampText: form.stampText || 'ADVENTURE',
    lng: parseFloat(form.lng),
    lat: parseFloat(form.lat),
    images: processedImages
  })
  handleClose()
}

watch(() => props.visible, (val) => { if (!val) resetForm() })
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(4px);
  z-index: 200000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border: 4px solid #1e293b;
  border-radius: 24px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 8px 8px 0px #1e293b;
}

.modal-header {
  background: #ff7096;
  color: white;
  padding: 1.25rem;
  border-bottom: 4px solid #1e293b;
  font-weight: 900;
  font-size: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.modal-close-btn {
  background: white;
  color: #1e293b;
  border: 2px solid #1e293b;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
}

.modal-close-btn:hover {
  background: #f1f5f9;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-weight: 700;
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 0.25rem;
}
.form-group input,
.form-group textarea {
  width: 100%;
  border: 3px solid #1e293b;
  border-radius: 12px;
  padding: 0.625rem;
  font-weight: 700;
  font-size: 0.875rem;
  outline: none;
  background: white;
  font-family: inherit;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group textarea:focus {
  background: #fffbeb;
}

.required {
  color: #ef4444;
}
.uppercase {
  text-transform: uppercase;
}

.input-with-status {
  position: relative;
}
.input-with-status input {
  padding-right: 6rem;
}
.input-with-status input.is-resolving {
  border-color: #3b82f6;
  background: #eff6ff;
}
.status-indicator {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  pointer-events: none;
}
.status-indicator.resolving {
  color: #2563eb;
  animation: pulse 1s infinite;
}
.status-indicator.success {
  color: #16a34a;
  background: #dcfce7;
}

.hint {
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  display: block;
  margin-top: 0.25rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-section {
  margin-top: 1rem;
  border-top: 2px dashed #e5e7eb;
  padding-top: 1rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 0.75rem;
}
.add-btn {
  background: #facc15;
  border: 2px solid #1e293b;
  border-radius: 12px;
  padding: 0.25rem 0.75rem;
  font-weight: 900;
  font-size: 0.75rem;
  cursor: pointer;
}
.add-btn:active {
  transform: translateY(2px);
}

.image-row {
  border: 3px solid #1e293b;
  border-radius: 16px;
  padding: 1rem;
  background: #f8fafc;
  margin-bottom: 0.75rem;
  position: relative;
}
.image-number {
  position: absolute;
  top: -0.75rem;
  left: -0.75rem;
  background: #1e293b;
  color: white;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.75rem;
}
.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 900;
  cursor: pointer;
  font-size: 0.85rem;
}

.image-upload-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.image-url-input {
  flex: 1;
  min-width: 0;
  border: 2px solid #1e293b;
  border-radius: 8px;
  padding: 0.5rem;
  font-weight: 700;
  font-size: 0.75rem;
  outline: none;
  background: white;
}

.local-file-btn {
  background: #cbf3f0;
  border: 2px solid #1e293b;
  border-radius: 8px;
  padding: 0.375rem 0.75rem;
  font-weight: 900;
  font-size: 0.7rem;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 2px 2px 0px #1e293b;
  transition: all 0.15s;
  flex-shrink: 0;
}
.local-file-btn:hover {
  background: #a3ebd5;
}
.local-file-btn:active {
  transform: translateY(2px);
  box-shadow: 1px 1px 0px #1e293b;
}

.hidden {
  display: none;
}

.image-texts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.image-texts textarea {
  border: 2px solid #1e293b;
  border-radius: 8px;
  padding: 0.5rem;
  font-weight: 700;
  font-size: 0.75rem;
  outline: none;
  resize: vertical;
  background: white;
  min-height: 3rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 4px solid #1e293b;
  background: #f1f5f9;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-shrink: 0;
}
.modal-footer button {
  padding: 0.625rem 1.25rem;
  border: 3px solid #1e293b;
  border-radius: 16px;
  font-weight: 900;
  cursor: pointer;
}
.cancel-btn {
  background: white;
  color: #1e293b;
}
.cancel-btn:hover {
  background: #f1f5f9;
}
.submit-btn {
  background: #34d399;
  color: #1e293b;
}
.submit-btn:hover {
  background: #10b981;
}

@media (max-width: 640px) {
  .form-row,
  .image-texts {
    grid-template-columns: 1fr;
  }
  .modal-content {
    max-width: 100%;
    margin: 0.5rem;
  }
}
</style>