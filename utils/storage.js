// utils/storage.js - 存储工具（支持本地和云端双模式）
import Cloud from './cloud'

// 是否启用云开发模式
const USE_CLOUD = false  // 暂时使用本地存储，云开发配置完成后改为 true

/**
 * 获取所有待办
 */
export async function getAllTodos() {
  if (USE_CLOUD) {
    try {
      const res = await Cloud.getTodos()
      return res.data || []
    } catch (err) {
      console.error('云端获取失败，使用本地数据')
      return wx.getStorageSync('todos') || []
    }
  } else {
    return wx.getStorageSync('todos') || []
  }
}

/**
 * 保存所有待办
 */
export function saveAllTodos(todos) {
  wx.setStorageSync('todos', todos)
}

/**
 * 添加待办
 */
export async function addTodo(todo) {
  if (USE_CLOUD) {
    try {
      const res = await Cloud.addTodo(todo)
      return getAllTodos() // 重新获取最新数据
    } catch (err) {
      console.error('云端添加失败，使用本地存储')
    }
  }
  
  // 本地存储降级方案
  const todos = wx.getStorageSync('todos') || []
  todos.unshift(todo)
  wx.setStorageSync('todos', todos)
  return todos
}

/**
 * 更新待办
 */
export async function updateTodo(id, updates) {
  if (USE_CLOUD) {
    try {
      await Cloud.updateTodo(id, updates)
      return getAllTodos()
    } catch (err) {
      console.error('云端更新失败，使用本地存储')
    }
  }
  
  // 本地存储降级方案
  const todos = wx.getStorageSync('todos') || []
  const index = todos.findIndex(t => t.id === id)
  if (index !== -1) {
    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: Date.now()
    }
    wx.setStorageSync('todos', todos)
  }
  return todos
}

/**
 * 删除待办
 */
export async function deleteTodo(id) {
  if (USE_CLOUD) {
    try {
      await Cloud.removeTodo(id)
      return getAllTodos()
    } catch (err) {
      console.error('云端删除失败，使用本地存储')
    }
  }
  
  // 本地存储降级方案
  const todos = wx.getStorageSync('todos') || []
  const filtered = todos.filter(t => t.id !== id)
  wx.setStorageSync('todos', filtered)
  return filtered
}

/**
 * 获取待办 by ID
 */
export function getTodoById(id) {
  const todos = wx.getStorageSync('todos') || []
  return todos.find(t => t.id === id)
}

/**
 * 获取所有分类
 */
export async function getAllCategories() {
  if (USE_CLOUD) {
    try {
      const res = await Cloud.getCategories()
      return res.data || []
    } catch (err) {
      console.error('云端获取失败，使用本地数据')
      return wx.getStorageSync('categories') || []
    }
  } else {
    return wx.getStorageSync('categories') || []
  }
}

/**
 * 保存所有分类
 */
export function saveAllCategories(categories) {
  wx.setStorageSync('categories', categories)
}

/**
 * 添加分类
 */
export async function addCategory(category) {
  if (USE_CLOUD) {
    try {
      await Cloud.addCategory(category)
      return getAllCategories()
    } catch (err) {
      console.error('云端添加失败，使用本地存储')
    }
  }
  
  const categories = wx.getStorageSync('categories') || []
  categories.push(category)
  wx.setStorageSync('categories', categories)
  return categories
}

/**
 * 更新分类
 */
export async function updateCategory(id, updates) {
  if (USE_CLOUD) {
    try {
      await Cloud.updateCategory(id, updates)
      return getAllCategories()
    } catch (err) {
      console.error('云端更新失败，使用本地存储')
    }
  }
  
  const categories = wx.getStorageSync('categories') || []
  const index = categories.findIndex(c => c.id === id)
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates }
    wx.setStorageSync('categories', categories)
  }
  return categories
}

/**
 * 删除分类
 */
export async function deleteCategory(id) {
  if (USE_CLOUD) {
    try {
      await Cloud.removeCategory(id)
      return getAllCategories()
    } catch (err) {
      console.error('云端删除失败，使用本地存储')
    }
  }
  
  const categories = wx.getStorageSync('categories') || []
  const filtered = categories.filter(c => c.id !== id)
  wx.setStorageSync('categories', filtered)
  return filtered
}

/**
 * 生成唯一 ID
 */
export function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 记录番茄钟
 */
export async function recordPomodoro(todoId, duration = 25) {
  if (USE_CLOUD) {
    try {
      await Cloud.recordPomodoro(todoId, duration)
      return { success: true }
    } catch (err) {
      console.error('云端记录失败')
      return { success: false, error: err.message }
    }
  }
  
  // 本地存储降级方案
  const history = wx.getStorageSync('pomodoro_history') || []
  history.push({
    todoId,
    duration,
    timestamp: Date.now()
  })
  wx.setStorageSync('pomodoro_history', history)
  return { success: true }
}

/**
 * 获取今日统计
 */
export async function getTodayStats() {
  if (USE_CLOUD) {
    try {
      const res = await Cloud.getTodayStats()
      return res.data
    } catch (err) {
      console.error('云端统计失败')
    }
  }
  
  // 本地统计
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStart = today.getTime()
  
  const history = wx.getStorageSync('pomodoro_history') || []
  const todayRecords = history.filter(r => r.timestamp >= todayStart)
  
  return {
    count: todayRecords.length,
    totalMinutes: todayRecords.reduce((sum, r) => sum + r.duration, 0)
  }
}
