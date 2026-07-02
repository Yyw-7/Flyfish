// API 请求基础封装
const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * 通用请求函数 — 开发环境由 MSW 拦截，生产环境请求真实 API
 */
async function request(url, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  }

  const response = await fetch(`${BASE_URL}${url}`, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.error || error.message || `Request failed: ${response.status}`)
  }

  return response.json()
}

export default request
