// utils/date.js - 日期处理工具

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp, format = 'YYYY-MM-DD HH:mm') {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
}

/**
 * 格式化日期（仅日期部分）
 */
export function formatDate(timestamp) {
  return formatTimestamp(timestamp, 'YYYY-MM-DD')
}

/**
 * 格式化时间（仅时间部分）
 */
export function formatTime(timestamp) {
  return formatTimestamp(timestamp, 'HH:mm')
}

/**
 * 获取相对时间
 */
export function getRelativeTime(timestamp) {
  const now = Date.now()
  const diff = now - timestamp

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前'
  } else if (diff < week) {
    return Math.floor(diff / day) + '天前'
  } else if (diff < month) {
    return Math.floor(diff / week) + '周前'
  } else {
    return formatDate(timestamp)
  }
}

/**
 * 判断是否今天
 */
export function isToday(timestamp) {
  const today = new Date()
  const date = new Date(timestamp)
  return today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
}

/**
 * 判断是否明天
 */
export function isTomorrow(timestamp) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const date = new Date(timestamp)
  return tomorrow.getFullYear() === date.getFullYear() &&
    tomorrow.getMonth() === date.getMonth() &&
    tomorrow.getDate() === date.getDate()
}

/**
 * 格式化截止时间显示
 */
export function formatDueDate(timestamp) {
  if (!timestamp) return ''
  
  if (isToday(timestamp)) {
    return '今天 ' + formatTime(timestamp)
  } else if (isTomorrow(timestamp)) {
    return '明天 ' + formatTime(timestamp)
  } else {
    return formatDate(timestamp)
  }
}

/**
 * 获取日期选择器值
 */
export function getDatePickerValue(timestamp = Date.now()) {
  return formatDate(timestamp)
}

/**
 * 获取时间选择器值
 */
export function getTimePickerValue(timestamp = Date.now()) {
  return formatTime(timestamp)
}
