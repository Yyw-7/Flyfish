import { http, HttpResponse } from 'msw'
import { getStorage, setStorage } from '@/utils/storage'

const KEY = 'travel_locations'

// 首次访问时的种子数据
const SEED = [
  { id: 1, name: '新疆 · 喀纳斯', province: '新疆', lng: 87.01, lat: 48.71, airportCode: 'URC', flightCode: 'CQ9921', emoji: '🏔️', stampText: 'Kanas', stamped: false, x: 160, y: 180, images: [{ url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=600&q=80', caption: '喀纳斯湖上弥漫起的晨雾，宛如披上一层神圣的轻纱。', varietyQuote: '大清早想拍个静谧大片，结果一脚踩在了湿漉漉的青草泥坑里！', hp: 990, stickers: [], aspect: 'portrait', location: '喀纳斯 · 月亮湾' }, { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80', caption: '骑着马儿攀登观鱼台，两旁草地上盛开着无数不知名的小野花。', varietyQuote: '马儿突然不听使唤开始狂啃路边的蒲公英！', hp: 820, stickers: [], aspect: 'landscape', location: '喀纳斯 · 观鱼台' }, { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', caption: '黄昏斜照下的月亮湾，如同一弯新月坠落在翡翠绿的大地上。', varietyQuote: '导演组为了找完美日落角度，一屁股坐上了野蜜蜂窝！', hp: 910, stickers: [], aspect: 'landscape', location: '喀纳斯 · 月亮湾' }] },
  { id: 2, name: '西安 · 大唐芙蓉园', province: '陕西', lng: 108.94, lat: 34.26, airportCode: 'XIY', flightCode: 'CQ8540', emoji: '🏮', stampText: "Chang'an", stamped: false, x: 440, y: 140, images: [{ url: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80', caption: '梦回盛世长安，大唐不夜城流光溢彩的灯笼群华丽风采。', varietyQuote: '头戴3斤重的贵妃金冠，我足足两个小时不敢低头！', hp: 850, stickers: [], aspect: 'portrait', location: '西安 · 大唐不夜城' }, { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80', caption: '古老的永宁门城墙，千年回眸一瞬间。', varietyQuote: '想抓拍飞鸽，结果一坨鸟屎精准空降在袖口上！', hp: 720, stickers: [], aspect: 'landscape', location: '西安 · 永宁门' }, { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', caption: '回民街的烟火气，油泼面辣子飘香。', varietyQuote: '为了抢最后一个肉夹馍，和胖大叔猜拳猜输了！', hp: 900, stickers: [], aspect: 'landscape', location: '西安 · 回民街' }] },
  { id: 3, name: '哈尔滨 · 冰雪大世界', province: '黑龙江', lng: 126.63, lat: 45.75, airportCode: 'HRB', flightCode: 'CQ7410', emoji: '❄️', stampText: 'Ice City', stamped: false, x: 750, y: 250, images: [{ url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80', caption: '零下二十五度的纯净冰宫殿，宛如科幻童话乐园。', varietyQuote: '零下三十度啃马迭尔冰棍，舌头刚贴上去就被粘住了！', hp: 1200, stickers: [], aspect: 'landscape', location: '哈尔滨 · 冰雪大世界' }, { url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80', caption: '圣索菲亚大教堂，漫天大雪中的古典浪漫。', varietyQuote: '泼水成冰结果狂风反向一刮，全泼在了自己帽子上！', hp: 1100, stickers: [], aspect: 'portrait', location: '哈尔滨 · 圣索菲亚教堂' }, { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80', caption: '五百米超级冰滑梯，肾上腺素飙升到极限！', varietyQuote: '下滑时速度太快被吹到表情完全失控！', hp: 1300, stickers: [], aspect: 'landscape', location: '哈尔滨 · 冰雪大世界' }] },
  { id: 4, name: '杭州 · 西湖断桥', province: '浙江', lng: 120.15, lat: 30.28, airportCode: 'HGH', flightCode: 'CQ1026', emoji: '🌸', stampText: 'WestLake', stamped: true, x: 820, y: 440, images: [{ url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=600&q=80', caption: '江南暮春，西湖堤畔温婉摇曳。', varietyQuote: '排队三小时买的拉花咖啡，刚拿到手就全洒了！', hp: 750, stickers: [], aspect: 'landscape', location: '杭州 · 西湖断桥' }, { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80', caption: '灵隐寺古刹钟声，求了一个\'代码无Bug\'的治愈御守。', varietyQuote: '刚求完无Bug，生产环境当场抛出OutOfMemoryError！', hp: 810, stickers: [], aspect: 'portrait', location: '杭州 · 灵隐寺' }, { url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80', caption: '九溪烟树的绿色秘境，空气中全是青草的香气。', varietyQuote: '脱鞋玩水，结果被冷得像触电，当场狂舞！', hp: 690, stickers: [], aspect: 'landscape', location: '杭州 · 九溪烟树' }] },
  { id: 5, name: '桂林 · 漓江竹筏', province: '广西', lng: 110.29, lat: 25.27, airportCode: 'KWL', flightCode: 'CQ3647', emoji: '⛰️', stampText: 'Li River', stamped: false, x: 550, y: 560, images: [{ url: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?auto=format&fit=crop&w=600&q=80', caption: '船行碧波上，两岸青山如巨幅水墨画。', varietyQuote: '拿20元人民币对口型合照，真钞票直接飘走了！', hp: 910, stickers: [], aspect: 'landscape', location: '桂林 · 漓江' }, { url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80', caption: '冠岩溶洞腹地，地下小火车穿越五彩石幔。', varietyQuote: '在溶洞高喊回音，结果震落了树上的小蝙蝠！', hp: 880, stickers: [], aspect: 'portrait', location: '桂林 · 冠岩溶洞' }, { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', caption: '阳朔西街的欢歌笑语，桂林啤酒鱼外焦里嫩。', varietyQuote: '和外国友人斗舞，结果把鞋底跳脱落了！', hp: 940, stickers: [], aspect: 'landscape', location: '桂林 · 阳朔西街' }] },
  { id: 6, name: '拉萨 · 布达拉宫', province: '西藏', lng: 91.11, lat: 29.65, airportCode: 'LXA', flightCode: 'CQ5200', emoji: '🕌', stampText: 'Lhasa', stamped: false, x: 260, y: 520, images: [{ url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80', caption: '日光倾城照耀着布达拉宫，八廓街上转经声阵阵。', varietyQuote: '一边用氧气袋猛吸，一边对镜头微笑招手！', hp: 1500, stickers: [], aspect: 'landscape', location: '拉萨 · 布达拉宫' }, { url: 'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&w=600&q=80', caption: '纳木错湖畔，蔚蓝的湖面如同宇宙的蓝色眼泪。', varietyQuote: '白牦牛对着我的裤子打了个巨响的喷嚏！', hp: 1400, stickers: [], aspect: 'landscape', location: '拉萨 · 纳木错' }, { url: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=600&q=80', caption: '藏区小酒馆里围着篝火唱歌跳锅庄。', varietyQuote: '喝青稞酒以为是奶茶，结果当场抱着摄像机大腿哭了一整夜！', hp: 1600, stickers: [], aspect: 'portrait', location: '拉萨 · 藏区小酒馆' }] }
]

function ensureInit() {
  let data = getStorage(KEY)
  if (!data || data.length === 0) {
    data = [...SEED]
    setStorage(KEY, data)
  }
  return data
}

export const travelHandlers = [
  // GET /api/travel/locations
  http.get('/api/travel/locations', async () => {
    await delay(200)
    const data = ensureInit()
    return HttpResponse.json({ success: true, data })
  }),

  // POST /api/travel/locations
  http.post('/api/travel/locations', async ({ request }) => {
    await delay(250)
    const body = await request.json()
    const locations = getStorage(KEY, SEED)
    const newLocation = {
      id: Date.now(),
      name: body.name,
      province: body.province,
      lng: body.lng,
      lat: body.lat,
      airportCode: body.airportCode,
      flightCode: body.flightCode,
      emoji: body.emoji || '📍',
      stampText: body.stampText || 'ADVENTURE',
      stamped: false,
      x: Math.floor(Math.random() * 600) + 100,
      y: Math.floor(Math.random() * 400) + 100,
      images: body.images || []
    }
    locations.push(newLocation)
    setStorage(KEY, locations)
    return HttpResponse.json({ success: true, data: newLocation })
  }),

  // PUT /api/travel/locations/:id
  http.put('/api/travel/locations/:id', async ({ params, request }) => {
    await delay(150)
    const { id } = params
    const body = await request.json()
    const locations = getStorage(KEY, SEED)
    const idx = locations.findIndex(l => l.id === Number(id))
    if (idx !== -1) {
      locations[idx] = { ...locations[idx], ...body }
      setStorage(KEY, locations)
      return HttpResponse.json({ success: true, data: locations[idx] })
    }
    return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }),

  // DELETE /api/travel/locations/:id
  http.delete('/api/travel/locations/:id', async ({ params }) => {
    await delay(150)
    const { id } = params
    const locations = getStorage(KEY, SEED)
    const filtered = locations.filter(l => l.id !== Number(id))
    setStorage(KEY, filtered)
    return HttpResponse.json({ success: true })
  })
]

function delay(ms) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 300))
}
