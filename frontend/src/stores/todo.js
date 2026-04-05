import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as todoApi from '../api/todo'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const stats = computed(() => {
    const total = todos.value.length
    const completed = todos.value.filter(t => t.completed).length
    const active = total - completed
    return { total, completed, active }
  })

  const filteredTodos = computed(() => {
    return todos.value.sort((a, b) => {
      // 未完成的排在前面
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      // 按创建时间倒序
      return new Date(b.created_at) - new Date(a.created_at)
    })
  })

  // 获取所有待办
  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const res = await todoApi.getAllTodos()
      if (res.success) {
        todos.value = res.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 添加待办
  async function addTodo(data) {
    try {
      const res = await todoApi.createTodo(data)
      if (res.success) {
        todos.value.unshift(res.data)
        return res.data
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 更新待办
  async function editTodo(id, data) {
    try {
      const res = await todoApi.updateTodo(id, data)
      if (res.success) {
        const index = todos.value.findIndex(t => t.id === id)
        if (index !== -1) {
          todos.value[index] = res.data
        }
        return res.data
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 删除待办
  async function removeTodo(id) {
    try {
      const res = await todoApi.deleteTodo(id)
      if (res.success) {
        todos.value = todos.value.filter(t => t.id !== id)
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 切换完成状态
  async function toggleComplete(id) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      await editTodo(id, { completed: !todo.completed })
    }
  }

  return {
    todos,
    loading,
    error,
    stats,
    filteredTodos,
    fetchTodos,
    addTodo,
    editTodo,
    removeTodo,
    toggleComplete
  }
})
