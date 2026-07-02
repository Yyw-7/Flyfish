# FlyFish 项目数据管理架构

## 概述

本项目实现了完整的数据管理方案，包括：
- API 服务层（用于接口调用）
- Pinia Store（状态管理）
- LocalStorage（数据持久化）

## 目录结构

```
src/
├── api/              # API 服务层
│   ├── request.js    # 基础请求封装
│   ├── quest.js      # 任务相关 API
│   └── diary.js      # 日记相关 API
├── stores/           # Pinia Store
│   ├── quest.js      # 任务状态管理
│   └── diary.js      # 日记状态管理
└── utils/
    └── storage.js    # LocalStorage 工具函数
```

## 如何使用

### 1. 在组件中使用 Quest Store

```vue
<script setup>
import { useQuestStore } from '@/stores/quest'
import { onMounted } from 'vue'

const questStore = useQuestStore()

// 加载任务列表
onMounted(() => {
  questStore.fetchQuests()
})

// 添加任务
const addNewQuest = async (data) => {
  await questStore.addNewQuest(data)
}

// 切换任务完成状态
const toggleTask = async (task) => {
  await questStore.toggleTaskDone(task)
}
</script>
```

### 2. 在组件中使用 Diary Store

```vue
<script setup>
import { useDiaryStore } from '@/stores/diary'
import { onMounted } from 'vue'

const diaryStore = useDiaryStore()

// 加载日记列表
onMounted(() => {
  diaryStore.fetchDiaries()
})

// 添加日记
const addNewDiary = async (data) => {
  await diaryStore.addNewDiary(data)
}

// 按日期筛选
const filterByDate = (dateStr) => {
  diaryStore.setFilterDate(dateStr)
}

// 清除筛选
const clearFilter = () => {
  diaryStore.clearFilter()
}
</script>
```

### 3. 直接使用 LocalStorage 工具

```javascript
import { setStorage, getStorage, removeStorage, clearAllStorage } from '@/utils/storage'

// 保存数据
setStorage('myKey', { name: 'test', value: 123 })

// 获取数据
const data = getStorage('myKey', defaultValue)

// 删除数据
removeStorage('myKey')

// 清除所有项目相关数据
clearAllStorage()
```

## 如何接入真实 API

在 `src/api/request.js` 中，当前使用的是模拟接口。要接入真实 API：

1. 创建 `.env` 文件，配置 API 地址
2. 修改 `request.js` 中的请求逻辑

### 环境变量配置

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://your-api-domain.com/api
```

### 修改 request.js

```javascript
async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
  return response.json()
}
```

### 修改各模块的 API 文件

例如在 `quest.js` 中：

```javascript
export async function getQuests() {
  const response = await request('/quests')
  if (response.success) {
    setStorage(STORAGE_KEY, response.data) // 同时保存到本地
  }
  return response
}
```

## 数据持久化

所有数据会自动保存到 LocalStorage 中，key 格式为 `flyfish_` + 模块名。

- 任务数据: `flyfish_quests`
- 日记数据: `flyfish_diaries`

## Store 中的状态

### Quest Store
- `tasks`: 任务列表
- `loading`: 加载状态
- `error`: 错误信息
- `completedCount`: 已完成任务数（计算属性）
- `progress`: 完成进度百分比（计算属性）

### Diary Store
- `diaryEntries`: 日记列表
- `loading`: 加载状态
- `error`: 错误信息
- `filterDate`: 当前筛选的日期
