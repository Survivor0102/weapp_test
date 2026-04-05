import api from './index'

/**
 * 记录番茄钟
 */
export function recordPomodoro(data) {
  return api.post('/pomodoro', data)
}

/**
 * 获取今日统计
 */
export function getTodayStats() {
  return api.get('/pomodoro/today')
}

/**
 * 获取历史统计
 */
export function getHistoryStats(params) {
  return api.get('/pomodoro/history', { params })
}
