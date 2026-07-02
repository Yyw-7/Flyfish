import { http, HttpResponse } from 'msw'
import { getStorage, setStorage } from '@/utils/storage'

const KEY = 'quests'

// 种子数据
const SEED = [
  { id: 1, text: '学习 Vue3 基础语法', isDone: false },
  { id: 2, text: '理解 defineProps 用法', isDone: false },
  { id: 3, text: '完成项目首页布局', isDone: false },
  { id: 4, text: '逗猫', isDone: true }
]

function ensureInit() {
  let data = getStorage(KEY)
  if (!data || data.length === 0) {
    data = [...SEED]
    setStorage(KEY, data)
  }
  return data
}

export const questHandlers = [
  // GET /api/quests
  http.get('/api/quests', async () => {
    await delay(200)
    const data = ensureInit()
    return HttpResponse.json({ success: true, data })
  }),

  // POST /api/quests
  http.post('/api/quests', async ({ request }) => {
    await delay(200)
    const body = await request.json()
    const quests = getStorage(KEY, [])
    const newQuest = { id: Date.now(), text: body.text, isDone: false }
    quests.unshift(newQuest)
    setStorage(KEY, quests)
    return HttpResponse.json({ success: true, data: newQuest })
  }),

  // PUT /api/quests/:id
  http.put('/api/quests/:id', async ({ params, request }) => {
    await delay(150)
    const { id } = params
    const body = await request.json()
    const quests = getStorage(KEY, [])
    const idx = quests.findIndex(q => q.id === Number(id))
    if (idx !== -1) {
      quests[idx] = { ...quests[idx], ...body }
      setStorage(KEY, quests)
      return HttpResponse.json({ success: true })
    }
    return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }),

  // DELETE /api/quests/:id
  http.delete('/api/quests/:id', async ({ params }) => {
    await delay(150)
    const { id } = params
    const quests = getStorage(KEY, [])
    const filtered = quests.filter(q => q.id !== Number(id))
    setStorage(KEY, filtered)
    return HttpResponse.json({ success: true })
  })
]

function delay(ms) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 200))
}
