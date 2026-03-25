// utils/util.js - 通用工具函数

/**
 * 防抖函数
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 */
export function throttle(fn, interval = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 深拷贝
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 显示 Toast
 */
export function showToast(title, icon = 'none', duration = 1500) {
  wx.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示 Modal
 */
export function showModal(content, confirmText = '确定') {
  return new Promise((resolve) => {
    wx.showModal({
      title: '提示',
      content,
      confirmText,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 页面跳转
 */
export function navigateTo(url) {
  wx.navigateTo({ url })
}

/**
 * 返回上一页
 */
export function navigateBack() {
  wx.navigateBack()
}

/**
 * 切换到 tabBar 页面
 */
export function switchTab(url) {
  wx.switchTab({ url })
}

/**
 * 重定向页面
 */
export function redirectTo(url) {
  wx.redirectTo({ url })
}
