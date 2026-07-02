# FlyFish 飞鱼日记

一个充满趣味和个性化的 Vue 3 旅行日记应用，具有任务管理、旅行日记、时光留言板等功能。

## 功能特点

### 📋 任务清单
- 添加和管理个人任务
- 标记任务完成状态
- 进度条显示任务完成情况

### ✈️ 旅行地图
- ECharts 交互式中国地图
- 添加新的旅行地点
- 拍立得相册 + 贴纸功能
- 纪念邮戳收集
- 登机牌样式设计

### 📖 日记记录
- 创建和删除个人日记
- 支持图片上传
- 日历视图按日期筛选
- 日记卡片网格展示
- 详情模态框

### 💌 时光留言板
- 发布和查看留言
- 表情符号和昵称
- 彩色卡片瀑布流

### 🎨 主题 & 氛围
- 拉线开关昼夜切换
- 五种天气特效（晴/多云/雨/雪/风）
- 黑胶唱片音乐播放器
- 网易云公开歌单同步
- SVG 头像眼动追踪

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 路由 | Vue Router 5 |
| 状态管理 | Pinia 3 |
| UI 组件库 | Element Plus |
| 图表 | ECharts 6 |
| Mock API | MSW (Mock Service Worker) |
| 构建 | Vite 8 |
| 样式 | SCSS |
| 代码规范 | ESLint + Prettier + Oxlint |

## 项目结构

```
FlyFish/
├── public/
│   └── mockServiceWorker.js     # MSW Service Worker
├── src/
│   ├── api/                     # API 层（通过 fetch 调用，MSW 拦截）
│   │   ├── request.js           # 基础请求封装
│   │   ├── quest.js             # 任务 API
│   │   ├── travel.js            # 旅行 API
│   │   ├── diary.js             # 日记 API
│   │   └── guestbook.js         # 留言 API
│   ├── assets/
│   │   └── main.scss            # 全局样式 + CSS 变量
│   ├── components/
│   │   ├── HomeHeader/          # 首页头部子组件
│   │   │   ├── WeatherOverlay.vue   # 全屏天气特效
│   │   │   ├── WizardAvatar.vue     # SVG 头像 + 眼动追踪
│   │   │   ├── WeatherPanel.vue     # 天气选择按钮
│   │   │   └── VinylPlayer.vue      # 黑胶唱片播放器
│   │   ├── NoteBook/            # 笔记本表单组件
│   │   ├── Travel/              # 旅行相关组件
│   │   ├── BaseCard.vue         # 基础卡片容器
│   │   ├── DiaryCard.vue        # 日记卡片
│   │   ├── DiaryCreator.vue     # 日记创建 + 列表
│   │   ├── Guestbook.vue        # 留言本卡片（首页）
│   │   ├── HomeHeader.vue       # 头部横幅（编排器）
│   │   ├── MiniCalendar.vue     # 迷你日历
│   │   ├── QuestList.vue        # 任务清单
│   │   ├── ToastBubble.vue      # 全局提示
│   │   └── TravelMap.vue        # 旅行地图卡片（首页）
│   ├── composables/             # 组合式函数
│   │   ├── useAudioPlayer.js    # 音乐播放引擎
│   │   ├── useDarkMode.js       # 昼夜主题切换
│   │   ├── useEyeTracking.js    # 鼠标跟随眼动
│   │   ├── useToast.js          # 全局 Toast 单例
│   │   └── useWeather.js        # 天气状态 + 粒子生成器
│   ├── mocks/                   # MSW Mock 配置
│   │   ├── browser.js           # Worker 启动
│   │   ├── seed.js              # 种子数据工具
│   │   └── handlers/            # 请求拦截器
│   │       ├── quest.js         # 任务 CRUD → localStorage
│   │       ├── travel.js        # 旅行 CRUD → localStorage
│   │       ├── diary.js         # 日记 CRUD → localStorage
│   │       └── guestbook.js     # 留言 CRUD → localStorage
│   ├── router/
│   │   └── index.js             # 路由配置
│   ├── stores/
│   │   └── quest.js             # 任务 Pinia Store
│   ├── utils/
│   │   ├── storage.js           # localStorage 工具（flyfish_ 前缀）
│   │   └── image.js             # 图片处理工具
│   ├── views/
│   │   ├── HomeView.vue         # 首页
│   │   ├── TravelJournal.vue    # 旅行地图页
│   │   └── GuestbookView.vue    # 留言板页
│   ├── App.vue                  # 根组件
│   └── main.js                  # 入口（含 MSW 初始化）
├── index.html
├── vite.config.js
└── package.json
```

## 数据架构

```
组件 → Pinia Store（可选）→ API 层（fetch）
                                ↓
                         MSW 拦截请求
                                ↓
                      handlers 读写 localStorage
                                ↓
                      返回 HttpResponse.json()
```

所有数据通过 RESTful API 访问，MSW 在浏览器 Network 层拦截 fetch 请求：

| 模块 | API 路径 | localStorage Key |
|------|----------|-----------------|
| 任务 | `/api/quests` | `flyfish_quests` |
| 旅行 | `/api/travel/locations` | `flyfish_travel_locations` |
| 日记 | `/api/diaries` | `flyfish_diaries` |
| 留言 | `/api/guestbook/messages` | `flyfish_guestbook_messages` |

首次访问时 MSW 自动写入种子数据，之后读写全部在 localStorage 上进行。切换到真实后端只需删除 `src/mocks/` 并修改 `request.js` 的 `BASE_URL`。

## 快速开始

```sh
# 安装依赖
pnpm install

# 开发模式（MSW 自动启动）
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

项目在 `http://localhost:5173` 启动。打开 Chrome DevTools → Network 标签，操作添加任务/日记/留言时可以看到 MSW 拦截的请求。

## 浏览器支持

最新版本的 Chrome、Firefox、Safari、Edge。

## 推荐 IDE

- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## License

MIT
