// app.js
App({
  onLaunch() {
    // 初始化存储
    this.initStorage()
  },

  initStorage() {
    // 初始化待办事项
    const todos = wx.getStorageSync('todos')
    if (!todos) {
      wx.setStorageSync('todos', [])
    }

    // 初始化分类
    const categories = wx.getStorageSync('categories')
    if (!categories) {
      const defaultCategories = [
        { id: 'cat_001', name: '工作', color: '#3498db', icon: 'work' },
        { id: 'cat_002', name: '生活', color: '#2ecc71', icon: 'life' },
        { id: 'cat_003', name: '学习', color: '#9b59b6', icon: 'study' },
        { id: 'cat_004', name: '其他', color: '#95a5a6', icon: 'other' }
      ]
      wx.setStorageSync('categories', defaultCategories)
    }
  },

  globalData: {
    userInfo: null
  }
})
