// utils/storage.js - 本地存储封装
const TODO_KEY = 'todos'
const CATEGORY_KEY = 'categories'

/**
 * 获取所有待办
 */
export function getAllTodos() {
  return wx.getStorageSync(TODO_KEY) || []
}

/**
 * 保存所有待办
 */
export function saveAllTodos(todos) {
  wx.setStorageSync(TODO_KEY, todos)
}

/**
 * 添加待办
 */
export function addTodo(todo) {
  const todos = getAllTodos()
  todos.unshift(todo)
  saveAllTodos(todos)
  return todos
}

/**
 * 更新待办
 */
export function updateTodo(id, updates) {
  const todos = getAllTodos()
  const index = todos.findIndex(t => t.id === id)
  if (index !== -1) {
    todos[index] = {
      ...todos[index],
      ...updates,
      updatedAt: Date.now()
    }
    saveAllTodos(todos)
  }
  return todos
}

/**
 * 删除待办
 */
export function deleteTodo(id) {
  const todos = getAllTodos()
  const filtered = todos.filter(t => t.id !== id)
  saveAllTodos(filtered)
  return filtered
}

/**
 * 获取待办 by ID
 */
export function getTodoById(id) {
  const todos = getAllTodos()
  return todos.find(t => t.id === id)
}

/**
 * 获取所有分类
 */
export function getAllCategories() {
  return wx.getStorageSync(CATEGORY_KEY) || []
}

/**
 * 保存所有分类
 */
export function saveAllCategories(categories) {
  wx.setStorageSync(CATEGORY_KEY, categories)
}

/**
 * 添加分类
 */
export function addCategory(category) {
  const categories = getAllCategories()
  categories.push(category)
  saveAllCategories(categories)
  return categories
}

/**
 * 更新分类
 */
export function updateCategory(id, updates) {
  const categories = getAllCategories()
  const index = categories.findIndex(c => c.id === id)
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates }
    saveAllCategories(categories)
  }
  return categories
}

/**
 * 删除分类
 */
export function deleteCategory(id) {
  const categories = getAllCategories()
  const filtered = categories.filter(c => c.id !== id)
  saveAllCategories(filtered)
  return filtered
}

/**
 * 生成唯一 ID
 */
export function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}
