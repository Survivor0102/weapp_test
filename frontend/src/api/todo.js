import api from './index'

/**
 * 获取所有待办事项
 */
export function getAllTodos() {
  return api.get('/todos')
}

/**
 * 获取单个待办事项
 */
export function getTodo(id) {
  return api.get(`/todos/${id}`)
}

/**
 * 创建待办事项
 */
export function createTodo(data) {
  return api.post('/todos', data)
}

/**
 * 更新待办事项
 */
export function updateTodo(id, data) {
  return api.put(`/todos/${id}`, data)
}

/**
 * 删除待办事项
 */
export function deleteTodo(id) {
  return api.delete(`/todos/${id}`)
}

/**
 * 获取统计信息
 */
export function getStats() {
  return api.get('/todos/stats')
}
