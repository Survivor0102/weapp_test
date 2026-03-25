// utils/cloud.js - 云开发 SDK 封装
const Cloud = {
  // 云函数调用封装
  async callFunction(name, data = {}) {
    try {
      const res = await wx.cloud.callFunction({
        name,
        data
      })
      
      if (res.result && res.result.success) {
        return res.result
      } else {
        throw new Error(res.result?.error || '云函数调用失败')
      }
    } catch (err) {
      console.error(`云函数 ${name} 调用失败:`, err)
      throw err
    }
  },

  // 待办相关
  async getTodos() {
    return await this.callFunction('todo', { action: 'getAll' })
  },

  async addTodo(data) {
    return await this.callFunction('todo', { action: 'add', data })
  },

  async updateTodo(id, data) {
    return await this.callFunction('todo', { action: 'update', id, data })
  },

  async removeTodo(id) {
    return await this.callFunction('todo', { action: 'remove', id })
  },

  // 分类相关
  async getCategories() {
    return await this.callFunction('category', { action: 'getAll' })
  },

  async addCategory(data) {
    return await this.callFunction('category', { action: 'add', data })
  },

  async updateCategory(id, data) {
    return await this.callFunction('category', { action: 'update', id, data })
  },

  async removeCategory(id) {
    return await this.callFunction('category', { action: 'remove', id })
  },

  // 番茄钟相关
  async recordPomodoro(todoId, duration = 25) {
    return await this.callFunction('pomodoro', { 
      action: 'record', 
      todoId, 
      duration 
    })
  },

  async getTodayStats() {
    return await this.callFunction('pomodoro', { action: 'getTodayStats' })
  },

  async getHistoryStats(startDate, endDate) {
    return await this.callFunction('pomodoro', { 
      action: 'getHistoryStats', 
      startDate, 
      endDate 
    })
  }
}

export default Cloud
