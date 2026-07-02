// 数据存储工具类
const STORAGE_PREFIX = 'flyfish_'

/**
 * 保存数据到 localStorage
 * @param {string} key - 存储键名
 * @param {any} value - 要存储的值
 */
export function setStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(STORAGE_PREFIX + key, serializedValue)
    return true
  } catch (error) {
    console.error('保存到 localStorage 失败:', error)
    return false
  }
}

/**
 * 从 localStorage 获取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值（当没有找到时返回）
 */
export function getStorage(key, defaultValue = null) {
  try {
    const serializedValue = localStorage.getItem(STORAGE_PREFIX + key)
    if (serializedValue === null) {
      return defaultValue
    }
    return JSON.parse(serializedValue)
  } catch (error) {
    console.error('从 localStorage 获取数据失败:', error)
    return defaultValue
  }
}

/**
 * 从 localStorage 删除数据
 * @param {string} key - 存储键名
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
    return true
  } catch (error) {
    console.error('删除 localStorage 数据失败:', error)
    return false
  }
}

/**
 * 清除所有 flyfish 相关的存储数据
 */
export function clearAllStorage() {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
    return true
  } catch (error) {
    console.error('清除 localStorage 数据失败:', error)
    return false
  }
}
