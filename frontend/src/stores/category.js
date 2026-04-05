import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as categoryApi from '../api/category'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 获取所有分类
  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const res = await categoryApi.getAllCategories()
      if (res.success) {
        categories.value = res.data
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 添加分类
  async function addCategory(data) {
    try {
      const res = await categoryApi.createCategory(data)
      if (res.success) {
        categories.value.unshift(res.data)
        return res.data
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 更新分类
  async function updateCategory(id, data) {
    try {
      const res = await categoryApi.updateCategory(id, data)
      if (res.success) {
        const index = categories.value.findIndex(c => c.id === id)
        if (index !== -1) {
          categories.value[index] = res.data
        }
        return res.data
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 删除分类
  async function removeCategory(id) {
    try {
      const res = await categoryApi.deleteCategory(id)
      if (res.success) {
        categories.value = categories.value.filter(c => c.id !== id)
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // 根据 ID 获取分类
  function getCategoryById(id) {
    return categories.value.find(c => c.id === id)
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    removeCategory,
    getCategoryById
  }
})
