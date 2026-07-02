import { http, HttpResponse } from 'msw'
import { getStorage, setStorage } from '@/utils/storage'

const KEY = 'guestbook_messages'

const SEED = [
  { id: 1, author: '流浪的猫', emoji: '🐈', content: '好喜欢这种手账风格的页面，感觉整个心都安静下来了。博主加油呀！', time: '2026-06-25 14:30', colorClass: 'bg-pink', rotate: -2 },
  { id: 2, author: 'CyberPunk_99', emoji: '🤖', content: '代码很优雅，音乐很好听。希望能多更新点技术日志！', time: '2026-06-26 09:15', colorClass: 'bg-mint', rotate: 3 },
  { id: 3, author: '星野', emoji: '🌟', content: '今天也是努力打怪升级的一天！(๑•̀ㅂ•́)و✧', time: '2026-06-28 11:20', colorClass: 'bg-yellow', rotate: -1 }
]
const COLORS = ['bg-pink', 'bg-mint', 'bg-yellow', 'bg-lavender', 'bg-peach']

function ensureInit() {
  let data = getStorage(KEY)
  if (!data || data.length === 0) {
    data = [...SEED]
    setStorage(KEY, data)
  }
  return data
}

export const guestbookHandlers = [
  // GET /api/guestbook/messages
  http.get('/api/guestbook/messages', async () => {
    await delay(200)
    const data = ensureInit()
    return HttpResponse.json({ success: true, data })
  }),

  // POST /api/guestbook/messages
  http.post('/api/guestbook/messages', async ({ request }) => {
    await delay(200)
    const body = await request.json()
    const messages = getStorage(KEY, [])
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const newMsg = {
      id: Date.now(),
      author: body.author || '匿名旅人',
      emoji: body.emoji || '👻',
      content: body.content,
      time: timeStr,
      colorClass: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotate: (Math.random() - 0.5) * 6
    }
    messages.unshift(newMsg)
    setStorage(KEY, messages)
    return HttpResponse.json({ success: true, data: newMsg })
  }),

  // DELETE /api/guestbook/messages/:id
  http.delete('/api/guestbook/messages/:id', async ({ params }) => {
    await delay(150)
    const { id } = params
    const messages = getStorage(KEY, [])
    const filtered = messages.filter(m => m.id !== Number(id))
    setStorage(KEY, filtered)
    return HttpResponse.json({ success: true })
  })
]

function delay(ms) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 200))
}
