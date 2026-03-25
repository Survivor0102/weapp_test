// pages/pomodoro/pomodoro.js
import { getAllTodos, updateTodo } from '../../utils/storage'
import { showToast, navigateBack } from '../../utils/util'

Page({
  data: {
    // 番茄钟状态
    isRunning: false,
    isPaused: false,
    currentTime: 25 * 60, // 25 分钟，单位秒
    defaultTime: 25 * 60,
    mode: 'work', // work, shortBreak, longBreak
    timer: null,
    
    // 当前关联的待办
    currentTodo: null,
    showTodoPicker: false,
    todos: [],
    
    // 番茄钟计数
    completedPomodoros: 0,
    todayPomodoros: 0,
    
    // 模式配置
    modes: {
      work: { label: '工作', time: 25 * 60, color: '#e74c3c' },
      shortBreak: { label: '短休息', time: 5 * 60, color: '#2ecc71' },
      longBreak: { label: '长休息', time: 15 * 60, color: '#3498db' }
    }
  },

  onLoad() {
    this.loadTodayStats()
    this.loadTodos()
  },

  onUnload() {
    this.clearTimer()
  },

  /**
   * 加载今日统计
   */
  loadTodayStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.getTime()
    
    const history = wx.getStorageSync('pomodoro_history') || []
    const todayPomodoros = history.filter(record => record >= todayStart).length
    
    this.setData({ todayPomodoros })
  },

  /**
   * 加载待办列表
   */
  loadTodos() {
    const todos = getAllTodos().filter(t => !t.completed)
    this.setData({ todos })
  },

  /**
   * 格式化时间显示
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  },

  /**
   * 切换模式
   */
  onSwitchMode(e) {
    const { mode } = e.currentTarget.dataset
    const modeConfig = this.data.modes[mode]
    
    this.clearTimer()
    this.setData({
      mode,
      currentTime: modeConfig.time,
      isRunning: false,
      isPaused: false
    })
  },

  /**
   * 开始/暂停
   */
  onToggleTimer() {
    const { isRunning, isPaused } = this.data
    
    if (isRunning && !isPaused) {
      // 暂停
      this.pauseTimer()
    } else {
      // 开始
      this.startTimer()
    }
  },

  /**
   * 开始计时
   */
  startTimer() {
    const { currentTime } = this.data
    
    if (currentTime <= 0) {
      return
    }

    this.setData({ isRunning: true, isPaused: false })

    const timer = setInterval(() => {
      this.setData({
        currentTime: this.data.currentTime - 1
      }, () => {
        if (this.data.currentTime <= 0) {
          this.onTimerComplete()
        }
      })
    }, 1000)

    this.setData({ timer })
  },

  /**
   * 暂停计时
   */
  pauseTimer() {
    this.clearTimer()
    this.setData({ isPaused: true })
  },

  /**
   * 清除计时器
   */
  clearTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null, isRunning: false })
    }
  },

  /**
   * 重置
   */
  onReset() {
    this.clearTimer()
    const { mode } = this.data
    const modeConfig = this.data.modes[mode]
    
    this.setData({
      currentTime: modeConfig.time,
      isPaused: false
    })
  },

  /**
   * 计时完成
   */
  onTimerComplete() {
    this.clearTimer()
    
    // 播放提示音
    wx.vibrateShort({ type: 'heavy' })
    
    if (this.data.mode === 'work') {
      // 完成一个番茄钟
      const completedPomodoros = this.data.completedPomodoros + 1
      const todayPomodoros = this.data.todayPomodoros + 1
      
      // 保存记录
      const history = wx.getStorageSync('pomodoro_history') || []
      history.push(Date.now())
      wx.setStorageSync('pomodoro_history', history)
      
      this.setData({
        completedPomodoros,
        todayPomodoros
      })

      // 更新关联待办的专注时间
      if (this.data.currentTodo) {
        const todo = this.data.todos.find(t => t.id === this.data.currentTodo)
        if (todo) {
          const focusTime = (todo.focusTime || 0) + 25
          updateTodo(todo.id, { focusTime })
        }
      }

      wx.showModal({
        title: '🎉 番茄钟完成！',
        content: '恭喜你完成了一个番茄钟，休息一下吧~',
        confirmText: '开始休息',
        success: (res) => {
          if (res.confirm) {
            // 自动切换到休息时间
            const nextMode = completedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak'
            this.onSwitchMode({ currentTarget: { dataset: { mode: nextMode } } })
          }
        }
      })
    } else {
      // 休息结束
      wx.showModal({
        title: '⏰ 休息结束',
        content: '准备好开始下一个番茄钟了吗？',
        confirmText: '开始工作',
        success: (res) => {
          if (res.confirm) {
            this.onSwitchMode({ currentTarget: { dataset: { mode: 'work' } } })
          }
        }
      })
    }
  },

  /**
   * 选择关联待办
   */
  onSelectTodo() {
    this.setData({ showTodoPicker: true })
  },

  /**
   * 选择待办
   */
  onTodoSelect(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      currentTodo: id,
      showTodoPicker: false
    })
    showToast('已关联待办')
  },

  /**
   * 取消关联
   */
  onUnlinkTodo() {
    this.setData({ currentTodo: null })
    showToast('已取消关联')
  },

  /**
   * 关闭待办选择器
   */
  onClosePicker() {
    this.setData({ showTodoPicker: false })
  },

  /**
   * 获取当前模式颜色
   */
  getCurrentColor() {
    const { mode, modes } = this.data
    return modes[mode].color
  },

  /**
   * 获取当前模式标签
   */
  getCurrentLabel() {
    const { mode, modes } = this.data
    return modes[mode].label
  },

  /**
   * 获取待办标题
   */
  getTodoTitle(todoId) {
    const todo = this.data.todos.find(t => t.id === todoId)
    return todo ? todo.title : '未命名'
  }
})
