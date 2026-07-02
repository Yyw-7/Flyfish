import { http, HttpResponse } from 'msw'
import { getStorage, setStorage } from '@/utils/storage'

const KEY = 'diaries'

// 首次访问时的种子数据
const SEED = [
  { id: 1, title: '搞定 Web Audio 八音盒！', emoji: '🎼', content: '今天手写了一个 Web Audio API 的振荡器合成器，不需要引入任何 mp3 外部文件就能用纯数学波形演奏好听的旋律，这种完全掌控声音底层的感觉太美妙了！', tag: '技术沉淀', time: '2026-06-28 18:12', date: '2026-06-28', coverImg: 'https://placehold.co/400x300/cbf3f0/1e293b?text=Web+Audio', imageUrl: 'https://placehold.co/400x300/cbf3f0/1e293b?text=Web+Audio', createdAt: '2026-06-28 18:12' },
  { id: 2, title: '周五傍晚的落日熔金', emoji: '🌇', content: '上海的黄昏，晚霞是橘红配上淡淡的紫灰，就像一杯放了过多糖浆的黑加仑气泡水。站在天桥上吹风，听着喜欢的歌，觉得所有的 Debug 疲惫都释怀了。', tag: '生活碎片', time: '2026-06-27 19:40', date: '2026-06-27', coverImg: 'https://placehold.co/400x300/ffd8be/1e293b?text=Shanghai+Sunset', imageUrl: 'https://placehold.co/400x300/ffd8be/1e293b?text=Shanghai+Sunset', createdAt: '2026-06-27 19:40' },
  { id: 3, title: '周末的咖啡时光', emoji: '☕', content: '周末午后，找了一家安静的咖啡馆，点了一杯手冲耶加雪菲，坐在窗边看着行人来来往往，享受这难得的慢时光。咖啡的香气和午后的阳光，治愈了一周的疲惫。', tag: '生活碎片', time: '2026-06-21 15:30', date: '2026-06-21', coverImg: 'https://placehold.co/400x300/fef08a/1e293b?text=Coffee+Time', imageUrl: 'https://placehold.co/400x300/fef08a/1e293b?text=Coffee+Time', createdAt: '2026-06-21 15:30' },
  { id: 4, title: '冰岛极光之旅', emoji: '🌌', content: '极光大爆发的那一夜。冰川碎裂的微声，漫天舞动的莹绿色光带，仿佛是宇宙写给地球的秘密电报。在零下十几度的荒野里，被极客与星空的宏大深邃所震撼。', tag: '旅行', time: '2025-01-20 22:30', date: '2025-01-20', coverImg: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80', imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80', createdAt: '2025-01-20 22:30' },
  { id: 5, title: '涩谷十字路口', emoji: '🗼', content: '黄昏时分的涩谷十字路口，人潮涌动。去秋叶原买了一整套中古手办，在新宿窄巷里吃了热气腾腾的豚骨拉面。霓虹闪烁的街头，充满了千禧年复古蒸汽波的气息。', tag: '旅行', time: '2024-11-05 17:45', date: '2024-11-05', coverImg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', createdAt: '2024-11-05 17:45' },
  { id: 6, title: '杭州西湖漫步', emoji: '🌸', content: '断桥残雪与法喜寺的晚钟，微风拂过湖面的温柔，手里还捧着一杯温热的龙井茶。坐在长椅上，看着日落熔金，觉得生活的节奏慢下来也很美妙。', tag: '旅行', time: '2024-04-12 15:20', date: '2024-04-12', coverImg: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=600&q=80', imageUrl: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=600&q=80', createdAt: '2024-04-12 15:20' },
  { id: 7, title: '深夜写代码', emoji: '💻', content: '凌晨两点，窗外只有路灯和偶尔经过的车。终于把那个困扰了三天的 bug 解决了，那种豁然开朗的感觉，大概是程序员最幸福的时刻之一吧。', tag: '技术沉淀', time: '2026-06-15 02:00', date: '2026-06-15', coverImg: 'https://placehold.co/400x300/ffccd5/1e293b?text=Late+Night+Coding', imageUrl: 'https://placehold.co/400x300/ffccd5/1e293b?text=Late+Night+Coding', createdAt: '2026-06-15 02:00' },
  { id: 8, title: '下雨天的书店', emoji: '📚', content: '下了一整天的雨，躲进街角的独立书店。翻到一本旧版的《挪威的森林》，纸张已经泛黄，带着淡淡的霉味。点了一杯热茶，就这样消磨了整个下午。', tag: '生活碎片', time: '2026-06-10 16:20', date: '2026-06-10', coverImg: 'https://placehold.co/400x300/e8dbfc/1e293b?text=Rainy+Bookstore', imageUrl: 'https://placehold.co/400x300/e8dbfc/1e293b?text=Rainy+Bookstore', createdAt: '2026-06-10 16:20' }
]

function ensureInit() {
  let data = getStorage(KEY)
  if (!data || data.length === 0) {
    data = [...SEED]
    setStorage(KEY, data)
  }
  return data
}

export const diaryHandlers = [
  // GET /api/diaries
  http.get('/api/diaries', async () => {
    await delay(200)
    const data = ensureInit()
    return HttpResponse.json({ success: true, data })
  }),

  // POST /api/diaries
  http.post('/api/diaries', async ({ request }) => {
    await delay(200)
    const body = await request.json()
    const diaries = getStorage(KEY, [])
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    const newDiary = {
      id: Date.now(),
      title: body.title,
      content: body.content,
      tag: body.tag || '随笔',
      emoji: '📝',
      imageUrl: body.imageUrl || '',
      date: dateStr,
      time: `${month}-${day} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      createdAt: now.toLocaleString()
    }
    diaries.unshift(newDiary)
    setStorage(KEY, diaries)
    return HttpResponse.json({ success: true, data: newDiary })
  }),

  // PUT /api/diaries/:id
  http.put('/api/diaries/:id', async ({ params, request }) => {
    await delay(150)
    const { id } = params
    const body = await request.json()
    const diaries = getStorage(KEY, [])
    const idx = diaries.findIndex(d => d.id === Number(id))
    if (idx !== -1) {
      diaries[idx] = { ...diaries[idx], ...body }
      setStorage(KEY, diaries)
      return HttpResponse.json({ success: true })
    }
    return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }),

  // DELETE /api/diaries/:id
  http.delete('/api/diaries/:id', async ({ params }) => {
    await delay(150)
    const { id } = params
    const diaries = getStorage(KEY, [])
    const filtered = diaries.filter(d => d.id !== Number(id))
    setStorage(KEY, filtered)
    return HttpResponse.json({ success: true })
  })
]

function delay(ms) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 200))
}
