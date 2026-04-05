import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as pomodoroApi from '../api/pomodoro'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const todayStats = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // 计时器状态
  const isRunning = ref(false)
  const currentTime = ref(25 * 60) // 秒
  const mode = ref('work') // work, shortBreak, longBreak
  const currentTodoId = ref(null)

  // 模式配置（分钟）
  const modeConfig = {
    work: 25,
    shortBreak: 5,
    longBreak: 15
  }

  // 获取今日统计
  async function fetchTodayStats() {
    loading.value = true
    error.value = null
    try {
      const res = await pomodoroApi.getTodayStats()
      if (res.success) {
        todayStats.value = res.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 记录番茄钟
  async function recordPomodoro(data) {
    try {
      const res = await pomodoroApi.recordPomodoro(data)
      if (res.success) {
        // 刷新统计
        await fetchTodayStats()
        return res.data
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 设置模式
  function setMode(newMode) {
    mode.value = newMode
    currentTime.value = modeConfig[newMode] * 60
  }

  // 设置关联的待办
  function setCurrentTodo(todoId) {
    currentTodoId.value = todoId
  }

  // 开始计时
  function startTimer() {
    isRunning.value = true
  }

  // 暂停计时
  function pauseTimer() {
    isRunning.value = false
  }

  // 重置计时
  function resetTimer() {
    isRunning.value = false
    currentTime.value = modeConfig[mode.value] * 60
  }

  // 减少时间
  function tick() {
    if (currentTime.value > 0) {
      currentTime.value--
    }
  }

  return {
    todayStats,
    loading,
    error,
    isRunning,
    currentTime,
    mode,
    currentTodoId,
    modeConfig,
    fetchTodayStats,
    recordPomodoro,
    setMode,
    setCurrentTodo,
    startTimer,
    pauseTimer,
    resetTimer,
    tick
  }
})
