// 种子数据：首次访问时从 data/ 文件夹加载，写入 localStorage
import { getStorage, setStorage } from '@/utils/storage'

/**
 * 获取或初始化数据 — 优先从 localStorage 读取，首次访问时写入种子数据
 * @param {string} key - localStorage 键名
 * @param {Array|Object} seedData - 种子数据
 * @returns {Array|Object}
 */
export function getOrInitStorage(key, seedData) {
  let data = getStorage(key)
  if (!data || (Array.isArray(data) && data.length === 0)) {
    data = Array.isArray(seedData) ? [...seedData] : { ...seedData }
    setStorage(key, data)
  }
  return data
}
